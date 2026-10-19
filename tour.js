// Обучение всплывающими окнами: запускается само при первом открытии сайта
// и по кнопке «Как пользоваться» в правом верхнем углу.
(function () {
  const KEY = 'ef_tour_v1';
  const STEPS = [
    { title: 'Привет!', text: 'Покажу за минуту, как тут всё устроено. Можно пропустить — запустить обучение снова можно кнопкой «Как пользоваться» в правом верхнем углу.' },
    { sel: '.modes.in-hub, .title-row .modes', title: 'Два режима',
      text: '<b>Правила</b> — грамматика по учебникам English File.<br><b>Лексика</b> — слова карточками с интервальным повторением.' },
    { sel: '.acc', title: 'Аккаунт и настройки',
      text: 'Здесь вход и выход, просмотр прогресса друзей и <b>Настройки</b>: оформление сайта, вид таблицы слов, размер шрифта.' },
    { sel: '.rpg-lvl', title: 'Твой уровень',
      text: 'Растёт за выученные слова и пройденные правила.' },

    { mode: 'w', sel: '.mode-w .rv-lvls', title: 'Какие уровни повторять',
      text: 'Включи нужные уровни — A1, A2, B1, B2. Кнопки ниже будут брать слова только из них.' },
    { mode: 'w', sel: '.mode-w .rvb-due', title: 'Повторить',
      text: 'Слова, которым подошёл срок повторения. Чем лучше помнишь слово, тем реже оно возвращается — это интервальное повторение. Начинай день отсюда.' },
    { mode: 'w', sel: '.mode-w .rvb-base', title: 'Новые слова',
      text: '<b>Базовые</b> — главные слова уровня. <b>Экстра</b> — дополнительные темы, они откроются, когда пройдёшь основные.' },
    { mode: 'w', sel: '.mode-w .node', title: 'Карточка темы',
      text: 'Нажми на тему — начнётся сессия карточек только по ней. Полоска показывает прогресс каждого слова, <b>Тест</b> — быстрая проверка темы.' },
    { mode: 'w', title: 'Как проходить карточки',
      text: 'Видишь русское слово — вспомни английское.<br>' +
        '• <b>Пробел</b> — показать ответ, потом оцени себя: <b>1</b> Забыл, <b>2</b> Трудно, <b>3</b> Хорошо, <b>4</b> Легко.<br>' +
        '• Уверен? Просто <b>начни печатать</b> — откроется «Я знаю». Верно — уровень 8 и проверка через 45 дней; ошибся — неверные буквы подсветятся.<br>' +
        '• <b>←</b> — вернуться к предыдущему слову.' },

    { mode: 'g', sel: '.mode-g .pt-topic-card', title: 'Тема грамматики',
      text: '<b>?</b> — объяснение правила, <b>Тест</b> — 10 вопросов, после него уровень темы растёт.<br>' +
        '<b>‹ ›</b> — поменять уровень вручную, <b>изучено</b> — отметь, когда разобрал тему.<br>' +
        '<b>GPT</b> и <b>YouTube</b> — разобрать тему с нейросетью или по видео.' },
    { mode: 'g', sel: '.mode-g .practice-panel', title: 'Отработка',
      text: '<b>Быстрый тест</b> — смесь вопросов по темам, отмеченным «изучено». <b>Изучать с AI</b> — готовый промт для нейросети.' },
    { sel: '#mode-g:not([hidden]) .jumpnav, #mode-w:not([hidden]) .jumpnav', title: 'Разделы и фильтры',
      text: 'Быстрый переход к разделу таблицы. <b>Фильтры</b> — показать только нужные темы или части речи.' },
    { sel: '#mode-g:not([hidden]) .tree-zoom, #mode-w:not([hidden]) .tree-zoom', title: 'Масштаб',
      text: 'Уменьши таблицу, чтобы увидеть всё дерево целиком. Ctrl + колёсико мыши тоже работает.' },
    { title: 'Готово!', text: 'Нажми <b>«Как пользоваться»</b> справа вверху, чтобы пройти обучение снова. Подробности по каждому блоку — в кнопках <b>?</b>.' },
  ];

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

  let i = 0, spot = null, pop = null, startMode = null, onMove = null;

  const visible = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && el.offsetParent !== null; };
  function find(sel) { return [...document.querySelectorAll(sel)].find(visible) || null; }
  function curMode() { const b = document.querySelector('.modes button[aria-pressed="true"]'); return b ? b.dataset.mode : null; }
  function setMode(m) {
    if (!m || curMode() === m) return;
    const b = document.querySelector('.modes button[data-mode="' + m + '"]');
    if (b) b.click();
  }

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
    let left = Math.min(Math.max(8, x + w / 2 - pw / 2), vw - pw - 8);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }

  function show() {
    const s = STEPS[i];
    if (s.mode) setMode(s.mode);
    setTimeout(() => {
      const el = s.sel ? find(s.sel) : null;
      if (s.sel && !el) { // элемента нет на этом экране (например, на телефоне) — пропускаем шаг
        if (dir > 0 && i < STEPS.length - 1) { i++; return show(); }
        if (dir < 0 && i > 0) { i--; return show(); }
      }
      pop.innerHTML = '<h3>' + s.title + '</h3><p>' + s.text + '</p><div class="tp-row">' +
        '<span class="tp-n">' + (i + 1) + ' / ' + STEPS.length + '</span>' +
        (i < STEPS.length - 1 ? '<button type="button" class="tp-skip" data-t="end">Пропустить</button>' : '') +
        (i > 0 ? '<button type="button" class="m-btn ghost" data-t="prev">Назад</button>' : '') +
        '<button type="button" class="m-btn" data-t="next">' + (i < STEPS.length - 1 ? 'Далее' : 'Понятно') + '</button></div>';
      if (el) el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
      requestAnimationFrame(() => { place(el); const f = pop.querySelector('[data-t="next"]'); if (f) f.focus({ preventScroll: true }); });
      onMove = () => place(el);
    }, s.mode ? 350 : 0);
  }
  let dir = 1;
  function go(d) { dir = d; i += d; if (i < 0) i = 0; if (i >= STEPS.length) return end(); show(); }
  function end() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    if (spot) spot.remove(); if (pop) pop.remove(); spot = pop = null; onMove = null;
    document.removeEventListener('keydown', onKey, true);
    if (startMode) setMode(startMode);
  }
  function onKey(ev) {
    if (!pop) return;
    if (ev.key === 'Escape') { end(); }
    else if (ev.key === 'ArrowRight' || ev.key === 'Enter') { go(1); }
    else if (ev.key === 'ArrowLeft') { go(-1); }
    else return;
    ev.preventDefault(); ev.stopPropagation();
  }
  function start() {
    if (pop) return;
    startMode = curMode();
    spot = document.createElement('div'); spot.className = 'tour-spot none';
    pop = document.createElement('div'); pop.className = 'tour-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Обучение');
    pop.addEventListener('click', ev => {
      const b = ev.target.closest('[data-t]'); if (!b) return;
      const t = b.dataset.t;
      if (t === 'next') go(1); else if (t === 'prev') go(-1); else end();
    });
    document.body.append(spot, pop);
    document.addEventListener('keydown', onKey, true);
    i = 0; dir = 1; show();
  }
  window.addEventListener('resize', () => onMove && onMove());
  window.addEventListener('scroll', () => onMove && onMove(), true);
  window.EF_TOUR = { start };

  // кнопка «Как пользоваться» в правом верхнем углу
  function addButton() {
    const h = document.querySelector('header.top');
    if (!h || h.querySelector('.tour-btn')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tour-btn'; b.title = 'Как пользоваться сайтом';
    b.innerHTML = '?<span class="tb-t"> Как пользоваться</span>';
    b.addEventListener('click', start);
    h.appendChild(b);
  }
  addButton();

  // первый запуск: ждём, пока сайт загрузится и закроется окно входа
  let seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) { seen = true; }
  if (!seen) {
    const t0 = Date.now();
    const timer = setInterval(() => {
      const de = document.documentElement, auth = document.getElementById('authBox');
      const ready = !de.classList.contains('booting') && !de.classList.contains('auth-wait') &&
        (!auth || auth.hidden) && document.querySelector('.modes button') && !document.querySelector('.modal-back:not([hidden])');
      if (ready) { clearInterval(timer); setTimeout(start, 600); }
      else if (Date.now() - t0 > 120000) clearInterval(timer);
    }, 500);
  }
})();
