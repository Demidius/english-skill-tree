// Одинаковая высота верхней панели в «Правилах» и «Лексике» на ПК: при переключении режимов
// страница не прыгает. Обе панели получают min-height по самой высокой из двух.
(function () {
  const IDS = ['mode-g', 'mode-w'];
  const wide = window.matchMedia('(min-width: 1000px)');
  let raf = 0;
  const hiddenObs = [];

  function hubOf(sec) { const h = sec && sec.querySelector('.hub'); return h && !h.hidden ? h : null; }

  function sync() {
    raf = 0;
    const secs = IDS.map(id => document.getElementById(id));
    const hubs = secs.map(hubOf);
    hubs.forEach(h => { if (h) h.style.removeProperty('min-height'); });
    if (!wide.matches) return;
    let max = 0;
    secs.forEach((sec, i) => {
      const hub = hubs[i]; if (!hub) return;
      // скрытый режим на мгновение показываем, чтобы узнать его высоту (в пределах одного кадра — не мигает)
      const wasHidden = sec.hidden;
      if (wasHidden) sec.hidden = false;
      max = Math.max(max, hub.getBoundingClientRect().height);
      if (wasHidden) sec.hidden = true;
    });
    if (max > 0) hubs.forEach(h => { if (h) h.style.minHeight = Math.ceil(max) + 'px'; });
    hiddenObs.forEach(o => o.takeRecords()); // собственное переключение hidden не считается изменением
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(sync); };

  window.addEventListener('resize', schedule);
  if (wide.addEventListener) wide.addEventListener('change', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  // смена содержимого (счётчики, уровни, аккаунт), режима, размера шрифта или оформления
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin', 'data-fs', 'style'] });
  IDS.forEach(id => {
    const s = document.getElementById(id); if (!s) return;
    const o = new MutationObserver(schedule); o.observe(s, { attributes: true, attributeFilter: ['hidden'] }); hiddenObs.push(o);
  });
  schedule();
})();
