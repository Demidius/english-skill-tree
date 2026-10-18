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

// «Я знаю», неверный ответ: показываем, какие буквы ошибочны.
// Неверная или лишняя буква — красная зачёркнутая, правильная/пропущенная — зелёная.
(function () {
  const st = document.createElement('style');
  st.textContent =
    '.kres b[data-diff]{color:inherit;white-space:pre-wrap;letter-spacing:.02em}' +
    '.kd-del{color:var(--accent-2,#ef4b72);text-decoration:line-through;text-decoration-thickness:2px}' +
    '.kd-ins{color:var(--st-mastered,#22d39c);background:color-mix(in srgb,var(--st-mastered,#22d39c) 18%,transparent);border-radius:2px;padding:0 1px}';
  document.head.appendChild(st);

  const low = s => s.toLowerCase().replace(/[’`ʼ]/g, "'");
  const strip = s => s.replace(/^(to|a|an|the)\s+/i, '');
  function alts(en) {
    const base = en.replace(/\(.*?\)/g, ' ');
    const out = [en, base].concat(base.split(/\s*[\/;,]\s*|\s+or\s+/))
      .map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
    out.slice().forEach(s => out.push(strip(s)));
    return [...new Set(out)];
  }
  function table(a, b) {
    const d = [];
    for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d;
  }
  function ops(t, r) {
    const a = low(t), b = low(r), d = table(a, b), out = [];
    let i = a.length, j = b.length;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        out.push(a[i - 1] === b[j - 1] ? ['ok', t[i - 1]] : ['sub', t[i - 1], r[j - 1]]); i--; j--;
      } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { out.push(['del', t[i - 1]]); i--; }
      else { out.push(['ins', r[j - 1]]); j--; }
    }
    return out.reverse();
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sp = (c, s) => '<span class="' + c + '">' + esc(s === ' ' && c === 'kd-ins' ? '␣' : s) + '</span>';

  function mark(b) {
    b.dataset.diff = '1';
    const fc = b.closest('.fc'), back = fc && fc.querySelector('.back');
    const en = back && back.firstChild && back.firstChild.nodeType === 3 ? back.firstChild.nodeValue.trim() : '';
    const typed = b.textContent;
    if (!en || !typed) return;
    let best = null;
    alts(en).forEach(r => [typed, strip(typed)].forEach(t => {
      const dist = table(low(t), low(r))[t.length][r.length];
      if (!best || dist < best.dist) best = { t, r, dist };
    }));
    if (!best || best.dist === 0) return;
    // много ошибок — значит, это другое слово, буквы не размечаем
    if (best.dist > Math.max(2, Math.ceil(best.r.length * 0.6))) return;
    b.innerHTML = ops(best.t, best.r).map(o =>
      o[0] === 'ok' ? esc(o[1]) :
      o[0] === 'sub' ? sp('kd-del', o[1]) + sp('kd-ins', o[2]) :
      o[0] === 'del' ? sp('kd-del', o[1]) : sp('kd-ins', o[1])).join('');
    b.setAttribute('aria-label', 'ты написал ' + typed + ', правильно ' + best.r);
  }
  function scan() { document.querySelectorAll('.kres.no b:not([data-diff])').forEach(mark); }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
