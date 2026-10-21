// Split the existing course inventory without rebuilding its canonical keys.
// A word is core if it is explicitly selected in at least one course section.
(function () {
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'w';
  const core = new Set(), redirected = new Map();
  BEGINNER_COURSE.forEach(lesson => {
    const selection = BEGINNER_CORE[lesson.code];
    if (!selection || selection.length !== lesson.sections.length) throw new Error('Missing core selection: ' + lesson.code);
    lesson.sections.forEach((section, index) => {
      const names = selection[index] === '*' ? section.words.map(w => w[0]) : selection[index].split('|').filter(Boolean);
      for (const name of names) {
        const ref = section.refs.find(r => r[2] === name);
        if (!ref) throw new Error('Unknown core entry: ' + lesson.code + ' / ' + name);
        core.add(ref[0] + '|' + ref[1]);
      }
    });
  });
  W_BRANCHES.forEach(branch => {
    const base = [];
    for (const card of branch.cells.A1 || []) {
      const rows = card[3].split(';').filter(r => r.trim());
      const keyOf = row => card[0] + '|' + slug(row.split('|')[0].trim());
      const required = rows.filter(row => core.has(keyOf(row))), extra = rows.filter(row => !core.has(keyOf(row)));
      if (required.length) base.push([...card.slice(0, 3), required.join(';'), ...card.slice(4)]);
      if (!extra.length) continue;
      // A wholly supplementary topic keeps its ID. A mixed topic's optional
      // words get an alias to BOTH the previous course key and its older keys.
      const id = required.length ? card[0] + '-extra' : card[0];
      branch.extra.A1.push([id, card[1], card[2], extra.join(';'), ...card.slice(4)]);
      WORD_LEGACY_TOPICS.add(id);
      if (required.length) for (const row of extra) {
        const k = slug(row.split('|')[0].trim()), oldKey = card[0] + '|' + k;
        WORD_PROGRESS_ALIASES[id + '|' + k] = [[card[0], k], ...(WORD_PROGRESS_ALIASES[oldKey] || [])];
        redirected.set(oldKey, id);
        const en = row.split('|')[0].trim().toLowerCase(), answerKey = card[0] + '|' + en;
        if (A1_PHRASE_ANSWERS[answerKey]) A1_PHRASE_ANSWERS[id + '|' + en] = A1_PHRASE_ANSWERS[answerKey];
      }
    }
    branch.cells.A1 = base;
  });
  BEGINNER_COURSE.forEach(lesson => lesson.sections.forEach(section => {
    section.refs = section.refs.map(ref => redirected.has(ref[0] + '|' + ref[1]) ? [redirected.get(ref[0] + '|' + ref[1]), ...ref.slice(1)] : ref);
  }));
})();
