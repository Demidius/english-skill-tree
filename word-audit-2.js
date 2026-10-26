// Проверка слов, пачки 9–21 (слова 2401–6012). Формат правок — как в word-audit.js,
// применяет их помощник wordAuditApply (определён в word-audit.js).
(function () {
  if (typeof wordAuditApply !== 'function') return;

  // ---- пачка 9 (слова 2401–2700, экстра A2) ----
  wordAuditApply({
    RU: `
efx-pi-languages-1|good at learning languages|способный к языкам
efx-pi-education-2|be good at maths|хорошо успевать по математике, быть сильным в математике
efx-pi-education-2|be bad at history|плохо успевать по истории, быть слабым в истории
`,
    EXRU: `
watch a film / watch TV / watch a match|смотреть фильм / телевизор / матч
win a prize / win a match / win a competition|выиграть приз / матч / соревнование
`,
    WX: `
dizzy|syn|light-headed (лёгкое головокружение)
wallet|syn|purse (женский кошелёк)
`,
    CARD: {
      'efx-pi-languages-1|like': [0, 0, 'Anna looks like her mother.', 'The hotel was like a palace.', '', '',
        [['similar to', 'похожий на']], [['unlike', 'не похожий на']], 'like', null],
      'efx-pi-work-1|offer': [0, 0, 'This is a very good offer.', 'They made me an offer last week.', 'I have accepted the job offer.', 'The shop is making a special offer this week.',
        [], [], 'offers|offer', ['offers', 'C', '', ['sg', 'sg', 'sg', 'sg']]],
      'efx-pi-technology-1|post': [0, 0, 'Her posts are always funny.', 'His last post got a lot of likes.', 'Tom has written a long post about his trip.', 'Everyone is sharing her post.',
        [], [], 'posts|post', ['posts', 'C', '', ['pl', 'sg', 'sg', 'sg']]],
      'efx-pi-technology-1|download': [0, 0, 'The download takes two minutes.', 'The download was very slow.', 'The download has finished.', 'The download is taking ages.',
        [], [['upload', 'загрузка в интернет']], 'downloads|download', ['downloads', 'C', '', ['sg', 'sg', 'sg', 'sg']]],
      'efx-pi-cinema-1|watch': [['watch', 'watched', 'watched'], 0, 'I watch TV every evening.', 'We watched a good film last night.', 'Have you watched the new series?', 'The children are watching cartoons.',
        [['look at', 'смотреть на']], [], 'watch', null],
      'efx-pi-leisure-1|pass': null,
      'efx-pi-health-1|patient': [0, 0, 'The doctor sees thirty patients a day.', 'The patient felt better after the operation.', 'The nurse has helped many patients today.', 'A patient is waiting outside.',
        [], [['doctor', 'врач']], 'patients|patient', ['patients', 'C', '', ['pl', 'sg', 'pl', 'sg']]],
      'efx-pi-health-2|cough': [0, 0, 'I have a bad cough.', 'Tom had a cough last week.', 'Anna has had a cough for a week.', 'Ben is taking medicine for his cough.',
        [], [], 'coughs|cough', ['coughs', 'C', '', ['sg', 'sg', 'sg', 'sg']]],
      'efx-pi-health-2|cold': [0, 0, 'I often get colds in winter.', 'Tom had a bad cold last week.', 'Anna has caught a cold.', 'Ben is staying at home with a cold.',
        [['flu', 'грипп, сильнее']], [], 'colds|cold', ['colds', 'C', '', ['pl', 'sg', 'sg', 'sg']]],
      'efx-pi-health-3|hurt': [0, 0, 'Is anyone hurt?', 'Nobody was hurt in the accident.', 'Two people have been hurt.', '',
        [['injured', 'раненый, формальнее']], [['unhurt', 'невредимый']], 'hurt', null],
      'efx-pi-animals-1|mouse': [0, 0, 'Our cat catches a mouse almost every day.', 'A mouse ran across the kitchen floor.', 'The cat has caught two mice.', 'A mouse is eating the cheese.',
        [], [], 'mice|mouse', ['mice', 'C', 'мн. ч. mice', ['sg', 'sg', 'pl', 'sg']]],
    },
    ADD_EXRU: {
      'Anna looks like her mother.': 'Анна похожа на маму.',
      'The hotel was like a palace.': 'Отель был похож на дворец.',
      'This is a very good offer.': 'Это очень хорошее предложение.',
      'They made me an offer last week.': 'На прошлой неделе мне сделали предложение.',
      'I have accepted the job offer.': 'Я принял предложение о работе.',
      'The shop is making a special offer this week.': 'На этой неделе в магазине специальное предложение.',
      'Her posts are always funny.': 'Её посты всегда смешные.',
      'His last post got a lot of likes.': 'Его последний пост собрал много лайков.',
      'Tom has written a long post about his trip.': 'Том написал длинный пост о своей поездке.',
      'Everyone is sharing her post.': 'Все делятся её постом.',
      'The download takes two minutes.': 'Скачивание занимает две минуты.',
      'The download was very slow.': 'Скачивание шло очень медленно.',
      'The download has finished.': 'Скачивание завершено.',
      'The download is taking ages.': 'Скачивание идёт целую вечность.',
      'I watch TV every evening.': 'Каждый вечер я смотрю телевизор.',
      'We watched a good film last night.': 'Вчера вечером мы посмотрели хороший фильм.',
      'Have you watched the new series?': 'Ты посмотрел новый сериал?',
      'The children are watching cartoons.': 'Дети смотрят мультики.',
      'The doctor sees thirty patients a day.': 'Врач принимает тридцать пациентов в день.',
      'The patient felt better after the operation.': 'После операции пациенту стало лучше.',
      'The nurse has helped many patients today.': 'Сегодня медсестра помогла многим пациентам.',
      'A patient is waiting outside.': 'За дверью ждёт пациент.',
      'I have a bad cough.': 'У меня сильный кашель.',
      'Tom had a cough last week.': 'На прошлой неделе у Тома был кашель.',
      'Anna has had a cough for a week.': 'У Анны уже неделю кашель.',
      'Ben is taking medicine for his cough.': 'Бен принимает лекарство от кашля.',
      'I often get colds in winter.': 'Зимой я часто простужаюсь.',
      'Tom had a bad cold last week.': 'На прошлой неделе Том сильно простудился.',
      'Anna has caught a cold.': 'Анна простудилась.',
      'Ben is staying at home with a cold.': 'Бен сидит дома с простудой.',
      'Is anyone hurt?': 'Кто-нибудь пострадал?',
      'Nobody was hurt in the accident.': 'В аварии никто не пострадал.',
      'Two people have been hurt.': 'Пострадали два человека.',
      'Our cat catches a mouse almost every day.': 'Наша кошка почти каждый день ловит мышь.',
      'A mouse ran across the kitchen floor.': 'По полу кухни пробежала мышь.',
      'The cat has caught two mice.': 'Кошка поймала двух мышей.',
      'A mouse is eating the cheese.': 'Мышь ест сыр.',
    },
  });
  // ---- пачка 10 (слова 2701–3000, экстра A2 → B1) ----
  wordAuditApply({
    RU: `
efx-pi-phrases-2|You go first.|Давай ты первым.
efx-pi-adverbs-1|masterfully|мастерски, искусно
efx-pi-verbprep-1|think of something|быть какого-либо мнения о чём-либо (What do you think of…?)
efx-pi-countries-1|Dutch|голландский, нидерландский, голландцы - the Dutch
`,
    EXRU: `
Our host made a wonderful dinner.|Хозяин приготовил чудесный ужин.
We have a family get-together every Christmas.|Каждое Рождество мы собираемся всей семьёй.
They invited us to their housewarming party.|Они пригласили нас на новоселье.
We had a school reunion last year.|В прошлом году у нас была встреча выпускников.
I don't have much time to socialise.|У меня мало времени на общение с людьми.
Let's meet up for coffee next week.|Давай встретимся на следующей неделе за кофе.
I'm tired, let's stay in tonight.|Я устал, давай сегодня вечером останемся дома.
We accepted their invitation to dinner.|Мы приняли их приглашение на ужин.
I had to turn down the invitation.|Мне пришлось отклонить приглашение.
We often have people over at weekends.|По выходным у нас часто бывают гости.
I'm not very good at small talk.|Я не очень умею вести светские беседы.
He tried to make conversation with her.|Он пытался завязать с ней разговор.
Please introduce yourself to the group.|Пожалуйста, представьтесь группе.
Is the room still available?|Номер ещё свободен?
Is Monday convenient for you?|Вам удобно в понедельник?
Her face looks familiar.|Её лицо кажется знакомым.
This is a typical Polish dish.|Это типичное польское блюдо.
This film isn't suitable for children.|Этот фильм не подходит для детей.
Is it necessary to book in advance?|Нужно ли бронировать заранее?
This ring is very valuable.|Это кольцо очень ценное.
This is a private beach.|Это частный пляж.
Smoking is not allowed in public places.|Курить в общественных местах запрещено.
The instructions are too complicated.|Инструкция слишком сложная.
Is this information accurate?|Эта информация точная?
I have a basic knowledge of German.|У меня базовые знания немецкого.
That's a very original idea.|Это очень оригинальная идея.
I have a busy schedule this week.|На этой неделе у меня плотный график.
I've arranged to meet him at six.|Я договорился встретиться с ним в шесть.
`,
    CARD: {
      'efx-pi-adverbs-1|well': [0, 0, 'Anna speaks English very well.', 'Tom played well yesterday.', 'You have done very well.', 'The team is playing well this season.',
        [], [['badly', 'плохо']], 'well', null],
      'de3-opinion|fair': [0, 0, 'Our teacher is strict but fair.', 'The judge was fair to everyone.', 'The boss has always been fair to us.', "You aren't being fair!",
        [['just', 'справедливый, книжн.']], [['unfair', 'несправедливый']], 'fair', null],
      'ti3-numbers|point': [0, 0, 'Two point five is the same as two and a half.', 'The temperature fell to minus three point five.', '', '',
        [], [], 'point', null],
    },
    ADD_EXRU: {
      'Anna speaks English very well.': 'Анна очень хорошо говорит по-английски.',
      'Tom played well yesterday.': 'Вчера Том хорошо сыграл.',
      'You have done very well.': 'Ты очень хорошо справился.',
      'The team is playing well this season.': 'В этом сезоне команда играет хорошо.',
      'Our teacher is strict but fair.': 'Наш учитель строгий, но справедливый.',
      'The judge was fair to everyone.': 'Судья был справедлив ко всем.',
      'The boss has always been fair to us.': 'Начальник всегда был к нам справедлив.',
      "You aren't being fair!": 'Ты поступаешь несправедливо!',
      'Two point five is the same as two and a half.': 'Две целых пять десятых — это то же, что два с половиной.',
      'The temperature fell to minus three point five.': 'Температура упала до минус трёх с половиной градусов.',
    },
  });
  // ---- пачка 11 (слова 3001–3300, B1) ----
  wordAuditApply({
    RU: `
fo3-cooking-3|scrambled eggs|яичница-болтунья
fo3-cooking-3|mashed|размятый, в виде пюре (mashed potatoes — картофельное пюре)
sh3-shopping-2|try something on|примерить что-либо
wo3-apply|shortlist|включить в короткий список (кандидатов)
`,
    EXRU: `
Scrambled eggs on toast, please.|Яичницу-болтунью на тосте, пожалуйста.
I need to make an appointment with the dentist.|Мне нужно записаться к стоматологу.
Can we reschedule the meeting?|Можно перенести встречу?
The hotel is fully booked.|В отеле нет свободных мест.
The train is due at 5:30.|Поезд должен прибыть в 5:30.
It's a good idea to plan ahead.|Планировать заранее — хорошая идея.
I spend a lot of time with my family.|Я провожу много времени с семьёй.
Don't waste time on social media.|Не трать время на соцсети.
Let's take a taxi to save time.|Давай возьмём такси, чтобы сэкономить время.
I don't have time for breakfast.|У меня нет времени на завтрак.
Sorry, I'm a bit short of time.|Извини, у меня маловато времени.
He always does everything at the last minute.|Он всегда всё делает в последний момент.
I spent the morning running errands.|Всё утро я бегал по делам.
I pay the bills online.|Я оплачиваю счета онлайн.
I need to get a haircut.|Мне нужно подстричься.
I have to collect a parcel from the post office.|Мне нужно забрать посылку на почте.
Can you iron my shirt?|Можешь погладить мне рубашку?
I change the sheets every week.|Я меняю постельное бельё каждую неделю.
Whose turn is it to empty the dishwasher?|Чья очередь разгружать посудомойку?
Don't forget to feed the pets.|Не забудь покормить питомцев.
He washes the car every Sunday.|Он моет машину каждое воскресенье.
I need to sort out the post.|Мне нужно разобрать почту.
The electricity went off last night.|Вчера вечером отключили электричество.
We cook with gas.|Мы готовим на газу.
Our electricity bill is very high.|У нас очень большой счёт за электричество.
Have you paid the water bill?|Ты оплатил счёт за воду?
The internet connection is very slow.|Интернет очень медленный.
The lock on the door is broken.|Замок на двери сломан.
Can you unlock the door?|Можешь отпереть дверь?
My neighbour has a spare key.|У соседа есть запасной ключ.
We put in a burglar alarm.|Мы поставили охранную сигнализацию.
Someone came to read the gas meter.|Приходили снимать показания газового счётчика.
Plug in the kettle.|Включи чайник в розетку.
Unplug the TV before you go on holiday.|Перед отпуском выключи телевизор из розетки.
Switch on the light, please.|Включи, пожалуйста, свет.
Don't forget to switch off the oven.|Не забудь выключить духовку.
There's a post box on the corner.|На углу есть почтовый ящик.
Is there a public toilet near here?|Здесь поблизости есть общественный туалет?
Pay at the parking meter.|Оплатите в паркомате.
We waited in the bus shelter.|Мы ждали под навесом на остановке.
I bought a newspaper at the kiosk.|Я купил газету в киоске.
The street lights come on at dusk.|Уличные фонари зажигаются в сумерках.
Put your rubbish in the litter bin.|Выбрось мусор в урну.
The traffic warden gave me a ticket.|Инспектор по парковке выписал мне штраф.
Glass goes in the green recycling bin.|Стекло выбрасывают в зелёный контейнер.
Ask at the information desk.|Спросите в справочной.
I found my bag at the lost property office.|Я нашёл свою сумку в бюро находок.
We left our bags at left luggage.|Мы оставили сумки в камере хранения.
The box arrived damaged.|Коробка пришла повреждённой.
The screen is scratched.|Экран поцарапан.
This shirt is stained.|На этой рубашке пятна.
One button is missing.|Не хватает одной пуговицы.
I called customer service.|Я позвонил в службу поддержки.
I sent the jacket back.|Я отправил куртку обратно.
Can I swap this for a bigger size?|Можно поменять это на размер побольше?
They sent me a replacement.|Мне прислали замену.
Please keep your receipt as proof of purchase.|Сохраните чек как подтверждение покупки.
I bought this yesterday and it doesn't work.|Я купил это вчера, и оно не работает.
They sent me the wrong size.|Мне прислали не тот размер.
I'm not happy. Can I speak to the manager?|Я недоволен. Могу я поговорить с менеджером?
I want my money back.|Я хочу вернуть свои деньги.
I'll ring you tomorrow.|Я позвоню тебе завтра.
I left a message on his voicemail.|Я оставил сообщение на его голосовой почте.
I have three missed calls from my mum.|У меня три пропущенных звонка от мамы.
`,
    WX: `
fine|syn|
fine|ant|
travel|ant|
`,
    CARD: {
      'fo3-restaurant-2|well-done': [0, 0, 'I always have my steak well done.', 'The meat was well done but still juicy.', '', '',
        [], [['rare', 'с кровью']], 'well done', null],
    },
    ADD_EXRU: {
      'I always have my steak well done.': 'Я всегда заказываю хорошо прожаренный стейк.',
      'The meat was well done but still juicy.': 'Мясо было хорошо прожарено, но всё ещё сочное.',
    },
  });
  // ---- пачка 12 (слова 3301–3600, B1) ----
  wordAuditApply({
    EXRU: `
Can I leave a message for Anna?|Можно оставить сообщение для Анны?
I've attached the photos.|Я прикрепил фотографии.
Can you forward me the email?|Можешь переслать мне это письмо?
My inbox is full.|Мой ящик входящих переполнен.
The email went to spam.|Письмо попало в спам.
Update your profile photo.|Обнови фото в профиле.
I follow her on Instagram.|Я подписан на неё в Instagram.
Turn off notifications at night.|Отключай уведомления на ночь.
Thanks for your comment!|Спасибо за комментарий!
I fell asleep in front of the TV.|Я заснул перед телевизором.
The kids are asleep.|Дети спят.
Are you still awake?|Ты ещё не спишь?
I couldn't stay awake.|Я не смог побороть сон.
I had a nightmare last night.|Мне ночью приснился кошмар.
I had a strange dream.|Мне приснился странный сон.
My husband snores.|Мой муж храпит.
I feel sleepy after lunch.|После обеда меня клонит в сон.
I lie in on Sundays.|По воскресеньям я валяюсь в постели.
You need to get enough sleep.|Тебе нужно высыпаться.
I'm a light sleeper.|У меня чуткий сон.
He's a heavy sleeper, nothing wakes him.|У него крепкий сон, его ничто не разбудит.
My alarm clock didn't go off.|Мой будильник не прозвенел.
I feel energetic in the morning.|По утрам я полон энергии.
Our kitten is five months old.|Нашему котёнку пять месяцев.
They got a puppy for Christmas.|На Рождество им подарили щенка.
The bird lives in a cage.|Птица живёт в клетке.
The dog has a red collar.|У собаки красный ошейник.
Keep your dog on a lead.|Держите собаку на поводке.
The cat hurt its paw.|Кошка поранила лапу.
Clean the litter tray every day.|Убирайте кошачий лоток каждый день.
Pet food is expensive.|Корм для животных дорогой.
The cat purrs when you stroke it.|Кошка мурлычет, когда её гладишь.
Don't worry, he doesn't bite.|Не бойся, он не кусается.
The puppy licked my hand.|Щенок лизнул мне руку.
Can I stroke your dog?|Можно погладить вашу собаку?
We took the cat to the vet.|Мы отвезли кошку к ветеринару.
I'm waiting for the bus.|Я жду автобус.
This bag belongs to Anna.|Эта сумка принадлежит Анне.
He asked for the bill.|Он попросил счёт.
Don't laugh at me!|Не смейся надо мной!
Do you believe in ghosts?|Ты веришь в привидения?
She really cares about animals.|Она очень заботится о животных.
I dream of living by the sea.|Я мечтаю жить у моря.
What do you think of this idea?|Что ты думаешь об этой идее?
She succeeded in passing the exam.|Ей удалось сдать экзамен.
The team consists of five people.|Команда состоит из пяти человек.
Look at this photo!|Посмотри на это фото!
They always argue about money.|Они всегда спорят из-за денег.
I apologise for being late.|Прошу прощения за опоздание.
`,
    CARD: {
      'bo3-health-3|tablet': [0, 0, 'Take one tablet three times a day.', 'I took a tablet for my headache.', 'Have you taken your tablets today?', 'Grandma is taking tablets for her heart.',
        [['pill', 'таблетка']], [], 'tablets|tablet', ['tablets', 'C', '', ['sg', '', 'pl', 'pl']]],
      'ba3-discourse|anyway': [0, 0, 'Anyway, what time is the meeting?', 'Anyway, we got home very late.', 'Anyway, I have told you everything.', '',
        [['anyhow', 'разг.']], [], 'anyway', null],
    },
    ADD_EXRU: {
      'Take one tablet three times a day.': 'Принимайте по одной таблетке три раза в день.',
      'I took a tablet for my headache.': 'Я выпил таблетку от головной боли.',
      'Have you taken your tablets today?': 'Ты сегодня принял таблетки?',
      'Grandma is taking tablets for her heart.': 'Бабушка принимает таблетки для сердца.',
      'Anyway, what time is the meeting?': 'Так вот, во сколько встреча?',
      'Anyway, we got home very late.': 'В общем, домой мы вернулись очень поздно.',
      'Anyway, I have told you everything.': 'В общем, я рассказал тебе всё.',
    },
  });
  // ---- пачка 13 (слова 3601–3900, экстра B1) ----
  // + существительные-составные, которым генератор форм приписал глагольные формы (book cover, travel adaptor, graduate)
  wordAuditApply({
    RU: `
efx-int-wordformation-2|use|польза, использование (сущ. читается /juːs/ юс)
`,
    EXRU: `
Our next-door neighbour is very kind.|Наш сосед очень добрый.
Put the onions on the chopping board.|Положи лук на разделочную доску.
Put a lid on the saucepan.|Накрой кастрюлю крышкой.
She brought the tea on a tray.|Она принесла чай на подносе.
There's more tea in the teapot.|В заварочном чайнике ещё есть чай.
Can I have a jug of water?|Можно кувшин воды?
Where's the tin opener?|Где консервный нож?
Have you got a bottle opener?|У тебя есть открывалка?
Grate the cheese with a grater.|Натри сыр на тёрке.
Weigh the flour on the kitchen scales.|Взвесь муку на кухонных весах.
Put the cookies on a baking tray.|Выложи печенье на противень.
Use an oven glove, it's hot!|Возьми прихватку, горячо!
I peel potatoes with a peeler.|Я чищу картошку овощечисткой.
Serve the soup with a ladle.|Разливай суп половником.
Stir it with a wooden spoon.|Помешай деревянной ложкой.
`,
    CARD: {
      'efx-int-adjectives-1|positive': [0, 0, "Are you sure? — Yes, I'm positive.", 'She was positive that she had locked the door.', '', '',
        [['sure', 'уверенный'], ['certain', 'уверенный']], [['unsure', 'не уверенный']], 'positive', null],
      'efx-int-wordformation-2|hope': [0, 0, 'There is still hope.', 'She had no hope of winning.', 'The news has given us new hope.', '',
        [], [['despair', 'отчаяние']], 'hope', null],
      'efx-int-wordformation-3|book-cover': null,
      'efx-int-technology-1|travel-adaptor': null,
      'efx-int-education-1|graduate': [0, 0, 'Many graduates work abroad.', 'She was a graduate of Oxford.', 'Tom has been a graduate for two years now.', '',
        [], [['student', 'студент']], 'graduates|graduate', ['graduates', 'C', '', ['pl', '', 'sg', '']]],
      'da3-phrasal-3|turn-up': [0, 0, 'He always turns up late.', 'She turned up at my door at midnight.', 'Has Tom turned up yet?', '',
        [['show up', 'разг.'], ['arrive', 'прибыть']], [], 'turn', null],
      'efx-int-home-1|gate': [0, 0, 'Please close the gate behind you.', 'Tom opened the garden gate.', 'Someone has left the gate open.', 'The dog is waiting at the gate.',
        [], [], 'gates|gate', ['gates', 'C', '', ['sg', '', 'sg', 'sg']]],
      'efx-int-food-1|duck': [0, 0, 'Duck is very popular in Chinese food.', 'We had roast duck for dinner.', 'I have never cooked duck.', 'Dad is cooking duck with oranges.',
        [], [], 'duck', ['', 'U', 'утятина — неисчисл.', ['sg', '', 'sg', 'sg']]],
      'efx-int-cooking-1|roast': [0, 0, 'We have roast chicken every Sunday.', 'The roast potatoes were delicious.', '', '',
        [['roasted', 'запечённый']], [['raw', 'сырой']], 'roast', null],
      'to3-directions|turn-off': [0, 0, 'We turn off the main road at the church.', 'Tom turned off the motorway at the next exit.', 'Have we turned off too early?', 'We are turning off at the next junction.',
        [], [], 'turn', null],
    },
    ADD_EXRU: {
      "Are you sure? — Yes, I'm positive.": 'Ты уверен? — Да, совершенно.',
      'She was positive that she had locked the door.': 'Она была уверена, что заперла дверь.',
      'There is still hope.': 'Надежда ещё есть.',
      'She had no hope of winning.': 'У неё не было надежды на победу.',
      'The news has given us new hope.': 'Эта новость дала нам новую надежду.',
      'Many graduates work abroad.': 'Многие выпускники работают за границей.',
      'She was a graduate of Oxford.': 'Она была выпускницей Оксфорда.',
      'Tom has been a graduate for two years now.': 'Том окончил вуз уже два года назад.',
      'He always turns up late.': 'Он всегда появляется поздно.',
      'She turned up at my door at midnight.': 'Она появилась у моей двери в полночь.',
      'Has Tom turned up yet?': 'Том уже пришёл?',
      'Please close the gate behind you.': 'Пожалуйста, закрывай за собой калитку.',
      'Tom opened the garden gate.': 'Том открыл садовую калитку.',
      'Someone has left the gate open.': 'Кто-то оставил ворота открытыми.',
      'The dog is waiting at the gate.': 'Собака ждёт у калитки.',
      'Duck is very popular in Chinese food.': 'Утка очень популярна в китайской кухне.',
      'We had roast duck for dinner.': 'На ужин у нас была запечённая утка.',
      'I have never cooked duck.': 'Я никогда не готовил утку.',
      'Dad is cooking duck with oranges.': 'Папа готовит утку с апельсинами.',
      'We have roast chicken every Sunday.': 'Каждое воскресенье у нас запечённая курица.',
      'The roast potatoes were delicious.': 'Запечённая картошка была очень вкусной.',
      'We turn off the main road at the church.': 'У церкви мы сворачиваем с главной дороги.',
      'Tom turned off the motorway at the next exit.': 'Том съехал с автострады на следующем съезде.',
      'Have we turned off too early?': 'Мы не слишком рано свернули?',
      'We are turning off at the next junction.': 'Мы сворачиваем на следующем перекрёстке.',
    },
  });
  // ---- пачка 14 (слова 3901–4200, экстра B1) ----
  wordAuditApply({
    RU: `
sh3-clothes-3|second-hand|подержанный, б/у (second-hand shop — секонд-хенд)
efx-int-education-1|levels|A levels — выпускные экзамены продвинутого уровня в британской школе
`,
    EXRU: `
The photocopier is broken again.|Ксерокс опять сломался.
Can I borrow your stapler?|Можно взять твой степлер?
Use the scanner on the second floor.|Воспользуйтесь сканером на третьем этаже.
The files are in the filing cabinet.|Документы в шкафу для бумаг.
Check the noticeboard for news.|Следи за новостями на доске объявлений.
He wrote the plan on the whiteboard.|Он написал план на доске.
I need a paper clip.|Мне нужна скрепка.
Put the letter in an envelope.|Положи письмо в конверт.
Save it in this folder.|Сохрани это в этой папке.
I need a stamp for this letter.|Мне нужна марка для этого письма.
I use a highlighter for new words.|Новые слова я выделяю маркером.
She left a sticky note on my screen.|Она оставила стикер на моём экране.
Where's the hole punch?|Где дырокол?
Fix it with sellotape.|Закрепи это скотчем.
`,
    CARD: {
      'to3-directions|block': [0, 0, 'The bank is two blocks from here.', 'We walked three blocks to the station.', '', '',
        [], [], 'blocks|block', ['blocks', 'C', 'амер. — квартал', ['pl', '', '', '']]],
      'wo3-work-2|run': [['run', 'ran', 'run'], 1, 'She runs a small hotel.', 'His father ran a restaurant for twenty years.', 'Anna has run the company since 2020.', 'Who is running the shop today?',
        [['manage', 'управлять']], [], 'run|ran', null],
    },
    ADD_EXRU: {
      'The bank is two blocks from here.': 'Банк в двух кварталах отсюда.',
      'We walked three blocks to the station.': 'До вокзала мы прошли три квартала.',
      'She runs a small hotel.': 'Она управляет небольшим отелем.',
      'His father ran a restaurant for twenty years.': 'Его отец двадцать лет держал ресторан.',
      'Anna has run the company since 2020.': 'Анна руководит компанией с 2020 года.',
      'Who is running the shop today?': 'Кто сегодня заведует магазином?',
    },
  });
  // ---- пачка 15 (слова 4201–4500, экстра B1) ----
  wordAuditApply({
    EXRU: `
The lead singer has a great voice.|У солиста отличный голос.
My daughter loves pop music.|Моя дочь обожает поп-музыку.
There's live jazz in this bar.|В этом баре играют живой джаз.
My dad likes rock music.|Мой папа любит рок.
Polish folk music is very lively.|Польская народная музыка очень живая.
He listens to hip hop.|Он слушает хип-хоп.
This song was a big hit.|Эта песня стала большим хитом.
The band came on stage at nine.|Группа вышла на сцену в девять.
Speak into the microphone.|Говорите в микрофон.
Everyone sang along.|Все подпевали.
`,
    CARD: {
      'efx-int-leisure-1|tour': [['tour', 'toured', 'toured'], 0, 'The band tours every summer.', 'They toured Europe last year.', 'They have toured Japan twice.', 'The band is touring the USA now.',
        [], [], 'tour', null],
      'efx-int-sport-1|coach': [0, 0, 'Our coach trains us twice a week.', 'The coach was angry after the match.', 'The team has had three coaches this year.', 'The coach is talking to the players.',
        [['trainer', 'тренер']], [], 'coaches|coach', ['coaches', 'C', '', ['sg', '', 'pl', 'sg']]],
      'efx-int-sport-1|draw': [['draw', 'drew', 'drawn'], 1, 'If we draw, we play again on Sunday.', 'We drew 2–2 with Leeds.', 'Our team has drawn three games this season.', 'They are drawing 1–1 at half-time.',
        [], [['win', 'выиграть'], ['lose', 'проиграть']], 'draw|drew', null],
      'efx-int-sport-1|train': [['train', 'trained', 'trained'], 0, 'Ben trains every morning.', 'The team trained hard last week.', 'She has trained for months for this race.', 'The players are training in the rain.',
        [['work out', 'заниматься в зале']], [], 'train', null],
      'na3-env-2|green': [0, 0, 'We try to buy green products.', 'It was a very green festival.', 'The city has become greener in recent years.', 'More people are going green.',
        [['eco-friendly', 'экологичный']], [], 'green', null],
      'efx-int-phrases-2|tip': [0, 0, 'Here is a useful tip for learning words.', 'She gave me some good tips about London.', 'I have read some useful tips online.', '',
        [['advice', 'совет']], [], 'tips|tip', ['tips', 'C', '', ['sg', '', 'pl', '']]],
    },
    ADD_EXRU: {
      'The band tours every summer.': 'Группа каждое лето ездит на гастроли.',
      'They toured Europe last year.': 'В прошлом году они гастролировали по Европе.',
      'They have toured Japan twice.': 'Они дважды гастролировали по Японии.',
      'The band is touring the USA now.': 'Сейчас группа гастролирует по США.',
      'Our coach trains us twice a week.': 'Наш тренер тренирует нас дважды в неделю.',
      'The coach was angry after the match.': 'После матча тренер был зол.',
      'The team has had three coaches this year.': 'В этом году у команды сменилось три тренера.',
      'The coach is talking to the players.': 'Тренер разговаривает с игроками.',
      'If we draw, we play again on Sunday.': 'Если сыграем вничью, в воскресенье будет переигровка.',
      'We drew 2–2 with Leeds.': 'Мы сыграли с «Лидсом» вничью 2:2.',
      'Our team has drawn three games this season.': 'В этом сезоне наша команда трижды сыграла вничью.',
      'They are drawing 1–1 at half-time.': 'После первого тайма у них ничья 1:1.',
      'Ben trains every morning.': 'Бен тренируется каждое утро.',
      'The team trained hard last week.': 'На прошлой неделе команда усердно тренировалась.',
      'She has trained for months for this race.': 'Она месяцами готовилась к этому забегу.',
      'The players are training in the rain.': 'Игроки тренируются под дождём.',
      'We try to buy green products.': 'Мы стараемся покупать экологичные товары.',
      'It was a very green festival.': 'Это был очень экологичный фестиваль.',
      'The city has become greener in recent years.': 'За последние годы город стал экологичнее.',
      'More people are going green.': 'Всё больше людей переходят на экологичный образ жизни.',
      'Here is a useful tip for learning words.': 'Вот полезный совет для запоминания слов.',
      'She gave me some good tips about London.': 'Она дала мне несколько хороших советов насчёт Лондона.',
      'I have read some useful tips online.': 'Я прочитал в интернете несколько полезных советов.',
    },
  });
  // ---- пачка 16 (слова 4501–4800, экстра B1 → B2) ----
  wordAuditApply({
    RU: `
pe4-rel-2|let someone down|подвести кого-либо
`,
    EXRU: `
He's quite reserved with strangers.|С незнакомыми он довольно сдержан.
She's very outgoing and makes friends easily.|Она очень общительная и легко заводит друзей.
She's determined to pass the exam.|Она твёрдо намерена сдать экзамен.
He's a cautious driver.|Он осторожный водитель.
Don't be so impulsive, think first.|Не будь таким импульсивным, сначала подумай.
I need someone trustworthy.|Мне нужен человек, которому можно доверять.
Dogs are very loyal animals.|Собаки — очень преданные животные.
Please accept my sincere apologies.|Примите мои искренние извинения.
Despite his success, he's very humble.|Несмотря на успех, он очень скромный.
He's so vain, he always looks in the mirror.|Он такой тщеславный, всё время смотрится в зеркало.
Don't be stingy, buy a round of drinks!|Не жадничай, угости всех!
We made a spontaneous decision to go to Paris.|Мы спонтанно решили поехать в Париж.
My uncle is a bit eccentric.|Мой дядя немного чудаковатый.
He was a rebellious teenager.|Он был подростком-бунтарём.
Do you have any siblings?|У тебя есть братья или сёстры?
We see our extended family at Christmas.|На Рождество мы видимся со всей роднёй.
The nuclear family is getting smaller.|Семьи из родителей и детей становятся меньше.
She's a single parent with two kids.|Она одна растит двоих детей.
He grew up with foster parents.|Он вырос в приёмной семье.
There are four people in our household.|В нашей семье четыре человека.
She's the main breadwinner in the family.|Она главный кормилец в семье.
They raised three children.|Они вырастили троих детей.
Grandparents love to spoil their grandchildren.|Бабушки и дедушки любят баловать внуков.
Children need some discipline.|Детям нужна дисциплина.
There's a lot of sibling rivalry in our house.|У нас дома дети постоянно соперничают.
There's a big generation gap between us.|Между нами большой разрыв поколений.
She inherited the house from her aunt.|Она унаследовала дом от тёти.
My ancestors came from Ukraine.|Мои предки были из Украины.
Be careful, it's fragile.|Осторожно, это хрупкое.
These boots are very durable.|Эти ботинки очень прочные.
We need a sturdy table.|Нам нужен крепкий стол.
The tent was too flimsy for the storm.|Палатка оказалась слишком хлипкой для бури.
This camera is very compact.|Эта камера очень компактная.
The sofa was too bulky for the lift.|Диван был слишком громоздким для лифта.
I need a lightweight jacket.|Мне нужна лёгкая куртка.
Put it in a transparent plastic bag.|Положи это в прозрачный пакет.
Is your watch waterproof?|Твои часы водонепроницаемые?
We bought a portable speaker.|Мы купили портативную колонку.
A black dress is very versatile.|Чёрное платье очень универсально.
This little knife is really handy.|Этот маленький нож очень удобный.
Wash delicate fabrics by hand.|Деликатные ткани стирайте вручную.
The table is made of solid oak.|Стол сделан из цельного дуба.
Let me know beforehand if you can't come.|Предупреди заранее, если не сможешь прийти.
We had dinner and afterwards went for a walk.|Мы поужинали, а потом пошли гулять.
Initially I didn't like the job.|Поначалу мне не нравилась эта работа.
He was arrested and subsequently released.|Его арестовали, а впоследствии отпустили.
She previously worked in a bank.|Раньше она работала в банке.
Have you seen her lately?|Ты видел её в последнее время?
Ultimately, it's your decision.|В конечном счёте решать тебе.
You'll get the results in due course.|Результаты вы получите в своё время.
He became famous overnight.|Он прославился в одночасье.
We agreed on the price at the outset.|О цене мы договорились с самого начала.
Keep your software up to date.|Своевременно обновляй программы.
This map is out of date.|Эта карта устарела.
To date, we have raised £5,000.|На сегодняшний день мы собрали 5000 фунтов.
Is this a recent photo?|Это недавнее фото?
She handled the situation very well.|Она очень хорошо справилась с ситуацией.
We need to tackle this problem now.|Нам нужно заняться этой проблемой прямо сейчас.
The job involves a lot of travel.|Эта работа связана с частыми поездками.
The weather affects my mood.|Погода влияет на моё настроение.
I gained a lot of experience.|Я приобрёл большой опыт.
It's hard to maintain a healthy weight.|Трудно поддерживать здоровый вес.
Everyone contributed to the project.|Все внесли вклад в проект.
He revealed the truth at last.|Наконец он раскрыл правду.
Nobody can predict the future.|Никто не может предсказать будущее.
I couldn't resist the chocolate.|Я не смог устоять перед шоколадом.
I can't tolerate rudeness.|Я не терплю грубости.
This car consumes a lot of petrol.|Эта машина потребляет много бензина.
I really appreciate your help.|Я очень ценю твою помощь.
Can you recommend a good restaurant?|Можешь посоветовать хороший ресторан?
`,
    CARD: {
      'efx-int-adverbs-1|either': [0, 0, "I don't like coffee. — I don't either.", "Tom didn't come, and Anna didn't either.", "I haven't seen that film either.", '',
        [], [['too', 'тоже, в утвердительном предложении']], 'either', null],
    },
    ADD_EXRU: {
      "I don't like coffee. — I don't either.": 'Я не люблю кофе. — Я тоже.',
      "Tom didn't come, and Anna didn't either.": 'Том не пришёл, и Анна тоже.',
      "I haven't seen that film either.": 'Я тоже не видел этот фильм.',
    },
  });
  // ---- пачка 17 (слова 4801–5100, B2) ----
  wordAuditApply({
    RU: `
sh4-shopping-2|overpriced|слишком дорогой, с завышенной ценой
`,
    EXRU: `
I love the décor in this café.|Мне очень нравится интерьер этого кафе.
The furnishings are a bit old-fashioned.|Обстановка немного старомодная.
We put new tiles in the bathroom.|Мы положили в ванной новую плитку.
The lampshade is covered in dust.|Абажур весь в пыли.
There's a huge chandelier in the hall.|В холле огромная люстра.
The bedroom has a built-in wardrobe.|В спальне есть встроенный шкаф.
The skylight lets in a lot of light.|Через мансардное окно проходит много света.
There's a sofa in the bay window.|В эркере стоит диван.
The flat is light and airy.|Квартира светлая и просторная.
There's too much clutter in the kitchen.|На кухне слишком много хлама.
His desk is always cluttered.|Его стол всегда завален.
They have a very minimalist flat.|У них квартира в стиле минимализма.
I like the rustic style of the cottage.|Мне нравится деревенский стиль этого домика.
The room gets a lot of natural light.|В комнате много естественного света.
I order groceries online.|Я заказываю продукты онлайн.
Check the best-before date.|Проверь срок годности.
Don't eat it after the use-by date.|Не ешь это после истечения срока годности.
We only buy free-range eggs.|Мы покупаем только яйца от кур свободного выгула.
The restaurant uses locally sourced food.|Ресторан использует продукты местного производства.
Strawberries are in season now.|Сейчас сезон клубники.
The menu is based on seasonal produce.|Меню составлено из сезонных продуктов.
I don't like ready meals.|Я не люблю готовую еду.
These are home-grown tomatoes.|Это помидоры с собственного огорода.
We go to the farmers' market on Saturdays.|По субботам мы ходим на фермерский рынок.
Keep perishable food in the fridge.|Храните скоропортящиеся продукты в холодильнике.
Rice is a staple food in Asia.|Рис — основной продукт питания в Азии.
Bulk buying saves money.|Закупка оптом экономит деньги.
We try to reduce food waste.|Мы стараемся сокращать пищевые отходы.
She nibbled a biscuit.|Она грызла печенье.
He sipped his coffee slowly.|Он медленно потягивал кофе.
The kids gobbled their dinner.|Дети жадно проглотили ужин.
He was munching an apple.|Он хрустел яблоком.
Swallow the pill with water.|Проглоти таблетку, запив водой.
We devoured the whole cake.|Мы умяли весь торт.
I'm feeling a bit peckish.|Я немного проголодался.
No more, thanks, I'm full up.|Больше не надо, спасибо, я наелся.
Can I have a second helping?|Можно добавки?
My son is a fussy eater.|Мой сын привередлив в еде.
Let's grab a bite before the film.|Давай перекусим перед фильмом.
He wolfed down his lunch.|Он мигом проглотил обед.
I often skip breakfast.|Я часто пропускаю завтрак.
Soup is my comfort food.|Суп — моя еда для утешения.
We stayed in a lovely B&B.|Мы остановились в чудесной мини-гостинице с завтраком.
The price includes half board.|В стоимость входит полупансион.
Full board costs extra.|Полный пансион оплачивается отдельно.
It's a popular ski resort.|Это популярный горнолыжный курорт.
They went on a Mediterranean cruise.|Они отправились в круиз по Средиземному морю.
We took a guided tour of the castle.|Мы осмотрели замок с гидом.
Off-peak tickets are cheaper.|Билеты в непиковое время дешевле.
Prices go up in peak season.|В высокий сезон цены растут.
We found a great last-minute deal.|Мы нашли отличное горящее предложение.
They upgraded us to a suite.|Нас бесплатно переселили в люкс.
There's complimentary water in the room.|В номере бесплатная вода.
There's no cancellation fee.|Штрафа за отмену нет.
Don't travel without travel insurance.|Не путешествуйте без туристической страховки.
We went on an excursion to the islands.|Мы съездили на экскурсию на острова.
Click here to add to basket.|Нажмите здесь, чтобы добавить в корзину.
I put it on my wish list.|Я добавил это в список желаний.
You can track your order online.|Вы можете отслеживать заказ онлайн.
Here's your tracking number.|Вот ваш трек-номер.
Your parcel is out for delivery.|Ваша посылка передана курьеру.
Your order will be dispatched today.|Ваш заказ будет отправлен сегодня.
I picked it up from a parcel locker.|Я забрал это из постамата.
Print the returns label.|Распечатайте ярлык для возврата.
Enter the promo code at checkout.|Введите промокод при оформлении заказа.
Read the customer reviews first.|Сначала прочитай отзывы покупателей.
This site offers secure payment.|На этом сайте безопасная оплата.
Next-day delivery costs extra.|Доставка на следующий день оплачивается отдельно.
Check your order history.|Проверьте историю заказов.
Sign up and get 10% off.|Зарегистрируйтесь и получите скидку 10%.
I always overspend at Christmas.|На Рождество я всегда трачу слишком много.
It's important to live within your means.|Важно жить по средствам.
I'll pay you back on payday.|Я верну тебе долг в день зарплаты.
I pay my rent by direct debit.|Я плачу за аренду автоплатежом.
I set up a standing order.|Я настроил регулярный перевод.
Check your bank statement every month.|Проверяйте банковскую выписку каждый месяц.
My salary goes into my current account.|Зарплата приходит на мой текущий счёт.
I opened a savings account.|Я открыл сберегательный счёт.
The interest rate is very low.|Процентная ставка очень низкая.
We paid off the mortgage last year.|В прошлом году мы погасили ипотеку.
They took out a loan to buy a car.|Они взяли кредит на покупку машины.
He has a good credit rating.|У него хороший кредитный рейтинг.
We need to cut back on spending.|Нам нужно сократить расходы.
I set aside some money every month.|Каждый месяц я откладываю немного денег.
`,
    WX: `
rip-off|s|Twenty pounds for a sandwich is a rip-off.|Двадцать фунтов за сэндвич — это грабёж.
`,
    CARD: {
      'fo4-taste|rich': [0, 0, 'This chocolate cake is very rich.', 'The sauce was too rich for me.', '', '',
        [['heavy', 'тяжёлый, сытный']], [['light', 'лёгкий']], 'rich', null],
      'fo4-taste|off': [0, 0, 'This milk smells off.', 'The fish was off, so we threw it away.', 'The yoghurt has gone off.', '',
        [['bad', 'испорченный']], [['fresh', 'свежий']], 'off', null],
    },
    ADD_EXRU: {
      'This chocolate cake is very rich.': 'Этот шоколадный торт очень сытный.',
      'The sauce was too rich for me.': 'Соус был для меня слишком жирным.',
      'This milk smells off.': 'Это молоко пахнет испорченным.',
      'The fish was off, so we threw it away.': 'Рыба испортилась, и мы её выбросили.',
      'The yoghurt has gone off.': 'Йогурт испортился.',
    },
  });
  // ---- пачка 18 (слова 5101–5400, B2) ----
  wordAuditApply({
    EXRU: `
Job hunting can be stressful.|Поиск работы бывает стрессовым.
She works in recruitment.|Она работает в сфере подбора персонала.
We're recruiting new staff.|Мы набираем новых сотрудников.
There were ten candidates for the job.|На эту должность было десять кандидатов.
I got a job offer yesterday!|Вчера я получил предложение о работе!
My notice period is one month.|Мой срок уведомления об увольнении — месяц.
He handed in his notice on Friday.|В пятницу он подал заявление об уходе.
The probation period is three months.|Испытательный срок — три месяца.
I'm on a fixed-term contract.|Я работаю по срочному договору.
What are your salary expectations?|Каковы ваши ожидания по зарплате?
The company laid off 200 workers.|Компания сократила 200 работников.
He was sacked for being late.|Его уволили за опоздания.
She was dismissed for misconduct.|Её уволили за нарушение дисциплины.
Read the job description carefully.|Внимательно прочитайте описание должности.
We went trekking in Nepal.|Мы ходили в поход по Непалу.
Kayaking on the river was amazing.|Сплав на каяке по реке был потрясающим.
I'd love to try paragliding.|Я бы очень хотел попробовать полетать на параплане.
We went scuba diving in Egypt.|В Египте мы ныряли с аквалангом.
The snorkelling here is great.|Здесь отлично плавать с маской.
Abseiling is scary the first time.|Спуск по верёвке в первый раз — это страшно.
We went white-water rafting.|Мы ходили на рафтинг.
Orienteering is popular in Scandinavia.|Спортивное ориентирование популярно в Скандинавии.
Caving isn't for people who hate small spaces.|Спелеология не для тех, кто не выносит тесноты.
I'd never go bungee jumping.|Я бы никогда не прыгнул с тарзанки.
Wild camping is allowed here.|Здесь разрешено ставить палатку где угодно.
We followed a trail through the forest.|Мы шли по тропе через лес.
I love the adrenaline rush.|Обожаю выброс адреналина.
My brother is a real thrill-seeker.|Мой брат — настоящий любитель острых ощущений.
I do a short workout every morning.|Каждое утро я делаю короткую тренировку.
My personal trainer is very strict.|Мой персональный тренер очень строгий.
I do cardio three times a week.|Я делаю кардио три раза в неделю.
Weightlifting makes you stronger.|Работа с весами делает тебя сильнее.
Do three sets of ten reps.|Сделайте три подхода по десять повторений.
Don't forget stretching after running.|Не забывай о растяжке после бега.
He's trying to build muscle.|Он старается нарастить мышцы.
I want to get in shape for summer.|Я хочу прийти в форму к лету.
I'm really out of shape.|Я совсем не в форме.
Swimming helps you tone up.|Плавание помогает подтянуть тело.
Running improves your endurance.|Бег повышает выносливость.
Yoga is good for flexibility.|Йога полезна для гибкости.
My fitness tracker counts my steps.|Мой фитнес-браслет считает шаги.
A sedentary lifestyle is bad for your health.|Сидячий образ жизни вреден для здоровья.
I have an ache in my shoulder.|У меня ноет плечо.
I've got a throbbing headache.|У меня пульсирующая головная боль.
I felt a sharp pain in my knee.|Я почувствовал острую боль в колене.
There's a dull pain in my back.|У меня тупая боль в спине.
My skin is really itchy.|У меня ужасно чешется кожа.
My fingers are numb with cold.|У меня онемели пальцы от холода.
My neck is stiff.|У меня затекла шея.
My legs are sore after running.|После бега у меня болят ноги.
I feel a bit nauseous.|Меня немного подташнивает.
I'm feeling a bit under the weather.|Я немного приболел.
I was out of breath after the stairs.|После лестницы я запыхался.
I felt faint in the heat.|От жары мне стало дурно.
He passed out in the heat.|Он потерял сознание от жары.
I feel bloated after that meal.|После этой еды у меня вздулся живот.
We put solar panels on the roof.|Мы поставили на крышу солнечные панели.
There are wind turbines on the hill.|На холме стоят ветряные турбины.
The power station uses coal.|Электростанция работает на угле.
Nuclear power is still controversial.|Атомная энергия до сих пор вызывает споры.
Buy energy-efficient light bulbs.|Покупайте энергосберегающие лампочки.
Fuel prices are going up.|Цены на топливо растут.
There's a water shortage this summer.|Этим летом не хватает воды.
Energy consumption is rising.|Потребление энергии растёт.
Water is scarce in the desert.|В пустыне мало воды.
We are depleting the Earth's resources.|Мы истощаем ресурсы Земли.
The oil spill killed thousands of birds.|Разлив нефти погубил тысячи птиц.
The water supply was cut off.|Отключили водоснабжение.
Waste disposal is a big problem.|Утилизация отходов — большая проблема.
Cycle to work to reduce your footprint.|Езди на работу на велосипеде, чтобы уменьшить свой углеродный след.
From my point of view, it's a mistake.|С моей точки зрения, это ошибка.
It seems to me that he's right.|Мне кажется, он прав.
I'm convinced that we'll win.|Я убеждён, что мы победим.
I tend to think it's too expensive.|Я склонен думать, что это слишком дорого.
There's no doubt that she's talented.|Нет сомнений, что она талантлива.
I'm in favour of the new law.|Я за новый закон.
Most people are against the plan.|Большинство людей против этого плана.
On balance, I think we should go.|Взвесив всё, я думаю, нам стоит поехать.
It's widely believed that coffee is bad for you.|Широко распространено мнение, что кофе вреден.
It could be argued that prices are too high.|Можно утверждать, что цены слишком высоки.
I'd go along with that.|С этим я соглашусь.
I take your point, but I still disagree.|Я понимаю вашу мысль, но всё равно не согласен.
`,
    CARD: {
      'fr4-sport|tie': [0, 0, 'A tie gives each team one point.', 'The match ended in a tie.', 'There has never been a tie in the final.', '',
        [['draw', 'ничья']], [], 'ties|tie', ['ties', 'C', '', ['sg', '', 'sg', '']]],
      'fr4-media|engagement': [0, 0, 'Engagement matters more than followers.', 'Engagement was low last month.', 'Engagement has grown since we added videos.', 'Engagement is rising every week.',
        [], [], 'engagement', ['', 'U', 'вовлечённость — неисчисл.', ['sg', '', 'sg', 'sg']]],
    },
    ADD_EXRU: {
      'A tie gives each team one point.': 'При ничьей каждая команда получает по очку.',
      'The match ended in a tie.': 'Матч закончился вничью.',
      'There has never been a tie in the final.': 'В финале ещё ни разу не было ничьей.',
      'Engagement matters more than followers.': 'Вовлечённость важнее количества подписчиков.',
      'Engagement was low last month.': 'В прошлом месяце вовлечённость была низкой.',
      'Engagement has grown since we added videos.': 'С тех пор как мы добавили видео, вовлечённость выросла.',
      'Engagement is rising every week.': 'Вовлечённость растёт с каждой неделей.',
    },
  });
  // ---- пачка 19 (слова 5401–5700, экстра B2) ----
  wordAuditApply({
    EXRU: `
That's debatable.|Это спорно.
I beg to differ — it was a great film.|Позволю себе не согласиться — фильм был отличный.
We arrived at the airport in good time.|Мы приехали в аэропорт заблаговременно.
We booked a last-minute holiday.|Мы забронировали отпуск в последний момент.
We're working to a tight deadline.|Мы работаем в сжатые сроки.
Can you extend the deadline?|Можно продлить срок?
He made excuses to buy time.|Он придумывал оправдания, чтобы выиграть время.
We worked late to make up for lost time.|Мы работали допоздна, чтобы наверстать упущенное.
I'm a bit pressed for time today.|Сегодня у меня маловато времени.
A dishwasher is a great time-saving device.|Посудомойка отлично экономит время.
What's the timescale for the project?|Какие сроки у проекта?
We were working against the clock.|Мы работали наперегонки со временем.
Can you spare a minute?|Можешь уделить минутку?
The deal was saved at the eleventh hour.|Сделку спасли в последний момент.
It was over in the blink of an eye.|Всё закончилось в мгновение ока.
I need a drill to put up this shelf.|Чтобы повесить эту полку, мне нужна дрель.
Pass me the screwdriver.|Передай мне отвёртку.
One screw is missing.|Не хватает одного шурупа.
Use a spanner to tighten it.|Затяни это гаечным ключом.
He cut the wood with a saw.|Он распилил доску пилой.
Measure the wall with a tape measure.|Измерь стену рулеткой.
Clean the paintbrush after use.|После работы промой кисть.
Rub it down with sandpaper.|Ошкурь это наждачной бумагой.
It took hours to assemble the wardrobe.|Собрать шкаф заняло несколько часов.
My dad helped me put up shelves.|Папа помог мне повесить полки.
Tighten the screws.|Затяни шурупы.
Loosen the screw a little.|Немного ослабь шуруп.
We need to drill a hole in the wall.|Нам нужно просверлить дыру в стене.
The hammer is in the toolbox.|Молоток в ящике для инструментов.
Taxes pay for public services.|Налоги идут на государственные услуги.
Contact your local authority.|Обратитесь в местные органы власти.
Take the old fridge to the recycling centre.|Отвези старый холодильник в пункт приёма вторсырья.
The leisure centre has a pool.|В спортивно-развлекательном центре есть бассейн.
`,
    CARD: {
      'de4-sounds|crash': [0, 0, 'I often hear a crash from the kitchen when my son cooks.', 'The plates fell with a loud crash.', '', '',
        [['bang', 'хлопок']], [], 'crash', ['crashes', 'C', '', ['sg', 'sg', '', '']]],
      'da4-phrasal-3|take-back': [['take back', 'took back', 'taken back'], 1, 'I take back what I said.', 'He took back his words the next day.', 'She has never taken back anything she said.', '',
        [['withdraw', 'отозвать, формальнее']], [], 'take|took|taken', null],
      'to4-crime-2|charge': [['charge', 'charged', 'charged'], 0, 'The police usually charge suspects within a day.', 'He was charged with theft.', 'They have charged two men with the robbery.', 'The police are charging him with fraud.',
        [['accuse', 'обвинять']], [['acquit', 'оправдать']], 'charg', null],
    },
    ADD_EXRU: {
      'I often hear a crash from the kitchen when my son cooks.': 'Когда мой сын готовит, я часто слышу грохот с кухни.',
      'The plates fell with a loud crash.': 'Тарелки с грохотом упали.',
      'I take back what I said.': 'Я беру свои слова обратно.',
      'He took back his words the next day.': 'На следующий день он взял свои слова обратно.',
      'She has never taken back anything she said.': 'Она никогда не берёт своих слов обратно.',
      'The police usually charge suspects within a day.': 'Полиция обычно предъявляет обвинение подозреваемым в течение суток.',
      'He was charged with theft.': 'Ему предъявили обвинение в краже.',
      'They have charged two men with the robbery.': 'Двум мужчинам предъявили обвинение в ограблении.',
      'The police are charging him with fraud.': 'Полиция обвиняет его в мошенничестве.',
    },
  });
  // ---- пачка 20 (слова 5701–6000, экстра B2) ----
  wordAuditApply({
    EXRU: `
There are yoga classes at the community centre.|В общественном центре проходят занятия йогой.
He went to the job centre.|Он сходил в центр занятости.
There's a shortage of social housing.|Не хватает социального жилья.
I bought this coat in a charity shop.|Я купил это пальто в благотворительном магазине.
We donated food to the food bank.|Мы пожертвовали еду в продовольственный банк.
Refuse collection is on Thursdays.|Мусор вывозят по четвергам.
The polling station is in the school.|Избирательный участок находится в школе.
You need to register with a GP.|Вам нужно прикрепиться к терапевту.
The residents' association meets monthly.|Ассоциация жильцов собирается раз в месяц.
You need a library card to borrow books.|Чтобы брать книги, нужен читательский билет.
There's great team spirit in our office.|В нашем офисе отличный командный дух.
Staff morale is very low.|Моральный дух сотрудников очень низкий.
I hate office politics.|Терпеть не могу офисные интриги.
I have my annual appraisal next week.|На следующей неделе у меня ежегодная аттестация.
My performance review went well.|Оценка моей работы прошла хорошо.
My boss micromanages everything.|Мой начальник контролирует каждую мелочь.
She joined the trade union.|Она вступила в профсоюз.
There's still a gender pay gap.|Разрыв в оплате между мужчинами и женщинами всё ещё есть.
Job satisfaction is more important than money.|Удовлетворённость работой важнее денег.
The company has high staff turnover.|В компании высокая текучесть кадров.
You need a sick note from your doctor.|Вам нужен больничный лист от врача.
We work flexitime.|Мы работаем по гибкому графику.
Shift work can affect your health.|Сменная работа может сказаться на здоровье.
I took a month's unpaid leave.|Я взял месяц отпуска без сохранения зарплаты.
The narrator is a ten-year-old boy.|Рассказчик — десятилетний мальчик.
The protagonist is a young detective.|Главный герой — молодой детектив.
The setting is a small Scottish village.|Действие происходит в маленькой шотландской деревне.
I didn't see that plot twist coming.|Я не ожидал такого поворота сюжета.
The hardback is more expensive.|Книга в твёрдой обложке дороже.
This is the first edition.|Это первое издание.
Her first novel was published in 2020.|Её первый роман вышел в 2020 году.
He sent the book to a publisher.|Он отправил книгу издателю.
She wrote a memoir about her childhood.|Она написала мемуары о своём детстве.
I prefer short stories to novels.|Рассказы я предпочитаю романам.
He reads a lot of poetry.|Он много читает стихов.
It won a literary prize.|Она получила литературную премию.
The chapter ends on a cliffhanger.|Глава обрывается на самом интересном месте.
This thriller is unputdownable.|От этого триллера невозможно оторваться.
The coastline is very beautiful here.|Здесь очень красивое побережье.
The waves were huge.|Волны были огромные.
Don't swim here, the current is strong.|Не плавай здесь, сильное течение.
The water is shallow near the beach.|У пляжа мелко.
We snorkelled over the coral reef.|Мы плавали с маской над коралловым рифом.
The beach was covered in seaweed.|Пляж был усыпан водорослями.
The kids collected shells.|Дети собирали ракушки.
There's an old lighthouse on the cliff.|На скале стоит старый маяк.
The boats are in the harbour.|Лодки стоят в гавани.
We walked to the end of the pier.|Мы дошли до конца пирса.
We found crabs in the rock pools.|В лужах между скалами мы нашли крабов.
Divers explored the shipwreck.|Дайверы исследовали затонувший корабль.
At low tide you can walk to the island.|Во время отлива до острова можно дойти пешком.
A dead whale was washed up on the beach.|На пляж выбросило мёртвого кита.
`,
    WX: `
burn|syn|
`,
  });
})();
