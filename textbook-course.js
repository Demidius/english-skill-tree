// Textbook lists reference the same word objects used by the tree and SRS.
(function () {
  const root=document.getElementById('mode-w');
  const panel=el('section','textbook-catalog'); panel.setAttribute('aria-label','Лексика по учебникам');
  panel.innerHTML='<details><summary>Лексика по учебникам</summary><div class="textbook-content"><div class="textbook-pickers"><label>Учебник<select data-book></select></label><label>Урок<select data-lesson></select></label></div><div class="textbook-detail" aria-live="polite"></div></div></details>';
  root.querySelector('.jumpnav').before(panel);
  const books=panel.querySelector('[data-book]'), lessons=panel.querySelector('[data-lesson]'), detail=panel.querySelector('.textbook-detail');
  books.innerHTML=Object.entries(TEXTBOOK_BOOKS).map(([id,b])=>'<option value="'+id+'">English File · '+b.title+'</option>').join('');
  let selected=BEGINNER_COURSE.find(l=>l.id===lsGet('ef_textbook_lesson'))||BEGINNER_COURSE[0];
  books.value=selected.book;
  function fillLessons(){
    const list=BEGINNER_COURSE.filter(l=>l.book===books.value);
    if(selected.book!==books.value) selected=list[0];
    lessons.innerHTML=list.map(l=>'<option value="'+l.id+'">'+esc(l.label+' · '+l.title)+'</option>').join('');
    lessons.value=selected.id; render();
  }
  function render(){
    const s=W.courseInfo(selected.id,null,'all');
    const fresh=s.fresh, familiar=s.t-fresh;
    detail.innerHTML='<h3>'+esc(selected.label+' · '+selected.title)+'</h3><p>'+esc(selected.ru)+'</p><p class="textbook-source">'+esc(selected.source)+'</p>'+
      '<p>Знаю '+s.known+' из '+s.t+' · новые для меня: '+fresh+' · уже начато: '+familiar+' · к повторению: '+s.due+'</p>'+
      '<p class="textbook-note">Впервые в этих двух учебниках: '+selected.firstMentions+'. Из других уроков: '+selected.repeatMentions+'. Знание слова общее во всех темах.</p>'+
      '<div class="textbook-actions"><button type="button" class="chip" data-words>Все слова урока</button><button type="button" class="m-btn" data-practice>Отработать</button></div>';
  }
  books.addEventListener('change',fillLessons);
  lessons.addEventListener('change',()=>{selected=BEGINNER_COURSE.find(l=>l.id===lessons.value);lsSet('ef_textbook_lesson',selected.id);render();});
  panel.addEventListener('click',ev=>{
    if(ev.target.closest('[data-words]')) W.openCourseList(selected.id,null,'all');
    if(ev.target.closest('[data-practice]')) W.openCourseSession(selected.id,null,'all');
  });
  document.addEventListener('wordprogress',render);
  fillLessons();
})();
