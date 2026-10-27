// «Я знаю»: артикль a/an ↔ the. По-русски определённость не видна («в машине» — и in a car,
// и in the car), поэтому в этих сочетаниях засчитываем оба артикля. Список дополняет ART_OK
// из type-to-know.js: сюда вошли свободные сочетания с предлогом или глаголом. Устойчивые выражения
// (at the moment, in the morning, have a shower, on the left…) и сочетания с мн. числом не входят —
// там артикль часть выражения.
// Скрипт подключается раньше type-to-know.js: подставляет ответ учебника до основной проверки,
// так же как это делает ART_OK.
(function () {
  const OK = new Set([
    'get a new job', 'accept a proposal', 'meet in a club', 'meet in a coffee bar', 'live in a flat',
    'read the newspaper', 'work in a bank', 'need a new car', 'go to the cinema', 'get a flight',
    'wait for the bus', 'work in an office', 'read a book', 'take an umbrella', 'need a new phone',
    'drive a car', 'call a taxi', 'buy a newspaper', 'leave your bag on a train', 'find a parking space',
    'talk to a friend', 'sing a song', 'hear a noise', 'send a text message', 'meet a friend', 'paint a picture',
    'draw a picture', 'wait for a bus', 'run a race', 'see a film', 'go to a restaurant', 'get a newspaper',
    'get a taxi', 'get an email', 'get to the airport', 'empty the dishwasher', 'wash the car',
    'resolve a problem', 'keep a promise', 'break a promise', 'invent a story', 'push the door', 'pull the door',
    'miss a bus', 'miss a class', 'take an umbrella with you', 'look for a job', 'find a job', 'look up a word',
    'fill in a form', 'have breakfast in a café', 'get a ticket', 'get into a car', 'get out of a car',
    'get a text message', 'get a present', 'get a prize', 'get the bus', 'on the table', 'live in a house',
    'clean the floor', 'load the dishwasher', 'unload the dishwasher', 'in a café', 'skip a meal',
    'take somebody to a restaurant', 'take a test', 'start the car', 'tickets for a concert', 'turn on a light',
    'go past the church', 'meet somebody at the airport', 'solve a crime', 'solve a mystery',
    'interview a suspect', 'stay at a campsite', 'check in for a flight', 'board a plane', 'miss a flight',
    'catch a flight', 'miss a train', 'catch a train', 'fill up a car', 'under the bridge', 'along the street',
    'round the lake', 'around the lake', 'through the tunnel', 'into the shop', 'across the road',
    'over the bridge', 'past the church', 'towards the lake', 'out of the shop', 'put on a shirt',
    'try on a shirt', 'click on an item', 'ask for a refund', 'confirm a payment', 'in a hospital', 'in a shop',
    'in a restaurant', 'in an office', 'in a school', 'in a factory', 'in the street', 'clean a room',
    'share a photo', 'download an app', 'skype a friend', 'upload a video', 'message a friend', 'post a tweet',
    'send an email', 'listen to a song', 'set up a business', 'do a training course', 'work for a company',
    'update an app', 'delete a photo', 'print out a boarding pass', 'connect a phone to a laptop',
    'dial a number', 'learn a new skill', 'cheat in an exam', 'revise for an exam', 'look up a translation',
    'mime a word', 'get an answer right', 'get an answer wrong', 'do an exam', 'do an exercise', 'pass an exam',
    'fail an exam', 'leave a voicemail message', 'return a call', 'take a message', 'try to find a job',
    'apply for a job', 'accept an offer', 'create an account', 'receive an email', 'set up a website',
    'go to the theatre', 'meet at the station', 'leave the house', 'pack a suitcase', 'carry a suitcase',
    'wait for a flight', 'arrive at a hotel', 'stay in a hotel', 'book a flight', 'rent a flat',
    'stay in a hostel', 'make a list', 'learn a language', 'cook a recipe', 'get in a taxi', 'go to a gig',
    'kick a ball', 'throw a ball', 'run a marathon', 'shoot a film', 'star in a film', 'watch a tv series',
    'leave the club', 'play a song', 'in a car', 'in the kitchen', 'in the park', 'on a train', 'on a plane',
    'in the wardrobe', 'in front of the table', 'on the chair', 'under the bed', 'behind the sofa',
    'opposite the woman', 'next to the armchair', 'over the mirror', 'from the bedroom to the bathroom',
    'into the wardrobe', 'out of the wardrobe', 'through the window', 'arrive at an airport', 'in a village',
    'in a town', 'in a city', 'get an invitation', 'in the corner', 'on the wall', 'in a photo',
    'at the airport', 'at the station', 'at a bus stop', 'in a room', 'in a building', 'in a park',
    'in a garden', 'on a bus', 'on a bike', 'on the floor', 'on a shelf', 'on the balcony', 'on the roof',
    'on a river', 'arrive in a city', 'pay for a meal', 'belong to a club', 'tell a joke', 'tell a story'
  ]);
  // та же нормализация, что в type-to-know.js
  const norm = s => String(s).toLowerCase().replace(/[’`ʼ']/g, '').replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ').trim().replace(/^(to|a|an|the) /, '');
  document.addEventListener('submit', ev => {
    const form = ev.target;
    if (!form || !form.classList || !form.classList.contains('kbox')) return;
    const inp = form.querySelector('#knownIn'), en = form.dataset.wordEn;
    if (!inp || !en || !OK.has(en.toLowerCase()) || typeof SkillCore === 'undefined') return;
    const typed = norm(inp.value), want = norm(en);
    if (typed && typed !== want && SkillCore.articleEquivalent(want, typed)) inp.value = en;
  }, true);
})();
