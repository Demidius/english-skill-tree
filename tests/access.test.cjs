const {test,before,after,beforeEach}=require('node:test');
const {readFileSync}=require('node:fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,writeBatch,serverTimestamp,Timestamp,query,where,setLogLevel}=require('firebase/firestore');
setLogLevel('silent');
let env; const clients=new Map();
const token='a'.repeat(32),owner='alice',peer='bob';
const db=uid=>{if(!clients.has(uid))clients.set(uid,uid?env.authenticatedContext(uid).firestore():env.unauthenticatedContext().firestore());return clients.get(uid);};
async function seed(path,v){await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),path),v));}
function invite(overrides={}){return {ownerId:owner,ownerName:'Alice',status:'open',createdAt:Timestamp.now(),expiresAt:Timestamp.fromMillis(Date.now()+86400000),...overrides};}
function accept(client,code=token,who=peer){const batch=writeBatch(client);batch.update(doc(client,'friendInvites/'+code),{status:'accepted',acceptedBy:who,acceptedAt:serverTimestamp()});const edge={inviteId:code,createdAt:serverTimestamp()};batch.set(doc(client,'profiles/alice/friends/'+who),edge);batch.set(doc(client,'profiles/'+who+'/friends/alice'),edge);return batch.commit();}
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-skill-tree',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});});
after(async()=>{await env.cleanup();});
beforeEach(async()=>{clients.clear();await env.clearFirestore();for(const [uid,name]of [['alice','Alice'],['bob','Bob'],['demid','Demid']]){await seed('profiles/'+uid,{name,visibility:'private',createdAt:1});for(const col of ['progress','cards','tests'])await seed('profiles/'+uid+'/'+col+'/topic',{lv:3});}await seed('accessAdmins/demid',{name:'Demid'});await seed('system/access',{version:1});});
test('owner can read/write own progress and profile; existing missing visibility is private',async()=>{
  await assertSucceeds(getDoc(doc(db(owner),'profiles/alice')));await assertSucceeds(updateDoc(doc(db(owner),'profiles/alice/progress/topic'),{lv:4}));
  await seed('profiles/legacy',{name:'Legacy'});await assertFails(getDoc(doc(db(peer),'profiles/legacy')));
});
test('stranger and anonymous cannot read a private profile or any progress subcollection',async()=>{
  for(const who of [peer,null])for(const path of ['profiles/alice','profiles/alice/progress/topic','profiles/alice/cards/topic','profiles/alice/tests/topic'])await assertFails(getDoc(doc(db(who),path)));
  await assertFails(getDocs(collection(db(peer),'profiles/alice/progress')));
});
test('no non-admin private directory or unfiltered invitation listing',async()=>{
  await assertFails(getDocs(collection(db(owner),'profiles')));await assertFails(getDocs(collection(db(null),'profiles')));
  await seed('friendInvites/'+token,invite());await assertFails(getDocs(collection(db(peer),'friendInvites')));
  await assertSucceeds(getDocs(query(collection(db(owner),'friendInvites'),where('ownerId','==',owner))));
});
test('public link allows anonymous read, never changes, and closing visibility revokes it',async()=>{
  await assertSucceeds(updateDoc(doc(db(owner),'profiles/alice'),{visibility:'public'}));
  for(const who of [null,peer])for(const col of ['progress','tests','cards'])await assertSucceeds(getDocs(collection(db(who),'profiles/alice/'+col)));
  await assertSucceeds(getDoc(doc(db(null),'profiles/alice')));
  await assertFails(updateDoc(doc(db(peer),'profiles/alice/progress/topic'),{lv:10}));
  await assertFails(setDoc(doc(db(null),'profiles/alice/cards/new'),{lv:5}));
  await updateDoc(doc(db(owner),'profiles/alice'),{visibility:'private'});await assertFails(getDoc(doc(db(null),'profiles/alice')));
});
test('new profile defaults explicitly private and owner cannot set roles or protected fields',async()=>{
  await assertSucceeds(setDoc(doc(db('new'),'profiles/new'),{name:'New',visibility:'private',createdAt:1}));
  await assertFails(setDoc(doc(db('fake'),'profiles/fake'),{name:'Demid',visibility:'private',admin:true}));
  await assertFails(updateDoc(doc(db(owner),'profiles/alice'),{role:'admin'}));
  await assertFails(updateDoc(doc(db(owner),'profiles/alice'),{visibility:'friends'}));
  await assertFails(deleteDoc(doc(db(owner),'profiles/alice')));
});
test('owner creates random one-use invite with bounded expiration; no anonymous creation',async()=>{
  const v=invite({createdAt:serverTimestamp()});await assertSucceeds(setDoc(doc(db(owner),'friendInvites/'+token),v));
  await assertSucceeds(getDoc(doc(db(peer),'friendInvites/'+token)));await assertFails(getDoc(doc(db(null),'friendInvites/'+token)));
  await assertFails(setDoc(doc(db(peer),'friendInvites/'+'b'.repeat(32)),v));
  await assertFails(setDoc(doc(db(owner),'friendInvites/guessable'),v));
  await assertFails(setDoc(doc(db(owner),'friendInvites/'+'c'.repeat(32)),{...v,expiresAt:Timestamp.fromMillis(Date.now()+8*86400000)}));
});
test('atomic acceptance grants reciprocal READ access to all progress, never writes or settings',async()=>{
  await seed('friendInvites/'+token,invite());await assertSucceeds(accept(db(peer)));
  for(const [a,b]of [[owner,peer],[peer,owner]]){
    await assertSucceeds(getDoc(doc(db(a),'profiles/'+b)));
    for(const col of ['progress','tests','cards']){await assertSucceeds(getDocs(collection(db(a),'profiles/'+b+'/'+col)));await assertFails(updateDoc(doc(db(a),'profiles/'+b+'/'+col+'/topic'),{lv:10}));}
    await assertFails(updateDoc(doc(db(a),'profiles/'+b),{name:'Hacked',visibility:'public'}));
    await assertFails(setDoc(doc(db(a),'settings/coef'),{x:1}));
  }
  await assertFails(getDoc(doc(db('eve'),'profiles/alice')));
});
test('cannot accept without both edges, forge a friend edge, or accept your own invitation',async()=>{
  await seed('friendInvites/'+token,invite());
  await assertFails(updateDoc(doc(db(peer),'friendInvites/'+token),{status:'accepted',acceptedBy:peer,acceptedAt:serverTimestamp()}));
  await assertFails(setDoc(doc(db(peer),'profiles/alice/friends/bob'),{inviteId:token,createdAt:serverTimestamp()}));
  await assertFails(accept(db(owner),token,owner));
  const b=writeBatch(db(peer));b.update(doc(db(peer),'friendInvites/'+token),{status:'accepted',acceptedBy:peer,acceptedAt:serverTimestamp()});b.set(doc(db(peer),'profiles/alice/friends/bob'),{inviteId:token,createdAt:serverTimestamp()});await assertFails(b.commit());
});
test('accepted codes cannot be replayed to add another participant or restore revoked access',async()=>{
  await seed('friendInvites/'+token,invite());await accept(db(peer));await assertFails(accept(db('eve'),token,'eve'));
  const c=db(owner),b=writeBatch(c);b.delete(doc(c,'profiles/alice/friends/bob'));b.delete(doc(c,'profiles/bob/friends/alice'));await b.commit();
  await assertFails(accept(db(peer)));await assertFails(getDoc(doc(db(peer),'profiles/alice')));
});
test('either friend revokes both directions together, no one-sided removal',async()=>{
  await seed('friendInvites/'+token,invite());await accept(db(peer));
  await assertFails(deleteDoc(doc(db(peer),'profiles/bob/friends/alice')));
  const b=writeBatch(db(peer));b.delete(doc(db(peer),'profiles/bob/friends/alice'));b.delete(doc(db(peer),'profiles/alice/friends/bob'));await assertSucceeds(b.commit());
  await assertFails(getDoc(doc(db(owner),'profiles/bob')));await assertFails(getDoc(doc(db(peer),'profiles/alice')));
});
test('expired/revoked invitations and tampering with owner cannot grant access',async()=>{
  await seed('friendInvites/'+token,invite({expiresAt:Timestamp.fromMillis(Date.now()-1000)}));await assertFails(getDoc(doc(db(peer),'friendInvites/'+token)));await assertFails(accept(db(peer)));
  await seed('friendInvites/'+token,invite());await assertSucceeds(updateDoc(doc(db(owner),'friendInvites/'+token),{status:'revoked'}));await assertFails(accept(db(peer)));
  await seed('friendInvites/'+token,invite());await assertFails(updateDoc(doc(db(peer),'friendInvites/'+token),{ownerId:peer}));
});
test('admin can list/edit all application data, cannot be impersonated by name or grant client-side roles',async()=>{
  await assertSucceeds(getDocs(collection(db('demid'),'profiles')));await assertSucceeds(updateDoc(doc(db('demid'),'profiles/alice/progress/topic'),{lv:7}));
  await assertSucceeds(setDoc(doc(db('demid'),'settings/coef'),{ok:1}));await assertSucceeds(getDocs(collection(db('demid'),'accessAdmins')));
  await updateDoc(doc(db(peer),'profiles/bob'),{name:'Demid'});await assertFails(getDocs(collection(db(peer),'profiles')));
  for(const uid of ['bob','demid'])await assertFails(setDoc(doc(db(uid),'accessAdmins/bob'),{name:'Demid'}));
  await assertFails(setDoc(doc(db(peer),'system/access'),{version:1}));
  await assertFails(getDoc(doc(db(peer),'accessAdmins/demid')));
});
test('unknown collections and nested document paths remain closed',async()=>{
  await assertFails(setDoc(doc(db(owner),'profiles/alice/secrets/role'),{admin:true}));
  await assertFails(setDoc(doc(db(owner),'anything/secret'),{admin:true}));
  await assertFails(setDoc(doc(db(peer),'profiles/alice/progress/topic/nested/doc'),{lv:10}));
});
test('a race to accept one invite authorizes exactly one recipient',async()=>{
  await seed('friendInvites/'+token,invite());
  const results=await Promise.allSettled([accept(db(peer)),accept(db('eve'),token,'eve')]);
  if(results.filter(r=>r.status==='fulfilled').length!==1)throw Error('Expected one successful recipient');
  const winner=results[0].status==='fulfilled'?peer:'eve',loser=winner===peer?'eve':peer;
  await assertSucceeds(getDoc(doc(db(winner),'profiles/alice')));await assertFails(getDoc(doc(db(loser),'profiles/alice')));
});
test('removing an administrator role immediately denies subsequent data access and edits',async()=>{
  await env.withSecurityRulesDisabled(async c=>deleteDoc(doc(c.firestore(),'accessAdmins/demid')));
  await assertFails(getDocs(collection(db('demid'),'profiles')));
  await assertFails(updateDoc(doc(db('demid'),'profiles/alice/progress/topic'),{lv:9}));
  await assertFails(getDoc(doc(db('demid'),'profiles/alice')));
});


function cardReport(overrides={}) {
  return {
    kind:'word',topicId:'efa1-2a-2',wordKey:'what-s-that',
    english:"What's that?",russian:'Что это? (предмет далеко)',
    topicTitle:'Words and phrases',source:'A1 · 2A',
    message:'',reporterUid:'alice',reporterName:'Alice',
    status:'new',createdAt:serverTimestamp(),...overrides
  };
}
test('card reports accept empty descriptions and record authenticated authors and server times',async()=>{
  const id='r'.repeat(20),path='cardReports/'+id;
  await assertSucceeds(setDoc(doc(db(owner),path),cardReport()));
  await assertFails(getDoc(doc(db(owner),path)));
  await assertFails(getDoc(doc(db(peer),path)));
  await assertFails(getDocs(collection(db(peer),'cardReports')));
  await assertSucceeds(getDocs(collection(db('demid'),'cardReports')));
  await assertSucceeds(getDoc(doc(db('demid'),path)));
  await assertFails(updateDoc(doc(db(owner),path),{status:'fixed'}));
  await assertFails(deleteDoc(doc(db(owner),path)));
});
test('card reports cannot impersonate another user or spoof creation timestamp',async()=>{
  await assertFails(setDoc(doc(db(owner),'cardReports/'+'x'.repeat(20)),cardReport({reporterUid:'bob'})));
  await assertFails(setDoc(doc(db(owner),'cardReports/'+'y'.repeat(20)),cardReport({reporterName:'Bob'})));
  await assertFails(setDoc(doc(db(owner),'cardReports/'+'z'.repeat(20)),cardReport({createdAt:Timestamp.now()})));
  await assertFails(setDoc(doc(db(owner),'cardReports/'+'a'.repeat(20)),cardReport({adminNote:'injected'})));
  await assertFails(setDoc(doc(db(null),'cardReports/'+'b'.repeat(20)),cardReport()));
});
test('admin can update only report review fields, while original report stays immutable',async()=>{
  const path='cardReports/'+'q'.repeat(20);
  await assertSucceeds(setDoc(doc(db(owner),path),cardReport({message:'Неверная подсказка'})));
  await assertSucceeds(updateDoc(doc(db('demid'),path),{
    status:'fixed',adminNote:'Исправлен перевод',reviewedBy:'demid',reviewedAt:serverTimestamp()
  }));
  await assertFails(updateDoc(doc(db('demid'),path),{
    status:'dismissed',adminNote:'',reviewedBy:'alice',reviewedAt:serverTimestamp()
  }));
  await assertFails(updateDoc(doc(db('demid'),path),{message:'Удалить жалобу'}));
  await assertFails(updateDoc(doc(db(peer),path),{status:'dismissed'}));
});
