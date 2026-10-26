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
//     поля: s (Present Simple), p (Past Simple), pf (Present Perfect), c (Present Continuous),
//     syn / ant (синонимы / антонимы списком), f (формы глагола)
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
efa1-6a-3|Her hair's blonde.|Её волосы светлые.
efa1-11a-1|decide|решать, принимать решение
ba4-wordbuilding|decision|решение (что сделать), выбор
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

  // ---- пачка 2 (слова 301–600, A1) ----
  const RU2 = `
efa1-11a-1|stop|останавливать(ся), прекращать
efa1-11b-1|get a flight|сесть на самолёт, полететь рейсом
efa1-11b-2|enjoy|получать удовольствие, наслаждаться
efa1-5a-2|toast|тост, поджаренный хлеб
efa2-9a-1|toast|тост, поджаренный хлеб
efa1-6a-3|dishes|посуда, блюда
`;
  const EX2 = `
efa1-10a-1|a light|Turn on the light, please.|Включи, пожалуйста, свет.
efa2-8b-2|a light|Turn on the light, please.|Включи, пожалуйста, свет.
`;
  const EXRU2 = `
The baby is crying.|Ребёнок плачет.
Her son is a soldier.|Её сын — солдат.
He had to go to hospital.|Ему пришлось лечь в больницу.
Please come in and sit down.|Входите, пожалуйста, и садитесь.
We need a babysitter for Saturday.|Нам нужна няня на субботу.
We had a traditional English breakfast.|У нас был традиционный английский завтрак.
This is very important.|Это очень важно.
Blue is my favourite colour.|Синий — мой любимый цвет.
Your English is perfect.|У тебя прекрасный английский.
He's a famous actor.|Он знаменитый актёр.
I listen to classical music when I work.|Когда я работаю, я слушаю классическую музыку.
The concert hall is full.|Концертный зал полон.
Is this seat free?|Это место свободно?
My wallet is in my bag.|Мой бумажник в сумке.
My purse is in my bag.|Мой кошелёк в сумке.
Write in pencil.|Пишите карандашом.
This is a photo of my family.|Это фотография моей семьи.
I have a new camera.|У меня новый фотоаппарат.
Can I pay by credit card?|Можно заплатить кредитной картой?
It's ninety-nine cents.|Это стоит девяносто девять центов.
One dollar, please.|Один доллар, пожалуйста.
It costs ten euros.|Это стоит десять евро.
The ticket is five pounds.|Билет стоит пять фунтов.
Look at the board, please.|Посмотрите на доску, пожалуйста.
We went straight on at the lights.|На светофоре мы поехали прямо.
`;
  // syn / ant: список через «;», перевод в скобках; пусто — убрать список. f: формы через «;».
  const WX2 = `
pretty|pf|Your daughter has become so pretty!|Твоя дочь стала такой хорошенькой!
different|pf|Ben has taken a different bus today.|Сегодня Бен поехал на другом автобусе.
pass|c|More students are passing the exam every year.|С каждым годом экзамен сдаёт всё больше студентов.
healthy|syn|fit (в форме); good for you (полезный)
healthy|ant|unhealthy (нездоровый, вредный); ill (больной)
potatoes|syn|
learn|f|learn; learnt / learned; learnt / learned
`;

  // ---- пачка 3 (слова 601–900, A1 → A2) ----
  const RU3 = `
efa1-7a-2|fun|весёлый, интересный (it's fun — это весело)
efa1-8b-1|eating out|еда вне дома (в кафе, ресторане)
`;
  const EX3 = `
efa1-9a-2|the box office|Buy your tickets at the box office.|Купите билеты в кассе.
efa2-1b-2|south|Many birds fly south in winter.|Зимой многие птицы улетают на юг.
`;
  const EXRU3 = `
Here's twenty. Keep the change.|Вот двадцать. Сдачи не надо.
I want to stay at home today.|Сегодня я хочу остаться дома.
I can't swim.|Я не умею плавать.
The party was great fun.|На вечеринке было очень весело.
We went to the pub after work.|После работы мы пошли в паб.
He kissed her goodbye.|Он поцеловал её на прощание.
There's nothing in the fridge.|В холодильнике ничего нет.
I do the shopping on Fridays.|По пятницам я хожу за покупками.
The bus takes half an hour.|На автобусе ехать полчаса.
Do you want to come? — I'd love to.|Хочешь пойти? — С удовольствием.
The hotel has a bar.|В отеле есть бар.
She's a fashion designer.|Она дизайнер одежды.
Gdańsk is in the north of Poland.|Гданьск находится на севере Польши.
The sun comes up in the east.|Солнце встаёт на востоке.
We live in the west of the city.|Мы живём на западе города.
`;
  const WX3 = `
surprised|ant|not surprised (не удивлён)
good-morning|ant|
go-out|syn|
what-time|pf|What time have you set your alarm for?|На какое время ты поставил будильник?
stepfather|pf|My stepfather has taught me to drive.|Отчим научил меня водить машину.
`;
  // travel: общий блок WORD_EX — про существительное; для карточек с глаголом — свой.
  const TRAVEL_V = [['travel', 'travelled', 'travelled'], 0, 'We travel a lot in summer.', 'Kate travelled around Italy last year.',
    'Tom has travelled to ten countries.', 'Anna is travelling in Asia this month.', [['go on a trip', 'поехать в поездку']], [['stay at home', 'сидеть дома']], 'travel', null];
  WORD_EX_CARD['efa1-7a-1|travel'] = TRAVEL_V;
  WORD_EX_CARD['efa2-10c-1|travel'] = TRAVEL_V;
  const ADD_EXRU3 = {
    'We travel a lot in summer.': 'Летом мы много путешествуем.',
    'Kate travelled around Italy last year.': 'В прошлом году Кейт путешествовала по Италии.',
    'Tom has travelled to ten countries.': 'Том побывал в десяти странах.',
    'Anna is travelling in Asia this month.': 'В этом месяце Анна путешествует по Азии.',
  };

  // ---- пачка 4 (слова 901–1200, A2) ----
  const RU4 = `
efa2-10c-1|have a surprise|получить сюрприз, удивиться
efa2-2b-1|right|правильный, верный (также правый)
efa2-11a-1|behave calmly in a crisis|спокойно вести себя в кризисной ситуации
efa2-3a-1|need a new phone|нужен новый телефон
`;
  const EXRU4 = `
She gets on well with her stepmother.|Она хорошо ладит с мачехой.
I don't believe you.|Я тебе не верю.
What are you doing tonight?|Что ты делаешь сегодня вечером?
We're going to Spain next week.|На следующей неделе мы едем в Испанию.
I want to learn French next year.|В следующем году я хочу выучить французский.
I read a book before bed.|Перед сном я читаю книгу.
I walk to work every day.|Я каждый день хожу на работу пешком.
I help my neighbour every week.|Я каждую неделю помогаю соседу.
`;
  const WX4 = `
often|c|Tom is often working late these days.|В последнее время Том часто работает допоздна.
wake-up|syn|
get-to-work|syn|
`;

  // ---- пачка 5 (слова 1201–1500, A2) ----
  const RU5 = `
efa2-12a-1|I've read the book.|Я прочитал эту книгу.
efa2-pe2-2|Here we are.|Вот мы и пришли (также: вот, пожалуйста)
efa2-9b-1|none|нисколько, ни одного
efa2-pe4-1|You can't miss it!|Вы точно не пройдёте мимо!
`;
  const EX5 = `
efa2-8a-1|saw|I saw a woodpecker in the park yesterday.|Вчера я увидел дятла в парке.
efa2-12b-1|broke|I broke my leg last winter.|Прошлой зимой я сломал ногу.
efa2-8b-1|a study|My dad works in his study.|Папа работает у себя в кабинете.
`;
  const EXRU5 = `
The secretary answers the phone.|Секретарь отвечает на звонки.
Put your bag on the chair.|Поставь сумку на стул.
The dog barks at strangers.|Собака лает на чужих.
Where's the toilet, please?|Скажите, пожалуйста, где туалет?
I have a lot of plants at home.|У меня дома много растений.
Fish and chips, please.|Рыбу с картошкой фри, пожалуйста.
Wash the lettuce first.|Сначала помой салат.
I love pineapple on pizza.|Обожаю пиццу с ананасами.
I have a sandwich for lunch.|На обед я ем сэндвич.
Children love sweets.|Дети обожают конфеты.
The books are in that box.|Книги в той коробке.
`;

  // ---- пачка 6 (слова 1501–1800, A2) ----
  const RU6 = `
efa2-2a-1|a file|папка, файл
efa2-1c-1|Can I have a copy, please?|Можно мне копию, пожалуйста?
efa2-7a-1|a painter|художник, маляр
efa2-11c-1|get fitter|прийти в лучшую форму
efa2-11c-1|get directions|узнать дорогу, проложить маршрут
efa2-11b-1|need to|нужно (сделать)
`;
  const EX6 = `
efa2-10a-1|a park|Let's go for a walk in the park.|Пойдём погуляем в парке.
efa2-10a-1|a square|There's a café in the main square.|На главной площади есть кафе.
efa2-3b-1|a cook|My grandmother was a great cook.|Моя бабушка прекрасно готовила.
efa2-6c-1|a keyboard|She plays the keyboard in a band.|Она играет на синтезаторе в группе.
`;
  const EXRU6 = `
Is there a pharmacy near here?|Здесь поблизости есть аптека?
There's a new art gallery in town.|В городе открылась новая картинная галерея.
This road goes to the airport.|Эта дорога ведёт в аэропорт.
The taxi rank is outside the station.|Стоянка такси у вокзала.
Let me check my diary.|Сейчас посмотрю в ежедневнике.
Where are the scissors?|Где ножницы?
Don't forget your sunglasses.|Не забудь солнцезащитные очки.
She works as a model.|Она работает моделью.
The painter is painting our kitchen.|Маляр красит нашу кухню.
Please open the attachment.|Откройте, пожалуйста, вложение.
I'm from Poland. What about you?|Я из Польши. А ты?
Our drummer is only sixteen.|Нашему барабанщику всего шестнадцать.
He's the band's guitarist.|Он гитарист группы.
She's a famous pianist.|Она знаменитая пианистка.
`;
  const WX6 = `
dry|c|The weather is getting drier.|Погода становится суше.
`;

  // ---- пачка 7 (слова 1801–2100, A2 и экстра A2) ----
  // У экстра-тем (efx-…) часть речи не размечена, поэтому общий блок WORD_EX показывается целиком.
  // Для омонимов — свой блок у карточки.
  Object.assign(WORD_EX_CARD, {
    'efx-pi-appearance-1|fat': [0, 0, 'Our dog is too fat.', '', 'Tom has got fat since he stopped running.', 'My cat is getting fat.',
      [['overweight', 'вежливее'], ['big', 'разг., мягче']], [['thin', 'худой'], ['slim', 'стройный']], 'fat', null],
    'efx-pi-personality-1|warm': [0, 0, 'Our new neighbours are very warm people.', '', 'She has always been warm and friendly to me.', 'The host is being very warm to his guests.',
      [['friendly', 'дружелюбный'], ['kind', 'добрый']], [['cold', 'холодный'], ['unfriendly', 'недружелюбный']], 'warm', null],
    'efx-pi-personality-1|mean': [0, 0, 'My boss is mean with money.', '', 'He has always been mean with money.', "You're being mean — share your sweets!",
      [['stingy', 'жадный']], [['generous', 'щедрый']], 'mean', null],
    'efx-pi-languages-1|mean': [['mean', 'meant', 'meant'], 1, 'What does this word mean?', "I didn't know what she meant.", '', '',
      [], [], 'meant|mean', null],
    'efx-pi-family-1|engagement': [0, 0, 'Their engagement was a big surprise.', '', 'They have announced their engagement.', 'Lots of couples are announcing their engagements online.',
      [], [], 'engagement', ['engagements', 'C', '', ['sg', '', 'sg', 'pl']]],
  });
  const ADD_EXRU7 = {
    'Our dog is too fat.': 'Наша собака слишком толстая.',
    'Tom has got fat since he stopped running.': 'Том растолстел с тех пор, как перестал бегать.',
    'My cat is getting fat.': 'Мой кот толстеет.',
    'Our new neighbours are very warm people.': 'Наши новые соседи — очень сердечные люди.',
    'She has always been warm and friendly to me.': 'Она всегда была ко мне тёплой и дружелюбной.',
    'The host is being very warm to his guests.': 'Хозяин очень радушно принимает гостей.',
    'My boss is mean with money.': 'Мой начальник скуп.',
    'He has always been mean with money.': 'Он всегда был скупым.',
    "You're being mean — share your sweets!": 'Не жадничай — поделись конфетами!',
    'What does this word mean?': 'Что значит это слово?',
    "I didn't know what she meant.": 'Я не поняла, что она имела в виду.',
    'Their engagement was a big surprise.': 'Их помолвка стала большим сюрпризом.',
  };
  const EXRU7 = `
long hair / short hair / straight hair / curly hair / blonde hair / red hair / dark hair|длинные / короткие / прямые / кудрявые / светлые / рыжие / тёмные волосы
straight hair|прямые волосы
curly hair|кудрявые волосы
blonde hair|светлые волосы
blue eyes / brown eyes|голубые / карие глаза
carry a bag|нести сумку
know somebody|знать кого-либо
look happy / look about twenty-five|выглядеть счастливым / выглядеть лет на двадцать пять
`;
  const WX7 = `
when|pf|Since when has Tom lived here?|С каких пор Том здесь живёт?
how|pf|How have you been?|Как ты поживаешь?
after-that|pf|We have had dinner. After that, let's go for a walk.|Мы поужинали. После этого давай прогуляемся.
find|c|Scientists are finding new species every year.|Учёные каждый год находят новые виды.
die|syn|pass away (мягко)
know|ant|
enough|ant|
go-back|ant|
`;

  // ---- пачка 8 (слова 2101–2400, экстра A2) ----
  const RU8 = `
efx-pi-verbpatterns-1|need to do something|нужно что-либо сделать
`;
  Object.assign(WORD_EX_CARD, {
    'efx-pi-restaurant-1|order': [['order', 'ordered', 'ordered'], 0, 'We usually order pizza on Fridays.', 'Tom ordered a steak and chips.', 'Have you ordered yet?', 'Anna is ordering a coffee at the bar.',
      [['ask for', 'разг.']], [], 'order', null],
    'efx-pi-travel-1|book': [['book', 'booked', 'booked'], 0, 'I always book my flights online.', 'We booked a hotel near the beach.', 'Have you booked a table for tonight?', 'Anna is booking a flight to Rome.',
      [['reserve', 'формальнее']], [], 'book', null],
    'efx-pi-directions-1|back': [0, 0, "I'll be back in ten minutes.", 'We came back late last night.', 'Tom has just come back from London.', 'She is going back to Spain next week.',
      [], [], 'back', null],
    'efx-pi-clothes-2|ring': [0, 0, 'She wears three rings on her hand.', '', 'Ben has bought a ring for Anna.', 'Maria is wearing her wedding ring.',
      [], [], 'rings|ring', ['rings', 'C', '', ['pl', '', 'sg', 'sg']]],
    'efx-pi-clothes-1|suit': [0, 0, 'This grey suit fits you very well.', '', 'He has worn the same suit for years.', 'The men are wearing dark suits.',
      [], [], 'suits|suit', ['suits', 'C', '', ['sg', '', 'sg', 'pl']]],
    'efx-pi-transport-1|stop': [0, 0, 'The next stop is the station.', 'We missed our stop and had to walk back.', '', '',
      [], [], 'stops|stop', null],
    'efx-pi-airport-1|check-in': [0, 0, 'Check-in opens two hours before the flight.', 'Check-in took almost an hour.', 'Online check-in has already opened.', '',
      [], [], 'check-in', null],
  });
  const ADD_EXRU8 = {
    'We usually order pizza on Fridays.': 'По пятницам мы обычно заказываем пиццу.',
    'Tom ordered a steak and chips.': 'Том заказал стейк с картошкой фри.',
    'Have you ordered yet?': 'Вы уже сделали заказ?',
    'Anna is ordering a coffee at the bar.': 'Анна заказывает кофе у стойки.',
    'I always book my flights online.': 'Я всегда бронирую билеты на самолёт онлайн.',
    'We booked a hotel near the beach.': 'Мы забронировали отель у пляжа.',
    'Have you booked a table for tonight?': 'Ты забронировал столик на вечер?',
    'Anna is booking a flight to Rome.': 'Анна бронирует билет на самолёт в Рим.',
    "I'll be back in ten minutes.": 'Я вернусь через десять минут.',
    'We came back late last night.': 'Мы вернулись вчера поздно вечером.',
    'Tom has just come back from London.': 'Том только что вернулся из Лондона.',
    'She is going back to Spain next week.': 'На следующей неделе она возвращается в Испанию.',
    'The next stop is the station.': 'Следующая остановка — вокзал.',
    'We missed our stop and had to walk back.': 'Мы проехали свою остановку, и пришлось идти назад.',
    'Check-in opens two hours before the flight.': 'Регистрация открывается за два часа до вылета.',
    'Check-in took almost an hour.': 'Регистрация заняла почти час.',
    'Online check-in has already opened.': 'Онлайн-регистрация уже открылась.',
  };
  const EXRU8 = `
rent an apartment / rent a car|снять квартиру / взять машину напрокат
hire a bicycle / hire skis|взять напрокат велосипед / лыжи
book a flight online / book a hotel|забронировать билет на самолёт онлайн / забронировать отель
buy souvenirs|покупать сувениры
`;

  // ---- применение ----
  // «;» и «|» — разделители строк и полей в c[3], в тексте их быть не должно.
  const safe = s => s.replace(/;/g, ',').replace(/\|/g, '/');
  const F = {s: 2, p: 3, pf: 4, c: 5};
  const list = s => (s || '').split(';').map(x => x.trim()).filter(Boolean)
    .map(x => { const m = /^(.*?)\s*(?:\((.*)\))?$/.exec(x); return m[2] ? [m[1], m[2]] : [m[1]]; });
  function ruLine(l) { const [id, en, ru0] = l.split('|').map(s => s.trim()); const ru = ru0 && safe(ru0); if (ru) editRow(id, en, f => { f[1] = f[1].match(/^\s*/)[0] + ru; }); }
  function exLine(l) {
    const [id, en, ex, ru] = l.split('|').map(s => s.trim());
    editRow(id, en, f => { f[3] = safe(ex); });
    if (hasExRu && ru) EX_RU[ex] = ru;
  }
  function exruLine(l) { if (!hasExRu) return; const i = l.indexOf('|'); EX_RU[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
  function wxLine(l) {
    if (typeof WORD_EX === 'undefined') return;
    const [k, field, en, ru] = l.split('|').map(s => s.trim());
    const d = WORD_EX[k]; if (!d) return;
    if (field === 'syn' || field === 'ant') { d[field === 'syn' ? 6 : 7] = list(en); return; }
    if (field === 'f') { d[0] = en.split(';').map(x => x.trim()); return; }
    if (!(field in F)) return;
    d[F[field]] = en;
    if (hasExRu && ru) EX_RU[en] = ru;
  }
  lines(RU + RU2 + RU3 + RU4 + RU5 + RU6 + RU8).forEach(ruLine);
  lines(EX + EX2 + EX3 + EX5 + EX6).forEach(exLine);
  lines(EXRU + EXRU2 + EXRU3 + EXRU4 + EXRU5 + EXRU6 + EXRU7 + EXRU8).forEach(exruLine);
  if (hasExRu) Object.assign(EX_RU, ADD_EXRU, ADD_EXRU3, ADD_EXRU7, ADD_EXRU8);
  if (typeof WORD_EX !== 'undefined') Object.assign(WORD_EX, WX_SET);
  lines(WX + WX2 + WX3 + WX4 + WX6 + WX7).forEach(wxLine);

  // Следующие пачки лежат в отдельных файлах (word-audit-2.js …) и передают правки одним объектом:
  // { RU, EX, EXRU, WX } — строки в тех же форматах, CARD — блоки WORD_EX_CARD, ADD_EXRU — переводы примеров.
  window.wordAuditApply = function (b) {
    b = b || {};
    lines(b.RU || '').forEach(ruLine);
    lines(b.EX || '').forEach(exLine);
    lines(b.EXRU || '').forEach(exruLine);
    if (hasExRu && b.ADD_EXRU) Object.assign(EX_RU, b.ADD_EXRU);
    if (b.CARD) Object.assign(WORD_EX_CARD, b.CARD);
    lines(b.WX || '').forEach(wxLine);
  };
})();
