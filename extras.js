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
  function variants(s) { return SkillCore.contractionVariants(s); }
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
    const cands = form.dataset.wordEn ? [form.dataset.wordEn] : (byRu()[front.textContent.trim()] || []);
    const typed = variants(inp.value);
    for (const en of cands) {
      for (const a of alts(en)) {
        const av = variants(a);
        for (const v of typed) if (av.has(v)) { inp.value = a; return; }
      }
    }
  }, true);
})();

// Единый блок на ПК: «я и мой прогресс» + повторение; на телефоне — полоса прогресса над блоком повторения.
// Аккаунты — выпадающий список (там же «Настройки» и «Выйти»). Фильтры — по кнопке.
(function () {
  const MQ = window.matchMedia('(min-width: 1000px)');
  const MODES = ['mode-w', 'mode-g'];

  // ---- выпадающий список аккаунтов ----
  function accLabel() {
    const a = document.querySelector('#profList .pchip[data-active="1"]');
    if (a) return a.textContent.replace(/\s*\(я\)\s*$/, '');
    return 'Гость';
  }
  function makeAcc() {
    const w = document.createElement('div'); w.className = 'acc';
    w.innerHTML = '<button type="button" class="acc-btn" aria-haspopup="true" aria-expanded="false"><span class="acc-name"></span> <span class="acc-car">▾</span></button><div class="acc-menu" role="menu" hidden></div>';
    const btn = w.querySelector('.acc-btn'), menu = w.querySelector('.acc-menu');
    function fill() {
      menu.innerHTML = '';
      const chips = [...document.querySelectorAll('#profList .pchip')];
      let group='';
      chips.forEach(ch => {
        if(ch.dataset.group!==group){group=ch.dataset.group;const label=document.createElement('div');label.className='acc-group';label.textContent=({self:'Мой аккаунт',friend:'Друзья',public:'Открыт по ссылке'})[group]||'';menu.appendChild(label);}
        const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it'; it.setAttribute('role', 'menuitem');
        it.textContent = ch.textContent; if (ch.dataset.active === '1') it.classList.add('on');
        it.addEventListener('click', () => { close(); ch.click(); });
        menu.appendChild(it);
      });
      const lo = document.getElementById('logoutBtn');
      const sep = document.createElement('div'); sep.className = 'acc-sep';
      if (chips.length) menu.appendChild(sep);
      const sb = document.querySelector('.modes button[data-mode="s"]');
      if (sb) {
        const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it acc-set'; it.textContent = 'Аккаунт, друзья и настройки';
        if (sb.getAttribute('aria-pressed') === 'true') it.classList.add('on');
        it.addEventListener('click', () => { close(); sb.click(); }); menu.appendChild(it);
      }
      if (lo && !lo.hidden) {
        const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it acc-out'; it.textContent = 'Выйти';
        it.addEventListener('click', () => { close(); lo.click(); }); menu.appendChild(it);
      } else {
        const gl = document.getElementById('goLogin');
        const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it'; it.textContent = 'Войти / зарегистрироваться';
        it.addEventListener('click', () => { close(); if (gl) gl.click(); }); menu.appendChild(it);
      }
    }
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      if (menu.hidden) { fill(); menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); } else close();
    });
    document.addEventListener('click', ev => { if (!w.contains(ev.target)) close(); });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape') close(); });
    return w;
  }
  // в едином блоке — статистика по строкам вместо одной длинной
  function splitStats() {
    document.querySelectorAll('.hub .stats-row .num').forEach(n => {
      if (n.innerHTML.includes(' · ')) n.innerHTML = n.innerHTML.replace(/ · /g, '<br>');
    });
  }
  new MutationObserver(splitStats).observe(document.body, { childList: true, subtree: true, characterData: true });
  function refreshLabels() { document.querySelectorAll('.acc-name').forEach(n => n.textContent = accLabel()); }
  const pl = document.getElementById('profList');
  if (pl) new MutationObserver(refreshLabels).observe(pl, { childList: true, subtree: true, attributes: true });

  // ---- раскладка ----
  function parts(m) {
    return { row: m.querySelector('.stats-row'), panel: m.querySelector('.review-panel'), hub: m.querySelector('.hub') };
  }
  function build(m) {
    const { row, panel } = parts(m); let { hub } = parts(m);
    if (!row || !panel) return false;
    if (!hub) {
      hub = document.createElement('section'); hub.className = 'hub';
      hub.innerHTML = '<div class="hub-nav"></div><div class="hub-me"></div><div class="hub-work"></div>';
      hub.querySelector('.hub-nav').appendChild(makeAcc());
      panel.before(hub);
    }
    if (row.parentNode !== hub.querySelector('.hub-me')) hub.querySelector('.hub-me').appendChild(row);
    if (panel.parentNode !== hub.querySelector('.hub-work')) hub.querySelector('.hub-work').appendChild(panel);
    hub.hidden = false;
    return true;
  }
  function unbuild(m) {
    const { row, panel, hub } = parts(m);
    if (!row || !panel) return false;
    if (hub) { hub.before(panel); hub.hidden = true; }
    if (row.nextElementSibling !== panel) panel.before(row);
    return true;
  }
  // ---- телефон: аккаунт в одной строке с переключателем режимов ----
  function mobileNav(on) {
    const tr = document.querySelector('.title-row');
    const md = document.querySelector('.modes'); if (!tr || !md) return;
    let nav = document.querySelector('.navrow');
    if (on) {
      if (!nav) {
        nav = document.createElement('div'); nav.className = 'navrow';
        nav.appendChild(makeAcc());
        const sep = document.createElement('span'); sep.className = 'navsep'; nav.appendChild(sep);
        md.before(nav);
      }
      if (md.parentNode !== nav) nav.appendChild(md);
      nav.hidden = false;
    } else if (nav) {
      nav.before(md); nav.hidden = true;
    }
  }
  // ---- ПК: переключатель «Правила / Лексика» — внутри единого блока, слева под аккаунтом ----
  function placeModes(force) {
    const md = document.querySelector('.modes'), tr = document.querySelector('.title-row');
    if (!md || !tr) return;
    if (!MQ.matches) return;
    const on = md.querySelector('button[aria-pressed="true"]');
    const k = typeof force === 'string' ? force : (on ? on.dataset.mode : '');
    const slot = (k === 'w' || k === 'g') ? document.querySelector('#mode-' + k + ' .hub .hub-nav') : null;
    if (slot) { if (md.parentNode !== slot) slot.appendChild(md); md.classList.add('in-hub'); }
    else {
      if (md.parentNode !== tr) { const h1 = tr.querySelector('h1'); if (h1) h1.after(md); else tr.prepend(md); }
      md.classList.remove('in-hub');
    }
  }
  // Любой переход, включая ссылки из карточек, переносит навигацию в активный режим.
  window.addEventListener('ef-mode-change', () => placeModes());
  function apply() {
    mobileNav(!MQ.matches);
    let ok = 0;
    MODES.forEach(id => { const m = document.getElementById(id); if (m && (MQ.matches ? build(m) : unbuild(m))) ok++; });
    document.body.classList.toggle('has-hub', MQ.matches && ok > 0);
    document.body.classList.toggle('has-navrow', !MQ.matches);
    refreshLabels(); splitStats(); placeModes();
    return ok;
  }
  // «шторка» при загрузке: убираем, когда раскладка готова (или показан экран входа)
  function bootDone() {
    const de = document.documentElement;
    if (!de.classList.contains('booting')) return;
    requestAnimationFrame(() => requestAnimationFrame(() => de.classList.remove('booting')));
  }
  const authOpen = () => { const a = document.getElementById('authBox'); return a && !a.hidden; };
  setTimeout(bootDone, 4000);
  if (apply() < MODES.length) {
    let n = 0;
    const t = setInterval(() => {
      const done = apply() >= MODES.length;
      if (done || authOpen()) bootDone();
      if (done || ++n > 40) clearInterval(t);
    }, 100);
  } else bootDone();
  MQ.addEventListener ? MQ.addEventListener('change', apply) : MQ.addListener(apply);
})();

// Заголовки блоков с кнопкой (i): «Интервальное повторение слов» (Лексика) и «Отработка изученных правил» (Правила)
(function () {
  const INFO_W =
    '<p><b>Что это.</b> Слово показывается не каждый день подряд, а через растущие промежутки — примерно тогда, когда ты начинаешь его забывать. ' +
    'Оценка после ответа задаёт следующий срок: «Забыл» — уровень слова снижается на 3 и срок становится ближе (новое слово вернётся через несколько минут), «Трудно» — скоро, «Хорошо» и «Легко» — всё дальше и дальше. ' +
    'Хорошо выученные слова приходят редко, трудные — часто, и время уходит на то, что действительно нужно. ' +
    'Кнопки A1–B2 выбирают уровни, с которыми работают «Повторить» и «Изучать».</p>' +
    '<p><b>Почему это работает.</b></p><ul>' +
    '<li><b>Кривая забывания.</b> Герман Эббингауз (1885) показал: новое забывается быстро, особенно в первые часы и дни, а каждое повторение делает забывание медленнее. Поэтому следующий интервал можно делать длиннее.</li>' +
    '<li><b>Эффект распределённых повторений.</b> Одно и то же время занятий, разнесённое по дням, даёт заметно лучшее долгосрочное запоминание, чем зубрёжка за один раз. Это один из самых надёжно подтверждённых результатов психологии памяти (большой обзор — Cepeda и коллеги, 2006).</li>' +
    '<li><b>Эффект тестирования.</b> Попытка вспомнить ответ укрепляет память сильнее, чем повторное чтение (Roediger и Karpicke, 2006). Поэтому карточка сначала показывает русское слово — ты вспоминаешь английское и только потом открываешь ответ.</li>' +
    '<li><b>«Желательная трудность».</b> По Роберту Бьорку, вспоминать с небольшим усилием, когда слово уже чуть подзабылось, полезнее, чем когда оно и так перед глазами. Растущие интервалы как раз держат эту трудность.</li>' +
    '</ul>' +
    '<p><b>Откуда метод.</b> Карточки по «коробкам» придумал Себастьян Лейтнер (1970-е), компьютерный алгоритм SM-2 — Пётр Возняк (SuperMemo, 1987). На SM-2 основан Anki; здесь работает тот же принцип.</p>' +
    '<p><b>Как заниматься.</b> Понемногу, но каждый день: сначала «Повторить», потом новые слова. Оценивай честно — «Забыл» не провал, а сигнал показать слово пораньше.</p>';
  const INFO_G =
    '<p><b>Кнопки.</b> «Быстрый тест» запускает тренировку на сайте. «Изучать с AI» открывает промты для объяснений и заданий в нейросети. Число в заголовке — сколько отмеченных тем с уровнем ниже 10 доступно для быстрого теста.</p>' +
    '<p><b>Быстрый тест.</b> Короткая тренировка по всем правилам, которые ты отметил галочкой «изучено» и которые ещё не дошли до уровня 10. ' +
    'Сессия — 20 вопросов вперемешку из разных правил; название правила показывается только после ответа. ' +
    'Каждый верный ответ сразу поднимает уровень своего правила (по умолчанию +1, меняется в «Настройках»). Ошибка уровень не снижает. ' +
    'С уровня 7 правило растёт по шагам: 3 верных ответа подряд — следующий уровень, ошибка обнуляет шаги. Шаги сохраняются между тестами и занятиями с AI. ' +
    'Правило на уровне 10 из отработки выпадает.</p>' +
    '<div class="pr-help-ai"><p><b>Изучать с AI.</b> Объяснения и практика в нейросети по выбранным темам. Можно заниматься как изученными, так и новыми темами.</p><ol>' +
    '<li>Выбери задание: <b>перевод текста RU → EN</b>, <b>по одному предложению RU → EN или EN → RU</b>, <b>найди ошибки</b> или <b>диалог</b>. По умолчанию выбраны слабые темы из отмеченных «изучено»; список можно изменить или переключиться на «Все правила».</li>' +
    '<li>В «Переводе текста» нажми <b>«Настроить длину»</b> справа, чтобы раскрыть ползунок: от очень короткого текста (2–3 предложения) до очень длинного (30–40). Повторное нажатие скрывает настройку. По умолчанию — средний, 8–12 предложений. Короткий текст может охватить не все выбранные темы; неотработанные темы не меняют уровень.</li>' +
    '<li>В шаге <b>«Начни занятие»</b> нажми кнопку GPT, Claude, Gemini или Qwen — задание уже подготовлено. Для GPT, Claude и Qwen запрос передаётся в ссылке. Если поле пустое, вставь скопированный промт. В Gemini вставка нужна вручную. На телефоне можно открыть установленное приложение или передать промт через меню приложений. Ручной просмотр и копирование находятся в свёрнутом блоке под кнопками.</li>' +
    '<li>Выполни задание в чате. В режиме «По предложению» нейросеть даёт одно предложение, ждёт перевод, исправляет ошибки или подтверждает верный ответ и сразу даёт следующее. Напиши <b>«хватит»</b>, чтобы закончить: только тогда появятся общие итоги и код по отработанным темам.</li>' +
    '<li>После практики скопируй из ответа код <code>EFST1|…</code> и нажми <b>«Внести результаты занятия»</b> (или открой вкладку «Ввести код»). Проверь предлагаемые изменения и примени их — тогда обновятся уровни тем на сайте. Уровень только растёт: хотя бы 1 верное применение — +1, от 3 верных и точность от 75% — +2, от 5 верных без ошибок — +3. С уровня 7 каждое верное применение — шаг, 3 шага подряд дают следующий уровень, ошибка по правилу обнуляет шаги. Само открытие чата уровни не меняет.</li>' +
    '</ol><p>Для <b>объяснения отдельной темы</b> нажми <b>GPT</b> на её карточке. Там можно получить разбор и примеры без кода и без изменения уровней.</p></div>' +
    '<p><b>Почему это работает.</b></p><ul>' +
    '<li><b>Эффект тестирования.</b> Вспоминать и применять правило полезнее, чем перечитывать его объяснение: каждая попытка вспомнить укрепляет память (Roediger и Karpicke, 2006). Поэтому сначала разбираешь правило, а потом отвечаешь на вопросы.</li>' +
    '<li><b>Перемешивание (interleaving).</b> Когда задания разных типов идут вперемешку, приходится каждый раз решать, какое правило здесь нужно, — именно этот навык нужен в живой речи. В исследованиях перемешанная тренировка давала заметно лучший результат на отложенной проверке, чем решение задач блоками по одному типу (Rohrer и Taylor, 2007; Kornell и Bjork, 2008).</li>' +
    '<li><b>Распределённые повторения.</b> Отработка, растянутая на несколько дней, запоминается прочнее, чем один длинный подход (обзор — Cepeda и коллеги, 2006). Лучше 20 вопросов каждый день, чем 100 раз в неделю.</li>' +
    '<li><b>Обратная связь.</b> Ты сразу видишь правильный ответ и правило, к которому относился вопрос, — так ошибка исправляется до того, как закрепится.</li>' +
    '</ul>' +
    '<p><b>Как заниматься.</b> Разбери тему самостоятельно или через «Изучать с AI», отметь «изучено» и закрепи её в «Быстром тесте». Для практики перевода и диалогов возвращайся к AI; код с результатами применяй на сайте.</p>';
  const PANELS = [
    { sel: '.review-panel:not(.practice-panel) .rv-head', title: 'Интервальное повторение слов', info: INFO_W, label: 'Что такое интервальное повторение', hideSub: true },
    { sel: '.practice-panel .rv-head', keepTitle: true, info: INFO_G, label: 'Как работает отработка правил', hideSub: 'static' },
  ];
  const open = {};
  function enhance() {
    PANELS.forEach((P, i) => {
      document.querySelectorAll(P.sel).forEach(h => {
        if (h.dataset.enh) return;
        h.dataset.enh = '1';
        const t = h.querySelector('.rv-title'); if (!t) return;
        const wrap = document.createElement('div'); wrap.className = 'rv-titlebar';
        t.before(wrap); wrap.appendChild(t);
        if (!P.keepTitle) t.textContent = P.title;
        h.querySelectorAll('.rv-sub').forEach(s => {
          // статичную инструкцию прячем, строку со счётчиками (изучено N правил…) оставляем
          if (P.hideSub === true || (P.hideSub === 'static' && /^Отметь/.test(s.textContent.trim()))) s.hidden = true;
        });
        const b = document.createElement('button'); b.type = 'button'; b.className = 'rv-info'; b.textContent = 'i';
        b.setAttribute('aria-label', P.label); b.setAttribute('aria-expanded', open[i] ? 'true' : 'false');
        wrap.appendChild(b);
        const box = document.createElement('div'); box.className = 'rv-infobox'; box.innerHTML = P.info; box.hidden = !open[i];
        h.appendChild(box);
        b.addEventListener('click', () => {
          open[i] = !open[i]; box.hidden = !open[i]; b.setAttribute('aria-expanded', open[i] ? 'true' : 'false');
        });
      });
    });
  }
  enhance();
  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
})();

// Кнопка «Фильтры» — первой слева в полосе с темами; сами фильтры раскрываются под полосой
(function () {
  function place() {
    document.querySelectorAll('.mode').forEach(m => {
      const ft = m.querySelector('.filters-toggle'), jn = m.querySelector('.jumpnav'), ct = m.querySelector('.controls');
      if (!ft || !jn) return;
      if (jn.firstElementChild !== ft) jn.prepend(ft);
      if (ct && ct.previousElementSibling !== jn) jn.after(ct);
    });
  }
  place();
  new MutationObserver(place).observe(document.body, { childList: true, subtree: true });
})();

// «читано / читанное» → «изучено / изученное» во всём интерфейсе
(function () {
  const RE = /(?<![А-Яа-яЁё])([Чч])итан(о|ное|ного|ных|ным|ными)(?![А-Яа-яЁё])/g;
  const END = { 'о': 'о', 'ное': 'ное', 'ного': 'ного', 'ных': 'ных', 'ным': 'ным', 'ными': 'ными' };
  const fix = s => s.replace(RE, (m, c, e) => (c === 'Ч' ? 'Изучен' : 'изучен') + END[e]).replace(/уже читал\(а\)/g, 'уже изучил(а)');
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { const v = fix(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|INPUT|TEXTAREA)$/.test(root.tagName)) return;
    ['title', 'aria-label'].forEach(a => { const v = root.getAttribute && root.getAttribute(a); if (v) { const f = fix(v); if (f !== v) root.setAttribute(a, f); } });
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) { const v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
      else ['title', 'aria-label'].forEach(a => { const v = n.getAttribute(a); if (v) { const f = fix(v); if (f !== v) n.setAttribute(a, f); } });
    }
  }
  walk(document.body);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'characterData') walk(m.target);
    else m.addedNodes.forEach(walk);
  })).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

// Полосы прогресса: отрезки по уровням A1/A2/B1/B2 и заливка тремя цветами (изучаю 1–4 · повторяю 5–9 · выучено 10).
// «Лексика» — по словам, «Правила» — по правилам.
(function () {
  const LV = ['A1', 'A2', 'B1', 'B2'];
  const cache = {};
  function counts(kind) {
    if (cache[kind]) return cache[kind];
    const cnt = { A1: 0, A2: 0, B1: 0, B2: 0 };
    if (kind === 'w' && typeof W_BRANCHES !== 'undefined') W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(p => Object.entries(b[p] || {}).forEach(([lv, cs]) => cs.forEach(c => {
      if (c && typeof c[3] === 'string' && lv in cnt) cnt[lv] += c[3].split(';').filter(x => x.trim()).length;
    }))));
    if (kind === 'g' && typeof G_BRANCHES !== 'undefined') G_BRANCHES.forEach(b => Object.entries(b.cells || {}).forEach(([lv, cs]) => { if (lv in cnt) cnt[lv] += cs.length; }));
    const tot = LV.reduce((s, l) => s + cnt[l], 0) || 1;
    let acc = 0;
    return (cache[kind] = LV.map(l => { const from = acc / tot; acc += cnt[l]; return { l, n: cnt[l], from, to: acc / tot, cum: acc }; }));
  }
  function ticks(row, kind) {
    const bar = row.querySelector('.bar'); if (!bar) return;
    let t = row.querySelector('.bar-ticks');
    if (t && t.dataset.kind === kind && t.previousElementSibling === bar) return;
    if (t) t.remove();
    t = document.createElement('div'); t.className = 'bar-ticks'; t.dataset.kind = kind;
    const unit = kind === 'w' ? 'слов' : 'правил';
    let h = '';
    counts(kind).forEach((m, i, a) => {
      if (i < a.length - 1) h += '<i class="tk tk-major" style="left:' + (m.to * 100) + '%" title="' + m.cum + ' ' + unit + ' — весь ' + m.l + '"></i>';
      h += '<span class="tl" style="left:' + ((m.from + m.to) / 2 * 100) + '%">' + m.l + ' <em>' + m.n + '</em></span>';
    });
    t.innerHTML = h;
    bar.after(t);
  }
  // заливка полосы «Правил» по уровням правил (как в «Лексике»)
  function fillRules(row) {
    const bar = row.querySelector('.bar'); if (!bar) return;
    const chips = document.querySelectorAll('#mode-g .node[data-id] .status-chip .sn');
    if (!chips.length) return;
    let lrn = 0, rev = 0, done = 0;
    chips.forEach(c => { const v = parseInt(c.textContent, 10) || 0; if (v >= 10) done++; else if (v >= 5) rev++; else if (v >= 1) lrn++; });
    const t = chips.length;
    const h = '<span style="width:' + (done / t * 100) + '%;background:var(--st-mastered)"></span>' +
      '<span style="width:' + (rev / t * 100) + '%;background:var(--st-review)"></span>' +
      '<span style="width:' + (lrn / t * 100) + '%;background:var(--st-learn)"></span>';
    if (bar.dataset.sig !== h || bar.innerHTML.indexOf('st-review') < 0) { bar.dataset.sig = h; bar.innerHTML = h; }
    bar.title = 'выучено (10): ' + done + ' · повторяю (5–9): ' + rev + ' · изучаю (1–4): ' + lrn + ' из ' + t;
  }
  let busy = false;
  function run() {
    if (busy) return; busy = true;
    try {
      const w = document.querySelector('#mode-w .stats-row'); if (w) ticks(w, 'w');
      const g = document.querySelector('#mode-g .stats-row'); if (g) { ticks(g, 'g'); fillRules(g); }
    } finally { busy = false; }
  }
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

// Блок «Интервальное повторение слов»: счётчики — сразу кнопки.
// Слева «Повторить» (сколько к повторению / сколько слов на выбранных уровнях в повторении — уровни 1–7, без нетронутых слов уровня 0), справа две половинки: «Изучать базовые» и «Изучать экстра».
(function () {
  function num(el) { return el ? parseInt(el.textContent.replace(/\D+/g, ''), 10) || 0 : 0; }
  function build(panel) {
    const st = panel.querySelector('.rv-stats'), acts = panel.querySelector('.rv-acts');
    const old = panel.querySelector('.rv-big');
    if (!acts) { if (old) old.remove(); return; }
    // ни один уровень не выбран: счётчиков нет, но кнопки остаются на месте (с нулями и неактивные),
    // чтобы блок не менял размер
    const none = !st;
    const hint = panel.querySelector('.rv-none'); if (hint && !hint.hidden) hint.hidden = true;
    const tiles = none ? [] : st.querySelectorAll(':scope > div');
    if (!none && tiles.length < 4) return;
    const at = i => none ? 0 : num(tiles[i].querySelector('b'));
    const due = at(0), nb = at(1), nx = at(2);
    const left = at(3); // слов на выбранных уровнях в повторении: уровень знания 1–7
    const sig = [due, nb, nx, left, none ? 'none' : ''].join('|');
    if (old && old.dataset.sig === sig) return;
    if (old) old.remove();
    const btn = k => acts.querySelector('[data-kind="' + k + '"]');
    const dis = k => { const b = btn(k); return !b || b.disabled; };
    const box = document.createElement('div'); box.className = 'rv-big'; box.dataset.sig = sig;
    box.innerHTML =
      '<button type="button" class="rvb rvb-due" data-k="due"' + (dis('due') ? ' disabled' : '') + '>' +
        '<span class="rvb-n">' + due + '<small> / ' + left + '</small></span>' +
        '<span class="rvb-l">Повторить</span></button>' +
      '<div class="rvb-col">' +
        '<button type="button" class="rvb rvb-base" data-k="base"' + (dis('base') ? ' disabled' : '') + '>' +
          '<span class="rvb-l">изучать<br>базовые</span><span class="rvb-n">' + nb + '</span></button>' +
        '<button type="button" class="rvb rvb-extra" data-k="extra"' + (dis('extra') ? ' disabled' : '') + '>' +
          '<span class="rvb-l">изучать<br>экстра</span><span class="rvb-n">' + nx + '</span></button>' +
      '</div>';
    box.querySelector('.rvb-due').title = none ? 'Выбери хотя бы один уровень: A1, A2, B1 или B2' : due + ' к повторению · слов в повторении (уровни 1–7): ' + left;
    box.addEventListener('click', ev => {
      const b = ev.target.closest('.rvb'); if (!b || b.disabled) return;
      const o = btn(b.dataset.k); if (o && !o.disabled) o.click();
    });
    acts.before(box);
  }
  function run() { document.querySelectorAll('.review-panel:not(.practice-panel)').forEach(build); }
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
