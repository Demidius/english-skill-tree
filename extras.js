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

// Мелкие исправления транскрипций
if (typeof WORD_TR !== 'undefined') {
  WORD_TR['rebellious'] = ['rɪˈbeljəs', 'рибэ́льес'];
  WORD_TR['resist'] = ['rɪˈzɪst', 'ризи́ст'];
}

// «Я знаю»: принимать ответ и с сокращениями (it's, don't), и полной формой (it is, do not).
(function () {
  const norm = s => String(s).toLowerCase().replace(/[’`ʼ]/g, "'").replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ').trim().replace(/^(to|a|an|the) /, '');
  function variants(s) {
    let out = new Set([norm(s)]);
    const rules = [
      [/\bcan't\b/g, ['cannot', 'can not']],
      [/\bwon't\b/g, ['will not']],
      [/\bshan't\b/g, ['shall not']],
      [/\blet's\b/g, ['let us']],
      [/\b(\w+)n't\b/g, ['$1 not']],
      [/\b(\w+)'m\b/g, ['$1 am']],
      [/\b(\w+)'re\b/g, ['$1 are']],
      [/\b(\w+)'ve\b/g, ['$1 have']],
      [/\b(\w+)'ll\b/g, ['$1 will']],
      [/\b(\w+)'d\b/g, ['$1 would', '$1 had']],
      [/\b(\w+)'s\b/g, ['$1 is', '$1 has']],
    ];
    rules.forEach(([re, reps]) => {
      const next = new Set(out);
      out.forEach(v => { reps.forEach(r => { const w = v.replace(re, r); if (w !== v) next.add(w); }); });
      out = next;
    });
    const fin = new Set();
    out.forEach(v => fin.add(v.replace(/'/g, '').replace(/\s+/g, ' ').trim()));
    return fin;
  }
  function alts(en) {
    const base = en.replace(/\(.*?\)/g, ' ');
    return [en, base].concat(base.split(/\s*[\/;,]\s*|\s+or\s+/)).map(s => s.trim()).filter(Boolean);
  }
  let map = null;
  function byRu() {
    if (map) return map;
    map = {};
    if (typeof W_BRANCHES === 'undefined') return map;
    W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(p => Object.values(b[p] || {}).forEach(cs => cs.forEach(c => {
      if (!c || typeof c[3] !== 'string') return;
      c[3].split(';').forEach(x => {
        const f = x.split('|').map(y => y.trim());
        if (f[0] && f[1]) (map[f[1]] = map[f[1]] || []).push(f[0]);
      });
    }))));
    return map;
  }
  document.addEventListener('submit', ev => {
    const form = ev.target;
    if (!form || !form.classList || !form.classList.contains('kbox')) return;
    const inp = form.querySelector('#knownIn');
    const front = document.querySelector('.fc .front');
    if (!inp || !front || !inp.value.trim()) return;
    const cands = byRu()[front.textContent.trim()] || [];
    const typed = variants(inp.value);
    for (const en of cands) {
      for (const a of alts(en)) {
        const av = variants(a);
        for (const v of typed) if (av.has(v)) { inp.value = a; return; }
      }
    }
  }, true);
})();
