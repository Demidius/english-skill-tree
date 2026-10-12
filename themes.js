// Переключение оформлений: «Как сейчас» / «Тетрадь» / «Доска» / «RPG».
// Выбор хранится в браузере (ef_skin), применяется атрибутом data-skin на <html>.
(function () {
  const KEY = 'ef_skin';
  const SKINS = [
    { id: 'classic',  name: 'Как сейчас', sub: 'тёмный, цвета земли', bg: '#1c1a16', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'notebook', name: 'Тетрадь',    sub: 'клетка и маркер',     bg: '#FBFCFF', prev: '<b>Aa</b><i></i><i></i>' },
    { id: 'board',    name: 'Доска',      sub: 'мел и дерево',        bg: '#22382F', prev: '<b>Aa</b><i></i><i></i>' },
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

  apply(get());
  const run = () => { ensureSettings(); ensureMenu(); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
