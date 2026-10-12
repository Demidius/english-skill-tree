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

// Единый блок на ПК: «я и мой прогресс» + повторение; на телефоне — полоса прогресса под блоком повторения.
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
      chips.forEach(ch => {
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
        const it = document.createElement('button'); it.type = 'button'; it.className = 'acc-it acc-set'; it.textContent = 'Настройки';
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
      hub.innerHTML = '<div class="hub-me"></div><div class="hub-work"></div>';
      hub.querySelector('.hub-me').appendChild(makeAcc());
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
    if (row.previousElementSibling !== panel) panel.after(row);
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
  function apply() {
    mobileNav(!MQ.matches);
    let ok = 0;
    MODES.forEach(id => { const m = document.getElementById(id); if (m && (MQ.matches ? build(m) : unbuild(m))) ok++; });
    document.body.classList.toggle('has-hub', MQ.matches && ok > 0);
    document.body.classList.toggle('has-navrow', !MQ.matches);
    refreshLabels(); splitStats();
    return ok;
  }
  if (apply() < MODES.length) {
    let n = 0;
    const t = setInterval(() => { if (apply() >= MODES.length || ++n > 40) clearInterval(t); }, 250);
  }
  MQ.addEventListener ? MQ.addEventListener('change', apply) : MQ.addListener(apply);
})();
