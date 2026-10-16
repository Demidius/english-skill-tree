// «Промт»: задания для любой нейросети по отрабатываемым правилам и ввод кода изменений уровней.
// Кнопка «Изучать с AI» в блоке отработки. Окно: вкладка «Промт» (тип задания,
// выбор правил, готовый текст для копирования) и вкладка «Ввести код» (превью и применение).
//
// Код от нейросети: EFST1|TAG|id:уровень:оценка|…  (оценка: + верно, - ошибка, 0 не встретилось)
// Уровень в коде — тот, что был в промте. Сайт сравнивает его с текущим: так один и тот же код
// не применится дважды даже на другом устройстве. Шаг изменения берётся из «Настроек»
// (COEF.rulesPractice: верно / ошибка).
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
    { name: 'Очень короткий', sentences: '2–3 предложения' },
    { name: 'Короткий', sentences: '4–6 предложений' },
    { name: 'Средний', sentences: '8–12 предложений' },
    { name: 'Длинный', sentences: '16–20 предложений' },
    { name: 'Очень длинный', sentences: '30–40 предложений' },
  ];
  const LV_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3 };
  const AI_CHATS = {
    gpt: { name: 'GPT', url: 'https://chatgpt.com/', query: 'q', android: 'com.openai.chatgpt' },
    claude: { name: 'Claude', url: 'https://claude.ai/new', query: 'q', android: 'com.anthropic.claude' },
    deepseek: { name: 'DeepSeek', url: 'https://chat.deepseek.com/', android: 'com.deepseek.chat' },
    qwen: { name: 'Qwen', url: 'https://chat.qwen.ai/', query: 'text', android: 'ai.qwenlm.chat.android' },
  };
  const IS_ANDROID = /Android/i.test(navigator.userAgent);
  let preferApp = true;

  function chatDestination(ai, text) {
    const url = new URL(ai.url);
    if (ai.query) url.searchParams.set(ai.query, text);
    // Keep long practice prompts intact in the clipboard instead of risking a rejected URL.
    const prefilled = !!ai.query && url.href.length <= 12000;
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

  // ---------- данные ----------
  function rules() {
    return G.rulesData().filter(r => INFO[r.id]).sort((a, b) =>
      a.lv - b.lv || LV_ORDER[a.level] - LV_ORDER[b.level] || a.title.localeCompare(b.title));
  }
  function visibleRules() {
    const all = rules();
    return S.scope === 'read' ? all.filter(r => r.read) : all;
  }
  function defaultSel(type) {
    const n = TYPES[type].def;
    const pool = rules().filter(r => r.read && r.lv < GMAX);
    return new Set(pool.slice(0, n).map(r => r.id));
  }
  function newTag() {
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let t = ''; for (let i = 0; i < 4; i++) t += A[Math.floor(Math.random() * A.length)];
    return t;
  }
  function profileKey() { return (typeof current !== 'undefined' && current) || 'local'; }
  function usedTags() {
    try { const o = JSON.parse(lsGet(USED_KEY) || '{}'); return o[profileKey()] || []; } catch (e) { return []; }
  }
  function markUsed(tag) {
    try {
      const o = JSON.parse(lsGet(USED_KEY) || '{}');
      const a = (o[profileKey()] || []).filter(t => t !== tag); a.push(tag);
      o[profileKey()] = a.slice(-60);
      lsSet(USED_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  // ---------- текст промта ----------
  function ruleLines(ids) {
    const byId = {}; rules().forEach(r => byId[r.id] = r);
    return ids.map((id, i) => {
      const f = INFO[id], r = byId[id];
      return (i + 1) + '. ' + id + ' — ' + f.title + ' (' + f.level + ', ' + f.branch + '): ' + f.gloss +
        (f.ex ? '. Пример: ' + f.ex : '') + ' — мой уровень ' + (r ? r.lv : 0) + '/10';
    }).join('\n');
  }
  function orderedSel() {
    return rules().filter(r => S.sel.has(r.id)).map(r => r.id);
  }
  function sentencePrompt(direction) {
    const toEnglish = direction === 'ru-en';
    return 'Задание — перевод по одному полному предложению ' + (toEnglish ? 'с русского на английский (RU → EN)' : 'с английского на русский (EN → RU)') + '.\n' +
      '1. Дай ровно одно новое полное предложение ' + (toEnglish ? 'на русском' : 'на английском') + ' на бытовую тему. ' +
      'Оно должно отрабатывать одно или несколько правил из выбранного списка. Чередуй темы, постепенно охвати весь список, слабые темы давай чаще. ' +
      'Не выдавай набор предложений, готовый перевод или подсказку о нужном правиле.\n' +
      '2. Остановись и жди мой перевод ' + (toEnglish ? 'на английский' : 'на русский') + '. Не отвечай за ученика и не разбирай предложение заранее.\n' +
      '3. После каждого моего перевода сразу дай короткий разбор по-русски. Если перевод верный — явно подтверди это. ' +
      'Если есть ошибка — покажи мой вариант → исправленный вариант, объясни причину и укажи id правила из выбранного списка. ' +
      'Принимай корректные варианты перевода: не требуй буквального совпадения с образцом. Более естественную формулировку предлагай отдельно, не считая правильный вариант ошибкой. ' +
      (toEnglish ? 'Проверяй смысл и английскую грамматику.' : 'Проверяй сохранение смысла английской конструкции в русском переводе: времени, отрицания, условия, модальности и других значимых оттенков. Не требуй воспроизведения английского порядка слов в русском.') +
      ' Ошибки вне выбранных правил отмечай отдельно: они не влияют на код этих правил.\n' +
      '4. В том же ответе после разбора сразу дай следующее одно предложение и снова жди мой перевод. Не спрашивай каждый раз, продолжать ли. ' +
      'В каждый момент должно быть только одно предложение, ожидающее перевода.\n' +
      '5. Повторяй этот цикл без заранее заданного числа предложений, пока я явно не завершу занятие: «хватит», «стоп», «закончим», «итог» или аналогичная просьба. ' +
      'Это команда завершения, а не перевод. Если я прислал перевод вместе с просьбой закончить, сначала оцени этот перевод. ' +
      'Неотвеченное предложение не считай ошибкой. После команды завершения новых заданий не давай.\n' +
      '6. Только после завершения подведи общие итоги всей сессии: сколько переводов выполнено, что получилось, какие ошибки повторялись и что повторить. ' +
      'Для каждого выбранного правила укажи число верных и ошибочных применений. Оценивай ответы ученика, а не свои исправления. ' +
      'Итог правила: «верно» (+), если оно проверялось и все ответы по нему верны; «ошибка» (-), если была хотя бы одна ошибка именно в этом правиле; ' +
      '«не встретилось» (0), если правило не проверялось, в том числе если занятие закончилось до первого перевода. ' +
      'Не добавляй в итог правила вне выбранного списка. Затем выведи один итоговый код для сайта по формату ниже. До завершения занятия код не выдавай.\n';
  }
  function buildPrompt() {
    const ids = orderedSel();
    if (!ids.length) return '';
    const lvls = [...new Set(ids.map(id => INFO[id].level))].sort((a, b) => LV_ORDER[a] - LV_ORDER[b]);
    const head =
      'Ты — опытный преподаватель английского для русскоязычных учеников. Я занимаюсь по учебникам English File ' +
      '(в этом занятии — уровни ' + lvls.join(', ') + ') и отрабатываю конкретные грамматические правила. ' +
      'Общайся со мной по-русски; английский — только в заданиях, примерах и исправлениях.\n\n' +
      'Правила для отработки (id — название, уровень учебника, суть, пример; в конце — мой текущий уровень владения правилом по шкале 0–10):\n' +
      ruleLines(ids) + '\n\n' +
      'Правила с уровнем 0–4 я знаю слабо — давай их проще и чаще; с уровнем 8–9 — в более сложных контекстах.\n\n';
    const body = TYPES[S.type].direction ? sentencePrompt(TYPES[S.type].direction) : {
      translate:
        'Задание — перевод с русского на английский.\n' +
        '1. Напиши один связный текст на русском. Выбранная длина: ' + TEXT_LENGTHS[S.textLength].name.toLowerCase() + ' текст, ' + TEXT_LENGTHS[S.textLength].sentences + '. ' +
        'Тема — бытовая (работа, путешествия, друзья, планы, выходные и т. п.). Соблюдай выбранный диапазон длины. ' +
        'Постарайся естественно охватить выбранные правила, начиная со слабых. Если в короткий текст все темы не помещаются, не увеличивай длину и не перегружай предложения: используй часть тем. ' +
        'Правила, которых не было в тексте или переводе ученика, отметь в итоге как «не встретилось» (0); их уровни не меняются. Лексика — не сложнее уровня B1. ' +
        'Не подсказывай, где какое правило, и не давай перевод.\n' +
        '2. Остановись и жди мой перевод. Ничего не разбирай заранее.\n' +
        '3. Когда я пришлю перевод, разбери его по предложениям:\n' +
        '   — мой вариант → правильный вариант, если есть ошибка;\n' +
        '   — коротко по-русски: в чём ошибка и к какому правилу (id) она относится;\n' +
        '   — если вариант верный, но звучит неестественно, предложи более естественный и отметь, что это не ошибка;\n' +
        '   — ошибки не по правилам из списка (слова, предлоги, артикли, порядок слов) отмечай отдельно — на оценку правил они не влияют.\n' +
        '4. Итог по каждому правилу из списка: «верно» — все употребления правильные; «ошибка» — хотя бы одна ошибка именно в этом правиле; ' +
        '«не встретилось» — если правило не встречалось в тексте или моём переводе. Потом коротко: какие правила можно повышать, какие стоит повторить и что именно повторить.\n',
      fix:
        'Задание — найди и исправь ошибки.\n' +
        '1. Напиши 12 пронумерованных предложений на английском. Примерно в половине из них должна быть ошибка именно в правилах из списка ' +
        '(каждое правило — минимум в 2 предложениях: с ошибкой и без), остальные предложения — правильные. ' +
        'Ошибки делай типичными для русскоязычных учеников. Не помечай, где ошибки и какие правила проверяются.\n' +
        '2. Остановись и жди мой ответ: я напишу номера предложений с ошибками и исправленные варианты.\n' +
        '3. Разбери мой ответ: какие ошибки я нашёл и исправил верно, какие пропустил, где «исправил» правильное предложение. ' +
        'Для каждой ошибки — правильный вариант и короткое объяснение по-русски со ссылкой на правило (id).\n' +
        '4. Итог по каждому правилу: «верно» — я нашёл и правильно исправил все ошибки этого правила и не испортил правильные предложения; ' +
        '«ошибка» — пропустил или неверно исправил хотя бы одну; «не встретилось» — если правила в предложениях не было. ' +
        'Потом коротко: какие правила можно повышать, какие повторить.\n',
      dialog:
        'Задание — разговорная практика.\n' +
        '1. Предложи на выбор 3 бытовые ситуации для диалога, дождись моего выбора и начни разговор на английском. ' +
        'Задавай вопросы так, чтобы мне приходилось отвечать с помощью правил из списка (по очереди охвати все). ' +
        'В одном сообщении — один-два вопроса, говори просто.\n' +
        '2. Во время диалога ошибки не исправляй, просто продолжай разговор. Сделай 10–12 реплик или закончи раньше, если я напишу «итог».\n' +
        '3. После диалога разбери мои реплики: мой вариант → правильный, коротко по-русски, со ссылкой на правило (id). ' +
        'Ошибки не по правилам из списка отмечай отдельно — на оценку правил они не влияют.\n' +
        '4. Итог по каждому правилу: «верно» — все употребления правильные; «ошибка» — хотя бы одна ошибка в этом правиле; ' +
        '«не встретилось» — если я его не использовал. Потом коротко: какие правила можно повышать, какие повторить.\n',
      explain:
        'Задание — объясни эти правила, начиная с того, где у меня самый низкий уровень. Для каждого правила:\n' +
        '1. Простое объяснение по-русски: когда употребляется и как строится (утверждение, отрицание, вопрос).\n' +
        '2. Чем отличается от похожих конструкций, которые путают русскоязычные, — с примерами «так — не так».\n' +
        '3. 4–5 примеров из жизни с переводом.\n' +
        '4. Мини-тест из 5 заданий (вставить пропуск или перевести фразу). Ответы дай в самом конце под заголовком «Ответы».\n',
    }[S.type];
    const code = !TYPES[S.type].code ? '' :
      'Код для моего сайта в конце итогового разбора — одной строкой в блоке кода, строго в формате:\n' +
      PREFIX + '|' + S.tag + '|id:уровень:оценка|id:уровень:оценка|…\n' +
      '— перечисли все правила из списка;\n' +
      '— id и уровень бери ровно из списка (уровень — мой текущий, не меняй его);\n' +
      '— оценка: + верно, - ошибка, 0 не встретилось.\n' +
      'Пример формата: ' + PREFIX + '|' + S.tag + '|id1:7:+|id2:3:-|id3:5:0\n' +
      'Сам уровни не повышай и не понижай — сайт пересчитает их по этим оценкам.\n';
    return head + body + code;
  }

  // ---------- разбор кода ----------
  const CODE_RE = new RegExp(PREFIX + '\\s*\\|\\s*([A-Za-z0-9]{3,8})((?:\\s*\\|\\s*[A-Za-z0-9-]+\\s*:\\s*\\d{1,2}\\s*:\\s*[+\\-−–—0=])+)', 'i');
  function parseCode(txt) {
    const m = String(txt || '').match(CODE_RE);
    if (!m) return null;
    const items = [];
    m[2].split('|').forEach(part => {
      const mm = part.trim().match(/^([A-Za-z0-9-]+)\s*:\s*(\d{1,2})\s*:\s*([+\-−–—0=])$/);
      if (!mm) return;
      const c = mm[3];
      items.push({ id: mm[1].toLowerCase(), from: Math.min(GMAX, +mm[2]), sign: c === '+' ? 1 : (c === '0' || c === '=') ? 0 : -1 });
    });
    return { tag: m[1].toUpperCase(), items };
  }
  function clamp(v) { return Math.max(0, Math.min(GMAX, v)); }
  function plan(parsed) {
    const byId = {}; rules().forEach(r => byId[r.id] = r);
    const seen = new Set();
    return parsed.items.filter(it => !seen.has(it.id) && seen.add(it.id)).map(it => {
      const r = byId[it.id];
      if (!r) return Object.assign({}, it, { kind: 'unknown', on: false });
      if (it.sign === 0) return Object.assign({}, it, { r, kind: 'skip', to: r.lv, on: false });
      const d = it.sign > 0 ? COEF.rulesPractice.ok : COEF.rulesPractice.wrong;
      const exp = clamp(it.from + d);
      if (r.lv === it.from) return Object.assign({}, it, { r, d, kind: 'ok', to: exp, on: exp !== r.lv });
      if (r.lv === exp) return Object.assign({}, it, { r, d, kind: 'done', to: r.lv, on: false });
      return Object.assign({}, it, { r, d, kind: 'moved', to: clamp(r.lv + d), on: true });
    });
  }

  // ---------- окно ----------
  function open(tab, topicId) {
    if (topicId && !INFO[topicId]) return;
    if (typeof needProfile === 'function' && needProfile()) return;
    S = { tab: tab || 'prompt', topicId: topicId || null, type: topicId ? 'explain' : 'translate', scope: topicId ? 'all' : 'read', tag: newTag(), touched: !!topicId,
          sel: topicId ? new Set([topicId]) : defaultSel('translate'), textLength: 2, lengthOpen: false, manualOpen: false, codeText: '', parsed: null, rows: null, msg: '', returnFocus: document.activeElement };
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
        return '<a class="m-btn ghost" data-pt-open="' + id + '"' + (txt ? ' href="' + esc(dest.href) + '"' + (!dest.app ? ' target="_blank"' : '') + ' rel="noopener noreferrer"' : ' role="link" aria-disabled="true" tabindex="-1"') + '><span>' + (explanation ? 'Объяснение в ' : 'Открыть в ') + '<b>' + ai.name + '</b><small>' + (dest.prefilled ? 'С готовым запросом' : 'Копировать → вставить') + '</small></span></a>';
      }).join('') + '</div>' +
      (typeof navigator.share === 'function' ? '<button type="button" class="m-btn ghost pt-share" data-pt-share' + (!txt ? ' disabled' : '') + '>Передать промт в приложение…</button>' : '');
  }
  function launchStatus() { return '<p class="pt-launch-status" role="status" aria-live="polite" hidden></p>'; }
  function renderTopic() {
    const topic = INFO[S.topicId], txt = buildPrompt();
    return mHead('Объяснение темы · ' + topic.level, topic.title) +
      '<p class="pt-topic-summary">' + esc(topic.gloss || topic.branch) + '</p>' +
      chatLinks(txt, true) +
      '<p class="pt-note">GPT, Claude и Qwen откроются с запросом об этой теме. Если поле пустое после входа или в приложении — вставь промт из буфера. Для DeepSeek нужна вставка вручную.</p>' +
      '<details class="pt-topic-prompt"><summary>Посмотреть промт</summary>' +
        '<textarea class="pt-text" readonly rows="5" aria-label="Промт объяснения темы">' + esc(txt) + '</textarea>' +
        '<button type="button" class="m-btn ghost" data-pt-copy>Скопировать промт</button>' +
      '</details>' + launchStatus();
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
    return '<div class="m-count pt-h">1. Что делаем</div>' +
      '<div class="pt-types">' + Object.keys(TYPES).filter(k => !TYPES[k].topicOnly).map(k => {
        const button = '<button type="button" class="m-opt pt-type" data-pt-type="' + k + '" aria-pressed="' + (S.type === k) + '">' +
          '<b>' + esc(TYPES[k].name) + '</b><span>' + esc(TYPES[k].sub) + '</span></button>';
        if (k !== 'translate') return button;
        const expanded = S.type === k && S.lengthOpen;
        return '<div class="pt-translation"><div class="pt-translation-row">' + button +
          '<button type="button" class="m-opt pt-length-toggle" data-pt-length-toggle aria-controls="ptTextLengthPanel" aria-expanded="' + expanded + '" aria-label="Настроить длину текста: ' + lengthLabel() + '">Настроить<br>длину</button></div>' +
          (expanded ? renderTextLength() : '') + '</div>';
      }).join('') + '</div>' +
      (TYPES[S.type].direction ? '<p class="pt-note">Одно предложение → твой перевод → разбор → следующее. Напиши «хватит», чтобы получить общие итоги и код для сайта.</p>' : '') +
      '<div class="m-count pt-h">2. Правила · выбрано ' + nSel + '</div>' +
      '<div class="pt-tools">' +
        '<button type="button" class="chip" data-pt-scope="read" data-active="' + (S.scope === 'read' ? 1 : 0) + '">«Изучено»</button>' +
        '<button type="button" class="chip" data-pt-scope="all" data-active="' + (S.scope === 'all' ? 1 : 0) + '">Все правила</button>' +
        '<span class="pt-sp"></span>' +
        '<button type="button" class="chip" data-pt-pick="weak">Самые слабые ' + TYPES[S.type].def + '</button>' +
        '<button type="button" class="chip" data-pt-pick="none">Снять</button>' +
      '</div>' +
      (list.length ?
        '<div class="pt-rules">' + list.map(r =>
          '<label class="pt-rule"><input type="checkbox" data-pt-id="' + esc(r.id) + '"' + (S.sel.has(r.id) ? ' checked' : '') + '>' +
          '<span class="pt-rt">' + esc(r.title) + '</span>' +
          '<span class="pt-rm">' + esc(r.level) + ' · ' + esc(INFO[r.id].branch) + '</span>' +
          '<span class="pt-lv" data-b="' + (r.lv >= GMAX ? 'm' : r.lv >= 5 ? 'r' : r.lv > 0 ? 'l' : '0') + '">' + r.lv + '</span></label>').join('') +
        '</div>' :
        '<p class="pt-note">Нет правил с отметкой «изучено». Переключись на «Все правила» или отметь галочкой «изучено» правила в дереве.</p>') +
      '<section class="pt-actions pt-launch" aria-labelledby="ptLaunchTitle">' +
        '<h3 id="ptLaunchTitle" class="m-count pt-h">3. Начни занятие</h3>' +
        '<p class="pt-note">' + (txt ? 'Выбери чат — задание по выбранным темам уже подготовлено.' : 'Сначала отметь хотя бы одну тему.') + '</p>' +
        chatLinks(txt, false) + launchStatus() +
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
    modal.querySelector('[data-pt-length-toggle]').setAttribute('aria-label', 'Настроить длину текста: ' + lengthLabel());
    const text = buildPrompt(), textarea = modal.querySelector('.pt-text');
    if (textarea) textarea.value = text;
    const group = modal.querySelector('.pt-ai-actions');
    if (group) group.replaceWith(el('div', '', chatLinks(text, false)).querySelector('.pt-ai-actions'));
    const copyButton = modal.querySelector('[data-pt-copy]');
    if (copyButton) copyButton.textContent = 'Скопировать промт';
    const status = modal.querySelector('.pt-launch-status');
    if (status) { status.hidden = true; status.textContent = ''; }
  }
  function verdictTxt(x) {
    if (x.kind === 'unknown') return 'нет такого правила';
    if (x.kind === 'skip') return 'не встретилось';
    return (x.sign > 0 ? 'верно' : 'ошибка') + ' · ' + sgn(x.d);
  }
  function renderCode() {
    let prev = '';
    if (S.rows) {
      const used = usedTags().includes(S.parsed.tag);
      const notes = [];
      if (used) notes.push('Код <b>' + esc(S.parsed.tag) + '</b> уже применяли на этом устройстве.');
      if (S.rows.some(x => x.kind === 'done')) notes.push('Где уровень уже равен итоговому, код, похоже, уже применён — эти строки выключены.');
      if (S.rows.some(x => x.kind === 'moved')) notes.push('Где уровень изменился с момента промта, шаг считается от текущего уровня.');
      if (S.rows.some(x => x.kind === 'unknown')) notes.push('Правила с неизвестным id пропущены.');
      const any = S.rows.some(x => x.on);
      prev = '<div class="m-count pt-h">Что изменится · ' + esc(typeof currentName === 'function' && currentName() ? currentName() : 'этот браузер') + '</div>' +
        (notes.length ? '<p class="pt-note pt-warn">' + notes.join(' ') + '</p>' : '') +
        '<div class="wl pt-res">' + S.rows.map((x, i) => {
          const can = x.kind === 'ok' || x.kind === 'moved' || x.kind === 'done';
          const title = x.r ? x.r.title : x.id;
          const chg = !x.r ? '—' : x.kind === 'skip' ? String(x.r.lv) : x.kind === 'done' ? 'уже ' + x.r.lv : x.r.lv + ' → ' + x.to;
          return '<label class="row pt-row" data-kind="' + x.kind + '">' +
            '<input type="checkbox" data-pt-row="' + i + '"' + (x.on ? ' checked' : '') + (can ? '' : ' disabled') + '>' +
            '<span class="en">' + esc(title) + '</span><span class="ru">' + esc(verdictTxt(x)) + '</span>' +
            '<span class="chg">' + esc(chg) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="m-actions"><button type="button" class="m-btn" data-pt-apply' + (any ? '' : ' disabled') + '>Применить</button></div>';
    }
    return '<p class="pt-note pt-lead">Вставь ответ нейросети целиком или только строку с кодом — сайт сам найдёт <code>' + PREFIX + '|…</code>. ' +
      'Шаги изменения уровня — из «Настроек»: верно ' + sgn(COEF.rulesPractice.ok) + ', ошибка ' + sgn(COEF.rulesPractice.wrong) + '.</p>' +
      '<textarea class="pt-text pt-in" rows="4" placeholder="' + PREFIX + '|ABCD|pres-simple:7:+|past-cont:3:-" aria-label="Код от нейросети">' + esc(S.codeText) + '</textarea>' +
      (S.msg ? '<p class="pt-msg" role="status">' + S.msg + '</p>' : '') +
      (S.rows ? prev : '<div class="m-actions"><button type="button" class="m-btn" data-pt-check>Проверить код</button></div>');
  }

  function check() {
    const ta = modal.querySelector('.pt-in');
    S.codeText = ta ? ta.value : S.codeText;
    S.parsed = parseCode(S.codeText);
    S.rows = null;
    if (!S.parsed) { S.msg = 'Код не найден. Он начинается с <code>' + PREFIX + '|</code> и выглядит так: <code>' + PREFIX + '|ABCD|pres-simple:7:+</code>.'; render(); return; }
    if (!S.parsed.items.length) { S.msg = 'В коде нет ни одного правила.'; render(); return; }
    S.rows = plan(S.parsed);
    if (usedTags().includes(S.parsed.tag)) S.rows.forEach(x => x.on = false);
    S.msg = '';
    render();
  }
  function apply() {
    if (!S.rows) return;
    if (typeof needProfile === 'function' && needProfile()) return;
    if (typeof canWrite === 'function' && !canWrite()) { S.msg = 'Это профиль другого ученика — менять его уровни нельзя.'; render(); return; }
    const todo = S.rows.filter(x => x.on && x.r && x.to !== x.r.lv);
    todo.forEach(x => G.setRuleLevel(x.id, x.to));
    markUsed(S.parsed.tag);
    S.msg = todo.length ? 'Готово: изменено правил — ' + todo.length + '.' : 'Изменений нет.';
    S.rows = null; S.codeText = '';
    render();
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
      const msg = modal.querySelector('.pt-launch-status');
      if (msg) {
        msg.textContent = ok ? (chatName ? 'Промт скопирован. Если поле пустое в ' + chatName + ', вставь текст из буфера.' : 'Промт скопирован.') : 'Не удалось скопировать промт. Выдели и скопируй текст вручную.';
        if (destination) {
          // A second explicit tap keeps app launching in a user gesture after copying has finished.
          const link = el('a', 'm-btn pt-continue');
          link.href = destination.href; link.rel = 'noopener noreferrer';
          if (!destination.app) link.target = '_blank';
          link.textContent = 'Открыть ' + chatName + ' и вставить промт';
          msg.append(document.createElement('br'), link);
        }
        msg.hidden = false;
        if (destination) msg.scrollIntoView({ block: 'nearest' });
      }
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => done(true), () => done(fallback()));
      } else done(fallback());
    } catch (e) { done(fallback()); }
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
      const sc = t.closest('[data-pt-scope]'); if (sc) { S.scope = sc.dataset.ptScope; render(); return; }
      const pk = t.closest('[data-pt-pick]');
      if (pk) { S.touched = true; S.copied = false; S.sel = pk.dataset.ptPick === 'weak' ? defaultSel(S.type) : new Set(); S.tag = newTag(); render(); return; }
      const chat = t.closest('[data-pt-open]');
      if (chat) {
        const ai = AI_CHATS[chat.dataset.ptOpen];
        if (!ai || chat.getAttribute('aria-disabled') === 'true' || !modal.querySelector('.pt-text')?.value) { ev.preventDefault(); return; }
        const dest = chatDestination(ai, modal.querySelector('.pt-text').value);
        if (!dest.prefilled) ev.preventDefault();
        // Prefilled links work independently of clipboard permissions; manual flows copy before opening.
        copy(ai.name, dest.prefilled ? null : dest); return;
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
