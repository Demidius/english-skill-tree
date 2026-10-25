// Обучение порциями. Новый пользователь сначала видит 3 подсказки о первом экране,
// а дальше каждая глава появляется сама, только когда он впервые оказывается на нужном экране:
// таблица правил, «Лексика», «Настройки», карточки, страница правила, тест.
// Кнопка «Как пользоваться» показывает подсказки к экрану, который открыт сейчас.
(function () {
  const KEY = 'ef_tour_v2', OLD_KEY = 'ef_tour_v1';

  // Общие шаги (поиск, фильтры) есть и в «Правилах», и в «Лексике» — показываем их один раз.
  const SEARCH = mode => ({ id: 'search', sel: '#mode-' + mode + ' .study-search', title: 'Поиск и масштаб',
    text: 'Ищи по названию, теме или коду урока учебника (например, 5A). Нажми на результат — тема подсветится в таблице.<br>' +
      'На компьютере справа — <b>масштаб</b>: уменьши таблицу, чтобы увидеть дерево целиком. Ctrl + колёсико тоже работает.' });
  const FILTERS = mode => ({ id: 'filters', sel: '#mode-' + mode + ' .jumpnav', title: 'Ветки и фильтры',
    text: 'Кнопки — быстрый переход к ветке таблицы. <b>Фильтры</b> — показать только нужные темы.' });

  const CHAPTERS = {
    // 1. Первый экран — показывается сразу при первом входе
    welcome: {
      outro: '<br><br>Остальное покажу по ходу: когда впервые откроешь новый экран, появится короткая подсказка.',
      steps: [
        { sel: '.modes.in-hub, .title-row .modes', title: 'Привет! Здесь два раздела',
          text: '<b>Правила</b> — грамматика по учебникам English File.<br><b>Лексика</b> — слова карточками с интервальным повторением.' },
        { sel: '.acc', title: 'Аккаунт и настройки',
          text: 'Вход и выход, друзья и <b>Настройки</b>: оформление сайта, вид таблицы слов, размер шрифта.' },
        { sel: '.rpg-lvl', title: 'Твой уровень',
          text: 'Растёт за выученные слова и пройденные правила.' },
      ] },

    // 2. Таблица правил — когда пользователь прокрутил к ней или вернулся в «Правила»
    rules: {
      steps: [
        { sel: '#mode-g .pt-topic-card', title: 'Карточка правила',
          text: 'Нажми на карточку — откроется правило с объяснением и примерами. <b>Тест</b> — 10 вопросов по нему.<br>' +
            '<b>‹ ›</b> — поменять уровень темы вручную, <b>изучено</b> — отметка для себя.<br>' +
            '<b>GPT</b> и кнопка YouTube — разобрать тему с нейросетью или по видео.' },
        SEARCH('g'),
        FILTERS('g'),
        { sel: '#mode-g .practice-panel', title: 'Отработка',
          text: 'Правила с отметкой «изучено» попадают сюда. <b>Быстрый тест</b> — вопросы вперемешку по ним, верные ответы поднимают уровень правил. ' +
            '<b>Изучать с AI</b> — готовый промт для нейросети.' },
      ] },

    // 3. «Лексика» — при первом переходе в раздел
    words: {
      steps: [
        { sel: '#mode-w .rv-lvls', title: 'Какие уровни учить',
          text: 'Включи нужные уровни — A1, A2, B1, B2. Кнопки рядом берут слова только из них.' },
        { sel: '#mode-w .rvb-due', title: 'Повторить',
          text: 'Слова, которым подошёл срок повторения. Чем лучше помнишь слово, тем реже оно возвращается. Начинай день отсюда.' },
        { sel: '#mode-w .rvb-base', title: 'Новые слова',
          text: '<b>Базовые</b> — основные слова уровня. <b>Экстра</b> — дополнительная лексика тех же веток, открывается, когда основные темы ветки пройдены на 75%.' },
        { sel: '#mode-w .node', title: 'Карточка темы',
          text: 'Нажми на тему — откроется список её слов. <b>Тест</b> — карточки только по этой теме. Полоска показывает, насколько знаешь каждое слово, внизу — урок учебника.' },
        SEARCH('w'),
        FILTERS('w'),
      ] },

    // 4. «Настройки»
    settings: {
      steps: [
        { sel: '#mode-s .access-card', title: 'Аккаунт и друзья',
          text: 'Профиль может быть приватным или публичным. Пригласи друзей кодом — вы будете видеть прогресс друг друга. Нужен вход в аккаунт.' },
        { sel: '#mode-s .skin-pick', title: 'Внешний вид',
          text: 'Оформление сайта, вид таблицы слов на телефоне и размер шрифта. Выбор сохраняется на этом устройстве.' },
      ] },

    // 5. Окна поверх страницы — при первом открытии
    cards: { modal: true,
      steps: [
        { sel: '.modal-back:not([hidden]) .fc .front', title: 'Карточки',
          text: 'Видишь русское слово — вспомни английское. Нажми <b>«Показать ответ»</b> (или пробел) и честно оцени себя: ' +
            '<b>Забыл</b>, <b>Трудно</b>, <b>Хорошо</b>, <b>Легко</b> (клавиши 1–4). От оценки зависит, когда слово вернётся.' },
        { sel: '.modal-back:not([hidden]) .fc-know', title: 'Я знаю',
          text: 'Уверен в слове? Нажми <b>«Я знаю»</b> или просто начни печатать ответ. Верно — уровень 8 и проверка через 45 дней; ошибся — неверные буквы подсветятся.<br>' +
            '<b>← Предыдущее слово</b> — вернуться назад.' },
      ] },
    rule: { modal: true,
      steps: [
        { sel: '.modal.rulepage .m-top', title: 'Страница правила',
          text: 'Объяснение, формы и примеры. <b>Тест</b> — 10 вопросов по правилу.<br>' +
            '<b>Уровень правила</b> меняется кнопками − и +, <b>изучено</b> — отметка для себя, на уровень не влияет.' },
      ] },
    test: { modal: true,
      steps: [
        { sel: '.modal.testm .m-opts', title: 'Тест',
          text: () => document.querySelector('.modal.testm .m-rid')
            ? 'Вопросы вперемешку по правилам с отметкой «изучено». Выбери ответ (клавиши 1–3) — сразу увидишь, верно ли. Верный ответ поднимает уровень правила, ошибка его не снижает.'
            : 'Выбери ответ (клавиши 1–3) — сразу увидишь, верно ли. В конце — разбор ошибок и само правило. 9 из 10 и выше — можно сразу поставить теме уровень 10.' },
      ] },
  };

  // ---------- состояние: какие главы и общие шаги уже показаны ----------
  let state = { ch: {}, ids: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
    else if (localStorage.getItem(OLD_KEY) === '1') { // уже прошёл старое обучение целиком
      Object.keys(CHAPTERS).forEach(k => { state.ch[k] = 1; });
      state.ids = { search: 1, filters: 1 };
      save();
    }
  } catch (e) { Object.keys(CHAPTERS).forEach(k => { state.ch[k] = 1; }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  // ---------- стили ----------
  const st = document.createElement('style');
  st.textContent =
    '.tour-btn{position:absolute;top:10px;right:12px;z-index:5;border:1px solid var(--line,#555);background:var(--surface,#26262b);color:var(--ink,#eee);' +
      'border-radius:999px;padding:5px 12px;font:600 .8rem Manrope,sans-serif;cursor:pointer;opacity:.9}' +
    '.tour-btn:hover{opacity:1;border-color:var(--accent,#ffd166)}' +
    'header.top{position:relative}' +
    '@media (max-width:640px){.tour-btn .tb-t{display:none}.tour-btn{padding:3px 9px;top:6px;right:6px}}' +
    '.tour-spot{position:fixed;z-index:10000;border-radius:8px;box-shadow:0 0 0 9999px rgba(0,0,0,.62);outline:3px solid var(--accent,#ffd166);outline-offset:2px;pointer-events:none;transition:all .25s ease}' +
    '.tour-spot.none{box-shadow:0 0 0 9999px rgba(0,0,0,.62);outline:none;width:0!important;height:0!important;left:50%!important;top:50%!important}' +
    '.tour-pop{position:fixed;z-index:10001;width:min(360px,calc(100vw - 24px));background:var(--surface,#26262b);color:var(--ink,#eee);' +
      'border:2px solid var(--accent,#ffd166);border-radius:10px;padding:16px 16px 12px;box-shadow:0 10px 30px rgba(0,0,0,.45);font:400 .95rem/1.45 Manrope,sans-serif}' +
    '.tour-pop h3{margin:0 0 6px;font-size:1.1rem;color:var(--accent,#ffd166)}' +
    '.tour-pop p{margin:0 0 12px}' +
    '.tour-pop .tp-row{display:flex;align-items:center;gap:8px}' +
    '.tour-pop .tp-n{font-size:.78rem;opacity:.7;margin-right:auto;white-space:nowrap}' +
    '.tour-pop .m-btn{padding:7px 14px;font-size:.85rem}' +
    '.tour-pop .tp-skip{background:none;border:0;color:inherit;opacity:.7;text-decoration:underline;cursor:pointer;font:inherit;font-size:.8rem;padding:0}';
  document.head.appendChild(st);

  // ---------- помощники ----------
  const visible = el => { if (!el || !el.isConnected) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && el.offsetParent !== null; };
  const find = sel => [...document.querySelectorAll(sel)].find(visible) || null;
  const curMode = () => { const b = document.querySelector('.modes button[aria-pressed="true"]'); return b ? b.dataset.mode : null; };
  const modalOpen = () => !!document.querySelector('.modal-back:not([hidden])');
  const inView = sel => [...document.querySelectorAll(sel)].some(el => {
    if (!visible(el)) return false; const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.85 && r.bottom > 60;
  });
  function appReady() {
    const de = document.documentElement, auth = document.getElementById('authBox');
    return !de.classList.contains('booting') && !de.classList.contains('auth-wait') &&
      (!auth || auth.hidden) && !!document.querySelector('.modes button') &&
      !document.querySelector('.acc-menu:not([hidden])');
  }

  // ---------- показ главы ----------
  let run = null; // { name, steps, i, dir, manual, el, back }
  let spot = null, pop = null, lastEnd = 0;

  function place(el) {
    const vw = window.innerWidth, vh = window.innerHeight, pad = 8;
    if (!el) {
      spot.className = 'tour-spot none';
      pop.style.left = Math.max(12, (vw - pop.offsetWidth) / 2) + 'px';
      pop.style.top = Math.max(12, (vh - pop.offsetHeight) / 2) + 'px';
      return;
    }
    const r = el.getBoundingClientRect();
    const x = Math.max(4, r.left - pad), y = Math.max(4, r.top - pad);
    const w = Math.min(vw - 8, r.right + pad) - x, h = Math.min(vh - 8, r.bottom + pad) - y;
    spot.className = 'tour-spot';
    Object.assign(spot.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let top = y + h + 12;
    if (top + ph > vh - 8) top = y - ph - 12;
    if (top < 8) top = Math.min(vh - ph - 8, Math.max(8, y + 12));
    const left = Math.min(Math.max(8, x + w / 2 - pw / 2), vw - pw - 8);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }

  function show() {
    const s = run.steps[run.i];
    const el = s.sel ? find(s.sel) : null;
    if (s.sel && !el) { // элемент пропал (закрыли окно, сменили раздел) — пропускаем шаг
      if (run.dir > 0 && run.i < run.steps.length - 1) { run.i++; return show(); }
      if (run.dir < 0 && run.i > 0) { run.i--; return show(); }
      return end();
    }
    run.el = el;
    const last = run.i === run.steps.length - 1, n = run.steps.length;
    let text = typeof s.text === 'function' ? s.text() : s.text;
    if (last && run.outro) text += run.outro;
    pop.innerHTML = '<h3>' + s.title + '</h3><p>' + text + '</p><div class="tp-row">' +
      '<span class="tp-n">' + (n > 1 ? (run.i + 1) + ' / ' + n : '') + '</span>' +
      (!last ? '<button type="button" class="tp-skip" data-t="end">Пропустить</button>' : '') +
      (run.i > 0 ? '<button type="button" class="m-btn ghost" data-t="prev">Назад</button>' : '') +
      '<button type="button" class="m-btn" data-t="next">' + (last ? 'Понятно' : 'Далее') + '</button></div>';
    if (el) el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    requestAnimationFrame(() => { if (!run) return; place(el); const f = pop.querySelector('[data-t="next"]'); if (f) f.focus({ preventScroll: true }); });
  }

  function go(d) { run.dir = d; run.i += d; if (run.i < 0) run.i = 0; if (run.i >= run.steps.length) return end(); show(); }

  function end() {
    if (!run) return;
    if (!run.manual) {
      run.names.forEach(nm => { state.ch[nm] = 1; });
      run.steps.forEach(s => { if (s.id) state.ids[s.id] = 1; });
      save();
    }
    const back = run.back;
    if (spot) spot.remove(); if (pop) pop.remove(); spot = pop = null; run = null;
    document.removeEventListener('keydown', onKey, true);
    lastEnd = Date.now(); scrolledSince = 0; cameBackToRules = false;
    if (back && back.isConnected && visible(back)) try { back.focus({ preventScroll: true }); } catch (e) {}
  }

  function onKey(ev) {
    if (!pop) return;
    if (ev.key === 'Escape') end();
    else if (ev.key === 'ArrowRight' || ev.key === 'Enter') go(1);
    else if (ev.key === 'ArrowLeft') go(-1);
    else return;
    ev.preventDefault(); ev.stopPropagation();
  }

  // names — главы подряд (для кнопки: первый экран + текущий раздел)
  function start(names, manual) {
    if (run) return false;
    let steps = [];
    names.forEach(nm => { steps = steps.concat(CHAPTERS[nm].steps); });
    // в автоматическом режиме общие шаги, уже показанные в другом разделе, не повторяем
    if (!manual) steps = steps.filter(s => !s.id || !state.ids[s.id]);
    steps = steps.filter(s => !s.sel || find(s.sel)); // только то, что есть на экране сейчас
    if (!steps.length) { if (!manual) { names.forEach(nm => { state.ch[nm] = 1; }); save(); } return false; }
    run = { names, steps, i: 0, dir: 1, manual: !!manual, back: document.activeElement,
      overModal: names.some(nm => CHAPTERS[nm].modal),
      outro: !manual && names.length === 1 ? CHAPTERS[names[0]].outro || '' : '' };
    spot = document.createElement('div'); spot.className = 'tour-spot none';
    pop = document.createElement('div'); pop.className = 'tour-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Подсказка');
    pop.addEventListener('click', ev => {
      const b = ev.target.closest('[data-t]'); if (!b) return;
      const t = b.dataset.t;
      if (t === 'next') go(1); else if (t === 'prev') go(-1); else end();
    });
    document.body.append(spot, pop);
    document.addEventListener('keydown', onKey, true);
    show();
    return true;
  }

  // ---------- когда какую главу показывать ----------
  let scrolledSince = 0, lastY = window.scrollY, cameBackToRules = false, modalSince = 0;
  window.addEventListener('scroll', () => {
    if (run) { place(run.el); return; }
    scrolledSince += Math.abs(window.scrollY - lastY); lastY = window.scrollY;
  }, true);
  window.addEventListener('resize', () => { if (run) place(run.el); });
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('.modes button[data-mode="g"]');
    if (b && curMode() !== 'g') cameBackToRules = true;
  }, true);

  // Окна поверх страницы проверяем первыми: пользователь сейчас именно там.
  const TRIGGERS = [
    ['cards', () => !!find('.modal-back:not([hidden]) .fc .front')],
    ['test', () => !!find('.modal.testm .m-opts')],
    ['rule', () => !!find('.modal.rulepage .m-top')],
    ['words', () => !modalOpen() && curMode() === 'w'],
    ['settings', () => !modalOpen() && curMode() === 's'],
    ['rules', () => !modalOpen() && curMode() === 'g' && (scrolledSince > 120 || cameBackToRules) && inView('#mode-g .pt-topic-card')],
  ];

  function tick() {
    if (run) { // окно закрыли или сменили раздел посреди главы — тихо завершаем
      if ((run.el && !visible(run.el)) || (!run.overModal && modalOpen())) end();
      return;
    }
    if (!appReady()) return;
    const isModal = modalOpen();
    if (isModal) { if (!modalSince) modalSince = Date.now(); } else modalSince = 0;
    if (!state.ch.welcome) {
      if (!isModal && Date.now() - bootAt > 600) start(['welcome']);
      return;
    }
    if (Date.now() - lastEnd < 1200) return; // небольшая пауза между подсказками
    if (isModal && Date.now() - modalSince < 500) return; // дать окну отрисоваться
    for (const [name, when] of TRIGGERS) {
      if (state.ch[name] || !when()) continue;
      if (start([name])) return;
    }
  }

  let bootAt = 0;
  const bootWatch = setInterval(() => { if (appReady() && !bootAt) { bootAt = Date.now(); clearInterval(bootWatch); } }, 300);
  setInterval(tick, 500);

  // ---------- кнопка «Как пользоваться»: первый экран + подсказки к текущему разделу ----------
  function manual() {
    const sec = { g: 'rules', w: 'words', s: 'settings' }[curMode()];
    start(sec ? ['welcome', sec] : ['welcome'], true);
  }
  window.EF_TOUR = {
    start: manual,
    reset() { state = { ch: {}, ids: {} }; save(); }, // для проверки: снова как новый пользователь
  };

  function addButton() {
    const h = document.querySelector('header.top');
    if (!h || h.querySelector('.tour-btn')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tour-btn'; b.title = 'Подсказки к этому экрану';
    b.innerHTML = '?<span class="tb-t"> Как пользоваться</span>';
    b.addEventListener('click', manual);
    h.appendChild(b);
  }
  addButton();
})();
