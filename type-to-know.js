// Карточки слов: если на лицевой стороне начать печатать букву,
// сразу открывается «Я знаю», а набранная буква попадает в поле ввода.
document.addEventListener('keydown', ev => {
  if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.isComposing) return;
  if (!ev.key || ev.key.length !== 1 || !/[\p{L}']/u.test(ev.key)) return;
  const t = ev.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
  let inp = document.getElementById('knownIn');
  if (!inp || inp.offsetParent === null) {
    const b = document.querySelector('.fc-know[data-act="kopen"]:not([disabled])');
    if (!b || b.offsetParent === null) return;
    b.click();
    inp = document.getElementById('knownIn');
    if (!inp) return;
  }
  ev.preventDefault();
  ev.stopPropagation();
  inp.focus({ preventScroll: true });
  inp.value += ev.key;
  const n = inp.value.length;
  try { inp.setSelectionRange(n, n); } catch (e) {}
}, true);

// «Я знаю», неверный ответ: показываем, какие буквы ошибочны.
// Неверная буква — красная, над ней зелёная правильная; пропущенная — зелёная над красной «_»; лишняя — зачёркнута.
// Мало ошибок — сразу предлагаем оценку: 1 буква — «Легко», 2 — «Хорошо».
(function () {
  const st = document.createElement('style');
  st.textContent =
    '.kres b[data-diff]{color:inherit;white-space:pre;letter-spacing:.02em;display:inline-block;margin-top:1.15em;line-height:1.2}' +
    '.kd-col{position:relative;display:inline-block}' +
    '.kd-col>.kd-ins{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin-bottom:1px;line-height:1.1}' +
    '.kd-del{color:var(--accent-2,#ef4b72);text-decoration:line-through;text-decoration-thickness:2px}' +
    '.kd-gap{color:var(--accent-2,#ef4b72)}' +
    '.kd-ins{color:var(--st-mastered,#22d39c);background:color-mix(in srgb,var(--st-mastered,#22d39c) 18%,transparent);border-radius:2px;padding:0 1px}' +
    '.grade.kd-suggest{outline:2px dashed var(--st-mastered,#22d39c);outline-offset:3px}';
  document.head.appendChild(st);

  const low = s => s.toLowerCase().replace(/[’`ʼ]/g, "'");
  const strip = s => s.replace(/^(to|a|an|the)\s+/i, '');
  function alts(en) {
    const base = en.replace(/\(.*?\)/g, ' ');
    const out = [en, base].concat(base.split(/\s*[\/;,]\s*|\s+or\s+/))
      .map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
    out.slice().forEach(s => out.push(strip(s)));
    return [...new Set(out)];
  }
  function table(a, b) {
    const d = [];
    for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d;
  }
  function ops(t, r) {
    const a = low(t), b = low(r), d = table(a, b), out = [];
    let i = a.length, j = b.length;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
        out.push(a[i - 1] === b[j - 1] ? ['ok', t[i - 1]] : ['sub', t[i - 1], r[j - 1]]); i--; j--;
      } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { out.push(['del', t[i - 1]]); i--; }
      else { out.push(['ins', r[j - 1]]); j--; }
    }
    return out.reverse();
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sp = (c, s) => '<span class="' + c + '">' + esc(s === ' ' && c === 'kd-ins' ? '␣' : s) + '</span>';

  function mark(b) {
    b.dataset.diff = '1';
    const fc = b.closest('.fc'), back = fc && fc.querySelector('.back');
    const en = back && back.firstChild && back.firstChild.nodeType === 3 ? back.firstChild.nodeValue.trim() : '';
    // знаки препинания (точка в конце, запятые, ?!) не проверяются — убираем их из сравнения
    const clean = s => s.replace(/[.,!?;:…"«»]/g, '').replace(/\s+/g, ' ').trim();
    const typed = clean(b.textContent);
    if (!en || !typed) return;
    let best = null;
    alts(en).map(clean).filter(Boolean).forEach(r => [typed, strip(typed)].forEach(t => {
      const dist = table(low(t), low(r))[t.length][r.length];
      if (!best || dist < best.dist) best = { t, r, dist };
    }));
    if (!best || best.dist === 0) return;
    // много ошибок — значит, это другое слово, буквы не размечаем
    if (best.dist > Math.max(2, Math.ceil(best.r.length * 0.6))) return;
    // правильная буква — над неверной; пропущенная — над красной чертой; лишняя — просто зачёркнута
    const col = (wrong, right) => '<span class="kd-col">' + wrong + right + '</span>';
    b.innerHTML = ops(best.t, best.r).map(o =>
      o[0] === 'ok' ? esc(o[1]) :
      o[0] === 'sub' ? col(sp('kd-del', o[1]), sp('kd-ins', o[2])) :
      o[0] === 'del' ? sp('kd-del', o[1]) : col(sp('kd-gap', '_'), sp('kd-ins', o[1]))).join('');
    b.setAttribute('aria-label', 'ты написал ' + typed + ', правильно ' + best.r);
    // 1 неверная буква — предлагаем «Легко», 2 — «Хорошо» (кнопка в фокусе: Enter или пробел)
    const g = best.dist === 1 ? 'easy' : best.dist === 2 ? 'good' : '';
    const btn = g && fc.closest('.modal') && fc.closest('.modal').querySelector('.grade[data-g="' + g + '"]');
    if (btn) { btn.classList.add('kd-suggest'); btn.focus({ preventScroll: true }); }
  }
  function scan() { document.querySelectorAll('.kres.no b:not([data-diff])').forEach(mark); }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

// Мягкая проверка «Я знаю» — засчитываем ответы, которые тоже верны:
// 1) рус. во мн. числе, англ. в ед.: «фрукты» — fruits тоже правильно;
// 2) a/an/the: в этих выражениях подходит любой артикль (stay at a hotel = stay at the hotel);
// 3) на карточке написано «также …» / «амер. …» (stay in a hotel, apartment);
// 4) в русском есть подсказка в скобках («работать на (компанию)») — если дописал её перевод
//    после правильного ответа (work for company), это не ошибка.
(function () {
  const PLURAL_OK = {
    'fruit': 'fruits',
    'election': 'elections',
    'memoir': 'memoirs',
    'frost': 'frosts',
    'jungle': 'jungles',
    'reed bed': 'reed beds',
  };
  const ART_OK = new Set([
    'stay at a hotel', 'catch the bus', 'take a bus', 'go to the gym', 'go to the park', 'go to the beach',
    'see a doctor', 'see a dentist', 'ride a bike', 'ride a horse', 'play the guitar', 'cross the road',
    'book a table', 'rent a car', 'borrow a book', 'take a photo', 'leave a message', 'sign a contract',
    'take an exam', 'support a team', 'lose a match', 'score a goal', 'collect a parcel', 'iron a shirt',
    'get a message', 'get a job', 'make a cake', 'hold a meeting', 'have a meeting', 'chair a meeting',
    'track an order', 'take out a loan', 'meet a deadline', 'extend a deadline', 'drill a hole', 'share a flat',
    'commit a crime', 'accept an invitation', 'turn down an invitation', 'register with a gp', 'run a business',
    'miss a connection', 'set an alarm', 'work in a team', 'take to the vet', 'can i speak to the manager?',
  ]);
  // на карточке написано «также …» / «амер. …» — эти варианты тоже засчитываем
  const ALSO = {
    'pe-info|surname': ['last name'],
    'pe-info|phone number': ['mobile number'],
    'pe-info|email': ['email address'],
    'pe-countries|the usa': ['the us', 'america', 'the states'],
    'de-common|big': ['large'],
    'de-common|small': ['little'],
    'de-common|beautiful': ['pretty'],
    'de-common|easy': ['simple'],
    'de-common|difficult': ['hard'],
    'de-colours|grey': ['gray'],
    'de-colours|colour': ['color'],
    'de-feel|happy': ['glad'],
    'de-feel|sad': ['unhappy'],
    'de-feel|fine': ['ok', 'okay', 'all right'],
    'ti-numbers|a hundred': ['one hundred'],
    'ti-numbers|a thousand': ['one thousand'],
    'ti-months|autumn': ['fall'],
    'ti-clock|what time is it?': ["what's the time", 'what is the time'],
    'ti-clock|half past two': ['two thirty'],
    'ti-prep|at the weekend': ['on the weekend'],
    'da-routine|cook dinner': ['make dinner'],
    'da-routine|start': ['begin'],
    'da-routine|finish': ['end'],
    'da-phrases|take a photo': ['take a picture'],
    'ho-rooms|flat': ['apartment'],
    'ho-rooms|living room': ['lounge', 'sitting room'],
    'ho-rooms|garden': ['yard'],
    'ho-things|sofa': ['couch'],
    'ho-things|bath': ['bathtub'],
    'ho-things|cooker': ['stove'],
    'ho-things|wardrobe': ['closet'],
    'ho-prep|opposite': ['across from'],
    'ho-prep|near': ['close to'],
    'ho-prep|above': ['over'],
    'fo-drinks|dinner': ['supper'],
    'fo-cafe|bill': ['check'],
    'fo-cafe|take away': ['to go'],
    'to-places|shop': ['store'],
    "to-places|chemist's": ['pharmacy'],
    'to-places|cinema': ['movie theater', 'movie theatre'],
    'to-transport|taxi': ['cab'],
    'to-transport|plane': ['aeroplane', 'airplane'],
    'to-transport|underground': ['metro', 'subway', 'tube'],
    'to-directions|go straight on': ['go straight ahead'],
    'sh-clothes|trousers': ['pants'],
    'sh-clothes|jumper': ['sweater', 'pullover'],
    'sh-clothes|trainers': ['sneakers'],
    'wo-jobs|cook': ['chef'],
    'wo-jobs|lawyer': ['solicitor'],
    'wo-jobs|shop assistant': ['salesperson', 'sales clerk'],
    'wo-jobs|police officer': ['policeman', 'policewoman'],
    'wo-jobs|programmer': ['developer', 'software engineer'],
    'wo-work|company': ['firm'],
    'wo-work|colleague': ['coworker', 'co-worker'],
    'wo-work|lesson': ['class'],
    'wo-class|notebook': ['exercise book'],
    'fr-hobbies|play football': ['play soccer'],
    'fr-hobbies|go running': ['run'],
    'fr-hobbies|watch films': ['watch movies'],
    'fr-hobbies|go for a walk': ['walk', 'take a walk'],
    'fr-holiday|holiday': ['vacation'],
    'fr-holiday|stay at a hotel': ['stay in a hotel'],
    'fr-holiday|book': ['reserve'],
    'bo-health|a temperature': ['a fever'],
    'bo-health|see a doctor': ['go to the doctor'],
    'ba-social|nice to meet you.': ['pleased to meet you'],
    "ba-social|you're welcome.": ['no problem'],
    'ba-social|see you later.': ['see you soon'],
    'ba-linkers|a lot of': ['lots of'],
  };
  const norm = s => String(s).toLowerCase().replace(/[’`ʼ']/g, '').replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ').trim().replace(/^(to|a|an|the) /, '');
  const art = s => s.replace(/\b(a|an|the)\b/g, 'the');
  function alts(en) {
    const base = en.replace(/\(.*?\)/g, ' ');
    return [en, base].concat(base.split(/\s*[\/;,]\s*|\s+or\s+/)).map(norm).filter(Boolean);
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
        if (f[0] && f[1]) (map[f[1]] = map[f[1]] || []).push({ id: c[0], en: f[0], p: f[2] });
      });
    }))));
    return map;
  }
  function ok(typed, w, ru) {
    if (PLURAL_OK[w.en] && typed === PLURAL_OK[w.en]) return true;
    const also = /\([a-z]…\)/i.test(ru) ? [] : (ALSO[w.id + '|' + w.en.toLowerCase()] || []);
    const as = alts(w.en).concat(also.map(norm));
    if (as.includes(typed)) return true;
    if (ART_OK.has(w.en.toLowerCase()) && as.some(a => art(a) === art(typed))) return true;
    // подсказка в скобках (не «(s…)», не «(2 слова)», не «букв.»): разрешаем дописать до 3 слов
    const hint = (ru.match(/\(([^)]*)\)/) || [])[1];
    if (hint && !/[0-9…]|слов|букв/.test(hint) && w.p !== 'n' && w.p !== 'a') {
      for (const a of as) if (typed.startsWith(a + ' ') && typed.slice(a.length + 1).split(' ').length <= 3) return true;
    }
    return false;
  }
  document.addEventListener('submit', ev => {
    const form = ev.target;
    if (!form || !form.classList || !form.classList.contains('kbox')) return;
    const inp = form.querySelector('#knownIn');
    const front = document.querySelector('.fc .front');
    if (!inp || !front) return;
    const ru = front.textContent.trim(), typed = norm(inp.value);
    if (!typed) return;
    for (const w of byRu()[ru] || []) if (ok(typed, w, ru)) { inp.value = w.en; return; }
  }, true);
})();
