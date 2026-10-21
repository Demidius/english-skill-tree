// Run after the legacy data patches/deduplication and before app.js.
// Course sections reference canonical words, so revisiting a word in another
// lesson does not add a second SRS record or inflate the global word count.
(function () {
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'w';
  const norm = s => s.toLowerCase().replace(/[’`]/g, "'").replace(/^(a|an|the) /, '')
    .replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^one (hundred|thousand)$/, '$1');
  const roots = s => new Set((s.toLowerCase().match(/[а-яё]{4,}/g) || []).map(w => w.slice(0, 5)));
  const old = [];
  W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(part => Object.entries(b[part] || {}).forEach(([level, cards]) => cards.forEach(card => {
    WORD_LEGACY_TOPICS.add(card[0]);
    card[3].split(';').filter(s => s.trim()).forEach(row => {
      const f = row.split('|').map(s => s.trim());
      old.push({ card, row, f, level, id: card[0], k: slug(f[0]), norm: norm(f[0]) });
    });
  }))));
  const byEnglish = new Map();
  old.forEach(r => { if (!byEnglish.has(r.norm)) byEnglish.set(r.norm, []); byEnglish.get(r.norm).push(r); });
  const canonical = new Map(), consumed = new Set(), sectionCards = [];
  const clean = s => String(s || '').replace(/[;|]/g, ',').replace(/\s+/g, ' ').trim();
  function legacySources(r) {
    const key = r.id + '|' + r.k;
    return [[r.id, r.k], ...(WORD_PROGRESS_ALIASES[key] || []), ...(A1_PHRASE_PROGRESS[key] || [])];
  }
  BEGINNER_COURSE.forEach(lesson => lesson.sections.forEach((section, index) => {
    const id = lesson.id + '-s' + (index + 1), rows = [];
    section.refs = [];
    section.words.forEach(([display, ru, pos]) => {
      // The verb lists show infinitive / Past Simple; they reuse the infinitive.
      const en = /^(APP[23]|12A)$/.test(lesson.code) && display.includes(' / ') ? display.split(' / ')[0] : display;
      const names = section.title === 'Алфавит' ? ['letter:' + en] : en.split(/\s+\/\s+/).map(norm);
      let target = names.map(n => canonical.get(n + '|' + pos)).find(Boolean);
      if (!target) {
        const meaning = roots(ru);
        const candidates = [...new Set(names.flatMap(n => byEnglish.get(n) || []))].filter(r =>
          r.f[2] === pos || [...roots(r.f[1])].some(w => meaning.has(w)));
        const compatible = candidates.filter(r => candidates.length === 1 || [...roots(r.f[1])].some(w => meaning.has(w)));
        compatible.sort((a, b) => ['A1', 'A2', 'B1', 'B2'].indexOf(a.level) - ['A1', 'A2', 'B1', 'B2'].indexOf(b.level));
        const match = compatible[0];
        const k = slug(en);
        target = { id, k, en };
        names.forEach(n => canonical.set(n + '|' + pos, target));
        const aliases = compatible.flatMap(legacySources);
        WORD_PROGRESS_ALIASES[id + '|' + k] = [...new Map(aliases.map(pair => [pair.join('|'), pair])).values()];
        compatible.forEach(r => consumed.add(r.id + '|' + r.k));
        const answerKey = match && match.id + '|' + match.f[0].toLowerCase();
        if (A1_PHRASE_ANSWERS[answerKey]) A1_PHRASE_ANSWERS[id + '|' + en.toLowerCase()] = A1_PHRASE_ANSWERS[answerKey];
        const note = match && (match.f[4] || NOTES[match.id + '|' + match.f[0]]) || '';
        rows.push([en, ru, pos, match?.f[3] || '', note].map(clean).join('|'));
      }
      // Keep the wording/meaning of this particular lesson in its list/session.
      section.refs.push([target.id, target.k, display, ru]);
    });
    if (rows.length) {
      WORD_LEGACY_TOPICS.add(id);
      sectionCards.push({ branch: section.branch, card: [id, lesson.label + ' · ' + section.title, lesson.title, rows.join(';')] });
    }
  }));
  W_BRANCHES.forEach(b => {
    // Everything outside the Beginner vocabulary becomes optional A1 Extra.
    b.extra = b.extra || {};
    b.extra.A1 = [...(b.cells.A1 || []), ...(b.extra.A1 || [])];
    b.cells.A1 = [];
    ['cells', 'extra'].forEach(part => Object.keys(b[part] || {}).forEach(level => {
      b[part][level].forEach(card => {
        card[3] = card[3].split(';').filter(row => {
          const en = row.split('|')[0].trim();
          return en && !consumed.has(card[0] + '|' + slug(en));
        }).join(';');
      });
      b[part][level] = b[part][level].filter(card => card[3].trim());
    }));
    sectionCards.filter(s => s.branch === b.key).forEach(s => b.cells.A1.push(s.card));
  });
})();
