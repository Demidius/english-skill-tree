// Переключение оформлений: «RPG» (по умолчанию) / «Классика».
// Выбор хранится в браузере (ef_skin), применяется атрибутом data-skin на <html>.
(function () {
  const KEY = 'ef_skin';
  const DEF = 'rpg'; // оформление по умолчанию — для тех, кто ещё ничего не выбирал
  const SKINS = [
    { id: 'classic',  name: 'Классика',   sub: 'тёмный, современный', bg: '#0F1115', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'rpg',      name: 'RPG',        sub: 'пиксели и квесты',    bg: '#1C1C20', prev: '<b>Aa</b><i></i><i></i>' },
  ];
  const byId = id => SKINS.find(s => s.id === id) || SKINS.find(s => s.id === DEF);
  // оформление, которого больше нет (например «Тетрадь»), заменяем на стандартное
  try { const v = localStorage.getItem(KEY); if (v && !SKINS.some(s => s.id === v)) localStorage.setItem(KEY, DEF); } catch (e) {}
  function get() { try { return byId(localStorage.getItem(KEY) || DEF).id; } catch (e) { return DEF; } }
  function apply(id) {
    const de = document.documentElement;
    if (id === 'classic') de.removeAttribute('data-skin'); else de.setAttribute('data-skin', id);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', byId(id).bg);
    document.querySelectorAll('.skin-tile').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.skin === id)));
    document.querySelectorAll('.acc-skin').forEach(i => { i.textContent = 'Оформление: ' + byId(id).name; });
    if (typeof rpgProfile === 'function') rpgProfile();
  }
  function set(id) {
    try { localStorage.setItem(KEY, id); } catch (e) {}
    apply(id);
  }
  function next() { const i = SKINS.findIndex(s => s.id === get()); return SKINS[(i + 1) % SKINS.length].id; }

  // ---- блок выбора в «Настройках» ----
  function ensureSettings() {
    const root = document.getElementById('mode-s'); if (!root) return;
    const wrap = root.querySelector('.set-wrap');
    if (!wrap || wrap.querySelector('.skin-pick')) return;
    const sec = document.createElement('section'); sec.className = 'skin-pick'; sec.setAttribute('aria-label', 'Оформление');
    const cur = get();
    sec.innerHTML = '<h3 class="skin-h">Оформление</h3><p class="skin-note">Выбор сохраняется на этом устройстве.</p><div class="skin-grid">' +
      SKINS.map(s => '<button type="button" class="skin-tile" data-skin="' + s.id + '" aria-pressed="' + (s.id === cur) + '">' +
        '<span class="skin-prev sp-' + s.id + '">' + s.prev + '</span><span class="skin-name">' + s.name + '</span><span class="skin-sub">' + s.sub + '</span></button>').join('') +
      '</div>';
    sec.addEventListener('click', ev => { const t = ev.target.closest('.skin-tile'); if (t) set(t.dataset.skin); });
    const intro = wrap.querySelector('.set-intro');
    if (intro) intro.after(sec); else wrap.prepend(sec);
    // вид таблицы слов на телефоне
    const vs = document.createElement('section'); vs.className = 'skin-pick wview-pick'; vs.setAttribute('aria-label', 'Таблица слов на телефоне');
    const cv = getView();
    vs.innerHTML = '<h3 class="skin-h">Таблица слов на телефоне</h3><p class="skin-note">Как листать «Лексику» на узком экране. Выбор сохраняется на этом устройстве.</p><div class="skin-grid">' +
      [['levels', 'По уровням', 'один уровень, внутри все темы'], ['topics', 'По темам', 'одна тема, внутри уровни A1–B2']].map(v =>
        '<button type="button" class="skin-tile wview-tile" data-wview="' + v[0] + '" aria-pressed="' + (v[0] === cv) + '">' +
        '<span class="skin-prev wv-prev wv-' + v[0] + '"><i></i><i></i><i></i></span><span class="skin-name">' + v[1] + '</span><span class="skin-sub">' + v[2] + '</span></button>').join('') +
      '</div>';
    vs.addEventListener('click', ev => { const t = ev.target.closest('.wview-tile'); if (t) setView(t.dataset.wview); });
    sec.after(vs);
  }

  // ---- «Лексика» на телефоне: по темам (как было) или по уровням ----
  const VKEY = 'ef_wview', LKEY = 'ef_wlvl', LVS = ['A1', 'A2', 'B1', 'B2'];
  const LVNAME = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper-intermediate' };
  // по умолчанию — «по уровням»; «по темам» только если выбрано вручную
  function getView() { try { return localStorage.getItem(VKEY) === 'topics' ? 'topics' : 'levels'; } catch (e) { return 'levels'; } }
  function getLv() { try { const v = localStorage.getItem(LKEY); return LVS.includes(v) ? v : 'A1'; } catch (e) { return 'A1'; } }
  function setView(v) {
    try { localStorage.setItem(VKEY, v); } catch (e) {}
    document.querySelectorAll('.wview-tile').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.wview === v)));
    levelView();
  }
  function setLv(l) { try { localStorage.setItem(LKEY, l); } catch (e) {} levelView(); }
  function levelView() {
    const de = document.documentElement;
    const on = getView() === 'levels';
    if (on) { if (de.getAttribute('data-wview') !== 'levels') de.setAttribute('data-wview', 'levels'); }
    else if (de.hasAttribute('data-wview')) de.removeAttribute('data-wview');
    const m = document.getElementById('mode-w'); if (!m) return;
    const tree = m.querySelector('.tree'); if (!tree) return;
    const lv = getLv();
    if (tree.dataset.lv !== lv) tree.dataset.lv = lv;
    // переключатель уровней над таблицей: [‹]  A1 · Beginner / счётчик / полоса  [›]
    let nav = m.querySelector('.wlv-nav');
    if (!nav) {
      nav = document.createElement('div'); nav.className = 'wlv-nav';
      nav.innerHTML = '<button type="button" class="wlv-a" data-d="-1" aria-label="Предыдущий уровень">‹</button>' +
        '<div class="wlv-c"><b></b><span></span><i class="wlv-pb"><u></u></i></div>' +
        '<button type="button" class="wlv-a" data-d="1" aria-label="Следующий уровень">›</button>';
      nav.addEventListener('click', ev => {
        const b = ev.target.closest('.wlv-a'); if (!b) return;
        const i = LVS.indexOf(getLv()) + (+b.dataset.d);
        if (i >= 0 && i < LVS.length) { setLv(LVS[i]); const t = m.querySelector('.wlv-nav'); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      });
    }
    if (nav.nextElementSibling !== tree) tree.before(nav);
    // сколько слов уровня выучено (по счётчикам «14/14» на карточках), не чаще раза в 400 мс
    const now = Date.now();
    if (now - (levelView.t || 0) > 400) {
      levelView.t = now;
      let d = 0, t = 0;
      tree.querySelectorAll(':scope > .cell.band-' + lv + ' .node .src').forEach(s => {
        const mm = s.textContent.match(/(\d+)\s*\/\s*(\d+)/); if (mm) { d += +mm[1]; t += +mm[2]; }
      });
      const pct = t ? Math.round(d / t * 100) : 0;
      const sig = lv + '|' + d + '|' + t;
      if (nav.dataset.sig !== sig) {
        nav.dataset.sig = sig; nav.dataset.lv = lv;
        nav.querySelector('b').textContent = lv + ' · ' + LVNAME[lv];
        nav.querySelector('span').textContent = d + ' / ' + t + ' слов · ' + pct + '%';
        nav.querySelector('u').style.width = pct + '%';
        nav.setAttribute('aria-label', 'Уровень ' + (LVS.indexOf(lv) + 1) + ' из ' + LVS.length);
        nav.querySelector('[data-d="-1"]').disabled = lv === LVS[0];
        nav.querySelector('[data-d="1"]').disabled = lv === LVS[LVS.length - 1];
      }
    } else if (!levelView.p) {
      levelView.p = setTimeout(() => { levelView.p = 0; levelView(); }, 420);
    }
    // подписи тем над карточками уровня
    if (!on) return;
    const names = {};
    tree.querySelectorAll(':scope > .bhead').forEach(h => {
      const n = h.querySelector('.root .n'), r = h.querySelector('.root');
      names[h.dataset.branch] = { n: n ? n.textContent.trim() : h.dataset.branch, c: r ? getComputedStyle(r).backgroundColor : '' };
    });
    tree.querySelectorAll(':scope > .cell').forEach(cell => {
      const info = names[cell.dataset.branch]; if (!info) return;
      let t = cell.firstElementChild;
      if (!t || !t.classList.contains('wlv-topic')) { t = document.createElement('div'); t.className = 'wlv-topic'; cell.prepend(t); }
      if (t.textContent !== info.n) t.textContent = info.n;
      if (info.c && t.style.getPropertyValue('--bc') !== info.c) t.style.setProperty('--bc', info.c);
    });
  }
  // в режиме «по уровням» кнопки тем в полосе прокручивают к теме внутри уровня
  document.addEventListener('click', ev => {
    const chip = ev.target.closest('#mode-w .jumpnav button[data-key]');
    if (!chip || getView() !== 'levels' || window.matchMedia('(min-width: 1000px)').matches) return;
    setTimeout(() => {
      const cell = document.querySelector('#mode-w .tree > .cell.band-' + getLv() + '[data-branch="' + chip.dataset.key + '"]');
      if (cell) cell.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 60);
  });

  // ---- быстрый пункт в списке аккаунта: переключает оформления по кругу ----
  function ensureMenu() {
    document.querySelectorAll('.acc-menu').forEach(menu => {
      if (menu.querySelector('.acc-skin')) return;
      const anchor = menu.querySelector('.acc-set') || menu.querySelector('.acc-out');
      if (!anchor) return;
      const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it acc-skin'; it.setAttribute('role', 'menuitem');
      it.textContent = 'Оформление: ' + byId(get()).name;
      it.addEventListener('click', ev => {
        ev.stopPropagation(); set(next());
      });
      anchor.before(it);
    });
  }

  // ---- RPG, ПК: уровень героя в карточке профиля, единый вид блока со шкалами ----
  const LEGEND = '<span><span class="dot" style="background:var(--lv3)"></span>1–4 · изучаю</span>' +
    '<span><span class="dot" style="background:var(--lv6)"></span>5–7 · повторяю</span>' +
    '<span><span class="dot" style="background:var(--lv8)"></span>8–9 · знаю</span>' +
    '<span><span class="dot" style="background:var(--lv10)"></span>10 · закреплено</span>';
  const setTxt = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
  function rpgProfile() {
    // одинаковая легенда из 4 цветов в обоих режимах и обоих оформлениях
    document.querySelectorAll('.stats-row .legend').forEach(lg => { if (lg.dataset.uni !== '2') { lg.innerHTML = LEGEND; lg.dataset.uni = '2'; } });
    if (document.documentElement.getAttribute('data-skin') !== 'rpg') return;
    // «знаю» (уровень 8–10) — из строки статистики режима; слова — основа уровня героя (1 уровень за 50 слов)
    const knownOf = m => { const n = document.querySelector('#mode-' + m + ' .stats-row .num'); return ((n && n.textContent) || '').match(/знаю\s+(\d+)\s+из\s+(\d+)/); };
    const wm = knownOf('w');
    const words = wm ? +wm[1] : 0;
    const lvl = 1 + Math.floor(words / 50), into = words % 50;
    document.querySelectorAll('.hub').forEach(hub => {
      const mode = hub.closest('#mode-g') ? 'g' : 'w';
      const me = hub.querySelector('.hub-me'), row = hub.querySelector('.stats-row'), nav = hub.querySelector('.hub-nav');
      if (!me || !row) return;
      // верхняя строка блока со шкалами: что считаем и сколько выучено
      let meta = me.querySelector('.rpg-meta');
      if (!meta) { meta = document.createElement('div'); meta.className = 'rpg-meta'; meta.innerHTML = '<b></b><span style="white-space:nowrap"></span>'; meta.style.flexWrap = 'wrap'; me.prepend(meta); }
      const m = mode === 'w' ? wm : knownOf('g');
      setTxt(meta.children[0], mode === 'w' ? 'Слова' : 'Правила');
      setTxt(meta.children[1], 'знаю ' + (m ? m[1] + ' / ' + m[2] : '—'));
      // уровень героя под именем
      if (nav) {
        let lv = nav.querySelector('.rpg-lvl');
        if (!lv) {
          lv = document.createElement('div'); lv.className = 'rpg-lvl';
          lv.innerHTML = '<b></b><span></span><i><u></u></i>';
          const acc = nav.querySelector('.acc'); if (acc) acc.after(lv); else nav.prepend(lv);
        }
        setTxt(lv.children[0], 'ур. ' + lvl);
        setTxt(lv.children[1], into + ' / 50 до ' + (lvl + 1) + '-го');
        const w = (into / 50 * 100).toFixed(0) + '%';
        if (lv.querySelector('u').style.width !== w) lv.querySelector('u').style.width = w;
      }
    });
    document.querySelectorAll('.acc-btn').forEach(btn => {
      const n = ((btn.querySelector('.acc-name') || {}).textContent || '').trim();
      const ini = (n[0] || '?').toUpperCase();
      if (btn.dataset.ini !== ini) btn.dataset.ini = ini;
    });
  }

  // ---- цвета уровней и шкала A1–B2: под отрезком только уровень, подробности — во всплывающей подсказке ----
  const cs = document.createElement('style');
  cs.textContent =
    // 4 цвета уровней: 1–4 изучаю · 5–7 повторяю · 8–9 знаю · 10 закреплено (0 — серый фон)
    ':root{--lv1:#fb923c;--lv2:#fb923c;--lv3:#fb923c;--lv4:#fb923c;--lv5:#facc15;--lv6:#facc15;--lv7:#facc15;--lv8:#22c55e;--lv9:#22c55e;--lv10:#06b6d4}' +
    // шкалы 0–10 закрашиваются одним цветом — цветом группы, в которой сейчас слово или правило
    ':is(.lvl,.gbar)[data-b="l"] i.on,.lvle[data-b="l"] .lvsegs .lvs.on::before{background:var(--lv1)}' +
    ':is(.lvl,.gbar)[data-b="r"] i.on,.lvle[data-b="r"] .lvsegs .lvs.on::before{background:var(--lv5)}' +
    ':is(.lvl,.gbar)[data-b="k"] i.on,.lvle[data-b="k"] .lvsegs .lvs.on::before{background:var(--lv8)}' +
    ':is(.lvl,.gbar)[data-b="m"] i.on,.lvle[data-b="m"] .lvsegs .lvs.on::before{background:var(--lv10)}' +
    '.cefr-cap{display:none}' +
    '.cefr-seg::after{content:attr(data-cefr);display:block;padding:4px 7px 5px;border-top:1px solid var(--line);background:var(--surface-2);' +
      'font:700 .68rem \'IBM Plex Mono\',monospace;color:var(--ink);white-space:nowrap}' +
    '@media (max-width:720px){.cefr-seg::after{text-align:center;padding:4px 3px 5px;font-size:.62rem}}';
  document.head.appendChild(cs);
  function cefrTitles() {
    document.querySelectorAll('.cefr-seg').forEach(seg => {
      const b = seg.querySelector('.cefr-cap b'), sp = seg.querySelector('.cefr-cap span');
      const pct = ((b && b.textContent) || '').split('·')[1];
      const t = seg.dataset.cefr + ': ' + ((sp && sp.textContent) || '').replace(' / ', ' из ') + (pct ? ' ·' + pct : '');
      if (seg.title !== t) { seg.title = t; seg.setAttribute('aria-label', t); }
    });
  }

  apply(get());
  const run = () => { ensureSettings(); ensureMenu(); rpgProfile(); levelView(); cefrTitles(); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();

// ---- шторка: держим, пока не определились аккаунт и прогресс (чтобы не мелькал «Гость») ----
(function () {
  const de = document.documentElement;
  if (!de.classList.contains('auth-wait')) return;
  const t0 = Date.now(); let chipAt = 0;
  function ready() {
    const a = document.getElementById('authBox'); if (a && !a.hidden) return true;      // экран входа
    const f = document.getElementById('offlineFlag'); const on = f && f.dataset.on;
    if (on === '1') return true;                                                       // режим «без регистрации»
    if (on !== '0') return false;                                                      // вход ещё не определился
    const chip = document.querySelector('#profList .pchip[data-active="1"]');        // вошли: ждём профиль…
    if (!chip) return false;
    if (!chipAt) chipAt = Date.now();
    const n = document.querySelector('#mode-w .stats-row .num');                        // …и пришедший прогресс
    if (/(знаю|закреплено|повторяю|изучаю)\s+[1-9]/.test(n ? n.textContent : '')) return true;
    return Date.now() - chipAt > 2000;                                                 // новый аккаунт без прогресса
  }
  let iv;
  function done() { clearInterval(iv); requestAnimationFrame(() => requestAnimationFrame(() => de.classList.remove('auth-wait'))); }
  iv = setInterval(() => { if (ready() || Date.now() - t0 > 8000) done(); }, 100);
})();

// ---- смена аккаунта: кнопки действий выключены, пока не загрузится прогресс нового профиля ----
(function () {
  const de = document.documentElement;
  const BLOCK = '.rv-big .rvb, .rv-acts .m-btn, [data-mix], .tbtn, .lvstep, .rread';
  const stat = () => {
    const w = document.querySelector('#mode-w .stats-row .num'), g = document.querySelector('#mode-g .stats-row .num');
    return ((w && w.textContent) || '') + '|' + ((g && g.textContent) || '');
  };
  const active = () => { const c = document.querySelector('#profList .pchip[data-active="1"]'); return c ? c.textContent : ''; };
  let iv = null;
  function start(prev) {
    if (iv) clearInterval(iv);
    const t0 = Date.now(); let tChip = 0, base = '';
    de.classList.add('switching');
    iv = setInterval(() => {
      const now = Date.now();
      if (!tChip) {
        if (active() !== prev) { tChip = now; base = stat(); }   // профиль переключился, ждём его данные
        else if (now - t0 > 2500) return stop();                  // переключение не случилось
      } else {
        const s = stat();
        if (s !== base && now - tChip > 250) return stop();        // пришёл прогресс нового профиля
        if (now - tChip > 2500) return stop();                      // профиль без прогресса — цифры не изменятся
      }
      if (now - t0 > 8000) stop();                                  // страховка
    }, 100);
  }
  function stop() { clearInterval(iv); iv = null; setTimeout(() => de.classList.remove('switching'), 150); }
  // начало: выбор другого аккаунта в выпадающем списке
  document.addEventListener('click', ev => {
    const it = ev.target.closest('.acc-menu .acc-it');
    if (!it || it.classList.contains('acc-set') || it.classList.contains('acc-out') || it.classList.contains('acc-skin') || it.classList.contains('on')) return;
    if (document.querySelectorAll('#profList .pchip').length < 2) return;
    start(active());   // запоминаем текущий профиль до того, как приложение переключит выбор
  }, true);
  // пока идёт загрузка — действия не срабатывают (и мышью, и клавиатурой)
  ['click', 'pointerdown', 'keydown'].forEach(type => document.addEventListener(type, ev => {
    if (!de.classList.contains('switching')) return;
    if (type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
    const t = ev.target.closest && ev.target.closest(BLOCK);
    if (t) { ev.preventDefault(); ev.stopPropagation(); }
  }, true));
})();
