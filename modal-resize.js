// Открытое окно: страница под ним не прокручивается колёсиком — только само окно.
(function () {
  const root = document.documentElement;
  const st = document.createElement('style');
  st.textContent = 'html.modal-open,html.modal-open body{overflow:hidden}html.modal-open{scrollbar-gutter:stable}' +
    '.modal,.modal .fc{overscroll-behavior:contain}';
  document.head.appendChild(st);
  function sync() { root.classList.toggle('modal-open', [...document.querySelectorAll('.modal-back')].some(b => !b.hidden)); }
  new MutationObserver(sync).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
  sync();
})();

// ПК: окно карточек можно растянуть — потяни за правый нижний угол.
// Размер запоминается в этом браузере; двойной клик по углу возвращает стандартный.
(function () {
  const KEY = 'ef_card_size', MQ = window.matchMedia('(min-width: 1000px)'), root = document.documentElement;
  const SEL = '.modal.fixed:not(.testm)';
  const st = document.createElement('style');
  st.textContent = '@media (min-width:1000px){' +
    SEL + '{position:relative;max-width:var(--card-w,560px);height:var(--card-h,min(720px,calc(100% - 32px)));max-height:calc(100% - 32px)}' +
    SEL + '::after{content:"";position:absolute;right:4px;bottom:4px;width:14px;height:14px;pointer-events:none;opacity:.6;' +
      'background:linear-gradient(135deg,transparent 0 45%,var(--muted) 45% 53%,transparent 53% 66%,var(--muted) 66% 74%,transparent 74%)}' +
    SEL + '.rz-hot{cursor:nwse-resize}' +
    'html.rz-drag,html.rz-drag *{cursor:nwse-resize!important;user-select:none!important}}';
  document.head.appendChild(st);

  function setSize(w, h, save) {
    w = Math.round(Math.max(420, Math.min(window.innerWidth - 32, w)));
    h = Math.round(Math.max(420, Math.min(window.innerHeight - 32, h)));
    root.style.setProperty('--card-w', w + 'px'); root.style.setProperty('--card-h', h + 'px');
    if (save) try { localStorage.setItem(KEY, w + 'x' + h); } catch (e) {}
  }
  function saved() { try { const m = (localStorage.getItem(KEY) || '').match(/^(\d+)x(\d+)$/); return m ? [+m[1], +m[2]] : null; } catch (e) { return null; } }
  const s0 = saved(); if (s0) setSize(s0[0], s0[1], false);

  // правый нижний угол окна (18 px)
  function corner(ev) {
    if (!MQ.matches || !ev.target.closest) return null;
    const m = ev.target.closest(SEL); if (!m) return null;
    const r = m.getBoundingClientRect();
    return ev.clientX > r.right - 18 && ev.clientY > r.bottom - 18 ? m : null;
  }
  let drag = null, justDragged = false;
  document.addEventListener('pointerdown', ev => {
    if (ev.button !== 0) return;
    const m = corner(ev); if (!m) return;
    const r = m.getBoundingClientRect();
    drag = { x: ev.clientX, y: ev.clientY, w: r.width, h: r.height };
    root.classList.add('rz-drag'); ev.preventDefault(); ev.stopPropagation();
  }, true);
  document.addEventListener('pointermove', ev => {
    if (drag) { setSize(drag.w + 2 * (ev.clientX - drag.x), drag.h + 2 * (ev.clientY - drag.y), false); return; } // окно по центру — тянем в обе стороны
    const m = ev.target.closest && ev.target.closest(SEL);
    if (m) m.classList.toggle('rz-hot', !!corner(ev));
  }, { passive: true });
  function end() {
    if (!drag) return;
    drag = null; root.classList.remove('rz-drag'); justDragged = true; setTimeout(() => { justDragged = false; }, 0);
    const cs = getComputedStyle(root);
    setSize(parseFloat(cs.getPropertyValue('--card-w')), parseFloat(cs.getPropertyValue('--card-h')), true);
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
  // клик после перетаскивания не должен закрывать окно
  document.addEventListener('click', ev => { if (justDragged) { ev.preventDefault(); ev.stopPropagation(); justDragged = false; } }, true);
  document.addEventListener('dblclick', ev => {
    if (!corner(ev)) return;
    root.style.removeProperty('--card-w'); root.style.removeProperty('--card-h');
    try { localStorage.removeItem(KEY); } catch (e) {}
  }, true);
  window.addEventListener('resize', () => { const s = saved(); if (s) setSize(s[0], s[1], false); });
})();
