// Телефон: поиск свёрнут в кнопку-лупу слева от «Фильтров» и раскрывается по нажатию.
// extras.js держит «Фильтры» первыми в полосе тем, поэтому лупа стоит в DOM сразу после них,
// а левее на экране оказывается за счёт CSS order (search-fold.css).
(function () {
  const MQ = window.matchMedia('(max-width: 720px)');
  const ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5L21 21"></path></svg>';

  function setup(mode) {
    const search = mode.querySelector('.study-search'), jn = mode.querySelector('.jumpnav');
    if (!search || !jn) return false;
    if (jn.querySelector('.search-toggle')) return true;
    const input = search.querySelector('input'), results = search.querySelector('.study-search-results');
    if (!search.id) search.id = 'study-search-' + mode.id;

    const btn = document.createElement('button');
    btn.type = 'button';
    // Класс study-search нужен подсказкам тура: на телефоне поле свёрнуто, и шаг «Поиск» указывает на лупу.
    btn.className = 'search-toggle study-search';
    btn.setAttribute('aria-label', 'Поиск');
    btn.setAttribute('aria-controls', search.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = ICON;
    const ft = jn.querySelector('.filters-toggle');
    if (ft && ft.parentNode === jn) ft.after(btn); else jn.prepend(btn);

    function set(open, focus) {
      mode.classList.toggle('search-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!MQ.matches) return;
      if (open && focus && input) {
        input.focus({ preventScroll: true });
        search.scrollIntoView({ block: 'start' });
      } else if (!open && input && document.activeElement === input) {
        input.blur();
      }
    }
    btn.addEventListener('click', () => set(!mode.classList.contains('search-open'), true));
    // Поиск со ссылки на карточке («Лексика · 1A») заполняет поле сам — тогда панель раскрывается.
    if (results) new MutationObserver(() => { if (!results.hidden) set(true, false); })
      .observe(results, { attributes: true, attributeFilter: ['hidden'] });
    return true;
  }

  function all() { return ['mode-g', 'mode-w'].map(id => document.getElementById(id)).filter(Boolean).map(setup).every(Boolean); }
  if (!all()) {
    const mo = new MutationObserver(() => { if (all()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();
