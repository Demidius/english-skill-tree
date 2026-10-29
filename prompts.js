// «Промт»: задания для любой нейросети по отрабатываемым правилам и ввод кода изменений уровней.
// Кнопка «Изучать с AI» в блоке отработки. Окно: вкладка «Промт» (тип задания,
// выбор правил, готовый текст для копирования) и вкладка «Ввести код» (превью и применение).
//
// Код от нейросети: EFST1|TAG|id:уровень:верно/ошибок|…  (например pres-simple:7:5/0)
// Уровень в коде — тот, что был в промте. Сайт сравнивает его с текущим: так один и тот же код
// не применится дважды даже на другом устройстве. Начисление — SkillCore.ruleGain, без минусов:
// 0 верных → 0, 1+ → +1, 3+ и точность ≥75% → +2, 5+ без ошибок → +3.
// На уровнях 4–6 рост только при 3+ верных и точности не ниже 66% (2/3), иначе 0.
// Старые коды с оценками (+2, +, -, 0) тоже принимаются; «-» теперь даёт 0.
// С уровня 7 — скрытые шаги (SkillCore.ruleAdvance): каждое верное применение — шаг, 3 шага = +1 уровень,
// ошибка по правилу в занятии обнуляет шаги.
(function () {
  if (typeof G === 'undefined' || !G.rulesData) return;

  const PREFIX = 'EFST1';
  const GMAX = 10;
  const USED_KEY = 'ef_prompt_used';
  const TYPES = {
    translate: { name: 'Перевод текста · RU → EN', sub: 'текст на русском → разбор → код', code: true, def: 8 },
    sentence_ru_en: { name: 'По предложению · RU → EN', sub: 'перевод → разбор → следующее; до «хватит»', code: true, def: 8, direction: 'ru-en' },
    sentence_en_ru: { name: 'По предложению · EN → RU', sub: 'перевод → разбор → следующее; до «хватит»', code: true, def: 8, direction: 'en-ru' },
    fix:       { name: 'Найди ошибки',    sub: 'предложения с ошибками → разбор → код', code: true, def: 8 },
    dialog:    { name: 'Диалог',          sub: 'разговор на эти правила → разбор → код', code: true, def: 6 },
    explain:   { name: 'Объяснение', sub: 'разбор темы, без кода', code: false, def: 4, topicOnly: true },
  };
  const TEXT_LENGTHS = [
    { name: 'Очень короткий', sentences: '2–3 предложения', en: 'very short, 2–3 sentences' },
    { name: 'Короткий', sentences: '4–6 предложений', en: 'short, 4–6 sentences' },
    { name: 'Средний', sentences: '8–12 предложений', en: 'medium, 8–12 sentences' },
    { name: 'Длинный', sentences: '16–20 предложений', en: 'long, 16–20 sentences' },
    { name: 'Очень длинный', sentences: '30–40 предложений', en: 'very long, 30–40 sentences' },
  ];
  // Уровень языка текста (CEFR). 'auto' — как раньше: лексика не сложнее B1.
  const TEXT_LEVEL_KEY = 'ef_prompt_text_level';
  const TEXT_LEVELS = {
    A1: 'only the most common everyday words; very short, simple sentences; almost no subordinate clauses',
    A2: 'common everyday vocabulary; short sentences joined with simple linking words (and, but, because, when, so)',
    B1: 'everyday and general vocabulary; mostly simple and compound sentences with some subordinate clauses; a few common phrasal verbs',
    B2: 'a wider vocabulary including some abstract words, collocations and common idioms; complex sentences with various clauses',
    C1: 'rich and precise vocabulary, idioms and collocations; complex, varied sentence structures and a natural, fluent style',
    C2: 'very rich, nuanced, near-native vocabulary and style: idioms, set phrases, subtle shades of meaning, sophisticated structures',
  };
  function savedTextLevel() { const v = lsGet(TEXT_LEVEL_KEY); return v && TEXT_LEVELS[v] ? v : 'auto'; }
  // Сколько правил брать в «Самые слабые» (и в выбор по умолчанию). Пусто — как в типе задания.
  const PICK_KEY = 'ef_prompt_pick_n';
  const PICK_NS = [3, 5, 6, 8, 10, 12, 15, 20];
  function savedPickN() { const n = +lsGet(PICK_KEY); return PICK_NS.includes(n) ? n : 0; }
  const LV_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3 };
  const AI_CHATS = {
    gpt: { name: 'GPT', url: 'https://chatgpt.com/', query: 'q', android: 'com.openai.chatgpt' },
    claude: { name: 'Claude', url: 'https://claude.ai/new', query: 'q', android: 'com.anthropic.claude' },
    gemini: { name: 'Gemini', url: 'https://gemini.google.com/app', android: 'com.google.android.apps.bard' },
    qwen: { name: 'Qwen', url: 'https://chat.qwen.ai/', query: 'text', android: 'ai.qwenlm.chat.android' },
  };
  const IS_ANDROID = /Android/i.test(navigator.userAgent);
  const IS_TOUCH = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const IS_MAC = /Mac/i.test(navigator.platform || navigator.userAgent);
  let preferApp = true;

  function pasteHint() {
    return IS_TOUCH ? 'удержи палец в поле сообщения → «Вставить»' : (IS_MAC ? '⌘V' : 'Ctrl+V');
  }

  // Промт передаётся в чат прямо в ссылке (?q=…), поэтому инструкции для нейросети написаны
  // по-английски: кириллица в адресе раздувается в 6 раз и не влезала в лимит. Если промт всё же
  // длиннее лимита (очень много правил) или передача текста через ссылку не настроена (Gemini),
  // чат открывается пустым, а промт лежит в буфере.
  const URL_LIMIT = 12000;
  function chatDestination(ai, text) {
    const url = new URL(ai.url);
    if (ai.query && text) url.searchParams.set(ai.query, text);
    const prefilled = !!ai.query && !!text && url.href.length <= URL_LIMIT;
    const web = prefilled ? url.href : ai.url;
    const href = IS_ANDROID && preferApp
      ? 'intent://' + web.slice('https://'.length) + '#Intent;scheme=https;package=' + ai.android + ';S.browser_fallback_url=' + encodeURIComponent(web) + ';end'
      : web;
    return { href, prefilled, app: IS_ANDROID && preferApp };
  }

  // справочник правил: суть и пример из data-grammar.js
  const INFO = {};
  G_BRANCHES.forEach(b => Object.keys(b.cells).forEach(lk => (b.cells[lk] || []).forEach(c => {
    INFO[c[0]] = { title: c[1], gloss: c[2] || '', ex: c[3] || '', branch: b.name, level: lk };
  })));

  let S = null; // состояние окна

  const css = document.createElement('style');
  css.textContent =
    '.pt-filters{display:flex;flex-wrap:wrap;gap:6px 8px;margin:6px 0 8px;}' +
    '.pt-sel{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;color:var(--muted);}' +
    '.pt-sel select{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;min-height:32px;padding:4px 8px;font:inherit;font-size:.85rem;max-width:58vw;cursor:pointer;}' +
    '.pt-sel select:focus-visible{outline:2px solid var(--accent);outline-offset:1px;}' +
    '.pt-tools .pt-sel span,.pt-grid .pt-sel span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}' +
    '.pt-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));}.pt-grid .pt-sel select{width:100%;max-width:none;}' +
    '.pt-tools .pt-sel select{max-width:none;min-width:52px;}.pt-tools .chip{padding:4px 10px;}' +
    '@media (max-width:480px){.pt-grid{grid-template-columns:1fr 1fr;}.pt-grid .pt-sel:last-child{grid-column:1 / -1;}}' +
    '.pt-level.pt-filters{align-items:center;margin-top:12px;}.pt-level.pt-filters .pt-note{margin:0;font-size:.75rem;}' +
    '.pt-hid{font-weight:400;opacity:.7;}';
  document.head.appendChild(css);

  // ---------- данные ----------
  function rules() {
    return G.rulesData().filter(r => INFO[r.id]).sort((a, b) =>
      a.lv - b.lv || LV_ORDER[a.level] - LV_ORDER[b.level] || a.title.localeCompare(b.title));
  }
  // Список правил под фильтрами: «Изучено» / все, уровень A1–B2, тема (ветка дерева).
  function visibleRules() {
    return rules().filter(r => (S.scope !== 'read' || r.read) &&
      (S.fLevel === 'all' || r.level === S.fLevel) && (S.fBranch === 'all' || INFO[r.id].branch === S.fBranch));
  }
  // сколько правил останется, если поменять один фильтр (для подписей в списках)
  function countBy(o) { const keep = S; S = Object.assign({}, S, o); try { return visibleRules().length; } finally { S = keep; } }
  function pickN(type) { return (S && S.pickN) || savedPickN() || TYPES[type || S.type].def; }
  function defaultSel(type) {
    const n = pickN(type);
    const pool = rules().filter(r => r.read && r.lv < GMAX);
    return new Set(pool.slice(0, n).map(r => r.id));
  }
  // «Самые слабые N» — из того списка, который сейчас показан («Изучено» или «Все правила»).
  function weakPool() { return visibleRules().filter(r => r.lv < GMAX); }
  function weakSel() { return new Set(weakPool().slice(0, pickN()).map(r => r.id)); }
  // Фильтр не просто скрывает правила: всё, что перестало проходить фильтры,
  // сразу снимается с выбора и больше не попадёт в промт даже после расширения фильтра.
  function pruneFilteredSelection() {
    const shown = new Set(visibleRules().map(r => r.id));
    let changed = false;
    [...S.sel].forEach(id => {
      if (!shown.has(id)) { S.sel.delete(id); changed = true; }
    });
    return changed;
  }
  function newTag() {
    return Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
  }
  function profileKey() { return (typeof current !== 'undefined' && current) || 'local'; }
  function usedTags() {
    try { const o = JSON.parse(lsGet(USED_KEY) || '{}'); return o[profileKey()] || []; } catch (e) { return []; }
  }
  function markUsed(tag,profile=profileKey()) {
    try {
      const o = JSON.parse(lsGet(USED_KEY) || '{}');
      const a = (o[profile] || []).filter(t => t !== tag); a.push(tag);
      o[profile] = a.slice(-1000);
      lsSet(USED_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  // ---------- текст промта ----------
  function ruleLines(ids) {
    const byId = {}; rules().forEach(r => byId[r.id] = r);
    return ids.map((id, i) => {
      const f = INFO[id], r = byId[id];
      return (i + 1) + '. ' + id + ' — ' + f.title + ' (' + f.level + ', ' + f.branch + '): ' + f.gloss +
        (f.ex ? '. Example: ' + f.ex : '') + ' — my level ' + (r ? r.lv : 0) + '/10';
    }).join('\n');
  }
  function orderedSel() {
    return rules().filter(r => S.sel.has(r.id)).map(r => r.id);
  }
  // Разнообразие заданий без хранения и передачи истории предложений.
  const DIVERSITY_INSTRUCTION =
    'Keep exercises varied and realistic: rotate topics, situations, subjects, verbs and sentence structures rather than relying on textbook clichés (coffee, shopping, going to work). ' +
    'Avoid near-identical situations or sentence patterns in consecutive tasks, even when the words change. ' +
    'Vary rule combinations where possible, but keep examples natural, clear and within the chosen CEFR level. ';

  // Инструкции — по-английски (так промт помещается в ссылку), но общаться нейросеть должна по-русски.
  function sentencePrompt(direction) {
    const toEnglish = direction === 'ru-en';
    return 'Task: translation one full sentence at a time, ' + (toEnglish ? 'from Russian into English (RU → EN)' : 'from English into Russian (EN → RU)') + '.\n' +
      '1. Give exactly one new full sentence ' + (toEnglish ? 'in Russian' : 'in English') + ' on an everyday topic. ' +
      'It must practise one or more rules from the list. Rotate the rules, gradually cover the whole list, and give weak rules more often. ' +
      levelInstruction() + DIVERSITY_INSTRUCTION + 'Do not give a set of sentences, a ready translation, or a hint about which rule is needed.\n' +
      '2. Stop and wait for my translation ' + (toEnglish ? 'into English' : 'into Russian') + '. Do not answer for me and do not analyse the sentence in advance.\n' +
      '3. After each of my translations, immediately give a short analysis in Russian. If the translation is correct, say so explicitly. ' +
      'If there is a mistake, show my version and the corrected version in the correction format, explain why, and give the id of the rule from the list. ' +
      'Accept any correct translation: do not require a literal match with your model answer. Suggest a more natural wording separately, without counting a correct version as a mistake. ' +
      (toEnglish ? 'Check the meaning and the English grammar.' : 'Check that the Russian translation keeps the meaning of the English structure: tense, negation, condition, modality and other important nuances. Do not require English word order in Russian.') +
      ' Mark mistakes outside the selected rules separately: they do not affect the code for these rules.\n' +
      '4. In the same reply, right after the analysis, give the next single sentence and wait for my translation again. Do not ask each time whether to continue. ' +
      'Only one sentence may be waiting for translation at any moment.\n' +
      '5. Repeat this cycle with no fixed number of sentences until I explicitly end the session: «хватит», «стоп», «закончим», «итог» or a similar request. ' +
      'That is an end command, not a translation. If I send a translation together with a request to stop, first assess that translation. ' +
      'An unanswered sentence is not a mistake. After the end command, give no new tasks.\n' +
      '6. Only after the end, summarise the whole session in Russian: how many translations were done, what went well, which mistakes repeated and what to review. ' +
      'For each selected rule, give the number of correct and incorrect uses. Assess my answers, not your own corrections. ' +
      'Put these numbers into the code below; an unanswered sentence is not an incorrect use. ' +
      'Do not add rules outside the selected list to the result. Then output one final code for the site in the format below. Do not give the code before the session ends.\n';
  }
  // Исправления — на отдельных строках: так проще сравнивать свой вариант с правильным.
  const CORRECTION = 'Correction format: never put my version and the corrected version on one line with an arrow. ' +
    'Write my version on its own line starting with "❌ ", the corrected version on the next line starting with "✅ ", and the explanation below them.\n\n';
  function buildPrompt() {
    const ids = orderedSel();
    if (!ids.length) return '';
    const lvls = [...new Set(ids.map(id => INFO[id].level))].sort((a, b) => LV_ORDER[a] - LV_ORDER[b]);
    const head =
      'You are an experienced English teacher for Russian-speaking learners. I study with the English File textbooks ' +
      '(levels in this session: ' + lvls.join(', ') + ') and practise specific grammar rules. ' +
      'Talk to me in Russian: all explanations, feedback and summaries must be in Russian; use English only in tasks, examples and corrections.\n' +
      CORRECTION +
      'Rules to practise (id — name (textbook level, topic): gist in Russian. Example — my current level for this rule on a 0–10 scale):\n' +
      ruleLines(ids) + '\n\n' +
      'Rules at level 0–4 are weak for me — use them in simpler contexts and more often; rules at level 8–9 — in more complex contexts.\n\n';
    const body = TYPES[S.type].direction ? sentencePrompt(TYPES[S.type].direction) : {
      translate:
        'Task: translation from Russian into English.\n' +
        '1. Write one coherent text in Russian. Length: ' + TEXT_LENGTHS[S.textLength].en + '. ' +
        'Topic: everyday life (work, travel, friends, plans, weekends, etc.). Stay within the chosen length. ' +
        'Try to cover the selected rules naturally, starting with the weak ones. If not all rules fit into a short text, do not make it longer and do not overload the sentences: use only some of the rules. ' +
        'Rules that did not appear in the text or in my translation are "not tested" (0) in the result; their levels do not change. ' + levelInstruction() + DIVERSITY_INSTRUCTION +
        'Do not hint which rule is where, and do not give the translation.\n' +
        '2. Stop and wait for my translation. Do not analyse anything in advance.\n' +
        '3. When I send my translation, go through it sentence by sentence, in Russian:\n' +
        '   — if there is a mistake: my version and the correct version in the correction format;\n' +
        '   — briefly: what the mistake is and which rule (id) it belongs to;\n' +
        '   — if my version is correct but sounds unnatural, suggest a more natural one and say that it is not a mistake;\n' +
        '   — mark mistakes outside the listed rules (words, prepositions, articles, word order) separately — they do not affect the rule results.\n' +
        '4. Count correct and incorrect uses of each selected rule for the code below. Then briefly: what went well, which rules to review and what exactly to review.\n',
      fix:
        'Task: find and correct mistakes.\n' +
        '1. Write 12 numbered sentences in English. About half of them must contain a mistake in exactly the listed rules ' +
        '(each rule in at least 2 sentences: one with a mistake and one without); the other sentences are correct. ' +
        'Make the mistakes typical for Russian speakers. ' + levelInstruction() + 'Do not mark where the mistakes are or which rules are tested.\n' +
        '2. Stop and wait for my answer: I will write the numbers of the wrong sentences and my corrections.\n' +
        '3. Analyse my answer in Russian: which mistakes I found and fixed correctly, which I missed, and where I "fixed" a correct sentence. ' +
        'For each mistake — my version and the correct version in the correction format, and a short explanation with the rule id.\n' +
        '4. Count correct fixes and correctly retained sentences as correct uses; count missed mistakes, wrong fixes and spoiled correct sentences as incorrect uses. Put the counts into the code below. Then briefly: what went well, which rules to review.\n',
      dialog:
        'Task: speaking practice.\n' +
        '1. Offer 3 everyday situations for a dialogue, wait for my choice and start the conversation in English. ' +
        'Ask questions so that I have to answer using the listed rules (cover all of them in turn). ' +
        'One or two questions per message' + (TEXT_LEVELS[S.textLevel] ? '. ' + levelInstruction() + 'Talk to me at this level throughout the dialogue.' : ', keep it simple.') + '\n' +
        '2. During the dialogue, do not correct mistakes, just keep talking. Make 10–12 turns, or finish earlier if I write «итог».\n' +
        '3. After the dialogue, go through my lines in Russian: my version and the correct one in the correction format, briefly, with the rule id. ' +
        'Mark mistakes outside the listed rules separately — they do not affect the rule results.\n' +
        '4. Count correct and incorrect uses of each selected rule for the code below. Then briefly: what went well, which rules to review.\n',
      explain:
        'Task: explain these rules, starting with the one where my level is lowest. For each rule:\n' +
        '1. A simple explanation in Russian: when it is used and how it is formed (positive, negative, question).\n' +
        '2. How it differs from similar structures that Russian speakers confuse — with "right / wrong" examples.\n' +
        '3. 4–5 real-life examples with Russian translation.\n' +
        '4. A mini-test of 5 tasks (fill the gap or translate a phrase). Put the answers at the very end under the heading «Ответы».\n',
    }[S.type];
    const code = !TYPES[S.type].code ? '' :
      'Results for EACH selected rule: count my correct and incorrect uses across the whole session. Count only my answers, not your corrections.\n' +
      'Code for my site at the end of the final analysis — one line in a code block, strictly in this format:\n' +
      PREFIX + '|' + S.tag + '|id:level:correct/incorrect|id:level:correct/incorrect|…\n' +
      '— list all rules from the list;\n' +
      '— take id and level exactly from the list (level = my current level, do not change it);\n' +
      '— correct/incorrect: two whole numbers, for example 4/1; write 0/0 if the rule was not used.\n' +
      'Format example: ' + PREFIX + '|' + S.tag + '|id1:7:5/0|id2:3:2/3|id3:5:0/0\n' +
      'Do not calculate new levels yourself — the site will do it from these numbers.\n';
    return head + body + code;
  }

  // Что именно подстраивается под уровень в каждом типе задания; true — материал на русском,
  // тогда уровень задаёт его естественный перевод на английский.
  const LEVEL_SUBJECT = {
    translate: ['the Russian text', true],
    sentence_ru_en: ['each Russian sentence', true],
    sentence_en_ru: ['each English sentence', false],
    fix: ['the English sentences', false],
    dialog: ['your English lines and questions', false],
  };
  function levelInstruction() {
    const lv = S.textLevel, subj = LEVEL_SUBJECT[S.type];
    if (!subj) return '';
    if (!TEXT_LEVELS[lv]) return S.type === 'translate' ? 'Vocabulary — no harder than B1. ' : '';
    const [what, viaEnglish] = subj;
    return 'Language level: CEFR ' + lv + '. Write ' + what + (viaEnglish ? ' so that its natural English translation is exactly at ' : ' exactly at ') + lv + ' level: ' +
      TEXT_LEVELS[lv] + '. Do not use words, idioms or constructions ' + (viaEnglish ? 'whose English equivalents are' : 'that are') + ' clearly above ' + lv +
      (lv === 'A1' || lv === 'A2' ? '' : ', and do not make it simpler than ' + lv) + '. ' +
      'The selected grammar rules must still be used even if they belong to another level; keep everything else at ' + lv + '. ';
  }

  // ---------- разбор кода ----------
  function parseCode(txt) { return SkillCore.parseRuleCode(txt); }
  function clamp(v) { return Math.max(0, Math.min(GMAX, v)); }
  function plan(parsed) {
    const byId = {}; rules().forEach(r => byId[r.id] = r);
    const seen = new Set();
    return parsed.items.filter(it => !seen.has(it.id) && seen.add(it.id)).map(it => {
      const r = byId[it.id];
      if (!r) return Object.assign({}, it, { kind: 'unknown', on: false });
      const d = it.gain;
      const ok = 'ok' in it ? it.ok : Math.max(0, it.sign), no = 'ok' in it ? it.no : (it.sign < 0 ? 1 : 0);
      const st = r.lv === it.from ? (r.st || 0) : 0;
      const nx = SkillCore.ruleAdvance(it.from, st, ok, no, d);
      const changed = nx.lv !== it.from || nx.st !== st;
      if (!changed) return Object.assign({}, it, { r, d: 0, kind: 'skip', to: r.lv, toSt: r.st || 0, on: false });
      if (r.lv === it.from) return Object.assign({}, it, { r, d: nx.lv - it.from, kind: 'ok', to: nx.lv, toSt: nx.st, on: true });
      if (r.lv === nx.lv && nx.lv !== it.from) return Object.assign({}, it, { r, d: nx.lv - it.from, kind: 'done', to: r.lv, on: false });
      return Object.assign({}, it, { r, d: 0, kind: 'moved', to: r.lv, on: false });
    });
  }

  // ---------- окно ----------
  function open(tab, topicId) {
    if (topicId && !INFO[topicId]) return;
    if (typeof needProfile === 'function' && needProfile()) return;
    S = { tab: tab || 'prompt', topicId: topicId || null, type: topicId ? 'explain' : 'translate', scope: topicId ? 'all' : 'read', fLevel: 'all', fBranch: 'all', pickN: savedPickN(), tag: newTag(), touched: !!topicId,
          sel: topicId ? new Set([topicId]) : defaultSel('translate'), textLength: 2, textLevel: savedTextLevel(), lengthOpen: false, manualOpen: false, codeText: '', parsed: null, rows: null, msg: '', returnFocus: document.activeElement };
    if (!rules().some(r => r.read)) S.scope = 'all';
    modal.classList.remove('rulepage', 'testm');
    openModal(owner);
    modal.classList.add('pt-modal');
    modal.classList.toggle('pt-topic-dialog', !!topicId);
    render();
    modal.scrollTop = 0;
    if (topicId) modal.querySelector('.m-close').focus({ preventScroll: true });
  }
  function chatLinks(txt, explanation) {
    return (IS_ANDROID ? '<label class="pt-app-preference"><input type="checkbox" data-pt-app' + (preferApp ? ' checked' : '') + '> Открывать в приложении, если установлено</label>' : '') +
      '<div class="pt-ai-actions" role="group" aria-label="' + (explanation ? 'Объяснение темы в нейросети' : 'Открыть чат с промтом') + '">' + Object.entries(AI_CHATS).map(([id, ai]) => {
        const dest = chatDestination(ai, txt);
        return '<a class="m-btn ghost" data-pt-open="' + id + '"' + (txt ? ' href="' + esc(dest.href) + '"' + (!dest.app ? ' target="_blank"' : '') + ' rel="noopener noreferrer"' : ' role="link" aria-disabled="true" tabindex="-1"') + '><span>' + (explanation ? 'Объяснение в ' : 'Открыть в ') + '<b>' + ai.name + '</b><small>' + (dest.prefilled ? 'Задание вставится само' : 'Скопирует и откроет') + '</small></span></a>';
      }).join('') + '</div>' +
      launchStatus() +
      // «Поделиться» нужно только на телефоне: на компьютере это системное меню Windows/macOS, а не чат.
      (typeof navigator.share === 'function' && IS_TOUCH ? '<button type="button" class="m-btn ghost pt-share" data-pt-share' + (!txt ? ' disabled' : '') + '>Передать промт в приложение…</button>' : '');
  }
  function launchStatus() { return '<p class="pt-launch-status" role="status" aria-live="polite" hidden></p>'; }
  function launchNote(txt) {
    if (!txt) return 'Сначала отметь хотя бы одну тему.';
    if (chatDestination(AI_CHATS.gpt, txt).prefilled)
      return 'Нажми на чат. В GPT, Claude и Qwen задание передаётся автоматически. Для Gemini промт скопируется, вставь его в чат (' + pasteHint() + ').';
    return 'Выбрано так много правил, что промт не помещается в ссылку. Нажми на чат — промт скопируется, а чат откроется; вставь его (' + pasteHint() + ') и отправь.';
  }
  function renderTopic() {
    const topic = INFO[S.topicId], txt = buildPrompt();
    return mHead('Объяснение темы · ' + topic.level, topic.title) +
      '<p class="pt-topic-summary">' + esc(topic.gloss || topic.branch) + '</p>' +
      chatLinks(txt, true) +
      '<p class="pt-note">' + launchNote(txt) + '</p>' +
      '<details class="pt-topic-prompt"><summary>Посмотреть промт</summary>' +
        '<textarea class="pt-text" readonly rows="5" aria-label="Промт объяснения темы">' + esc(txt) + '</textarea>' +
        '<button type="button" class="m-btn ghost" data-pt-copy>Скопировать промт</button>' +
      '</details>';
  }
  function tabs() {
    return '<div class="pt-tabs" role="tablist">' +
      [['prompt', 'Промт'], ['code', 'Ввести код']].map(([k, l]) =>
        '<button type="button" class="chip" role="tab" data-pt-tab="' + k + '" data-active="' + (S.tab === k ? 1 : 0) + '" aria-selected="' + (S.tab === k) + '">' + l + '</button>'
      ).join('') + '</div>';
  }
  function render() {
    if (S.topicId) { modal.innerHTML = renderTopic(); return; }
    // сохраняем прокрутку окна и списка правил: перерисовка идёт после каждой галочки
    const keep = modal.scrollTop;
    const list = modal.querySelector('.pt-rules'), keepList = list ? list.scrollTop : 0;
    modal.innerHTML = mHead('Нейросеть · отработка правил', S.tab === 'prompt' ? 'Промт для нейросети' : 'Код изменений') + tabs() +
      (S.tab === 'prompt' ? renderPrompt() : renderCode());
    modal.scrollTop = keep;
    const l2 = modal.querySelector('.pt-rules'); if (l2) l2.scrollTop = keepList;
  }
  function renderPrompt() {
    const list = visibleRules();
    const txt = buildPrompt();
    const nSel = S.sel.size;
    const shown = new Set(list.map(r => r.id)), hidden = [...S.sel].filter(id => !shown.has(id)).length;
    return '<div class="m-count pt-h">1. Что делаем</div>' +
      '<div class="pt-types">' + Object.keys(TYPES).filter(k => !TYPES[k].topicOnly).map(k => {
        const button = '<button type="button" class="m-opt pt-type" data-pt-type="' + k + '" aria-pressed="' + (S.type === k) + '">' +
          '<b>' + esc(TYPES[k].name) + '</b><span>' + esc(TYPES[k].sub) + '</span></button>';
        if (k !== 'translate') return button;
        const expanded = S.type === k && S.lengthOpen;
        return '<div class="pt-translation"><div class="pt-translation-row">' + button +
          '<button type="button" class="m-opt pt-length-toggle" data-pt-length-toggle aria-controls="ptTextLengthPanel" aria-expanded="' + expanded + '" aria-label="' + toggleLabel() + '">Настроить<br>длину</button></div>' +
          (expanded ? renderTextLength() : '') + '</div>';
      }).join('') + '</div>' +
      renderTextLevel() +
      (TYPES[S.type].direction ? '<p class="pt-note">Одно предложение → твой перевод → разбор → следующее. Напиши «хватит», чтобы получить общие итоги и код для сайта.</p>' : '') +
      '<div class="m-count pt-h">2. Правила · выбрано ' + nSel + (hidden ? ' <span class="pt-hid">(' + hidden + ' не видно из-за фильтров)</span>' : '') + '</div>' +
      '<div class="pt-filters pt-grid">' +
        selectHTML('scope', 'Какие правила', S.scope, [['read', '«Изучено» (' + countBy({ scope: 'read' }) + ')'], ['all', 'Все правила (' + countBy({ scope: 'all' }) + ')']]) +
        selectHTML('level', 'Уровень правил', S.fLevel, [['all', 'Все уровни']].concat(Object.keys(LV_ORDER).map(k => [k, k + ' (' + countBy({ fLevel: k }) + ')']))) +
        selectHTML('branch', 'Тема', S.fBranch, [['all', 'Все темы']].concat(G_BRANCHES.map(b => [b.name, b.name + ' (' + countBy({ fBranch: b.name }) + ')']))) +
      '</div>' +
      '<div class="pt-tools">' +
        '<button type="button" class="chip" data-pt-pick="weak"' + (weakPool().length ? '' : ' disabled') + '>Самые слабые</button>' +
        selectHTML('n', 'Сколько правил', String(pickN()), PICK_NS.map(n => [String(n), String(n)])) +
        '<button type="button" class="chip" data-pt-pick="shown"' + (list.length ? '' : ' disabled') + '>Все видимые</button>' +
        '<button type="button" class="chip" data-pt-pick="none"' + (nSel ? '' : ' disabled') + '>Снять</button>' +
      '</div>' +
      (list.length ?
        '<div class="pt-rules">' + list.map(r =>
          '<label class="pt-rule"><input type="checkbox" data-pt-id="' + esc(r.id) + '"' + (S.sel.has(r.id) ? ' checked' : '') + '>' +
          '<span class="pt-rt">' + esc(r.title) + '</span>' +
          '<span class="pt-rm">' + esc(r.level) + ' · ' + esc(INFO[r.id].branch) + '</span>' +
          '<span class="pt-lv" data-b="' + (r.lv >= GMAX ? 'm' : r.lv >= 5 ? 'r' : r.lv > 0 ? 'l' : '0') + '">' + r.lv + '</span></label>').join('') +
        '</div>' :
        '<p class="pt-note">' + (S.fLevel !== 'all' || S.fBranch !== 'all' ? 'Под эти фильтры правил нет. Смени уровень или тему.' :
          'Нет правил с отметкой «изучено». Переключись на «Все правила» или отметь галочкой «изучено» правила в дереве.') + '</p>') +
      '<section class="pt-actions pt-launch" aria-labelledby="ptLaunchTitle">' +
        '<h3 id="ptLaunchTitle" class="m-count pt-h">3. Начни занятие</h3>' +
        '<p class="pt-note pt-launch-note">' + launchNote(txt) + '</p>' +
        chatLinks(txt, false) +
      '</section>' +
      (txt ? '<details class="pt-manual"' + (S.manualOpen ? ' open' : '') + '><summary>Посмотреть или скопировать промт вручную</summary>' +
        '<p class="pt-note">Запасной способ, если чат не принял задание: скопируй текст и вставь его в поле сообщения.</p>' +
        '<textarea class="pt-text" readonly rows="5" aria-label="Текст промта">' + esc(txt) + '</textarea>' +
        '<button type="button" class="m-btn ghost" data-pt-copy>' + (S.copied ? 'Скопировано ✓' : 'Скопировать промт') + '</button></details>' : '') +
      '<div class="pt-return"><p class="pt-note">После занятия вернись сюда и внеси результаты из ответа нейросети.</p>' +
        '<button type="button" class="m-btn ghost" data-pt-tab="code">Внести результаты занятия</button></div>';
  }
  function lengthLabel() {
    const length = TEXT_LENGTHS[S.textLength];
    return length.name + ' · ' + length.sentences;
  }
  function levelLabel() { return TEXT_LEVELS[S.textLevel] ? S.textLevel : 'авто'; }
  function toggleLabel() { return 'Настроить длину текста: ' + lengthLabel(); }
  // Компактный выпадающий список; изменения ловит onChange по data-pt-sel.
  function selectHTML(key, label, value, opts) {
    return '<label class="pt-sel"><span>' + esc(label) + '</span><select data-pt-sel="' + key + '">' +
      opts.map(([v, t]) => '<option value="' + esc(v) + '"' + (v === value ? ' selected' : '') + '>' + esc(t) + '</option>').join('') +
      '</select></label>';
  }
  function renderTextLevel() {
    return '<div class="pt-level pt-filters">' +
      selectHTML('textLevel', 'Уровень языка', S.textLevel, [['auto', 'Авто']].concat(Object.keys(TEXT_LEVELS).map(k => [k, k]))) +
      '<p class="pt-note">Слова и сложность предложений — под этот уровень, для всех заданий.</p></div>';
  }
  function renderTextLength() {
    return '<div id="ptTextLengthPanel" class="pt-length"><label for="ptTextLength">Длина текста</label>' +
      '<output id="ptTextLengthValue" for="ptTextLength">' + lengthLabel() + '</output>' +
      '<input id="ptTextLength" type="range" min="0" max="4" step="1" value="' + S.textLength + '" data-pt-length aria-valuetext="' + lengthLabel() + '" aria-describedby="ptTextLengthHint">' +
      '<div class="pt-length-ends"><span>Очень короткий</span><span>Очень длинный</span></div>' +
      '<p id="ptTextLengthHint" class="pt-note">Короткий текст может охватить только часть выбранных тем.</p></div>';
  }
  function updateTextLength(input) {
    if (!S || S.type !== 'translate') return;
    const value = Number(input.value);
    if (!Number.isInteger(value) || !TEXT_LENGTHS[value] || value === S.textLength) return;
    S.textLength = value; S.tag = newTag(); S.copied = false;
    // Keep the native range element mounted so dragging and keyboard focus are uninterrupted.
    modal.querySelector('#ptTextLengthValue').textContent = lengthLabel();
    input.setAttribute('aria-valuetext', lengthLabel());
    modal.querySelector('[data-pt-length-toggle]').setAttribute('aria-label', toggleLabel());
    const text = buildPrompt(), textarea = modal.querySelector('.pt-text');
    if (textarea) textarea.value = text;
    const group = modal.querySelector('.pt-ai-actions');
    if (group) group.replaceWith(el('div', '', chatLinks(text, false)).querySelector('.pt-ai-actions'));
    const note = modal.querySelector('.pt-launch-note');
    if (note) note.textContent = launchNote(text);
    const copyButton = modal.querySelector('[data-pt-copy]');
    if (copyButton) copyButton.textContent = 'Скопировать промт';
    const status = modal.querySelector('.pt-launch-status');
    if (status) { status.hidden = true; status.textContent = ''; }
  }
  function verdictTxt(x) {
    if (x.kind === 'unknown') return 'нет такого правила';
    const steps = x.kind === 'ok' && x.to >= SkillCore.STEP_FROM && x.to < GMAX && x.r && x.r.lv >= SkillCore.STEP_FROM
      ? (x.toSt < (x.r.st || 0) && x.to === x.r.lv ? ' · шаги сброшены' : ' · шаги ' + x.toSt + '/' + SkillCore.STEPS) : '';
    const tail = (x.d ? ' · ' + sgn(x.d) : '') + steps;
    const gate = x.kind === 'skip' && 'ok' in x && SkillCore.ruleGated(x.from, x.ok, x.no) ? ' · на уровнях 4–6 нужно от 3 верных и от 66%' : '';
    if ('ok' in x) return x.ok || x.no ? 'верно ' + x.ok + (x.no ? ' · ошибок ' + x.no : '') + tail + gate : 'не встретилось';
    if (x.kind === 'skip') return x.sign < 0 ? 'нужна практика' : 'не встретилось';
    return (x.sign > 1 ? 'отлично' : 'верно') + tail;
  }
  function renderCode() {
    let prev = '';
    if (S.rows) {
      const used = usedTags().includes(S.parsed.tag);
      const notes = [];
      if (used) notes.push('Код <b>' + esc(S.parsed.tag) + '</b> уже применяли.');
      if (S.rows.some(x => x.kind === 'done')) notes.push('Где уровень уже равен итоговому, код, похоже, уже применён — эти строки выключены.');
      if (S.rows.some(x => x.kind === 'moved')) notes.push('Уровни изменились с момента промта. Эти строки выключены: начни новое занятие для них.');
      if (S.rows.some(x => x.kind === 'unknown')) notes.push('Правила с неизвестным id пропущены.');
      const any = S.rows.some(x => x.on);
      prev = '<div class="m-count pt-h">Что изменится · ' + esc(typeof currentName === 'function' && currentName() ? currentName() : 'этот браузер') + '</div>' +
        (notes.length ? '<p class="pt-note pt-warn">' + notes.join(' ') + '</p>' : '') +
        '<div class="wl pt-res">' + S.rows.map((x, i) => {
          const can = !used && x.kind === 'ok';
          const title = x.r ? x.r.title : x.id;
          const chg = !x.r ? '—' : x.kind === 'skip' ? String(x.r.lv) : x.kind === 'done' ? 'уже ' + x.r.lv : x.to === x.r.lv ? String(x.r.lv) : x.r.lv + ' → ' + x.to;
          return '<label class="row pt-row" data-kind="' + x.kind + '">' +
            '<input type="checkbox" data-pt-row="' + i + '"' + (x.on ? ' checked' : '') + (can ? '' : ' disabled') + '>' +
            '<span class="en">' + esc(title) + '</span><span class="ru">' + esc(verdictTxt(x)) + '</span>' +
            '<span class="chg">' + esc(chg) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="m-actions"><button type="button" class="m-btn" data-pt-apply' + (any ? '' : ' disabled') + '>Применить</button></div>';
    }
    return '<p class="pt-note pt-lead">Вставь ответ нейросети целиком или только строку с кодом — сайт сам найдёт <code>' + PREFIX + '|…</code>. ' +
      'Уровень правила только растёт — по числу верных применений: хотя бы 1 верное — +1, от 3 верных и точность от 75% — +2, от 5 верных без ошибок — +3. На уровнях 4–6 рост только при 3+ верных и точности от 66%. Ошибки уровень не снижают. ' +
      'С уровня 7: каждое верное применение — шаг, 3 шага подряд — следующий уровень; ошибка по правилу обнуляет шаги.</p>' +
      '<textarea class="pt-text pt-in" rows="4" placeholder="' + PREFIX + '|ABCD|pres-simple:7:5/0|past-cont:3:2/3" aria-label="Код от нейросети">' + esc(S.codeText) + '</textarea>' +
      (S.msg ? '<p class="pt-msg" role="status">' + S.msg + '</p>' : '') +
      (S.rows ? prev : '<div class="m-actions"><button type="button" class="m-btn" data-pt-check>Проверить код</button></div>');
  }

  function check() {
    const ta = modal.querySelector('.pt-in');
    S.codeText = ta ? ta.value : S.codeText;
    S.parsed = parseCode(S.codeText);
    S.rows = null;
    if (!S.parsed) { S.msg = 'Код не найден. Он начинается с <code>' + PREFIX + '|</code> и выглядит так: <code>' + PREFIX + '|ABCD|pres-simple:7:5/0</code>.'; render(); return; }
    if (!S.parsed.items.length) { S.msg = 'В коде нет ни одного правила.'; render(); return; }
    S.rows = plan(S.parsed);
    if (usedTags().includes(S.parsed.tag)) S.rows.forEach(x => x.on = false);
    S.msg = '';
    render();
  }
  let applying=false;
  async function apply() {
    if(applying||!S.rows)return;
    if(typeof needProfile==='function'&&needProfile())return;
    if(typeof canWrite==='function'&&!canWrite()){S.msg='Это профиль другого ученика.';render();return;}
    const state=S,profile=profileKey(),tag=S.parsed.tag;
    const todo=S.rows.filter(x=>x.on&&x.kind==='ok'&&x.r&&(x.to!==x.r.lv||x.toSt!==(x.r.st||0)));
    if(!todo.length||usedTags().includes(tag))return;
    applying=true;
    const button=modal.querySelector('[data-pt-apply]');if(button)button.disabled=true;
    try{
      const result=await G.applyRuleCode(tag,todo.map(x=>({id:x.id,from:x.r.lv,to:x.to,st:x.toSt||0})));
      markUsed(tag,profile);
      if(S===state){
        S.msg=result.alreadyUsed?'Этот код уже применён к аккаунту.':'Готово: изменено правил - '+result.applied+'.';
        S.rows=null;S.codeText='';render();
      }
    }catch(e){
      if(S===state){S.msg=esc(e.message||'Не удалось сохранить результат. Проверь соединение и попробуй ещё раз.');render();}
    }finally{applying=false;}
  }
  function copy(chatName, destination) {
    const ta = modal.querySelector('.pt-text'); if (!S || !ta || !ta.value) return;
    const state = S, tag = S.tag, text = ta.value;
    const fallback = () => {
      if (S !== state || S.tag !== tag || !ta.isConnected) return false;
      const focused = document.activeElement;
      const details = ta.closest('details'), wasOpen = details?.open;
      if (details) details.open = true;
      ta.focus(); ta.select();
      try {
        const ok = document.execCommand('copy');
        if (ok && details && !wasOpen) details.open = false;
        if (ok && focused && focused.isConnected) focused.focus({ preventScroll: true });
        return ok;
      } catch (e) { return false; }
    };
    const done = ok => {
      // A delayed clipboard response must not update a closed or newly changed prompt.
      if (S !== state || S.tag !== tag || modal.querySelector('.pt-text') !== ta) return;
      S.copied = !!ok;
      const b = modal.querySelector('[data-pt-copy]'); if (b) b.textContent = ok ? 'Скопировано ✓' : 'Скопировать промт';
      launchMessage(ok
        ? (chatName ? 'Промт скопирован. Открой ' + chatName + ' и вставь его в поле сообщения (' + pasteHint() + ').' : 'Промт скопирован.')
        : 'Не удалось скопировать промт автоматически. Выдели текст промта в поле ниже и скопируй его вручную.',
        destination, chatName);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => done(true), () => done(fallback()));
      } else done(fallback());
    } catch (e) { done(fallback()); }
  }
  // Синхронное копирование прямо в обработчике нажатия: тогда ссылка на чат открывается тем же
  // нажатием, а промт уже лежит в буфере. Асинхронный Clipboard API не успевает до ухода со страницы.
  function copyNow(text) {
    const focused = document.activeElement;
    const tmp = document.createElement('textarea');
    tmp.value = text; tmp.readOnly = true; tmp.tabIndex = -1; tmp.setAttribute('aria-hidden', 'true');
    tmp.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none;font-size:16px';
    modal.appendChild(tmp);
    let ok = false;
    try {
      tmp.focus({ preventScroll: true }); tmp.select(); tmp.setSelectionRange(0, text.length);
      ok = document.execCommand('copy');
    } catch (e) { ok = false; }
    tmp.remove();
    if (focused && focused.isConnected) focused.focus({ preventScroll: true });
    return !!ok;
  }
  function markCopied(ok) {
    S.copied = !!ok;
    const b = modal.querySelector('[data-pt-copy]'); if (b) b.textContent = ok ? 'Скопировано ✓' : 'Скопировать промт';
  }
  // destination — запасной второй шаг, если промт не удалось скопировать в момент нажатия.
  function launchMessage(text, destination, chatName) {
    const msg = modal.querySelector('.pt-launch-status'); if (!msg) return;
    msg.textContent = text;
    if (destination) {
      const link = el('a', 'm-btn pt-continue');
      link.href = destination.href; link.rel = 'noopener noreferrer';
      if (!destination.app) link.target = '_blank';
      link.textContent = 'Открыть ' + chatName;
      msg.append(link);
    }
    msg.hidden = false;
    msg.scrollIntoView({ block: 'nearest' });
  }

  function onSelect(key, v) {
    let filterChanged = false;
    if (key === 'textLevel') {
      if (v !== 'auto' && !TEXT_LEVELS[v]) return;
      S.textLevel = v; S.tag = newTag(); S.copied = false; lsSet(TEXT_LEVEL_KEY, v);
    } else if (key === 'scope') { S.scope = v === 'all' ? 'all' : 'read'; filterChanged = true; }
    else if (key === 'level') { S.fLevel = LV_ORDER[v] != null ? v : 'all'; filterChanged = true; }
    else if (key === 'branch') { S.fBranch = G_BRANCHES.some(b => b.name === v) ? v : 'all'; filterChanged = true; }
    else if (key === 'n') {
      const n = +v; if (!PICK_NS.includes(n)) return;
      S.pickN = n; lsSet(PICK_KEY, String(n));
      // новое число сразу применяется: берём столько самых слабых из видимого списка
      S.touched = true; S.copied = false; S.sel = weakSel(); S.tag = newTag();
    } else return;
    if (filterChanged) {
      S.touched = true;
      S.copied = false;
      pruneFilteredSelection();
      S.tag = newTag();
    }
    render();
    const f = modal.querySelector('[data-pt-sel="' + key + '"]'); if (f) f.focus({ preventScroll: true });
  }
  const owner = {
    onClick(ev) {
      const t = ev.target;
      const tab = t.closest('[data-pt-tab]'); if (tab) { S.tab = tab.dataset.ptTab; S.msg = ''; render(); return; }
      if (t.closest('[data-pt-length-toggle]')) {
        if (S.type !== 'translate') {
          S.type = 'translate'; S.copied = false; S.tag = newTag();
          if (!S.touched) S.sel = defaultSel(S.type);
          S.lengthOpen = true;
        } else S.lengthOpen = !S.lengthOpen;
        render(); modal.querySelector('[data-pt-length-toggle]').focus({ preventScroll: true }); return;
      }
      const ty = t.closest('[data-pt-type]');
      if (ty) {
        const type = ty.dataset.ptType;
        if (!TYPES[type] || TYPES[type].topicOnly) return;
        if (S.type !== type) S.lengthOpen = false;
        S.type = type; S.copied = false; if (!S.touched) S.sel = defaultSel(S.type); S.tag = newTag(); render(); return;
      }
      const sc = t.closest('[data-pt-scope]'); if (sc) {
        S.scope = sc.dataset.ptScope;
        S.touched = true; S.copied = false;
        pruneFilteredSelection();
        S.tag = newTag();
        render(); return;
      }
      const pk = t.closest('[data-pt-pick]');
      if (pk) {
        const how = pk.dataset.ptPick;
        S.touched = true; S.copied = false;
        S.sel = how === 'weak' ? weakSel() : how === 'shown' ? new Set(visibleRules().map(r => r.id)) : new Set();
        S.tag = newTag(); render(); return;
      }
      const chat = t.closest('[data-pt-open]');
      if (chat) {
        const ai = AI_CHATS[chat.dataset.ptOpen];
        const text = modal.querySelector('.pt-text')?.value;
        if (!ai || chat.getAttribute('aria-disabled') === 'true' || !text) { ev.preventDefault(); return; }
        const dest = chatDestination(ai, text);
        const copied = copyNow(text);
        if (copied || dest.prefilled) {
          // Одно нажатие: браузер сам перейдёт по ссылке сразу после этого обработчика.
          if (copied) markCopied(true);
          launchMessage(dest.prefilled
            ? ai.name + ' открывается с заданием.' + (copied ? ' Если поле сообщения окажется пустым (бывает в приложении или после входа), вставь промт — он скопирован (' + pasteHint() + ').' : '')
            : 'Промт скопирован. В чате ' + ai.name + ' вставь его в поле сообщения (' + pasteHint() + ') и отправь.');
          return;
        }
        // Браузер не дал скопировать сразу: копируем асинхронно, чат откроется вторым нажатием.
        ev.preventDefault();
        copy(ai.name, dest); return;
      }
      if (t.closest('[data-pt-share]')) {
        const state = S, tag = S.tag, text = modal.querySelector('.pt-text')?.value;
        if (!text || typeof navigator.share !== 'function') return;
        const failed = e => {
          if (S !== state || S.tag !== tag || e?.name === 'AbortError') return;
          const msg = modal.querySelector('.pt-launch-status');
          if (msg) { msg.textContent = 'Не удалось открыть меню приложений. Используй кнопку чата или скопируй промт.'; msg.hidden = false; }
        };
        try { Promise.resolve(navigator.share({ text })).catch(failed); } catch(e) { failed(e); }
        return;
      }
      if (t.closest('[data-pt-copy]')) { copy(); return; }
      if (t.closest('[data-pt-check]')) { check(); return; }
      if (t.closest('[data-pt-apply]')) { apply(); return; }
    },
    onChange(ev) {
      const t = ev.target;
      if (t.matches('[data-pt-length]')) { updateTextLength(t); return; }
      if (t.matches('[data-pt-sel]')) { onSelect(t.dataset.ptSel, t.value); return; }
      if (t.matches('[data-pt-app]')) { preferApp = t.checked; render(); return; }
      if (t.matches('[data-pt-id]')) {
        S.touched = true; S.copied = false;
        if (t.checked) S.sel.add(t.dataset.ptId); else S.sel.delete(t.dataset.ptId);
        S.tag = newTag(); render(); return;
      }
      if (t.matches('[data-pt-row]') && S.rows) {
        S.rows[+t.dataset.ptRow].on = t.checked;
        const b = modal.querySelector('[data-pt-apply]'); if (b) b.disabled = !S.rows.some(x => x.on);
      }
    },
    onKey(ev) {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && S && S.tab === 'code') { check(); ev.preventDefault(); }
    },
    onClose() { const focused = S?.returnFocus; S = null; modal.classList.remove('pt-modal', 'pt-topic-dialog'); if (focused?.isConnected) focused.focus({ preventScroll: true }); },
  };
  modal.addEventListener('input', ev => {
    if (!S) return;
    if (ev.target.matches('.pt-in')) S.codeText = ev.target.value;
    if (ev.target.matches('[data-pt-length]')) updateTextLength(ev.target);
  });
  modal.addEventListener('toggle', ev => {
    if (S && ev.target.isConnected && ev.target.matches('.pt-manual')) S.manualOpen = ev.target.open;
  }, true);

  window.PROMPTS = { open, openTopic: id => open('prompt', id) };
})();
