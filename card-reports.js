/* Report a problematic grammar or vocabulary card without interrupting the study session. */
window.CardReports = (() => {
  const cover = document.createElement('div');
  cover.className = 'report-overlay';
  cover.hidden = true;
  cover.innerHTML = '<section class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="reportTitle">' +
    '<div class="report-heading"><h2 id="reportTitle">Пожаловаться на ошибку</h2><button type="button" class="report-close" aria-label="Закрыть">×</button></div>' +
    '<p class="report-card-title"></p>' +
    '<form class="report-form"><label for="reportMessage">Что не так? <span>(необязательно)</span></label>' +
    '<textarea id="reportMessage" maxlength="2000" rows="5" placeholder="Например, неверный перевод, ошибка в примере или неоднозначное задание"></textarea>' +
    '<p class="report-help">Можно отправить пустую жалобу. Мы сохраним карточку, аккаунт и время отправки.</p>' +
    '<p class="report-status" role="status" aria-live="polite"></p>' +
    '<div class="report-actions"><button type="button" class="m-btn ghost report-cancel">Отмена</button>' +
    '<button type="submit" class="m-btn report-submit">Отправить жалобу</button></div></form></section>';
  document.body.append(cover);
  const form=cover.querySelector('form'), field=cover.querySelector('textarea'), status=cover.querySelector('.report-status'), send=cover.querySelector('.report-submit');
  let item=null, previousFocus=null, busy=false;
  function close(){
    if(busy) return;
    cover.hidden=true; item=null; field.value=''; field.disabled=false; send.disabled=false; send.textContent='Отправить жалобу'; cover.querySelector('.report-cancel').textContent='Отмена'; status.textContent='';
    if(previousFocus && document.contains(previousFocus)) previousFocus.focus({preventScroll:true});
  }
  cover.querySelector('.report-close').addEventListener('click', close);
  cover.querySelector('.report-cancel').addEventListener('click', close);
  cover.addEventListener('click', e=>{if(e.target===cover)close();});
  // The parent study modal also listens for Escape and keyboard shortcuts.
  document.addEventListener('keydown', e=>{
    if(cover.hidden) return;
    e.stopImmediatePropagation();
    if(e.key==='Escape'&&!busy){e.preventDefault();close();}
    if(e.key==='Tab'){
      const controls=[...cover.querySelectorAll('button,textarea')].filter(el=>!el.disabled);
      const idx=controls.indexOf(document.activeElement);
      if(e.shiftKey&&idx===0){controls.at(-1).focus();e.preventDefault();}
      else if(!e.shiftKey&&idx===controls.length-1){controls[0].focus();e.preventDefault();}
    }
  }, true);
  function open(data){
    if(!data || !['word','rule'].includes(data.kind) || !data.topicId) return;
    previousFocus=document.activeElement;
    item={kind:data.kind,topicId:String(data.topicId).slice(0,120),wordKey:String(data.wordKey||'').slice(0,120),
      english:String(data.english||'').slice(0,300),russian:String(data.russian||'').slice(0,500),
      topicTitle:String(data.topicTitle||'').slice(0,160),source:String(data.source||'').slice(0,120)};
    cover.querySelector('.report-card-title').textContent=(item.kind==='word'?'Слово: ':'Правило: ')+(item.english||item.topicTitle)+(item.russian?' · '+item.russian:'');
    status.textContent='';field.value='';field.disabled=false;send.disabled=false;send.textContent='Отправить жалобу';cover.querySelector('.report-cancel').textContent='Отмена';cover.hidden=false;field.focus();
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault(); if(!item||busy)return;
    const user=typeof firebase!=='undefined'&&firebase.apps.length?firebase.auth().currentUser:null;
    if(!user){status.textContent='Чтобы сохранить, кто отправил жалобу, нужно войти в аккаунт.';return;}
    busy=true;send.disabled=true;cover.querySelector('.report-cancel').disabled=true;status.textContent='Отправляю…';
    try{
      const db=firebase.firestore();
      const snap=await db.doc('profiles/'+user.uid).get({source:'server'});
      if(!snap.exists||!snap.data().name)throw Error('Профиль пользователя не найден.');
      const payload={...item,message:field.value.trim(),reporterUid:user.uid,reporterName:snap.data().name,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),status:'new'};
      await db.collection('cardReports').add(payload);
      status.textContent='Жалоба сохранена. Спасибо!';
      field.disabled=true;
      send.textContent='Готово';send.disabled=true;
      cover.querySelector('.report-cancel').disabled=false;
      cover.querySelector('.report-cancel').textContent='Закрыть';
    }catch(error){status.textContent=error.code==='permission-denied'?'Нет разрешения на отправку. Возможно, правила базы ещё не обновлены.':'Не удалось отправить жалобу. Проверь интернет и попробуй ещё раз.';}
    finally{busy=false;if(send.textContent!=='Готово')send.disabled=false;cover.querySelector('.report-cancel').disabled=false;}
  });
  return {open};
})();
