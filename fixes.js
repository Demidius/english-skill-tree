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
