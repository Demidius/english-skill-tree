// Переключение оформлений: «Как сейчас» / «Тетрадь» / «RPG».
// Выбор хранится в браузере (ef_skin), применяется атрибутом data-skin на <html>.
(function () {
  const KEY = 'ef_skin';
  const SKINS = [
    { id: 'classic',  name: 'Как сейчас', sub: 'тёмный, цвета земли', bg: '#1c1a16', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'notebook', name: 'Тетрадь',    sub: 'клетка и маркер',     bg: '#FBFCFF', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'rpg',      name: 'RPG',        sub: 'пиксели и квесты',    bg: '#1C1C20', prev: '<b>Aa</b><i></i><i></i>' },
  ];
  const byId = id => SKINS.find(s => s.id === id) || SKINS[0];
  function get() { try { return byId(localStorage.getItem(KEY)).id; } catch (e) { return 'classic'; } }
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

  // ---- RPG, ПК: уровень под именем и буква в аватаре ----
  function rpgProfile() {
    if (document.documentElement.getAttribute('data-skin') !== 'rpg') return;
    document.querySelectorAll('.hub').forEach(hub => {
      const me = hub.querySelector('.hub-me'), row = hub.querySelector('.stats-row'); if (!me || !row) return;
      let meta = me.querySelector('.rpg-meta');
      if (!meta) { meta = document.createElement('div'); meta.className = 'rpg-meta'; meta.innerHTML = '<b></b><span></span>'; me.prepend(meta); }
      const t = (row.querySelector('.num') || {}).textContent || '';
      let a = '', b = '', m = t.match(/выучено\s+(\d+)\s+из\s+(\d+)/);
      if (m) { a = 'ур. ' + (1 + Math.floor(+m[1] / 50)); b = m[1] + ' / ' + m[2]; }
      else if ((m = t.match(/начато\s+(\d+)\s+из\s+(\d+)/))) { a = 'правила'; b = m[1] + ' / ' + m[2]; }
      const x = meta.children[0], y = meta.children[1];
      if (x.textContent !== a) x.textContent = a;
      if (y.textContent !== b) y.textContent = b;
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
