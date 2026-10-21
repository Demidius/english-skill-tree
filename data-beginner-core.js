// Editorial selection from the supplied Beginner SB/WB, by lesson and section.
// * = a focused vocabulary set; empty = supplementary material only.
// These are exact source entries, not frequency/word-length heuristics.
const BEGINNER_CORE = {
  '1A': [
    "hello|hi|name|What's your name?|My name's ...|I'm ...|Are you ...?|Nice to meet you.|And you?|yes|no|OK|please|thanks|sorry|Just a minute.|a cappuccino|A cappuccino, please.|a tea|teacher|student|class|room",
    '*',
    "day|week|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow|the weekend|What day is it today?|goodbye|bye|See you tomorrow."
  ],
  '1B': [
    'country|city|Brazil|China|Egypt|England|France|Germany|Italy|Japan|Mexico|Poland|Russia|Spain|Switzerland|Turkey|the United States|the USA|the UK|capital|world|music',
    "Where are you from?|I'm from Spain.|Where is it?|I think ...|I don't know.|nice|good|very good|too"
  ],
  'PE1': [
    'alphabet|letter|spell|How do you spell it?|How do you say ...?|first name|surname|last name|Mr|Ms|Mrs|Miss',
    '',
    'classroom|board|door|window|chair|table|laptop|dictionary|paper|pen|bag|book|page',
    "Look at the board, please.|Open your books.|Close your books.|Stand up, please.|Sit down.|Sorry?|Can you repeat that, please?|Excuse me.|What's ... in English?|I don't understand.|I don't know.|Sorry I'm late.|That's OK.|late",
    "hotel|reception|reservation|check into a hotel|I have a reservation.|What's your surname?|Good morning.|Good afternoon.|Good evening.|Thank you.",
    "restaurant|book a table|How can I help you?|A table for tomorrow, please.|How many people?|What time?|That's right.|That's fine."
  ],
  '2A': [
    'nationality|Brazilian|Chinese|Egyptian|English|French|German|Italian|Japanese|Mexican|Polish|Russian|Spanish|Swiss|Turkish|American|British|Portuguese|Arabic|language|Canada|Canadian|Australia|Australian',
    "holiday|business|tourist|dog|free|beautiful|here|over there|on holiday|on business|Are you on holiday?|What's that?|Have a nice day!|Nice to meet you, too."
  ],
  '2B': [
    '*',
    'twenty-one|thirty|forty|fifty|sixty|seventy|eighty|ninety|a hundred|one hundred',
    'personal information|form|age|address|postcode|phone number|mobile number|email|email address|dot|at|identity card|married|single|friend|fine|bus|bus stop',
    "Who's he?|How old is he?|How old are you?|How are you?|I'm fine, thanks.|This is Alex.|What's your phone number?|What's your address?|What's your postcode?|What's your email?|Are you married?|See you later.",
    'bedroom|kitchen|garden|house|school|big|small|near'
  ],
  'R1': ['doctor|children|check into a hotel|give personal information'],
  '3A': [
    'thing|mobile phone|phone|watch|tablet|wallet|purse|pencil|notebook|glasses|sunglasses|photo|phone charger|ID card|passport|umbrella|camera|bank card|key|newspaper|bag|pocket|book|pen',
    "look for|find|every day|Oh no!|Where's my phone?|Where are my glasses?|What is it?|What are they?|What's in your bag?"
  ],
  '3B': [
    'souvenir|cap|scarf|key ring|mug|plate|teddy|T-shirt|postcard|flag|buy|here|there|this|that|these|those',
    "How much is it?|How much are they?|A T-shirt, please.|Is this your phone?|Thank you very much.|You're welcome."
  ],
  'PE2': [
    'price|pound|penny|pence|euro|cent|dollar|money|change|ticket|train ticket|customer|assistant',
    'menu|lunch|pub|sandwich|cheese sandwich|steak|pie|burger|salad|mineral water|orange juice|beer|coffee|tea|Coke|ice|lemon',
    "Who's next?|Can I have a cheese sandwich, please?|Anything else?|No, thanks.|Yes, please.|Here you are.|Here's your change.|Wait for me.|Sure!|Great idea."
  ],
  '4A': [
    '*',
    'family|husband|wife|mother|father|mum|dad|son|daughter|brother|sister|grandmother|grandfather|parents|grandparents|boyfriend|girlfriend|only child',
    "Come in.|This is my husband.|These are our children.|What are their names?|Who's ...?|Can I see?|I remember.|perhaps|lovely"
  ],
  '4B': [
    '*',
    'old|new|big|small|slow|fast|beautiful|ugly|cheap|expensive|clean|dirty|long|short|easy|difficult|good|bad|great|fantastic|awful|terrible|nice|perfect|interesting|very',
    'car|electric car|motorbike|park|easy to park|prefer|love|in my opinion|I love it!|Come with me.|museum|village'
  ],
  'R3': ['tall|hair|dark hair|blond hair|good-looking|a cup of coffee'],
  '5A': [
    'food|fish|meat|pasta|rice|egg / eggs|yogurt|vegetable / vegetables|potato / potatoes|salad|fruit|bread|butter|cheese|sugar|sandwich|cereal|chocolate|toast|soup|jam|apple|orange|chips|hamburger|sausage / sausages|cake|vegetarian',
    'drink|coffee|tea|milk|water|orange juice|wine|beer|a glass of wine|tea with milk|coffee with sugar',
    "meal|breakfast|lunch|dinner|have breakfast|have lunch|have dinner|have a coffee|eat|drink|have|like|don't like|for breakfast|at home|at work|in the morning|in the afternoon|in the evening|early|sometimes|usually|healthy|favourite|doctor|hungry|I'm not hungry.|What about you?"
  ],
  '5B': [
    'live in a flat|live in a house|have breakfast|have lunch|have dinner|watch TV|listen to the radio|listen to music|read the newspaper|read books|eat fast food|drink tea|speak English|want a coffee|have a dog|have children|work in a bank|work for a company|study Spanish|need a new car|go to the gym|go to the cinema',
    'live|watch|listen|read|speak|want|have|work|study|go|need|know|flat|magazine|company|interesting',
    "flight|plane|airport|taxi|taxi driver|traffic|gate|boarding pass|toilet|arrive|at university|at school|Do you like your job?|I need to go to the toilet.|Keep the change.|Have a good flight!|Where to?"
  ],
  'PE3': [
    "time|clock|minute|hour|o'clock|past|to|half|quarter|What time is it?|It's three o'clock.|It's half past three.|It's a quarter to four.|half an hour|in two minutes|meeting|train|tomorrow morning|What time's your train?",
    "feel|tired|cold|hungry|hot|thirsty|I'm tired.|I'm cold.|I'm hungry.|I'm hot.|I'm thirsty.|a glass of water|at the moment|Time for lunch.|Time for bed.",
    "bar|cafe|theatre|cinema|show|meet|I need to go.|You need to hurry.|I'm really sorry.|Don't worry.|Come on.|Let's go."
  ],
  '6A': [
    'job|teacher|doctor|nurse|journalist|waiter|waitress|shop assistant|receptionist|policeman|policewoman|factory worker|taxi driver|student|unemployed|retired',
    "hospital|shop|restaurant|office|school|factory|home|street|university|company|newspaper|work in a hospital|work in a shop|work in an office|work at home|work for an American company|I'm at university.|I'm unemployed at the moment.|I'm retired.",
    "teach|wear|customer|help|welcome|answer the phone|have a meeting|speak English at work|What do you do?|What does she do?|Where do you work?|Where does he teach?|Great to see you.|Why?|Because ..."
  ],
  '6B': [
    'get up|get up early|have a shower|have breakfast|go to work|go to school|go to university|have a coffee|have lunch|finish work|go home|go shopping|go to the gym|make dinner|have dinner|do housework|do homework|watch TV|have a bath|go to bed|start work|make coffee|sleep|relax|walk|go by bus|go by train|go by car|walk to work',
    "always|usually|sometimes|never|often|every morning|every day|in the morning|in the afternoon|in the evening|at night|at the weekend|after breakfast|after work|before breakfast|then|feel tired|What time do you get up?|goodnight",
    'apartment|subway|the Underground|take the subway|turn on the TV'
  ],
  'R5': ['diet|healthy diet|fresh fruit and vegetables|slowly|full|every day'],
  '7A': [
    'free time|go out|go out for a drink|go out for dinner|stay at home|play computer games|do sport|do exercise|go to the beach|go to the cinema|go to the theatre|play tennis|play the piano|swim|relax|meet friends|visit my family|watch sport on TV|go to the supermarket|leave the house',
    "weekend|activity|fun|exciting|pub|supermarket|hairdresser|mountains|town|night|the same|different|It depends.|more or less|Have a nice weekend!|What do you do at the weekend?|How do you relax?"
  ],
  '7B': [
    'film|action film|animation|comedy|drama|horror film|science fiction film|western|TV series|TV programme',
    'actor|actress|film director|song|rich|poor|angry|busy',
    "come|talk|listen to me|understand|cry|move|say|remember|next to|nothing|anything|I love you.|Be quiet.|Don't cry.|Don't move.|Don't say anything.|I don't remember.|Don't be late."
  ],
  'PE4': [
    '*',
    'first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|thirtieth',
    "date|birthday|Christmas Day|New Year's Day|holiday|What's the date today?|When's your birthday?|Are you sure?|This is for you.|Happy Birthday!",
    "phone|call|trip|Who's that?|This is Rob Walker.|Of course!|No problem.|Thanks for calling.|Hurry up!|I'm in a meeting.|Can I call you later?|Call me on this number.|Speak later.",
    'thousand'
  ],
  '8A': [
    'drive|driving licence|driving test|learn to drive|take a test|pass a test|fail a test|practise|start the car|park|nervous|neighbour',
    "can|can't|change money|pay by credit card|pay cash|use a mobile phone|use the internet|take a photo|play football|swim|drive fast|have a coffee|seat|market|town centre|large|medium|small|ready|order|Can I park here?|Where can I park?|Can you help me?|Can I sit here?|I'm free on Monday.|Yes, of course.|No, sorry, I can't.|Are you ready to order?|And to drink?|Why not?"
  ],
  '8B': [
    'buying clothes|camping|cooking|cycling|doing yoga|eating out|flying|going for a walk|going to the cinema|painting|reading|running|shopping|singing|sleeping|swimming|travelling|watching TV series|dancing|driving|listening to music|playing the piano|playing tennis',
    "like|love|don't like|hate|prefer|alone|together|with friends|horrible|happy|Me too!|I love cooking. What about you?|Do you like reading?|I hate flying.",
    'singer|dancer|concert|church|song|play the guitar|once a week'
  ],
  'R7': ['summer|winter|ski|local food|live music|musician|city centre|history|try'],
  '9A': [
    'book tickets|leave the house|pack a suitcase|carry a suitcase|travel|get a taxi|get a train|get a bus|wait for a flight|arrive at a hotel|rent a car|stay in a hotel|phone home|buy presents|wait for somebody|go in|stand|hear|see|rain|do homework|help somebody',
    'suitcase|present|living room|bedroom|kitchen|noise|traffic|bus stop|jacket|outside|inside|website|sea',
    "What are you doing?|What's she doing?|What are they doing?|Everything's fine.|Can you hear it?|Are you sure?|What about you?|Have a good day.|See you then.|I'm waiting outside.|At last!|Don't forget your umbrella."
  ],
  '9B': [
    'clothes|sweater|T-shirt|shirt|trousers|jeans|shorts|suit|dress|skirt|coat|jacket|socks|trainers|shoes|hat|cap|tie|boots|wear a suit|What are you wearing today?',
    'boss|manager|worker|broken|wash the dishes|repair something|serve breakfast|clean a room|work hard|make friends|help customers|stand up|all the time|problem|tired|have a good time'
  ],
  'PE5': [
    'match|football match|ticket|entrance|Tube station|party|exhibition|meeting|invitation|sports centre|win|hope|busy|well',
    "Would you like to come to the match with me?|Would you like to meet for lunch?|Would you like to come to a party?|Would you like to see a film?|Yes, I'd love to.|Sorry, I can't.|I'd love to, but ...|I'm busy on Saturday night.|Let's meet at half past three.|See you there.|When is it?|Can you come at seven?",
    '*',
    "I'd like to ask you something.|I don't think it's a good idea.|It's starting to rain.|Let's ask for the check.",
    'Hi ...|Dear ...|Best wishes|Love|See you soon.'
  ],
  '10A': [
    'bed|pillow|table|lamp|light|remote control|floor|bathroom|bath|shower|towel|cupboard|chair|window|mirror|picture|TV|wi-fi',
    'swimming pool|toilets|restaurant|bar|gym|lift|reception|garden|car park|ground floor|first floor|second floor|upstairs',
    "in|on|under|on the table|under the bed|in the cupboard|on the second floor|There's a TV.|There are some towels.|Is there a lift?|Are there any shops near here?|Do you have a room for tonight?|Can we see it?|Enjoy your stay.|Breakfast is at eight.",
    'coast|island|lake|castle|visitor|day trip|boat trip|view|a great view|friendly'
  ],
  '10B': [
    'at home|at work|at school|at university|in bed|in the kitchen|in a taxi|in London|in the park|in the street|in a restaurant|in a pub|in a museum|in a shopping centre|in a hotel|on a bus|on a train|on a plane|at a party|at the airport|in a hurry',
    'yesterday|yesterday morning|yesterday afternoon|yesterday evening|last night|last week|last month|last year|this morning|for an hour|the next day',
    "bank|interview|true|alone|together|strong|building|wall|keep|Where were you?|I was at home.|Were you alone?|I can't remember."
  ],
  'R9': ['weather|old town|ham|tomato / tomatoes|balcony|painting|get a job|Come on!'],
  '11A': [
    'decide|decide to go|invite|invite friends|offer|offer somebody a job|miss|miss friends and family|visit|visit a park|pick|pick fruit|return|return to your country|rent a house|book flights|pack suitcases|work from home|learn to swim|go back',
    'life|abroad|live abroad|dream|journey|heavy|little|public transport|wonderful|farm|at first|finally|soon|both|another country|for a year'
  ],
  '11B': [
    'get up|get up early|get up late|get a taxi|get a train|get a bus|get a flight|get home|get a job|get married',
    'go home|go out|go to bed|go to school|go to work|go shopping|go to the gym|go to hospital|go to the park',
    'have breakfast|have lunch|have dinner|have a coffee|have a shower|have a bath|have a nice day|have a party|have a good time',
    '*',
    'day|exam|noise|eye / eyes|lucky|wash|enjoy|for the first time|colleague|excited|friendly|ice cream|hand|worried|sunny',
    "I'm back.|How was your day?|Did you have a good day?|What did you do?|What did you do then?|Nothing special.|then|after that|after lunch|after dinner|next week"
  ],
  'PE6': [
    "bank|cash machine|train station|bridge|bus station|post office|chemist's|bookshop|coffee shop|hospital|hotel|school|university|supermarket|museum|cinema|restaurant|park|sports centre|street|road|square|map|North|South|East|West",
    'next to|opposite|between|on the corner|on the left|on the right|near here|outside the bank',
    "turn left|turn right|go straight on|turn into a street|leave the station|take out money|walk there|give directions|ask for directions|lost|We're lost.|Excuse me. Can you help me?|Is there a bank near here?|Is there a cash machine near here?|Sorry, where is that?|This cash machine isn't working.|Is there another one near here?|Thanks very much.|You're welcome.|Just a second."
  ],
  '12A': [
    'buy / bought|leave / left|say / said|see / saw|send / sent|sit / sat|tell / told|write / wrote|arrive|ask|finish|look|move|open|phone|start|stop|talk|wait|smile|happen',
    'platform|station|seat|train|full|concert|message|text',
    "look out of the window|close your eyes|sit down next to somebody|send a message|write an email|turn on a light|That's interesting.|Time to go.|I have time.|I'm new here.|Over here!|Did you have a good trip?|a bit|last month"
  ],
  '12B': [
    'have a good day|be hungry|be tired|do homework|do sport|have lunch|book a flight|pack a suitcase|stay in a hotel|buy new clothes|say sorry to somebody|see a film|send a message|use a laptop|write an email|do housework|get up in the morning|have a nice evening|wait for a bus|go to bed early|miss your family|make lunch|comfortable|river|perfect',
    "yesterday morning|last summer|last weekend|last week|this morning|When was the last time ...?|What did you do last Saturday?|Who with?|Where to?"
  ],
  'R11': ['study abroad|experience|friendly|countryside'],
  'APP1': [
    'I|you|he|she|it|we|they|me|him|her|us|them|my|your|his|its|our|their|something|anything|nothing|everybody',
    'what|where|who|when|why|how|how old|how much|how many|what time|what kind of|whose|which',
    'a / an|the|and|or|but|because|so|if|when|before|after|from|to|of|for|with|in|on|at|by|about|near|outside|inside|under|between|opposite|until|some|any|all|only|also|too|just|really|very|more|less|many|much|now|again|then|later|soon|here|there|well|maybe|perhaps|not',
    'be'
  ],
  'APP2': ['answer / answered|arrive / arrived|ask / asked|book / booked|carry / carried|change / changed|clean / cleaned|close / closed|cook / cooked|decide / decided|finish / finished|help / helped|invite / invited|learn / learned|like / liked|listen / listened|live / lived|look / looked|love / loved|miss / missed|move / moved|need / needed|offer / offered|open / opened|pack / packed|paint / painted|park / parked|phone / phoned|play / played|rain / rained|relax / relaxed|rent / rented|start / started|stay / stayed|stop / stopped|study / studied|talk / talked|travel / travelled|turn / turned|use / used|wait / waited|walk / walked|want / wanted|wash / washed|watch / watched|work / worked', ''],
  'APP3': ['*', 'come|drink|drive|eat|feel|find|forget|give|hear|know|make|meet|pay|put|read|run|sing|sleep|speak|stand|swim|take|teach|think|understand|wear'],
  'APP4': [''],
  'APP5': ['']
};
