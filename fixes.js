// Мелкие правки переводов — небольшой файл, чтобы быстро исправлять отдельные карточки.
// Формат строки: id карточки | английское | новый русский
(function () {
  const RU = `
da-routine-2|get home late|поздно возвращаться домой
`;
  if (typeof W_BRANCHES === 'undefined') return;
  const idx = {};
  W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(p => Object.values(b[p] || {}).forEach(cs => cs.forEach(c => {
    if (c && typeof c[3] === 'string') idx[c[0]] = c;
  }))));
  RU.trim().split('\n').forEach(line => {
    const [id, en, ru] = line.split('|').map(s => s.trim());
    const c = idx[id]; if (!c || !ru) return;
    c[3] = c[3].split(';').map(x => {
      const f = x.split('|');
      if (f[0].trim() === en) { const lead = f[1].match(/^\s*/)[0]; f[1] = lead + ru; }
      return f.join('|');
    }).join(';');
  });
})();
