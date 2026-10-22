/* Shared, local search index. No progress or account data is needed. */
const CatalogSearch = (() => {
  const fold = value => String(value || '').toLowerCase().replace(/ё/g, 'е')
    .replace(/\p{Script=Latin}/gu, c => c.normalize('NFD').replace(/\p{M}/gu, ''))
    .replace(/['’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'w';
  const codePattern = () => /(?<![\p{L}\p{N}])(?:(?:PE|APP|R)\s*\d{1,2}|\d{1,2}\s*[A-DАБВСД])(?![\p{L}\p{N}])/giu;
  const code = value => value.toUpperCase().replace(/\s/g, '').replace(/[АБВСД]/g, c => ({А:'A', Б:'B', В:'B', С:'C', Д:'D'})[c]);
  function codes(value, ranges = false, letters = 'ABCD') {
    const found = [...String(value || '').matchAll(codePattern())].map(m => code(m[0]));
    if (ranges) {
      for (const m of String(value || '').matchAll(/(\d{1,2})([A-D])\s*[-–—]\s*(\d{1,2})([A-D])/gi)) {
        const first = (+m[1] - 1) * 4 + m[2].toUpperCase().charCodeAt(0) - 65;
        const last = (+m[3] - 1) * 4 + m[4].toUpperCase().charCodeAt(0) - 65;
        for (let n = first; n <= last && n < first + 100; n++) {
          const letter = String.fromCharCode(65 + n % 4);
          if (letters.includes(letter)) found.push((Math.floor(n / 4) + 1) + letter);
        }
      }
    }
    return [...new Set(found)];
  }
  function query(value) {
    const lessonCodes = codes(value);
    let text = String(value || '').replace(codePattern(), ' ');
    const levels = [...text.matchAll(/(?<![\p{L}\p{N}])([AB][12])(?![\p{L}\p{N}])/giu)].map(m => m[1].toUpperCase());
    text = text.replace(/(?<![\p{L}\p{N}])[AB][12](?![\p{L}\p{N}])/giu, ' ');
    if (lessonCodes.length) text = text.replace(/\b(?:lesson|unit)\b/gi, ' ').replace(/урок(?:а|и)?/gi, ' ');
    return {codes: lessonCodes, levels, text: fold(text), tokens: fold(text).split(' ').filter(Boolean)};
  }
  function createIndex({wordBranches = [], course = [], grammarBranches = []}) {
    const entries = [], words = new Map(), lettersByLevel = {};
    const rememberLetters = (level, source) => {
      lettersByLevel[level] ||= '';
      for (const c of codes(source)) if (/^\d+[A-D]$/.test(c) && !lettersByLevel[level].includes(c.at(-1))) lettersByLevel[level] += c.at(-1);
    };
    for (const lesson of course) rememberLetters('A1', lesson.code);
    for (const branch of grammarBranches) for (const [level, cards] of Object.entries(branch.cells || {})) for (const c of cards) rememberLetters(level, c[4]);
    const add = item => { item.primary = fold(item.primary || item.title); item.text = fold(item.text || item.primary); entries.push(item); return item; };
    for (const branch of wordBranches) {
      for (const part of ['cells', 'extra']) for (const [level, cards] of Object.entries(branch[part] || {})) for (const c of cards) {
        const path = branch.ru + ' · ' + c[1];
        if (!c[0].startsWith('efb-')) add({kind:'topics', title:c[1], subtitle:c[2], path:branch.ru, level, extra:part === 'extra', topicId:c[0], codes:codes(c[4]), primary:c[1] + ' ' + c[2], text:[c[1], c[2], branch.name, branch.ru].join(' ')});
        for (const row of c[3].split(';').filter(r => r.trim())) {
          const [en, ru] = row.split('|').map(s => s.trim()), key = slug(en);
          const item = add({kind:'words', title:en, subtitle:ru, path, level, extra:part === 'extra', topicId:c[0], wordKey:key, codes:codes(c[4]), locations:[], primary:en + ' ' + ru});
          words.set(c[0] + '|' + key, item);
        }
      }
    }
    for (const lesson of course) {
      const lessonCodes = [...new Set([...codes(lesson.code), ...codes(lesson.label)])];
      const hasBase = refs => refs.some(([id,k]) => !words.get(id + '|' + k)?.extra);
      const extraLesson = !hasBase(lesson.sections.flatMap(s => s.refs));
      add({kind:'lessons', title:lesson.title, subtitle:lesson.ru, path:'Beginner', label:lesson.label, level:'A1', courseId:lesson.id, extra:extraLesson, codes:lessonCodes, primary:lesson.title + ' ' + lesson.ru, text:[lesson.title, lesson.ru, lesson.label].join(' ')});
      lesson.sections.forEach((section, sectionIndex) => {
        add({kind:'topics', title:section.title, subtitle:lesson.title, path:lesson.ru, label:lesson.label, level:'A1', courseId:lesson.id, sectionIndex, extra:!hasBase(section.refs), codes:lessonCodes, primary:section.title, text:[section.title, lesson.title, lesson.ru].join(' ')});
        for (const [topicId, wordKey, en, ru] of section.refs || []) {
          const item = words.get(topicId + '|' + wordKey);
          if (!item) continue;
          item.locations.push({courseId:lesson.id, sectionIndex, label:lesson.label, title:section.title, codes:lessonCodes});
          item.codes = [...new Set([...item.codes, ...lessonCodes])];
          item.primary += ' ' + fold(en + ' ' + ru);
          item.text = item.primary;
        }
      });
    }
    for (const branch of grammarBranches) for (const [level, cards] of Object.entries(branch.cells || {})) for (const c of cards) {
      add({kind:'rules', title:c[1], subtitle:c[2], path:branch.ru, level, topicId:c[0], label:c[4], codes:codes(c[4], true, lettersByLevel[level]), primary:c[1] + ' ' + c[2], text:[c[1], c[2], branch.name, branch.ru].join(' ')});
    }
    return entries;
  }
  function find(index, value, scope = 'words') {
    const q = query(String(value).slice(0, 120)), groups = {lessons:[], topics:[], words:[], rules:[]};
    if (!q.tokens.length && !q.codes.length && !q.levels.length) return {groups, total:0, query:q};
    for (const item of index) {
      if ((scope === 'rules') !== (item.kind === 'rules')) continue;
      if (q.levels.length && !q.levels.includes(item.level)) continue;
      if (q.codes.length && !q.codes.every(c => item.codes.includes(c))) continue;
      if (!q.tokens.length && q.codes.length && item.kind === 'words') continue;
      if (!q.tokens.every(t => item.text.includes(t))) continue;
      const location = item.locations && (item.locations.find(l => q.codes.length && q.codes.every(c => l.codes.includes(c))) || item.locations[0]);
      const primary = item.primary.split(' ');
      const score = (fold(item.title) === q.text || fold(item.subtitle) === q.text ? 100 : 0)
        + q.tokens.reduce((n, t) => n + (primary.includes(t) ? 10 : item.primary.includes(t) ? 3 : 0), 0);
      groups[item.kind].push({...item, location, score});
    }
    for (const group of Object.values(groups)) group.sort((a, b) => b.score - a.score);
    return {groups, total:Object.values(groups).reduce((n, g) => n + g.length, 0), query:q};
  }
  function related(index, source, level, scope) {
    if (!['words', 'rules'].includes(scope)) return [];
    const entries = index.filter(item => item.level === level);
    const letters = [...new Set(entries.flatMap(item => item.codes || []).filter(c => /^\d+[A-D]$/.test(c)).map(c => c.at(-1)))].join('');
    const wanted = new Set(codes(source, true, letters));
    return entries.filter(item => item.kind === (scope === 'rules' ? 'rules' : 'topics')
      && (item.kind === 'rules' ? codes(item.label, true, letters) : item.codes).some(c => wanted.has(c)));
  }
  return {createIndex, find, related};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = CatalogSearch;

(() => {
  if (typeof document === 'undefined') return;
  const index = CatalogSearch.createIndex({wordBranches:W_BRANCHES, course:BEGINNER_COURSE, grammarBranches:G_BRANCHES});
  const headings = {lessons:'Уроки', topics:'Темы и подтемы', words:'Слова и фразы', rules:'Правила'};
  function mount(scope, root, before) {
    const search = document.createElement('section'), inputId = 'catalog-search-' + scope;
    search.className = 'study-search';
    search.setAttribute('aria-label', scope === 'words' ? 'Поиск лексики' : 'Поиск правил');
    search.innerHTML = '<label for="' + inputId + '">' + (scope === 'words' ? 'Поиск по словам, темам и коду урока' : 'Поиск по темам и коду урока') + '</label>'
      + '<div class="study-search-field"><input type="search" id="' + inputId + '" placeholder="' + (scope === 'words' ? 'family, семья или 4A' : 'Present Simple, вопросы или 5A') + '" maxlength="120" autocomplete="off" spellcheck="false"><button type="button" class="study-search-clear" aria-label="Очистить поиск" hidden>×</button></div>'
      + '<p class="study-search-hint">' + (scope === 'words' ? 'Вся лексика A1-B2. Можно искать по коду урока, например 4A. Откройте результат, чтобы отработать тему.' : 'Все правила A1-B2. Можно добавить уровень, например A1.') + '</p>'
      + '<div class="study-search-results" hidden><p class="study-search-status" role="status" aria-live="polite"></p><div class="study-search-groups"></div></div>';
    root.insertBefore(search, before);
    const input = search.querySelector('input'), clear = search.querySelector('.study-search-clear'), results = search.querySelector('.study-search-results');
    const status = search.querySelector('.study-search-status'), body = search.querySelector('.study-search-groups');
    let current, visible = {}, actions = [];
    function render() {
      clear.hidden = !input.value;
      current = CatalogSearch.find(index, input.value, scope);
      results.hidden = !input.value.trim();
      status.textContent = current.total ? 'Найдено: ' + current.total : 'Ничего не найдено. Попробуйте другое слово, тему или код урока.';
      actions = [];
      body.innerHTML = Object.entries(current.groups).filter(([, items]) => items.length).map(([kind, items]) => {
        const limit = visible[kind] || 6;
        return '<section class="study-search-group"><h3>' + headings[kind] + ' <span>' + items.length + '</span></h3><div class="study-search-items">' + items.slice(0, limit).map(item => {
          const action = actions.push(item) - 1, location = item.location;
          const label = location ? location.label : item.label || '';
          const context = location ? location.title : item.path;
          return '<button type="button" class="study-search-item" data-search-result="' + action + '"><span class="study-search-meta">' + esc(item.level) + (item.extra ? ' · Экстра' : '') + (label ? ' · ' + esc(label) : '') + '</span><strong>' + esc(item.title) + '</strong><span class="study-search-translation">' + esc(item.subtitle || '') + '</span><span class="study-search-path">' + esc(context) + '</span></button>';
        }).join('') + '</div>' + (items.length > limit ? '<button type="button" class="study-search-more" data-search-more="' + kind + '">Показать ещё (' + (items.length - limit) + ')</button>' : '') + '</section>';
      }).join('');
    }
    function open(item) {
      if (!item) return;
      if (item.kind === 'rules') G.openTopic(item.topicId);
      else if (item.courseId) W.openCourseList(item.courseId, item.sectionIndex, item.extra?'extra':'base');
      else if (item.location) W.openCourseList(item.location.courseId, item.location.sectionIndex, item.extra?'extra':'base');
      else W.openTopic(item.topicId);
      if (item.kind === 'words') {
        const row = [...modal.querySelectorAll('[data-word-id]')].find(row => row.dataset.wordId === item.topicId && row.dataset.wordKey === item.wordKey);
        if (row) { row.classList.add('search-word-hit'); row.tabIndex = -1; row.focus({preventScroll:true}); row.scrollIntoView({block:'center'}); }
      }
    }
    input.addEventListener('input', () => { visible = {}; render(); });
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); open(actions[0]); }
      if (event.key === 'Escape') { event.preventDefault(); input.value = ''; render(); }
    });
    clear.addEventListener('click', () => { input.value = ''; visible = {}; render(); input.focus(); });
    search.addEventListener('click', event => {
      const more = event.target.closest('[data-search-more]');
      if (more) { const kind = more.dataset.searchMore; visible[kind] = (visible[kind] || 6) + 12; render(); body.querySelector('[data-search-more="' + kind + '"]')?.focus({preventScroll:true}); return; }
      const result = event.target.closest('[data-search-result]');
      if (result) open(actions[+result.dataset.searchResult]);
    });
  }
  function openRelatedItem(item) {
    if (item.kind === 'rules') G.openTopic(item.topicId);
    else if (item.courseId) W.openCourseList(item.courseId, item.sectionIndex, item.extra ? 'extra' : 'base');
    else W.openTopic(item.topicId);
  }
  function openRelated(scope, level, source) {
    const items = CatalogSearch.related(index, source, level, scope);
    if (!items.length) return;
    setMode(scope === 'rules' ? 'g' : 'w');
    if (items.length === 1) { openRelatedItem(items[0]); return; }
    const adapter = {
      onClick(event) {
        const button = event.target.closest('[data-related-item]');
        if (button) openRelatedItem(items[Number(button.dataset.relatedItem)]);
      },
      onKey() {},
      onClose() {}
    };
    openModal(adapter);
    modal.innerHTML = mHead(level + ' · урок ' + source, scope === 'rules' ? 'Правила этого урока' : 'Лексика этого урока')
      + '<div class="lesson-links">' + lessonRefHTML(scope === 'rules' ? 'words' : 'rules', level, source) + '</div>'
      + '<div class="lesson-related-grid">' + items.map((item, i) =>
        '<button type="button" class="study-search-item" data-related-item="' + i + '"><span class="study-search-meta">' + esc(item.level) + ' · ' + esc(source)
        + '</span><strong>' + esc(item.title) + '</strong><span class="study-search-translation">' + esc(item.subtitle || '')
        + '</span><span class="study-search-path">' + esc(item.path) + '</span></button>').join('') + '</div>';
    modal.scrollTop = 0;
    modal.querySelector('[data-related-item]')?.focus({preventScroll:true});
  }
  const linkedRefs = new WeakSet();
  function decorateLessonRefs(root) {
    root.querySelectorAll('[data-lesson-scope]').forEach(ref => {
      if (linkedRefs.has(ref)) return;
      linkedRefs.add(ref);
      const {lessonScope:scope, lessonLevel:level, lessonSource:source} = ref.dataset;
      if (!CatalogSearch.related(index, source, level, scope).length) return;
      const name = scope === 'rules' ? 'Правила' : 'Лексика';
      ref.textContent = name + ' · ' + source;
      ref.setAttribute('role', 'button');
      ref.tabIndex = 0;
      ref.title = 'Открыть ' + name.toLowerCase() + ': ' + level + ', урок ' + source;
      ref.setAttribute('aria-label', ref.title);
      const go = event => {
        event.preventDefault();
        event.stopPropagation();
        openRelated(scope, level, source);
      };
      ref.addEventListener('click', go);
      ref.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') go(event);
      });
    });
  }
  decorateLessonRefs(document);
  new MutationObserver(() => decorateLessonRefs(modal)).observe(modal, {childList:true, subtree:true});
  const words = document.getElementById('mode-w'), rules = document.getElementById('mode-g');
  mount('words', words, words.querySelector('.jumpnav'));
  mount('rules', rules, rules.querySelector('.jumpnav'));
})();
