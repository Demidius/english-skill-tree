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
fr4-media|comment section|раздел комментариев
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
to-places|post office|почта (отделение, здание)
sh2-shops|jeweller's|ювелирный магазин
ba-phrases|What's wrong?|Что не так? Что с тобой? (видя, что человеку плохо)
ba4-phrases|What do you reckon?|Как считаешь? (разг., брит. — не think)
ba4-phrases|I couldn't agree more.|Полностью согласен (букв. «не мог бы согласиться больше»)
ba4-phrases|It's not my cup of tea.|Это не в моём вкусе (идиома про чай)
ba2-phrases|What a shame!|Как жаль! (What a s…)
ba3-phrases-2|What a pity!|Какая жалость! (What a p…)
ba3-phrases-2|It's up to you.|Решай сам (это зависит от тебя)
ba3-phrases-2|Take it easy.|Не напрягайся, не бери в голову
ba2-phrases|Sure.|Конечно (разг., одно слово)
ti-frequency|all day|весь день (2 слова)
ti2-periods|the whole day|весь день, целый день (3 слова)
da2-phrasal|turn on|включить (t…)
ho3-bills|switch on|включить (s…)
da2-phrasal|turn off|выключить (t…)
ho3-bills|switch off|выключить (s…)
sh2-shopping|refund|возврат денег (одно слово)
sh3-problems|money back|возврат денег, деньги назад (2 слова)
ti3-numbers|from time to time|время от времени (f…)
ti4-frequency|every now and then|время от времени, иногда (e…)
wo3-apply|trial period|испытательный срок (t…)
wo4-jobhunt|probation period|испытательный срок (p…)
ba2-linkers|luckily|к счастью (l…)
ba4-adverbs|fortunately|к счастью (f…)
fo2-containers|a box of|коробка (чего-то: конфет, печенья)
ti4-frequency|round the clock|круглосуточно (r…)
ti4-idioms|around the clock|круглосуточно (a…)
da2-get|get on well with|хорошо ладить с
ba4-contrast|despite|несмотря на (1 слово)
ba4-contrast|in spite of|несмотря на (3 слова)
pe4-rel-2|let someone down|подвести кого-то (со someone)
da4-phrasal|let down|подвести, разочаровать (2 слова)
ho3-neighbours|lend a hand|помочь (букв. «одолжить руку»)
bo4-idioms|give someone a hand|помочь кому-то (букв. «дать руку»)
sh3-shopping-2|try something on|примерить что-то (со something)
da3-routine|spare time|свободное время (s…)
fr-hobbies|free time|свободное время (f…)
da4-phrasal-3|get by|обходиться, справляться (как-то сводить концы с концами)
bo2-accidents|pill|таблетка (p…)
bo3-health-3|tablet|таблетка (t…)
ti3-time-2|meanwhile|тем временем (1 слово)
ti4-time-2|in the meantime|тем временем (3 слова)
pe3-relationships|break up|расстаться (b…)
pe4-rel-2|split up|расстаться, разойтись (о паре, s…)
pe3-personality|reliable|надёжный (r…)
pe3-pers-2|reliable|надёжный (r…)
ba4-wordbuilding-2|dependable|надёжный, на кого можно положиться (d…)
pe3-personality|rude|грубый, невежливый
de2-things|rough|шершавый, грубый (на ощупь)
pe3-look-3|attractive|привлекательный (a…)
ba4-wordbuilding-2|attractive|привлекательный (a…)
pe2-look|good-looking|привлекательный, симпатичный (g…)
pe4-pers-3|straightforward|прямолинейный, честный (о человеке)
pe4-character|outgoing|общительный, открытый (o…)
pe2-character-2|sociable|общительный (s…)
pe-info-2|birthday|день рождения (дата)
pe2-character-2|calm|спокойный (c…)
pe3-generations|look after|заботиться о, присматривать за
da3-phrasal-3|look after|заботиться о, присматривать за
de-common|easy|лёгкий (нетрудный)
de2-common|simple|простой (s…)
de2-common|alive|живой (не мёртвый)
de4-adj-2|vivid|яркий, живой (о красках, воспоминаниях)
de3-strong|amazing|потрясающий (a…)
de2-eding-2|amazing|потрясающий (a…)
de3-strong-2|tremendous|огромный, колоссальный (t…)
de3-strong|awful|ужасный, отвратительный (a…)
de2-common|horrible|ужасный, противный (h…)
de3-strong-2|terrible|ужасный, страшный (t…)
de3-opinion|disgusting|отвратительный (на вкус, вид, d…)
de3-opinion|impressive|впечатляющий (i…)
de3-feel-2|fed up|надоело, сыт по горло (f…)
de3-feel-2|burst into tears|разрыдаться, расплакаться (3 слова)
da4-phrasal|break down|сломаться (о машине), не выдержать и расплакаться
de4-wordparts|careful|осторожный, внимательный (с суффиксом -ful)
de4-adj-2|cramped|тесный (о помещении)
sh2-clothes|tight|тесный (об одежде), облегающий
de4-adj-2|outdated|устаревший (1 слово)
ti4-sequence|out of date|устаревший, просроченный (3 слова)
ti4-time-2|overdue|просроченный (о платеже, книге)
de4-describe-people|elegant|элегантный (e…)
sh2-clothes|smart|нарядный, элегантный (s…)
de4-objects|handy|удобный, полезный (под рукой)
de-common-2|right|верный, правильный (r…)
de-common-3|great|отличный, классный (разг., g…)
de2-common|excellent|превосходный, отличный (e…)
de3-strong|brilliant|блестящий, гениальный (брит. разг. «супер»)
de-common-3|free|свободный, бесплатный (f…)
sh2-clothes|loose|свободный, просторный (об одежде)
de2-eding-2|pleased|довольный (p…)
de2-eding-2|satisfied|удовлетворённый (s…)
de4-feel-2|content|довольный жизнью, удовлетворённый (c…)
de3-adjprep-2|jealous of|завидующий, ревнующий (j…)
ti-clock|day|день (сутки)
ti2-expr|while|пока, в то время как (w…)
ti2-expr|already|уже́ (в утверждении)
ti3-numbers|a quarter|четверть (1/4)
ti3-numbers|nowadays|в наши дни (1 слово)
ti4-past-future|nowadays|в наши дни (1 слово)
ti2-expr-2|these days|в наши дни, сейчас (2 слова)
ti3-time-2|in advance|заранее (2 слова)
ti4-sequence|beforehand|заранее, предварительно (1 слово)
ti3-time-2|so far|до сих пор, пока что (s…)
ti3-time-2|up to now|до сих пор, до настоящего момента (u…)
ti4-idioms|for the time being|пока что, на данный момент (временно)
ti3-time-2|immediately|немедленно (1 слово)
ti2-expr-2|at once|сразу, немедленно (2 слова)
ti3-plans|be short of time|иметь мало времени (s…)
ti4-deadlines|be pressed for time|торопиться, иметь мало времени (p…)
da3-routine|be in a hurry|торопиться, спешить (h…)
ti3-plans|at the last minute|в последний момент (про минуту)
ti4-time-2|simultaneously|одновременно (1 слово)
ti2-periods|at the same time|в то же время, одновременно (4 слова)
ti4-past-future|prior to|до, перед (книжн., 2 слова)
ti4-sequence|afterwards|потом, впоследствии (a…)
ti4-sequence|subsequently|впоследствии (книжн., s…)
ti-frequency|often|часто (o…)
ti-frequency|sometimes|иногда (s…)
ti3-numbers-2|a couple of|пара, несколько (двое-трое)
ti4-frequency|rarely|редко (r…)
da-verbs|love|любить (l…)
da-verbs|want|хотеть (w…)
da2-verbs|decide|решать, принимать решение
da3-phrasal|work out|понять, разобраться, тренироваться (фраз. глагол)
da3-phrasal|come up with|придумать (идею, 3 слова)
da3-verbs-b1|happen|происходить, случаться
da4-verbs-3|gain|получать, набирать (вес, опыт)
da4-verbs-3|predict|предсказывать (p…)
da4-verbs-3|tolerate|терпеть (1 слово)
da4-phrasal|put up with|терпеть, мириться (3 слова)
da-verbs-2|help|помогать (h…)
da-verbs-2|wait|ждать (без предлога)
da-verbs-2|sleep|спать (s…)
da-verbs-3|try|пытаться, пробовать (t…)
da3-phrasal-3|turn up|появиться (t…)
da3-phrasal-3|show up|прийти, появиться (s…)
da3-phrasal-3|check in|зарегистрироваться (в аэропорту, отеле)
to2-airport|check in|зарегистрироваться (в аэропорту, отеле)
da3-verbs-b1-2|include|включать (в состав)
da4-phrasal-3|take down|записать, снять (со стены)
da4-phrasal-3|bring back|напомнить, вернуть (воспоминания)
ho-prep|under|под (u…)
ho-prep|next to|рядом с (n…)
ho2-house|downstairs|внизу, вниз (по лестнице)
ho2-house|neighbour|сосед (n…)
ho2-house|move house|переезжать (в другой дом)
ho2-house|spacious|просторный (s…)
ho4-home-2|spacious|просторный (s…)
ho3-problems|repair|чинить, ремонтировать (r…)
ho3-problems|mess|беспорядок (m…)
ho3-house-2|messy|неубранный, грязный (m…)
de2-opposites|untidy|неопрятный, неубранный (u…)
ho-things-3|photo|фотография (снимок)
ho2-homes|attic|чердак (a…)
fo3-restaurant|sweet|сладкий (s…)
fo3-restaurant|salty|солёный (s…)
fo3-restaurant-2|fast food|фастфуд (f…)
bo2-healthy|junk food|вредная еда, фастфуд (j…)
fo4-cooking|dough|тесто (сырое, для хлеба)
fo4-taste|greasy|жирный, сальный (g…)
fo4-eating|swallow|глотать (s…)
fo3-diet|overeat|переедать (o…)
fo3-diet|nutritious|питательный (n…)
to2-describe|modern|современный (m…)
to2-describe|lively|оживлённый (l…)
to3-travel|fine|штраф (f…)
to3-city-2|field|поле (f…)
na-animals|field|поле (f…)
to3-city-2|facilities|удобства, инфраструктура (f…)
to4-crime|court|суд (здание, учреждение)
to4-travel|itinerary|маршрут (план поездки)
to2-streets|crossroads|перекрёсток (c…)
to4-crime-2|investigate|расследовать (i…)
sh-shop|buy|покупать (b…)
sh2-clothes|fashionable|модный (f…)
wo3-apply|hire|нанять (h…)
wo3-apply|benefits|льготы (b…)
wo4-education|dissertation|диссертация, дипломная работа (d…)
wo4-education|thesis|диссертация, дипломная работа (t…)
wo4-jobhunt|recruit|нанимать, набирать (персонал)
wo2-school-2|be late for|опоздать на (урок, встречу)
wo3-work-2|earn a living|зарабатывать на жизнь (e…)
wo3-work-2|organise|организовать (o…)
fr2-sports-2|train|тренироваться (t…)
fr2-holidays-2|postcard|открытка (почтовая)
fr2-music|concert|концерт (c…)
bo-health|well|здоровый, хорошо (w…)
bo-health|headache|головная боль (h…)
bo2-illness|rest|отдыхать, лежать (при болезни, не relax)
bo3-doctor|operation|операция (o…)
bo4-fitness|out of shape|не в форме (физически)
bo2-healthy|healthy|здоровый, полезный (h…)
bo2-healthy|put on weight|поправиться (набрать вес)
na-weather|rainy|дождливый (r…)
na4-env|sustainable|устойчивый, экологичный (s…)
na4-env|eco-friendly|экологичный (e…)
na2-weather-2|cool|прохладный (c…)
ba-linkers|so|поэтому (s…)
ba4-contrast|therefore|поэтому, следовательно (t…)
ba4-linkers-2|consequently|следовательно (c…)
ba-linkers|a lot of|много (3 слова)
ba2-linkers|although|хотя (a…)
ba2-linkers|actually|на самом деле (a…)
ba3-discourse|in fact|на самом деле, фактически (i…)
ba3-linkers-2|as well|тоже (2 слова)
ba3-linkers-2|besides|кроме того (b…)
ba3-linkers-2|because of|из-за (b…)
ba3-linkers-2|so that|чтобы (2 слова)
ba4-contrast|so that|чтобы (2 слова)
ba4-contrast|so as to|чтобы (книжн., 3 слова)
ba4-wordbuilding|growth|рост (g…)
ba4-contrast|nevertheless|тем не менее (n…)
ba4-contrast|moreover|более того (m…)
ba4-linkers-2|all in all|в целом (a…)
ba-pronouns|nobody|никто (о людях)
ba2-quant|none|никто, ни один (из группы)
ba2-quant|every|каждый (e…)
ba2-quant|enough|достаточно (e…)
ba2-quant|quite|довольно (q…)
ba3-adverbs|quite|довольно (q…)
ba3-adverbs|rather|довольно, скорее (r…)
ba3-adverbs|fairly|довольно, достаточно (умеренно, f…)
ba3-adverbs|almost|почти (a…)
ba4-adverbs|hopefully|надеюсь (наречие, 1 слово)
ba4-quantifiers|a bit of|немного (чего-то, 3 слова)
da-routine-2|check emails|проверять (электронную) почту
da3-errands|sort out the post|разобрать (бумажную) почту
ho-things|key|ключ (от двери)
fo-food-2|onion|лук (овощ)
na4-plants|leaf|лист (дерева)
ho2-kitchen|tap|кран (водопроводный)
wo-class-2|board|доска (школьная)
wo-class|pen|ручка (для письма)
to-places|square|площадь (в городе)
na-world|world|мир (весь свет, Земля)
na-world|star|звезда (на небе)
ho-things|bath|ванна (в которой моются)
ho-rooms|bathroom|ванная (комната)
sh4-ads|campaign|кампания (рекламная)
de2-things|sharp|острый (о ноже)
fo3-restaurant|spicy|острый (о еде)
sh2-clothes|zip|молния (на одежде)
na4-weather|lightning|молния (в грозу)
ho3-house-2|tool|инструмент (рабочий)
fr2-music|instrument|инструмент (музыкальный)
ho-prep|opposite|напротив (о месте)
ba4-contrast|on the contrary|напротив, наоборот
da2-phrasal-2|write down|записать (на бумаге)
fr4-music|record|записать (звук, музыку)
fo4-idioms-2|walk on eggshells|ходить на цыпочках (перед кем-то, идиома)
bo4-body-2|tiptoe|ходить на цыпочках (1 слово)
to-directions|corner|угол (улицы, комнаты)
pe-info-2|language|язык (английский, русский…)
ho4-diy|paintbrush|кисть (для краски)
to3-travel|traffic jam|пробка (на дороге)
wo2-school-2|break|перемена (в школе)
fr3-books|chapter|глава (книги)
ba-questions|how old|сколько лет (о возрасте)
ba-questions|what time|во сколько (о времени)
sh-shop-2|shopping|покупки (сам процесс, не вещи)
da-routine-2|relax|расслабляться, отдыхать (не rest)
na-world|stone|камень (материал, камешек — не rock)
na3-landscape-2|rock|скала, валун (большой камень)
na2-landscape|cliff|обрыв, отвесная скала (c…)
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
