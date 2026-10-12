// Мелкие правки переводов — небольшой файл, чтобы быстро исправлять отдельные карточки.
// Формат строки: id карточки | английское | новый русский
(function () {
  const RU = `
da-routine-2|get home late|поздно возвращаться домой
pe2-life|go to university|учиться в университете (поступить)
de4-describe-people|in her early thirties|ей немного за тридцать
de4-describe-people|in his late fifties|ему под шестьдесят
de4-collocations|narrow escape|чудесное спасение (едва спасся)
ti-clock|quarter past|четверть (часа) после, пятнадцать минут
ti4-time-2|behind schedule|с отставанием от графика
ti4-past-future|look back on|вспоминать (о прошлом)
ti4-idioms|run out of time|не хватить времени
da3-routine|on my way|в пути, уже иду
ho4-renting|bills included|коммунальные услуги включены
ho3-neighbours|next-door neighbour|сосед (из соседней квартиры, дома)
ho3-neighbours|get on with|ладить с
ho3-neighbours|keep someone awake|не давать (кому-то) спать
ho3-neighbours|garden fence|садовый забор
fo3-restaurant-2|set menu|комплексное меню
fo3-diet|cut out|исключить (из рациона)
to3-travel|change trains|пересесть на другой поезд
to3-directions|turn off|свернуть (с дороги)
da4-collocations|catch someone's eye|привлечь чьё-то внимание
de3-adjprep-2|aware of|знающий о, осознающий
to3-driving|give someone a lift|подвезти (кого-то)
sh3-shopping-2|go with|сочетаться с, подходить к
sh3-money-2|lend money|дать денег взаймы
sh4-ads|junk mail|рекламная рассылка, спам
wo2-workphrases|go on business|поехать в командировку
fr-hobbies|go for a walk|пойти на прогулку, гулять
fr3-tv|remote control|пульт (от телевизора)
fr3-books|borrow a book|взять книгу (почитать)
fr4-hobbies|take up|заняться (новым хобби)
fr4-hobbies|passionate about|увлечённый (чем-то)
bo3-doctor|blood pressure|давление (кровяное)
bo3-senses|shake hands|пожать руку (друг другу)
ba4-quantifiers|plenty of|много, полно (достаточно)
to-places-2|castle|за́мок (крепость)
ho3-bills|lock|замо́к (на двери), запирать
fo2-cooking-2|flour|мука́
ho3-furniture|shelves|по́лки
ho4-diy|put up shelves|вешать по́лки
na3-birds|magpie|соро́ка (птица)
na4-birds|soar|пари́ть (в воздухе)
ba2-place|at home|до́ма
pe3-social|stay in|остаться до́ма (вечером)
fr-games|stay at home|оставаться до́ма
ba3-phrases-2|Make yourself at home.|Будь как до́ма.
ti2-expr|already|уже́
ti2-expr|yet|ещё (не), уже́ (в вопросе)
fo3-diet|protein|бело́к
de4-sounds|bang|удар, хлопо́к
ho4-diy|saw|пила́ (инструмент)
da-verbs|write|писа́ть
da-routine-2|brush your teeth|чистить (свои) зубы
pe4-body-lang|raise your eyebrows|поднять (свои) брови
bo2-accidents|break your arm|сломать (себе) руку
bo2-accidents|cut your finger|порезать (себе) палец
bo2-accidents|burn your hand|обжечь (себе) руку
bo2-accidents|take your temperature|измерить (тебе) температуру
wo-class|Open your books.|Откройте (ваши) книги.
wo4-jobhunt|hand in your notice|подать (своё) заявление об уходе
sh4-finance|live within your means|жить по (своим) средствам
da3-makedo|do your best|сделать всё (от себя) возможное
fo-cafe|Can I have …?|Можно мне (получить) …?
fo-cafe|I'd like …|Я бы хотел (получить, заказать) …
wo-class|How do you spell …?|Как пишется …? (по буквам)
ba-phrases|Let's…|Давай (сделаем)…
`;
  if (typeof W_BRANCHES === 'undefined') return;
  const idx = {};
  W_BRANCHES.forEach(b => ['cells', 'extra'].forEach(p => Object.values(b[p] || {}).forEach(cs => cs.forEach(c => {
    if (c && typeof c[3] === 'string') idx[c[0]] = c;
  }))));
  RU.trim().split('\n').forEach(line => {
    const [id, en, ru] = line.split('|').map(s => s.trim());
    const c = idx[id]; if (!c || !ru) return;
    c[3] = c[3].split(';').map(x => {
      const f = x.split('|');
      if (f[0].trim() === en) { const lead = f[1].match(/^\s*/)[0]; f[1] = lead + ru; }
      return f.join('|');
    }).join(';');
  });
})();
