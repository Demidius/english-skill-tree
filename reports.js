/* Admin-only report inbox. Firestore security rules enforce access on every operation. */
(() => {
  const $=id=>document.getElementById(id);
  const {auth,db}=SkillFirebase.init();
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let user=null,authorized=false,stopRole=null,rows=[],last=null,more=false,loading=false,epoch=0;
  const statusNames={new:'Новая',in_progress:'В работе',fixed:'Исправлена',dismissed:'Отклонена'};
  function instant(v){return v&&typeof v.toMillis==='function'?v.toMillis():0;}
  function date(v){return v?new Date(instant(v)).toLocaleString('ru-RU'):'время не указано';}
  function reset(){
    authorized=false;rows=[];last=null;more=false;epoch++;
    $('reportWorkspace').hidden=true;$('reportGroups').replaceChildren();$('reportCount').textContent='';
  }
  auth.onAuthStateChanged(u=>{
    if(stopRole){stopRole();stopRole=null;}
    reset();user=u;
    $('reportLogin').hidden=!!u;$('reportLogout').hidden=!u;
    if(!u){$('reportAccessStatus').textContent='Войди в свой аккаунт администратора.';return;}
    $('reportAccessStatus').textContent='Проверяю права администратора…';
    stopRole=db.doc('accessAdmins/'+u.uid).onSnapshot(s=>{
      if(!s.exists){reset();$('reportAccessStatus').textContent='У этого аккаунта нет доступа к жалобам.';return;}
      if(authorized)return;
      authorized=true;$('reportWorkspace').hidden=false;
      $('reportAccessStatus').textContent='Администратор: '+(u.email||u.uid);
      load(false);
    },()=>{reset();$('reportAccessStatus').textContent='Не удалось проверить права. Доступ закрыт.';});
  });
  $('reportLogin').onsubmit=async e=>{
    e.preventDefault();const btn=e.target.querySelector('button');btn.disabled=true;
    try{
      await auth.signInWithEmailAndPassword(SkillFirebase.nickToEmail($('reportNick').value),$('reportPass').value);
      $('reportPass').value='';
    }catch(err){$('reportAccessStatus').textContent='Не удалось войти. Проверь ник и пароль.';}
    finally{btn.disabled=false;}
  };
  $('reportLogout').onclick=()=>auth.signOut();
  async function load(append){
    if(!authorized||loading)return;
    const started=epoch;loading=true;$('reportRefresh').disabled=true;
    $('reportCount').textContent='Загружаю жалобы…';
    try{
      let q=db.collection('cardReports').orderBy('createdAt','desc').limit(200);
      if(append&&last)q=q.startAfter(last);
      const snap=await q.get({source:'server'});
      if(!authorized||epoch!==started)return;
      if(!append)rows=[];
      const existing=new Set(rows.map(x=>x.id));
      for(const d of snap.docs)if(!existing.has(d.id))rows.push({id:d.id,...d.data()});
      last=snap.docs[snap.docs.length-1]||last;
      more=snap.size===200;
      render();
    }catch(err){
      if(epoch===started)$('reportCount').textContent=err.code==='permission-denied'?'Нет доступа к коллекции жалоб. Проверь публикацию правил Firestore.':'Не удалось загрузить жалобы. Проверь интернет.';
    }finally{loading=false;$('reportRefresh').disabled=false;}
  }
  function visible(){
    const status=$('reportFilter').value,period=$('reportPeriod').value;
    const cutoff=period==='all'?0:Date.now()-Number(period)*86400000;
    return rows.filter(r=>(status==='all'||(status==='open'?r.status==='new'||r.status==='in_progress':r.status===status))&&instant(r.createdAt)>=cutoff);
  }
  function groups(rows){
    const map=new Map();
    rows.forEach(r=>{
      const k=r.kind+'|'+r.topicId+'|'+r.wordKey;
      if(!map.has(k))map.set(k,[]);
      map.get(k).push(r);
    });
    return [...map.values()].sort((a,b)=>instant(b[0].createdAt)-instant(a[0].createdAt));
  }
  function render(){
    const list=visible(),clustered=groups(list);
    $('reportMore').hidden=!more;
    $('reportCount').textContent='Загружено: '+rows.length+' · по фильтру: '+list.length+' жалоб на '+clustered.length+' карточек'+
      (more?' · доступны ещё записи (нажми «Загрузить ещё» для полной выгрузки)':'');
    $('reportGroups').innerHTML=clustered.map(group=>{
      const first=group[0];
      const wordTitle=first.english||first.topicTitle||first.topicId;
      return '<section class="report-group"><h2>'+esc(wordTitle)+' <span class="report-tag">'+group.length+' жалоб</span></h2>'+
        '<p class="report-sub">'+(first.kind==='rule'?'Правило':'Слово')+' · '+esc(first.topicTitle)+' · ID: '+esc(first.topicId)+
        (first.wordKey?' / '+esc(first.wordKey):'')+(first.source?' · '+esc(first.source):'')+'</p>'+
        (first.russian?'<p>Русский вариант: '+esc(first.russian)+'</p>':'')+
        group.map(r=>'<article class="report-item" data-report-id="'+esc(r.id)+'">'+
          '<p class="report-meta">'+esc(date(r.createdAt))+' · '+esc(r.reporterName)+' · UID: '+esc(r.reporterUid)+' · '+esc(statusNames[r.status]||r.status)+'</p>'+
          '<p>'+esc(r.message||'(без описания)')+'</p>'+
          '<div class="report-actions-admin"><label>Статус<select data-field="status">'+
          Object.entries(statusNames).map(([key,label])=>'<option value="'+key+'"'+(key===r.status?' selected':'')+'>'+label+'</option>').join('')+
          '</select></label><label>Примечание администратора<input data-field="note" maxlength="1000" value="'+esc(r.adminNote||'')+'" placeholder="Что проверено или исправлено"></label>'+
          '<button type="button" class="m-btn ghost" data-action="save">Сохранить</button></div>'+
          (r.reviewedAt?'<p class="report-meta">Последняя проверка: '+esc(date(r.reviewedAt))+'</p>':'')+
          '<p class="report-result" role="status"></p></article>').join('')+'</section>';
    }).join('')||'<p>Жалоб по выбранному фильтру нет.</p>';
  }
  $('reportFilter').onchange=render;$('reportPeriod').onchange=render;
  $('reportRefresh').onclick=()=>{last=null;rows=[];more=false;epoch++;load(false);};
  $('reportMore').onclick=()=>load(true);
  $('reportGroups').onclick=async e=>{
    const button=e.target.closest('[data-action="save"]');if(!button||!authorized||!user)return;
    const el=button.closest('[data-report-id]'),id=el?.dataset.reportId;
    const row=rows.find(r=>r.id===id);if(!row)return;
    const status=el.querySelector('[data-field="status"]').value;
    const note=el.querySelector('[data-field="note"]').value.trim();
    const result=el.querySelector('.report-result');
    if(!Object.keys(statusNames).includes(status))return;
    button.disabled=true;result.textContent='Сохраняю…';
    try{
      await db.doc('cardReports/'+id).update({status,adminNote:note,reviewedAt:firebase.firestore.FieldValue.serverTimestamp(),reviewedBy:user.uid});
      row.status=status;row.adminNote=note;row.reviewedAt=firebase.firestore.Timestamp.now();
      render();
    }catch(err){result.textContent='Не удалось сохранить. '+(err.code==='permission-denied'?'Нет прав.':'Повтори попытку.');}
    finally{button.disabled=false;}
  };
  function csv(rows){
    const cols=['id','kind','topicId','wordKey','english','russian','topicTitle','source','message','reporterName','reporterUid','createdAt','status','adminNote'];
    const cell=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';
    return '\uFEFF'+[cols.join(','),...rows.map(r=>cols.map(k=>cell(k==='createdAt'?date(r.createdAt):r[k])).join(','))].join('\r\n');
  }
  function promptText(rows){
    return 'Жалобы на карточки English Skill Tree. Проверь причины, предложи исправления, но не меняй сайт без отдельного запроса.\n\n'+
      rows.map(r=>'ID жалобы: '+r.id+'\nКарточка: '+r.topicId+(r.wordKey?' / '+r.wordKey:'')+
        '\nАнглийский: '+r.english+'\nРусский: '+r.russian+'\nТема: '+r.topicTitle+
        '\nАвтор: '+r.reporterName+' ('+r.reporterUid+')\nДата: '+date(r.createdAt)+
        '\nТекст жалобы: '+(r.message||'(без описания)')).join('\n\n---\n\n');
  }
  $('reportCsv').onclick=()=>{
    const data=csv(visible()),blob=new Blob([data],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='skill-tree-card-reports-'+new Date().toISOString().slice(0,10)+'.csv';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('reportCopy').onclick=async()=>{
    try{await navigator.clipboard.writeText(promptText(visible()));$('reportCount').textContent='Скопировано '+visible().length+' жалоб. Вставь текст в чат для проверки.';}
    catch(err){$('reportCount').textContent='Не удалось скопировать. Скачай CSV вместо этого.';}
  };
})();
