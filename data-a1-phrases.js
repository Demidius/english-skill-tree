// Three A1 practice topics. Equivalent older entries are consolidated here.
// Legacy progress stays in its original document and is read through these aliases.
const A1_PHRASE_ANSWERS = {};
const A1_PHRASE_PROGRESS = {};
(function () {
  if (typeof W_BRANCHES === 'undefined') return;
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // en, ru, IPA, pronunciation hint, example, translation, past example, translation, note, accepted alternatives
  const phrasal = [
    ['come in', 'входить, заходить внутрь (к говорящему)', 'kʌm ˈɪn', 'кам и́н',
      'Please come in and sit down.', 'Пожалуйста, заходи и садись.',
      'She came in and closed the door.', 'Она вошла и закрыла дверь.',
      'Come указывает на движение к говорящему или к месту, где он находится.'],
    ['come out', 'выходить наружу (к говорящему)', 'kʌm ˈaʊt', 'кам а́ут',
      'Come out and play with us.', 'Выходи и поиграй с нами.',
      'The cat came out of the house.', 'Кошка вышла из дома.',
      'Выйти из чего-то: come out of the house.'],
    ['get out of the car', 'выходить из машины', 'ɡet ˌaʊt əv ðə ˈkɑː', 'гет аут эв зэ ка́',
      'I get out of the car near my house.', 'Я выхожу из машины возле своего дома.',
      'We got out of the car at the zoo.', 'Мы вышли из машины у зоопарка.',
      'Машина или такси: get out of. Автобус или поезд: get off.'],
    ['turn on the light', 'включать свет', 'tɜːn ˌɒn ðə ˈlaɪt', 'тён он зэ ла́йт',
      'I turn on the light when it is dark.', 'Я включаю свет, когда темно.',
      'She turned on the light.', 'Она включила свет.',
      'Можно: turn the light on. С местоимением: turn it on.', ['turn the light on', 'switch on the light', 'switch the light on']],
    ['turn off the light', 'выключать свет', 'tɜːn ˌɒf ðə ˈlaɪt', 'тён оф зэ ла́йт',
      'Please turn off the light.', 'Пожалуйста, выключи свет.',
      'I turned off the light before bed.', 'Я выключил свет перед сном.',
      'Можно: turn the light off. С местоимением: turn it off.', ['turn the light off', 'switch off the light', 'switch the light off']],
    ['put on a jacket', 'надевать куртку', 'pʊt ˌɒn ə ˈdʒækɪt', 'пут он э джэ́кит',
      'I put on a jacket when it is cold.', 'Я надеваю куртку, когда холодно.',
      'He put on a jacket and went out.', 'Он надел куртку и вышел.',
      'Можно: put a jacket on. С местоимением: put it on.', ['put a jacket on', 'put on your jacket', 'put your jacket on', 'put on the jacket', 'put the jacket on']],
    ['take off your shoes', 'снимать обувь', 'teɪk ˌɒf jə ˈʃuːz', 'тэйк оф йэ шу́з',
      'Please take off your shoes here.', 'Пожалуйста, сними здесь обувь.',
      'I took off my shoes at the door.', 'Я снял обувь у двери.',
      'Your меняется по смыслу: my shoes, his shoes. С местоимением: take them off.', ['take your shoes off', 'take off my shoes', 'take my shoes off', 'take off shoes', 'take shoes off']],
    ['pick up a bag', 'поднимать сумку', 'pɪk ˌʌp ə ˈbæɡ', 'пик ап э бэ́г',
      'I pick up a bag from the floor.', 'Я поднимаю сумку с пола.',
      'She picked up a bag and left.', 'Она подняла сумку и ушла.',
      'Можно: pick a bag up. С местоимением: pick it up.', ['pick a bag up', 'pick up the bag', 'pick the bag up']],
    ['put down a bag', 'ставить сумку на пол или другую поверхность', 'pʊt ˌdaʊn ə ˈbæɡ', 'пут даун э бэ́г',
      'I put down a bag next to the door.', 'Я ставлю сумку рядом с дверью.',
      'He put down a bag on the floor.', 'Он поставил сумку на пол.',
      'Можно: put a bag down. С местоимением: put it down.', ['put a bag down', 'put down the bag', 'put the bag down']],
    ['give back a book', 'возвращать книгу (фразовый глагол give back)', 'ɡɪv ˌbæk ə ˈbʊk', 'гив бэк э бу́к',
      'Please give the book back to Anna.', 'Пожалуйста, верни книгу Анне.',
      'I gave the book back to Anna.', 'Я вернул книгу Анне.',
      'Можно: give a book back. С местоимением: give it back.', ['give a book back', 'give back the book', 'give the book back']],
    ['throw away the rubbish', 'выбрасывать мусор', 'θrəʊ əˌweɪ ðə ˈrʌbɪʃ', 'сроу эуэй зэ ра́биш',
      'We throw away the rubbish after lunch.', 'Мы выбрасываем мусор после обеда.',
      'He threw away the rubbish.', 'Он выбросил мусор.',
      'Можно: throw the rubbish away. С местоимением: throw it away.', ['throw the rubbish away', 'throw away rubbish', 'throw rubbish away', 'throw away the trash', 'throw the trash away', 'throw away trash', 'throw trash away']],
    ['turn up the music', 'делать музыку громче', 'tɜːn ˌʌp ðə ˈmjuːzɪk', 'тён ап зэ мью́зик',
      'Please turn up the music a little.', 'Пожалуйста, сделай музыку немного громче.',
      'She turned the music up.', 'Она сделала музыку громче.',
      'Можно: turn the music up. С местоимением: turn it up.', ['turn the music up']],
    ['turn down the music', 'делать музыку тише', 'tɜːn ˌdaʊn ðə ˈmjuːzɪk', 'тён даун зэ мью́зик',
      'Please turn down the music.', 'Пожалуйста, сделай музыку тише.',
      'I turned the music down.', 'Я сделал музыку тише.',
      'Можно: turn the music down. С местоимением: turn it down.', ['turn the music down']],
    ['clean up', 'убираться, наводить чистоту', 'kliːn ˈʌp', 'клин а́п',
      'We clean up after dinner.', 'Мы убираемся после ужина.',
      'They cleaned up after the party.', 'Они убрались после вечеринки.',
      'Можно добавить объект: clean up the kitchen или clean the kitchen up.'],
    ['eat out', 'есть вне дома, в кафе или ресторане', 'iːt ˈaʊt', 'ит а́ут',
      'We eat out on Fridays.', 'По пятницам мы едим в кафе или ресторане.',
      'We ate out last night.', 'Вчера вечером мы ужинали вне дома.',
      'Eat out обычно означает поесть в кафе или ресторане. Поесть на улице: eat outside.'],
    ['turn around', 'поворачиваться в другую сторону', 'tɜːn əˈraʊnd', 'тён эра́унд',
      'Please turn around and look at me.', 'Пожалуйста, повернись и посмотри на меня.',
      'He turned around when I called him.', 'Он повернулся, когда я его позвал.',
      'Также turn round, особенно в британском английском.', ['turn round']],
  ];
  const everyday = [
    ['have tea', 'пить чай', 'hæv ˈtiː', 'хэв ти́',
      'We have tea after lunch.', 'Мы пьём чай после обеда.',
      'I had tea with my friend yesterday.', 'Вчера я пил чай с другом.',
      'Have tea здесь означает пить чай. Have a tea: выпить порцию или чашку чая.', ['drink tea', 'have a tea', 'have a cup of tea', 'drink a cup of tea']],
    ['make coffee', 'готовить кофе', 'meɪk ˈkɒfi', 'мэйк ко́фи',
      'I make coffee every morning.', 'Я готовлю кофе каждое утро.',
      'She made coffee for us.', 'Она приготовила нам кофе.',
      'Напиток готовят с make: make coffee, make tea.', ['make a coffee', 'make a cup of coffee', 'prepare coffee']],
    ['make tea', 'готовить чай', 'meɪk ˈtiː', 'мэйк ти́',
      'Can you make tea for us?', 'Можешь приготовить нам чай?',
      'He made tea after dinner.', 'Он приготовил чай после ужина.',
      'Make tea: приготовить чай. Have tea: выпить чай.', ['make a tea', 'make a cup of tea', 'prepare tea']],
    ['buy groceries', 'покупать продукты', 'baɪ ˈɡrəʊsəriz', 'бай гро́усэриз',
      'We buy groceries on Saturday.', 'Мы покупаем продукты в субботу.',
      'I bought groceries after work.', 'Я купил продукты после работы.',
      'Groceries: продукты и другие повседневные покупки в продуктовом магазине.', ['buy food', 'do the grocery shopping']],
    ['come home', 'приходить домой', 'kʌm ˈhəʊm', 'кам хо́ум',
      'Please come home before dinner.', 'Пожалуйста, приходи домой до ужина.',
      'She came home at six.', 'Она пришла домой в шесть.',
      'Перед home здесь нет to. Get home тоже означает добраться или прийти домой.', ['get home', 'return home']],
    ['read a book', 'читать книгу', 'riːd ə ˈbʊk', 'рид э бу́к',
      'I read a book before bed.', 'Я читаю книгу перед сном.',
      'I read a book on the train yesterday.', 'Вчера я читал книгу в поезде.',
      'Read в настоящем произносится /riːd/, в прошедшем и третьей форме /red/.', ['read the book']],
    ['speak English', 'говорить по-английски', 'spiːk ˈɪŋɡlɪʃ', 'спик и́нглиш',
      'Do you speak English?', 'Ты говоришь по-английски?',
      'We spoke English at the hotel.', 'Мы говорили по-английски в отеле.',
      'Перед названием языка после speak предлог не нужен.', ['speak in English']],
    ['ask a question', 'задавать вопрос', 'ɑːsk ə ˈkwestʃən', 'аск э квэ́счэн',
      'Can I ask a question?', 'Можно задать вопрос?',
      'She asked a question in class.', 'Она задала вопрос на занятии.',
      'Задать кому-то вопрос: ask somebody a question.', ['ask the question']],
    ['answer a question', 'отвечать на вопрос', 'ˈɑːnsər ə ˈkwestʃən', 'а́нсэр э квэ́счэн',
      'Please answer a question about your family.', 'Пожалуйста, ответь на вопрос о своей семье.',
      'He answered the question correctly.', 'Он правильно ответил на вопрос.',
      'После глагола answer предлог to не нужен: answer a question.', ['answer the question']],
    ['take a train', 'ехать на поезде', 'teɪk ə ˈtreɪn', 'тэйк э трэ́йн',
      'We take a train to Warsaw.', 'Мы едем в Варшаву на поезде.',
      'I took a train to the city yesterday.', 'Вчера я поехал в город на поезде.',
      'Также: go by train. В сочетании by train артикля нет.', ['take the train', 'go by train', 'travel by train']],
    ['take a taxi', 'ехать на такси', 'teɪk ə ˈtæksi', 'тэйк э тэ́кси',
      'We take a taxi to the airport.', 'Мы едем в аэропорт на такси.',
      'She took a taxi home.', 'Она поехала домой на такси.',
      'Также: go by taxi. В сочетании by taxi артикля нет.', ['take the taxi', 'get a taxi', 'go by taxi', 'travel by taxi']],
    ['drive to work', 'ехать на работу на машине', 'draɪv tə ˈwɜːk', 'драйв тэ уё́к',
      'I drive to work every day.', 'Я каждый день езжу на работу на машине.',
      'He drove to work yesterday.', 'Вчера он поехал на работу на машине.',
      'Drive обычно означает, что ты сам за рулём.', ['go to work by car']],
    ['be at home', 'быть дома', 'bi ət ˈhəʊm', 'би эт хо́ум',
      'I am at home today.', 'Сегодня я дома.',
      'We were at home last night.', 'Вчера вечером мы были дома.',
      'Место: at home. Направление: go home.', ['at home', 'be home']],
    ['be at work', 'быть на работе', 'bi ət ˈwɜːk', 'би эт уё́к',
      'She is at work now.', 'Она сейчас на работе.',
      'I was at work yesterday morning.', 'Вчера утром я был на работе.',
      'At work употребляется без артикля.', ['at work']],
    ['be at school', 'быть в школе, на занятиях', 'bi ət ˈskuːl', 'би эт ску́л',
      'The children are at school.', 'Дети в школе.',
      'He was at school yesterday.', 'Вчера он был в школе.',
      'At school без артикля: в школе на занятиях. At the school: у конкретного школьного здания или в нём.', ['at school', 'be in school']],
    ['be tired', 'быть уставшим', 'bi ˈtaɪəd', 'би та́йэд',
      'I am tired after work.', 'Я устаю после работы.',
      'We were tired after the trip.', 'Мы устали после поездки.',
      'Состояние передаётся через be: I am tired.', ['tired']],
    ['be hungry', 'быть голодным', 'bi ˈhʌŋɡri', 'би ха́нгри',
      'I am hungry. Can we have lunch?', 'Я голоден. Мы можем пообедать?',
      'She was hungry after school.', 'После школы она была голодна.',
      'Говорим I am hungry, без have.', ['hungry']],
    ['be thirsty', 'хотеть пить, испытывать жажду', 'bi ˈθɜːsti', 'би сё́сти',
      'I am thirsty. Can I have some water?', 'Я хочу пить. Можно мне воды?',
      'We were thirsty after the walk.', 'После прогулки мы хотели пить.',
      'Говорим I am thirsty, без have.', ['thirsty']],
    ['help somebody', 'помогать кому-то', 'help ˈsʌmbədi', 'хэлп са́мбэди',
      'I help my neighbour every week.', 'Я помогаю соседу каждую неделю.',
      'She helped her friend yesterday.', 'Вчера она помогла своему другу.',
      'После help перед человеком предлог не нужен. Somebody и someone равнозначны.'],
    ['call somebody', 'звонить кому-то, звать кого-то', 'kɔːl ˈsʌmbədi', 'кол са́мбэди',
      'I call my mother every evening.', 'Я звоню маме каждый вечер.',
      'He called his friend after work.', 'Он позвонил другу после работы.',
      'После call перед человеком предлог не нужен. Call somebody также может означать позвать кого-то, например к столу.', ['phone somebody', 'telephone somebody']],
  ];
  const prepositions = [
    ['listen to somebody', 'слушать кого-то', 'ˈlɪsən tə ˈsʌmbədi', 'ли́сэн тэ са́мбэди',
      'Please listen to the teacher.', 'Пожалуйста, слушай учителя.',
      'I listened to my friend carefully.', 'Я внимательно выслушал своего друга.',
      'Перед человеком или предметом нужен to: listen to me, listen to music.'],
    ['wait for somebody', 'ждать кого-то', 'weɪt fə ˈsʌmbədi', 'уэйт фэ са́мбэди',
      'I wait for my friend near the station.', 'Я жду друга возле станции.',
      'We waited for Anna outside.', 'Мы ждали Анну на улице.',
      'Перед тем, кого или что ждут, нужен for: wait for me, wait for the bus.'],
    ['look at something', 'смотреть на что-то', 'lʊk ət ˈsʌmθɪŋ', 'лук эт са́мсинг',
      'Look at this photo.', 'Посмотри на эту фотографию.',
      'She looked at the map.', 'Она посмотрела на карту.',
      'Look at: смотреть на. Look for: искать.'],
    ['look for something', 'искать что-то', 'lʊk fə ˈsʌmθɪŋ', 'лук фэ са́мсинг',
      'I look for my keys every morning.', 'Я ищу свои ключи каждое утро.',
      'We looked for a small cafe.', 'Мы искали небольшое кафе.',
      'Look for: искать. Find: найти.'],
    ['talk to somebody', 'разговаривать с кем-то', 'tɔːk tə ˈsʌmbədi', 'ток тэ са́мбэди',
      'I talk to my friend after work.', 'Я разговариваю с другом после работы.',
      'She talked to the teacher yesterday.', 'Вчера она разговаривала с учителем.',
      'Можно также talk with somebody.', ['talk with somebody', 'speak to somebody', 'speak with somebody']],
    ['talk about something', 'говорить о чём-то', 'tɔːk əˈbaʊt ˈsʌmθɪŋ', 'ток эба́ут са́мсинг',
      'We talk about our plans.', 'Мы говорим о наших планах.',
      'They talked about the film.', 'Они говорили о фильме.',
      'С кем: talk to. О чём: talk about.', ['speak about something']],
    ['think about something', 'думать о чём-то', 'θɪŋk əˈbaʊt ˈsʌmθɪŋ', 'синк эба́ут са́мсинг',
      'I often think about my family.', 'Я часто думаю о своей семье.',
      'She thought about her holiday.', 'Она думала о своём отпуске.',
      'Think about подчёркивает размышление. Think of тоже может означать думать о.', ['think of something']],
    ['write to somebody', 'писать кому-то', 'raɪt tə ˈsʌmbədi', 'райт тэ са́мбэди',
      'I write to my friend every week.', 'Я пишу другу каждую неделю.',
      'He wrote to his sister yesterday.', 'Вчера он написал сестре.',
      'В британском английском обычно write to somebody. В американском также write somebody.', ['write somebody']],
    ['live with somebody', 'жить с кем-то', 'lɪv wɪð ˈsʌmbədi', 'лив уиз са́мбэди',
      'I live with my wife.', 'Я живу с женой.',
      'She lived with her parents last year.', 'В прошлом году она жила с родителями.',
      'С кем: with. Где: in a city, in a flat.'],
    ['work with somebody', 'работать с кем-то', 'wɜːk wɪð ˈsʌmbədi', 'уёк уиз са́мбэди',
      'I work with two friends.', 'Я работаю с двумя друзьями.',
      'We worked with Anna yesterday.', 'Вчера мы работали с Анной.',
      'With: вместе с кем-то. For: на кого-то, у кого-то.'],
    ['be good at something', 'хорошо уметь что-то делать', 'bi ˈɡʊd ət ˈsʌmθɪŋ', 'би гуд эт са́мсинг',
      'She is good at English.', 'Ей хорошо даётся английский.',
      'He was good at maths at school.', 'В школе ему хорошо давалась математика.',
      'После at можно использовать существительное или -ing: good at cooking.', ['good at something']],
    ['be interested in something', 'интересоваться чем-то', 'bi ˈɪntrəstɪd ɪn ˈsʌmθɪŋ', 'би и́нтрэстид ин са́мсинг',
      'I am interested in birds.', 'Я интересуюсь птицами.',
      'She was interested in the book.', 'Она заинтересовалась этой книгой.',
      'Нужен in. Interested: заинтересованный. Interesting: интересный.', ['interested in something']],
    ['be afraid of something', 'бояться чего-то', 'bi əˈfreɪd əv ˈsʌmθɪŋ', 'би эфрэ́йд эв са́мсинг',
      'He is afraid of spiders.', 'Он боится пауков.',
      'I was afraid of dogs when I was little.', 'В детстве я боялся собак.',
      'После afraid перед тем, чего боятся, нужен of.', ['afraid of something', 'be scared of something', 'scared of something']],
    ['be late for', 'опаздывать на (работу, занятия, встречу)', 'bi ˈleɪt fə', 'би лэ́йт фэ',
      'I am sometimes late for work.', 'Иногда я опаздываю на работу.',
      'We were late for school on Monday.', 'В понедельник мы опоздали в школу.',
      'Одна связка для разных ситуаций: be late for work, be late for school, be late for a meeting. После be меняется форма: am, is, are, was, were.', ['late for', 'be late for work', 'late for work', 'be late for school', 'late for school', 'be late for a meeting', 'late for a meeting', 'be late for class', 'late for class']],
    ['ask for help', 'просить о помощи', 'ɑːsk fə ˈhelp', 'аск фэ хэ́лп',
      'You can ask for help.', 'Ты можешь попросить о помощи.',
      'I asked for help at the station.', 'Я попросил о помощи на станции.',
      'Ask a question: задать вопрос. Ask for help: попросить о помощи.'],
  ];

  // Explicit topic + word pairs avoid merging unrelated senses of the same verb.
  const merged = [
    ['da-a1-phrasal', 'turn on the light', [['da2-phrasal', 'turn on']]],
    ['da-a1-phrasal', 'turn off the light', [['da2-phrasal', 'turn off']]],
    ['da-a1-phrasal', 'put on a jacket', [['da2-phrasal', 'put on'], ['sh-clothes-2', 'put on']]],
    ['da-a1-phrasal', 'take off your shoes', [['da2-phrasal', 'take off'], ['sh3-clothes-3', 'take off']]],
    ['da-a1-phrasal', 'give back a book', [['da2-phrasal', 'give back']]],
    ['da-a1-phrasal', 'throw away the rubbish', [['da2-phrasal', 'throw away'], ['na3-env-2', 'throw away']]],
    ['da-a1-phrasal', 'turn up the music', [['da2-phrasal', 'turn up']]],
    ['da-a1-phrasal', 'turn down the music', [['da2-phrasal', 'turn down']]],
    ['da-a1-everyday', 'read a book', [['da-verbs', 'read']]],
    ['da-a1-everyday', 'speak English', [['da-verbs', 'speak']]],
    ['da-a1-everyday', 'ask a question', [['da-verbs-2', 'ask']]],
    ['da-a1-everyday', 'be at home', [['ba2-place', 'at home']]],
    ['da-a1-everyday', 'be tired', [['de-feel', 'tired']]],
    ['da-a1-everyday', 'be hungry', [['de-feel', 'hungry']]],
    ['da-a1-everyday', 'be thirsty', [['de-feel', 'thirsty']]],
    ['da-a1-everyday', 'help somebody', [['da-verbs-2', 'help']]],
    ['da-a1-everyday', 'call somebody', [['da-verbs-2', 'call']]],
    ['ba-a1-prepositions', 'listen to somebody', [['da-verbs', 'listen']]],
    ['ba-a1-prepositions', 'wait for somebody', [['ba3-verbprep', 'wait for'], ['da-verbs-2', 'wait']]],
    ['ba-a1-prepositions', 'look at something', [['ba3-verbprep', 'look at']]],
    ['ba-a1-prepositions', 'look for something', [['da2-phrasal', 'look for']]],
    ['ba-a1-prepositions', 'be good at something', [['de3-adjprep', 'good at']]],
    ['ba-a1-prepositions', 'be interested in something', [['de2-eding', 'interested']]],
    ['ba-a1-prepositions', 'be afraid of something', [['de3-adjprep', 'afraid of']]],
    ['ba-a1-prepositions', 'ask for help', [['ba3-verbprep', 'ask for']]],
    ['ba-a1-prepositions', 'be late for', [
      ['wo2-school-2', 'be late for'],
      ['ba-a1-prepositions', 'be late for work'],
      ['ba-a1-prepositions', 'be late for school'],
    ]],
  ];
  const removed = new Set();
  merged.forEach(([id, en, sources]) => {
    A1_PHRASE_PROGRESS[id + '|' + slug(en)] = sources.map(([sourceId, sourceEn]) => {
      const key = slug(sourceEn);
      removed.add(sourceId + '|' + key);
      return [sourceId, key];
    });
  });
  W_BRANCHES.forEach(branch => ['cells', 'extra'].forEach(part => {
    Object.values(branch[part] || {}).forEach(cards => cards.forEach(card => {
      if (typeof card[3] !== 'string') return;
      card[3] = card[3].split(';').filter(row => {
        const en = row.split('|')[0].trim();
        return en && !removed.has(card[0] + '|' + slug(en));
      }).map(row => {
        const fields = row.split('|');
        // These existing cards teach a different sense. Remove the overlapping gloss only.
        if (card[0] === 'da2-phrasal' && fields[0].trim() === 'pick up') {
          fields[1] = 'заехать за кем-то, забрать';
          fields[4] = 'Pick somebody up: заехать за человеком. Поднять предмет: pick up a bag.';
        }
        if (card[0] === 'da4-phrasal-3' && fields[0].trim() === 'put down') {
          fields[1] = 'записать (на бумаге)';
          fields[4] = 'Put down your name: записать имя. Положить предмет: put down a bag.';
        }
        return fields.join('|');
      }).join(';');
    }));
  }));

  function addTopic(branchKey, id, title, gloss, rows) {
    const branch = W_BRANCHES.find(b => b.key === branchKey);
    if (!branch || branch.cells.A1.some(c => c[0] === id)) return;
    const words = rows.map(([en, ru, ipa, pronunciation, example, translation, past, pastRu, note, alternatives = []]) => {
      const key = slug(en);
      if (typeof WORD_TR !== 'undefined' && !WORD_TR[key]) WORD_TR[key] = [ipa, pronunciation];
      if (typeof WORD_EX !== 'undefined' && (!WORD_EX[key] || key === 'be-late-for')) {
        // verb-forms.js fills in V1/V2/V3 after this file is loaded.
        // An imperative example stays on the front instead of being labelled Present Simple.
        const imperative = /^(Please |Come |Look )/.test(example);
        WORD_EX[key] = [0, 0, imperative ? '' : example, past, '', '', [], [], ''];
      }
      if (typeof EX_RU !== 'undefined') {
        if (!EX_RU[example]) EX_RU[example] = translation;
        if (!EX_RU[past]) EX_RU[past] = pastRu;
      }
      const accepted = new Set(alternatives);
      [en, ...alternatives].forEach(a => {
        if (a.includes('somebody')) accepted.add(a.replace(/somebody/g, 'someone'));
      });
      A1_PHRASE_ANSWERS[id + '|' + en.toLowerCase()] = [...accepted];
      return [en, ru, 'v', example, note].join('|');
    }).join(';\n');
    branch.cells.A1.push([id, title, gloss, words]);
  }
  addTopic('daily', 'da-a1-phrasal', 'Фразовые глаголы', 'действия дома и в дороге', phrasal);
  addTopic('daily', 'da-a1-everyday', 'Повседневные сочетания', 'готовые фразы для обычного дня', everyday);
  addTopic('basics', 'ba-a1-prepositions', 'Связки с предлогами', 'к кому, о чём, с кем', prepositions);

  // Keep the A2 pick-up examples on the transport sense after separating the two senses.
  if (typeof WORD_EX !== 'undefined' && WORD_EX['pick-up']) {
    const entry = WORD_EX['pick-up'];
    entry[3] = 'Tom picked up his sister from school.';
    entry[4] = 'Kate has picked up her son from the station.';
    entry[6] = [['collect', 'заехать забрать']];
    entry[7] = [['drop off', 'подвезти и высадить']];
    if (typeof EX_RU !== 'undefined') {
      EX_RU[entry[3]] = 'Том забрал сестру из школы.';
      EX_RU[entry[4]] = 'Кейт забрала сына с вокзала.';
    }
  }
})();
