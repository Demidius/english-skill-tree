
const TESTS = window.TESTS || {};

// ================= shared helpers =================
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function lessonRefHTML(scope, level, source, book, title){
  if(!source && !title) return '';
  return '<span class="src lesson-ref" data-lesson-scope="'+esc(scope)+'" data-lesson-level="'+esc(level)+'" data-lesson-source="'+esc(source)+'"'+(book?' data-lesson-book="'+esc(book)+'"':'')+(title?' data-lesson-title="'+esc(title)+'"':'')+' title="Урок учебника">'+esc(source||(scope==='rules'?'Правила':'Лексика'))+'</span>';
}
function el(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
const phoneMQ = window.matchMedia('(max-width: 720px)');

// shared persistence state (filled in at the bottom)
let db=null, local=false, profiles=[], current=null;
// level coefficients (shared by all students, edited on the «Настройки» tab)
const COEF_DEFAULT={rulesPractice:{ok:1}, review:{newPerSession:20, hardPct:120, easyPct:130, maxIvl:365}};
const COEF_RANGE={'rulesPractice.ok':[0,3], 'review.newPerSession':[0,200], 'review.hardPct':[100,200], 'review.easyPct':[100,300], 'review.maxIvl':[180,3650]};
const COEF_STEP={'review.newPerSession':5, 'review.hardPct':5, 'review.easyPct':5, 'review.maxIvl':30};
const COEF=JSON.parse(JSON.stringify(COEF_DEFAULT));
function applyCoef(src){
  Object.keys(COEF_DEFAULT).forEach(g=>Object.keys(COEF_DEFAULT[g]).forEach(k=>{
    const v=src&&src[g]&&src[g][k];
    const rg=COEF_RANGE[g+'.'+k]||[-10,10];
    COEF[g][k]=(typeof v==='number'&&isFinite(v))?Math.max(rg[0],Math.min(rg[1],Math.round(v))):COEF_DEFAULT[g][k];
  }));
}
function sgn(n){ return (n>0?'+':n<0?'−':'')+Math.abs(n); }
function currentName(){ const p=profiles.find(p=>p.id===current); return p?p.name:''; }
function needProfile(){ if(!canWrite()){ alert('Это только просмотр. Выбери свой аккаунт, чтобы заниматься и менять прогресс.'); return true; } return false; }
function onWriteError(e){
  document.getElementById('roFlag').hidden=false;
}

// ---------- speech ----------
const canSpeak = (()=>{ try{ return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance!=='undefined'; }catch(e){ return false; } })();
let _ttsUtt=null, _ttsT=null, _ttsW=null;
function ttsVoice(){
  try{ const vs=speechSynthesis.getVoices();
    return vs.find(v=>/^en[-_]GB/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null; }catch(e){ return null; }
}
if(canSpeak){ try{ speechSynthesis.getVoices(); speechSynthesis.addEventListener('voiceschanged',()=>speechSynthesis.getVoices()); }catch(e){} }
function say(t){
  if(!canSpeak) return;
  const ss=window.speechSynthesis;
  const text=String(t).replace(/…/g,' ').replace(/\s\/\s/g,', ');
  const make=()=>{ const u=new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=.9; const v=ttsVoice(); if(v) u.voice=v; return u; };
  try{
    clearTimeout(_ttsT); clearTimeout(_ttsW);
    if(ss.speaking||ss.pending||ss.paused) ss.cancel();
    try{ ss.resume(); }catch(e){}
    _ttsT=setTimeout(()=>{
      try{
        const u=make(); let started=false;
        u.onstart=()=>{ started=true; };
        u.onend=u.onerror=()=>{ if(_ttsUtt===u) _ttsUtt=null; };
        _ttsUtt=u; ss.speak(u); try{ ss.resume(); }catch(e){}
        // если движок «залип» и не начал говорить — сбросить и повторить один раз
        _ttsW=setTimeout(()=>{
          if(started||_ttsUtt!==u) return;
          try{ ss.cancel(); const u2=make(); _ttsUtt=u2; u2.onend=u2.onerror=()=>{ if(_ttsUtt===u2) _ttsUtt=null; }; ss.speak(u2); ss.resume(); }catch(e){}
        },1200);
      }catch(e){}
    },60);
  }catch(e){}
}
document.addEventListener('visibilitychange',()=>{ if(!document.hidden && canSpeak){ try{ speechSynthesis.cancel(); speechSynthesis.resume(); }catch(e){} } });
const trBtn = t => (typeof EX_RU!=='undefined' && EX_RU[t]) ? '<button type="button" class="trb" data-tr="'+esc(EX_RU[t])+'" aria-label="Перевести на русский" title="Перевод">RU</button>' : '';
document.addEventListener('click', ev=>{
  const b=ev.target.closest('.trb'); if(!b) return;
  ev.stopPropagation(); ev.preventDefault();
  const t=b.closest('.exs,p').querySelector('.trt'); if(!t) return;
  if(b.classList.toggle('on')){ t.dataset.en=t.innerHTML; t.textContent=b.dataset.tr; t.classList.add('is-ru'); b.textContent='EN'; b.setAttribute('aria-label','Показать английский'); }
  else { t.innerHTML=t.dataset.en; t.classList.remove('is-ru'); b.textContent='RU'; b.setAttribute('aria-label','Перевести на русский'); }
}, true);
const sayBtn = t => canSpeak ? '<button type="button" class="say" data-say="'+esc(t)+'" aria-label="Произнести">▶</button>' : '';

// ---------- "i" tooltips ----------
const TIPS = {};
const tip = el('div'); tip.id='tip'; tip.hidden=true; document.body.appendChild(tip);
let pinned=null;
function showTip(icon){
  const d = TIPS[icon.dataset.tip]; if(!d) return;
  tip.innerHTML = '<b>'+esc(d.t)+'</b>'+esc(d.x);
  tip.classList.toggle('topic-help', !!d.actions);
  tip.dataset.pinned = pinned===icon ? '1' : '0';
  if(d.actions) tip.innerHTML += '<div class="tip-actions">'+d.actions.map(([label,text])=>'<p><strong>'+esc(label)+'</strong> — '+esc(text)+'</p>').join('')+'</div>';
  tip.hidden=false;
  const r = icon.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let left = Math.min(Math.max(8, r.left + r.width/2 - tw/2), window.innerWidth - tw - 8);
  let top = r.bottom + 8;
  if(top + th > window.innerHeight - 8) top = Math.max(8, r.top - th - 8);
  tip.style.left = left+'px'; tip.style.top = top+'px';
}
function unpin(){ if(pinned){ pinned.dataset.pinned='0'; pinned=null; } tip.hidden=true; }
function bindTips(scope){
  scope.querySelectorAll('.info[data-tip]').forEach(icon=>{
    icon.addEventListener('mouseenter',()=>{ if(!pinned) showTip(icon); });
    icon.addEventListener('mouseleave',()=>{ if(!pinned) tip.hidden=true; });
    icon.addEventListener('click',ev=>{
      ev.stopPropagation(); ev.preventDefault();
      if(pinned===icon){ unpin(); return; }
      unpin(); pinned=icon; icon.dataset.pinned='1'; showTip(icon);
    });
  });
}
document.addEventListener('click',()=>unpin());
window.addEventListener('scroll',()=>unpin(),{passive:true});

// ---------- modal shell (shared by grammar tests and word cards) ----------
let owner=null;
const back=el('div','modal-back'); back.hidden=true;
back.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle"></div>';
document.body.appendChild(back);
const modal=back.firstChild;
function openModal(o){ unpin(); const was=!back.hidden; owner=o; back.hidden=false; modal.classList.remove('rulepage','fixed','testm'); if(!was) navPush('modal'); }
function closeModal(fromNav){
  if(back.hidden) return;
  back.hidden=true; modal.classList.remove('fixed','testm'); const o=owner; owner=null;
  if(!fromNav) navPop('modal');
  try{ speechSynthesis.cancel(); }catch(e){}
  if(o && o.onClose) o.onClose();
}
function mHead(kicker, title, extra){
  return '<div class="m-top"><div class="m-htxt"><div class="m-kicker">'+esc(kicker)+'</div>'+
    '<h2 class="m-title" id="mTitle">'+esc(title)+'</h2></div>'+(extra||'')+
    '<button type="button" class="m-close" data-act="close" aria-label="Закрыть">×</button></div>';
}
modal.addEventListener('click',ev=>{
  const s=ev.target.closest('[data-say]'); if(s){ say(s.dataset.say); return; }
  if(ev.target.closest('[data-act="close"]')){ closeModal(); return; }
  if(owner) owner.onClick(ev);
});
modal.addEventListener('change',ev=>{ if(owner && owner.onChange) owner.onChange(ev); });
modal.addEventListener('submit',ev=>{ ev.preventDefault(); if(owner && owner.onSubmit) owner.onSubmit(ev); });
back.addEventListener('click',ev=>{ if(ev.target===back) closeModal(); });
document.addEventListener('keydown',ev=>{
  if(!owner || back.hidden) return;
  if(ev.key==='Escape'){ if(owner.onEsc && owner.onEsc()) return; closeModal(); return; }
  owner.onKey(ev);
});

// ---------- «Назад»: закрывает окно, а на главном экране спрашивает, выйти ли ----------
// В истории браузера держим «страж»-запись. Кнопка «Назад» сначала снимает её (событие
// popstate), и мы решаем сами: закрыть открытое окно или спросить про выход.
let navOk=true, navSkip=0, navArmed=false;
function navState(){ try{ return history.state; }catch(e){ return null; } }
function navPush(kind){
  if(!navOk || !navArmed) return;
  try{ history.pushState({ef:kind}, ''); }catch(e){ navOk=false; }
}
function navPop(kind){
  const s=navState();
  if(navOk && s && s.ef===kind){ navSkip++; try{ history.back(); }catch(e){ navSkip--; } }
}
function navArm(){
  if(navArmed || !navOk) return;
  navArmed=true;
  const s=navState();
  if(!(s && (s.ef==='guard'||s.ef==='modal'))) navPush('guard');
  if(!back.hidden) navPush('modal');
}
['pointerdown','keydown','touchstart'].forEach(t=>document.addEventListener(t, navArm, {capture:true, passive:true}));

const exitBack=el('div','modal-back exitask'); exitBack.hidden=true;
exitBack.innerHTML='<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="exitTitle">'+
  '<div class="m-kicker">Кнопка «Назад»</div><h2 class="m-title" id="exitTitle">Выйти с сайта?</h2>'+
  '<p class="exit-note">Прогресс уже сохранён. Чтобы уйти со страницы, нажмите «Назад» ещё раз.</p>'+
  '<div class="m-actions"><button type="button" class="m-btn" data-x="stay">Остаться</button></div></div>';
document.body.appendChild(exitBack);
function exitStay(){ exitBack.hidden=true; navPush('guard'); }
exitBack.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-x]');
  if((b && b.dataset.x==='stay') || ev.target===exitBack) exitStay();
});
document.addEventListener('keydown',ev=>{
  if(exitBack.hidden) return;
  if(ev.key==='Escape'){ ev.preventDefault(); exitStay(); }
}, true);
window.addEventListener('popstate',()=>{
  if(!navOk) return;
  if(navSkip>0){ navSkip--; return; }
  const s=navState();
  if(!back.hidden){                       // «Назад» при открытом окне — просто закрываем окно
    closeModal(true);
    if(!(s && (s.ef==='guard'||s.ef==='modal'))) navPush('guard');
    return;
  }
  if(s && (s.ef==='guard'||s.ef==='modal')) return;   // ещё внутри сайта
  exitBack.hidden=false;                  // страж снят — спрашиваем
  const st=exitBack.querySelector('[data-x="stay"]'); if(st) st.focus();
});

// ================= generic tree board =================
function Board(o){
  const root=o.root;
  root.innerHTML =
    '<div class="stats-row"><div class="progress-big"><span class="num" data-r="stat">—</span><div class="cefr-progress" data-r="bar"></div></div>'+
      '<div class="legend">'+o.legend+'</div></div>'+
    '<button type="button" class="filters-toggle" data-r="ftoggle" aria-expanded="false">Фильтры <span data-r="fstate"></span></button>'+
    '<div class="controls" data-r="controls">'+
      (o.range ? (()=>{ const opts=sel=>Array.from({length:o.range+1},(_,i)=>'<option value="'+i+'"'+(i===sel?' selected':'')+'>'+i+'</option>').join('');
        return '<div class="ctl-group lvrange" data-r="fRange"><span class="ctl-label">Уровень</span>'+
          '<label class="rng">от <select id="'+o.key+'-lo" data-r="lo" aria-label="Уровень от">'+opts(0)+'</select></label>'+
          '<label class="rng">до <select id="'+o.key+'-hi" data-r="hi" aria-label="Уровень до">'+opts(o.range)+'</select></label>'+
          '<button type="button" class="chip" data-r="rreset" hidden>Сбросить</button></div>'; })() :
      '<div class="ctl-group" data-r="fStatus"><span class="ctl-label">'+o.statusLabel+'</span>'+
        o.statusChips.map((c,i)=>'<button class="chip" data-f="'+c[0]+'"'+(i?'':' data-active="1"')+'>'+c[1]+'</button>').join('')+'</div>'+
      '<div class="ctl-group" data-r="fTag"><span class="ctl-label">'+o.tagLabel+'</span>'+
        o.tagChips.map((c,i)=>'<button class="chip tag" data-f="'+c[0]+'"'+(i?'':' data-active="1"')+(c[2]?' title="'+esc(c[2])+'"':'')+'>'+c[1]+'</button>').join('')+'</div>')+
    '</div>'+
    '<nav class="jumpnav" data-r="jn" aria-label="Переход к ветке"></nav>'+
    '<div class="tree-scroll" data-r="scroller"><div class="tree" data-r="tree"></div></div>'+
    '<details class="help"><summary>Как пользоваться</summary><div class="help-body">'+o.footer+'</div></details>';
  const R = n=>root.querySelector('[data-r="'+n+'"]');
  const tree=R('tree'), scroller=R('scroller'), jn=R('jn');
  const H={cnt:{}, pb:{}, lp:{}, lb:{}, lpm:{}};
  tree.style.setProperty('--cols', o.branches.length);
  tree.appendChild(el('div','corner'));
  o.branches.forEach(b=>{
    const tk=o.key+':b:'+b.key; TIPS[tk]={t:b.name, x:b.info||''};
    const h=el('div','bhead'); h.dataset.branch=b.key;
    h.innerHTML='<div class="root" style="background:'+b.color+'">'+
      '<span class="info" data-tip="'+tk+'">i</span>'+
      '<div class="mnav"><button type="button" class="marrow" data-dir="-1" aria-label="Предыдущая ветка">‹</button>'+
      '<span class="mpos"></span><button type="button" class="marrow" data-dir="1" aria-label="Следующая ветка">›</button></div>'+
      '<div class="n">'+esc(b.name)+'</div><div class="ru">'+esc(b.ru)+'</div>'+
      '<div class="cnt"></div><div class="pb"><span style="width:0"></span></div></div>';
    H.cnt[b.key]=h.querySelector('.cnt'); H.pb[b.key]=h.querySelector('.pb span');
    tree.appendChild(h);
  });
  LEVELS.forEach((l,li)=>{
    const lab=el('div','lvl-label band-'+l.key+(li?' row-sep':''));
    lab.innerHTML='<div class="diamond" style="background:var('+l.c+')"><span>'+l.key+'</span></div>'+
      '<div class="book">'+(l.key==='A2'?(o.key==='g'?'Pre-Intermediate':'Elementary / Pre-Intermediate'):l.book)+'</div><div class="lp"></div><div class="lbar"><span style="width:0"></span></div><div class="lpm"></div>';
    H.lp[l.key]=lab.querySelector('.lp'); H.lb[l.key]=lab.querySelector('.lbar span'); H.lpm[l.key]=lab.querySelector('.lpm');
    tree.appendChild(lab);
    o.branches.forEach(b=>{
      const nodes=o.cell(b, l.key);
      const cell=el('div','cell lvl-row band-'+l.key+(li?' row-sep':'')+(nodes.length?'':' empty'));
      cell.dataset.branch=b.key;
      if(nodes.length){ const st=el('div','stack'); nodes.forEach(n=>st.appendChild(n)); cell.appendChild(st); }
      else cell.appendChild(el('div','empty-note','<span>новой темы нет</span>'));
      tree.appendChild(cell);
    });
  });

  // branch navigation (desktop: jump; phone: one branch at a time)
  let active = (()=>{ const k=lsGet(o.branchKey); return o.branches.some(b=>b.key===k)?k:o.branches[0].key; })();
  function refreshPhone(){ LEVELS.forEach(l=>{ H.lpm[l.key].textContent=o.phoneCount(active, l.key); }); }
  function setBranch(key, scrollTop){
    active=key; lsSet(o.branchKey, key);
    tree.querySelectorAll(':scope > [data-branch]').forEach(e=>e.classList.toggle('on', e.dataset.branch===key));
    jn.querySelectorAll('button').forEach(bt=>{
      const on=bt.dataset.key===key; bt.dataset.active=on?'1':'0';
      if(on && phoneMQ.matches && !root.hidden) bt.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
    });
    const i=o.branches.findIndex(b=>b.key===key);
    root.querySelectorAll('.bhead .mpos').forEach(s=>s.textContent=(i+1)+' / '+o.branches.length);
    refreshPhone();
    if(scrollTop && phoneMQ.matches){
      const top=jn.getBoundingClientRect().top + window.scrollY;
      if(window.scrollY > top) window.scrollTo({top, behavior:'smooth'});
    }
  }
  function stepBranch(dir){
    const i=o.branches.findIndex(b=>b.key===active);
    setBranch(o.branches[(i+dir+o.branches.length)%o.branches.length].key, true);
  }
  o.branches.forEach(b=>{
    const bt=el('button',null,esc(b.name)); bt.type='button'; bt.dataset.key=b.key;
    bt.addEventListener('click',()=>{
      if(phoneMQ.matches){ setBranch(b.key, true); return; }
      const h=tree.querySelector('.bhead[data-branch="'+b.key+'"]');
      scroller.scrollTo({left:Math.max(0, h.offsetLeft-140), behavior:'smooth'});
    });
    jn.appendChild(bt);
  });
  root.querySelectorAll('.marrow').forEach(a=>a.addEventListener('click',ev=>{ ev.stopPropagation(); stepBranch(+a.dataset.dir); }));
  (function(){
    let sx=0, sy=0, st=0, tracking=false;
    tree.addEventListener('touchstart',ev=>{
      if(!phoneMQ.matches || ev.touches.length!==1) return;
      tracking=true; sx=ev.touches[0].clientX; sy=ev.touches[0].clientY; st=Date.now();
    },{passive:true});
    tree.addEventListener('touchend',ev=>{
      if(!tracking) return; tracking=false;
      const t=ev.changedTouches[0]; const dx=t.clientX-sx, dy=t.clientY-sy;
      if(Date.now()-st<700 && Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.8) stepBranch(dx<0?1:-1);
    },{passive:true});
  })();

  // filters
  const F={status:'all', tag:'all', lo:0, hi:o.range||0};
  const ft=R('ftoggle');
  ft.addEventListener('click',()=>{
    const open=ft.getAttribute('aria-expanded')!=='true';
    ft.setAttribute('aria-expanded', open?'true':'false');
    R('controls').classList.toggle('open', open);
  });
  function applyFilter(){
    const rng=o.range && (F.lo>0 || F.hi<o.range);
    const n=(F.status!=='all')+(F.tag!=='all')+(rng?1:0);
    R('fstate').textContent = o.range ? (rng?'· '+F.lo+'–'+F.hi:'') : (n ? '· '+n : '');
    if(o.range){ R('rreset').hidden=!rng; }
    if(!n){ tree.classList.remove('filtered'); return; }
    tree.classList.add('filtered');
    tree.querySelectorAll('.node[data-id]').forEach(nd=>{ nd.dataset.match = o.match(nd, F) ? '1':'0'; });
  }
  if(o.range){
    const lo=R('lo'), hi=R('hi');
    const upd=src=>{ F.lo=+lo.value; F.hi=+hi.value;
      if(F.lo>F.hi){ if(src==='lo'){ F.hi=F.lo; hi.value=F.hi; } else { F.lo=F.hi; lo.value=F.lo; } }
      applyFilter(); };
    lo.addEventListener('change',()=>upd('lo')); hi.addEventListener('change',()=>upd('hi'));
    R('rreset').addEventListener('click',()=>{ lo.value=0; hi.value=o.range; upd('lo'); });
  }
  [['fStatus','status'],['fTag','tag']].forEach(([r,k])=>{
    const g=R(r); if(!g) return;
    g.addEventListener('click',e=>{
      const b=e.target.closest('button.chip'); if(!b) return;
      F[k]=b.dataset.f;
      g.querySelectorAll('.chip').forEach(c=>c.dataset.active=(c===b)?'1':'0');
      applyFilter();
    });
  });

  // drag to pan with the mouse
  (function(){
    let drag=null;
    scroller.addEventListener('pointerdown', ev=>{
      if(ev.pointerType!=='mouse' || ev.button!==0) return;
      if(ev.target.closest('.node:not(.plan), .info, .tbtn, .wbtn, button, input, a')) return;
      drag={x:ev.clientX, y:ev.clientY, left:scroller.scrollLeft, top:window.scrollY, id:ev.pointerId};
      scroller.setPointerCapture(ev.pointerId);
      tree.classList.add('dragging'); unpin(); ev.preventDefault();
    });
    scroller.addEventListener('pointermove', ev=>{
      if(!drag || ev.pointerId!==drag.id) return;
      scroller.scrollLeft = drag.left - (ev.clientX - drag.x);
      window.scrollTo(window.scrollX, drag.top - (ev.clientY - drag.y));
    });
    function end(ev){
      if(!drag || (ev && ev.pointerId!==drag.id)) return;
      try{ scroller.releasePointerCapture(drag.id); }catch(e){}
      drag=null; tree.classList.remove('dragging');
    }
    scroller.addEventListener('pointerup', end);
    scroller.addEventListener('pointercancel', end);
    scroller.addEventListener('lostpointercapture', end);
  })();
  scroller.addEventListener('scroll',()=>unpin(),{passive:true});

  bindTips(root);
  setBranch(active);
  return {root, tree, H, stat:R('stat'), bar:R('bar'), applyFilter, refreshPhone, setBranch, get active(){ return active; }};
}

function progressStats(values){
  const counts=Array(11).fill(0);
  let sum=0;
  values.forEach(v=>{ const l=Math.max(0,Math.min(10,+v||0)); counts[l]++; sum+=l; });
  const t=values.length, known=counts[8]+counts[9]+counts[10], mastered=counts[10];
  return {t,sum,known,mastered,counts,pct:t?Math.round(sum/(10*t)*100):0};
}
function cefrProgressHTML(byLevel){
  return '<div class="cefr-scale">'+LEVELS.map(l=>{
    const st=byLevel[l.key]||progressStats([]);
    const pieces=[];
    for(let n=10;n>=0;n--){
      const c=st.counts[n]||0;
      if(!c||!st.t) continue;
      pieces.push('<span class="cefr-piece" style="width:'+(c/st.t*100)+'%;background:var(--lv'+n+')" title="уровень '+n+': '+c+'"></span>');
    }
    return '<div class="cefr-seg" data-cefr="'+l.key+'"'+(st.scope?' data-scope="'+st.scope+'"':'')+'>'+
      '<div class="cefr-track">'+pieces.join('')+'</div>'+
      '<div class="cefr-cap"><b>'+l.key+' · '+st.pct+'%</b><span>'+(st.scope==='base'?'база · ':'')+'знаю '+st.known+' / '+st.t+'</span></div>'+
      '</div>';
  }).join('')+'</div>';
}

// ================= GRAMMAR mode =================
const G = (function(){
  const STATUS_ORDER=['not_started','learning','review','known','mastered'];
  const STATUS_LABEL={not_started:'не начато', learning:'изучаю', review:'повторяю', known:'знаю', mastered:'закреплено'};
  const CARDS={}, state={}, scores={}, glv={}, readM={}, stM={}; // stM: скрытые шаги к следующему уровню (с уровня 7)
  const GMAX=10, GREV=5;
  const STATUS_FROM_OLD={not_started:0, learning:2, review:6, mastered:10};
  function gstatus(l){ return l>=GMAX?'mastered':l>=8?'known':l>=GREV?'review':l>0?'learning':'not_started'; }
  function gband(l){ return l>=GMAX?'m':l>=8?'k':l>=GREV?'r':l>0?'l':'0'; }
  function sumOf(ids){ return ids.reduce((s,id)=>s+glv[id],0); }
  function avgOf(ids){ if(!ids.length) return '0'; const v=sumOf(ids)/ids.length; return (Math.round(v*10)/10).toString().replace('.',','); }
  function setG(id,l){ glv[id]=Math.max(0,Math.min(GMAX,l|0)); state[id]=gstatus(glv[id]); }
  const actionHelp = [
    ['Тест', 'проверка этой темы: 10 вопросов.'],
    ['YouTube', 'поиск видео по названию темы в новой вкладке.'],
    ['GPT', 'объяснение темы в GPT, Claude, Gemini или Qwen. GPT, Claude и Qwen открываются с запросом. Если поле пустое, вставь промт из буфера; в Gemini вставка нужна вручную.'],
  ];
  G_BRANCHES.forEach(b=>LEVELS.forEach(l=>(b.cells[l.key]||[]).forEach(c=>{
    CARDS[c[0]]={branch:b.key, level:l.key, title:c[1], tags:c[5]};
    state[c[0]]='not_started'; glv[c[0]]=0;
    if(G_INFO[c[0]]) TIPS['g:c:'+c[0]]={t:c[1], x:G_INFO[c[0]], actions:actionHelp.filter(([label])=>label!=='Тест'||TESTS[c[0]])};
  })));
  const ALL=Object.keys(CARDS);

  const ICON_UP='<svg class="lvup" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5 6 3l3.5 3.5M2.5 10.5 6 7l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_STAR='<svg class="lvup" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 .9l1.55 3.2 3.5.45-2.57 2.42.66 3.48L6 8.75 2.86 10.45l.66-3.48L.95 4.55l3.5-.45z" fill="currentColor"/></svg>';
  function chipHTML(s,l){ return esc(STATUS_LABEL[s])+' · '+(l||0)+(s==='mastered'?ICON_STAR:''); }
  function gbarHTML(l){ let h='<span class="gbar" data-b="'+gband(l)+'">'; for(let i=1;i<=GMAX;i++) h+='<i data-i="'+i+'" class="'+(i<=l?'on':'')+'"></i>'; return h+'</span>'; }
  function gEdit(id){
    const l=glv[id];
    if(!canWrite()) return '<p class="access-note">Уровень правила: '+l+' / '+GMAX+' · только просмотр</p>';
    let h='<div class="r-level"><span class="r-level-l">Уровень правила</span><span class="lvle" data-gid="'+id+'" data-l="'+l+'" data-b="'+gband(l)+'" role="group" aria-label="Уровень правила">'+
      '<button type="button" class="lvb" data-gset="'+Math.max(0,l-1)+'" title="Понизить"'+(l<=0?' disabled':'')+' aria-label="Понизить">−</button><span class="lvsegs">';
    for(let i=1;i<=GMAX;i++) h+='<button type="button" class="lvs'+(i<=l?' on':'')+'" data-gset="'+(i===l?i-1:i)+'" title="'+(i===l?'Понизить до '+(i-1):'Поставить уровень '+i)+'" aria-label="уровень '+i+'"></button>';
    return h+'</span><span class="lvn">'+l+'</span><button type="button" class="lvb" data-gset="'+Math.min(GMAX,l+1)+'" title="Повысить"'+(l>=GMAX?' disabled':'')+' aria-label="Повысить">+</button></span>'+
      stepsNote(id)+'</div>';
  }
  function stepsNote(id){
    const l=glv[id]; if(l<SkillCore.STEP_FROM || l>=GMAX) return '';
    return '<span class="r-steps" style="font-size:.85em;opacity:.8" title="С уровня '+SkillCore.STEP_FROM+' нужно '+SkillCore.STEPS+' верных ответа подряд; ошибка обнуляет шаги, уровень не снижается">до уровня '+(l+1)+': '+(stM[id]||0)+' из '+SkillCore.STEPS+' подряд</span>';
  }
  function readEdit(id){ return '<label class="r-read"><input type="checkbox" data-rread'+(readM[id]?' checked':'')+(!canWrite()?' disabled':'')+'> читано <span>— отметка для себя, на уровень не влияет</span></label>'; }
  const TEST_SVG='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 3.2l1 1 1.7-1.9M2 8.2l1 1 1.7-1.9M6.8 3.6h3.4M6.8 8.6h3.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BOOK_SVG='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 2.2c1.6-.6 3.1-.5 4.5.4v7.6c-1.4-.9-2.9-1-4.5-.4zM10.5 2.2c-1.6-.6-3.1-.5-4.5.4v7.6c1.4-.9 2.9-1 4.5-.4z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  function cardNode(c){
    const [id,t,g,ex,src,tags]=c;
    const btn=el('button','node'); btn.type='button'; btn.dataset.id=id; btn.dataset.status='not_started';
    btn.innerHTML=
      (G_INFO[id]?'<span class="info" data-tip="g:c:'+id+'">i</span>':'')+
      (TESTS[id]?'<span class="wbtn wtest rtest rbtn" data-rid="'+id+'" role="button" tabindex="0" title="Пройти тест из 10 вопросов">Тест</span>':'')+
      '<span class="pt-topic-heading"><span class="t">'+esc(t)+'</span>'+
      (g?'<span class="g">'+esc(g)+'</span>':'')+'</span>'+
      (ex?'<span class="ex">'+esc(ex)+'</span>':'')+
      gbarHTML(0)+
      '<span class="foot"><span class="status-chip split">'+
      '<span class="lvstep" data-d="-1" role="button" tabindex="0" title="Понизить уровень на 1" aria-label="Понизить уровень"><b>‹</b></span>'+
      '<span class="sn">0</span>'+
      '<span class="lvstep" data-d="1" role="button" tabindex="0" title="Повысить уровень на 1" aria-label="Повысить уровень"><b>›</b></span></span>'+
      '<span class="rread" role="checkbox" aria-checked="false" tabindex="0" title="Отметка для себя: правило уже читал(а). На уровень не влияет."><i aria-hidden="true"></i>читано</span>'+
      tags.map(x=>'<span class="tg '+x+'">'+x+'</span>').join('')+
      '<span class="score" hidden></span>'+lessonRefHTML('words',CARDS[id].level,src,null,t)+'</span>';
    btn.title='Открыть правило';
    btn.addEventListener('click',()=>{ if(RULES[id]) openRule(id); else if(TESTS[id]) openTest(id); else cycle(id); });
    const rr=btn.querySelector('.rread');
    const tg=ev=>{ ev.stopPropagation(); ev.preventDefault(); setRead(id, !readM[id]); };
    rr.addEventListener('click',tg); rr.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key===' ') tg(ev); });
    btn.querySelectorAll('.lvstep').forEach(s=>{
      const go=ev=>{ ev.stopPropagation(); ev.preventDefault(); if(s.getAttribute('aria-disabled')==='true') return; setLevelG(id, glv[id]+(+s.dataset.d)); };
      s.addEventListener('click',go);
      s.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key===' ') go(ev); });
    });
    const topic = el('div', 'pt-topic-card');
    const ai = el('button', 'pt-topic-action pt-topic-ai', 'GPT'); ai.type = 'button'; ai.dataset.topicGpt = id;
    ai.setAttribute('aria-haspopup', 'dialog'); ai.setAttribute('aria-label', 'GPT: объяснение темы ' + t);
    ai.title = 'Объяснить тему в GPT, Claude, Gemini или Qwen';
    ai.addEventListener('click', ev => { ev.stopPropagation(); if (window.PROMPTS) window.PROMPTS.openTopic(id); });
    const youtube = el('a', 'pt-topic-action pt-topic-youtube'); youtube.dataset.topicYoutube = id;
    youtube.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t);
    youtube.target = '_blank'; youtube.rel = 'noopener noreferrer';
    youtube.title = 'Найти на YouTube: ' + t; youtube.setAttribute('aria-label', youtube.title);
    youtube.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="1" y="4" width="22" height="16" rx="4" fill="#ff0033"/><path d="m10 8 6 4-6 4z" fill="#fff"/></svg>';
    topic.append(btn, youtube, ai);
    return topic;
  }

  const board = Board({
    key:'g', root:document.getElementById('mode-g'), branchKey:'ef_skilltree_branch',
    branches:G_BRANCHES.map(b=>Object.assign({}, b, {info:G_BINFO[b.key]})),
    legend:'<span class="lg-scale">уровень правила 0–10</span>'+
      '<span><span class="dot" style="background:var(--lv0)"></span>0 · новое</span>'+
      '<span><span class="dot" style="background:var(--lv3)"></span>1–4 · изучаю</span>'+
      '<span><span class="dot" style="background:var(--lv6)"></span>5–7 · повторяю</span>'+
      '<span><span class="dot" style="background:var(--lv8)"></span>8–9 · знаю</span>'+
      '<span><span class="dot" style="background:var(--lv10)"></span>10 · закреплено</span>',
    range:10,
    footer:'<section><h3>Карточка темы</h3><ul>'+
      '<li>Клик по карточке открывает правило целиком: форма с переводом, когда используем, примеры, исключения и ловушки.</li>'+
      '<li>Кнопка «Тест» справа вверху открывает тест из 10 вопросов. Последний результат виден на карточке. Кнопкой «← Назад» можно пересмотреть прошлые вопросы.</li>'+
      '<li>Кнопка «i» показывает короткую подсказку по теме.</li>'+
      '<li>Галочка «читано» внизу карточки — отметка для себя, что правило уже изучалось. На уровень она не влияет. Кнопка «Быстрый тест» над деревом даёт вопросы вперемешку из всех читанных правил, у которых уровень ещё не 10.</li>'+
      '<li>Метка справа внизу — урок в Student\'s Book своего уровня: 7B = File 7, lesson B; PE = Practical English.</li>'+
      '</ul></section>'+
      '<section><h3>Уровень правила</h3><ul>'+
      '<li>У каждого правила уровень от 0 до 10: 0 — новое, 1–4 — изучаю, 5–7 — повторяю, 8–9 — знаю, 10 — закреплено. Уровни 8–9 зелёные, 10 выделен бирюзовым.</li>'+
      '<li>Фильтр «Уровень от … до …» оставляет яркими только правила в этом диапазоне.</li>'+
      '<li>Кнопка внизу карточки: ‹ понижает уровень на 1, › повышает, в середине — текущий уровень. На странице правила уровень можно поставить сразу, кликом по шкале.</li>'+
      '<li>После теста на 9–10 можно сразу поставить уровень 10.</li>'+
      '<li>Кнопка «Промт» рядом с отработкой даёт задание для любой нейросети: перевод, поиск ошибок, диалог. В конце нейросеть выдаёт код — введи его там же, и уровни правил вырастут по числу верных применений (до +3 за занятие). Ошибки уровень не снижают.</li>'+
      '<li>С уровня 7 правило растёт медленнее: нужно 3 верных ответа подряд, чтобы получить следующий уровень. Шаги копятся между занятиями и тестами, ошибка обнуляет шаги, но не уровень. Прогресс шагов виден на странице правила.</li>'+
      '</ul></section>'+
      '<section><h3>Прогресс</h3><ul>'+
      '<li>Прогресс хранится в артефакте и виден на любом устройстве, если войти в аккаунт Claude. Без входа он хранится только в этом браузере.</li>'+
      '<li>У каждого ученика свой прогресс. Все, у кого есть доступ к странице, видят всех учеников и могут переключаться между ними.</li>'+
      '</ul></section>'+
      '<section><h3>Дерево</h3><ul>'+
      '<li>Ветки идут слева направо, уровни A1–B2 сверху вниз. Дерево можно прокручивать вбок или тянуть мышью.</li>'+
      '<li>Пунктирный ствол значит, что на этом уровне в ветке новой темы нет.</li>'+
      '<li>Объяснения и вопросы написаны для этой схемы в формате English File, это не копия учебника.</li>'+
      '</ul></section>',
    cell:(b,lk)=>(b.cells[lk]||[]).map(cardNode),
    phoneCount:(bk,lk)=>{
      const ids=ALL.filter(id=>CARDS[id].branch===bk && CARDS[id].level===lk);
      return ids.length ? 'ср. '+avgOf(ids) : '—';
    },
    match:(nd,F)=>{ const l=glv[nd.dataset.id]; return l>=F.lo && l<=F.hi; },
  });

  board.root.querySelectorAll('.rbtn').forEach(r=>r.addEventListener('click',ev=>{ ev.stopPropagation(); ev.preventDefault(); openTest(r.dataset.rid); }));
  board.root.querySelectorAll('.rbtn').forEach(r=>r.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.stopPropagation(); ev.preventDefault(); openTest(r.dataset.rid); } }));

  // ---- practice of read rules ----
  const MIXN=20;
  const pr=el('section','review-panel practice-panel');
  pr.setAttribute('aria-label','Отработка изученных тем');
  function practicePool(){ return ALL.filter(id=>readM[id] && glv[id]<GMAX && TESTS[id]); }
  function renderPractice(){
    const pool=practicePool();
    pr.innerHTML='<div class="pr-row"><div class="rv-head"><h2 class="rv-title">Тем для отработки — <span class="pr-count">'+pool.length+'</span></h2></div>'+
      '<div class="rv-big rv-big-one has-prompt">'+
        '<button type="button" class="rvb rvb-mix" data-mix'+(pool.length?'':' disabled')+'><span class="rvb-l">Быстрый<br>тест</span></button>'+
        '<button type="button" class="rvb rvb-prompt" data-practice-ai><span class="rvb-l">Изучать<br>с AI</span></button>'+
      '</div></div>'+
      (pool.length?'':'<p class="pr-empty">Отметь «изучено» на карточках тем с уровнем ниже 10, чтобы запустить быстрый тест. Изучать с AI можно и другие темы.</p>');
  }
  pr.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-mix]'); if(b&&!b.disabled) openMix();
    if(ev.target.closest('[data-practice-ai]') && window.PROMPTS) window.PROMPTS.open('prompt');
  });
  board.root.querySelector('.stats-row').after(pr);
  function openMix(){
    if(needProfile()) return;
    const ids=shuffle(practicePool()); if(!ids.length) return;
    const per=ids.map(id=>shuffle(TESTS[id]).map(q=>({rid:id, q})));
    const qs=[]; let k=0;
    while(qs.length<MIXN && per.some(p=>p.length)){ const p=per[k%per.length]; if(p.length) qs.push(p.shift()); k++; }
    modal.classList.remove('rulepage'); ruleId=null;
    T={mix:true, id:null, title:'Вопросы из '+ids.length+' '+(ids.length===1?'правила':'правил'), kicker:'Отработка читанного', i:0, answers:[], delta:{},
       qs:qs.map(x=>({rid:x.rid, s:x.q[0], a:x.q[1], opts:shuffle(x.q.slice(1))}))};
    openModal(api);
    renderQ();
  }

  // ---- full rule page ----
  let ruleId=null;
  function openRule(id){
    const R=RULES[id]; if(!R) return;
    const card=CARDS[id]; const b=G_BRANCHES.find(x=>x.key===card.branch); const lv=LEVELS.find(l=>l.key===card.level);
    const cell=(b.cells[card.level]||[]).find(c=>c[0]===id)||[];
    T=null; ruleId=id;
    openModal(api);
    modal.classList.add('rulepage');
    const li=arr=>'<ul>'+arr.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>';
    const sc=scores[id];
    modal.innerHTML=mHead('Правило · '+b.name+' · '+card.level+' '+(card.level==='A2'?'Pre-Intermediate':lv.book), card.title,
        TESTS[id]?'<button type="button" class="m-btn ghost m-hbtn" data-act="rtest">Тест</button>':'')+
      '<div class="r-meta">'+(cell[2]?esc(cell[2])+' · ':'')+'урок '+esc(cell[4]||'')+'</div>'+
      '<div class="lesson-links">'+lessonRefHTML('words',card.level,cell[4],null,card.title)+'</div>'+gEdit(id)+readEdit(id)+
      (G_INFO[id]?'<div class="m-rule">'+esc(G_INFO[id])+'</div>':'')+
      '<h3 class="r-h">Форма</h3><div class="r-form">'+R.f.map(r=>{
        if(typeof r==='string') return '<div class="rf-row"><span class="rf-en">'+esc(r)+'</span></div>';
        if(r.length===1) return '<div class="rf-h">'+esc(r[0].replace(/^#/,''))+'</div>';
        return '<div class="rf-row">'+(r[0]?'<span class="rf-en">'+esc(r[0])+'</span>':'')+'<span class="rf-ru'+(r[0]?'':' solo')+'">'+esc(r[1])+'</span></div>';
      }).join('')+'</div>'+
      '<h3 class="r-h">Когда используем</h3>'+li(R.u)+
      '<h3 class="r-h">Примеры</h3><div class="r-ex">'+R.e.map(p=>'<div class="r-row"><div><div class="r-en">'+esc(p[0])+'</div><div class="r-ru">'+esc(p[1])+'</div></div>'+sayBtn(p[0].replace(/\(.*?\)/g,''))+'</div>').join('')+'</div>'+
      '<h3 class="r-h">Исключения и ловушки</h3><ul class="r-x">'+R.x.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>'+
      '<div class="m-actions">'+(TESTS[id]?'<button type="button" class="m-btn ghost" data-act="rtest">Пройти тест'+(sc?' · было '+sc.score+'/'+sc.total:'')+'</button>':'')+
      '<button type="button" class="m-btn" data-act="close">Закрыть</button></div>';
    modal.scrollTop=0;
    const f=modal.querySelector('.m-close'); if(f) f.focus({preventScroll:true});
  }

  function paint(id){
    const n=board.tree.querySelector('.node[data-id="'+id+'"]'); if(!n) return;
    const s=state[id];
    n.dataset.status=s;
    const chip=n.querySelector('.status-chip');
    const l=glv[id];
    chip.querySelector('.sn').textContent=l;
    chip.title = 'Уровень '+l+' из '+GMAX;
    const st=n.querySelectorAll('.lvstep');
    st[0].setAttribute('aria-disabled', l<=0?'true':'false'); st[1].setAttribute('aria-disabled', l>=GMAX?'true':'false');
    const gb=n.querySelector('.gbar'); if(gb) gb.outerHTML=gbarHTML(l);
    n.setAttribute('aria-label', CARDS[id].title+' — уровень '+l+' из '+GMAX+(readM[id]?', читано':'')+'. Открыть правило');
    const rr=n.querySelector('.rread'); if(rr){ rr.setAttribute('aria-checked', readM[id]?'true':'false'); rr.classList.toggle('on', !!readM[id]); }
    n.classList.toggle('is-read', !!readM[id]);
  }
  function paintScore(id){
    const n=board.tree.querySelector('.node[data-id="'+id+'"]'); if(!n) return;
    const s=n.querySelector('.score'); const v=scores[id];
    if(!v){ s.hidden=true; return; }
    s.hidden=false; s.textContent='тест '+v.score+'/'+v.total;
    s.className='score '+(v.score>=9?'good':v.score>=6?'mid':'low');
  }
  function stats(){
    board.refreshPhone();
    const T=ALL.length, started=ALL.filter(id=>glv[id]>0).length;
    const overall=progressStats(ALL.map(id=>glv[id]));
    const byLevel={};
    LEVELS.forEach(l=>{
      const ids=ALL.filter(id=>CARDS[id].level===l.key);
      byLevel[l.key]=progressStats(ids.map(id=>glv[id]));
    });
    const who=currentName();
    board.stat.innerHTML=(who?'<span class="who">'+esc(who)+':</span> ':'')+'знаю '+overall.known+' из '+T+' правил · средний уровень '+avgOf(ALL)+' из '+GMAX+' · начато '+started;
    board.bar.innerHTML=cefrProgressHTML(byLevel);
    G_BRANCHES.forEach(b=>{
      const ids=ALL.filter(id=>CARDS[id].branch===b.key);
      board.H.cnt[b.key].textContent='ср. '+avgOf(ids)+' из '+GMAX;
      board.H.pb[b.key].style.width=(ids.length?sumOf(ids)/(GMAX*ids.length)*100:0)+'%';
    });
    LEVELS.forEach(l=>{
      const ids=ALL.filter(id=>CARDS[id].level===l.key);
      const st=byLevel[l.key];
      board.H.lp[l.key].textContent='знаю '+st.known+' / '+st.t+' · '+st.pct+'%';
      board.H.lb[l.key].style.width=st.pct+'%';
    });
  }
  function refresh(){ ALL.forEach(paint); ALL.forEach(paintScore); stats(); board.applyFilter(); renderPractice(); }

  // ---- persistence ----
  const LKEY='ef_skilltree_v2';
  let unsubP=null, unsubT=null;
  const LKEY10='ef_skilltree_lv10';
  function saveLocal(){ lsSet(LKEY10, JSON.stringify(glv)); }
  const SKEY_ST='ef_rules_steps';
  // st: скрытые шаги; без st (ручная смена уровня) шаги обнуляются
  function setLevelG(id,l,st){
    if(needProfile()) return;
    setG(id,l); stM[id]=glv[id]>=SkillCore.STEP_FROM && glv[id]<GMAX ? (st|0) : 0;
    paint(id); stats(); board.applyFilter(); renderPractice();
    const ed=modal.querySelector('.r-level'); if(ed && ruleId===id) ed.outerHTML=gEdit(id);
    if(db && current && canWrite()) db.collection('profiles/'+current+'/progress').doc(id).set({lv:glv[id], st:stM[id], status:state[id], read:!!readM[id], updatedAt:Date.now()}).catch(onWriteError);
    else if(local){ saveLocal(); lsSet(SKEY_ST, JSON.stringify(stM)); }
  }
  const RKEY='ef_rules_read';
  function setRead(id, on){
    if(needProfile()) return;
    if(on) readM[id]=true; else delete readM[id];
    paint(id); renderPractice();
    const cb=modal.querySelector('[data-rread]'); if(cb && ruleId===id) cb.checked=!!on;
    if(db && current && canWrite()) db.collection('profiles/'+current+'/progress').doc(id).set({lv:glv[id], st:stM[id]||0, status:state[id], read:!!on, updatedAt:Date.now()}).catch(onWriteError);
    else if(local) lsSet(RKEY, JSON.stringify(readM));
  }
  function cycle(id){ if(glv[id]<GMAX) setLevelG(id, glv[id]+1); }
  function markMastered(id){ setLevelG(id, GMAX); }
  function saveScore(id, score, total){
    if(needProfile()) return;
    scores[id]={score,total}; paintScore(id);
    if(db && current && canWrite()) db.collection('profiles/'+current+'/tests').doc(id).set({score, total, at:Date.now()}).catch(onWriteError);
    else if(local) lsSet(LKEY+'_scores', JSON.stringify(scores));
  }
  function select(pid){
    if(unsubP){ unsubP(); unsubP=null; }
    if(unsubT){ unsubT(); unsubT=null; }
    Object.keys(scores).forEach(k=>delete scores[k]);
    Object.keys(readM).forEach(k=>delete readM[k]);
    Object.keys(stM).forEach(k=>delete stM[k]);
    ALL.forEach(id=>setG(id,0));
    refresh();
    if(!pid || !db) return;
    unsubT=db.collection('profiles/'+pid+'/tests').onSnapshot(qs=>{
      if(current!==pid) return;
      Object.keys(scores).forEach(k=>delete scores[k]);
      qs.docs.forEach(doc=>{ const v=doc.data(); if(v && (doc.id in CARDS) && typeof v.score==='number') scores[doc.id]={score:v.score, total:v.total||10}; });
      ALL.forEach(paintScore);
    },()=>{ACCOUNT.denied(pid);});
    unsubP=db.collection('profiles/'+pid+'/progress').onSnapshot(qs=>{
      if(current!==pid) return;
      ALL.forEach(id=>setG(id,0));
      Object.keys(readM).forEach(k=>delete readM[k]);
      Object.keys(stM).forEach(k=>delete stM[k]);
      qs.docs.forEach(doc=>{ const v=doc.data(); if(!v || !(doc.id in state)) return;
        if(v.read) readM[doc.id]=true;
        if(typeof v.st==='number' && v.st>0) stM[doc.id]=v.st|0;
        if(typeof v.lv==='number') setG(doc.id, v.lv);
        else if(STATUS_ORDER.includes(v.status)) setG(doc.id, STATUS_FROM_OLD[v.status]); });
      refresh();
    },()=>{ACCOUNT.denied(pid);});
  }
  function initLocal(){
    try{
      const n=lsGet(LKEY10);
      if(n){ const o=JSON.parse(n); Object.keys(o).forEach(k=>{ if(k in state) setG(k, +o[k]||0); }); }
      else { const o=JSON.parse(lsGet(LKEY)||'{}'); Object.keys(o).forEach(k=>{ if(k in state && o[k] in STATUS_FROM_OLD) setG(k, STATUS_FROM_OLD[o[k]]); }); }
    }catch(e){}
    try{ Object.assign(scores, JSON.parse(lsGet(LKEY+'_scores')||'{}')); }catch(e){}
    try{ const o=JSON.parse(lsGet(RKEY)||'{}'); Object.keys(o).forEach(k=>{ if(k in state && o[k]) readM[k]=true; }); }catch(e){}
    try{ const o=JSON.parse(lsGet(SKEY_ST)||'{}'); Object.keys(o).forEach(k=>{ if(k in state && o[k]>0) stM[k]=o[k]|0; }); }catch(e){}
    refresh();
  }


  async function applyRuleCode(tag,changes){
    if(needProfile())throw Error('Выбери свой профиль.');
    if(!/^[A-Z0-9]{3,32}$/.test(tag))throw Error('Неверный код занятия.');
    if(local){
      changes.forEach(x=>{if(glv[x.id]!==x.from)throw Error('Уровни изменились. Проверь код ещё раз.');});
      changes.forEach(x=>setLevelG(x.id,x.to,x.st));
      return {applied:changes.length};
    }
    // Reserved progress ids use the current access rules and are ignored by the board.
    const pid=current,ledger=db.doc('profiles/'+pid+'/progress/__prompt_'+tag);
    return db.runTransaction(async tx=>{
      if((await tx.get(ledger)).exists)return {alreadyUsed:true,applied:0};
      const refs=changes.map(x=>db.doc('profiles/'+pid+'/progress/'+x.id));
      const snaps=await Promise.all(refs.map(ref=>tx.get(ref)));
      snaps.forEach((snap,i)=>{
        const v=snap.data()||{},level=typeof v.lv==='number'?v.lv:(STATUS_FROM_OLD[v.status]||0);
        if(level!==changes[i].from)throw Error('Уровни изменились. Проверь код ещё раз.');
      });
      changes.forEach((x,i)=>{
        const v=snaps[i].data()||{};
        tx.set(refs[i],{lv:x.to,st:x.st|0,status:gstatus(x.to),read:!!v.read,updatedAt:Date.now()},{merge:true});
      });
      tx.set(ledger,{at:Date.now(),rules:changes.map(x=>x.id)});
      return {applied:changes.length};
    });
  }

  // ---- tests ----
  let T=null;
  function fillGap(sentence, word, cls, wrong){
    const parts=sentence.split('___');
    let before=esc(parts[0]); const after=esc(parts.slice(1).join('___'));
    let w=word;
    if(w==='—'){ w='∅'; }
    else if(w && w.startsWith("'") && before.endsWith(' ')) before=before.slice(0,-1);
    const wr=wrong!=null?'<s class="gap-wrong">'+esc(wrong==='—'?'∅':wrong)+'</s> ':'';
    return before+wr+'<span class="gap'+(cls?' '+cls:'')+'">'+(word==null?'&nbsp;':esc(w))+'</span>'+after;
  }
  function optLabel(o){ return o==='—' ? '— (ничего не нужно)' : o; }
  function head(){ return mHead('Тест · '+T.kicker, T.title); }
  function openTest(id){
    if(needProfile()) return;
    if(!TESTS[id]) return;
    const card=CARDS[id]; const b=G_BRANCHES.find(x=>x.key===card.branch); const lv=LEVELS.find(l=>l.key===card.level);
    modal.classList.remove('rulepage'); ruleId=null;
    T={id, title:card.title, kicker:b.name+' · '+card.level+' '+(card.level==='A2'?'Pre-Intermediate':lv.book), i:0, answers:[],
       qs:shuffle(TESTS[id]).map(q=>({s:q[0], a:q[1], opts:shuffle(q.slice(1))}))};
    openModal(api);
    renderQ();
  }
  function dots(){
    return '<div class="m-dots">'+T.qs.map((q,i)=>{
      const a=T.answers[i]; const c=a==null?(i===T.i?'cur':''):(a===q.a?'ok':'no');
      return '<span class="'+c+'"></span>';
    }).join('')+'</div>';
  }
  function renderQ(){
    const q=T.qs[T.i]; const ans=T.answers[T.i]; const done=ans!=null;
    modal.classList.add('fixed','testm');
    modal.innerHTML=head()+dots()+
      (T.mix?'<div class="m-rid">'+(done?'Правило: '+esc(CARDS[q.rid].title)+' · '+CARDS[q.rid].level:'Правило откроется после ответа')+'</div>':'')+
      '<div class="m-count">Вопрос '+(T.i+1)+' из '+T.qs.length+(done?(ans===q.a?' · <span class="m-okt">верно</span>':' · <span class="m-not">неверно</span>'):'')+'</div>'+
      '<div class="m-q">'+fillGap(q.s, done?q.a:null, done?'ok':'', done&&ans!==q.a?ans:null)+'</div>'+
      '<div class="m-opts">'+q.opts.map((o,k)=>{
        let cls=''; if(done){ if(o===q.a) cls=' ok'; else if(o===ans) cls=' no'; }
        return '<button type="button" class="m-opt'+cls+'" data-opt="'+k+'"'+(done?' disabled':'')+'><span class="k">'+(k+1)+'</span>'+esc(optLabel(o))+'</button>';
      }).join('')+'</div>'+
      '<div class="m-actions">'+(T.i>0?'<button type="button" class="m-btn ghost m-prev" data-act="prev">← Назад</button>':'')+
        (done?'<button type="button" class="m-btn" data-act="next">'+(T.i<T.qs.length-1?'Дальше →':'Результат')+'</button>':'')+'</div>'+
      '<div class="m-note">Клавиши 1–3 — выбрать ответ, Enter — дальше, ← — назад, Esc — закрыть.</div>';
    const f=modal.querySelector(done?'[data-act="next"]':'.m-opt'); if(f) f.focus();
  }
  function choose(k){
    if(!T || T.finished || T.answers[T.i]!=null) return;
    const q=T.qs[T.i]; T.answers[T.i]=q.opts[k];
    if(T.mix){
      // ошибка уровень не снижает; с уровня 7 верный ответ — скрытый шаг, ошибка обнуляет шаги
      const right=T.answers[T.i]===q.a;
      const nx=SkillCore.ruleAdvance(glv[q.rid], stM[q.rid]||0, right?1:0, right?0:1, right?COEF.rulesPractice.ok:0);
      if(!(q.rid in T.delta)) T.delta[q.rid]={from:glv[q.rid], ok:0, no:0};
      T.delta[q.rid][right?'ok':'no']++;
      setLevelG(q.rid, nx.lv, nx.st);
    }
    renderQ();
  }
  function prev(){ if(!T || T.finished || T.i<=0) return; T.i--; renderQ(); }
  function next(){ if(!T || T.answers[T.i]==null) return; if(T.i<T.qs.length-1){ T.i++; renderQ(); } else finish(); }
  function finish(){
    modal.classList.add('fixed','testm');
    const total=T.qs.length, score=T.qs.filter((q,i)=>T.answers[i]===q.a).length;
    if(T.mix){ finishMix(score,total); return; }
    saveScore(T.id, score, total);
    T.finished=true;
    const verdict=score===total?'Отлично — тема освоена.':score>=8?'Хорошо, осталось совсем чуть-чуть.':score>=5?'Стоит повторить правило и пройти ещё раз.':'Начни с правила — оно ниже.';
    const misses=T.qs.map((q,i)=>({q,a:T.answers[i]})).filter(x=>x.a!==x.q.a);
    const canMaster=score>=9 && glv[T.id]<GMAX;
    modal.innerHTML=head()+dots()+
      '<div class="m-score">'+score+' / '+total+'</div><div class="m-verdict">'+verdict+'</div>'+
      (misses.length?'<div class="m-count">Ошибки</div><ul class="m-miss">'+misses.map(x=>
        '<li>'+fillGap(x.q.s, x.q.a, 'ok')+'<div class="yours">твой ответ: '+esc(optLabel(x.a))+'</div></li>').join('')+'</ul>':'')+
      (G_INFO[T.id]?'<div class="m-count" style="margin-top:12px">Правило</div><div class="m-rule">'+esc(G_INFO[T.id])+'</div>':'')+
      '<div class="m-actions">'+
        (canMaster?'<button type="button" class="m-btn ghost" data-act="master">Поставить уровень 10</button>':'')+
        (RULES[T.id]?'<button type="button" class="m-btn ghost" data-act="rule">Правило целиком</button>':'')+
        '<button type="button" class="m-btn ghost" data-act="again">Ещё раз</button>'+
        '<button type="button" class="m-btn" data-act="close">Закрыть</button></div>';
    const f=modal.querySelector('[data-act="again"]'); if(f) f.focus();
  }
  function finishMix(score,total){
    T.finished=true;
    const misses=T.qs.map((q,i)=>({q,a:T.answers[i]})).filter(x=>x.a!=null && x.a!==x.q.a);
    const rows=Object.keys(T.delta).map(id=>({id, d:T.delta[id]}));
    modal.innerHTML=head()+dots()+
      '<div class="m-score">'+score+' / '+total+'</div>'+
      '<div class="m-count">Уровни правил</div><div class="wl mix-res">'+rows.map(r=>
        '<div class="row"><span class="en">'+esc(CARDS[r.id].title)+'</span><span class="ru">верно '+r.d.ok+(r.d.no?' · ошибок '+r.d.no:'')+'</span>'+
        '<span class="chg">'+r.d.from+' → '+glv[r.id]+(glv[r.id]>=SkillCore.STEP_FROM&&glv[r.id]<GMAX?' · шаги '+(stM[r.id]||0)+'/'+SkillCore.STEPS:'')+'</span></div>').join('')+'</div>'+
      (misses.length?'<div class="m-count" style="margin-top:12px">Ошибки</div><ul class="m-miss">'+misses.map(x=>
        '<li><div class="m-rid">'+esc(CARDS[x.q.rid].title)+'</div>'+fillGap(x.q.s, x.q.a, 'ok')+'<div class="yours">твой ответ: '+esc(optLabel(x.a))+'</div></li>').join('')+'</ul>':'')+
      '<div class="m-actions"><button type="button" class="m-btn ghost" data-act="close">Закрыть</button>'+
        (practicePool().length?'<button type="button" class="m-btn" data-act="mixagain">Ещё вопросы</button>':'')+'</div>';
    const f=modal.querySelector('[data-act="mixagain"]')||modal.querySelector('[data-act="close"]'); if(f) f.focus();
  }
  const api = {
    onClick(ev){
      const rc=ev.target.closest('[data-rread]'); if(rc && ruleId){ setRead(ruleId, rc.checked); return; }
      const gs=ev.target.closest('[data-gset]'); if(gs && ruleId){ setLevelG(ruleId, +gs.dataset.gset); return; }
      const o=ev.target.closest('[data-opt]'); if(o){ choose(+o.dataset.opt); return; }
      const a=ev.target.closest('[data-act]'); if(!a) return;
      if(a.dataset.act==='rtest' && ruleId){ openTest(ruleId); return; }
      if(!T) return;
      if(a.dataset.act==='mixagain'){ openMix(); return; }
      if(a.dataset.act==='rule'){ openRule(T.id); return; }
      if(a.dataset.act==='next') next();
      else if(a.dataset.act==='prev') prev();
      else if(a.dataset.act==='again') openTest(T.id);
      else if(a.dataset.act==='master'){ markMastered(T.id); a.remove(); }
    },
    onKey(ev){
      if(!T || T.finished) return;
      if(['1','2','3'].includes(ev.key)){ choose(+ev.key-1); ev.preventDefault(); }
      else if(ev.key==='Enter' && T.answers[T.i]!=null){ next(); ev.preventDefault(); }
      else if(ev.key==='ArrowLeft'){ prev(); ev.preventDefault(); }
      else if(ev.key==='ArrowRight' && T.answers[T.i]!=null){ next(); ev.preventDefault(); }
    },
    onClose(){ T=null; ruleId=null; modal.classList.remove('rulepage'); },
    select, initLocal, stats, refresh, board, openTopic:openRule,
    // для prompts.js: правила с уровнями и отметкой «изучено», смена уровня по коду из нейросети
    rulesData(){ return ALL.map(id=>({id, title:CARDS[id].title, branch:CARDS[id].branch, level:CARDS[id].level, lv:glv[id], st:stM[id]||0, read:!!readM[id]})); },
    setRuleLevel(id,l){ if(id in CARDS) setLevelG(id,l); },
    applyRuleCode,
  };
  return api;
})();

// ================= WORDS mode =================
const W = (function(){
  const MAXL=10, REVL=5, SESSION=Infinity;
  const STATUS_LABEL={not_started:'не начато', learning:'изучаю', review:'повторяю', known:'знаю', mastered:'закреплено'};
  function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'w'; }
  function parseWords(s){
    return s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{
      const p=x.split('|').map(y=>y.trim());
      return {en:p[0], ru:p[1]||'', p:POS_ORDER.includes(p[2])?p[2]:'n', ex:p[3]||'', note:p[4]||'', k:slug(p[0])};
    });
  }
  const CARDS={};
  function addCard(b, l, c, extra){
    const words=parseWords(c[3]);
    words.forEach(w=>{ w.tid=c[0]; if(!w.note && NOTES[c[0]+'|'+w.en]) w.note=NOTES[c[0]+'|'+w.en]; });
    words.forEach(w=>{
      const e=typeof WORD_ENTRY_METADATA==='undefined'?null:WORD_ENTRY_METADATA[c[0]+'|'+w.k];
      if(!e) return;
      if(!e.matches.length) w.p=''; // The source list does not label parts of speech.
      w.note=[w.note,e.variants.length?'Формы: '+e.variants.join(', '):'',e.examples.length?'Сочетания: '+e.examples.join('; '):''].filter(Boolean).join(' · ');
    });
    CARDS[c[0]]={branch:b.key, level:l.key, title:c[1], gloss:c[2], src:c[4]||'', book:typeof WORD_TOPIC_BOOKS==='undefined'?null:WORD_TOPIC_BOOKS[c[0]], tags:POS_ORDER.filter(p=>words.some(w=>w.p===p)), words, extra:!!extra};
  }
  W_BRANCHES.forEach(b=>LEVELS.forEach(l=>(b.cells[l.key]||[]).forEach(c=>addCard(b,l,c,false))));
  W_BRANCHES.forEach(b=>LEVELS.forEach(l=>((b.extra&&b.extra[l.key])||[]).forEach(c=>addCard(b,l,c,true))));
  const ALL=Object.keys(CARDS);

  // prog[cardId][wordKey] = [level, lastReviewedMs, reviews, dueMs, intervalDays, ease]
  const prog={};
  function rec(id,k){
    let latest=prog[id]&&prog[id][k];
    const aliases=(typeof A1_PHRASE_PROGRESS==='undefined'?[]:(A1_PHRASE_PROGRESS[id+'|'+k]||[]))
      .concat(typeof WORD_PROGRESS_ALIASES==='undefined'?[]:(WORD_PROGRESS_ALIASES[id+'|'+k]||[]));
    aliases.forEach(([sourceId,sourceKey])=>{
      const old=prog[sourceId]&&prog[sourceId][sourceKey];
      if(old && (!latest || (+old[1]||0)>(+latest[1]||0))) latest=old;
    });
    return latest||[0,0,0];
  }
  const lvl=(id,k)=>rec(id,k)[0];
  function cardInfo(id){
    const ws=CARDS[id].words;
    let sum=0, learned=0, known=0, seen=0, min=MAXL;
    ws.forEach(w=>{ const r=rec(id,w.k); sum+=r[0]; if(r[0]===MAXL) learned++; if(r[0]>=8) known++; if(r[2]>0||r[0]>0) seen++; if(r[0]<min) min=r[0]; });
    const status=min===MAXL?'mastered':min>=8?'known':min>=REVL?'review':seen?'learning':'not_started';
    return {n:ws.length, sum, pct:Math.round(sum/(MAXL*ws.length)*100), learned, known, status};
  }
  function band(l){ return l>=MAXL?'m':l>=8?'k':l>=REVL?'r':l>0?'l':'0'; }
  // spaced repetition: Anki-like SM-2; the 0–10 level is derived from the current interval
  const DAY=864e5, MIN=6e4;
  const IVL_FOR_LEVEL=[0,0,1,2.5,5,10,17,30,60,120,180];
  function lvFromIvl(ivl, seen){
    if(ivl>=180) return 10; if(ivl>=90) return 9; if(ivl>=45) return 8; if(ivl>=25) return 7; if(ivl>=14) return 6;
    if(ivl>=7) return 5; if(ivl>=4) return 4; if(ivl>=2) return 3; if(ivl>=1) return 2; return seen?1:0;
  }
  // largest interval that still keeps the current level (e.g. 1.9 days for level 2)
  function lvlCeil(ivl){ for(const t of [2,4,7,14,25,45,90,180]) if(ivl<t) return t-0.1; return Infinity; }
  // due dates of 1+ day fall on the start of a "study day" (04:00 local), like Anki
  function dueDay(now, days){ const d=new Date(now-4*36e5); d.setDate(d.getDate()+days); d.setHours(4,0,0,0); return d.getTime(); }
  // Оценки двигают уровень на фиксированный шаг: «Забыл» −2, «Трудно» 0, «Хорошо» +1, «Отлично» +2.
  // Срок следующего показа — интервал нового уровня (таблица ниже). На уровне 10 интервал продолжает расти.
  const GRADE_MAX=10;
  const GRADE_STEP={again:-2, hard:0, good:1, easy:2};
  const GRADE_IVL=[0.5,0.5,1,2.5,5,10,17,30,60,120,180]; // дней до показа для уровня 0–10
  function sched(r,g,now){
    const R=COEF.review, cap=x=>Math.min(R.maxIvl, x);
    let ivl=r[4]||0, ease=r[5]||2.5, due;
    const cur=Math.max(0,Math.min(GRADE_MAX,r[0]|0));
    // повтор раньше срока (слово ещё не пора показывать): «Хорошо» и «Отлично» не поднимают уровень и не сдвигают срок
    const early=ivl>0 && r[3]>now;
    if(g==='reset'){ return {due:0, ivl:0, ease:2.5, lv:0}; }
    if(g==='known'){ // «Я знаю»: first 45 days (level 8), then level 9 (90+), then level 10 (180+)
      // a correctly typed word below level 8 always goes to level 8 — even before its due date
      // or right after «Забыл»; levels 9 and 10 only come on checks that are due
      const late=(ivl>0 && r[3] && !early)?Math.max(0,Math.floor((now-r[3])/DAY)):0;
      if(ivl<45) ivl=45;
      else if(early) return {due:r[3], ivl, ease, lv:r[0]};
      else { const gr=Math.max(ivl+1, (ivl+late/2)*ease); ivl=ivl<90?Math.min(179.9,Math.max(90,gr)):ivl<180?Math.max(180,gr):gr; }
      ivl=cap(Math.round(ivl*10)/10);
      return {due:dueDay(now, Math.max(1,Math.round(ivl))), ivl, ease:Math.round(ease*100)/100, lv:lvFromIvl(ivl, true)};
    }
    if(early && (g==='good' || g==='easy')) return {due:r[3], ivl, ease, lv:cur};
    const lv=Math.max(0,Math.min(GRADE_MAX, cur+(GRADE_STEP[g]||0)));
    if(g==='again'){ if(ivl>=1) ease=Math.max(1.3,ease-0.2); }
    else if(g==='hard'){ if(ivl>=1) ease=Math.max(1.3,ease-0.15); }
    else if(g==='easy') ease=ease+0.15;
    if(g==='again' && lv<=1){ ivl=0; due=now+10*MIN; } // слабое слово вернётся через 10 минут, ещё в этой сессии
    else {
      ivl=GRADE_IVL[lv];
      if(lv===GRADE_MAX && cur===GRADE_MAX && g!=='hard' && g!=='again') ivl=Math.max(ivl,(r[4]||0)*ease); // закреплённое слово уходит всё дальше
      ivl=cap(Math.round(ivl*10)/10);
      due= ivl<1 ? now+ivl*DAY : dueDay(now, Math.max(1,Math.round(ivl)));
    }
    return {due, ivl, ease:Math.round(ease*100)/100, lv};
  }
  // when the word comes back: whole days for 1+ day intervals, minutes/hours for short steps
  function whenLabel(ivl, due, now){ return ivl>=1 ? ivlLabel(Math.max(1,Math.round(ivl))*DAY) : ivlLabel(Math.max(0,due-now)); }
  function ivlLabel(ms){
    if(ms<60*MIN) return Math.max(1,Math.round(ms/MIN))+' мин';
    if(ms<DAY*0.9) return Math.round(ms/36e5)+' ч';
    const d=ms/DAY; if(d<1.5) return '1 дн.';
    if(d<60) return Math.round(d)+' дн.';
    if(d<345) return Math.round(d/30)+' мес.';
    return (Math.round(d/36.5)/10)+' г.';
  }
  const isDue=(r,now)=>(r[3] ? r[3]<=now : (r[2]>0||r[0]>0));
  const isNew=r=>!r[3] && !r[2] && !r[0];
  function lvlHTML(l){ let h='<span class="lvl" data-b="'+band(l)+'" data-l="'+l+'" title="уровень '+l+' из '+MAXL+'">'; for(let i=1;i<=MAXL;i++) h+='<i class="'+(i<=l?'on':'')+'"></i>'; return h+'</span>'; }
  function trHTML(w){
    const t=(typeof WORD_TR!=='undefined')&&WORD_TR[w.k]; if(!t) return '';
    return '<div class="trn"><span class="ipa">/'+esc(t[0])+'/</span><span class="rus">'+esc(t[1])+'</span></div>';
  }
  function extraHTML(w){
    const ck=w.tid+'|'+w.k, own=typeof WORD_EX_CARD!=='undefined'&&Object.prototype.hasOwnProperty.call(WORD_EX_CARD,ck);
    const support=typeof WORD_DETAILS==='undefined'?null:WORD_DETAILS[ck];
    const d=own?WORD_EX_CARD[ck]:(typeof WORD_EX!=='undefined')&&WORD_EX[w.k];
    if(!d && !support) return '';
    let [forms,irr,s,p,pf,c,syn,ant,rx,nn]=d||[null,0,'','','','',[],[],'',null];
    if(!own && w.p){
      // WORD_EX is keyed by spelling, so homographs share one entry (park n/v, orange n/adj).
      // Show only the parts that belong to this word's part of speech.
      const K=nn?'n':(forms&&!d.vf)?'v':'x';
      const R=(w.p==='o'&&/\s/.test(w.en)&&forms)?'v':w.p;
      const hide=R==='v'?K!=='v':R==='n'?K!=='n':R==='a'?K!=='x':K==='v';
      if(R!=='v') forms=null;
      if(R==='v'||R==='a') nn=null;
      if(hide){ s=p=pf=c=''; syn=ant=null; if(K==='n') nn=null; }
    }
    const re=rx?new RegExp('\\b(?:'+rx+')\\w*','gi'):null;
    const hl=t=>{ const e=esc(t); return re?e.replace(re,m=>'<b>'+m+'</b>'):e; };
    let h='<div class="wx">';
    if(forms) h+='<div class="wx-forms">'+forms.map(esc).join(' · ')+' <span class="'+(irr?'irr':'reg')+'">'+(irr?'неправильный':'правильный')+'</span></div>';
    if(nn){
      const CN={C:['исчисляемое','c'],U:['неисчисляемое','u'],CU:['исчисляемое и неисчисляемое','cu'],PL:['только мн. ч.','pl'],SG:['без мн. ч.','sg']}[nn[1]]||['',''];
      h+='<div class="wx-forms wx-noun">'+(nn[1]==='PL'?'мн. ч. <b>'+esc(nn[0])+'</b>':
          '<b>'+esc(w.en)+'</b>'+(nn[0]?' · мн. ч. <b>'+esc(nn[0])+'</b>':''))+
        ' <span class="cnt cnt-'+CN[1]+'">'+CN[0]+'</span>'+(nn[2]?'<div class="wx-cn">'+esc(nn[2])+'</div>':'')+'</div>';
    }
    const NUM={sg:'ед. ч.', pl:'мн. ч.'};
    const rows=[['Present Simple',s,nn&&nn[3][0]],['Past Simple',p,''],['Present Perfect',pf,nn&&nn[3][2]],['Present Continuous',c,nn&&nn[3][3]]].filter(r=>r[1]);
    if(rows.length) h+='<div class="wx-ex">'+rows.map(r=>'<div><span class="lb">'+r[0]+(r[2]&&NUM[r[2]]?' · '+NUM[r[2]]:'')+'</span><p><span class="trt">'+hl(r[1])+'</span><span class="btns">'+trBtn(r[1])+sayBtn(r[1])+'</span></p></div>').join('')+'</div>';
    // A sentence-level example is labelled as an example, without assigning it a false tense.
    if(support && support[0].length) h+='<div class="wx-ex">'+support[0].map(([en,ru])=>
      '<div><span class="lb">Пример</span><p><span class="trt">'+hl(en)+'</span><span class="btns">'+
      (ru?'<button type="button" class="trb" data-tr="'+esc(ru)+'" aria-label="Перевести на русский" title="Перевод">RU</button>':trBtn(en))+
      sayBtn(en)+'</span></p></div>').join('')+'</div>';
    if(support){ if(!syn || !syn.length) syn=support[1]; if(!ant || !ant.length) ant=support[2]; }
    const note=support&&support[3]===1
      ? ['У числа нет прямого лексического синонима.','У числа нет прямого лексического антонима.']
      : support&&support[3]===2
      ? ['Для этого названия прямой синоним не приводится.','У этого названия нет прямого антонима.']
      : ['Однозначная замена для этого значения не приведена; она зависит от контекста.','Прямой антоним для этого значения не приведён.'];
    const lst=(t,a,n)=>'<div class="wx-syn"><span class="lb">'+t+'</span>'+
      (a&&a.length?a.map(x=>'<em>'+esc(x[0])+(x[1]?' <i>- '+esc(x[1])+'</i>':'')+'</em>').join(''):'<span class="hint">'+esc(n)+'</span>')+'</div>';
    h+=lst('Синонимы и близкие выражения',syn,note[0])+lst('Антонимы и противоположные выражения',ant,note[1]);
    return h+'</div>';
  }
  function exampleHTML(w){
    const ex=w.ex; if(!ex) return '';
    const low=ex.toLowerCase();
    const variants=w.en.split('/').flatMap(v=>v.split('…')).map(v=>v.replace(/[?.!]/g,'').replace(/\s+/g,' ').trim()).filter(Boolean);
    for(const v of variants){
      const vl=v.toLowerCase(); if(vl.length<2 && vl!=='i') continue;
      let i=low.indexOf(vl);
      while(i>=0){
        const before=i===0?' ':low[i-1];
        if(!/[a-z]/.test(before)){
          let end=i+vl.length;
          if(!/\s/.test(vl)) while(end<ex.length && /[a-z]/i.test(ex[end])) end++;
          return esc(ex.slice(0,i))+'<b>'+esc(ex.slice(i,end))+'</b>'+esc(ex.slice(end));
        }
        i=low.indexOf(vl, i+1);
      }
    }
    return esc(ex);
  }
  const AKEY='ef_wordtree_autosay';
  let autoSay = lsGet(AKEY)!=='0';

  function cardNode(c){
    const id=c[0], card=CARDS[id];
    const btn=el('button','node'); btn.type='button'; btn.dataset.id=id; btn.dataset.status='not_started'; btn.title='Открыть список слов';
    btn.innerHTML=
      '<span class="wbtn wtest" data-wid="'+id+'" role="button" tabindex="0" title="Учить карточками">Тест</span>'+
      '<span class="t">'+esc(card.title)+'</span><span class="g">'+esc(card.gloss)+'</span>'+
      '<span class="wbar">'+card.words.map(()=>'<i data-l="0"></i>').join('')+'</span>'+
      '<span class="word-count"></span>'+
      '<span class="foot"><span class="status-chip">'+STATUS_LABEL.not_started+'</span>'+
      lessonRefHTML('rules',card.level,card.src,card.book,card.title)+'</span>';
    if(card.extra) btn.classList.add('xnode');
    btn.addEventListener('click',()=>openList(id));
    return btn;
  }
  const LOCK_SVG='<svg class="lockico" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5.5" width="8" height="5.5" rx="1.2" fill="currentColor"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  function xsepNode(lk){ const d=el('div','xsep'); d.innerHTML='<span>Экстра '+lk+'</span>'; return d; }
  // extra topics of a level open when every main topic of that level is closed
  // extra topics of a branch at a level open when the main topics of that branch and level are 75% done
  const UNLOCK_PCT=75;
  const OPEN={};
  const okey = id => CARDS[id].branch+'|'+CARDS[id].level;
  function mainIds(bk, lk){ return ALL.filter(id=>CARDS[id].branch===bk && CARDS[id].level===lk && !CARDS[id].extra); }
  function mainPct(bk, lk){ const ids=mainIds(bk, lk); return ids.length ? wordsOf(ids).pct : 100; }
  function computeOpen(){ W_BRANCHES.forEach(b=>LEVELS.forEach(l=>{ OPEN[b.key+'|'+l.key] = mainPct(b.key, l.key) >= UNLOCK_PCT; })); }
  const isLocked = id => CARDS[id].level!=='A1' && CARDS[id].extra && !OPEN[okey(id)];
  function planNode(p){
    const d=el('div','node plan');
    d.innerHTML='<span class="t">'+esc(p[0])+'</span><span class="g">'+esc(p[1])+'</span><span class="soon">в плане</span>';
    return d;
  }
  function wordsOf(ids){
    let t=0, sum=0, learned=0, known=0, rev=0, lrn=0;
    const counts=Array(11).fill(0);
    ids.forEach(id=>CARDS[id].words.forEach(w=>{ const l=lvl(id,w.k); t++; sum+=l; counts[l]++; if(l===MAXL) learned++; if(l>=8) known++; else if(l>=REVL) rev++; else if(l>=1) lrn++; }));
    return {t, sum, learned, known, rev, lrn, counts, pct:t?Math.round(sum/(MAXL*t)*100):0};
  }

  const board = Board({
    key:'w', root:document.getElementById('mode-w'), branchKey:'ef_wordtree_branch',
    branches:W_BRANCHES,
    legend:'<span><span class="dot" style="background:var(--lv0)"></span>0 · новое</span>'+
      '<span><span class="dot" style="background:var(--lv3)"></span>1–4 · изучаю</span>'+
      '<span><span class="dot" style="background:var(--lv6)"></span>5–7 · повторяю</span>'+
      '<span><span class="dot" style="background:var(--lv8)"></span>8–9 · знаю</span>'+
      '<span><span class="dot" style="background:var(--lv10)"></span>10 · закреплено</span>',
    statusLabel:'Тема', statusChips:[['all','Все'],['not_started','Не начато'],['learning','Изучаю'],['review','Повторяю'],['mastered','Закрыто']],
    tagLabel:'Часть речи', tagChips:[['all','все'],['n','noun','Наборы с существительными'],['v','verb','Наборы с глаголами'],['a','adj','Наборы с прилагательными'],['o','other','Фразы, предлоги, союзы, наречия']],
    footer:'<section><h3>Сессия карточек</h3><ul>'+
      '<li>Клик по карточке темы открывает список слов с примерами и уровнями. Кнопка «Тест» справа запускает сессию карточек из всех невыученных слов темы (если выучены все — из всех слов на повторение): видишь слово по-русски, вспоминаешь английское, открываешь ответ с примером и оцениваешь себя.</li>'+
      '<li>Слова идут в случайном порядке.</li>'+
      '<li>В списке слов уровень можно поменять вручную: «−» и «+» или клик по шкале. Слово получит интервал этого уровня (например, 7 — повтор через месяц).</li>'+
      '</ul></section>'+
      '<section><h3>Оценки и уровень</h3><ul>'+
      '<li>Оценки меняют уровень слова: «Забыл» — −2, «Трудно» — уровень не меняется, «Хорошо» — +1, «Отлично» — +2. Слово вернётся через срок нового уровня (например, уровень 5 — через 10 дней); если после «Забыл» уровень стал 0 или 1 — через 10 минут, ещё раз в этой сессии. Если слово открыто раньше срока, «Хорошо» и «Отлично» уровень не поднимают. Под кнопкой видно, когда слово вернётся и какой у него станет уровень (например, «ур. 2 → 3»).</li>'+
      '<li>Уровень 0–10 показывает интервал и степень знания: 0 — новое, 1–4 — изучаю, 5–7 — повторяю, 8–9 — знаю, 10 — закреплено. Уровни 8–9 зелёные, 10 выделен бирюзовым.</li>'+
      '<li>Кнопка «Я знаю» на лицевой стороне открывает поле: впиши слово по-английски. Если верно — уровень 8 и проверка через 45 дней; на следующих проверках верный ответ поднимает до 9, потом до 10. Верный ответ всегда даёт минимум уровень 8 — даже если срок слова ещё не подошёл или ты его недавно забыл. Если нет — открывается ответ, и слово оцениваешь как обычно. «Обнулить» возвращает слово в новые.</li>'+
      '<li>«← Предыдущее слово» возвращает к прошлой карточке и отменяет её оценку, чтобы можно было оценить заново.</li>'+
      '<li>Переводы: слово переведено верно — как «Хорошо», с ошибкой — как «Трудно», неверно — как «Забыл».</li>'+
      '</ul></section>'+
      '<section><h3>Прогресс темы</h3><ul>'+
      '<li>Полоска на карточке — все слова темы, по сегменту на слово.</li>'+
      '<li>Шкала слова — от 0 до 10. Тема «повторяю», когда все слова дошли до 5, «знаю» — когда все дошли до 8, и «закреплено» — когда все на 10.</li>'+
      '</ul></section>'+
      '<section><h3>Повторение слов</h3><ul>'+
      '<li>Блок «Повторение слов» над деревом работает как Anki: после оценки слово получает срок следующего повтора.</li>'+
      '<li>В блоке «Повторение слов» включи нужные уровни. «Повторить» — все слова, у которых подошёл срок; «Изучать базовые» и «Изучать Экстра» — все новые слова из основных или экстра-тем подряд, пока не закончатся. Окно можно закрыть в любой момент — прогресс сохраняется после каждого слова.</li>'+
      '<li>Слова на уровне 10 считаются выученными, но всё равно возвращаются на проверку — не чаще раза в полгода–год.</li>'+
      '</ul></section>'+
      '<section><h3>Лексика по учебнику</h3><ul>'+
      '<li>A1 — English File Beginner, A2 — English File Elementary (4th edition). В этих уровнях только то, что учебник ставит целью выучить: Vocabulary Bank, лексика урока, Words and phrases to learn и фразы Practical English. Метка на карточке — код урока, например 4A или PE 3.</li>'+
      '<li>Дополнительная лексика Pre-Intermediate и Intermediate распределена по обычным темам как Экстра. Экстра-темы открываются отдельно для каждой ветки, когда её основные темы на этом уровне пройдены на 75%.</li>'+
      '</ul></section>',
    cell:(b,lk)=>{
      const main=(b.cells[lk]||[]).map(cardNode);
      const ex=((b.extra&&b.extra[lk])||[]);
      return main.concat(ex.length ? [xsepNode(lk)].concat(ex.map(cardNode)) : []).concat(((b.plan&&b.plan[lk])||[]).map(planNode));
    },
    phoneCount:(bk,lk)=>{
      const ids=ALL.filter(id=>CARDS[id].branch===bk && CARDS[id].level===lk && (lk!=='A1'||!CARDS[id].extra));
      if(!ids.length) return 'в плане';
      const ws=wordsOf(ids); return 'знаю '+ws.known+' / '+ws.t;
    },
    match:(nd,F)=>{ const id=nd.dataset.id; return (F.status==='all'||nd.dataset.status===F.status) && (F.tag==='all'||CARDS[id].tags.includes(F.tag)); },
  });
  board.root.querySelectorAll('.wbtn').forEach(t=>t.addEventListener('click',ev=>{ ev.stopPropagation(); ev.preventDefault(); openSession(t.dataset.wid); }));
  board.root.querySelectorAll('.wbtn').forEach(t=>t.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.stopPropagation(); ev.preventDefault(); openSession(t.dataset.wid); } }));

  function paint(id){
    const n=board.tree.querySelector('.node[data-id="'+id+'"]'); if(!n) return;
    const ci=cardInfo(id);
    n.dataset.status=ci.status;
    const locked=isLocked(id);
    n.classList.toggle('locked', locked);
    n.querySelector('.status-chip').innerHTML = locked ? LOCK_SVG+'с '+UNLOCK_PCT+'%' : esc(STATUS_LABEL[ci.status]);
    const segs=n.querySelectorAll('.wbar i');
    CARDS[id].words.forEach((w,i)=>{ const l=lvl(id,w.k); segs[i].dataset.l=l; segs[i].dataset.b=band(l); });
    n.querySelector('.word-count').textContent='знаю '+ci.known+'/'+ci.n+' · '+ci.pct+'%';
    n.setAttribute('aria-label', CARDS[id].title+(locked?': экстра-тема, откроется, когда основные темы ветки на этом уровне будут пройдены на '+UNLOCK_PCT+'%':': '+STATUS_LABEL[ci.status]+', знаю '+ci.known+' из '+ci.n+' слов. Открыть карточки'));
  }
  function stats(){
    board.refreshPhone();
    if(panelReady) renderPanel();
    const s=wordsOf(ALL);
    const closed=ALL.filter(id=>cardInfo(id).status==='mastered').length;
    const byLevel={};
    LEVELS.forEach(l=>{ byLevel[l.key]=wordsOf(ALL.filter(id=>CARDS[id].level===l.key)); });
    const who=currentName();
    board.stat.innerHTML=(who?'<span class="who">'+esc(who)+':</span> ':'')+
      'знаю '+s.known+' из '+s.t+' слов · закреплено '+s.learned+' · повторяю '+s.rev+' · изучаю '+s.lrn+' · тем закреплено '+closed;
    board.bar.innerHTML=cefrProgressHTML(byLevel);
    W_BRANCHES.forEach(b=>{
      const ws=wordsOf(ALL.filter(id=>CARDS[id].branch===b.key));
      board.H.cnt[b.key].textContent='знаю '+ws.known+' / '+ws.t+' · '+ws.pct+'%';
      board.H.pb[b.key].style.width=ws.pct+'%';
    });
    LEVELS.forEach(l=>{
      const ids=ALL.filter(id=>CARDS[id].level===l.key);
      const ws=byLevel[l.key];
      board.H.lp[l.key].textContent=ids.length ? 'знаю '+ws.known+' / '+ws.t+' · '+ws.pct+'%' : 'в плане';
      board.H.lb[l.key].style.width=ws.pct+'%';
    });
    document.dispatchEvent(new Event('wordprogress'));
  }
  function refresh(){ computeOpen(); ALL.forEach(paint); stats(); board.applyFilter(); }

  // ---- modal content ----
  let S=null;
  function head(id, what){
    const c=CARDS[id]; const b=W_BRANCHES.find(x=>x.key===c.branch); const lv=LEVELS.find(l=>l.key===c.level);
    const book=typeof TEXTBOOK_BOOKS==='undefined'?null:TEXTBOOK_BOOKS[c.book];
    return mHead(what+' · '+b.name+' · '+c.level+' '+(book?.title||lv.book), c.title);
  }
  function lvlEdit(id,w){
    const l=lvl(id,w.k), k=esc(w.k);
    if(!canWrite()) return '<span class="access-note">Уровень '+l+' / '+MAXL+' · просмотр</span>';
    let h='<span class="lvle" data-k="'+k+'" data-l="'+l+'" data-b="'+band(l)+'" role="group" aria-label="Уровень слова '+esc(w.en)+'">'+
      '<button type="button" class="lvb" data-setl="'+Math.max(0,l-1)+'" title="Понизить уровень"'+(l<=0?' disabled':'')+' aria-label="Понизить">−</button>'+
      '<span class="lvsegs">';
    for(let i=1;i<=MAXL;i++) h+='<button type="button" class="lvs'+(i<=l?' on':'')+'" data-setl="'+(i===l?i-1:i)+'" title="'+(i===l?'Понизить до '+(i-1):'Поставить уровень '+i)+'" aria-label="уровень '+i+'"></button>';
    return h+'</span><span class="lvn">'+l+'</span>'+
      '<button type="button" class="lvb" data-setl="'+Math.min(MAXL,l+1)+'" title="Повысить уровень"'+(l>=MAXL?' disabled':'')+' aria-label="Повысить">+</button></span>';
  }
  function setLevel(id,k,l){
    if(needProfile()) return;
    l=Math.max(0,Math.min(MAXL,l|0));
    const r=rec(id,k);
    if(r[0]===l) return;
    if(!prog[id]) prog[id]={};
    const now=Date.now(), iv=IVL_FOR_LEVEL[l];
    prog[id][k]= l===0 ? [0, now, r[2]||0] : [l, now, Math.max(1,r[2]||0), l===1?now:dueDay(now, Math.max(1,Math.round(iv))), iv, r[5]||2.5];
    const wasOpen=OPEN[okey(id)];
    computeOpen();
    if(OPEN[okey(id)]!==wasOpen) ALL.forEach(paint); else paint(id);
    stats(); board.applyFilter();
    saveCard(id,k);
    const w=CARDS[id].words.find(x=>x.k===k);
    const edits=modal.querySelectorAll((S&&S.mode==='course-list'?'[data-tid="'+id+'"] ':'')+'.lvle[data-k="'+CSS.escape(k)+'"]');
    if(w) edits.forEach(edit=>{edit.outerHTML=lvlEdit(id,w);});
    const sm=modal.querySelector('.m-sum'); if(sm) sm.outerHTML=S&&S.mode==='course-list'?courseSummary(courseWords(S.course,S.section,S.part)):cardSummary(id);
  }
  function cardSummary(id){
    const ci=cardInfo(id);
    return '<div class="m-sum"><span class="wbar">'+CARDS[id].words.map(w=>'<i data-l="'+lvl(id,w.k)+'" data-b="'+band(lvl(id,w.k))+'"></i>').join('')+'</span>'+
      '<span>'+ci.pct+'% · знаю '+ci.known+' / '+ci.n+(ci.learned?' · закреплено '+ci.learned:'')+'</span></div>';
  }
  function openList(id){
    const c=CARDS[id];
    S={mode:'list', id};
    openModal(api);
    modal.innerHTML=head(id,'Слова')+
      '<div class="m-gloss">'+esc(c.gloss)+' · '+c.words.length+' слов</div>'+
      '<div class="lesson-links">'+lessonRefHTML('rules',c.level,c.src,c.book,c.title)+'</div>'+cardSummary(id)+
      '<div class="wl">'+c.words.map(w=>
        '<div class="row" data-word-id="'+esc(id)+'" data-word-key="'+esc(w.k)+'"><span class="en">'+esc(w.en)+'</span><span class="ru">'+esc(w.ru)+'</span>'+
        (w.p?'<span class="tg '+w.p+'" title="'+esc(POS_RU[w.p])+'">'+POS_NAME[w.p]+'</span>':'')+lvlEdit(id,w)+sayBtn(w.en)+
        (w.note?'<span class="exl nt">'+esc(w.note)+'</span>':'')+
        (w.ex?'<span class="exl">'+exampleHTML(w)+'</span>':'')+'</div>').join('')+'</div>'+
      '<div class="m-actions"><button type="button" class="m-btn ghost" data-act="close">Закрыть</button>'+
      (isLocked(id)?'<span class="hint" style="align-self:center">откроется с '+UNLOCK_PCT+'% основных тем ветки</span>':'<button type="button" class="m-btn" data-act="session">Учить карточками</button>')+'</div>';
    const f=modal.querySelector('[data-act="session"]'); if(f) f.focus();
  }
  // A lesson can contain words introduced in earlier lessons. References keep
  // their canonical topic/word keys throughout lists, reviews and manual edits.
  function courseWords(courseId,sectionIndex,part='base'){
    const lesson=BEGINNER_COURSE.find(l=>l.id===courseId); if(!lesson) return [];
    const sections=sectionIndex==null?lesson.sections:[lesson.sections[sectionIndex]];
    const seen=new Set(), out=[];
    sections.filter(Boolean).forEach(section=>section.refs.forEach(([id,k,en,ru])=>{
      const key=id+'|'+k, source=CARDS[id]&&CARDS[id].words.find(w=>w.k===k);
      if(!source||seen.has(key)||(part==='base'&&CARDS[id].extra)||(part==='extra'&&!CARDS[id].extra)) return;
      seen.add(key); out.push({...source,en,ru,tid:id});
    }));
    return out;
  }
  function courseInfo(courseId,sectionIndex,part='base'){
    const words=courseWords(courseId,sectionIndex,part), now=Date.now();
    const s=progressStats(words.map(w=>lvl(w.tid,w.k)));
    return {...s, due:words.filter(w=>isDue(rec(w.tid,w.k),now)).length, fresh:words.filter(w=>isNew(rec(w.tid,w.k))).length};
  }
  function courseSummary(words){
    const s=progressStats(words.map(w=>lvl(w.tid,w.k)));
    return '<div class="m-sum"><span class="wbar">'+words.map(w=>'<i data-l="'+lvl(w.tid,w.k)+'" data-b="'+band(lvl(w.tid,w.k))+'"></i>').join('')+'</span><span>'+s.pct+'% · знаю '+s.known+' / '+s.t+'</span></div>';
  }
  function openCourseList(courseId,sectionIndex,part='base'){
    const lesson=BEGINNER_COURSE.find(l=>l.id===courseId); if(!lesson) return;
    const sections=sectionIndex==null?lesson.sections:[lesson.sections[sectionIndex]];
    S={mode:'course-list',course:courseId,section:sectionIndex,part};
    openModal(api);
    const partName=part==='base'?'Базовая лексика':part==='extra'?'Дополнительная лексика':'Все слова';
    modal.innerHTML=mHead((lesson.bookTitle||'Beginner')+' · '+lesson.label+' · '+partName,lesson.title)+
      '<div class="m-gloss">'+esc(lesson.ru)+'<br>'+esc(lesson.source)+'</div>'+
      '<div class="lesson-links">'+lessonRefHTML('rules',lesson.ruleLevel||'A1',lesson.code||lesson.label,lesson.book,lesson.title)+'</div>'+courseSummary(courseWords(courseId,sectionIndex,part))+
      sections.filter(Boolean).map(section=>{const refs=section.refs.filter(([id])=>part==='all'||(part==='extra')===CARDS[id].extra);if(!refs.length)return '';return '<section class="course-word-section"><h3>'+esc(section.title)+'</h3><div class="wl">'+refs.map(([id,k,en,ru])=>{
        const w=CARDS[id].words.find(w=>w.k===k);
        return '<div class="row" data-word-id="'+esc(id)+'" data-word-key="'+esc(k)+'"><span class="en">'+esc(en)+'</span><span class="ru">'+esc(ru)+'</span>'+
          (w.p?'<span class="tg '+w.p+'">'+POS_NAME[w.p]+'</span>':'')+'<span class="course-level" data-tid="'+id+'">'+lvlEdit(id,w)+'</span>'+sayBtn(en)+
          (w.note?'<span class="exl nt">'+esc(w.note)+'</span>':'')+(w.ex?'<span class="exl">'+exampleHTML(w)+'</span>':'')+'</div>';
      }).join('')+'</div></section>';}).join('')+
      '<div class="m-actions"><button type="button" class="m-btn ghost" data-act="close">Закрыть</button><button type="button" class="m-btn" data-act="course-session">Отработать '+(sectionIndex==null?'урок':'подтему')+'</button></div>';
  }
  function openCourseSession(courseId,sectionIndex,part='base'){
    if(needProfile()) return;
    const lesson=BEGINNER_COURSE.find(l=>l.id===courseId); if(!lesson) return;
    const now=Date.now(), words=courseWords(courseId,sectionIndex,part);
    const q=shuffle(words.filter(w=>{const r=rec(w.tid,w.k);return isNew(r)||isDue(r,now);}));
    S={mode:'session',course:courseId,section:sectionIndex,part,lv:lesson.label,lvs:[lesson.level||'A1'],kind:'lesson',queue:q,wait:[],done:0,flipped:false,start:{},fails:{},seen:[],hist:[]};
    q.forEach(w=>{S.start[w.tid+'|'+w.k]=lvl(w.tid,w.k);});
    openModal(api);
    if(!q.length){
      S.mode='done';
      modal.innerHTML=lvHead()+'<p class="m-verdict">Новых слов и слов к повторению сейчас нет. Весь список урока доступен для просмотра.</p><div class="m-actions"><button type="button" class="m-btn ghost" data-act="course-list">Все слова</button><button type="button" class="m-btn" data-act="close">Закрыть</button></div>';
      return;
    }
    renderCard();
  }
  function pickWords(id){
    const ws=CARDS[id].words,now=Date.now();
    const open=ws.filter(w=>{const r=rec(id,w.k);return isNew(r)||isDue(r,now);});
    const pool=shuffle(open).sort((a,b)=>{const ra=rec(id,a.k),rb=rec(id,b.k);return ra[0]-rb[0]||ra[1]-rb[1];});
    return {words:pool.slice(0,SESSION),review:!open.some(w=>isNew(rec(id,w.k)))};
  }
  function openLocked(id){
    const c=CARDS[id], lk=c.level, br=W_BRANCHES.find(x=>x.key===c.branch), ids=mainIds(c.branch, lk), pct=mainPct(c.branch, lk);
    S={mode:'locked', id};
    openModal(api);
    modal.innerHTML=head(id,'Экстра-тема')+
      '<div class="lockmsg">'+LOCK_SVG+'<div>Эта тема откроется, когда основные темы ветки «'+esc(br.name)+'» уровня '+lk+' будут пройдены на '+UNLOCK_PCT+'%.</div></div>'+
      '<div class="m-sum"><span class="bar unlockbar"><span style="width:'+pct+'%;background:var(--st-mastered)"></span><i style="left:'+UNLOCK_PCT+'%"></i></span>'+
      '<span>сейчас '+pct+'% из '+UNLOCK_PCT+'%</span></div>'+
      '<div class="lockhint">Основные темы: '+ids.map(i=>esc(CARDS[i].title)+' — '+cardInfo(i).pct+'%').join(' · ')+'</div>'+
      '<div class="m-actions"><button type="button" class="m-btn ghost" data-act="list">Посмотреть слова</button>'+
      '<button type="button" class="m-btn" data-act="close">Понятно</button></div>';
    const f=modal.querySelector('[data-act="close"]'); if(f) f.focus();
  }
  // ---- spaced repetition: one panel, level toggles ----
  const RVKEY='ef_review_lvls';
  let rvLv=(()=>{const s=lsGet(RVKEY);if(s==='')return [];const a=s?s.split(',').filter(k=>LEVELS.some(l=>l.key===k)):null;return a&&a.length?a:LEVELS.map(l=>l.key);})();
  const KIND_NAME={due:'Повторение', base:'Новые слова · базовые темы', extra:'Новые слова · экстра-темы'};
  function lvWords(lks, part){ // part: 'base' | 'extra' | 'all'
    const out=[];
    ALL.forEach(id=>{ const c=CARDS[id]; if(!lks.includes(c.level)) return; if(part==='base'&&c.extra) return; if(part==='extra'&&!c.extra) return; c.words.forEach(w=>out.push(w)); });
    return out;
  }
  function rvCounts(lks){
    const now=Date.now(); let due=0, nb=0, nx=0, left=0, rev=0, total=0;
    lvWords(lks,'all').forEach(w=>{ const r=rec(w.tid,w.k), x=CARDS[w.tid].extra; total++; if(r[0]<8) left++; if(r[0]>=1 && r[0]<8) rev++;
      if(isDue(r,now)) due++; else if(isNew(r)){ if(x) nx++; else nb++; } });
    return {due, nb, nx, left, rev, total};
  }
  function lvLabel(lks){ return lks.length===LEVELS.length?'все уровни':lks.join(' · '); }
  function lvHead(){
    if(S.course){ const lesson=BEGINNER_COURSE.find(l=>l.id===S.course); return mHead((lesson.bookTitle||'Beginner')+' · '+lesson.label+' · '+(S.part==='extra'?'Дополнительная лексика':S.part==='all'?'Все слова':'Базовая лексика'),S.section==null?lesson.title:lesson.sections[S.section].title); }
    return mHead(KIND_NAME[S.kind]||'Повторение', lvLabel(S.lvs));
  }
  function openReview(kind, lks){
    if(needProfile()) return;
    lks=(lks||rvLv).slice(); if(!lks.length) return;
    const now=Date.now(); let q;
    if(kind==='due'){
      q=lvWords(lks,'all').filter(w=>{ const r=rec(w.tid,w.k); return isDue(r,now); })
        .sort((x,y)=>(rec(x.tid,x.k)[3]||0)-(rec(y.tid,y.k)[3]||0));
    } else {
      q=shuffle(lvWords(lks,kind).filter(w=>isNew(rec(w.tid,w.k))));
    }
    S={mode:'session', lv:lvLabel(lks), lvs:lks, kind, queue:q, wait:[], done:0, flipped:false, start:{}, fails:{}, seen:[], hist:[]};
    q.forEach(w=>{ S.start[w.tid+'|'+w.k]=lvl(w.tid,w.k); });
    openModal(api);
    if(!q.length){ renderLvEmpty(); return; }
    renderCard();
  }
  function rvNextBtns(c, skip){
    return (skip!=='due'&&c.due?'<button type="button" class="m-btn" data-act="rv" data-kind="due">Повторить ('+c.due+')</button>':'')+
      (skip!=='base'&&c.nb?'<button type="button" class="m-btn ghost" data-act="rv" data-kind="base">Изучать базовые</button>':'')+
      (skip!=='extra'&&c.nx?'<button type="button" class="m-btn ghost" data-act="rv" data-kind="extra">Изучать Экстра</button>':'');
  }
  function renderLvEmpty(){
    const c=rvCounts(S.lvs);
    S.mode='done'; modal.classList.add('fixed');
    const msg=S.kind==='due'?'Сейчас нет слов, у которых подошёл срок повторения.':
      S.kind==='base'?'Новых слов в базовых темах не осталось.':'Новых слов в экстра-темах не осталось.';
    modal.innerHTML=lvHead()+'<div class="done-big">На сейчас всё</div>'+
      '<div class="m-verdict">'+msg+(c.left?' Слов с уровнем 0–7: '+c.left+'.':' Все слова выбранных уровней достигли уровня 8 или выше.')+'</div>'+
      '<div class="m-actions"><button type="button" class="m-btn ghost" data-act="close">Закрыть</button>'+rvNextBtns(c,S.kind)+'</div>';
  }
  function renderLvDone(){
    flushAll();
    const up=S.seen.filter(w=>lvl(w.tid,w.k)>S.start[w.tid+'|'+w.k]).length;
    const down=S.seen.filter(w=>lvl(w.tid,w.k)<S.start[w.tid+'|'+w.k]).length;
    const c=rvCounts(S.lvs);
    S.mode='done'; modal.classList.add('fixed');
    modal.innerHTML=lvHead()+'<div class="done-big">Сессия пройдена</div>'+
      '<div class="m-verdict">Слов: '+S.seen.length+' · выросло: '+up+(down?' · опустилось: '+down:'')+'. Сейчас к повторению: '+c.due+'.</div>'+
      '<div class="wl">'+S.seen.map(w=>{ const r=rec(w.tid,w.k);
        return '<div class="row"><span class="en">'+esc(w.en)+'</span><span class="ru">'+esc(w.ru)+'</span>'+
        '<span class="chg">'+S.start[w.tid+'|'+w.k]+' → '+r[0]+(r[3]?' · через '+whenLabel(r[4]||0, r[3], Date.now()):'')+'</span>'+sayBtn(w.en)+'</div>'; }).join('')+'</div>'+
      '<div class="m-actions">'+
        (S.hist.length?'<button type="button" class="m-btn ghost" data-act="back">← Последнее слово</button>':'')+
        '<button type="button" class="m-btn ghost" data-act="close">Закрыть</button>'+(S.course?'<button type="button" class="m-btn" data-act="course-list">К словам урока</button>':rvNextBtns(c))+'</div>';
  }
  // review panel above the tree
  const rv=el('section','review-panel');
  rv.setAttribute('aria-label','Повторение слов');
  function renderPanel(){
    const c=rvCounts(rvLv), none=!rvLv.length, NP=COEF.review.newPerSession;
    rv.innerHTML='<div class="rv-head"><h2 class="rv-title">Повторение слов</h2>'+
      '<p class="rv-sub">Как в Anki: слово возвращается, когда подходит срок. Выбери уровни — кнопки работают по включённым.</p></div>'+
      '<div class="rv-lvls" role="group" aria-label="Уровни">'+LEVELS.map(l=>{ const on=rvLv.includes(l.key);
        return '<button type="button" class="rv-tg'+(on?' on':'')+'" data-tg="'+l.key+'" aria-pressed="'+on+'" style="--lc:var('+l.c+')">'+
          '<b>'+l.key+'</b><span>'+l.book+'</span></button>'; }).join('')+'</div>'+
      (none?'<div class="rv-none">Включи хотя бы один уровень.</div>':
      '<div class="rv-stats">'+
        '<div><b class="rv-due">'+c.due+'</b><span>к повторению</span></div>'+
        '<div><b class="rv-new">'+c.nb+'</b><span>новых в базовых</span></div>'+
        '<div><b class="rv-new">'+c.nx+'</b><span>новых в экстра</span></div>'+
        '<div><b>'+c.rev+'</b><span>в повторении (уровни 1–7) из '+c.total+'</span></div></div>')+
      '<div class="rv-acts">'+
        '<button type="button" class="m-btn" data-kind="due"'+(none||!c.due?' disabled':'')+'>Повторить'+(c.due?' ('+c.due+')':'')+'</button>'+
        '<button type="button" class="m-btn ghost" data-kind="base"'+(none||!c.nb?' disabled':'')+'>Изучать базовые'+(c.nb?' ('+c.nb+')':'')+'</button>'+
        '<button type="button" class="m-btn ghost" data-kind="extra"'+(none||!c.nx?' disabled':'')+'>Изучать Экстра'+(c.nx?' ('+c.nx+')':'')+'</button></div>';
  }
  rv.addEventListener('click',ev=>{
    const t=ev.target.closest('[data-tg]');
    if(t){ const k=t.dataset.tg; rvLv=rvLv.includes(k)?rvLv.filter(x=>x!==k):LEVELS.map(l=>l.key).filter(x=>x===k||rvLv.includes(x)); lsSet(RVKEY, rvLv.join(',')); renderPanel(); return; }
    const b=ev.target.closest('[data-kind]'); if(b&&!b.disabled) openReview(b.dataset.kind);
  });
  board.root.querySelector('.stats-row').after(rv);
  var panelReady=true; renderPanel();
  setInterval(()=>{ if(!document.hidden && !S) renderPanel(); }, 60000);

  function openSession(id){
    if(isLocked(id)){ openLocked(id); return; }
    if(needProfile()) return;
    const pk=pickWords(id);
    S={mode:'session', id, review:pk.review, queue:pk.words.slice(), done:0, flipped:false, start:{}, fails:{}, seen:[], hist:[]};
    pk.words.forEach(w=>{ S.start[w.tid+'|'+w.k]=lvl(id,w.k); });
    S.pctStart=cardInfo(id).pct;
    openModal(api);
    if(!pk.words.length){
      S.mode='done';
      modal.innerHTML=head(id,'Повторение')+'<p class="m-verdict">В этой теме нет новых слов и слов, у которых подошёл срок повторения.</p><div class="m-actions"><button type="button" class="m-btn ghost" data-act="list">Все слова</button><button type="button" class="m-btn" data-act="close">Закрыть</button></div>';
      return;
    }
    renderCard();
  }
  function renderCard(){
    if(S.kdone){ renderKnownOk(); return; }
    if(S.wtimer){ clearInterval(S.wtimer); S.wtimer=null; }
    if(!S.flipped && !S.kbox && !S.kres && S.wait && S.wait.length){
      const now0=Date.now(), ready=S.wait.filter(x=>x.due<=now0);
      if(ready.length){ S.wait=S.wait.filter(x=>x.due>now0); S.queue.unshift(...ready.map(x=>x.w)); }
    }
    if(!S.queue.length){ if(S.wait&&S.wait.length){ renderWait(); return; } renderDone(); return; }
    const w=S.queue[0], id=w.tid, l=lvl(id,w.k), r=rec(id,w.k), now=Date.now();
    const pct=Math.round(S.done/(S.done+S.queue.length)*100);
    // under each grade: when the word comes back and which level it will have («ур. 2 → 3»)
    const nx=g=>{ const sc=sched(r,g,now), d=sc.lv>l?'up':sc.lv<l?'down':'same';
      return whenLabel(sc.ivl, sc.due, now)+'</small><small class="g-lv" data-d="'+d+'" style="opacity:'+(d==='up'?1:.75)+'" title="уровень слова после этой оценки">ур. '+l+' → '+sc.lv; };
    let h=(S.lv?lvHead():head(id, S.review?'Повторение':'Карточки'))+
      '<div class="sess-meta"><span>осталось '+S.queue.length+(S.wait&&S.wait.length?' · ждут '+S.wait.length:'')+'</span><span>'+(S.lv?esc(CARDS[id].title):'тема '+cardInfo(id).pct+'%')+'</span></div>'+
      '<div class="sess-bar"><span style="width:'+pct+'%"></span></div>'+
      '<div class="fc">'+(w.p?'<span class="pos">'+esc(POS_RU[w.p])+'</span>':'')+
      '<div class="front'+(S.flipped?' small':'')+'">'+esc(w.ru)+'</div>';
    if(!S.flipped && S.kbox){
      h+='<form class="kbox" autocomplete="off" data-word-id="'+esc(id)+'" data-word-key="'+esc(w.k)+'" data-word-en="'+esc(w.en)+'" data-word-pos="'+w.p+'"><label for="knownIn">Напиши слово по-английски</label>'+
        '<div class="kbox-row"><input id="knownIn" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="english">'+
        '<button type="submit" class="m-btn">Проверить</button></div>'+
        '<button type="button" class="linkbtn" data-act="kcancel">Отмена</button></form>';
    }
    if(S.flipped && S.kres){
      h+='<div class="kres no">Ты написал: <b>'+esc(S.kres)+'</b> — неверно, слово не засчитано. Оцени его как обычно.</div>';
    }
    if(S.flipped){
      h+='<div class="back">'+esc(w.en)+sayBtn(w.en)+'</div>'+
        trHTML(w)+
        (w.note?'<div class="note">'+esc(w.note)+'</div>':'')+
        (w.ex?'<div class="exs"><span class="trt">'+exampleHTML(w)+'</span>'+trBtn(w.ex)+sayBtn(w.ex)+'</div>':'')+
        extraHTML(w);
    }
    h+='<div class="lvlrow">'+lvlHTML(l)+'<span>уровень '+l+' из '+MAXL+(r[3]&&r[4]?' · интервал '+ivlLabel(r[4]*DAY):'')+'</span></div></div><div class="fc-actions">';
    // grades are always rendered so the block keeps the same height; before the flip they are hidden under the button
    const ti=S.flipped?'':' tabindex="-1"';
    h+='<div class="grades-wrap"><div class="grades'+(S.flipped?'':' hidden-grades')+'"'+(S.flipped?'':' aria-hidden="true"')+'>'+
      '<button type="button" class="grade again" data-g="again"'+ti+'>Забыл<small>'+nx('again')+'</small></button>'+
      '<button type="button" class="grade hard" data-g="hard"'+ti+'>Трудно<small>'+nx('hard')+'</small></button>'+
      '<button type="button" class="grade easy" data-g="good"'+ti+'>Хорошо<small>'+nx('good')+'</small></button>'+
      '<button type="button" class="grade know" data-g="easy"'+ti+'>Отлично<small>'+nx('easy')+'</small></button></div>'+
      (S.flipped?'':'<button type="button" class="m-btn show" data-act="flip">Показать ответ</button>')+'</div>'+
      '<div class="fc-row"><button type="button" class="m-btn ghost fc-back" data-act="back"'+(S.hist.length?'':' disabled')+'>← Предыдущее слово</button>'+
      '<button type="button" class="m-btn fc-know" data-act="kopen"'+(S.flipped||S.kbox?' disabled aria-hidden="true" tabindex="-1"':'')+' title="Впиши слово по-английски: если верно — уровень 8 и проверка через 45 дней, на следующих проверках — 9 и 10">Я знаю</button></div>';
    h+='<div class="fc-foot">'+
      (canSpeak?'<label class="auto"><input type="checkbox" id="autoSay"'+(autoSay?' checked':'')+'> озвучивать ответ</label>':'<span></span>')+
      (S.flipped?'<span class="fc-links"><button type="button" class="linkbtn" data-g="reset">Обнулить</button></span>':
        '<span class="auto kbd-hint">пробел — показать ответ</span>')+
      '</div></div>';
    modal.innerHTML=h; modal.classList.add('fixed');
    const f=modal.querySelector(S.kbox&&!S.flipped?'#knownIn':S.flipped?'.grade.hard':'[data-act="flip"]'); if(f) f.focus({preventScroll:true});
  }
  function normAns(s){ return String(s).toLowerCase().replace(/[’`]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim().replace(/^(to|a|an|the) /,''); }
  function answers(en){
    const out=new Set();
    const base=en.replace(/\(.*?\)/g,' ');
    [en, base].concat(base.split(/\s*[\/;,]\s*|\s+or\s+/)).forEach(v=>{ const n=normAns(v); if(n) out.add(n); });
    return out;
  }
  function renderKnownOk(){
    const k=S.kdone;
    modal.classList.add('fixed');
    modal.innerHTML=(S.lv?lvHead():head(S.id, S.review?'Повторение':'Карточки'))+
      '<div class="kok" role="status"><div class="kok-ico" aria-hidden="true">✓</div>'+
      '<div class="kok-t">Засчитано</div>'+
      '<div class="kok-w"><span>'+esc(k.ru)+'</span><b>'+esc(k.en)+'</b></div>'+
      '<div class="kok-n">'+(k.lv!=null?'Уровень '+k.lv+' · следующая проверка через '+k.when:'Слово засчитано.')+'</div></div>'+
      '<div class="m-actions kok-a"><button type="button" class="m-btn ghost" data-act="back">Отменить</button>'+
      '<button type="button" class="m-btn" data-act="knext">Дальше →</button></div>';
    const f=modal.querySelector('[data-act="knext"]'); if(f) f.focus({preventScroll:true});
  }
  function checkKnown(){
    if(!S || S.mode!=='session' || S.flipped || !S.queue.length) return;
    const inp=modal.querySelector('#knownIn'); const typed=(inp&&inp.value||'').trim(); if(!typed){ if(inp) inp.focus(); return; }
    const w=S.queue[0];
    S.kbox=false;
    if(answers(w.en).has(normAns(typed))){
      S.kdone={ru:w.ru, en:w.en, typed};
      S.flipped=true; grade('known');
    } else {
      S.kres=typed; S.flipped=true; renderCard();
      if(autoSay) say(w.en);
    }
  }
  function flip(){
    if(!S || S.mode!=='session' || S.flipped || !S.queue.length) return;
    S.flipped=true; renderCard();
    if(autoSay) say(S.queue[0].en);
  }
  function grade(g){
    if(needProfile()) return;
    if(!S || S.mode!=='session' || !S.flipped || !S.queue.length) return;
    const id=S.queue[0].tid;
    if(!S.wait) S.wait=[];
    S.hist.push({queue:S.queue.slice(), wait:S.wait.slice(), done:S.done, fails:Object.assign({},S.fails), seen:S.seen.slice(), tid:id,
      k:S.queue[0].k, had:!!(prog[id]&&prog[id][S.queue[0].k]), prev:prog[id]&&prog[id][S.queue[0].k]?prog[id][S.queue[0].k].slice():null});
    const w=S.queue.shift();
    const r=rec(id,w.k), now=Date.now(), sc=sched(r,g,now);
    if(!prog[id]) prog[id]={};
    prog[id][w.k]=[sc.lv, now, (r[2]||0)+1, sc.due, sc.ivl, sc.ease];
    if(g==='known' && S.kdone){ S.kdone.lv=sc.lv; S.kdone.when=whenLabel(sc.ivl, sc.due, now); }
    if(!S.seen.includes(w)){ S.seen.push(w); if(!((w.tid+'|'+w.k) in S.start)) S.start[w.tid+'|'+w.k]=r[0]; }
    if(g==='again' && !sc.ivl){
      S.fails[w.k]=(S.fails[w.k]||0)+1;
      S.wait.push({w, due:sc.due}); S.wait.sort((x,y)=>x.due-y.due);
    } else if(g==='reset' && (S.fails[w.k]||0)<3){
      S.fails[w.k]=(S.fails[w.k]||0)+1;
      S.queue.splice(Math.min(3, S.queue.length), 0, w);
    } else S.done++;
    S.flipped=false; S.kres=''; S.kbox=false;
    const wasOpen=OPEN[okey(id)];
    computeOpen();
    if(OPEN[okey(id)]!==wasOpen) ALL.forEach(paint); else paint(id);
    stats(); board.applyFilter();
    saveCard(id,w.k);
    renderCard();
  }
  function renderWait(){
    S.mode='wait'; modal.classList.add('fixed');
    const n=S.wait.length;
    modal.innerHTML=(S.lv?lvHead():head(S.id, S.review?'Повторение':'Карточки'))+
      '<div class="wait-box" role="status"><div class="wait-t">Следующее слово через</div><div class="wait-n" id="waitN">—</div>'+
      '<div class="wait-s">'+n+' '+(n===1?'слово ждёт':n<5?'слова ждут':'слов ждут')+' повтора: после «Забыл» новое или слабое слово возвращается только через 10 минут. Можно подождать здесь или закрыть — слова придут в «Повторить», когда подойдёт срок.</div></div>'+
      '<div class="m-actions">'+(S.hist.length?'<button type="button" class="m-btn ghost" data-act="back">← Назад</button>':'')+
      '<button type="button" class="m-btn ghost" data-act="wend">Завершить</button>'+
      '<button type="button" class="m-btn" data-act="close">Закрыть</button></div>';
    const tick=()=>{
      if(!S || S.mode!=='wait'){ clearInterval(t); return; }
      const ms=S.wait[0].due-Date.now();
      if(ms<=0){ clearInterval(t); S.wtimer=null; S.mode='session'; renderCard(); return; }
      const s=Math.ceil(ms/1000), e=document.getElementById('waitN'); if(e) e.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    };
    const t=setInterval(tick,1000); S.wtimer=t; tick();
  }
  function undo(){
    if(!S || !S.hist || !S.hist.length) return;
    const h=S.hist.pop(), id=h.tid;
    if(S.wtimer){ clearInterval(S.wtimer); S.wtimer=null; }
    S.queue=h.queue; S.wait=h.wait||[]; S.done=h.done; S.fails=h.fails; S.seen=h.seen; S.mode='session'; S.flipped=true; S.kbox=false; S.kres=''; S.kdone=null;
    if(!prog[id]) prog[id]={};
    if(h.had) prog[id][h.k]=h.prev; else delete prog[id][h.k];
    computeOpen(); ALL.forEach(paint); stats(); board.applyFilter();
    saveCard(id,h.k);
    renderCard();
  }
  function renderDone(){
    if(S.lv){ renderLvDone(); return; }
    const id=S.id, ci=cardInfo(id);
    flushAll();
    const up=S.seen.filter(w=>lvl(id,w.k)>S.start[w.tid+'|'+w.k]).length;
    const down=S.seen.filter(w=>lvl(id,w.k)<S.start[w.tid+'|'+w.k]).length;
    const msg=ci.status==='mastered'?'Тема закреплена: все слова на уровне 10.':
      'Слов выросло: '+up+(down?', опустилось: '+down:'')+'. Тема: '+S.pctStart+'% → '+ci.pct+'%.';
    S.mode='done'; modal.classList.add('fixed');
    modal.innerHTML=head(id,'Сессия окончена')+
      '<div class="done-big">'+(ci.status==='mastered'?'Готово!':'Сессия пройдена')+'</div>'+
      '<div class="m-verdict">'+esc(msg)+'</div>'+cardSummary(id)+
      '<div class="wl">'+S.seen.map(w=>
        '<div class="row"><span class="en">'+esc(w.en)+'</span><span class="ru">'+esc(w.ru)+'</span>'+
        '<span class="chg">'+S.start[w.tid+'|'+w.k]+' → '+lvl(id,w.k)+'</span>'+sayBtn(w.en)+'</div>').join('')+'</div>'+
      '<div class="m-actions">'+
        (S.hist.length?'<button type="button" class="m-btn ghost" data-act="back">← Последнее слово</button>':'')+
        '<button type="button" class="m-btn ghost" data-act="list">Все слова</button>'+
        '<button type="button" class="m-btn ghost" data-act="close">Закрыть</button>'+
        '<button type="button" class="m-btn" data-act="session">'+(ci.status==='mastered'?'Повторить ещё':'Ещё сессия')+'</button></div>';
    const f=modal.querySelector('[data-act="session"]'); if(f) f.focus();
  }

  // ---- persistence: one doc per topic card ----
  // v3 = current word-record format. On first load of an older record, legacy level-10 words
  // are moved to level 8 and their next reviews are spread across 40–65 days.
  const DOCV=3;
  const LKEY='ef_wordtree_v4', LKEY_PREV='ef_wordtree_v3', LKEY_OLD='ef_wordtree_v2';
  const queues=new Map();
  let unsub=null;
  function cleanRec(m, mult){
    const out={}; mult=mult||1;
    Object.keys(m||{}).forEach(k=>{ const r=m[k]; if(Array.isArray(r) && typeof r[0]==='number'){
      const o=[Math.max(0,Math.min(MAXL,(r[0]|0)*mult)), +r[1]||0, +r[2]||0];
      if(+r[3]>0) o.push(+r[3], +r[4]||0, +r[5]||2.5);
      else if(o[0]>0){ const iv=IVL_FOR_LEVEL[o[0]]; o[2]=Math.max(1,o[2]); o.push((o[1]||Date.now())+iv*DAY || Date.now(), iv, 2.5); }
      out[k]=o; } });
    return out;
  }
  function legacySpreadDays(id,k){
    const t=id+'|'+k;
    let h=2166136261;
    for(let i=0;i<t.length;i++){ h^=t.charCodeAt(i); h=Math.imul(h,16777619); }
    return 40+((h>>>0)%26);
  }
  function migrateLegacyTens(id,m){
    const now=Date.now();
    let changed=false;
    Object.keys(m||{}).forEach(k=>{
      const r=m[k];
      if(!Array.isArray(r) || r[0]!==10) return;
      const days=legacySpreadDays(id,k);
      m[k]=[8, now, Math.max(1,+r[2]||0), dueDay(now,days), days, +r[5]||2.5];
      changed=true;
    });
    return changed;
  }
  function queueFor(pid){
    if(queues.has(pid))return queues.get(pid);
    const journal='ef_word_pending_'+pid;
    const q=SkillCore.createWriteQueue({
      save(data){localStorage.setItem(journal,JSON.stringify(data));},
      send(id,patch){
        if(ME!==pid)return Promise.reject({code:'unauthenticated'});
        const w={};
        Object.entries(patch).forEach(([k,value])=>{w[k]=value===null?firebase.firestore.FieldValue.delete():value;});
        const payload={v:DOCV,updatedAt:Date.now()};if(Object.keys(w).length)payload.w=w;
        return db.collection('profiles/'+pid+'/cards').doc(id).set(payload,{merge:true});
      },
      onError:onWriteError,
      onSaved(){if(![...queues.values()].some(x=>x.pending()))document.getElementById('roFlag').hidden=true;},
    });
    queues.set(pid,q);
    try{q.restore(JSON.parse(lsGet(journal)||'{}'));}catch(e){onWriteError(e);}
    return q;
  }
  function saveCard(id,k){
    if(local){lsSet(LKEY,JSON.stringify(prog));return;}
    if(!db||!current||!canWrite())return;
    queueFor(current).put(id,k?{[k]:prog[id]&&prog[id][k]||null}:{...prog[id]});
  }
  function flushAll(){queues.forEach(q=>q.flushAll());}
  window.addEventListener('pagehide',flushAll);
  window.addEventListener('online',flushAll);
  function select(pid){
    if(unsub){ unsub(); unsub=null; }
    Object.keys(prog).forEach(k=>delete prog[k]);
    refresh();
    if(!pid || !db) return;
    const q=canWrite()?queueFor(pid):null;
    unsub=db.collection('profiles/'+pid+'/cards').onSnapshot(qs=>{
      if(current!==pid) return;
      const seen=new Set();
      qs.docs.forEach(doc=>{
        if(!(doc.id in CARDS)&&!(typeof WORD_LEGACY_TOPICS!=='undefined'&&WORD_LEGACY_TOPICS.has(doc.id)))return;
        seen.add(doc.id);
        const dd=doc.data()||{};
        const legacy=(+dd.v||0)<DOCV;
        const remote=cleanRec(dd.w,(+dd.v||0)>=2?1:2);
        prog[doc.id]=q?q.overlay(doc.id,remote):remote;
        if(legacy && canWrite() && current===pid){
          migrateLegacyTens(doc.id, prog[doc.id]);
          // Save every legacy card once, even if it has no 10s, so future genuine level-10 words are never migrated.
          saveCard(doc.id);
        }
      });
      Object.keys(prog).forEach(k=>{if(!seen.has(k)&&!(q&&q.pending(k)))delete prog[k];});
      refresh();
    },()=>{ACCOUNT.denied(pid);});
    if(q){
      const ids=typeof WORD_LEGACY_TOPICS==='undefined'?ALL:[...new Set([...ALL,...WORD_LEGACY_TOPICS])];
      ids.forEach(id=>{if(q.pending(id))prog[id]=q.overlay(id,prog[id]||{});});
      refresh();q.flushAll();
    }
  }
  function initLocal(){
    try{
      const cur=lsGet(LKEY), prev=cur?null:lsGet(LKEY_PREV), old=(cur||prev)?null:lsGet(LKEY_OLD);
      const raw=cur||prev||old||'{}', o=JSON.parse(raw), mult=old?2:1, legacy=!cur;
      Object.keys(o).forEach(k=>{
        if(!(k in CARDS)&&!(typeof WORD_LEGACY_TOPICS!=='undefined'&&WORD_LEGACY_TOPICS.has(k)))return;
        prog[k]=cleanRec(o[k], mult);
        if(legacy) migrateLegacyTens(k, prog[k]);
      });
      if(legacy) lsSet(LKEY, JSON.stringify(prog));
    }catch(e){}
    refresh();
  }

  const api={
    onClick(ev){
      const sl=ev.target.closest('[data-setl]');
      if(sl && S && (S.mode==='list'||S.mode==='course-list')){ const box=sl.closest('.lvle'), source=sl.closest('[data-tid]'); if(box) setLevel(source?source.dataset.tid:S.id, box.dataset.k, +sl.dataset.setl); return; }
      const g=ev.target.closest('[data-g]'); if(g){ grade(g.dataset.g); return; }
      const a=ev.target.closest('[data-act]'); if(!a||!S) return;
      const id=S.id;
      if(a.dataset.act==='course-list') openCourseList(S.course,S.section,S.part);
      else if(a.dataset.act==='course-session') openCourseSession(S.course,S.section,S.part);
      else if(a.dataset.act==='flip') flip();
      else if(a.dataset.act==='kopen'){ S.kbox=true; renderCard(); }
      else if(a.dataset.act==='knext'){ S.kdone=null; renderCard(); }
      else if(a.dataset.act==='kcancel'){ S.kbox=false; renderCard(); }
      else if(a.dataset.act==='back'){ S.kdone=null; undo(); }
      else if(a.dataset.act==='rv') openReview(a.dataset.kind, S.lvs);
      else if(a.dataset.act==='wend'){ if(S.wtimer) clearInterval(S.wtimer); S.wtimer=null; S.wait=[]; S.mode='session'; renderDone(); }
      else if(a.dataset.act==='session') openSession(id);
      else if(a.dataset.act==='list') openList(id);
    },
    onChange(ev){ if(ev.target.id==='autoSay'){ autoSay=ev.target.checked; lsSet(AKEY, autoSay?'1':'0'); } },
    onSubmit(ev){ if(ev.target.classList.contains('kbox')) checkKnown(); },
    onEsc(){ if(S && S.kbox){ S.kbox=false; renderCard(); return true; } return false; },
    onKey(ev){
      if(S && S.kdone){ if(ev.key==='Enter'||ev.key===' '){ S.kdone=null; renderCard(); ev.preventDefault(); } return; }
      if(!S || S.mode!=='session') return;
      if(ev.target && (ev.target.id==='autoSay' || ev.target.id==='knownIn')) return;
      if(ev.key==='ArrowLeft' || ev.key==='Backspace'){ undo(); ev.preventDefault(); return; }
      if(!S.flipped && (ev.key===' ' || ev.key==='Enter')){ flip(); ev.preventDefault(); return; }
      if(S.flipped){
        const map={'1':'again','2':'hard','3':'good','4':'easy','0':'reset'};
        if(map[ev.key]){ grade(map[ev.key]); ev.preventDefault(); }
      }
    },
    onClose(){ S=null; flushAll(); },
    select, initLocal, stats, refresh, flushAll, board,
    courseInfo, openCourseList, openCourseSession,
    catalogInfo:part=>wordsOf(ALL.filter(id=>CARDS[id].level==='A1'&&(part==='extra')===CARDS[id].extra)),
    openTopic:openList, practiceTopic:openSession,
    topicInfo:id=>cardInfo(id),
  };
  return api;
})();

// ================= SETTINGS mode =================
const SETTINGS = (function(){
  const root=document.getElementById('mode-s');
  const SKEY='ef_coef';
  const GROUPS=[
    {key:'rulesPractice', h:'Правила · быстрый тест', note:'Насколько растёт уровень правила за верный ответ в «Быстром тесте» (до уровня 7). Ошибка уровень не снижает. Код из «Изучать с AI» начисляет 0…+3 по числу верных применений, тоже без минусов. С уровня 7 нужно 3 верных подряд на каждый следующий уровень; ошибка обнуляет эти шаги.',
     f:[['ok','Верный ответ']]},
    {key:'review', h:'Лексика · интервальное повторение', note:'Оценки меняют уровень слова: «Забыл» −2, «Трудно» 0, «Хорошо» +1, «Отлично» +2; срок повтора — интервал нового уровня. Переводы: верно = «Хорошо», с ошибкой = «Трудно», неверно = «Забыл».',
     f:[['maxIvl','Максимальный интервал, дней']]},
  ];
  let msg='';
  function render(){
    root.innerHTML='<div class="set-wrap"><p class="set-intro">Настройки повторения слов и коэффициенты для уровней правил. Они общие для всех учеников.</p>'+
      '<form id="coefForm" class="set-grid" autocomplete="off">'+GROUPS.map(g=>'<fieldset class="set-card"><legend>'+esc(g.h)+'</legend><p class="set-note">'+esc(g.note)+'</p>'+
        g.f.map(([k,l])=>'<label class="set-row" for="c-'+g.key+'-'+k+'"><span>'+esc(l)+'</span>'+
          '<span class="set-step"><button type="button" class="lvb" data-step="-1" data-for="c-'+g.key+'-'+k+'" aria-label="меньше">−</button>'+
          '<input type="number" id="c-'+g.key+'-'+k+'" data-g="'+g.key+'" data-k="'+k+'" min="'+(COEF_RANGE[g.key+'.'+k]||[-10,10])[0]+'" max="'+(COEF_RANGE[g.key+'.'+k]||[-10,10])[1]+'" data-step="'+(COEF_STEP[g.key+'.'+k]||1)+'" step="1" value="'+COEF[g.key][k]+'">'+
          '<button type="button" class="lvb" data-step="1" data-for="c-'+g.key+'-'+k+'" aria-label="больше">+</button></span></label>').join('')+
        '</fieldset>').join('')+
      '<div class="set-actions"><span class="set-msg" id="coefMsg" role="status">'+esc(msg)+'</span>'+
      '<button type="button" class="m-btn ghost" id="coefReset">Вернуть по умолчанию</button>'+
      '</div></form></div>';
    if(db && !ACCOUNT.isAdmin){ root.querySelectorAll('#coefForm button,#coefForm input').forEach(e=>e.disabled=true); }
    ACCOUNT.mount(root);
  }
  function read(){ const o={}; root.querySelectorAll('input[data-g]').forEach(i=>{ (o[i.dataset.g]=o[i.dataset.g]||{})[i.dataset.k]=i.value!=='' && i.validity.valid ? Math.round(+i.value) : COEF[i.dataset.g][i.dataset.k]; }); return o; }
  function save(o){
    if(db && !ACCOUNT.isAdmin) return;
    msg='Сохраняется…'; setMsg();
    applyCoef(o);
    if(db) db.doc('settings/coef').set(Object.assign(JSON.parse(JSON.stringify(COEF)),{scale:10, updatedAt:Date.now()}))
      .then(()=>{ msg='Сохранено'; setMsg(); }).catch(e=>{ msg='Не удалось сохранить'; setMsg(); onWriteError(e); });
    else { lsSet(SKEY, JSON.stringify(COEF)); msg='Сохранено в этом браузере'; setMsg(); }
    W.refreshGrades && W.refreshGrades();
  }
  function setMsg(){ const m=document.getElementById('coefMsg'); if(m) m.textContent=msg; }
  root.addEventListener('click',ev=>{
    if(!ev.target.closest('#coefForm') || (db && !ACCOUNT.isAdmin)) return;
    const b=ev.target.closest('button[data-step]');
    if(b){ const i=document.getElementById(b.dataset.for); i.value=Math.max(+i.min,Math.min(+i.max,(+i.value||0)+(+b.dataset.step)*(+i.dataset.step||1))); save(read()); return; }
    if(ev.target.id==='coefReset'){ save(JSON.parse(JSON.stringify(COEF_DEFAULT))); render(); }
  });
  root.addEventListener('input',ev=>{
    const i=ev.target;
    if(i.matches('#coefForm input[data-g]') && i.value!=='' && i.validity.valid) save(read());
  });
  root.addEventListener('submit',ev=>{ ev.preventDefault(); save(read()); });
  function load(){
    if(db){ db.doc('settings/coef').onSnapshot(s=>{ const v=s&&s.exists?s.data():null; applyCoef(v); if(!root.hidden && !root.contains(document.activeElement)) render(); },()=>{}); }
    else { try{ applyCoef(JSON.parse(lsGet(SKEY)||'null')); }catch(e){} }
    render();
  }
  render();
  return {load, render};
})();

// ================= mode switch =================
const MODES={
  g:{sub:'грамматика четырёх учебников: каждое правило один раз, со ссылкой на урок', mod:G},
  w:{sub:'лексика по темам: учишь карточками, у каждого слова шкала 0–10', mod:W},
  s:{sub:'настройки повторения слов и коэффициенты уровней правил', mod:null},
};
let mode = (()=>{
  const h=(location.hash||'').replace('#','').toLowerCase();
  if(['words','lexis','vocab','w'].includes(h)) return 'w';
  if(['grammar','rules','g'].includes(h)) return 'g';
  const s=lsGet('ef_mode'); return s==='w'||s==='s'?s:'g';
})();
function setMode(m){
  if(owner) closeModal();
  unpin();
  mode=m; lsSet('ef_mode', m);
  document.getElementById('mode-g').hidden = m!=='g';
  document.getElementById('mode-w').hidden = m!=='w';
  document.getElementById('mode-s').hidden = m!=='s';
  document.getElementById('profileBar').classList.toggle('dim', m==='s');
  document.querySelectorAll('.modes button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.mode===m?'true':'false'));
  document.getElementById('modeSub').textContent = MODES[m].sub;
  if(MODES[m].mod){ const bd=MODES[m].mod.board; bd.setBranch(bd.active); } else SETTINGS.render();
  window.dispatchEvent(new CustomEvent('ef-mode-change', {detail:{mode:m}}));
}
document.querySelectorAll('.modes button').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.mode!==mode) setMode(b.dataset.mode); }));
setMode(mode);

// ================= profiles (shared by both modes) =================
var ME=null;
function canWrite(){ return db ? !!ME && current===ME : local; }
const PKEY='ef_skilltree_profile';
const profList=document.getElementById('profList');
let profileNotice='';
function selectProfile(id){
  if(!db) return;
  W.flushAll();
  if(owner) closeModal();
  current=id;
  if(id) profileNotice='';
  document.documentElement.classList.toggle('readonly',!canWrite()); if(id) lsSet(PKEY, id);
  G.select(id); W.select(id);
  renderProfiles();
}
function renderProfiles(){
  const vf=document.getElementById('viewFlag');
  const cp=profiles.find(p=>p.id===current);
  if(profileNotice){vf.textContent=profileNotice;vf.hidden=false;}
  else if(current && current!==ME && cp){ vf.textContent='Прогресс «'+cp.name+'» · только просмотр. Менять данные и проходить задания здесь нельзя.'; vf.hidden=false; }
  else vf.hidden=true;
  profList.innerHTML='';
  if(!profiles.length){ profList.appendChild(el('span','hint',ME?'Загрузка профиля…':'Профиль закрыт или недоступен')); return; }
  profiles.forEach(p=>{
    const b=el('button','pchip'); b.type='button';
    b.dataset.active=p.id===current?'1':'0';
    b.dataset.group=p.group||'self';
    b.appendChild(document.createTextNode(p.id===ME ? p.name+' (я)' : p.name));
    b.addEventListener('click',()=>{ if(p.id!==current) selectProfile(p.id); });
    profList.appendChild(b);
  });
}
G.refresh(); W.refresh();

const SKIP_KEY='ef_auth_skip';
const authBox=document.getElementById('authBox');
const authErr=document.getElementById('authErr');
let fbAuth=null;
const nickToEmail = nick => SkillFirebase.nickToEmail(nick);
function authMsg(code){
  return ({
    'auth/invalid-credential':'Неверный ник или пароль.',
    'auth/invalid-login-credentials':'Неверный ник или пароль.',
    'auth/wrong-password':'Неверный пароль.',
    'auth/user-not-found':'Такого ника нет. Нажми «Создать аккаунт».',
    'auth/email-already-in-use':'Этот ник уже занят. Выбери другой или войди.',
    'auth/weak-password':'Пароль слишком короткий — нужно не меньше 6 символов.',
    'auth/invalid-email':'Ник может содержать буквы, цифры, точку, дефис и подчёркивание.',
    'auth/too-many-requests':'Слишком много попыток. Подожди пару минут.',
    'auth/network-request-failed':'Нет связи с сервером. Проверь интернет.'
  })[code] || 'Что-то пошло не так ('+code+').';
}
function showAuth(on){ authBox.hidden=!on; if(on) setTimeout(()=>{ try{ document.getElementById('authNick').focus(); }catch(e){} },50); }
function readAuth(){
  const nick=document.getElementById('authNick').value.trim();
  const pass=document.getElementById('authPass').value;
  if(nick.length<2){ authErr.textContent='Ник — от 2 до 15 символов.'; authErr.hidden=false; return null; }
  if(/[\s@]/.test(nick)){ authErr.textContent='В нике не должно быть пробелов и @.'; authErr.hidden=false; return null; }
  if(pass.length<6){ authErr.textContent='Пароль — не короче 6 символов.'; authErr.hidden=false; return null; }
  return {nick, pass};
}
let pendingNick=null;
async function doAuth(register){
  const v=readAuth(); if(!v||!fbAuth) return;
  authErr.hidden=true;
  const btns=[document.getElementById('authLogin'),document.getElementById('authReg')];
  btns.forEach(b=>b.disabled=true);
  try{
    pendingNick=v.nick;
    if(register) await fbAuth.createUserWithEmailAndPassword(nickToEmail(v.nick), v.pass);
    else await fbAuth.signInWithEmailAndPassword(nickToEmail(v.nick), v.pass);
    try{ localStorage.removeItem(SKIP_KEY); }catch(e){}
  }catch(e){ authErr.textContent=authMsg(e.code||''); authErr.hidden=false; }
  finally{ btns.forEach(b=>b.disabled=false); }
}
document.getElementById('authForm').addEventListener('submit',ev=>{ ev.preventDefault(); doAuth(false); });
document.getElementById('authReg').addEventListener('click',()=>doAuth(true));
document.getElementById('authSkip').addEventListener('click',()=>{
  lsSet(SKIP_KEY,'1');
  if(cloudStarted){const u=new URL(location.href);u.searchParams.delete('profile');u.searchParams.delete('friend');location.replace(u);return;}
  showAuth(false);startLocal();
});
document.getElementById('goLogin').addEventListener('click',ev=>{ ev.preventDefault(); if(fbAuth) showAuth(true); else alert('Сервер входа сейчас недоступен. Попробуй позже.'); });
document.getElementById('logoutBtn').addEventListener('click',()=>{ if(!fbAuth) return; W.flushAll(); fbAuth.signOut().then(()=>location.reload()); });

let localStarted=false;
function startLocal(){
  if(localStarted) return; localStarted=true;
  local=true;
  document.getElementById('profileBar').hidden=true;
  document.getElementById('offlineFlag').dataset.on='1';
  SETTINGS.load();
  G.initLocal(); W.initLocal();
}
let cloudStarted=false;
// Mutating controls remain inert for a friend/public view, including keyboard activation.
document.addEventListener('click',ev=>{
  if(canWrite()) return;
  if(ev.target.closest('.lvstep,.rread,[data-gset],[data-setl],[data-rid],.rvb,.tbtn,[data-kind],[data-rread]')){
    ev.preventDefault();ev.stopImmediatePropagation();
  }
},true);
async function startCloud(user){
  if(cloudStarted) return; cloudStarted=true;
  db=firebase.firestore(); ME=user?user.uid:null; local=false;
  document.getElementById('profileBar').hidden=false;
  document.getElementById('offlineFlag').dataset.on='0';
  document.getElementById('logoutBtn').hidden=!user;
  SETTINGS.load();
  if(user){
    const me=db.doc('profiles/'+user.uid);
    try {
      const snap=await me.get();
      if(!snap.exists) await me.set({name:pendingNick || (user.email||'').split('@')[0], visibility:'private', createdAt:Date.now()});
    } catch(e){onWriteError(e);}
  }
  let openedLink=false;
  ACCOUNT.start({db,user,
    onProfiles(list){
      profiles=list;
      if(!openedLink && ACCOUNT.publicId && list.some(p=>p.id===ACCOUNT.publicId)){openedLink=true;selectProfile(ACCOUNT.publicId);}
      else if(!list.some(p=>p.id===current)) selectProfile(user?user.uid:null);
      else {renderProfiles();G.stats();W.stats();}
    },
    onDenied(id){
      if(current===id){selectProfile(user?user.uid:null);profileNotice='Доступ к этому профилю закрыт.';renderProfiles();}
      else if(!user && ACCOUNT.publicId===id){profileNotice='Профиль закрыт, не найден или недоступен. Для просмотра приватного профиля войди в аккаунт друга.';renderProfiles();}
    },
    onRole(){SETTINGS.render();},
    openSettings(){setMode('s');},closeSettings(){setMode('g');},select:selectProfile
  });
  document.documentElement.classList.toggle('readonly',!canWrite());
}

(function init(){
  if(typeof firebase==='undefined'){ startLocal(); return; }
  try{
    fbAuth=SkillFirebase.init().auth;
  }catch(e){ startLocal(); return; }
  let first=true;
  fbAuth.onAuthStateChanged(user=>{
    if(user){
      showAuth(false);
      if(localStarted || cloudStarted){ location.reload(); return; }
      startCloud(user);
    } else if(first){
      if(ACCOUNT.publicId){showAuth(false);startCloud(null);}
      else if(lsGet(SKIP_KEY)==='1' && !ACCOUNT.hasInvite) startLocal(); else showAuth(true);
    }
    first=false;
  });
})();



