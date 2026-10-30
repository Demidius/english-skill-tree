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
// Опечатка — правильная буква над неверной; слово целиком другое — правильное слово над ним;
// пропущенное — зелёное над красной чертой; лишнее — зачёркнуто.
// Мало ошибок внутри слова — сразу предлагаем оценку: 1 опечатка — «Отлично», 2 — «Хорошо».
// Пропущенное/лишнее целое слово, неправильное слово или сильно отличающийся ответ — без подсказки.
(function () {
  const st = document.createElement('style');
  st.textContent =
    '.kres b[data-diff]{color:inherit;white-space:pre-wrap;letter-spacing:.02em;line-height:1.25;display:inline-block;max-width:100%;margin-top:1.2em}' +
    // столбик: снизу то, что написал (красное), над ним правильное (зелёное); ширина — по самому широкому
    '.kd-col{position:relative;display:inline-block;text-align:center;white-space:pre}' +
    '.kd-col>.kd-w{display:block;height:0;overflow:hidden;visibility:hidden;padding:0 1px}' +
    '.kd-col>.kd-ins{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);white-space:pre;line-height:1.15;margin-bottom:1px}' +
    '.kd-del{color:var(--accent-2,#ef4b72);text-decoration:line-through;text-decoration-thickness:2px}' +
    '.kd-gap{display:inline-block;width:100%;min-width:.6em;border-bottom:2px solid var(--accent-2,#ef4b72);box-sizing:border-box}' +
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
    // дефис = пробел (forty-four и forty four засчитываются одинаково), поэтому сравниваем по словам без дефисов
    const clean = s => s.replace(/[.,!?;:…"«»]/g, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const typed = clean(b.textContent);
    if (!en || !typed) return;
    let best = null;
    // Compare expanded contractions too, so where's / where is is not highlighted as an error.
    const variants = s => typeof SkillCore === 'undefined' ? [s] : [s, ...SkillCore.contractionVariants(s)];
    alts(en).flatMap(variants).map(clean).filter(Boolean).forEach(r => [typed, strip(typed)].flatMap(variants).forEach(t => {
      const dist = table(low(t), low(r))[t.length][r.length];
      if (!best || dist < best.dist) best = { t, r, dist };
    }));
    if (!best || best.dist === 0) return;
    // много ошибок — значит, это другое слово, буквы не размечаем
    if (best.dist > Math.max(2, Math.ceil(best.r.length * 0.6))) return;
    // сравнение по словам: слово целиком другое — показываем правильное слово над ним;
    // в слове 1–2 опечатки — правим по буквам (правильная буква над неверной)
    const col = (bottom, word) => '<span class="kd-col"><span class="kd-w">' + esc(word) + '</span>' + bottom + sp('kd-ins', word) + '</span>';
    const gap = '<span class="kd-gap">\u200b</span>';
    const letters = (t, r) => ops(t, r).map(o =>
      o[0] === 'ok' ? esc(o[1]) :
      o[0] === 'sub' ? col(sp('kd-del', o[1]), o[2]) :
      o[0] === 'del' ? sp('kd-del', o[1]) : col(gap, o[1])).join('');
    const tw = best.t.split(' '), rw = best.r.split(' ');
    const wd = (x, y) => table(low(x), low(y))[x.length][y.length];
    const subCost = (x, y) => { const d = wd(x, y); return d === 0 ? 0 : d / Math.max(x.length, y.length); };
    const D = [];
    for (let i = 0; i <= tw.length; i++) { D[i] = [i]; }
    for (let j = 0; j <= rw.length; j++) D[0][j] = j;
    for (let i = 1; i <= tw.length; i++) for (let j = 1; j <= rw.length; j++)
      D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + subCost(tw[i - 1], rw[j - 1]));
    const seq = []; let i = tw.length, j = rw.length;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && Math.abs(D[i][j] - (D[i - 1][j - 1] + subCost(tw[i - 1], rw[j - 1]))) < 1e-9) { seq.push(['w', tw[i - 1], rw[j - 1]]); i--; j--; }
      else if (i > 0 && Math.abs(D[i][j] - (D[i - 1][j] + 1)) < 1e-9) { seq.push(['del', tw[i - 1]]); i--; }
      else { seq.push(['ins', rw[j - 1]]); j--; }
    }
    const aligned = seq.reverse();
    b.innerHTML = aligned.map(o => {
      if (o[0] === 'del') return sp('kd-del', o[1]);
      if (o[0] === 'ins') return col(gap, o[1]);
      const d = wd(o[1], o[2]);
      if (d === 0) return esc(o[1]);
      if (d <= Math.max(1, Math.floor(Math.max(o[1].length, o[2].length) / 3))) return letters(o[1], o[2]);
      return col(sp('kd-del', o[1]), o[2]);
    }).join(' ');
    b.setAttribute('aria-label', 'ты написал ' + typed + ', правильно ' + best.r);

    // Подсказка только для небольших опечаток ВНУТРИ слова.
    // Вставка/удаление целого слова (например, пропущенное "a") и замена слова целиком
    // не должны подталкивать к конкретной оценке.
    const onlySmallTyposInsideWords = aligned.every(o => {
      if (o[0] !== 'w') return false; // целое слово добавлено или пропущено
      const d = wd(o[1], o[2]);
      if (d === 0) return true;
      const maxLen = Math.max(o[1].length, o[2].length);
      return d <= Math.max(1, Math.floor(maxLen / 3));
    });
    // 1 небольшая опечатка -> «Отлично» (+2), 2 -> «Хорошо» (+1).
    const g = onlySmallTyposInsideWords && best.dist === 1 ? 'easy'
      : onlySmallTyposInsideWords && best.dist === 2 ? 'good' : '';
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
// 5) шаблон «What does ... mean?» — засчитываем корректно подставленное слово/фразу:
//    What does it mean? / What does this mean? / What does "busy" mean?
// 6) в карточках ёмкостей/количеств с конечным of можно ответить и без of:
//    a box of -> box / a box; a bottle of -> bottle / a bottle.
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
    'da-phrases|take a bus': ['go by bus'],
    'fr-holiday|book': ['reserve'],
    'bo-health|a temperature': ['a fever'],
    'bo-health|see a doctor': ['go to the doctor'],
    'ba-social|nice to meet you.': ['pleased to meet you'],
    "ba-social|you're welcome.": ['no problem', 'not at all', "don't mention it"],
    'ba-social|see you later.': ['see you soon', 'see you', 'see ya'],
    // короткие и разговорные формы — тоже правильные
    'ba-social|goodbye': ['bye', 'bye bye', 'good bye', 'bye-bye'],
    'ba-social|thank you': ['thanks', 'thank you very much', 'thanks a lot'],
    'ba-social|good morning': ['morning'],
    "ba-social|i'm fine, thanks.": ["i'm fine, thank you", 'fine, thanks', 'fine, thank you', "i'm good, thanks"],
    'ba-social|sorry': ["i'm sorry"],
    'ba-phrases|wait a minute.': ['wait a moment', 'wait a second', 'just a minute'],
    'ba-phrases|here you go.': ['here you are'],
    'ba-phrases|have a nice day!': ['have a good day'],
    'ba-phrases|well done!': ['good job'],
    'ba-phrases|never mind.': ['nevermind'],
    'da2-havetake|take care': ['take care of yourself'],
    'ba-linkers|a lot of': ['lots of'],
    'ti2-expr|until': ['till'],
  };
  // Use the same contraction expansion as the shared checker before removing apostrophes.
  const norm = s => {
    const expanded = typeof SkillCore === 'undefined' ? s : [...SkillCore.contractionVariants(s)][0];
    return String(expanded).toLowerCase().replace(/[’`ʼ']/g, '').replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ').trim().replace(/^(to|a|an|the) /, '');
  };
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
    const textbook=typeof WORD_ENTRY_METADATA==='undefined'?null:WORD_ENTRY_METADATA[w.id+'|'+w.k];
    if(textbook&&[textbook.english,...textbook.variants].some(en=>norm(en)===typed)) return true;
    const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const sources = typeof WORD_PROGRESS_ALIASES === 'undefined' ? [] : (WORD_PROGRESS_ALIASES[w.id + '|' + slug(w.en)] || []);
    const legacyKeys = new Set(sources.map(([id,k]) => id + '|' + k));
    const legacyAnswers = Object.entries(ALSO).filter(([key]) => {
      const i=key.indexOf('|'); return legacyKeys.has(key.slice(0,i)+'|'+slug(key.slice(i+1)));
    }).flatMap(([,answers]) => answers);
    if (PLURAL_OK[w.en] && typed === PLURAL_OK[w.en]) return true;
    // В карточке многоточие — это место для подстановки слова/фразы, а не буквальная часть ответа.
    // Нормализация уже убрала кавычки и знаки препинания, поэтому проверяем саму структуру вопроса.
    if (/^what does\s+(?:\.{3}|…)\s+mean\??$/i.test(w.en.trim()) && /^what does .+ mean$/.test(typed)) return true;
    // Для ёмкостей и количеств конечное "of" нужно только перед содержимым:
    // "a box of chocolates", но если спрашивается просто "коробка", принимаем "box" / "a box".
    if ((w.id === 'fo-drinks' || w.id === 'fo2-containers' || sources.some(([id]) => id==='fo-drinks'||id==='fo2-containers'))) {
      const base = norm(w.en).replace(/\s+of$/, '');
      if (base !== norm(w.en) && typed === base) return true;
    }
    const answerKey = w.id + '|' + w.en.toLowerCase();
    const phraseAnswers = typeof A1_PHRASE_ANSWERS !== 'undefined' ? (A1_PHRASE_ANSWERS[answerKey] || []) : [];
    const also = /\([a-z]…\)/i.test(ru) ? [] : (ALSO[answerKey] || []).concat(phraseAnswers,legacyAnswers);
    const as = alts(w.en).concat(also.map(norm));
    if (as.includes(typed)) return true;
    if (ART_OK.has(w.en.toLowerCase()) && as.some(a => SkillCore.articleEquivalent(a,typed))) return true;
    if ((answerKey === 'wo-work|work for'||legacyKeys.has('wo-work|work-for')) && /^work for (?:(?:a|the) )?company$/.test(typed)) return true;
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
    const active = form.dataset.wordEn ? [{id:form.dataset.wordId,k:form.dataset.wordKey,en:form.dataset.wordEn,p:form.dataset.wordPos}] : (byRu()[ru] || []);
    for (const w of active) if (ok(typed, w, ru)) { inp.value = w.en; return; }
    // 7) Написал другое слово из словаря с тем же русским значением (before вместо until —
    //    оба «до»): не засчитываем как ошибку, а подсказываем, что загадано другое слово,
    //    и показываем перевод написанного, чтобы была видна разница. Повтор того же ответа — уже ошибка.
    const other = sameMeaning(typed, ru);
    if (!other || form.dataset.hinted === typed) return;
    form.dataset.hinted = typed;
    ev.preventDefault();
    ev.stopPropagation();
    let box = form.querySelector('.kbox-hint');
    if (!box) {
      box = document.createElement('div');
      box.className = 'kbox-hint';
      box.setAttribute('role', 'status');
      const row = form.querySelector('.kbox-row');
      (row || inp).insertAdjacentElement('afterend', box);
    }
    box.innerHTML = '';
    const b = document.createElement('b'); b.textContent = other.en;
    box.append(b, ' — это «' + other.ru + '». Здесь загадано другое слово — попробуй ещё раз.');
    inp.focus({ preventScroll: true });
    try { inp.select(); } catch (e) {}
  }, true);

  // общий смысл: совпадает хотя бы одно русское значение (без пояснений в скобках)
  const coreRu = r => String(r).replace(/\(.*?\)/g, ' ').split(/[,;\/]/)
    .map(s => s.trim().toLowerCase().replace(/ё/g, 'е').replace(/[.!?…]+$/, '')).filter(Boolean);
  let all = null;
  function sameMeaning(typed, ru) {
    if (!all) {
      all = [];
      Object.entries(byRu()).forEach(([r, ws]) => ws.forEach(w => all.push({ en: w.en, id: w.id, p: w.p, ru: r, core: coreRu(r) })));
    }
    const mine = new Set(coreRu(ru));
    if (!mine.size) return null;
    return all.find(o => o.ru !== ru && o.core.some(k => mine.has(k)) && ok(typed, o, o.ru)) || null;
  }
  const hs = document.createElement('style');
  hs.textContent = '.kbox-hint{margin:.6em 0 0;font-size:.9em;line-height:1.35;color:var(--accent,#f5c84b)}' +
    '.kbox-hint b{color:inherit}';
  document.head.appendChild(hs);
})();


