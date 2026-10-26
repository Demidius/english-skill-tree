// Телефон: разделы «Правила / Лексика / Настройки» — в нижней панели.
// extras.js на телефоне кладёт переключатель в строку с аккаунтом (.navrow); отсюда он уезжает вниз.
// Панель лежит внутри .title-row, поэтому подсказка тура «Здесь разделы» её находит.
// На ПК extras.js сам возвращает переключатель в общий блок, а панель прячется.
(function () {
  const MQ = window.matchMedia('(min-width: 1000px)');
  let bar = null;

  function place() {
    const md = document.querySelector('.modes');
    const tr = document.querySelector('.title-row');
    if (!md || !tr) return;
    if (MQ.matches) { if (bar) bar.hidden = true; return; }
    if (!bar) {
      bar = document.createElement('nav');
      bar.className = 'tabbar';
      bar.setAttribute('aria-label', 'Разделы');
      // Раздел из нижней панели открывается с начала; повторное нажатие тоже возвращает наверх.
      bar.addEventListener('click', ev => { if (ev.target.closest('button[data-mode]')) window.scrollTo(0, 0); });
    }
    if (bar.parentNode !== tr) tr.appendChild(bar);
    if (md.parentNode !== bar) bar.appendChild(md);
    md.classList.remove('in-hub');
    bar.hidden = false;
  }

  place();
  MQ.addEventListener ? MQ.addEventListener('change', place) : MQ.addListener(place);
  // extras.js перекладывает переключатель при загрузке и смене ширины — забираем его обратно в панель.
  const top = document.querySelector('header.top');
  if (top) new MutationObserver(() => { if (!MQ.matches) place(); }).observe(top, { childList: true, subtree: true });
})();
