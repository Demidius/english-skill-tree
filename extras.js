// Дополнительные горячие клавиши для карточек.
// 1–4 (оценки), 0 (обнулить), пробел/Enter (показать ответ), ← (предыдущее слово) уже есть в app.js.
// Здесь: 5 — «Я знаю» на лицевой стороне карточки.
document.addEventListener('keydown', ev => {
  if (ev.key !== '5' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const t = ev.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  const b = document.querySelector('.fc-know[data-act="kopen"]:not([disabled])');
  if (b && b.offsetParent !== null) {
    ev.preventDefault();
    ev.stopPropagation();
    b.click();
  }
}, true);
