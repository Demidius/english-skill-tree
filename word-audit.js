// Проверка слов пачками по 300 (порядок: A1 → B2, основные темы, затем экстра).
// Исправления переводов, примеров и блока «формы / примеры по временам / синонимы».
// Подключается после verb-forms.js и до app.js — здесь видны все карточки, включая учебники.
//
// Формат:
//   RU    — id карточки | английское | новый русский
//   EX    — id карточки | английское | новый пример | перевод примера
//   EXRU  — английский пример | русский перевод (добавить или исправить кнопку RU)
//   WX_SET — заменить общий блок доп. сведений WORD_EX[ключ] целиком (слово с одним значением на сайте)
//   WORD_EX_CARD['id карточки|ключ'] — свой блок только для этой карточки (омонимы; null — скрыть блок);
//     читается в app.js → extraHTML.
//   WX    — правка общих примеров WORD_EX: ключ | поле | английский | русский
//     поля: s (Present Simple), p (Past Simple), pf (Present Perfect), c (Present Continuous)
var WORD_EX_CARD = {};
(function () {
  if (typeof W_BRANCHES === 'undefined') return;
  const idx = {};
  W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(p => Object.values(b[p] || {}).forEach(cs => cs.forEach(c => {
    if (c && typeof c[3] === 'string') idx[c[0]] = c;
  }))));
  const lines = s => s.trim().split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const hasExRu = typeof EX_RU !== 'undefined';
  function editRow(id, en, fn) {
    const c = idx[id]; if (!c) return;
    c[3] = c[3].split(';').map(x => {
      const f = x.split('|');
      if (f[0].trim() !== en) return x;
      while (f.length < 4) f.push('');
      fn(f);
      return f.join('|');
    }).join(';');
  }

  // ---- пачка 1 (слова 1–300, A1) ----
  const RU = `
efa1-11a-1|miss|скучать, пропускать, опаздывать (на транспорт)
efa1-11a-1|pick|выбирать, собирать, срывать (цветы, фрукты)
efa1-11a-1|return|возвращаться, возвращать
`;
  const EX = `
efa1-10b-2|lock|Don't forget to lock the door.|Не забудь запереть дверь.
efa1-12a-1|saw|I saw a woodpecker in the park yesterday.|Вчера я увидел дятла в парке.
`;
  const EXRU = `
That's a great idea!|Отличная идея!
We had a fantastic time.|Мы потрясающе провели время.
Don't worry, it's OK.|Не волнуйся, всё в порядке.
The weather was horrible.|Погода была ужасная.
She lives alone.|Она живёт одна.
I went to bed late last night.|Вчера я поздно лёг спать.
We live together.|Мы живём вместе.
Our tour guide spoke three languages.|Наш экскурсовод говорил на трёх языках.
Where can I change money?|Где можно обменять деньги?
We decided to stay at home.|Мы решили остаться дома.
I'd like to return these shoes.|Я бы хотел вернуть эти туфли.
We live on the second floor.|Мы живём на третьем этаже (брит. second floor — это наш третий этаж).
`;
  // Слово с одним значением на всём сайте: заменить общий блок WORD_EX целиком.
  const WX_SET = {
    orange: [0, 0, "Kate's new car is orange.", '', 'The leaves have turned orange.', 'The sky is turning orange.', [], [], 'orange', null],
    park: [['park', 'parked', 'parked'], 0, 'I usually park near the station.', 'Tom parked outside the shop.', 'Where have you parked the car?', 'Kate is parking the car now.', [], [], 'park', null],
  };
  const WX = `
usually|pf|I have usually finished work by six.|К шести я обычно уже заканчиваю работу.
sometimes|c|Kate is sometimes still working at midnight.|Иногда Кейт в полночь ещё работает.
never|c|Ben is never listening when I talk to him!|Бен никогда не слушает, когда я с ним говорю!
then|pf|We have been to Rome and then to Florence.|Мы побывали в Риме, а потом во Флоренции.
then|c|Tom is having dinner, and then he's going out.|Том ужинает, а потом пойдёт гулять.
`;
  const ADD_EXRU = {
    "Kate's new car is orange.": 'Новая машина Кейт оранжевая.',
    'The leaves have turned orange.': 'Листья стали оранжевыми.',
    'The sky is turning orange.': 'Небо становится оранжевым.',
    'I usually park near the station.': 'Обычно я паркуюсь у вокзала.',
    'Tom parked outside the shop.': 'Том припарковался у магазина.',
    'Where have you parked the car?': 'Где ты припарковал машину?',
    'Kate is parking the car now.': 'Кейт сейчас паркует машину.',
  };

  // ---- применение ----
  // «;» и «|» — разделители строк и полей в c[3], в тексте их быть не должно.
  const safe = s => s.replace(/;/g, ',').replace(/\|/g, '/');
  lines(RU).forEach(l => { const [id, en, ru0] = l.split('|').map(s => s.trim()); const ru = ru0 && safe(ru0); if (ru) editRow(id, en, f => { f[1] = f[1].match(/^\s*/)[0] + ru; }); });
  lines(EX).forEach(l => {
    const [id, en, ex, ru] = l.split('|').map(s => s.trim());
    editRow(id, en, f => { f[3] = safe(ex); });
    if (hasExRu && ru) EX_RU[ex] = ru;
  });
  if (hasExRu) {
    lines(EXRU).forEach(l => { const i = l.indexOf('|'); EX_RU[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    Object.assign(EX_RU, ADD_EXRU);
  }
  if (typeof WORD_EX !== 'undefined') {
    Object.assign(WORD_EX, WX_SET);
    const F = {s: 2, p: 3, pf: 4, c: 5};
    lines(WX).forEach(l => {
      const [k, field, en, ru] = l.split('|').map(s => s.trim());
      const d = WORD_EX[k]; if (!d || !(field in F)) return;
      d[F[field]] = en;
      if (hasExRu && ru) EX_RU[en] = ru;
    });
  }
})();
