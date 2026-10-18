// Карточки слов: если на лицевой стороне начать печатать букву,
// сразу открывается «Я знаю», а набранная буква попадает в поле ввода.
document.addEventListener('keydown', ev => {
  if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.isComposing) return;
  if (!ev.key || ev.key.length !== 1 || !/[\p{L}']/u.test(ev.key)) return;
  const t = ev.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
  let inp = document.getElementById('knownIn');
  if (!inp || inp.offsetParent === null) {
    const b = document.querySelector('.fc-know[data-act="kopen"]:not([disabled])');
    if (!b || b.offsetParent === null) return;
    b.click();
    inp = document.getElementById('knownIn');
    if (!inp) return;
  }
  ev.preventDefault();
  ev.stopPropagation();
  inp.focus({ preventScroll: true });
  inp.value += ev.key;
  const n = inp.value.length;
  try { inp.setSelectionRange(n, n); } catch (e) {}
}, true);
