// Lesson-first navigation. The tree remains available for all four CEFR levels.
(function () {
  const root=document.getElementById('mode-w');
  const key='ef_beginner_lesson', viewKey='ef_word_catalog';
  let selected=BEGINNER_COURSE.find(l=>l.id===lsGet(key))||BEGINNER_COURSE[0];
  let view=['course','extra','tree'].includes(lsGet(viewKey))?lsGet(viewKey):'course';
  const panel=el('section','beginner-catalog'); panel.setAttribute('aria-label','Лексика по учебнику');
  panel.innerHTML='<div class="course-tabs" role="group" aria-label="Каталог лексики">'+
    '<button type="button" data-catalog="course">Базовые · Beginner</button><button type="button" data-catalog="extra">Экстра · A1</button><button type="button" data-catalog="tree">Все темы · A1-B2</button></div>'+
    '<div class="course-base"><div class="course-intro"><div><span class="course-eyebrow">English File · 4th edition</span><h2>После урока - сюда</h2><p>Выбери пройденный урок и отработай слова, сочетания и фразы.</p></div><span class="course-count">24 урока · 6 Practical English<br>6 повторений</span></div>'+
    '<div class="course-picker"><button type="button" data-step="-1" aria-label="Предыдущий урок">‹</button><label for="beginnerLesson">Урок<select id="beginnerLesson"></select></label><button type="button" data-step="1" aria-label="Следующий урок">›</button></div><div class="course-detail"></div></div>'+
    '<div class="course-extra" hidden><div class="course-intro"><div><span class="course-eyebrow">Дополнительная практика</span><h2>Экстра · A1</h2><p>Слова и темы за пределами Beginner. Можно отрабатывать в любом порядке.</p></div></div><div class="course-extra-grid"></div></div>';
  root.querySelector('.jumpnav').before(panel);
  const select=panel.querySelector('select');
  let group;
  BEGINNER_COURSE.forEach(lesson=>{
    // Keep chronological order, including Practical English and reviews.
    const option=el('option'); option.value=lesson.id;
    option.textContent=lesson.label+' · '+(lesson.kind==='reference'?lesson.ru:lesson.title);
    if(lesson.kind==='reference'){
      if(!group){group=el('optgroup');group.label='Справочник учебника';select.appendChild(group);} group.appendChild(option);
    }else select.appendChild(option);
  });
  function statText(s){return 'знаю '+s.known+' / '+s.t+' · '+s.pct+'%';}
  function render(){
    const lesson=selected, i=BEGINNER_COURSE.indexOf(lesson), s=W.courseInfo(lesson.id);
    select.value=lesson.id;
    panel.querySelector('[data-step="-1"]').disabled=i===0;
    panel.querySelector('[data-step="1"]').disabled=i===BEGINNER_COURSE.length-1;
    panel.querySelector('.course-detail').innerHTML='<div class="course-lesson-head"><div><span class="course-badge">'+esc(lesson.label)+'</span><h3>'+esc(lesson.title)+'</h3><p>'+esc(lesson.ru)+'</p><span class="course-source">'+esc(lesson.source||'Справочные материалы Beginner')+'</span></div><div class="course-progress" aria-live="polite"><b>'+s.pct+'%</b><span>'+statText(s)+'</span><span class="course-meter"><i style="width:'+s.pct+'%"></i></span></div></div>'+
      '<div class="course-sections">'+lesson.sections.map((section,index)=>{const st=W.courseInfo(lesson.id,index);return '<article class="course-section"><div><h4>'+esc(section.title)+'<span class="course-code" title="Урок учебника">'+esc(lesson.label)+'</span></h4><p>'+st.t+' слов и фраз <span data-section-stat="'+index+'">· знаю '+st.known+'</span></p></div><div class="course-actions"><button type="button" class="chip" data-open="'+index+'">Слова</button><button type="button" class="m-btn" data-practice="'+index+'" aria-label="Отработать: '+esc(section.title)+'">Отработать</button></div></article>';}).join('')+'</div>'+
      '<div class="course-bottom"><p>Знакомые слова используют общий прогресс во всех уроках. В отработку попадают новые слова и слова к повторению.</p><div class="course-actions"><button type="button" class="m-btn ghost" data-open="all">Все слова урока</button><button type="button" class="m-btn" data-practice="all">Отработать урок</button></div></div>';
  }
  const extraCards=W_BRANCHES.map(b=>({b,cards:(b.extra&&b.extra.A1)||[]})).filter(x=>x.cards.length);
  panel.querySelector('.course-extra-grid').innerHTML=extraCards.map(({b,cards})=>'<section><h3>'+esc(b.ru)+'</h3>'+cards.map(c=>'<article class="course-extra-card"><button type="button" class="course-extra-open" data-extra="'+c[0]+'"><b>'+esc(c[1])+'</b><span>'+esc(c[2])+'</span><small data-extra-stat="'+c[0]+'"></small></button><button type="button" class="chip" data-extra-practice="'+c[0]+'" aria-label="Отработать: '+esc(c[1])+'">Отработать</button></article>').join('')+'</section>').join('');
  function refreshExtra(){panel.querySelectorAll('[data-extra-stat]').forEach(e=>{const s=W.topicInfo(e.dataset.extraStat);e.textContent='знаю '+s.known+' / '+s.n+' · '+s.pct+'%';});}
  function setView(value){
    view=value;lsSet(viewKey,view);root.dataset.catalog=view;
    panel.querySelectorAll('[data-catalog]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.catalog===view)));
    panel.querySelector('.course-base').hidden=view!=='course';
    panel.querySelector('.course-extra').hidden=view!=='extra';
    if(view==='course')render();if(view==='extra')refreshExtra();
  }
  select.addEventListener('change',()=>{selected=BEGINNER_COURSE.find(l=>l.id===select.value);lsSet(key,selected.id);render();});
  panel.addEventListener('click',ev=>{
    const tab=ev.target.closest('.course-tabs button[data-catalog]');if(tab){setView(tab.dataset.catalog);return;}
    const step=ev.target.closest('[data-step]');if(step){const next=BEGINNER_COURSE[BEGINNER_COURSE.indexOf(selected)+Number(step.dataset.step)];if(next){selected=next;lsSet(key,selected.id);render();}return;}
    const open=ev.target.closest('[data-open]');if(open){W.openCourseList(selected.id,open.dataset.open==='all'?null:Number(open.dataset.open));return;}
    const practice=ev.target.closest('[data-practice]');if(practice){W.openCourseSession(selected.id,practice.dataset.practice==='all'?null:Number(practice.dataset.practice));return;}
    const extra=ev.target.closest('[data-extra]');if(extra){W.openTopic(extra.dataset.extra);return;}
    const extraPractice=ev.target.closest('[data-extra-practice]');if(extraPractice)W.practiceTopic(extraPractice.dataset.extraPractice);
  });
  document.addEventListener('wordprogress',()=>{if(view==='course')render();else if(view==='extra')refreshExtra();});
  render();setView(view);
})();
