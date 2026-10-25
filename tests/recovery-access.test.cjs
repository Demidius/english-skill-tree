const {test,before,after,beforeEach}=require('node:test');
const {readFileSync}=require('node:fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,serverTimestamp,setLogLevel}=require('firebase/firestore');
setLogLevel('silent');
let env;
const db=uid=>uid?env.authenticatedContext(uid).firestore():env.unauthenticatedContext().firestore();
const seed=(path,v)=>env.withSecurityRulesDisabled(c=>setDoc(doc(c.firestore(),path),v));
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-skill-tree',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});});
after(async()=>{await env.cleanup();});
beforeEach(async()=>{
  await env.clearFirestore();
  for(const [uid,name] of [['alice','Alice'],['bob','Bob'],['demid','Demid']])await seed('profiles/'+uid,{name,visibility:'public',createdAt:1});
  await seed('profiles/alice/friends/bob',{inviteId:'x',createdAt:1});await seed('profiles/bob/friends/alice',{inviteId:'x',createdAt:1});
  await seed('accessAdmins/demid',{name:'Demid'});
  await seed('accountPrivate/alice',{email:'alice@example.com',emailOptOut:false});
});
test('recovery email is visible only to its owner and the admin, not to friends or public viewers',async()=>{
  await assertSucceeds(getDoc(doc(db('alice'),'accountPrivate/alice')));
  await assertSucceeds(getDoc(doc(db('demid'),'accountPrivate/alice')));
  for(const who of ['bob',null,'eve'])await assertFails(getDoc(doc(db(who),'accountPrivate/alice')));
  await assertFails(getDocs(collection(db('alice'),'accountPrivate')));
  await assertSucceeds(getDocs(collection(db('demid'),'accountPrivate')));
});
test('clients cannot write the address, even the admin; owner may only opt out',async()=>{
  await assertFails(updateDoc(doc(db('alice'),'accountPrivate/alice'),{email:'evil@example.com'}));
  await assertFails(setDoc(doc(db('bob'),'accountPrivate/bob'),{email:'bob@example.com'}));
  await assertFails(updateDoc(doc(db('demid'),'accountPrivate/alice'),{email:'x@example.com'}));
  await assertFails(setDoc(doc(db('bob'),'accountPrivate/alice'),{emailOptOut:true,optOutAt:serverTimestamp()}));
  await assertFails(setDoc(doc(db('bob'),'accountPrivate/bob'),{emailOptOut:'yes',optOutAt:serverTimestamp()}));
  await assertSucceeds(setDoc(doc(db('bob'),'accountPrivate/bob'),{emailOptOut:true,optOutAt:serverTimestamp()}));
  await assertSucceeds(updateDoc(doc(db('alice'),'accountPrivate/alice'),{emailOptOut:true,optOutAt:serverTimestamp()}));
  await assertFails(deleteDoc(doc(db('alice'),'accountPrivate/alice')));
});
test('server-only rate-limit records stay closed',async()=>{
  for(const who of ['alice','demid',null])await assertFails(getDoc(doc(db(who),'mailLimits/abc')));
  await assertFails(setDoc(doc(db('alice'),'mailLimits/abc'),{hits:[]}));
});
