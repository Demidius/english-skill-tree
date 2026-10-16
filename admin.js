/* Unlinked administration page. Every read/write is independently checked by Firestore. */
(() => {
  const $=id=>document.getElementById(id), {auth,db}=SkillFirebase.init();
  let authorized=false, roleStop=null, collection='profiles', last=null, docPath='', baseline=null, loading=false, generation=0;
  function encode(v){
    if(v instanceof firebase.firestore.Timestamp) return {__type:'timestamp',seconds:v.seconds,nanoseconds:v.nanoseconds};
    if(Array.isArray(v)) return v.map(encode);
    if(v && typeof v==='object') return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,encode(x)]));
    return v;
  }
  function decode(v){
    if(Array.isArray(v)) return v.map(decode);
    if(v && typeof v==='object'){
      if(v.__type==='timestamp') return new firebase.firestore.Timestamp(v.seconds,v.nanoseconds);
      return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,decode(x)]));
    }
    return v;
  }
  function json(v){return JSON.stringify(encode(v),null,2);}
  function error(e){return e.code==='permission-denied'?'Нет доступа к этим данным.':'Не удалось выполнить действие. '+(e.message||'Проверь соединение.');}
  function clear(){generation++;authorized=false;docPath='';baseline=null;$('adminData').hidden=true;$('adminList').replaceChildren();$('adminEditor').hidden=true;$('adminJson').value='';$('adminDiff').textContent='';}
  auth.onAuthStateChanged(user=>{
    if(roleStop) roleStop();clear();$('adminLogout').hidden=!user;$('adminLogin').hidden=!!user;
    if(!user){$('adminStatus').textContent='Войди в свой аккаунт.';return;}
    $('adminStatus').textContent='Проверяю права аккаунта…';
    roleStop=db.doc('accessAdmins/'+user.uid).onSnapshot(s=>{
      if(!s.exists){clear();$('adminStatus').textContent='У этого аккаунта нет прав администратора. Доступ к данным закрыт.';return;}
      if(authorized)return;authorized=true;$('adminData').hidden=false;$('adminStatus').textContent='Администратор · '+(user.email||user.uid);load('profiles');
    },()=>{clear();$('adminStatus').textContent='Не удалось проверить права. Доступ закрыт.';});
  });
  $('adminLogin').onsubmit=async e=>{
    e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;
    try{await auth.signInWithEmailAndPassword(SkillFirebase.nickToEmail($('adminNick').value),$('adminPass').value);$('adminPass').value='';}
    catch{$('adminStatus').textContent='Не удалось войти. Проверь ник и пароль.';}finally{b.disabled=false;}
  };
  $('adminLogout').onclick=()=>auth.signOut();
  async function load(path,more=false){
    if(!authorized||loading)return;loading=true;const gen=generation;
    if(!more){collection=path;last=null;$('adminList').replaceChildren();$('adminListTitle').textContent=path;}
    try{
      let q=db.collection(path).orderBy(firebase.firestore.FieldPath.documentId()).limit(50);if(more&&last)q=q.startAfter(last);
      const snap=await q.get({source:'server'});if(!authorized||gen!==generation)return;
      if(!snap.size&&!more)$('adminList').textContent='Документов пока нет.';
      for(const d of snap.docs){const b=document.createElement('button');b.type='button';b.textContent=(d.data().name?d.data().name+' · ':'')+d.id;b.onclick=()=>open(d.ref.path);$('adminList').append(b);}
      last=snap.docs.at(-1)||last;$('adminMore').hidden=snap.size<50;
    }catch(e){if(gen===generation)$('adminStatus').textContent=error(e);}finally{loading=false;}
  }
  async function open(path){
    if(!authorized)return;
    if(docPath&&$('adminJson').value!==baseline&&!confirm('Оставить несохранённые правки и открыть другой документ?'))return;
    const gen=generation;
    try{
      const s=await db.doc(path).get({source:'server'});if(!authorized||gen!==generation)return;
      if(!s.exists)throw Error('Документ уже удалён.');
      docPath=path;baseline=json(s.data());$('adminJson').value=baseline;$('adminDocTitle').textContent=path;$('adminEditor').hidden=false;$('adminDiff').hidden=true;$('adminEditStatus').textContent='';
      const readonly=path.startsWith('accessAdmins/');$('adminJson').readOnly=readonly;$('adminSave').disabled=readonly;$('adminPreview').disabled=readonly;
      $('adminSubcollections').replaceChildren();
      if(/^profiles\/[^/]+$/.test(path))for(const [kind,label]of Object.entries({progress:'Грамматика',cards:'Слова',tests:'Тесты',friends:'Друзья'})){
        const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=label;b.onclick=()=>load(path+'/'+kind);$('adminSubcollections').append(b);
      }
    }catch(e){if(gen===generation)$('adminEditStatus').textContent=error(e);}
  }
  function edited(){const v=JSON.parse($('adminJson').value);if(!v||Array.isArray(v)||typeof v!=='object')throw Error('Нужен JSON-объект.');return decode(v);}
  function preview(){const next=json(edited());$('adminDiff').textContent='БЫЛО\n'+baseline+'\n\nСТАНЕТ\n'+next;$('adminDiff').hidden=false;return next;}
  $('adminPreview').onclick=()=>{try{preview();$('adminEditStatus').textContent='Проверь изменения перед сохранением.';}catch(e){$('adminEditStatus').textContent=error(e);}};
  $('adminCancel').onclick=()=>{$('adminJson').value=baseline;$('adminDiff').hidden=true;$('adminEditStatus').textContent='Правки сброшены.';};
  $('adminSave').onclick=async()=>{
    if(!authorized||!docPath||docPath.startsWith('accessAdmins/'))return;
    try{
      const data=edited(),next=preview(),path=docPath,was=baseline,gen=generation;
      if(next===was){$('adminEditStatus').textContent='Нет изменений.';return;}
      if(!confirm('Сохранить изменения в '+path+'? Они повлияют на данные сайта.'))return;
      $('adminSave').disabled=true;
      await db.runTransaction(async tx=>{const s=await tx.get(db.doc(path));if(!s.exists||json(s.data())!==was)throw Error('Данные изменились после открытия. Обнови документ и повтори правку.');tx.set(db.doc(path),data);});
      if(authorized&&gen===generation){baseline=next;$('adminJson').value=next;$('adminEditStatus').textContent='Сохранено.';$('adminDiff').hidden=true;}
    }catch(e){$('adminEditStatus').textContent=error(e);}finally{$('adminSave').disabled=!authorized||docPath.startsWith('accessAdmins/');}
  };
  $('adminCollection').onchange=e=>load(e.target.value);$('adminReload').onclick=()=>load(collection);$('adminMore').onclick=()=>load(collection,true);
  window.addEventListener('beforeunload',e=>{if(authorized&&docPath&&$('adminJson').value!==baseline){e.preventDefault();e.returnValue='';}});
})();
