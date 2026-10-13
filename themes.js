// Переключение оформлений: «RPG» (по умолчанию) / «Классика» / «Тетрадь».
// Выбор хранится в браузере (ef_skin), применяется атрибутом data-skin на <html>.
(function () {
  const KEY = 'ef_skin';
  const DEF = 'rpg'; // оформление по умолчанию — для тех, кто ещё ничего не выбирал
  const SKINS = [
    { id: 'classic',  name: 'Классика',   sub: 'тёмный, цвета земли', bg: '#1c1a16', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'notebook', name: 'Тетрадь',    sub: 'клетка и маркер',     bg: '#FBFCFF', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'rpg',      name: 'RPG',        sub: 'пиксели и квесты',    bg: '#1C1C20', prev: '<b>Aa</b><i></i><i></i>' },
  ];
  const byId = id => SKINS.find(s => s.id === id) || SKINS.find(s => s.id === DEF);
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
  }

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
  const LEGEND = '<span><span class="dot" style="background:var(--st-none)"></span>новое (0)</span>' +
    '<span><span class="dot" style="background:var(--st-learn)"></span>изучаю (1–4)</span>' +
    '<span><span class="dot" style="background:var(--st-review)"></span>повторяю (5–9)</span>' +
    '<span><span class="dot" style="background:var(--st-mastered)"></span>выучено (10)</span>';
  const setTxt = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
  function rpgProfile() {
    if (document.documentElement.getAttribute('data-skin') !== 'rpg') return;
    // выучено слов — основа уровня героя (1 уровень за 50 слов)
    const wn = document.querySelector('#mode-w .stats-row .num');
    const wm = ((wn && wn.textContent) || '').match(/выучено\s+(\d+)\s+из\s+(\d+)/);
    const words = wm ? +wm[1] : 0;
    const lvl = 1 + Math.floor(words / 50), into = words % 50;
    document.querySelectorAll('.hub').forEach(hub => {
      const mode = hub.closest('#mode-g') ? 'g' : 'w';
      const me = hub.querySelector('.hub-me'), row = hub.querySelector('.stats-row'), nav = hub.querySelector('.hub-nav');
      if (!me || !row) return;
      // верхняя строка блока со шкалами: что считаем и сколько выучено
      let meta = me.querySelector('.rpg-meta');
      if (!meta) { meta = document.createElement('div'); meta.className = 'rpg-meta'; meta.innerHTML = '<b></b><span></span>'; me.prepend(meta); }
      let done = 0, total = 0;
      if (mode === 'w') { if (wm) { done = +wm[1]; total = +wm[2]; } }
      else {
        const bar = row.querySelector('.bar');
        const m = ((bar && bar.title) || '').match(/выучено \(10\):\s*(\d+).*из\s+(\d+)/);
        if (m) { done = +m[1]; total = +m[2]; }
      }
      setTxt(meta.children[0], mode === 'w' ? 'Слова' : 'Правила');
      setTxt(meta.children[1], 'выучено ' + done + ' / ' + total);
      // одинаковая легенда в обоих режимах
      const lg = row.querySelector('.legend');
      if (lg && lg.dataset.uni !== '1') { lg.innerHTML = LEGEND; lg.dataset.uni = '1'; }
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

  apply(get());
  const run = () => { ensureSettings(); ensureMenu(); rpgProfile(); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
