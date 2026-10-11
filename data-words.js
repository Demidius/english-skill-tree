
const LEVELS = [
  {key:'A1', book:'Beginner',           c:'--a1'},
  {key:'A2', book:'Pre-Intermediate',   c:'--a2'},
  {key:'B1', book:'Intermediate',       c:'--b1'},
  {key:'B2', book:'Upper-Intermediate', c:'--b2'},
];
const POS_ORDER = ['n','v','a','o'];
const POS_NAME = {n:'noun', v:'verb', a:'adj', o:'other'};
const POS_RU = {n:'существительное', v:'глагол', a:'прилагательное', o:'фраза / служебное слово'};

// real card: [id, title, gloss, words]
// words = "english | русский | pos | example ; ..."   pos: n v a o
// planned card (words later): [title, gloss]
const W_BRANCHES = [
 {key:'people', name:'People & family', ru:'Люди и семья', color:'#4a8a5a',
  info:'Кто ты, кто рядом: семья, личные данные, страны и национальности.',
  cells:{A1:[
   ['pe-family','Family','члены семьи',`
    mother|мать|n|My mother is a teacher.;
    father|отец|n|My father works in a bank.;
    parents|родители|n|My parents live in Warsaw.;
    brother|брат|n|I have one brother.;
    sister|сестра|n|Her sister is very tall.;
    son|сын|n|Their son is five years old.;
    daughter|дочь|n|This is my daughter, Anna.;
    husband|муж|n|Her husband is a doctor.;
    wife|жена|n|My wife likes birds.;
    children|дети|n|They have two children.;
    grandmother|бабушка|n|My grandmother makes great soup.;
    grandfather|дедушка|n|My grandfather is eighty.;
    baby|младенец, малыш|n|The baby is sleeping.;
    family|семья|n|I have a big family.`],
   ['pe-info','Personal information','анкета о себе',`
    man|мужчина|n|Who is that man?;
    woman|женщина|n|That woman is my teacher.;
    boy|мальчик|n|The boy is playing football.;
    girl|девочка|n|The girl has long hair.;
    friend|друг, подруга|n|Tom is my best friend.;
    first name|имя|n|What's your first name?;
    surname|фамилия|n|How do you spell your surname?;
    age|возраст|n|Write your name and age here.;
    address|адрес|n|What's your address?;
    phone number|номер телефона|n|Can I have your phone number?;
    email|электронная почта|n|Please write your email here.;
    married|женатый, замужем|a|Are you married?;
    single|холост, не замужем|a|My brother is single.;
    live|жить|v|I live in Poland.;
    be born|родиться|v|I was born in 1990.`],
   ['pe-countries','Countries & nationalities','страна и прилагательное от неё',`
    Poland|Польша|n|Kraków is in Poland.;
    Polish|польский|a|She speaks Polish.;
    Russia|Россия|n|Moscow is in Russia.;
    Russian|русский|a|My first language is Russian.;
    Ukraine|Украина|n|Kyiv is the capital of Ukraine.;
    Ukrainian|украинский|a|He's Ukrainian.;
    England|Англия|n|London is in England.;
    British|британский|a|I like British films.;
    the USA|США|n|New York is in the USA.;
    American|американский|a|Her husband is American.;
    Germany|Германия|n|Berlin is in Germany.;
    German|немецкий|a|German cars are good.;
    Spain|Испания|n|We go to Spain every summer.;
    Spanish|испанский|a|I love Spanish food.;
    Italy|Италия|n|Rome is in Italy.;
    Italian|итальянский|a|Pizza is Italian.`],
   ],
A2:[
   ['pe2-look','Appearance','как выглядит человек',`
    slim|стройный|a|She's tall and slim.|вежливее, чем thin;
    thin|худой|a|He's very thin.;
    overweight|с лишним весом|a|My cat is a bit overweight.|вежливее, чем fat;
    medium height|среднего роста|o|He's of medium height.;
    curly|кудрявый|a|She has curly hair.;
    straight|прямой (о волосах)|a|I have long straight hair.;
    wavy|волнистый|a|Her hair is wavy.;
    fair|светлый (о волосах, коже)|a|He has fair hair.|также blond(e);
    bald|лысый|a|My grandfather is bald.;
    beard|борода|n|He has a long beard.;
    moustache|усы|n|My dad has a moustache.|амер. mustache;
    good-looking|привлекательный, симпатичный|a|Her brother is very good-looking.|также attractive;
    look like|быть похожим на (внешне)|v|You look like your mother.|вопрос о внешности — What does he look like?;
    wear glasses|носить очки|v|I wear glasses for reading.`],
   ['pe2-character','Personality','характер',`
    friendly|дружелюбный|a|Our neighbours are very friendly.;
    kind|добрый|a|It's very kind of you.;
    funny|смешной, с юмором|a|My friend is really funny.|ещё значит «странный»;
    clever|умный|a|She's a clever student.|амер. smart;
    shy|застенчивый|a|He's shy with new people.;
    lazy|ленивый|a|My cat is very lazy.;
    hard-working|трудолюбивый|a|She's very hard-working.;
    generous|щедрый|a|My grandmother is very generous.;
    mean|жадный|a|Don't be mean — share your sweets.|в США mean чаще «злой, вредный»;
    patient|терпеливый|a|Teachers need to be patient.|ещё существительное «пациент»;
    talkative|разговорчивый|a|The children are very talkative today.;
    serious|серьёзный|a|He's quiet and serious.;
    selfish|эгоистичный|a|It was selfish of me.;
    honest|честный|a|Please be honest with me.|h не читается: an honest man`],
   ['pe2-family','Family & relationships 2','семья и отношения',`
    relationship|отношения|n|They have a good relationship.;
    stepmother|мачеха|n|She gets on well with her stepmother.;
    stepbrother|сводный брат|n|My stepbrother is two years older than me.;
    half-sister|единокровная, единоутробная сестра|n|I have a half-sister in Canada.;
    bride|невеста (на свадьбе)|n|The bride wore a white dress.;
    groom|жених (на свадьбе)|n|The groom was very nervous.;
    guest|гость|n|We had fifty guests at the wedding.;
    fiancé|жених (помолвленный)|n|This is my fiancé, Mark.|о девушке — fiancée;
    be in love|быть влюблённым|o|They are in love.;
    introduce|представлять, знакомить|v|Let me introduce my wife.;
    kiss|целовать, поцелуй|v|He kissed her goodbye.;
    together|вместе|o|We live together.`],
   ],
B1:[
   ['pe3-relationships','Relationships','знакомство, дружба, отношения',`
    get to know|узнать поближе|v|I got to know her at university.;
    go out with|встречаться с (парнем, девушкой)|v|He's going out with Anna.|амер. также date;
    break up|расстаться|v|They broke up last month.|также split up;
    fall in love|влюбиться|o|They fell in love in Paris.|в кого-то — fall in love with;
    get engaged|обручиться|o|We got engaged last summer.;
    partner|партнёр, спутник жизни|n|Is your partner coming to the party?;
    couple|пара (двое, влюблённые)|n|They're a lovely couple.|a couple of — пара, несколько;
    close friend|близкий друг|n|She's my closest friend.;
    acquaintance|знакомый (человек)|n|He's not a friend, just an acquaintance.;
    have a lot in common|иметь много общего|o|We have a lot in common.;
    lose touch|потерять связь|o|We lost touch after school.|поддерживать связь — keep in touch;
    argue|спорить, ссориться|v|They argue about money.|ссора — argument;
    make up|помириться|v|They argued but soon made up.;
    trust|доверять|v|I trust my best friend completely.`],
   ['pe3-personality','Personality adjectives','характер подробнее',`
    reliable|надёжный|a|She's very reliable — she's never late.;
    stubborn|упрямый|a|My brother is very stubborn.;
    ambitious|амбициозный|a|He's ambitious and wants to be a manager.;
    sensitive|чувствительный, ранимый|a|She's very sensitive to criticism.|разумный — sensible!;
    sensible|разумный, здравомыслящий|a|That's a sensible decision.;
    bossy|любящий командовать|a|My sister is a bit bossy.;
    moody|с переменчивым настроением|a|Teenagers can be moody.;
    confident|уверенный (в себе, в успехе)|a|She's confident when she speaks in public.;
    easy-going|спокойный, лёгкий в общении|a|My husband is very easy-going.;
    organised|организованный|a|You need to be organised in this job.|амер. organized;
    rude|грубый|a|It's rude to interrupt.;
    charming|обаятельный|a|He's a charming young man.;
    independent|независимый|a|She's very independent.;
    jealous|ревнивый, завистливый|a|He gets jealous easily.`],
   ['pe3-rel-2','Relationships 2','дружба и общение',`
    best friend|лучший друг|n|Tom has been my best friend since school.;
    mate|приятель (брит., разг.)|n|I'm going out with my mates tonight.|брит. разг.;
    get along with|ладить с|v|I get along with everyone at work.|брит. также get on with;
    rely on|полагаться на|v|You can always rely on me.;
    keep in touch|поддерживать связь|o|Let's keep in touch!;
    have an argument|поссориться|o|We had an argument about money.;
    apologise to|извиниться перед|o|You should apologise to her.;
    forgive|прощать|v|I forgive you.;
    support|поддерживать|v|My family always supports me.;
    ex|бывший, бывшая|n|I saw my ex at the party.;
    date|свидание|n|They went on a first date.;
    propose|сделать предложение|v|He proposed to her in Paris.;
    flirt|флиртовать|v|He was flirting with the waitress.;
    get divorced|развестись|o|They got divorced after ten years.`],
   ['pe3-look-3','Appearance 3','подробнее о внешности',`
    wrinkles|морщины|n|My grandmother has lots of wrinkles.;
    ponytail|хвост (причёска)|n|She wears her hair in a ponytail.;
    fringe|чёлка|n|I want to cut a fringe.|амер. bangs;
    shoulder-length|до плеч|a|She has shoulder-length hair.;
    well-built|крепкого телосложения|a|He's tall and well-built.;
    skinny|тощий|a|He was very skinny as a child.;
    muscular|мускулистый|a|He's very muscular.;
    scar|шрам|n|He has a scar on his face.;
    false teeth|вставные зубы|n|Grandad has false teeth.;
    go grey|седеть|o|My dad is going grey.;
    resemble|быть похожим (книжн.)|v|She resembles her mother.|формальнее, чем look like;
    attractive|привлекательный|a|She's a very attractive woman.;
    casually dressed|одет по-простому|o|He was casually dressed.;
    well-dressed|хорошо одетый|a|She's always well-dressed.`],
   ['pe3-social','Social life','общение и встречи',`
    host|хозяин (вечеринки), принимать гостей|n|Our host made a wonderful dinner.;
    get-together|встреча, посиделки|n|We have a family get-together every Christmas.;
    housewarming party|новоселье|n|They invited us to their housewarming party.;
    reunion|встреча (выпускников, родных)|n|We had a school reunion last year.;
    socialise|общаться, проводить время с людьми|v|I don't have much time to socialise.;
    meet up|встретиться (договорившись)|v|Let's meet up for coffee next week.;
    stay in|остаться дома (вечером)|v|I'm tired, let's stay in tonight.;
    accept an invitation|принять приглашение|o|We accepted their invitation to dinner.;
    turn down an invitation|отклонить приглашение|o|I had to turn down the invitation.;
    have people over|принимать гостей у себя|o|We often have people over at weekends.;
    small talk|светская беседа, разговор ни о чём|n|I'm not very good at small talk.;
    make conversation|поддерживать разговор|o|He tried to make conversation with her.;
    introduce yourself|представиться|o|Please introduce yourself to the group.`],
   ],
B2:[
   ['pe4-rel-2','Relationships B2','отношения глубже',`
    commitment|обязательство, преданность|n|Marriage is a big commitment.;
    bond|связь, узы|n|There's a strong bond between them.;
    drift apart|отдалиться|v|We drifted apart after university.;
    get on someone's nerves|действовать на нервы|o|His jokes get on my nerves.;
    have a crush on|быть влюблённым в|o|She has a crush on her teacher.;
    settle down|остепениться|v|He wants to settle down and have kids.;
    split up|расстаться, разойтись (о паре)|v|They split up last year.;
    patch things up|наладить отношения (после ссоры)|o|They patched things up after the argument.;
    confide in|доверять секреты|v|I confide in my sister.;
    let someone down|подвести|o|I won't let you down.;
    stand by|поддерживать (быть рядом в трудную минуту)|v|She stood by him in difficult times.;
    take for granted|воспринимать как должное|o|Don't take your parents for granted.;
    mutual|взаимный|a|We have a lot of mutual friends.;
    estranged|отчуждённый, в разрыве|a|He's estranged from his father.`],
   ['pe4-pers-3','Personality B2','характер подробнее',`
    assertive|напористый, уверенный|a|You need to be more assertive at work.;
    conscientious|добросовестный|a|She's a conscientious student.;
    down-to-earth|приземлённый, простой|a|Despite being famous, he's very down-to-earth.;
    self-centred|эгоцентричный|a|He's so self-centred.;
    big-headed|зазнавшийся|a|Don't get big-headed.;
    absent-minded|рассеянный|a|My dad is so absent-minded.;
    bad-tempered|вспыльчивый|a|He's bad-tempered in the morning.;
    two-faced|двуличный|a|I don't trust her, she's two-faced.;
    tactful|тактичный|a|Be tactful when you tell her.;
    gullible|доверчивый|a|He's so gullible he believes anything.;
    sarcastic|саркастичный|a|Don't be sarcastic.;
    witty|остроумный|a|She's very witty.;
    straightforward|прямой, открытый|a|He's straightforward and honest.;
    resourceful|находчивый|a|She's very resourceful in a crisis.`],
   ['pe4-society','People & society','общество',`
    citizen|гражданин|n|Every citizen can vote.;
    immigrant|иммигрант|n|Many immigrants work in the city.;
    minority|меньшинство|n|They're a minority in the country.;
    majority|большинство (людей, голосов)|n|The majority voted yes.;
    equality|равенство|n|We believe in equality.;
    discrimination|дискриминация|n|Discrimination is illegal.;
    stereotype|стереотип|n|That's just a stereotype.;
    tolerant|терпимый|a|We should be tolerant of others.;
    volunteer|волонтёр|n|She works as a volunteer.;
    charity|благотворительность|n|We gave money to charity.;
    poverty|бедность|n|Many people live in poverty.;
    wealthy|состоятельный|a|It's a wealthy area.;
    elderly people|пожилые люди|n|Elderly people need support.;
    the public|общественность|n|The park is open to the public.`],
   ['pe4-character','Character traits B2','черты характера',`
    reserved|сдержанный|a|He's quite reserved with strangers.;
    outgoing|общительный, открытый|a|She's very outgoing and makes friends easily.;
    determined|целеустремлённый, решительный|a|She's determined to pass the exam.;
    cautious|осторожный (избегающий риска)|a|He's a cautious driver.;
    impulsive|импульсивный|a|Don't be so impulsive, think first.;
    trustworthy|заслуживающий доверия|a|I need someone trustworthy.;
    loyal|преданный|a|Dogs are very loyal animals.;
    sincere|искренний|a|Please accept my sincere apologies.;
    humble|скромный (непритязательный)|a|Despite his success, he's very humble.;
    vain|тщеславный|a|He's so vain, he always looks in the mirror.;
    stingy|скупой (разг.)|a|Don't be stingy, buy a round of drinks!;
    spontaneous|спонтанный|a|We made a spontaneous decision to go to Paris.;
    eccentric|эксцентричный, чудаковатый|a|My uncle is a bit eccentric.;
    rebellious|бунтарский|a|He was a rebellious teenager.`],
   ['pe4-family','Family life B2','семейная жизнь',`
    sibling|брат или сестра|n|Do you have any siblings?;
    extended family|большая семья, родня|n|We see our extended family at Christmas.;
    nuclear family|семья из родителей и детей|n|The nuclear family is getting smaller.;
    single parent|родитель-одиночка|n|She's a single parent with two kids.;
    foster parents|приёмные родители (временные)|n|He grew up with foster parents.;
    household|домохозяйство, семья|n|There are four people in our household.;
    breadwinner|кормилец семьи|n|She's the main breadwinner in the family.;
    raise|растить (детей)|v|They raised three children.;
    spoil|баловать|v|Grandparents love to spoil their grandchildren.;
    discipline|дисциплина, наказывать|n|Children need some discipline.;
    sibling rivalry|соперничество между детьми|n|There's a lot of sibling rivalry in our house.;
    generation gap|разрыв поколений|n|There's a big generation gap between us.;
    inherit|унаследовать|v|She inherited the house from her aunt.;
    ancestor|предок|n|My ancestors came from Ukraine.`],
   ]},
  extra:{A1:[
   ['pe-family-2','Family 2','родственники',`
    cousin|двоюродный брат, сестра|n|My cousin lives in Germany.;
    aunt|тётя|n|My aunt is a nurse.;
    uncle|дядя|n|My uncle has a farm.;
    niece|племянница|n|My niece is three years old.;
    nephew|племянник|n|I bought a present for my nephew.;
    grandparents|бабушка и дедушка|n|My grandparents live in a village.;
    grandson|внук|n|Their grandson is at university.;
    granddaughter|внучка|n|She has one granddaughter.;
    twins|близнецы|n|My sisters are twins.;
    relatives|родственники|n|All our relatives came to the wedding.;
    boyfriend|парень (молодой человек)|n|Her boyfriend is from Spain.;
    girlfriend|девушка (подруга)|n|This is my girlfriend, Kate.;
    only child|единственный ребёнок|n|I'm an only child.;
    parent|родитель|n|Every parent wants the best for their child.`],
   ['pe-info-2','About me 2','ещё о себе',`
    country|страна|n|What country are you from?;
    language|язык|n|I speak two languages.;
    nationality|национальность, гражданство|n|What's your nationality?;
    birthday|день рождения|n|When's your birthday?;
    date of birth|дата рождения|n|Write your date of birth here.;
    postcode|почтовый индекс|n|What's your postcode?|амер. zip code;
    form|анкета, бланк|n|Please fill in this form.;
    sign|подписать (документ)|v|Sign here, please.|подпись — signature;
    full name|полное имя|n|Write your full name in capital letters.;
    Mr / Mrs / Ms|господин / госпожа|o|This is Mr Smith and Mrs Smith.|Ms — нейтрально, без указания брака;
    divorced|разведённый|a|My parents are divorced.;
    from|из (откуда)|o|I'm from Russia but I live in Poland.;
    year old|лет (о возрасте)|o|I'm thirty-five years old.|часто просто I'm 35`],
   ['pe-countries-2','Countries 2','ещё страны и национальности',`
    France|Франция|n|Paris is in France.;
    French|французский|a|I love French cheese.;
    China|Китай|n|China is a very big country.;
    Chinese|китайский|a|Chinese food is popular here.;
    Japan|Япония|n|Tokyo is in Japan.;
    Japanese|японский|a|He drives a Japanese car.;
    Brazil|Бразилия|n|They speak Portuguese in Brazil.;
    Brazilian|бразильский|a|She's Brazilian.;
    Ireland|Ирландия|n|Dublin is the capital of Ireland.;
    Irish|ирландский|a|We went to an Irish pub.;
    Scotland|Шотландия|n|Edinburgh is in Scotland.;
    Scottish|шотландский|a|He has a Scottish accent.|не Scotch — это виски;
    Canada|Канада|n|Canada is very cold in winter.;
    Canadian|канадский|a|My neighbour is Canadian.;
    Greece|Греция|n|We went to Greece last summer.;
    Greek|греческий|a|I love Greek salad.`],
   ],
A2:[
   ['pe2-look-2','Appearance 2','возраст и детали внешности',`
    blonde|блондинка, светловолосая|a|She has long blonde hair.|о мужчине чаще blond;
    dark-haired|темноволосый|a|He's tall and dark-haired.;
    handsome|красивый (о мужчине)|a|Her husband is very handsome.;
    pretty|симпатичная, миловидная|a|What a pretty girl!;
    cute|милый, хорошенький (о детях, животных)|a|Your baby is so cute!;
    middle-aged|средних лет|a|He's a middle-aged man.;
    elderly|пожилой (вежливо)|a|An elderly woman sat next to me.|вежливее, чем old;
    in his twenties|ему за двадцать|o|He's in his twenties.|in her thirties — ей за тридцать;
    teenager|подросток|n|Their son is a teenager now.;
    freckles|веснушки|n|She has red hair and freckles.;
    pale|бледный|a|You look pale. Are you OK?;
    tanned|загорелый|a|He came back from holiday very tanned.;
    tattoo|татуировка|n|He has a tattoo on his arm.`],
   ['pe2-character-2','Personality 2','ещё черты характера',`
    polite|вежливый|a|Always be polite to customers.;
    calm|спокойный|a|Stay calm, everything is OK.;
    brave|смелый|a|The firefighter was very brave.;
    cheerful|жизнерадостный|a|She's always cheerful in the morning.;
    curious|любопытный|a|Children are very curious.;
    helpful|готовый помочь|a|The staff were very helpful.;
    strict|строгий|a|My teacher was very strict.;
    silly|глупый, дурашливый|a|Don't be silly!;
    loud|громкий|a|He has a very loud voice.;
    modest|скромный|a|She's very modest about her success.;
    sociable|общительный|a|He's sociable and loves parties.;
    positive|позитивный|a|Try to stay positive.;
    nice|приятный, хороший|a|Your sister is really nice.;
    nervous|нервный, волнующийся|a|I'm always nervous before exams.`],
   ['pe2-life','Life events','этапы жизни',`
    leave school|окончить школу (уйти из школы)|o|I left school at eighteen.;
    go to university|поступить в университет|o|She went to university in Warsaw.;
    start work|начать работать|o|I started work in 2010.;
    have a baby|родить ребёнка|o|They had a baby last year.;
    pregnant|беременная|a|My sister is pregnant.;
    wedding|свадьба|n|We went to a wedding on Saturday.;
    anniversary|годовщина|n|It's our wedding anniversary today.;
    honeymoon|медовый месяц|n|They went to Italy on their honeymoon.;
    divorce|развод|n|Their divorce was difficult.;
    die|умереть|v|My grandfather died last year.|мёртвый — dead, смерть — death;
    funeral|похороны|n|The funeral is on Monday.;
    birthday party|день рождения (праздник)|n|Are you coming to my birthday party?;
    grow old|стареть|o|I want to grow old with you.`],
   ],
B1:[
   ['pe3-pers-2','Personality 2','ещё черты характера',`
    reliable|надёжный|a|I need someone reliable.;
    mature|зрелый|a|She's very mature for her age.|незрелый — immature;
    open-minded|непредубеждённый|a|My parents are very open-minded.;
    narrow-minded|ограниченный|a|Don't be so narrow-minded.;
    self-confident|уверенный в себе (о характере)|a|He looks very self-confident.;
    insecure|неуверенный|a|She feels insecure about her English.;
    arrogant|высокомерный|a|He's rude and arrogant.;
    considerate|внимательный к другим|a|It was very considerate of you.;
    thoughtful|заботливый, задумчивый|a|What a thoughtful present!;
    unreliable|ненадёжный|a|The bus service is unreliable.;
    competitive|любящий соревноваться|a|He's very competitive in sport.;
    creative|творческий|a|She's a very creative person.;
    impatient|нетерпеливый|a|Don't be so impatient!;
    responsible|ответственный|a|She's very responsible for her age.`],
   ['pe3-generations','Generations','поколения и возраст',`
    childhood|детство|n|I had a happy childhood.;
    teenage years|подростковые годы|n|My teenage years were difficult.;
    adult|взрослый|n|The film is for adults only.;
    grown-up|взрослый (разг.)|n|Ask a grown-up to help you.;
    generation|поколение|n|Three generations live in this house.;
    old age|старость|n|He's still active in old age.;
    pensioner|пенсионер|n|Pensioners travel free.|также senior citizen;
    toddler|малыш (1–3 года)|n|Toddlers need a lot of attention.;
    upbringing|воспитание|n|She had a strict upbringing.;
    look after|заботиться о|v|I look after my grandmother.;
    grow up|расти, взрослеть|v|Where did you grow up?;
    in-laws|родственники мужа/жены|n|We spend Christmas with my in-laws.;
    stepfather|отчим|n|My stepfather is very kind.;
    adopt|усыновить|v|They adopted a little girl.`],
   ],
B2:[
   ['pe4-body-lang','Body language & manners','жесты и манеры',`
    frown|хмуриться|v|Why are you frowning?;
    shrug|пожать плечами|v|He just shrugged.;
    wink|подмигнуть|v|She winked at me.;
    raise your eyebrows|поднять брови|o|He raised his eyebrows in surprise.;
    eye contact|зрительный контакт|n|Make eye contact during the interview.;
    gesture|жест|n|He made a rude gesture.;
    bow|кланяться|v|In Japan people bow.;
    posture|осанка|n|Good posture is important.;
    fidget|ёрзать|v|The kids fidgeted during the film.;
    blush|краснеть|v|She blushed when he smiled.;
    grin|широко улыбаться|v|He grinned at me.;
    sigh|вздыхать|v|She sighed with relief.;
    etiquette|этикет|n|Table etiquette is important here.;
    interrupt|перебивать|v|Don't interrupt me.`],
   ['pe4-personality-idioms','Character idioms','идиомы о людях',`
    a pain in the neck|зануда, головная боль|o|My neighbour is a pain in the neck.;
    a know-all|всезнайка|n|Nobody likes a know-all.;
    a couch potato|лежебока|n|He's a real couch potato.;
    a night owl|сова (о человеке)|n|I'm a night owl, I work late.;
    an early bird|жаворонок|n|She's an early bird.;
    a good laugh|весёлый человек|o|Tom's a good laugh.;
    down in the dumps|в унынии|o|He's been down in the dumps lately.;
    over the moon|на седьмом небе|o|She was over the moon about the job.;
    a cold fish|холодный человек|o|He's a bit of a cold fish.;
    the life and soul of the party|душа компании|o|She's the life and soul of the party.;
    a big fish in a small pond|первый парень на деревне|o|He's a big fish in a small pond.;
    have a heart of gold|иметь золотое сердце|o|My grandma has a heart of gold.;
    a lone wolf|одиночка|n|He's a lone wolf at work.;
    as stubborn as a mule|упрямый как осёл|o|He's as stubborn as a mule.`],
   ['pe4-idioms','Family & relationship idioms','устойчивые выражения',`
    run in the family|передаваться по наследству|o|Red hair runs in the family.;
    take after|быть похожим на (родственника)|v|She takes after her father.;
    bring up|воспитывать (вырастить)|v|I was brought up by my grandparents.|воспитание — upbringing;
    grow up|расти, взрослеть|v|I grew up in a small town.;
    look up to|уважать, равняться на|v|I've always looked up to my brother.;
    look down on|смотреть свысока|v|Don't look down on other people.;
    fall out with|поссориться с|v|She fell out with her sister.;
    get on like a house on fire|сразу поладить|o|We got on like a house on fire.;
    the black sheep|паршивая овца|o|He's the black sheep of the family.;
    see eye to eye|сходиться во взглядах|o|We don't always see eye to eye.;
    flesh and blood|родная кровь|o|She's my own flesh and blood.;
    break the ice|растопить лёд|o|A joke helped to break the ice.;
    be on the same wavelength|быть на одной волне|o|We're on the same wavelength.`],
   ]}},

 {key:'describe', name:'Describing', ru:'Описание и чувства', color:'#b3401f',
  info:'Прилагательные: размер, цвет, качество, чувства. Их удобно учить парами противоположностей.',
  cells:{A1:[
   ['de-common','Common adjectives','учатся парами',`
    big|большой|a|They have a big house.;
    small|маленький|a|My flat is small.;
    old|старый|a|This car is very old.;
    new|новый|a|I have a new phone.;
    young|молодой|a|Our teacher is young.;
    good|хороший|a|This is a good book.;
    bad|плохой|a|The weather is bad today.;
    long|длинный|a|It's a long street.;
    short|короткий, низкий|a|It's a short film.;
    tall|высокий (о человеке)|a|My brother is very tall.;
    beautiful|красивый|a|What a beautiful city!;
    ugly|некрасивый|a|That building is ugly.;
    cheap|дешёвый|a|This T-shirt is cheap.;
    expensive|дорогой|a|London is expensive.;
    easy|лёгкий, простой|a|The test was easy.;
    difficult|трудный|a|English grammar is difficult.`],
   ['de-colours','Colours','цвета и оттенки',`
    red|красный|a|I have a red car.;
    blue|синий, голубой|a|The sky is blue.;
    green|зелёный|a|Her eyes are green.;
    yellow|жёлтый|a|Bananas are yellow.;
    black|чёрный|a|He always wears black.;
    white|белый|a|The walls are white.;
    grey|серый|a|It's a grey day.;
    brown|коричневый|a|My dog is brown.;
    orange|оранжевый|a|She has an orange bag.;
    pink|розовый|a|The flowers are pink.;
    purple|фиолетовый|a|I don't like purple.;
    dark|тёмный|a|He has dark hair.;
    light|светлый (о цвете, комнате)|a|I want a light blue shirt.;
    colour|цвет|n|What's your favourite colour?`],
   ['de-feel','Feelings','как ты себя чувствуешь',`
    happy|счастливый, довольный|a|I'm very happy today.;
    sad|грустный|a|Why are you sad?;
    tired|усталый|a|I'm tired after work.;
    hungry|голодный|a|I'm hungry. Let's eat!;
    thirsty|испытывающий жажду|a|Can I have some water? I'm thirsty.;
    angry|злой, сердитый|a|My boss is angry.;
    bored|скучающий|a|The children are bored.;
    worried|обеспокоенный|a|She's worried about the exam.;
    stressed|в стрессе|a|I'm stressed at work.;
    relaxed|расслабленный|a|I feel relaxed on holiday.;
    busy|занятой|a|Sorry, I'm busy now.;
    fine|в порядке|a|I'm fine, thanks.;
    excited|в предвкушении, взволнованный|a|We're excited about the trip.;
    feel|чувствовать (себя)|v|How do you feel today?`],
   ],
A2:[
   ['de2-eding','-ed / -ing adjectives','bored или boring',`
    bored|скучающий (мне скучно)|a|I'm bored. Let's go out.|-ed — что я чувствую, -ing — что вызывает чувство;
    boring|скучный (фильм, урок)|a|The film was boring.;
    interested|заинтересованный|a|I'm interested in birds.|всегда interested in;
    interesting|интересный|a|It's an interesting book.;
    tiring|утомительный|a|It was a long, tiring day.|я устал — I'm tired;
    exciting|захватывающий|a|The match was very exciting.|я в предвкушении — I'm excited;
    surprised|удивлённый|a|I was surprised to see him.;
    surprising|удивительный|a|The result was surprising.;
    frightened|испуганный|a|She's frightened of dogs.|также scared;
    frightening|пугающий|a|It was a frightening film.|также scary;
    disappointed|разочарованный|a|I was disappointed with the hotel.;
    disappointing|разочаровывающий|a|The food was disappointing.;
    relaxing|расслабляющий|a|A walk in the forest is very relaxing.|я расслаблен — I'm relaxed;
    confusing|запутанный, непонятный|a|The instructions are confusing.|я запутался — I'm confused`],
   ['de2-opposites','Opposites with un-, im-, dis-','приставки-отрицания',`
    unhappy|несчастный|a|He looks unhappy.;
    unfriendly|недружелюбный|a|The waiter was unfriendly.;
    unusual|необычный|a|That's an unusual name.;
    unkind|недобрый|a|That was unkind of you.;
    impossible|невозможный|a|It's impossible to sleep here.;
    impolite|невежливый|a|It's impolite to be late.|также rude;
    dishonest|нечестный|a|He was dishonest with me.;
    untidy|неопрятный, неубранный|a|My room is very untidy.|амер. messy;
    uncomfortable|неудобный|a|These shoes are uncomfortable.;
    unhealthy|вредный для здоровья|a|Fast food is unhealthy.;
    unlucky|невезучий|a|I'm always unlucky with the weather.;
    dangerous|опасный|a|This road is dangerous.|противоположное — safe;
    safe|безопасный|a|Is it safe to swim here?`],
   ['de2-common','Common adjectives 2','частые прилагательные',`
    excellent|превосходный, отличный|a|Your work is excellent.;
    horrible|ужасный, противный|a|The weather was horrible.;
    popular|популярный|a|This café is very popular.;
    special|особенный|a|Today is a special day.;
    comfortable|удобный|a|This sofa is very comfortable.;
    normal|обычный, нормальный|a|It's normal to feel nervous.;
    correct|правильный (без ошибок)|a|Is this answer correct?;
    simple|простой|a|The rules are very simple.;
    lucky|везучий|a|You're lucky to have such good friends.;
    alone|один, в одиночестве|a|She lives alone.;
    alive|живой|a|Is the fish still alive?;
    dead|мёртвый|a|The plant is dead.;
    crazy|сумасшедший|a|That's a crazy idea!`],
   ],
B1:[
   ['de3-adjprep','Adjective + preposition','afraid of, good at',`
    afraid of|бояться|o|I'm afraid of spiders.;
    good at|хорошо уметь|o|She's good at maths.;
    bad at|плохо уметь|o|I'm bad at remembering names.;
    fond of|любить, питать нежность|o|I'm very fond of my grandmother.;
    proud of|гордиться|o|We're proud of our son.;
    tired of|устать от|o|I'm tired of waiting.;
    keen on|увлекаться|o|He's keen on photography.|брит., разг. также into;
    worried about|беспокоиться о|o|I'm worried about the exam.;
    excited about|радостно ждать|o|We're excited about the holiday.;
    angry with|злиться на (кого-то)|o|She's angry with me.|на что-то — angry about;
    different from|отличаться от|o|My life is different from yours.;
    similar to|похож на|o|Your bag is similar to mine.;
    responsible for|ответственный за|o|Who is responsible for this?;
    famous for|знаменит чем-то|o|Kraków is famous for its old town.`],
   ['de3-strong','Strong adjectives','очень-очень',`
    freezing|ледяной|a|It's freezing outside!|с сильными прилагательными — absolutely, не very;
    boiling|очень жаркий|a|It's boiling in here.;
    huge|огромный|a|They live in a huge house.;
    tiny|крошечный|a|The flat is tiny.;
    delicious|очень вкусный|a|This cake is delicious.;
    exhausted|измотанный|a|I'm exhausted after work.;
    starving|умирающий от голода|a|When's dinner? I'm starving!;
    furious|в ярости|a|My dad was furious.;
    terrified|в ужасе (от страха)|a|She's terrified of flying.;
    amazing|потрясающий|a|The view was amazing.;
    awful|ужасный, отвратительный|a|The weather was awful.|также terrible;
    filthy|очень грязный|a|Your shoes are filthy!;
    fascinating|очень интересный|a|It's a fascinating book.;
    brilliant|блестящий, отличный|a|That's a brilliant idea!|брит. разг. «отлично!»`],
   ['de3-opinion','Giving opinions','оценочные слова',`
    worth it|оно того стоит|o|It's expensive but worth it.;
    overrated|переоценённый|a|I think that film is overrated.;
    underrated|недооценённый|a|It's a really underrated band.;
    impressive|впечатляющий|a|Your English is impressive.;
    disgusting|отвратительный|a|The food was disgusting.;
    pointless|бессмысленный|a|The meeting was pointless.;
    unforgettable|незабываемый|a|It was an unforgettable trip.;
    predictable|предсказуемый|a|The ending was predictable.;
    reasonable|разумный, приемлемый|a|The prices are reasonable.;
    fair|справедливый|a|That's not fair!;
    unfair|несправедливый|a|The decision was unfair.;
    obvious|очевидный|a|The answer is obvious.;
    strange|странный|a|That's strange.|также weird (разг.);
    ordinary|обычный, заурядный|a|It was just an ordinary day.`],
   ['de3-feel-2','Emotions B1','чувства и состояние',`
    confused|запутавшийся|a|I'm confused. Can you explain again?;
    embarrassed|смущённый|a|I felt embarrassed when I fell.;
    stressed out|в сильном стрессе|a|I'm stressed out at work.;
    fed up|надоело|a|I'm fed up with my job.;
    homesick|скучающий по дому|a|She felt homesick in London.;
    in a good mood|в хорошем настроении|o|You're in a good mood today!;
    in a bad mood|в плохом настроении|o|The boss is in a bad mood.;
    feel like|хотеть (чего-то)|v|I feel like a pizza.|+ -ing: I feel like going out;
    cheer up|приободриться|v|Cheer up! It's not so bad.;
    calm down|успокоиться|v|Calm down and tell me.;
    get upset|расстроиться|o|Don't get upset.;
    lose your temper|выйти из себя|o|He lost his temper and shouted.;
    burst into tears|расплакаться|o|She burst into tears.;
    mood|настроение|n|What's your mood today?`],
   ['de3-useful','Useful adjectives B1','полезные прилагательные',`
    available|доступный, свободный|a|Is the room still available?;
    convenient|удобный (по времени, месту)|a|Is Monday convenient for you?;
    familiar|знакомый (на вид, на слух)|a|Her face looks familiar.;
    typical|типичный|a|This is a typical Polish dish.;
    suitable|подходящий|a|This film isn't suitable for children.;
    necessary|необходимый|a|Is it necessary to book in advance?;
    valuable|ценный|a|This ring is very valuable.;
    private|частный, личный|a|This is a private beach.;
    public|общественный, публичный|a|Smoking is not allowed in public places.;
    complicated|сложный, запутанный|a|The instructions are too complicated.;
    accurate|точный|a|Is this information accurate?;
    basic|базовый, основной|a|I have a basic knowledge of German.;
    original|оригинальный, первоначальный|a|That's a very original idea.;
    traditional|традиционный|a|We had a traditional English breakfast.`],
   ],
B2:[
   ['de4-wordparts','Prefixes & suffixes','слова из частей',`
    careful|осторожный, аккуратный|a|Be careful with that knife!|-ful — полный чего-то;
    careless|небрежный|a|It was a careless mistake.|-less — без чего-то;
    useful|полезный (пригодный для дела)|a|That's a useful tip.;
    useless|бесполезный|a|This old phone is useless.;
    hopeless|безнадёжный|a|The situation is hopeless.;
    disagree|не соглашаться|v|I disagree with you.|dis- — отрицание;
    misunderstand|неправильно понять|v|Sorry, I misunderstood you.|mis- — неправильно;
    overcooked|пережаренный|a|The meat was overcooked.|over- — слишком;
    underpaid|недооплачиваемый|a|Nurses are underpaid.|under- — недостаточно;
    rewrite|переписать|v|Please rewrite the first paragraph.|re- — снова;
    irresponsible|безответственный|a|It was irresponsible of him.|ir- перед r, il- перед l;
    illegal|незаконный|a|Parking here is illegal.;
    washable|моющийся|a|The sofa cover is washable.|-able — можно сделать;
    unbelievable|невероятный|a|The ending was unbelievable.`],
   ['de4-feelings','Feelings in depth','оттенки чувств',`
    upset|расстроенный|a|She was upset about the news.;
    delighted|очень рад|a|I'm delighted to meet you.;
    thrilled|в восторге|a|We're thrilled with the new flat.;
    ashamed|стыдно (за поступок)|a|I'm ashamed of what I did.|неловко — embarrassed;
    embarrassed|неловко, смущённый|a|I was so embarrassed!|не «беременна» — это pregnant;
    anxious|тревожащийся (о человеке)|a|I feel anxious before exams.;
    grateful|благодарный|a|I'm grateful for your help.;
    lonely|одинокий (чувство)|a|She feels lonely in the new city.|один, без компании — alone;
    homesick|скучающий по дому|a|I was homesick in my first year abroad.;
    relieved|испытывающий облегчение|a|I was relieved to hear the news.;
    fed up|сыт по горло|a|I'm fed up with this weather.;
    envious|завидующий (книжн.)|a|I'm envious of your holiday.;
    overwhelmed|перегруженный, подавленный|a|I feel overwhelmed at work.;
    nostalgic|ностальгирующий|a|This song makes me nostalgic.`],
   ['de4-feel-2','Feelings B2 2','ещё чувства',`
    bewildered|сбитый с толку|a|I was bewildered by the instructions.;
    horrified|в ужасе (шокированный увиденным)|a|We were horrified by the news.;
    outraged|возмущённый|a|People were outraged by the decision.;
    heartbroken|убитый горем|a|She was heartbroken when he left.;
    content|довольный (жизнью), удовлетворённый|a|I'm content with my life.;
    ecstatic|в экстазе|a|The fans were ecstatic.;
    apprehensive|полный опасений|a|I'm apprehensive about the operation.;
    resentful|обиженный|a|He felt resentful about it.;
    indifferent|равнодушный|a|He was indifferent to her problems.;
    puzzled|озадаченный|a|She looked puzzled.;
    petrified|окаменевший от страха|a|I was petrified of the dark.;
    at ease|непринуждённо|o|I feel at ease with you.;
    on edge|на взводе|o|I've been on edge all day.;
    moved|тронутый|a|I was moved by his speech.`],
   ['de4-adj-2','Descriptive adjectives B2','яркие прилагательные',`
    breathtaking|захватывающий дух|a|The view was breathtaking.;
    spectacular|зрелищный, впечатляющий|a|The fireworks were spectacular.;
    stunning|потрясающий (о красоте)|a|She looks stunning.;
    dull|скучный, тусклый|a|It was a dull party.;
    bland|пресный|a|The food was bland.;
    shabby|потрёпанный|a|He wore a shabby coat.;
    cramped|тесный|a|The flat is cramped.;
    vast|огромный|a|Russia is a vast country.;
    remote|отдалённый|a|They live in a remote village.;
    picturesque|живописный|a|It's a picturesque village.;
    run-down|запущенный|a|It's a run-down area.;
    state-of-the-art|самый современный|a|The hospital has state-of-the-art equipment.;
    outdated|устаревший|a|The software is outdated.;
    vivid|яркий, живой|a|I have vivid memories of that day.`],
   ['de4-describe-people','Describing people B2','о людях подробнее',`
    slender|стройный (изящный)|a|She's tall and slender.;
    stocky|коренастый|a|He's short and stocky.;
    plump|полноватый|a|She's a bit plump.;
    scruffy|неряшливый|a|He always looks scruffy.;
    elegant|элегантный|a|She's always elegant.;
    wrinkled|морщинистый|a|His face was wrinkled.;
    receding hairline|залысины|n|He has a receding hairline.;
    clean-shaven|гладко выбритый|a|He's clean-shaven.;
    striking|бросающийся в глаза|a|She has striking blue eyes.;
    pale-skinned|бледнокожий|a|He's pale-skinned.;
    in her early thirties|немного за тридцать|o|She's in her early thirties.;
    in his late fifties|под шестьдесят|o|He's in his late fifties.;
    take after|пойти в (родителя)|v|She takes after her mother.;
    well-groomed|ухоженный|a|He's always well-groomed.`],
   ['de4-objects','Describing objects B2','описание вещей',`
    fragile|хрупкий|a|Be careful, it's fragile.;
    durable|прочный, долговечный|a|These boots are very durable.;
    sturdy|крепкий, устойчивый|a|We need a sturdy table.;
    flimsy|непрочный, хлипкий|a|The tent was too flimsy for the storm.;
    compact|компактный|a|This camera is very compact.;
    bulky|громоздкий|a|The sofa was too bulky for the lift.;
    lightweight|лёгкий (по весу)|a|I need a lightweight jacket.;
    transparent|прозрачный|a|Put it in a transparent plastic bag.;
    waterproof|водонепроницаемый|a|Is your watch waterproof?;
    portable|переносной|a|We bought a portable speaker.;
    versatile|универсальный|a|A black dress is very versatile.;
    handy|удобный, полезный|a|This little knife is really handy.;
    delicate|нежный, деликатный|a|Wash delicate fabrics by hand.;
    solid|твёрдый, сплошной, цельный|a|The table is made of solid oak.`],
   ]},
  extra:{A1:[
   ['de-common-2','Common adjectives 2','ещё пары противоположностей',`
    fast|быстрый (о скорости)|a|This is a fast car.|быстро — тоже fast;
    slow|медленный|a|The internet is very slow today.;
    rich|богатый|a|He's very rich.;
    poor|бедный|a|They're a poor family.;
    full|полный|a|The bus is full.;
    empty|пустой|a|The fridge is empty.;
    heavy|тяжёлый|a|My bag is very heavy.;
    strong|сильный|a|He's very strong.;
    weak|слабый|a|I feel weak after the flu.;
    open|открытый|a|Is the shop open?;
    closed|закрытый|a|The museum is closed on Monday.;
    right|верный, правильный|a|That's the right answer.|ещё «правый»: on the right;
    wrong|неправильный|a|Sorry, wrong number.;
    same|одинаковый, тот же|a|We have the same car.|всегда с the;
    different|разный, другой|a|We are very different.`],
   ['de-common-3','Useful adjectives','полезные прилагательные',`
    great|отличный|a|That's a great idea!;
    lovely|прелестный, чудесный|a|What a lovely day!;
    wonderful|замечательный|a|We had a wonderful time.;
    perfect|идеальный|a|Your English is perfect.;
    important|важный|a|This is very important.;
    possible|возможный|a|Is it possible to pay by card?;
    ready|готовый|a|Dinner is ready!;
    sure|уверенный|a|Are you sure?;
    true|правдивый, верный|a|Is it true?;
    real|настоящий|a|Is that a real diamond?;
    famous|знаменитый|a|He's a famous actor.;
    free|свободный, бесплатный|a|Are you free tonight?;
    quick|быстрый, короткий (по времени)|a|Can I ask a quick question?`],
   ],
A2:[
   ['de2-eding-2','-ed / -ing adjectives 2','ещё пары чувств',`
    amazed|поражённый|a|I was amazed by the view.;
    amazing|потрясающий|a|The concert was amazing.;
    annoyed|раздражённый|a|I'm annoyed with my brother.;
    annoying|раздражающий|a|That noise is really annoying.;
    shocked|потрясённый|a|We were shocked by the news.;
    shocking|шокирующий|a|The prices are shocking.;
    worrying|тревожный|a|The situation is worrying.;
    pleased|довольный|a|I'm pleased with my results.;
    scared|испуганный (разг.)|a|Don't be scared, it's only a dog.;
    cross|сердитый (брит., разг.)|a|Mum was cross with me.|брит. разг.;
    glad|рад|a|I'm glad you came.|только после глагола: I'm glad;
    satisfied|удовлетворённый|a|Are you satisfied with the service?`],
   ['de2-things','Describing things','форма, материал, на ощупь',`
    soft|мягкий|a|This pillow is very soft.;
    hard|твёрдый (на ощупь)|a|The bed is too hard.|ещё «трудный»;
    smooth|гладкий|a|The table is smooth.;
    rough|шершавый, грубый|a|The wall is rough.;
    round|круглый|a|We have a round table.;
    square|квадратный|a|The box is square.;
    flat|плоский|a|The Netherlands is very flat.;
    sharp|острый|a|Be careful, the knife is sharp.;
    wooden|деревянный|a|I bought a wooden chair.;
    metal|металлический|a|The gate is made of metal.;
    leather|кожаный|a|He wears a leather jacket.;
    cotton|хлопковый|a|It's a cotton shirt.;
    wool|шерсть|n|This jumper is made of wool.|шерстяной — woollen;
    glass|стекло|n|The table is made of glass.`],
   ],
B1:[
   ['de3-adjprep-2','Adjective + preposition 2','ещё сочетания',`
    aware of|осознающий|o|Are you aware of the problem?;
    capable of|способный на|o|She's capable of anything.;
    full of|полный чего-то|o|The room was full of people.;
    jealous of|завидующий|o|He's jealous of his brother.;
    sick of|сыт по горло|o|I'm sick of this rain.;
    nervous about|волнующийся из-за|o|I'm nervous about the interview.;
    upset about|расстроенный из-за|o|She's upset about the news.;
    crazy about|без ума от|o|He's crazy about football.;
    married to|женат на, замужем за|o|She's married to a doctor.|не married with;
    kind to|добрый к|o|Be kind to animals.;
    polite to|вежливый с|o|Be polite to your teachers.;
    surprised at|удивлён чем-то|o|I was surprised at the price.|также surprised by;
    pleased with|доволен чем-то|o|I'm pleased with my new car.;
    keen on|увлечён|o|She's keen on tennis.`],
   ['de3-strong-2','Strong adjectives 2','ещё «очень-очень»',`
    gorgeous|великолепный, красивый|a|What a gorgeous dress!;
    hilarious|уморительный|a|The film was hilarious.;
    ancient|древний|a|We visited an ancient castle.;
    enormous|громадный|a|They have an enormous garden.;
    astonished|изумлённый|a|I was astonished by the news.;
    thrilled|в восторге|a|She was thrilled with the present.;
    devastated|убитый горем|a|He was devastated when his dog died.;
    packed|битком набитый|a|The bus was packed.;
    spotless|безупречно чистый|a|The kitchen was spotless.;
    fantastic|фантастический|a|We had a fantastic time.;
    terrible|ужасный, страшный|a|The traffic was terrible.;
    ridiculous|нелепый|a|That's a ridiculous idea.;
    silent|безмолвный|a|The street was silent.;
    tremendous|огромный, потрясающий|a|It was a tremendous success.`],
   ],
B2:[
   ['de4-wordparts-2','Prefixes & suffixes 2','ещё части слов',`
    overestimate|переоценить|v|I overestimated my abilities.;
    underestimate|недооценить|v|Don't underestimate him.;
    outnumber|превосходить численно|v|Women outnumber men here.;
    outgrow|вырасти из|v|The kids outgrew their clothes.;
    misbehave|плохо себя вести|v|The children misbehaved.;
    mislead|вводить в заблуждение|v|The advert was misleading.;
    pre-war|довоенный|a|It's a pre-war building.;
    post-war|послевоенный|a|Post-war Poland was poor.;
    ex-wife|бывшая жена|n|He still talks to his ex-wife.;
    anti-social|асоциальный|a|Anti-social behaviour is a problem.;
    self-employed|самозанятый|a|I'm self-employed.;
    childhood|детство|n|I had a happy childhood.|-hood — состояние;
    friendship|дружба|n|Our friendship is important.|-ship — отношение;
    happiness|счастье|n|Money doesn't buy happiness.|-ness — качество`],
   ['de4-collocations','Adjective collocations','устойчивые сочетания',`
    heavy traffic|плотное движение|n|There was heavy traffic.;
    strong coffee|крепкий кофе|n|I need a strong coffee.;
    high expectations|высокие ожидания|n|My parents had high expectations.;
    deep sleep|глубокий сон|n|I fell into a deep sleep.;
    bitter disappointment|горькое разочарование|n|It was a bitter disappointment.;
    fierce competition|жёсткая конкуренция|n|There's fierce competition for jobs.;
    vital role|ключевая роль|n|Bees play a vital role in nature.;
    narrow escape|чудом спасся|n|We had a narrow escape.;
    slight chance|небольшой шанс|n|There's a slight chance of rain.;
    common sense|здравый смысл|n|Use your common sense.;
    close friend|близкий друг|n|She's a close friend.;
    broad smile|широкая улыбка|n|He had a broad smile.;
    hard evidence|веские доказательства|n|There's no hard evidence.;
    sharp increase|резкий рост|n|There was a sharp increase in prices.`],
   ['de4-sounds','Sounds','звуки',`
    bang|удар, хлопок|n|I heard a loud bang.;
    crash|грохот|n|There was a crash in the kitchen.;
    creak|скрипеть|v|The door creaked.;
    rattle|греметь|v|The windows rattled in the wind.;
    buzz|жужжать|v|A bee was buzzing.;
    hum|гудеть, напевать|v|The fridge hums at night.;
    whisper|шёпот|n|She spoke in a whisper.;
    scream|кричать (от страха)|v|She screamed when she saw the spider.;
    sniff|шмыгать носом, нюхать|v|The dog sniffed the bag.;
    tick|тикать|v|The clock was ticking.;
    squeak|пищать|v|The mouse squeaked.;
    rustle|шелестеть|v|The leaves rustled.;
    roar|рёв|n|We heard the roar of the engine.;
    tweet|чирикать|v|The birds are tweeting.`],
   ]}},

 {key:'time', name:'Numbers & time', ru:'Числа и время', color:'#557fa1',
  info:'Числа, дни, месяцы, часы и предлоги времени. Это нужно в каждом разговоре.',
  cells:{A1:[
   ['ti-numbers','Tricky numbers','13 или 30? порядковые',`
    eleven|одиннадцать|n|The shop opens at eleven.;
    twelve|двенадцать|n|There are twelve months in a year.;
    thirteen|тринадцать|n|She's thirteen years old.;
    thirty|тридцать|n|I'm thirty.;
    fifteen|пятнадцать|n|It takes fifteen minutes.;
    fifty|пятьдесят|n|The ticket costs fifty złoty.;
    eighteen|восемнадцать|n|He's eighteen next week.;
    eighty|восемьдесят|n|My grandmother is eighty.;
    a hundred|сто|n|There are a hundred people here.;
    a thousand|тысяча|n|The bike costs a thousand euros.;
    first|первый|a|It's my first day at work.;
    second|второй|a|We live on the second floor.;
    third|третий|a|Take the third street on the left.;
    fifth|пятый|a|Today is the fifth of May.;
    twelfth|двенадцатый|a|My birthday is on the twelfth of June.;
    twentieth|двадцатый|a|It's the twentieth of March.`],
   ['ti-days','Days & parts of the day','неделя и сутки',`
    Monday|понедельник|n|I start work on Monday.;
    Tuesday|вторник|n|We have English on Tuesday.;
    Wednesday|среда|n|The museum is closed on Wednesday.;
    Thursday|четверг|n|See you on Thursday!;
    Friday|пятница|n|Friday is my favourite day.;
    Saturday|суббота|n|On Saturday I sleep late.;
    Sunday|воскресенье|n|We visit my parents on Sunday.;
    weekend|выходные|n|What do you do at the weekend?;
    morning|утро|n|I drink coffee in the morning.;
    afternoon|день (после обеда)|n|I work in the afternoon.;
    evening|вечер|n|We watch TV in the evening.;
    night|ночь|n|I can't sleep at night.;
    today|сегодня|o|Today is Friday.;
    tomorrow|завтра|o|See you tomorrow!;
    yesterday|вчера|o|I was at home yesterday.`],
   ['ti-months','Months & seasons','месяцы и времена года',`
    January|январь|n|It's very cold in January.;
    February|февраль|n|February is a short month.;
    March|март|n|Spring starts in March.;
    April|апрель|n|It often rains in April.;
    May|май|n|My birthday is in May.;
    June|июнь|n|School finishes in June.;
    July|июль|n|We go to the sea in July.;
    August|август|n|August is hot and sunny.;
    September|сентябрь|n|Children go back to school in September.;
    October|октябрь|n|The leaves are red in October.;
    November|ноябрь|n|November is dark and wet.;
    December|декабрь|n|Christmas is in December.;
    spring|весна|n|I love spring.;
    summer|лето|n|We travel in the summer.;
    autumn|осень|n|Autumn is my favourite season.;
    winter|зима|n|It snows in winter.`],
   ['ti-clock','Telling the time','который час',`
    What time is it?|Который час?|o|Excuse me, what time is it?;
    o'clock|ровно (о часах)|o|The film starts at eight o'clock.;
    half past two|половина третьего|o|The meeting is at half past two.;
    quarter past|четверть (после)|o|It's quarter past six.;
    quarter to|без четверти|o|It's quarter to nine.;
    minute|минута|n|Wait a minute, please.;
    hour|час (60 минут)|n|The trip takes two hours.;
    day|день|n|I work eight hours a day.;
    week|неделя|n|I go to the gym three times a week.;
    month|месяц|n|We pay for the flat every month.;
    year|год|n|I started English this year.;
    early|рано|o|I get up early.;
    late|поздно|o|Sorry I'm late!`],
   ['ti-prep','Prepositions of time','at / on / in',`
    at seven o'clock|в семь часов|o|I get up at seven o'clock.;
    on Monday|в понедельник|o|The shop is closed on Monday.;
    in June|в июне|o|We go on holiday in June.;
    in 2026|в 2026 году|o|I started English in 2026.;
    in the morning|утром|o|I run in the morning.;
    at night|ночью|o|Owls fly at night.;
    at the weekend|на выходных|o|I relax at the weekend.;
    from … to …|с … до …|o|I work from nine to five.;
    before|до, перед (по времени)|o|Wash your hands before dinner.;
    after|после|o|We go for a walk after lunch.;
    every day|каждый день|o|I study English every day.`],
   ],
A2:[
   ['ti2-expr','Time expressions','ago, for, while…',`
    ago|назад|o|I moved here two years ago.|стоит после периода: three days ago;
    for|в течение|o|I lived there for five years.|сколько длится — for, с какого момента — since;
    since|с (какого-то момента)|o|I've known her since 2015.;
    during|во время|o|I fell asleep during the film.|+ существительное, + предложение — while;
    while|пока, в то время как|o|I read while I wait.;
    until|до (какого-то момента)|o|Wait here until six.|разг. till;
    last week|на прошлой неделе|o|I saw him last week.|без предлога: не on last week;
    next month|в следующем месяце|o|We're moving next month.;
    the day before yesterday|позавчера|o|I met her the day before yesterday.;
    the day after tomorrow|послезавтра|o|The exam is the day after tomorrow.;
    already|уже|o|I've already eaten.;
    yet|ещё (не), уже (в вопросе)|o|Have you finished yet?|not yet — ещё нет;
    still|всё ещё|o|It's still raining.;
    recently|недавно|o|I haven't seen him recently.|также lately`],
   ['ti2-periods','How long?','отрезки времени',`
    half an hour|полчаса|o|The bus takes half an hour.;
    a quarter of an hour|четверть часа|o|I'll be back in a quarter of an hour.;
    an hour and a half|полтора часа|o|The film is an hour and a half long.;
    a long time|долго|o|I waited a long time.;
    for a while|какое-то время|o|Let's sit here for a while.;
    all night|всю ночь|o|The baby cried all night.;
    the whole day|весь день|o|It rained the whole day.;
    once a week|раз в неделю|o|I go swimming once a week.;
    every other day|через день|o|I call my mum every other day.;
    at the same time|в то же время, одновременно|o|We arrived at the same time.;
    at first|поначалу (а потом иначе)|o|At first I didn't like it.;
    one day|однажды, когда-нибудь|o|One day I'll visit Australia.;
    some day|когда-нибудь (в будущем)|o|Some day you'll understand.;
    the next day|на следующий день|o|The next day we went to the beach.`],
   ],
B1:[
   ['ti3-numbers','Big numbers & dates','как читать числа и периоды',`
    a million|миллион|n|The city has two million people.|two million — без -s;
    half|половина|n|Half of the class was ill.;
    a quarter|четверть|n|A quarter of the students are from abroad.;
    per cent|процент|n|Prices went up by ten per cent.|амер. percent;
    point|запятая (в дробях)|n|The baby weighs three point two kilos.|в английском пишут точку: 3.2;
    decade|десятилетие|n|I've lived here for a decade.;
    century|век|n|The church was built in the 19th century.;
    the nineties|девяностые|n|I was born in the nineties.;
    in the past|в прошлом|o|In the past, people wrote letters.;
    nowadays|в наши дни|o|Nowadays everyone has a phone.;
    in the future|в будущем|o|What will you do in the future?;
    at the moment|в данный момент|o|I'm busy at the moment.|также right now;
    from time to time|время от времени|o|I see him from time to time.`],
   ['ti3-time-2','Time B1','сроки и периоды',`
    at the latest|самое позднее|o|Be here by six at the latest.;
    by Friday|к пятнице|o|Send it by Friday.|к сроку — by, до какого-то момента — until;
    on time|вовремя (по расписанию)|o|The train arrived on time.;
    in advance|заранее|o|Book your tickets in advance.;
    fortnight|две недели|n|We're going away for a fortnight.|брит.;
    the other day|на днях|o|I saw him the other day.;
    for ages|целую вечность|o|I haven't seen you for ages!;
    so far|до сих пор, пока что|o|So far, so good.;
    up to now|до сих пор|o|Up to now, everything is fine.;
    meanwhile|тем временем|o|Meanwhile, the kids were playing.;
    eventually|в конце концов|o|Eventually, we found the hotel.|не «эвентуально»!;
    immediately|немедленно|o|Call me immediately.;
    daily|ежедневный|a|It's a daily newspaper.;
    annual|ежегодный|a|It's our annual holiday.`],
   ['ti3-plans','Plans & schedules','планы и расписание',`
    schedule|график, расписание (дел)|n|I have a busy schedule this week.;
    diary|ежедневник, дневник|n|Let me check my diary.;
    arrange|договориться, организовать|v|I've arranged to meet him at six.;
    make an appointment|записаться (к врачу и т. п.)|o|I need to make an appointment with the dentist.;
    reschedule|перенести на другое время|v|Can we reschedule the meeting?;
    fully booked|всё забронировано, мест нет|a|The hotel is fully booked.;
    be due|ожидаться (по сроку)|o|The train is due at 5:30.;
    plan ahead|планировать заранее|o|It's a good idea to plan ahead.;
    spend time|проводить время|o|I spend a lot of time with my family.;
    waste time|тратить время впустую|o|Don't waste time on social media.;
    save time|экономить время|o|Let's take a taxi to save time.;
    have time for|иметь время на|o|I don't have time for breakfast.;
    be short of time|иметь мало времени|o|Sorry, I'm a bit short of time.;
    at the last minute|в последний момент|o|He always does everything at the last minute.`],
   ],
B2:[
   ['ti4-time-2','Time B2','время и сроки',`
    at short notice|без предупреждения, в сжатые сроки|o|The meeting was cancelled at short notice.;
    in the long run|в долгосрочной перспективе|o|It will save money in the long run.;
    in the short term|в краткосрочной перспективе|o|In the short term, prices will rise.;
    overdue|просроченный|a|The rent is overdue.;
    ahead of schedule|раньше графика|o|We finished ahead of schedule.;
    behind schedule|с опозданием от графика|o|The project is behind schedule.;
    time-consuming|отнимающий много времени|a|It's a time-consuming process.;
    punctual|пунктуальный|a|Please be punctual.;
    long-term|долгосрочный|a|We need a long-term plan.;
    temporary|временный|a|It's only a temporary job.;
    permanent|постоянный|a|She got a permanent contract.;
    simultaneously|одновременно|o|They spoke simultaneously.;
    in the meantime|тем временем|o|In the meantime, have a coffee.;
    whenever|когда бы ни|o|Come whenever you like.`],
   ['ti4-past-future','Past & future','прошлое и будущее',`
    nowadays|в наши дни|o|Nowadays people work from home.;
    in those days|в те времена|o|In those days, there were no phones.;
    once upon a time|давным-давно|o|Once upon a time, there was a king.;
    throughout history|на протяжении истории|o|Throughout history, people have travelled.;
    the good old days|старые добрые времена|n|He always talks about the good old days.;
    in the near future|в ближайшем будущем|o|Prices will fall in the near future.;
    sooner or later|рано или поздно|o|Sooner or later, you'll understand.;
    from then on|с тех пор|o|From then on, we were friends.;
    by the time|к тому времени как|o|By the time we arrived, they had left.;
    prior to|до, перед|o|Prior to the meeting, read the report.;
    former|бывший (прежний, о должности)|a|He's a former teacher.;
    upcoming|предстоящий|a|Are you ready for the upcoming exam?;
    forthcoming|грядущий|a|Her forthcoming book is about birds.;
    look back on|оглядываться на|v|I look back on those years with pleasure.`],
   ['ti4-sequence','Sequence & periods','последовательность и периоды',`
    beforehand|заранее, предварительно|o|Let me know beforehand if you can't come.;
    afterwards|потом, впоследствии|o|We had dinner and afterwards went for a walk.;
    initially|изначально|o|Initially I didn't like the job.;
    subsequently|впоследствии|o|He was arrested and subsequently released.;
    previously|ранее|o|She previously worked in a bank.;
    lately|в последнее время|o|Have you seen her lately?|не путать с late (поздно);
    ultimately|в конечном счёте|o|Ultimately, it's your decision.;
    in due course|в своё время|o|You'll get the results in due course.;
    overnight|за ночь, в одночасье|o|He became famous overnight.;
    at the outset|с самого начала|o|We agreed on the price at the outset.;
    up to date|актуальный, современный|a|Keep your software up to date.;
    out of date|устаревший, просроченный|a|This map is out of date.;
    to date|на сегодняшний день|o|To date, we have raised £5,000.;
    recent|недавний|a|Is this a recent photo?`],
   ]},
  extra:{A1:[
   ['ti-frequency','How often?','как часто',`
    always|всегда|o|I always drink coffee in the morning.;
    usually|обычно|o|I usually get up at seven.;
    often|часто|o|We often go to the park.;
    sometimes|иногда|o|Sometimes I work at the weekend.;
    never|никогда|o|I never eat meat.|без not: I never eat;
    hardly ever|почти никогда|o|I hardly ever watch TV.;
    once|один раз|o|I go swimming once a week.;
    twice|два раза|o|We eat out twice a month.;
    three times|три раза|o|I study English three times a week.;
    every week|каждую неделю|o|I call my parents every week.;
    all day|весь день|o|It rained all day.;
    on weekdays|по будням|o|I get up early on weekdays.;
    How often…?|Как часто…?|o|How often do you go to the gym?`],
   ['ti-time-3','Time & holidays','время и праздники',`
    time|время|n|I don't have time today.;
    date|дата, число (месяца)|n|What's the date today?;
    calendar|календарь|n|There's a calendar on the wall.;
    tonight|сегодня вечером|o|What are you doing tonight?;
    this morning|сегодня утром|o|I got up late this morning.;
    last night|вчера вечером, прошлой ночью|o|I went to bed late last night.;
    next week|на следующей неделе|o|We're going to Spain next week.;
    next year|в следующем году|o|I want to learn French next year.;
    again|снова, ещё раз|o|Please say it again.;
    Christmas|Рождество|n|We visit my parents at Christmas.;
    New Year|Новый год|n|Happy New Year!;
    Easter|Пасха|n|Easter is in April this year.;
    party|вечеринка, праздник|n|Come to my party on Saturday!;
    present|подарок|n|This present is for you.`],
   ],
A2:[
   ['ti2-expr-2','Time expressions 2','скоро, позже, в конце',`
    soon|скоро|o|See you soon!;
    later|позже|o|I'll call you later.;
    earlier|раньше|o|I saw him earlier today.;
    in a minute|через минуту|o|I'll be ready in a minute.;
    these days|в наши дни, сейчас|o|These days I work from home.;
    at the beginning|в начале|o|At the beginning, it was difficult.;
    at the end|в конце (чего-то)|o|Pay at the end of the month.;
    in the end|в итоге|o|In the end, we stayed at home.|в конце чего-то — at the end of;
    in the middle of|посреди|o|He called in the middle of the night.;
    at midnight|в полночь|o|The party ended at midnight.;
    at noon|в полдень|o|Let's meet at noon.;
    on Monday morning|в понедельник утром|o|I have a meeting on Monday morning.;
    just|только что|o|I've just arrived.;
    at once|сразу, немедленно|o|Come here at once!`],
   ],
B1:[
   ['ti3-numbers-2','Numbers & measurement','размеры и количество',`
    metre|метр|n|The room is five metres long.|амер. meter;
    centimetre|сантиметр|n|It's thirty centimetres wide.;
    kilometre|километр|n|It's two kilometres from here.;
    weigh|весить|v|How much do you weigh?|вес — weight;
    weight|вес|n|What's the weight of the bag?;
    size|размер|n|What size is the room?;
    total|всего, итог|n|The total is fifty euros.;
    average|средний|a|The average age is thirty.;
    double|вдвое больше|v|Prices have doubled.;
    increase|увеличиваться|v|The population increased.;
    decrease|уменьшаться|v|Crime has decreased.;
    approximately|приблизительно|o|It costs approximately 100 euros.|также about, around;
    dozen|дюжина|n|A dozen eggs, please.;
    a couple of|пара, несколько|o|Wait a couple of minutes.`],
   ],
B2:[
   ['ti4-frequency','Frequency & duration','частота и длительность',`
    every now and then|время от времени|o|I see him every now and then.;
    on and off|с перерывами|o|It rained on and off all day.;
    round the clock|круглосуточно|o|They work round the clock.;
    for good|навсегда|o|He left the country for good.;
    over and over again|снова и снова|o|I watched it over and over again.;
    day in, day out|изо дня в день|o|He does the same job day in, day out.;
    all the time|всё время|o|She complains all the time.;
    most of the time|большую часть времени|o|Most of the time I'm happy.;
    rarely|редко|o|I rarely eat meat.;
    seldom|редко (книжн.)|o|We seldom go out.;
    constantly|постоянно|o|The phone rings constantly.;
    occasionally|изредка|o|I occasionally drink wine.;
    regularly|регулярно|o|Exercise regularly.;
    frequently|часто (книжн.)|o|He frequently travels abroad.`],
   ['ti4-idioms','Time idioms','выражения со временем',`
    in the nick of time|в самый последний момент (успеть)|o|We arrived in the nick of time.;
    once in a blue moon|очень редко|o|I see him once in a blue moon.;
    in no time|очень быстро|o|We'll be there in no time.;
    kill time|убивать время|o|We killed time in a café.;
    take your time|не торопись|o|Take your time, there's no rush.;
    run out of time|не успеть|o|We ran out of time.;
    on time|вовремя (по расписанию)|o|The train was on time.|in time — не опоздав, заранее;
    in time|вовремя (успеть к)|o|We got there in time for dinner.;
    from now on|отныне|o|From now on, I'll be on time.;
    sooner or later|рано или поздно|o|Sooner or later, he'll find out.;
    for the time being|пока что|o|I'm living with my parents for the time being.;
    it's high time|давно пора|o|It's high time you got a job.|после — Past Simple;
    around the clock|круглосуточно|o|Doctors work around the clock.`],
   ['ti4-deadlines','Time pressure','спешка и сроки',`
    in good time|заблаговременно|o|We arrived at the airport in good time.;
    last-minute|в последнюю минуту|a|We booked a last-minute holiday.;
    a tight deadline|сжатые сроки|o|We're working to a tight deadline.;
    extend a deadline|продлить срок|o|Can you extend the deadline?;
    buy time|выиграть время|o|He made excuses to buy time.;
    make up for lost time|наверстать упущенное|o|We worked late to make up for lost time.;
    be pressed for time|торопиться, иметь мало времени|o|I'm a bit pressed for time today.;
    time-saving|экономящий время|a|A dishwasher is a great time-saving device.;
    timescale|сроки|n|What's the timescale for the project?;
    against the clock|в спешке, наперегонки со временем|o|We were working against the clock.;
    spare a minute|уделить минутку|o|Can you spare a minute?;
    at the eleventh hour|в последний момент, когда почти поздно|o|The deal was saved at the eleventh hour.;
    in the blink of an eye|в мгновение ока|o|It was over in the blink of an eye.`],
   ]}},

 {key:'daily', name:'Daily life', ru:'Распорядок и частые глаголы', color:'#8a5aa8',
  info:'Самые частые глаголы и устойчивые сочетания с do, make, have, go.',
  cells:{A1:[
   ['da-routine','Daily routine','мой обычный день',`
    get up|вставать (с кровати)|v|I get up at seven.;
    wake up|просыпаться|v|I usually wake up at six.;
    have a shower|принять душ|v|I have a shower in the morning.;
    get dressed|одеться|v|I get dressed after breakfast.;
    have breakfast|завтракать|v|We have breakfast at eight.;
    go to work|идти на работу|v|I go to work by bus.;
    have lunch|обедать|v|I have lunch at one o'clock.;
    get home|добраться домой|v|I get home at six.;
    cook dinner|готовить ужин|v|We cook dinner together.;
    watch TV|смотреть телевизор|v|We watch TV in the evening.;
    go to bed|ложиться спать|v|I go to bed at eleven.;
    start|начинать|v|Work starts at nine.;
    finish|заканчивать|v|The lesson finishes at five.`],
   ['da-verbs','Common verbs','базовые глаголы',`
    go|идти, ехать|v|Let's go to the park.;
    come|приходить|v|Come here, please.;
    like|нравиться|v|I like coffee.;
    love|любить|v|I love my family.;
    want|хотеть|v|I want a new bike.;
    need|нуждаться|v|I need a holiday.;
    know|знать|v|I don't know the answer.;
    speak|говорить (на языке)|v|Do you speak English?;
    read|читать|v|I read before bed.;
    write|писать|v|Please write your name here.;
    listen|слушать|v|Listen to the birds!;
    play|играть|v|The children play in the garden.;
    work|работать|v|She works in a hospital.;
    study|учиться, заниматься (в вузе, предметом)|v|I study English every day.;
    drive|водить машину|v|Can you drive?;
    see|видеть|v|I can see a bird in the tree.`],
   ['da-phrases','do / make / have / go','глагол + слово',`
    do homework|делать домашнее задание|o|I do homework in the evening.;
    do the housework|делать работу по дому|o|We do the housework on Saturday.;
    make a cake|испечь торт|o|Let's make a cake for her birthday.;
    make a mistake|сделать ошибку|o|It's OK to make a mistake.;
    have a coffee|выпить кофе|o|Let's have a coffee.;
    have a good time|хорошо провести время|o|Have a good time at the party!;
    go shopping|ходить за покупками|o|I go shopping on Saturday.;
    go swimming|ходить плавать|o|We go swimming every Sunday.;
    go out|выходить (развлечься)|o|Do you want to go out tonight?;
    take a photo|сфотографировать|o|Can you take a photo of us?;
    take a bus|поехать на автобусе|o|I take a bus to work.`],
   ],
A2:[
   ['da2-get','get: all meanings','один глагол — много значений',`
    get a job|получить работу|o|She got a job in a bank.;
    get a message|получить сообщение|o|Did you get my message?|формальнее — receive;
    get to work|добраться до работы|o|How do you get to work?;
    get lost|заблудиться|o|We got lost in the old town.;
    get married|пожениться|o|They got married last year.;
    get divorced|развестись|o|His parents got divorced.;
    get angry|разозлиться|o|Don't get angry with me.|get + прилагательное = «стать»;
    get better|поправиться, стать лучше|o|I hope you get better soon.;
    get worse|ухудшиться|o|The weather is getting worse.;
    get dark|темнеть|o|It gets dark early in winter.;
    get a taxi|взять такси|o|Let's get a taxi home.|также take a taxi;
    get on well with|ладить с|o|I get on well with my boss.;
    get back|вернуться, добраться обратно|o|When did you get back from holiday?;
    get ready|собраться, приготовиться|o|Get ready, we're leaving!`],
   ['da2-phrasal','Everyday phrasal verbs','глагол + частица',`
    turn on|включить|v|Can you turn on the light?|также switch on;
    turn off|выключить|v|Turn off your phone, please.|также switch off;
    put on|надеть|v|Put on your coat, it's cold.|быть одетым, носить — wear;
    take off|снять (одежду)|v|Take off your shoes, please.|про самолёт — «взлететь»;
    pick up|поднять, заехать за кем-то|v|I'll pick you up at six.;
    look for|искать|v|I'm looking for my keys.|найти — find;
    look after|присматривать, заботиться|v|Can you look after my cat?;
    give back|вернуть (отдать обратно)|v|Please give back my book.;
    throw away|выбросить|v|Don't throw away that box.;
    turn up|сделать громче|v|Turn up the music!;
    turn down|сделать тише|v|Please turn down the TV.|ещё «отказать»: turn down an offer;
    find out|узнать, выяснить|v|I want to find out the truth.;
    fill in|заполнить (форму)|v|Please fill in this form.|амер. fill out;
    come back|вернуться (сюда)|v|Come back soon!`],
   ['da2-opposites','Opposite verbs','пары противоположностей',`
    win|выиграть|v|Did you win the match?|заработать — earn;
    lose|проиграть, потерять|v|I always lose my keys.|не путать с loose — свободный;
    remember|помнить|v|I can't remember his name.;
    forget|забыть|v|Don't forget your passport.;
    push|толкать|v|Push the door to open it.;
    pull|тянуть|v|Pull, don't push!;
    arrive|прибывать|v|The train arrives at six.|arrive in (город), arrive at (место);
    leave|уезжать, уходить, оставлять|v|I leave home at eight.;
    pass|сдать (экзамен)|v|I hope I pass the exam.|сдавать (процесс) — take an exam;
    fail|провалить (экзамен)|v|He failed his driving test.;
    borrow|брать взаймы|v|Can I borrow your pen?|у кого-то — borrow from;
    lend|давать взаймы|v|Can you lend me ten złoty?;
    send|отправить|v|I'll send you a photo.;
    receive|получать (письмо, посылку)|v|Did you receive my email?|в речи чаще get`],
   ['da2-verbs','Useful verbs A2','полезные глаголы',`
    believe|верить|v|I don't believe you.;
    change|менять(ся)|v|You haven't changed at all.;
    choose|выбирать|v|Choose a card.;
    decide|решать|v|We decided to stay at home.;
    guess|угадывать|v|Guess who I saw yesterday!;
    build|строить|v|They're building a new school.;
    catch|ловить|v|The cat caught a mouse.;
    join|вступать, присоединяться|v|Why don't you join us?;
    fall|падать|v|Be careful, don't fall!;
    hide|прятать(ся)|v|The cat is hiding under the bed.;
    hold|держать|v|Can you hold my bag?;
    keep|хранить, оставлять себе|v|You can keep the book.;
    move|двигать(ся), переезжать|v|Don't move!;
    worry|волноваться|v|Don't worry, everything's fine.`],
   ],
B1:[
   ['da3-makedo','make or do?','устойчивые сочетания',`
    make a decision|принять решение|o|I need to make a decision.;
    make money|зарабатывать деньги|o|He makes a lot of money.;
    make friends|заводить друзей|o|It's easy to make friends here.;
    make a noise|шуметь|o|Don't make a noise, the baby's sleeping.;
    make an effort|приложить усилие|o|Please make an effort to be on time.;
    make a phone call|позвонить|o|I need to make a phone call.;
    make plans|строить планы|o|Let's make plans for the weekend.;
    do your best|сделать всё возможное|o|Just do your best.;
    do a course|пройти курс|o|I'm doing an English course.;
    do business|вести дела|o|We do business with Germany.;
    do someone a favour|сделать одолжение|o|Can you do me a favour?|амер. favor;
    do sport|заниматься спортом|o|I do sport three times a week.;
    do damage|нанести ущерб|o|The storm did a lot of damage.`],
   ['da3-phrasal','Phrasal verbs 2','частые фразовые глаголы',`
    give up|бросить (привычку), сдаться|v|I gave up smoking.;
    look forward to|ждать с нетерпением|v|I'm looking forward to the holiday.|после to — -ing: to seeing you;
    run out of|закончиться (о запасах)|v|We've run out of milk.;
    get over|оправиться от|v|It took me weeks to get over the flu.;
    set up|основать, организовать|v|She set up her own business.;
    carry on|продолжать|v|Carry on, I'm listening.;
    put off|откладывать (на потом)|v|Don't put off your homework.|также postpone;
    look up|найти (в словаре, в сети)|v|Look up the word in a dictionary.;
    work out|понять, тренироваться|v|I can't work out the answer.;
    come up with|придумать|v|She came up with a great idea.;
    turn into|превратиться в|v|The caterpillar turned into a butterfly.;
    take up|начать заниматься (хобби)|v|I took up yoga last year.;
    go on|продолжаться, происходить|v|What's going on?`],
   ['da3-verbs-b1','Useful verbs B1','полезные глаголы',`
    manage|суметь, справиться, управлять|v|I managed to finish on time.;
    realise|осознать|v|I didn't realise it was so late.|амер. realize;
    avoid|избегать|v|Avoid the city centre at rush hour.|+ -ing: avoid driving;
    prefer|предпочитать|v|I prefer tea to coffee.;
    expect|ожидать (считать вероятным)|v|I didn't expect to see you here.;
    hope|надеяться|v|I hope you're well.;
    mention|упомянуть|v|She mentioned your name.;
    notice|заметить|v|Did you notice anything strange?;
    recognise|узнать (кого-то, что-то знакомое)|v|I didn't recognise you!|амер. recognize;
    wonder|интересоваться, задаваться вопросом|v|I wonder where he is.;
    deal with|справляться с|v|I'll deal with it tomorrow.;
    happen|происходить|v|What happened?;
    improve|улучшать|v|I want to improve my English.;
    depend on|зависеть от|v|It depends on the weather.`],
   ['da3-routine','Habits & routines','привычки',`
    habit|привычка|n|Smoking is a bad habit.;
    get into the habit of|привыкнуть делать|o|I got into the habit of running.;
    routine|распорядок|n|I have a morning routine.;
    stay up late|засиживаться допоздна|o|I stayed up late watching a series.;
    oversleep|проспать|v|I overslept and missed the bus.;
    be in a hurry|торопиться|o|Sorry, I'm in a hurry.;
    on my way|по пути|o|I'm on my way!;
    run late|опаздывать (быть ещё в пути)|o|I'm running late.;
    spare time|свободное время|n|What do you do in your spare time?;
    take turns|делать по очереди|o|We take turns to cook.;
    chores|домашние дела|n|I hate doing chores.;
    commute|дорога на работу|n|My commute takes an hour.;
    rush|спешить, мчаться|v|Don't rush, we have time.;
    used to|раньше (привычка)|o|I used to smoke.`],
   ['da3-errands','Errands & chores','дела и поручения',`
    run errands|бегать по делам|o|I spent the morning running errands.;
    pay the bills|оплачивать счета|o|I pay the bills online.;
    get a haircut|подстричься|o|I need to get a haircut.;
    collect a parcel|забрать посылку|o|I have to collect a parcel from the post office.;
    iron a shirt|погладить рубашку|o|Can you iron my shirt?;
    change the sheets|сменить постельное бельё|o|I change the sheets every week.;
    empty the dishwasher|разгрузить посудомойку|o|Whose turn is it to empty the dishwasher?;
    feed the pets|покормить питомцев|o|Don't forget to feed the pets.;
    wash the car|помыть машину|o|He washes the car every Sunday.;
    sort out the post|разобрать почту|o|I need to sort out the post.`],
   ],
B2:[
   ['da4-phrasal','Phrasal verbs by particle','up, out, off, down',`
    break down|сломаться, расплакаться|v|She broke down in tears.;
    cut down on|сократить (потребление)|v|I'm trying to cut down on sugar.;
    call off|отменить (мероприятие, разг.)|v|They called off the match.;
    put up with|терпеть, мириться|v|I can't put up with the noise.;
    turn out|оказаться|v|It turned out that he was right.;
    point out|указать, отметить|v|She pointed out my mistake.;
    sort out|разобраться, уладить|v|I'll sort it out tomorrow.;
    bring up|поднять (тему)|v|Don't bring up politics at dinner.|ещё «воспитывать»;
    let down|подвести|v|Don't let me down.;
    back up|поддержать, сделать резервную копию|v|Always back up your files.;
    go off|испортиться, сработать|v|The milk has gone off.|будильник сработал — the alarm went off;
    make up|выдумать|v|He made up an excuse.|ещё «помириться»;
    show off|выпендриваться, хвастаться (напоказ)|v|He's always showing off.;
    wear out|износиться, вымотать|v|These shoes are worn out.`],
   ['da4-verbs','Advanced verbs','глаголы B2',`
    acknowledge|признавать|v|He acknowledged his mistake.;
    anticipate|предвидеть|v|We didn't anticipate problems.;
    assume|предполагать|v|I assume you're hungry.;
    claim|утверждать|v|He claims he's innocent.;
    cope with|справляться с (трудностями)|v|How do you cope with stress?;
    emphasise|подчёркивать|v|She emphasised the importance of sleep.;
    estimate|оценивать|v|We estimate the cost at 1000 euros.;
    hesitate|колебаться|v|Don't hesitate to call me.;
    insist on|настаивать на|v|She insisted on paying.;
    overcome|преодолеть|v|He overcame his fear of flying.;
    persuade|уговорить (сделать что-то)|v|I persuaded him to come.;
    postpone|отложить (перенести на позже)|v|The match was postponed.;
    tend to|иметь склонность|v|I tend to eat too much.;
    undergo|пройти (через что-то)|v|She underwent an operation.`],
   ['da4-routine','Lifestyle B2','образ жизни',`
    lifestyle|образ жизни|n|She has a healthy lifestyle.;
    workaholic|трудоголик|n|He's a workaholic.;
    sedentary|сидячий|a|I have a sedentary job.;
    hectic|суматошный|a|I had a hectic day.;
    unwind|расслабиться (после работы)|v|I unwind with a book.;
    recharge your batteries|зарядиться энергией|o|I need a holiday to recharge my batteries.;
    burnout|выгорание|n|He suffered from burnout.;
    screen time|экранное время|n|Limit children's screen time.;
    procrastinate|откладывать дела|v|Stop procrastinating!;
    multitask|делать несколько дел сразу|v|I can't multitask.;
    prioritise|расставлять приоритеты|v|You need to prioritise.;
    time management|управление временем|n|Good time management is key.;
    work-life balance|баланс работы и жизни|n|I want a better work-life balance.;
    slow down|сбавить темп|v|You should slow down.`],
   ['da4-communication','Communication B2','общение',`
    gossip|сплетничать, сплетни|v|They were gossiping about their boss.;
    chat|болтать|v|We chatted for hours.;
    argue|спорить|v|They always argue about politics.;
    persuade|убеждать|v|She persuaded me to stay.;
    exaggerate|преувеличивать|v|Don't exaggerate!;
    mumble|бормотать|v|Don't mumble, speak clearly.;
    boast|хвастаться (на словах)|v|He boasts about his car.;
    criticise|критиковать|v|Don't criticise him.;
    compliment|сделать комплимент|v|She complimented my dress.;
    reassure|успокоить, заверить|v|The doctor reassured me.;
    warn|предупреждать|v|I warned you!;
    threaten|угрожать|v|He threatened to leave.;
    beg|умолять|v|She begged him to stay.;
    remind|напоминать|v|Remind me to call Mum.`],
   ['da4-verbs-3','Key verbs B2','важные глаголы',`
    handle|справляться, обращаться с|v|She handled the situation very well.;
    tackle|решать (проблему), браться за|v|We need to tackle this problem now.;
    involve|включать, вовлекать|v|The job involves a lot of travel.;
    affect|влиять на|v|The weather affects my mood.;
    gain|получать, набирать|v|I gained a lot of experience.;
    maintain|поддерживать, сохранять|v|It's hard to maintain a healthy weight.;
    contribute|вносить вклад|v|Everyone contributed to the project.;
    reveal|раскрывать, обнаруживать|v|He revealed the truth at last.;
    predict|предсказывать|v|Nobody can predict the future.;
    resist|сопротивляться|v|I couldn't resist the chocolate.;
    tolerate|терпеть|v|I can't tolerate rudeness.;
    consume|потреблять|v|This car consumes a lot of petrol.;
    appreciate|ценить, быть благодарным|v|I really appreciate your help.;
    recommend|рекомендовать|v|Can you recommend a good restaurant?`],
   ]},
  extra:{A1:[
   ['da-verbs-2','Common verbs 2','ещё базовые глаголы',`
    open|открывать|v|Open the window, please.;
    close|закрывать|v|Close the door.;
    help|помогать|v|Can you help me?;
    ask|спрашивать|v|Can I ask a question?;
    call|звонить (по телефону), звать|v|I'll call you tonight.;
    wait|ждать|v|Wait for me!|ждать кого-то — wait for;
    walk|идти пешком|v|I walk to work.;
    run|бежать, бегать|v|I run every morning.;
    sit down|садиться|v|Please sit down.;
    stand up|вставать (на ноги)|v|Stand up, please.;
    sleep|спать|v|I sleep eight hours a night.;
    take|брать|v|Take an umbrella.;
    give|давать|v|Give me the book, please.;
    bring|приносить|v|Bring your passport.;
    find|находить|v|I can't find my keys.;
    think|думать|v|I think it's a good idea.`],
   ['da-routine-2','Daily routine 2','ещё про обычный день',`
    brush your teeth|чистить зубы|o|Brush your teeth twice a day.;
    make breakfast|готовить завтрак|o|I make breakfast for the family.;
    have dinner|ужинать|o|We have dinner at seven.;
    leave home|выходить из дома|o|I leave home at eight.;
    catch the bus|успеть на автобус|o|I catch the bus at 7:30.;
    go home|идти домой|o|Let's go home.|без to: go home;
    check emails|проверять почту|o|I check my emails in the morning.;
    walk the dog|выгуливать собаку|o|I walk the dog after dinner.;
    go to school|ходить в школу|o|My son goes to school by bus.;
    have a nap|вздремнуть|o|I have a nap after lunch.;
    relax|отдыхать, расслабляться|v|I relax in the evening.;
    get home late|поздно возвращаться|o|I get home late on Fridays.;
    set an alarm|ставить будильник|o|I set an alarm for six.`],
   ['da-verbs-3','Common verbs 3','ещё частые глаголы',`
    put|класть, ставить|v|Put your bag on the chair.;
    use|использовать|v|Can I use your phone?;
    try|пытаться, пробовать|v|Try this cake, it's great.;
    show|показывать|v|Show me your new flat.;
    carry|нести|v|Can you carry this bag?;
    wash|мыть|v|I wash my car every Sunday.;
    clean|убирать, чистить|v|We clean the house on Saturday.;
    laugh|смеяться|v|The children laugh a lot.;
    cry|плакать|v|The baby is crying.;
    smile|улыбаться|v|She always smiles.;
    jump|прыгать|v|The cat can jump very high.;
    swim|плавать|v|I can't swim.;
    fly|летать|v|Birds fly south in autumn.;
    understand|понимать|v|Do you understand me?`],
   ],
A2:[
   ['da2-havetake','have & take','устойчивые сочетания',`
    have a rest|отдохнуть|o|Let's stop and have a rest.;
    have a party|устроить вечеринку|o|We're having a party on Saturday.;
    have fun|веселиться|o|Have fun at the concert!;
    have a look|взглянуть|o|Can I have a look?;
    have a problem|иметь проблему|o|I have a problem with my phone.;
    have a chat|поболтать|o|We had a chat over coffee.;
    take a break|сделать перерыв|o|Let's take a break.;
    take a seat|присесть|o|Please take a seat.;
    take medicine|принимать лекарство|o|Take this medicine after meals.;
    take place|состояться|o|The concert takes place in the park.;
    take care|береги себя|o|Bye, take care!;
    take a long time|занимать много времени|o|It takes a long time to learn a language.;
    have a good trip|хорошей поездки|o|Have a good trip!;
    take a walk|прогуляться|o|Let's take a walk after lunch.|брит. чаще go for a walk`],
   ['da2-phrasal-2','Phrasal verbs 2','ещё частые фразовые',`
    call back|перезвонить|v|I'll call you back later.;
    go away|уйти, уехать|v|Go away! I'm busy.;
    hurry up|поторопиться|v|Hurry up, we're late!;
    slow down|замедлиться|v|Slow down, you're driving too fast.;
    write down|записать|v|Write down my number.;
    lie down|прилечь|v|I need to lie down.;
    run away|убежать|v|The dog ran away.;
    put away|убрать на место|v|Put away your toys.;
    look out|осторожно|v|Look out! A car!;
    calm down|успокоиться|v|Calm down, it's OK.;
    go back|вернуться (туда)|v|I want to go back to Italy.;
    get in|сесть (в машину)|v|Get in, I'll drive you home.;
    get out of|выйти (из машины)|v|Get out of the car.;
    take out|вынуть, пригласить куда-то|v|He took me out for dinner.`],
   ['da2-talk','say, tell, talk…','глаголы общения',`
    say|сказать (что-то)|v|What did she say?|сказать что-то — say, сказать кому-то — tell someone;
    tell|сказать, рассказать (кому-то)|v|Tell me the truth.;
    talk|разговаривать|v|We talked for hours.;
    explain|объяснять|v|Can you explain the rule?|объяснить кому-то — explain to someone;
    describe|описывать|v|Describe your house.;
    discuss|обсуждать|v|We discussed the plan.|без about: discuss something;
    agree|соглашаться|v|I agree with you.;
    invite|приглашать|v|They invited us to dinner.;
    promise|обещать|v|I promise I'll call.;
    shout|кричать|v|Don't shout at me!;
    whisper|шептать|v|She whispered something in my ear.;
    apologise|извиняться|v|He apologised for being late.|амер. apologize;
    suggest|предлагать (идею, вариант)|v|I suggest a walk.;
    reply|отвечать (на письмо, сообщение)|v|She didn't reply to my message.`],
   ],
B1:[
   ['da3-phrasal-3','Phrasal verbs 3','ещё фразовые глаголы',`
    look after|заботиться о|v|Who looks after the kids?;
    get up to|затевать, делать|v|What did you get up to at the weekend?;
    hang out|тусоваться|v|We hang out at the park.;
    catch up|наверстать, пообщаться|v|Let's meet and catch up.;
    end up|оказаться в итоге|v|We ended up in a small café.;
    turn up|появиться|v|He turned up late.;
    show up|прийти, появиться|v|Nobody showed up.;
    give away|отдать даром|v|I gave away my old clothes.;
    pay back|вернуть долг|v|I'll pay you back tomorrow.;
    put up|повесить, приютить|v|We put up a picture.;
    take after|быть похожим на родственника|v|He takes after his dad.;
    check in|зарегистрироваться|v|We checked in at the hotel.;
    drop off|подвезти, высадить|v|I'll drop you off at the station.;
    fill up|заполнить до конца|v|Fill up the glass.`],
   ['da3-makedo-2','make & do 2','ещё сочетания',`
    make a mess|устроить беспорядок|o|The kids made a mess in the kitchen.;
    make a complaint|подать жалобу|o|I want to make a complaint.;
    make an excuse|придумать оправдание|o|Don't make excuses!;
    make progress|делать успехи|o|You're making good progress.;
    make a suggestion|внести предложение|o|Can I make a suggestion?;
    make a difference|иметь значение|o|Your help made a big difference.;
    make sure|убедиться|o|Make sure you lock the door.;
    make up your mind|решиться|o|I can't make up my mind.;
    do research|проводить исследование|o|She's doing research on birds.;
    do the shopping|делать покупки|o|I do the shopping on Saturdays.;
    do well|преуспеть|o|She did well in her exams.;
    do nothing|ничего не делать|o|I did nothing all weekend.;
    do harm|навредить|o|A little sugar won't do any harm.;
    do a job|выполнять работу|o|He did a great job.`],
   ['da3-verbs-b1-2','Useful verbs B1 2','ещё глаголы',`
    allow|разрешать|v|Dogs aren't allowed here.;
    refuse|отказываться|v|He refused to help.;
    offer|предлагать (дать, сделать что-то)|v|She offered me a drink.;
    prepare|готовить(ся)|v|I'm preparing for the exam.;
    include|включать|v|The price includes breakfast.;
    provide|обеспечивать|v|The hotel provides towels.;
    reduce|сокращать|v|Try to reduce sugar.;
    require|требовать|v|The job requires experience.;
    achieve|достигать|v|She achieved her goal.;
    contain|содержать|v|This drink contains sugar.;
    compare|сравнивать|v|Compare the two photos.;
    consider|рассматривать, обдумывать|v|We're considering moving.;
    admit|признать|v|He admitted his mistake.;
    encourage|поощрять|v|My parents encouraged me.`],
   ],
B2:[
   ['da4-phrasal-2','Phrasal verbs B2 2','ещё фразовые',`
    come across|наткнуться на|v|I came across an old photo.;
    come up|возникнуть|v|Something came up, I can't come.;
    fall through|сорваться (о планах)|v|Our plans fell through.;
    get away with|сойти с рук|v|He got away with cheating.;
    go through|пережить, просмотреть|v|She's going through a hard time.;
    hold on|подождать|v|Hold on a second.;
    keep up with|успевать за|v|I can't keep up with the news.;
    live up to|оправдать (ожидания)|v|The film didn't live up to my expectations.;
    look into|изучить, расследовать|v|We'll look into the problem.;
    put forward|выдвинуть (идею)|v|She put forward a new plan.;
    rule out|исключить|v|We can't rule out rain.;
    stand out|выделяться|v|Her red coat stood out.;
    take on|взять на себя, нанять|v|I've taken on too much work.;
    think over|обдумать|v|Think it over and tell me tomorrow.`],
   ['da4-phrasal-3','Phrasal verbs B2 3','фразовые с get, put, take',`
    get across|донести (мысль)|v|I couldn't get my point across.;
    get by|сводить концы с концами|v|We get by on one salary.;
    get round to|дойти руки до|v|I never got round to calling him.;
    get through|дозвониться, пережить|v|I couldn't get through to the office.;
    put aside|отложить (деньги)|v|I put aside money every month.;
    put down|записать, положить|v|Put down your name here.;
    put out|потушить|v|The firefighters put out the fire.;
    take back|забрать свои слова|v|I take back what I said.;
    take in|понять, усвоить, обмануть|v|It was too much to take in.;
    take over|взять под контроль|v|A big company took over the firm.;
    take down|записать, снять|v|Take down these notes.;
    bring about|вызвать, привести к|v|The internet brought about big changes.;
    bring back|напомнить, вернуть|v|This song brings back memories.;
    come down with|заболеть|v|I've come down with a cold.`],
   ['da4-verbs-2','Advanced verbs 2','ещё глаголы',`
    adapt|приспособиться|v|Birds adapt to city life.;
    attempt|пытаться (книжн.)|v|He attempted to climb the mountain.;
    blame|винить|v|Don't blame me!;
    cancel|отменить (заказ, встречу)|v|They cancelled the flight.;
    commit|совершить, взять обязательство|v|He committed a crime.;
    convince|убедить (в чём-то)|v|She convinced me.;
    demand|требовать|v|They demanded an apology.;
    deny|отрицать|v|He denied everything.;
    determine|определить|v|Tests determine the cause.;
    ensure|обеспечить|v|Please ensure the door is locked.;
    ignore|игнорировать|v|He ignored my advice.;
    obtain|получить, добыть (книжн.)|v|You need to obtain a visa.;
    pursue|преследовать (цель)|v|She pursued a career in music.;
    struggle|бороться, с трудом справляться|v|I struggled with maths.`],
   ['da4-collocations','Verb collocations B2','устойчивые сочетания',`
    pay attention|обращать внимание|o|Pay attention to the teacher.;
    take advantage of|воспользоваться|o|Take advantage of the good weather.;
    catch someone's eye|привлечь внимание|o|The red dress caught my eye.;
    keep a promise|сдержать обещание|o|He always keeps his promises.;
    break a promise|нарушить обещание|o|Don't break your promise.;
    raise awareness|повышать осведомлённость|o|The campaign raises awareness.;
    reach an agreement|достичь соглашения|o|They reached an agreement.;
    run a risk|рисковать|o|You run a risk of losing everything.;
    draw a conclusion|сделать вывод|o|What conclusion can we draw?;
    come to a decision|прийти к решению|o|We came to a decision.;
    hold a meeting|провести собрание|o|We hold a meeting every Monday.;
    take responsibility|брать ответственность|o|Take responsibility for your actions.;
    meet someone halfway|пойти навстречу|o|Let's meet each other halfway.;
    make ends meet|сводить концы с концами|o|It's hard to make ends meet.`],
   ]}},

 {key:'home', name:'Home', ru:'Дом', color:'#7a5230',
  info:'Комнаты, мебель, вещи в доме и предлоги места: где что стоит.',
  cells:{A1:[
   ['ho-rooms','Rooms & the house','части дома',`
    house|дом (здание)|n|They live in a big house.;
    flat|квартира|n|My flat is on the third floor.;
    room|комната|n|My room is small but nice.;
    kitchen|кухня|n|We eat in the kitchen.;
    living room|гостиная|n|The TV is in the living room.;
    bedroom|спальня|n|The flat has two bedrooms.;
    bathroom|ванная|n|The bathroom is next to the bedroom.;
    garden|сад|n|There are birds in the garden.;
    garage|гараж|n|The car is in the garage.;
    stairs|лестница (в доме, ступеньки)|n|Go up the stairs.;
    door|дверь|n|Please close the door.;
    window|окно|n|Open the window, please.;
    floor|пол, этаж|n|The keys are on the floor.;
    wall|стена|n|There's a picture on the wall.`],
   ['ho-things','Furniture & things','что стоит в доме',`
    table|стол|n|Dinner is on the table.;
    chair|стул|n|Sit on this chair.;
    bed|кровать|n|The cat is on my bed.;
    sofa|диван|n|We have a big sofa.;
    shower|душ|n|The shower doesn't work.;
    bath|ванна|n|I have a bath in the evening.;
    fridge|холодильник|n|The milk is in the fridge.;
    cooker|плита|n|We have a new cooker.;
    lamp|лампа|n|There's a lamp next to the bed.;
    shelf|полка|n|The books are on the shelf.;
    cupboard|шкаф (кухонный)|n|The cups are in the cupboard.;
    wardrobe|шкаф для одежды|n|My clothes are in the wardrobe.;
    mirror|зеркало|n|Look in the mirror.;
    washing machine|стиральная машина|n|The washing machine is in the bathroom.;
    key|ключ|n|Where are my keys?`],
   ['ho-prep','Where is it?','предлоги места',`
    in|в (внутри)|o|The milk is in the fridge.;
    on|на (на поверхности)|o|Your phone is on the table.;
    under|под|o|The cat is under the bed.;
    next to|рядом с|o|The bank is next to the station.;
    between|между|o|The shop is between the bank and the café.;
    opposite|напротив|o|The park is opposite my house.;
    in front of|перед (в пространстве)|o|There's a car in front of the house.;
    behind|за, позади|o|The garden is behind the house.;
    near|около, недалеко от|o|I live near the station.;
    above|над (выше чего-то)|o|There's a lamp above the table.`],
   ],
A2:[
   ['ho2-housework','Housework','дела по дому',`
    do the washing-up|мыть посуду|o|I do the washing-up after dinner.|также wash up, посудомойка — dishwasher;
    do the washing|стирать|o|I do the washing on Sundays.|амер. do the laundry;
    do the ironing|гладить|o|I hate doing the ironing.;
    do the cleaning|делать уборку|o|We do the cleaning together.;
    hoover|пылесосить|v|I hoover the living room every week.|также vacuum;
    make the bed|заправлять кровать|o|Make your bed, please!;
    lay the table|накрывать на стол|o|Can you lay the table?|также set the table;
    clear the table|убирать со стола|o|Clear the table after dinner.;
    tidy up|прибраться|v|Tidy up your room!;
    take out the rubbish|выносить мусор|o|It's your turn to take out the rubbish.|амер. take out the trash;
    dust|вытирать пыль|v|I dust the shelves on Saturday.;
    water the plants|поливать растения|o|Don't forget to water the plants.;
    feed the cat|кормить кошку|o|Who feeds the cat when you're away?`],
   ['ho2-house','Describing a home','дом подробнее',`
    roof|крыша|n|The roof is red.;
    ceiling|потолок|n|The ceiling is very high.;
    balcony|балкон|n|We have breakfast on the balcony.;
    upstairs|наверху, наверх|o|The bedrooms are upstairs.;
    downstairs|внизу, вниз|o|The kitchen is downstairs.;
    ground floor|первый этаж|n|We live on the ground floor.|амер. first floor;
    neighbour|сосед|n|Our neighbours are very quiet.|амер. neighbor;
    rent|снимать (жильё)|v|We rent a flat in the centre.|ещё «арендная плата» (n);
    move house|переезжать|o|We moved house last year.|также просто move;
    spacious|просторный|a|The living room is spacious.;
    cosy|уютный|a|It's a small but cosy flat.|амер. cozy;
    heating|отопление|n|The heating doesn't work.;
    furniture|мебель|n|We need new furniture.|неисчисл.: a piece of furniture`],
   ],
B1:[
   ['ho3-problems','Problems at home','поломки и ремонт',`
    leak|протекать|v|The roof is leaking.|протечка — тоже leak (n);
    broken|сломанный|a|The washing machine is broken.;
    repair|чинить, ремонтировать|v|Can you repair the door?|также fix;
    plumber|сантехник|n|We need to call a plumber.|b не читается;
    electrician|электрик|n|The electrician is coming tomorrow.;
    landlord|арендодатель|n|I called the landlord about the heating.|женщина — landlady;
    tenant|жилец, арендатор|n|The new tenants moved in yesterday.;
    blocked|засорённый|a|The sink is blocked.;
    power cut|отключение электричества|n|There was a power cut last night.;
    damp|сырой|a|The bathroom is damp.;
    mess|беспорядок|n|The kitchen is a mess!;
    out of order|не работает|o|The lift is out of order.;
    noisy neighbours|шумные соседи|o|We have noisy neighbours.`],
   ['ho3-house-2','Around the house','ремонт и уход за домом',`
    decorate|делать ремонт (красить, клеить)|v|We're decorating the bedroom.;
    paint|красить|v|We painted the walls white.;
    wallpaper|обои|n|I don't like this wallpaper.;
    fix|чинить, исправлять (разг.)|v|Can you fix the tap?;
    replace|заменить|v|We need to replace the window.;
    tool|инструмент|n|Where's my tool box?;
    hammer|молоток|n|Pass me the hammer.;
    ladder|стремянка|n|Hold the ladder, please.;
    DIY|сделай сам, ремонт своими руками|n|My husband loves DIY.|do it yourself;
    tidy|аккуратный, прибранный|a|Keep your room tidy.;
    messy|неубранный|a|The kitchen is messy.;
    spare room|свободная комната|n|You can sleep in the spare room.;
    storage|место для хранения|n|There isn't much storage.;
    light bulb|лампочка|n|The light bulb has gone.`],
   ['ho3-bills','Home & bills','коммунальные услуги и ключи',`
    electricity|электричество|n|The electricity went off last night.;
    gas|газ|n|We cook with gas.;
    electricity bill|счёт за электричество|n|Our electricity bill is very high.;
    water bill|счёт за воду|n|Have you paid the water bill?;
    internet connection|подключение к интернету|n|The internet connection is very slow.;
    lock|замок, запирать|n|The lock on the door is broken.;
    unlock|отпирать|v|Can you unlock the door?;
    spare key|запасной ключ|n|My neighbour has a spare key.;
    burglar alarm|охранная сигнализация|n|We put in a burglar alarm.;
    meter|счётчик|n|Someone came to read the gas meter.;
    plug in|включить в розетку|v|Plug in the kettle.;
    unplug|выключить из розетки|v|Unplug the TV before you go on holiday.;
    switch on|включить|v|Switch on the light, please.|также turn on;
    switch off|выключить|v|Don't forget to switch off the oven.|также turn off`],
   ],
B2:[
   ['ho4-renting','Renting & moving','аренда, покупка, переезд',`
    deposit|залог|n|We paid a deposit of one month's rent.;
    lease|договор аренды|n|We signed a one-year lease.|также tenancy agreement;
    move in|въехать|v|We moved in last week.;
    move out|выехать|v|They moved out in June.;
    furnished|меблированный|a|It's a furnished flat.;
    bills included|коммунальные включены|o|The rent is 3000 złoty, bills included.;
    estate agent|агент по недвижимости|n|The estate agent showed us the flat.|амер. real estate agent;
    mortgage|ипотека|n|We took out a mortgage.|t не читается;
    detached house|отдельный дом|n|They live in a detached house.;
    semi-detached|дом на две семьи|a|We bought a semi-detached house.;
    terraced house|дом в ряду, таунхаус|n|Terraced houses are common in England.|амер. row house;
    flatmate|сосед по квартире|n|I share a flat with two flatmates.|амер. roommate;
    pack|упаковывать|v|We packed everything into boxes.;
    unpack|распаковывать|v|We still haven't unpacked.`],
   ['ho4-home-2','Home B2','дом подробнее',`
    open-plan|открытой планировки|a|We have an open-plan kitchen.;
    renovate|ремонтировать (капитально)|v|They renovated an old farmhouse.;
    extension|пристройка|n|We built an extension.;
    conservatory|зимний сад|n|We have breakfast in the conservatory.;
    loft|чердак, мансарда (брит.)|n|The loft is full of boxes.;
    cellar|погреб|n|We keep wine in the cellar.;
    driveway|подъездная дорожка|n|Park on the driveway.;
    porch|крыльцо|n|We sat on the porch.;
    chimney|дымоход|n|Smoke came out of the chimney.;
    fireplace|камин|n|We have a real fireplace.;
    floorboards|половицы|n|The floorboards creak.;
    insulation|утепление|n|Good insulation saves energy.;
    en-suite|со своей ванной|a|Each bedroom has an en-suite bathroom.;
    spacious|просторный|a|The flat is very spacious.`],
   ['ho4-problems-2','Home problems B2','проблемы в доме',`
    burst pipe|лопнувшая труба|n|A burst pipe flooded the kitchen.;
    mould|плесень|n|There's mould in the bathroom.|амер. mold;
    crack|трещина|n|There's a crack in the wall.;
    leaking roof|протекающая крыша|n|We have a leaking roof.;
    draughty|продуваемый|a|The old house is draughty.;
    infestation|нашествие (вредителей)|n|We had a mouse infestation.;
    cockroach|таракан|n|I saw a cockroach!;
    fuse|предохранитель|n|The fuse has blown.;
    boiler|бойлер, котёл|n|The boiler broke down.;
    flood|затопить|v|The bathroom flooded.;
    clog|засорить|v|Hair clogged the drain.;
    break-in|взлом|n|There was a break-in next door.;
    insurance|страховка|n|Does your insurance cover it?;
    maintenance|обслуживание, содержание|n|The building needs maintenance.`],
   ['ho4-interior','Interior & style','интерьер',`
    décor|оформление, декор|n|I love the décor in this café.;
    furnishings|обстановка, мебель и текстиль|n|The furnishings are a bit old-fashioned.;
    tiles|плитка|n|We put new tiles in the bathroom.;
    lampshade|абажур|n|The lampshade is covered in dust.;
    chandelier|люстра (с подвесками)|n|There's a huge chandelier in the hall.;
    built-in wardrobe|встроенный шкаф|n|The bedroom has a built-in wardrobe.;
    skylight|мансардное окно|n|The skylight lets in a lot of light.;
    bay window|эркер|n|There's a sofa in the bay window.;
    airy|просторный, полный воздуха|a|The flat is light and airy.;
    clutter|хлам, беспорядок|n|There's too much clutter in the kitchen.;
    cluttered|захламлённый|a|His desk is always cluttered.;
    minimalist|минималистичный|a|They have a very minimalist flat.;
    rustic|деревенский (о стиле)|a|I like the rustic style of the cottage.;
    natural light|естественный свет|n|The room gets a lot of natural light.`],
   ]},
  extra:{A1:[
   ['ho-things-2','Things at home 2','посуда и мелочи',`
    armchair|кресло|n|Grandad sleeps in his armchair.;
    carpet|ковёр|n|There's a red carpet in the living room.;
    curtains|шторы|n|Close the curtains, please.;
    picture|картина|n|I like that picture.;
    clock|часы (настенные)|n|The clock is on the wall.|наручные — watch;
    cup|чашка|n|Would you like a cup of tea?;
    plate|тарелка|n|Put the plates on the table.;
    glass|стакан|n|Can I have a glass of water?;
    knife|нож|n|I need a sharp knife.|мн. ч. knives;
    fork|вилка|n|Eat with a knife and fork.;
    spoon|ложка|n|Can I have a spoon?;
    towel|полотенце|n|There's a clean towel in the bathroom.;
    pillow|подушка|n|I need another pillow.;
    blanket|одеяло, плед|n|It's cold. Take a blanket.`],
   ['ho-things-3','Things & gadgets','вещи и техника дома',`
    TV|телевизор|n|The TV is in the living room.;
    computer|компьютер|n|My computer is very old.;
    phone|телефон|n|Where's my phone?;
    radio|радио|n|I listen to the radio in the car.;
    camera|фотоаппарат|n|I have a new camera.;
    toilet|туалет|n|Where's the toilet, please?;
    soap|мыло|n|There's no soap in the bathroom.;
    toothbrush|зубная щётка|n|I need a new toothbrush.;
    toothpaste|зубная паста|n|Can you buy some toothpaste?;
    shampoo|шампунь|n|This shampoo smells nice.;
    box|коробка|n|The books are in that box.;
    photo|фотография|n|This is a photo of my family.;
    paper|бумага|n|Have you got a piece of paper?`],
   ],
A2:[
   ['ho2-kitchen','Kitchen & appliances','техника и кухня',`
    dishwasher|посудомоечная машина|n|Put the plates in the dishwasher.;
    sink|раковина|n|The dishes are in the sink.;
    tap|кран|n|Turn off the tap.|амер. faucet;
    microwave|микроволновка|n|Heat it in the microwave.;
    kettle|чайник (для кипятка)|n|Put the kettle on.;
    toaster|тостер|n|The toaster is broken.;
    oven|духовка|n|The cake is in the oven.;
    freezer|морозилка|n|There's ice cream in the freezer.;
    bin|мусорное ведро|n|Put it in the bin.|амер. trash can;
    drawer|ящик (выдвижной)|n|The knives are in the top drawer.;
    mug|кружка|n|I drink tea from a big mug.;
    bowl|миска|n|A bowl of soup, please.;
    iron|утюг|n|The iron is hot.|гладить — to iron, do the ironing;
    vacuum cleaner|пылесос|n|The vacuum cleaner is in the cupboard.|также hoover`],
   ['ho2-homes','Types of home','какое жильё',`
    cottage|домик в деревне|n|They have a cottage by the lake.;
    block of flats|многоквартирный дом|n|We live in a block of flats.|амер. apartment building;
    studio flat|квартира-студия|n|I rent a small studio flat.;
    attic|чердак|n|We keep old things in the attic.;
    basement|подвал|n|The washing machine is in the basement.;
    hall|прихожая|n|Leave your shoes in the hall.;
    front door|входная дверь|n|Someone is at the front door.;
    fence|забор|n|There's a fence around the garden.;
    owner|владелец|n|The owner lives upstairs.;
    share a flat|снимать квартиру вместе|o|I share a flat with a friend.;
    location|расположение|n|The flat is small but the location is great.;
    central heating|центральное отопление|n|The house has central heating.;
    air conditioning|кондиционер|n|The hotel room has air conditioning.`],
   ['ho2-garden','Garden & outside','сад и двор',`
    garden gate|калитка|n|Please close the garden gate.;
    lawn|газон|n|The children are playing on the lawn.;
    flower bed|клумба|n|There are roses in the flower bed.;
    pot|горшок|n|Put the plant in a bigger pot.;
    shed|сарай|n|The bikes are in the shed.;
    swing|качели|n|There's a swing in the garden.;
    barbecue|барбекю, гриль|n|Let's have a barbecue on Sunday.;
    bench|скамейка|n|We sat on a bench in the park.;
    mow the lawn|косить газон|o|I mow the lawn every week.;
    grow vegetables|выращивать овощи|o|My parents grow vegetables.;
    plant flowers|сажать цветы|o|We planted flowers in spring.;
    pick fruit|собирать фрукты|o|We picked apples in the garden.`],
   ],
B1:[
   ['ho3-furniture','Furniture & fittings','обстановка',`
    bookcase|книжный шкаф|n|The bookcase is full.;
    chest of drawers|комод|n|My socks are in the chest of drawers.;
    bedside table|тумбочка|n|My phone is on the bedside table.;
    sofa bed|диван-кровать|n|Guests sleep on the sofa bed.;
    cushion|диванная подушка|n|There are cushions on the sofa.;
    rug|коврик|n|There's a rug by the bed.;
    blinds|жалюзи|n|Close the blinds.;
    radiator|батарея (отопления)|n|The radiator is hot.;
    socket|розетка|n|Is there a socket near the bed?|амер. outlet;
    switch|выключатель|n|The light switch is by the door.;
    shelves|полки|n|Put the books on the shelves.;
    desk|письменный стол|n|I work at my desk.;
    doorbell|дверной звонок|n|The doorbell rang.;
    mat|коврик у двери|n|Wipe your feet on the mat.`],
   ['ho3-neighbours','Neighbours & community','соседи и район',`
    neighbourhood|район|n|It's a safe neighbourhood.;
    next-door neighbour|сосед по двери|n|Our next-door neighbour is very kind.;
    complain about|жаловаться на|v|They complained about the noise.;
    noise|шум|n|The noise kept me awake.;
    keep someone awake|не давать спать|o|The dog kept me awake all night.;
    get on with|ладить|v|We get on well with our neighbours.;
    lend a hand|помочь|o|Can you lend me a hand?;
    keep an eye on|присмотреть за|o|Can you keep an eye on the house?;
    move in next door|въехать по соседству|o|A young couple moved in next door.;
    local|местный|a|Our local shop is open late.;
    community|сообщество|n|It's a friendly community.;
    resident|житель|n|Residents can park here.;
    street party|праздник на улице|n|We had a street party.;
    garden fence|забор между участками|n|We talk over the garden fence.`],
   ],
B2:[
   ['ho4-property','Property & housing','жильё и недвижимость',`
    property|недвижимость|n|Property prices are rising.;
    landlady|хозяйка (квартиры)|n|Our landlady is very nice.;
    housing|жильё (жилой фонд)|n|There's a housing shortage.;
    affordable|доступный по цене|a|We need affordable housing.;
    house-hunting|поиск жилья|n|We're house-hunting.;
    viewing|просмотр (квартиры)|n|We have a viewing at six.;
    down payment|первый взнос|n|We saved for a down payment.;
    evict|выселить|v|They were evicted.;
    neighbourhood watch|соседский дозор|n|We have a neighbourhood watch.;
    gated community|закрытый посёлок|n|They live in a gated community.;
    high-rise|многоэтажный|a|They live in a high-rise building.;
    housing estate|жилой массив|n|He grew up on a housing estate.;
    for rent|сдаётся|o|The flat is for rent.;
    for sale|продаётся|o|The house is for sale.`],
   ['ho4-cleaning','Housework B2','уборка подробнее',`
    scrub|тереть, скрести|v|Scrub the floor.;
    wipe|вытирать|v|Wipe the table.;
    sweep|подметать|v|Sweep the floor.;
    mop|мыть шваброй|v|I mopped the kitchen floor.;
    polish|полировать|v|Polish your shoes.;
    rinse|ополаскивать|v|Rinse the glasses.;
    soak|замачивать|v|Soak the pan in hot water.;
    declutter|расхламить|v|I need to declutter my wardrobe.;
    spotless|безупречно чистый|a|The house is spotless.;
    filthy|очень грязный|a|The oven is filthy.;
    dustpan|совок|n|Where's the dustpan and brush?;
    bucket|ведро|n|Fill the bucket with water.;
    sponge|губка|n|Use a sponge.;
    detergent|моющее средство|n|Add some detergent.`],
   ['ho4-diy','DIY & tools','инструменты и ремонт',`
    drill|дрель, сверлить|n|I need a drill to put up this shelf.;
    screwdriver|отвёртка|n|Pass me the screwdriver.;
    screw|шуруп, винт|n|One screw is missing.;
    spanner|гаечный ключ (брит.)|n|Use a spanner to tighten it.|амер. wrench;
    saw|пила|n|He cut the wood with a saw.;
    tape measure|рулетка|n|Measure the wall with a tape measure.;
    paintbrush|кисть|n|Clean the paintbrush after use.;
    sandpaper|наждачная бумага|n|Rub it down with sandpaper.;
    assemble|собирать (мебель)|v|It took hours to assemble the wardrobe.;
    put up shelves|вешать полки|o|My dad helped me put up shelves.;
    tighten|затягивать|v|Tighten the screws.;
    loosen|ослаблять|v|Loosen the screw a little.;
    drill a hole|просверлить дыру|o|We need to drill a hole in the wall.;
    toolbox|ящик для инструментов|n|The hammer is in the toolbox.`],
   ]}},

 {key:'food', name:'Food & drink', ru:'Еда и напитки', color:'#b98535',
  info:'Продукты, напитки, приёмы пищи и фразы, чтобы заказать в кафе.',
  cells:{A1:[
   ['fo-food','Food','продукты',`
    bread|хлеб|n|I buy bread every morning.;
    cheese|сыр|n|I love cheese sandwiches.;
    butter|масло (сливочное)|n|Can you pass the butter?;
    egg|яйцо|n|I have two eggs for breakfast.;
    meat|мясо|n|She doesn't eat meat.;
    chicken|курица|n|We have chicken and rice for dinner.;
    fish|рыба|n|I eat fish on Fridays.;
    rice|рис|n|Do you want rice or potatoes?;
    pasta|макароны|n|The children love pasta.;
    potatoes|картофель|n|We eat a lot of potatoes.;
    vegetables|овощи|n|Eat more vegetables!;
    fruit|фрукты|n|I eat fruit every day.;
    apple|яблоко|n|I have an apple for lunch.;
    salad|салат (блюдо)|n|I'd like a green salad.;
    soup|суп|n|This soup is very hot.;
    sugar|сахар|n|Coffee with milk, no sugar.`],
   ['fo-drinks','Drinks & meals','напитки и приёмы пищи',`
    water|вода|n|I drink a lot of water.;
    milk|молоко|n|Do you take milk in your tea?;
    coffee|кофе|n|I drink coffee every morning.;
    tea|чай|n|Do you like green tea?;
    juice|сок|n|The children drink orange juice.;
    beer|пиво|n|Two beers, please.;
    wine|вино|n|Red or white wine?;
    breakfast|завтрак|n|What do you have for breakfast?;
    lunch|обед|n|Lunch is at one o'clock.;
    dinner|ужин|n|Dinner is ready!;
    a cup of|чашка (чего-то)|o|I'd like a cup of tea.;
    a glass of|стакан (чего-то)|o|A glass of water, please.;
    a bottle of|бутылка (чего-то)|o|We need a bottle of wine.;
    eat|есть|v|What do you want to eat?;
    drink|пить|v|I don't drink coffee in the evening.`],
   ['fo-cafe','In a café','заказ и счёт',`
    menu|меню|n|Can I see the menu, please?;
    bill|счёт (в кафе, ресторане)|n|Can we have the bill, please?;
    waiter|официант|n|The waiter is very friendly.;
    order|заказывать|v|Are you ready to order?;
    Can I have …?|Можно мне …?|o|Can I have a coffee, please?;
    I'd like …|Я бы хотел …|o|I'd like the chicken soup, please.;
    Anything else?|Что-нибудь ещё?|o|Anything else? — No, thanks.;
    eat in|есть на месте|o|Do you want to eat in or take away?;
    take away|навынос|o|A coffee to take away, please.;
    Here you are.|Вот, пожалуйста (протягивая что-то)|o|Here you are. Your coffee.;
    cake|торт, пирожное|n|This chocolate cake is delicious.;
    ice cream|мороженое|n|The children want ice cream.`],
   ],
A2:[
   ['fo2-cooking','Cooking verbs','как готовить',`
    boil|варить, кипятить|v|Boil the eggs for five minutes.;
    fry|жарить на сковороде|v|Fry the onions in a little oil.;
    bake|печь|v|My wife bakes bread on Sundays.;
    roast|запекать (мясо, овощи)|v|We roast a chicken for dinner.;
    grill|жарить на гриле|v|Grill the fish for ten minutes.;
    cut|резать|v|Can you cut the bread?;
    chop|мелко нарезать|v|Chop the onions.;
    peel|чистить (от кожуры)|v|Peel the potatoes.;
    mix|смешивать|v|Mix the eggs and the sugar.;
    add|добавить|v|Add some salt.;
    heat|нагревать|v|Heat the oil in a pan.;
    recipe|рецепт|n|This is my grandmother's recipe.|рецепт от врача — prescription;
    frying pan|сковорода|n|Put the frying pan on the cooker.;
    saucepan|кастрюля|n|Boil some water in a saucepan.`],
   ['fo2-containers','Containers & quantities','пачка, банка, кусок',`
    a packet of|пачка|o|I bought a packet of biscuits.|амер. a package of;
    a tin of|консервная банка (брит.)|o|We need a tin of tuna.|амер. a can of;
    a can of|банка (напитка)|o|Can I have a can of cola?;
    a jar of|стеклянная банка|o|There's a jar of honey in the cupboard.;
    a carton of|пакет (сока, молока)|o|Get a carton of milk, please.;
    a bag of|пакет, мешок|o|I carried a bag of potatoes home.;
    a box of|коробка|o|He gave me a box of chocolates.;
    a loaf of|буханка|o|I buy a loaf of bread every day.;
    a slice of|ломтик|o|Can I have a slice of cheese?;
    a piece of|кусок|o|Would you like a piece of cake?;
    a kilo of|килограмм|o|A kilo of apples, please.;
    a bunch of|гроздь, букет|o|I bought a bunch of bananas.|букет цветов — тоже a bunch of flowers;
    a little|немного (неисчисл.)|o|Just a little milk, please.|исчисляемые — a few;
    a few|несколько (немного)|o|I need a few eggs.`],
   ['fo2-fruit','Fruit & vegetables 2','фрукты и овощи',`
    pineapple|ананас|n|I love pineapple on pizza.;
    plum|слива|n|These plums are not ripe yet.;
    melon|дыня|n|Melon is my favourite fruit.;
    mango|манго|n|Can you cut the mango?;
    lettuce|салат-латук|n|Wash the lettuce first.;
    beans|фасоль, бобы|n|I'd like some green beans.;
    corn|кукуруза|n|We grilled corn on the barbecue.;
    spinach|шпинат|n|Spinach is very healthy.;
    broccoli|брокколи|n|My son doesn't eat broccoli.;
    cauliflower|цветная капуста|n|Cauliflower soup is delicious.;
    pumpkin|тыква|n|We make pumpkin soup in autumn.;
    avocado|авокадо|n|I have avocado on toast for breakfast.;
    olives|оливки|n|Do you like olives?`],
   ],
B1:[
   ['fo3-restaurant','Restaurants & describing food','вкус и ресторан',`
    spicy|острый|a|Thai food is very spicy.|также hot;
    sweet|сладкий|a|This cake is too sweet.;
    sour|кислый|a|Lemons are sour.;
    bitter|горький|a|Dark chocolate is a bit bitter.;
    salty|солёный|a|The soup is too salty.;
    raw|сырой (не приготовленный)|a|Sushi is made with raw fish.|сырой (влажный) — damp;
    fresh|свежий|a|The bread is fresh.;
    tasty|вкусный (обычное слово)|a|That was a tasty meal.;
    tasteless|безвкусный|a|The vegetables were tasteless.;
    starter|закуска|n|Would you like a starter?|амер. appetizer;
    main course|основное блюдо|n|For the main course I'll have fish.;
    dessert|десерт|n|What's for dessert?|пустыня — desert;
    tip|чаевые|n|We left a ten per cent tip.;
    book a table|заказать столик|o|Let's book a table for eight.`],
   ['fo3-restaurant-2','Eating out','в ресторане',`
    order|заказ|n|Can I take your order?;
    reservation|бронь|n|I have a reservation for two.;
    vegetarian dish|вегетарианское блюдо|n|Do you have any vegetarian dishes?;
    rare|с кровью (о мясе)|a|I'd like my steak rare.;
    well done|хорошо прожаренный|a|Well done, please.;
    side dish|гарнир|n|Chips come as a side dish.;
    the specials|блюда дня|n|What are today's specials?;
    service charge|плата за обслуживание|n|Is service charge included?;
    takeaway|еда навынос|n|Let's get a takeaway tonight.|амер. takeout;
    fast food|фастфуд|n|I try not to eat fast food.;
    slice|кусочек|n|Another slice of pizza?;
    set menu|комплексный обед|n|The set menu is cheaper.;
    waitress|официантка|n|The waitress brought the bill.;
    Enjoy your meal!|Приятного аппетита!|o|Here's your food. Enjoy your meal!`],
   ['fo3-cooking-3','Cooking 3','приготовление подробнее',`
    boiled|варёный|a|I like boiled eggs.;
    fried|жареный|a|Fried food is unhealthy.;
    grilled|на гриле|a|I'll have grilled fish.;
    roasted|запечённый|a|Roasted vegetables are delicious.;
    baked|печёный|a|Baked potatoes, please.;
    steamed|на пару|a|Steamed rice, please.;
    mashed|пюре|a|Mashed potatoes with sausages.;
    stuffed|фаршированный|a|We had stuffed peppers.;
    scrambled eggs|омлет-болтунья|n|Scrambled eggs on toast, please.;
    home-cooked|домашний|a|Nothing beats a home-cooked meal.;
    overcooked|переваренный|a|The pasta is overcooked.;
    undercooked|недоваренный|a|The chicken is undercooked.;
    frozen|замороженный|a|I bought frozen vegetables.;
    tinned|консервированный|a|Tinned tomatoes are cheap.|амер. canned`],
   ],
B2:[
   ['fo4-cooking','Cooking B2','кулинария',`
    simmer|тушить на медленном огне|v|Let the soup simmer.;
    whisk|взбивать|v|Whisk the eggs.;
    grate|тереть на тёрке|v|Grate the cheese.;
    slice|нарезать ломтиками|v|Slice the bread.;
    dice|нарезать кубиками|v|Dice the onions.;
    marinate|мариновать|v|Marinate the chicken overnight.;
    season|приправлять|v|Season with salt and pepper.;
    sprinkle|посыпать|v|Sprinkle with sugar.;
    drain|слить воду|v|Drain the pasta.;
    knead|месить|v|Knead the dough.;
    defrost|разморозить|v|Defrost the meat.;
    garnish|украсить (блюдо)|v|Garnish with parsley.;
    dough|тесто|n|The dough needs to rise.;
    leftovers|остатки еды|n|We had leftovers for lunch.`],
   ['fo4-taste','Taste & texture','вкус и текстура',`
    crunchy|хрустящий|a|The apple is crunchy.;
    crispy|хрустящий (жареный)|a|I like crispy bacon.;
    juicy|сочный|a|This orange is juicy.;
    creamy|кремовый|a|The sauce is creamy.;
    chewy|жёсткий, тянучий|a|The meat is chewy.;
    greasy|жирный|a|Chips are greasy.;
    stale|чёрствый|a|The bread is stale.;
    mouth-watering|аппетитный|a|The smell was mouth-watering.;
    savoury|несладкий, солёный|a|I prefer savoury snacks.;
    rich|сытный, жирный|a|The cake is very rich.;
    tender|нежный (о мясе)|a|The steak was tender.;
    ripe|спелый|a|The bananas are ripe.;
    rotten|гнилой|a|The apples are rotten.;
    off|испорченный|a|The milk is off.`],
   ['fo4-restaurant','Eating out B2','рестораны',`
    cuisine|кухня (национальная)|n|I love Italian cuisine.;
    speciality|фирменное блюдо|n|Pierogi are the speciality here.;
    delicacy|деликатес|n|Snails are a delicacy in France.;
    a la carte|по меню|o|We ordered a la carte.;
    buffet|шведский стол|n|Breakfast is a buffet.;
    portion|порция|n|The portions are small.;
    sommelier|сомелье|n|Ask the sommelier.;
    overpriced|завышенный по цене|a|The restaurant is overpriced.;
    good value|выгодно|o|The lunch menu is good value.;
    dine out|ужинать вне дома|v|We dine out on Fridays.;
    street food|уличная еда|n|I love street food.;
    food critic|ресторанный критик|n|The food critic loved it.;
    fine dining|высокая кухня|n|It's a fine dining restaurant.;
    Michelin star|звезда Мишлен|n|The restaurant has a Michelin star.`],
   ['fo4-groceries','Food shopping B2','продукты и покупки',`
    groceries|продукты|n|I order groceries online.;
    best-before date|срок годности (лучше употребить до)|n|Check the best-before date.;
    use-by date|употребить до (строгий срок)|n|Don't eat it after the use-by date.;
    free-range|от птицы свободного выгула|a|We only buy free-range eggs.;
    locally sourced|местного производства|a|The restaurant uses locally sourced food.;
    in season|по сезону|o|Strawberries are in season now.;
    seasonal produce|сезонные продукты|n|The menu is based on seasonal produce.;
    ready meal|готовое блюдо (разогреть)|n|I don't like ready meals.;
    home-grown|домашний, со своего огорода|a|These are home-grown tomatoes.;
    farmers' market|фермерский рынок|n|We go to the farmers' market on Saturdays.;
    perishable|скоропортящийся|a|Keep perishable food in the fridge.;
    staple food|основной продукт питания|n|Rice is a staple food in Asia.;
    bulk buying|закупка оптом|n|Bulk buying saves money.;
    food waste|пищевые отходы|n|We try to reduce food waste.`],
   ['fo4-eating','Eating habits','как мы едим',`
    nibble|грызть, есть понемногу|v|She nibbled a biscuit.;
    sip|потягивать, отпивать|v|He sipped his coffee slowly.;
    gobble|глотать, жадно есть|v|The kids gobbled their dinner.;
    munch|жевать, хрустеть|v|He was munching an apple.;
    swallow|глотать|v|Swallow the pill with water.;
    devour|поглощать (с жадностью)|v|We devoured the whole cake.;
    peckish|слегка голодный|a|I'm feeling a bit peckish.;
    full up|сытый|a|No more, thanks, I'm full up.;
    a second helping|добавка|o|Can I have a second helping?;
    fussy eater|привереда в еде|n|My son is a fussy eater.;
    grab a bite|перекусить|o|Let's grab a bite before the film.;
    wolf down|проглотить (быстро)|v|He wolfed down his lunch.;
    skip breakfast|пропустить завтрак|o|I often skip breakfast.;
    comfort food|еда для утешения|n|Soup is my comfort food.`],
   ]},
  extra:{A1:[
   ['fo-food-2','Food 2','фрукты, овощи, перекусы',`
    banana|банан|n|I have a banana for breakfast.;
    orange|апельсин|n|Can I have an orange?;
    lemon|лимон|n|Tea with lemon, please.;
    strawberry|клубника|n|I love strawberries.;
    grapes|виноград|n|We bought some grapes.;
    tomato|помидор|n|Put a tomato in the salad.|мн. ч. tomatoes;
    onion|лук|n|Chop the onion.;
    carrot|морковь|n|Rabbits like carrots.;
    pepper|перец|n|Add salt and pepper.|ещё сладкий перец — a red pepper;
    mushroom|гриб|n|We picked mushrooms in the forest.;
    biscuit|печенье|n|Would you like a biscuit?|амер. cookie;
    chocolate|шоколад|n|I eat too much chocolate.;
    yoghurt|йогурт|n|I have yoghurt for breakfast.|амер. yogurt;
    sausage|сосиска, колбаса|n|We had sausages for dinner.;
    snack|перекус|n|I have a snack at eleven.`],
   ['fo-food-3','Snacks & fast food','перекус и фастфуд',`
    food|еда|n|I love Italian food.;
    meal|приём пищи, блюдо|n|Dinner is my favourite meal.;
    pizza|пицца|n|Let's order a pizza.;
    sandwich|бутерброд, сэндвич|n|I have a sandwich for lunch.;
    hamburger|гамбургер|n|He eats a hamburger every day.;
    chips|картошка фри (брит.)|n|Fish and chips, please.|амер. fries, а чипсы — crisps (брит.);
    sweets|конфеты|n|Children love sweets.|амер. candy;
    pie|пирог|n|My grandmother makes apple pie.;
    pear|груша|n|I'd like a pear, please.;
    peach|персик|n|These peaches are very sweet.;
    cherry|вишня, черешня|n|We have a cherry tree in the garden.;
    watermelon|арбуз|n|Watermelon is great in summer.;
    lemonade|лимонад|n|Two lemonades, please.;
    hot chocolate|горячий шоколад|n|I drink hot chocolate in winter.`],
   ],
A2:[
   ['fo2-cooking-2','Cooking 2','на кухне',`
    stir|помешивать|v|Stir the soup.;
    taste|пробовать (на вкус), иметь вкус|v|Taste the sauce. Does it need salt?;
    burn|сжечь, подгореть|v|I burnt the toast.;
    melt|таять, растапливать|v|Melt the butter in a pan.;
    freeze|замораживать|v|You can freeze the bread.;
    serve|подавать (блюдо)|v|Serve the soup hot.;
    spread|намазывать|v|Spread butter on the bread.;
    ingredients|ингредиенты|n|What ingredients do we need?;
    dish|блюдо (кушанье)|n|Pierogi is a traditional Polish dish.|ещё «тарелка, посуда»;
    sauce|соус|n|The pasta sauce is delicious.;
    oil|масло (растительное)|n|Fry it in a little oil.;
    flour|мука|n|You need flour to make bread.|цветок — flower (читается так же);
    salt|соль|n|Pass the salt, please.;
    portion|порция|n|The portions here are huge.`],
   ['fo2-food-2','Meat, fish & more','мясо, рыба, завтрак',`
    beef|говядина|n|I don't eat beef.;
    pork|свинина|n|We had pork chops for dinner.;
    lamb|баранина, ягнёнок|n|Roast lamb is a British classic.;
    ham|ветчина|n|A ham sandwich, please.;
    bacon|бекон|n|Bacon and eggs for breakfast.;
    steak|стейк|n|How would you like your steak?;
    prawns|креветки|n|I'm allergic to prawns.|амер. shrimp;
    tuna|тунец|n|I'll have a tuna salad.;
    salmon|лосось|n|Salmon is good for you.|l не читается;
    seafood|морепродукты|n|Do you like seafood?;
    cereal|хлопья (на завтрак)|n|The kids eat cereal every morning.;
    jam|джем, варенье|n|Toast with jam, please.;
    honey|мёд|n|I put honey in my tea.;
    peas|горошек|n|Peas and carrots, please.`],
   ],
B1:[
   ['fo3-food-3','Food B1','продукты подробнее',`
    cabbage|капуста|n|Bigos is made with cabbage.;
    cucumber|огурец|n|Add a cucumber to the salad.;
    garlic|чеснок|n|I love garlic.;
    herbs|травы, зелень|n|Add some fresh herbs.;
    spices|специи|n|Indian food has lots of spices.;
    nuts|орехи|n|I'm allergic to nuts.;
    cream|сливки|n|Strawberries and cream.;
    pastry|выпечка, тесто|n|I love French pastries.;
    dumplings|пельмени, вареники|n|Pierogi are Polish dumplings.;
    pancakes|блины|n|We had pancakes for breakfast.;
    vinegar|уксус|n|Add oil and vinegar.;
    whole grain|цельнозерновой|a|Whole grain bread is healthy.;
    dairy products|молочные продукты|n|I don't eat dairy products.;
    fizzy drink|газировка|n|Fizzy drinks have a lot of sugar.|амер. soda`],
   ['fo3-diet','Diet & nutrition','питание',`
    protein|белок|n|Eggs are full of protein.;
    fat|жир|n|This food is high in fat.;
    fibre|клетчатка|n|Vegetables contain fibre.|амер. fiber;
    calories|калории|n|How many calories are in this?;
    portion size|размер порции|n|Watch your portion size.;
    skip a meal|пропустить приём пищи|o|Don't skip breakfast.;
    overeat|переедать|v|I always overeat at Christmas.;
    go without|обходиться без|v|I can't go without coffee.;
    cut out|исключить|v|I cut out sugar.;
    sugar-free|без сахара|a|I buy sugar-free gum.;
    organic|органический|a|We buy organic vegetables.;
    nutritious|питательный|a|Soup is cheap and nutritious.;
    starving|очень голодный|a|I'm starving!;
    appetite|аппетит|n|I've lost my appetite.`],
   ['fo3-kitchen','Kitchen tools','кухонные принадлежности',`
    chopping board|разделочная доска|n|Put the onions on the chopping board.;
    lid|крышка|n|Put a lid on the saucepan.;
    tray|поднос|n|She brought the tea on a tray.;
    teapot|заварочный чайник|n|There's more tea in the teapot.;
    jug|кувшин|n|Can I have a jug of water?;
    tin opener|консервный нож|n|Where's the tin opener?|амер. can opener;
    bottle opener|открывалка|n|Have you got a bottle opener?;
    grater|тёрка|n|Grate the cheese with a grater.;
    kitchen scales|кухонные весы|n|Weigh the flour on the kitchen scales.;
    baking tray|противень|n|Put the cookies on a baking tray.;
    oven glove|прихватка|n|Use an oven glove, it's hot!;
    peeler|овощечистка|n|I peel potatoes with a peeler.;
    ladle|половник|n|Serve the soup with a ladle.;
    wooden spoon|деревянная ложка|n|Stir it with a wooden spoon.`],
   ],
B2:[
   ['fo4-diet-2','Health & diet B2','питание и здоровье',`
    nutrient|питательное вещество|n|Vegetables are full of nutrients.;
    intolerant|с непереносимостью|a|I'm lactose intolerant.;
    gluten-free|безглютеновый|a|Do you have gluten-free bread?;
    plant-based|растительный|a|She follows a plant-based diet.;
    wholesome|полезный (для здоровья), питательный|a|It's a wholesome meal.;
    moderation|умеренность|n|Eat everything in moderation.;
    binge|переедать, объедаться|v|I binged on chocolate.;
    crave|сильно хотеть|v|I crave sweets.;
    cut down on|сократить|v|Cut down on salt.;
    obesity|ожирение|n|Obesity is increasing.;
    additives|добавки|n|This food has no additives.;
    sugary|сладкий, с сахаром|a|Avoid sugary drinks.;
    hydrated|с достаточным количеством воды|a|Stay hydrated.;
    eat on the go|есть на ходу|o|I often eat on the go.`],
   ['fo4-idioms-2','Food idioms 2','ещё идиомы',`
    go bananas|сойти с ума|o|The fans went bananas.;
    be a couch potato|быть лежебокой|o|Don't be a couch potato.;
    take something with a pinch of salt|относиться скептически|o|Take his stories with a pinch of salt.;
    butter someone up|подлизываться|o|He's buttering up the boss.;
    cry over spilt milk|горевать о прошлом|o|There's no use crying over spilt milk.;
    have bigger fish to fry|есть дела поважнее|o|I have bigger fish to fry.;
    sell like hot cakes|разлетаться как горячие пирожки|o|The tickets sold like hot cakes.;
    the apple of my eye|зеница ока|o|My daughter is the apple of my eye.;
    walk on eggshells|ходить на цыпочках|o|I'm walking on eggshells around him.;
    a smart cookie|умница|o|She's a smart cookie.;
    bite off more than you can chew|взять на себя слишком много|o|I bit off more than I could chew.;
    food for thought|пища для размышлений|o|That gave me food for thought.;
    half-baked|непродуманный|a|It's a half-baked idea.;
    cool as a cucumber|невозмутимый|o|She stayed cool as a cucumber.`],
   ['fo4-idioms','Diet & food idioms','питание и идиомы',`
    vegetarian|вегетарианец|n|She's been a vegetarian for years.;
    vegan|веган|n|My friend is vegan.;
    on a diet|на диете|o|I'm on a diet.;
    low-fat|обезжиренный|a|I buy low-fat yoghurt.;
    processed food|переработанная еда|n|Try to avoid processed food.;
    home-made|домашний (приготовленный дома)|a|This is home-made jam.;
    a piece of cake|проще простого|o|The test was a piece of cake.;
    have a sweet tooth|быть сладкоежкой|o|I have a sweet tooth.;
    not my cup of tea|не моё|o|Opera isn't my cup of tea.;
    the icing on the cake|вишенка на торте|o|The sunny weather was the icing on the cake.;
    spill the beans|проболтаться|o|Who spilled the beans?;
    in a nutshell|в двух словах|o|In a nutshell, we need more money.;
    bring home the bacon|зарабатывать на жизнь|o|Who brings home the bacon in your family?`],
   ]}},

 {key:'town', name:'Town & transport', ru:'Город и транспорт', color:'#4a8a5a',
  info:'Места в городе, транспорт и как спросить дорогу.',
  cells:{A1:[
   ['to-places','Places in town','куда пойти',`
    street|улица|n|I live on a quiet street.;
    square|площадь|n|The café is in the main square.;
    park|парк|n|Let's walk in the park.;
    station|вокзал, станция (поезда, метро)|n|The station is near here.;
    airport|аэропорт|n|How do I get to the airport?;
    bank|банк|n|The bank closes at five.;
    hotel|гостиница|n|Our hotel is near the sea.;
    hospital|больница|n|She works at the hospital.;
    church|церковь|n|There's an old church in the square.;
    museum|музей|n|The museum is free on Sundays.;
    supermarket|супермаркет|n|I go to the supermarket on Saturday.;
    shop|магазин|n|The shop opens at nine.;
    restaurant|ресторан|n|Let's go to an Italian restaurant.;
    chemist's|аптека|n|Is there a chemist's near here?;
    post office|почта|n|The post office is next to the bank.;
    cinema|кинотеатр|n|Let's go to the cinema tonight.`],
   ['to-transport','Transport','на чём ехать',`
    car|машина|n|We go to work by car.;
    bus|автобус|n|The bus is late again.;
    train|поезд|n|The train to Gdańsk leaves at ten.;
    taxi|такси|n|Let's take a taxi.;
    bike|велосипед|n|I ride my bike to work.;
    plane|самолёт|n|The plane lands at six.;
    underground|метро (брит.)|n|Take the underground to the centre.;
    by bus|на автобусе|o|I go to school by bus.;
    on foot|пешком|o|The park is ten minutes on foot.;
    ticket|билет|n|Two tickets to Kraków, please.;
    get on|сесть (в транспорт)|v|Get on the bus here.;
    get off|выйти (из транспорта)|v|Get off at the next stop.;
    bus stop|автобусная остановка|n|The bus stop is opposite the bank.`],
   ['to-directions','Directions','спросить дорогу',`
    Excuse me, where's …?|Извините, где …?|o|Excuse me, where's the station?;
    turn left|повернуть налево|v|Turn left at the traffic lights.;
    turn right|повернуть направо|v|Turn right after the bank.;
    go straight on|идти прямо|v|Go straight on for two minutes.;
    cross the road|перейти дорогу|v|Cross the road here.;
    the first on the left|первый поворот налево|o|Take the first on the left.;
    corner|угол|n|The café is on the corner.;
    traffic lights|светофор|n|Stop at the traffic lights.;
    far|далеко|o|The station isn't far.;
    Is it far?|Это далеко?|o|Is it far from here?`],
   ],
A2:[
   ['to2-describe','Describing a town','какой город',`
    crowded|многолюдный|a|The centre is crowded at weekends.;
    quiet|тихий|a|We live in a quiet street.;
    noisy|шумный|a|Our street is very noisy.;
    polluted|загрязнённый|a|Big cities are often polluted.;
    historic|исторический|a|Kraków has a historic centre.;
    modern|современный|a|It's a modern building.;
    lively|оживлённый|a|The old town is lively at night.;
    dirty|грязный|a|The river is dirty.;
    clean|чистый|a|The streets are very clean.;
    capital|столица|n|Warsaw is the capital of Poland.;
    village|деревня|n|My grandparents live in a village.;
    town|город (небольшой)|n|I grew up in a small town.|большой город — city;
    centre|центр|n|Let's meet in the centre.|амер. center;
    suburbs|пригород|n|We live in the suburbs.`],
   ['to2-airport','At the airport','перелёт',`
    flight|рейс, полёт|n|Our flight is at ten.;
    check in|зарегистрироваться|v|Check in two hours before the flight.;
    boarding pass|посадочный талон|n|Show your boarding pass here.;
    gate|выход на посадку|n|The flight leaves from gate 12.;
    luggage|багаж|n|How much luggage do you have?|неисчисл., амер. baggage;
    hand luggage|ручная кладь|n|I only have hand luggage.;
    delay|задержка|n|There's a two-hour delay.|задержан — delayed;
    cancelled|отменён|a|Our flight was cancelled.|амер. canceled;
    take off|взлетать|v|The plane takes off at six.|про одежду — «снять»;
    land|приземляться|v|We land in London at noon.;
    departures|вылет (зона)|n|Go to departures.;
    arrivals|прилёт (зона)|n|I'll meet you in arrivals.;
    passenger|пассажир|n|All passengers to gate 5, please.;
    miss|опоздать на (рейс, автобус)|v|Hurry, or we'll miss the plane!|ещё «скучать»: I miss you`],
   ['to2-places','Places to visit','куда сходить в городе',`
    art gallery|картинная галерея|n|There's a new art gallery in town.;
    aquarium|аквариум (океанариум)|n|The kids loved the aquarium.;
    theme park|парк развлечений|n|We went to a theme park.;
    nightclub|ночной клуб|n|The nightclub opens at 11 p.m.;
    factory|завод, фабрика|n|My father works in a factory.;
    port|порт|n|The ship arrived at the port.;
    fountain|фонтан|n|Let's meet by the fountain.;
    statue|статуя|n|There's a statue in the square.;
    pub|паб|n|We went to the pub after work.;
    bar|бар|n|The hotel has a bar.;
    pharmacy|аптека (амер.)|n|Is there a pharmacy near here?|брит. chemist's;
    college|колледж|n|My sister is at college.;
    concert hall|концертный зал|n|The concert hall is full.`],
   ],
B1:[
   ['to3-travel','Travel problems','дорога и задержки',`
    traffic jam|пробка|n|We were stuck in a traffic jam.;
    rush hour|час пик|n|Avoid the underground in rush hour.;
    delayed|задержанный|a|Our train was delayed.;
    miss a connection|опоздать на пересадку|o|We missed our connection in Berlin.;
    change trains|сделать пересадку|o|You have to change trains in Poznań.;
    platform|платформа|n|The train leaves from platform 4.;
    return ticket|билет туда и обратно|n|A return ticket to Gdańsk, please.|амер. round-trip ticket;
    single ticket|билет в одну сторону|n|Just a single ticket, please.|амер. one-way ticket;
    break down|сломаться (о машине)|v|Our car broke down on the motorway.;
    motorway|автомагистраль|n|Take the motorway to Warsaw.|амер. highway;
    speed limit|ограничение скорости|n|The speed limit here is 50.;
    fine|штраф|n|I got a fine for parking.|ещё «хорошо»: I'm fine;
    journey|путь, поездка (сам переезд)|n|The journey takes three hours.`],
   ['to3-city-2','City & country','город и деревня',`
    rural|сельский|a|They live in a rural area.;
    urban|городской|a|Urban life is stressful.;
    countryside|сельская местность|n|I prefer the countryside.;
    farm|ферма|n|My uncle has a farm.;
    field|поле|n|Cows were in the field.;
    peaceful|мирный, спокойный|a|It's very peaceful here.;
    stressful|напряжённый|a|City life can be stressful.;
    facilities|удобства, инфраструктура|n|The town has good facilities.;
    entertainment|развлечения|n|There's not much entertainment here.;
    nightlife|ночная жизнь|n|The nightlife is great.;
    population|население|n|The population is growing.;
    inhabitant|житель (населённого пункта)|n|The city has a million inhabitants.;
    outskirts|окраина|n|We live on the outskirts of the city.;
    district|район|n|It's a business district.`],
   ['to3-travel-2','Travelling B1','путешествие',`
    trip|поездка (куда-то и обратно)|n|We went on a business trip.;
    travel|путешествия (вообще)|n|Travel broadens the mind.|неисчисл.;
    journey|путь, поездка (сам переезд)|n|The journey was long.;
    voyage|морское путешествие|n|The voyage took two weeks.;
    destination|место назначения|n|Our final destination is Rome.;
    sightseeing|осмотр достопримечательностей|n|We did some sightseeing.;
    accommodation|жильё|n|Accommodation is expensive here.;
    self-catering|с собственной кухней|a|We rented a self-catering flat.;
    all-inclusive|всё включено|a|It's an all-inclusive hotel.;
    backpacking|путешествие с рюкзаком|n|We went backpacking in Asia.;
    jet lag|смена часовых поясов|n|I have terrible jet lag.;
    passport control|паспортный контроль|n|Go through passport control.;
    customs|таможня|n|We waited at customs.;
    visa|виза|n|Do I need a visa?`],
   ['to3-street','In the street','городская инфраструктура',`
    post box|почтовый ящик (на улице)|n|There's a post box on the corner.;
    public toilet|общественный туалет|n|Is there a public toilet near here?;
    parking meter|паркомат|n|Pay at the parking meter.;
    bus shelter|остановка с навесом|n|We waited in the bus shelter.;
    taxi rank|стоянка такси|n|The taxi rank is outside the station.;
    kiosk|киоск|n|I bought a newspaper at the kiosk.;
    street light|уличный фонарь|n|The street lights come on at dusk.;
    litter bin|урна|n|Put your rubbish in the litter bin.;
    traffic warden|инспектор по парковке|n|The traffic warden gave me a ticket.;
    recycling bin|контейнер для вторсырья|n|Glass goes in the green recycling bin.;
    information desk|справочная стойка|n|Ask at the information desk.;
    lost property office|бюро находок|n|I found my bag at the lost property office.;
    left luggage|камера хранения|n|We left our bags at left luggage.`],
   ],
B2:[
   ['to4-city','City life','жизнь в большом городе',`
    commute|ездить на работу|v|I commute to Warsaw every day.|тот, кто ездит — commuter;
    residential area|жилой район|n|We live in a quiet residential area.;
    skyscraper|небоскрёб|n|New York is full of skyscrapers.;
    pedestrian|пешеход|n|This street is for pedestrians only.;
    cycle lane|велодорожка|n|There's a cycle lane along the river.|амер. bike lane;
    public transport|общественный транспорт|n|Public transport here is cheap.|амер. public transportation;
    infrastructure|инфраструктура|n|The city needs better infrastructure.;
    overcrowded|переполненный|a|The trains are overcrowded.;
    vibrant|яркий, полный жизни|a|Kraków has a vibrant nightlife.;
    neighbourhood|район, окрестности|n|It's a friendly neighbourhood.|амер. neighborhood;
    homeless|бездомный|a|There are many homeless people in the city.;
    traffic|движение, трафик|n|The traffic is terrible today.|неисчисл.;
    local|местный|a|Support local shops.;
    inner city|бедные центральные районы|n|Inner-city schools need more money.`],
   ['to4-crime','Crime & punishment','преступление и наказание',`
    steal|красть (вещь)|v|Someone stole my bike.|украли вещь — steal, ограбили человека или банк — rob;
    rob|грабить (человека, банк)|v|They robbed a bank.;
    burglar|взломщик|n|A burglar broke into our house.;
    thief|вор|n|The thief took my wallet.|мн. ч. thieves;
    pickpocket|карманник|n|Watch out for pickpockets.;
    witness|свидетель|n|The police are looking for witnesses.;
    arrest|арестовать|v|The police arrested two men.;
    evidence|улики, доказательства|n|There's no evidence against him.|неисчисл.;
    guilty|виновный|a|The jury found him guilty.;
    innocent|невиновный|a|I'm innocent!;
    sentence|приговор|n|He got a five-year sentence.|ещё «предложение» в грамматике;
    prison|тюрьма|n|He's in prison for robbery.|также jail;
    court|суд|n|The case went to court.`],
   ['to4-city-2','Urban life B2','городская жизнь',`
    congestion|пробки, перегруженность|n|Traffic congestion is a big problem.;
    gentrification|джентрификация|n|Gentrification has changed the area.;
    urban sprawl|разрастание города|n|Urban sprawl destroys farmland.;
    run-down|запущенный|a|It's a run-down neighbourhood.;
    upmarket|престижный|a|It's an upmarket area.;
    bustling|оживлённый, суетливый|a|It's a bustling market.;
    vandalism|вандализм|n|Vandalism is a problem here.;
    graffiti|граффити|n|The walls are covered in graffiti.;
    landmark|достопримечательность, ориентир|n|The tower is a famous landmark.;
    pedestrianised|пешеходный|a|The centre is pedestrianised.;
    council|городской совет|n|The council repaired the road.;
    amenities|удобства, объекты инфраструктуры|n|The area has good amenities.;
    noise pollution|шумовое загрязнение|n|Noise pollution affects our health.;
    green space|зелёная зона|n|We need more green spaces.`],
   ['to4-travel','Travel B2','путешествия B2',`
    itinerary|маршрут|n|Here's our itinerary for the trip.;
    off the beaten track|вдали от туристов|o|We like places off the beaten track.;
    tourist trap|туристическая ловушка|n|That restaurant is a tourist trap.;
    breathtaking views|захватывающие виды|n|The hotel has breathtaking views.;
    layover|пересадка (с ожиданием)|n|We had a six-hour layover.;
    long-haul flight|дальний рейс|n|I hate long-haul flights.;
    turbulence|турбулентность|n|There was a lot of turbulence.;
    excess baggage|перевес багажа|n|I paid for excess baggage.;
    go sightseeing|осматривать достопримечательности|o|We went sightseeing.;
    get away|уехать отдохнуть|v|We need to get away for a few days.;
    set off|отправиться|v|We set off early in the morning.;
    stopover|остановка в пути|n|We had a stopover in Dubai.;
    wanderlust|страсть к путешествиям|n|I have a bad case of wanderlust.;
    travel light|путешествовать налегке|o|I always travel light.`],
   ['to4-transport','Transport B2','транспорт B2',`
    commuter|человек, ездящий на работу|n|The train was full of commuters.;
    season ticket|проездной|n|I bought a season ticket.;
    fare dodger|безбилетник|n|Fare dodgers get a fine.;
    car-sharing|совместные поездки|n|Car-sharing is popular here.;
    electric vehicle|электромобиль|n|Electric vehicles are getting cheaper.;
    infrastructure|инфраструктура|n|The rail infrastructure is old.;
    tailback|затор, хвост пробки|n|There's a five-kilometre tailback.;
    roadworks|дорожные работы|n|There are roadworks on the motorway.;
    diversion|объезд|n|Follow the diversion signs.|амер. detour;
    toll|плата за проезд|n|You have to pay a toll.;
    lane|полоса|n|Stay in the left lane.;
    hitchhike|путешествовать автостопом|v|We hitchhiked across Europe.;
    breathalyser|алкотестер|n|The police used a breathalyser.;
    run a red light|проехать на красный|o|He ran a red light.`],
   ['to4-holidays','Holidays & accommodation','отдых и проживание',`
    B&B|мини-гостиница с завтраком|n|We stayed in a lovely B&B.|bed and breakfast;
    half board|полупансион|n|The price includes half board.;
    full board|полный пансион|n|Full board costs extra.;
    resort|курорт|n|It's a popular ski resort.;
    cruise|круиз|n|They went on a Mediterranean cruise.;
    guided tour|экскурсия с гидом|n|We took a guided tour of the castle.;
    off-peak|не в сезон, в непиковое время|a|Off-peak tickets are cheaper.;
    peak season|высокий сезон|n|Prices go up in peak season.;
    last-minute deal|горящее предложение|n|We found a great last-minute deal.;
    upgrade|повысить класс (номера, места)|v|They upgraded us to a suite.;
    complimentary|бесплатный (за счёт заведения)|a|There's complimentary water in the room.;
    cancellation fee|штраф за отмену|n|There's no cancellation fee.;
    travel insurance|туристическая страховка|n|Don't travel without travel insurance.;
    excursion|экскурсия (поездка куда-то)|n|We went on an excursion to the islands.`],
   ]},
  extra:{A1:[
   ['to-places-2','Places in town 2','ещё места в городе',`
    library|библиотека|n|I borrow books from the library.|книжный магазин — bookshop;
    market|рынок|n|We buy vegetables at the market.;
    bakery|пекарня|n|The bakery opens at six.;
    café|кафе|n|Let's meet at the café.;
    car park|автостоянка, парковка (брит.)|n|The car park is behind the hotel.|амер. parking lot;
    petrol station|заправка|n|Stop at the petrol station.|амер. gas station;
    police station|полицейский участок|n|Where's the police station?;
    bus station|автовокзал|n|The bus station is in the centre.;
    theatre|театр|n|We went to the theatre last night.|амер. theater;
    zoo|зоопарк|n|The children love the zoo.;
    sports centre|спортивный центр|n|There's a pool at the sports centre.;
    swimming pool|бассейн|n|The swimming pool is open until nine.;
    castle|замок|n|There's an old castle on the hill.;
    building|здание|n|That's the tallest building in the city.`],
   ['to-transport-3','Transport & directions 2','транспорт и стороны света',`
    road|дорога|n|This road goes to the airport.;
    boat|лодка|n|We went on a boat on the lake.;
    ship|корабль|n|The ship leaves at six.;
    helicopter|вертолёт|n|A helicopter is flying over the city.;
    scooter|самокат, скутер|n|My son goes to school by scooter.;
    seat|место, сиденье|n|Is this seat free?;
    north|север|n|Gdańsk is in the north of Poland.;
    south|юг|n|Birds fly to the south in winter.;
    east|восток|n|The sun comes up in the east.;
    west|запад|n|We live in the west of the city.;
    walk to work|ходить на работу пешком|o|I walk to work every day.;
    ride a bike|ездить на велосипеде|o|Can you ride a bike?`],
   ],
A2:[
   ['to2-streets','Streets & sights','улицы и достопримечательности',`
    roundabout|круговой перекрёсток|n|Turn left at the roundabout.;
    crossroads|перекрёсток|n|Stop at the crossroads.;
    pavement|тротуар|n|Walk on the pavement.|амер. sidewalk;
    zebra crossing|пешеходный переход|n|Cross at the zebra crossing.|амер. crosswalk;
    cathedral|собор|n|The cathedral is very old.;
    tower|башня|n|You can climb the tower.;
    palace|дворец|n|The king lived in this palace.;
    monument|памятник|n|There's a monument in the square.;
    shopping centre|торговый центр|n|The shopping centre is open on Sundays.|амер. mall;
    town hall|ратуша, мэрия|n|The town hall is in the main square.;
    old town|старый город|n|Let's walk around the old town.;
    sign|знак, вывеска|n|Follow the signs to the station.;
    corner shop|магазин у дома|n|I buy milk at the corner shop.;
    tourist information|туристический центр|n|Ask at tourist information.`],
   ['to2-transport-2','Transport 2','машина, трамвай, паром',`
    tram|трамвай|n|Take the tram to the centre.;
    ferry|паром|n|We took the ferry to the island.;
    coach|междугородний автобус|n|The coach to Berlin leaves at nine.|ещё «тренер»;
    van|фургон|n|They moved house with a van.;
    lorry|грузовик|n|A lorry blocked the road.|амер. truck;
    motorbike|мотоцикл|n|He rides a motorbike to work.;
    helmet|шлем|n|Always wear a helmet.;
    driving licence|водительские права|n|Can I see your driving licence?|амер. driver's license;
    park|парковаться|v|You can't park here.;
    seat belt|ремень безопасности|n|Fasten your seat belt.;
    fare|стоимость проезда|n|The bus fare is four złoty.;
    ticket office|касса (билетная)|n|Buy tickets at the ticket office.;
    fill up|заправить (полный бак)|v|We need to fill up the car.;
    ride|ехать (на велосипеде, лошади)|v|I ride my bike to work.`],
   ],
B1:[
   ['to3-directions','Directions & getting around','как добраться',`
    turn off|свернуть|v|Turn off at the next exit.;
    go past|пройти мимо|v|Go past the church.;
    keep going|продолжать идти|o|Keep going for 200 metres.;
    you can't miss it|вы не пропустите|o|It's a big red building, you can't miss it.;
    get lost|заблудиться|o|We got lost in the old town.;
    ask the way|спросить дорогу|o|Let's ask the way.;
    shortcut|короткий путь|n|Let's take a shortcut.;
    exit|выход, съезд|n|Take the second exit.;
    entrance|вход|n|Meet me at the main entrance.;
    block|квартал|n|It's two blocks from here.|амер.;
    on foot|пешком|o|It's ten minutes on foot.;
    junction|перекрёсток, развязка (дорог)|n|Turn right at the junction.;
    one-way street|улица с односторонним движением|n|You can't go that way, it's a one-way street.;
    signpost|указатель|n|Follow the signposts to the castle.`],
   ['to3-driving','Driving','за рулём',`
    driver|водитель|n|He's a careful driver.;
    overtake|обгонять|v|Don't overtake on the bend.;
    brake|тормозить|v|He braked suddenly.;
    accelerate|разгоняться|v|Don't accelerate so fast.;
    reverse|сдавать назад|v|Reverse into the parking space.;
    traffic lights|светофор|n|Stop at the traffic lights.;
    petrol|бензин|n|We need petrol.|амер. gas;
    flat tyre|спущенное колесо|n|We had a flat tyre.|амер. flat tire;
    crash|авария|n|There was a crash on the motorway.;
    speeding|превышение скорости|n|He got a fine for speeding.;
    rush hour|час пик|n|Avoid driving in the rush hour.;
    parking space|парковочное место|n|I can't find a parking space.;
    give someone a lift|подвезти|o|Can you give me a lift?|амер. ride;
    driving test|экзамен по вождению|n|I passed my driving test.`],
   ],
B2:[
   ['to4-crime-2','Crime B2 2','преступления подробнее',`
    shoplifting|магазинная кража|n|He was arrested for shoplifting.;
    mugging|уличный грабёж|n|There was a mugging in the park.;
    fraud|мошенничество|n|He was jailed for fraud.;
    bribery|взяточничество|n|Bribery is a crime.;
    kidnap|похищать|v|The child was kidnapped.;
    smuggle|провозить контрабандой|v|They smuggled drugs.;
    hacker|хакер|n|Hackers stole the data.;
    identity theft|кража личных данных|n|Identity theft is increasing.;
    suspect|подозреваемый|n|The police arrested a suspect.;
    victim|жертва|n|The victim was badly hurt.;
    commit a crime|совершить преступление|o|He committed a crime.;
    investigate|расследовать|v|The police are investigating.;
    charge|обвинять|v|He was charged with theft.;
    release|освободить|v|He was released from prison.`],
   ['to4-law','Law & justice','закон и суд',`
    judge|судья|n|The judge sentenced him to five years.;
    jury|присяжные|n|The jury found him guilty.;
    trial|суд, процесс|n|The trial lasted a week.;
    lawyer|адвокат|n|I need a lawyer.;
    verdict|вердикт|n|The jury reached a verdict.;
    acquit|оправдать|v|He was acquitted.;
    convict|осудить|v|She was convicted of fraud.;
    appeal|апелляция|n|He lost his appeal.;
    fine|оштрафовать|v|He was fined 500 euros.;
    community service|общественные работы|n|He got 100 hours of community service.;
    law-abiding|законопослушный|a|Most people are law-abiding.;
    illegal|незаконный|a|It's illegal to park here.;
    punishment|наказание|n|The punishment was too harsh.;
    break the law|нарушить закон|o|He never broke the law.`],
   ['to4-news','News & events','новости',`
    headline|заголовок|n|The story made the headlines.;
    breaking news|срочные новости|n|Here's some breaking news.;
    coverage|освещение (в СМИ)|n|The media coverage was huge.;
    press conference|пресс-конференция|n|The minister held a press conference.;
    eyewitness|очевидец|n|An eyewitness described the accident.;
    casualty|пострадавший|n|There were no casualties.;
    disaster|катастрофа|n|It was a natural disaster.;
    protest|протест|n|Thousands joined the protest.;
    strike|забастовка|n|The train drivers are on strike.;
    election|выборы|n|The election is in May.;
    government|правительство|n|The government raised taxes.;
    policy|политика (курс)|n|The new policy is unpopular.;
    rumour|слух|n|It's just a rumour.;
    reliable source|надёжный источник|n|Is this a reliable source?`],
   ['to4-services','Local services','местные службы',`
    public services|государственные услуги|n|Taxes pay for public services.;
    local authority|местные власти|n|Contact your local authority.;
    recycling centre|пункт приёма вторсырья|n|Take the old fridge to the recycling centre.;
    leisure centre|спортивно-развлекательный центр|n|The leisure centre has a pool.;
    community centre|общественный центр|n|There are yoga classes at the community centre.;
    job centre|центр занятости|n|He went to the job centre.;
    social housing|социальное жильё|n|There's a shortage of social housing.;
    charity shop|благотворительный магазин|n|I bought this coat in a charity shop.;
    food bank|продовольственный банк|n|We donated food to the food bank.;
    refuse collection|вывоз мусора|n|Refuse collection is on Thursdays.;
    polling station|избирательный участок|n|The polling station is in the school.;
    register with a GP|прикрепиться к терапевту|o|You need to register with a GP.;
    residents' association|ассоциация жильцов|n|The residents' association meets monthly.;
    library card|читательский билет|n|You need a library card to borrow books.`],
   ]}},

 {key:'shopping', name:'Clothes & shopping', ru:'Одежда и покупки', color:'#8a5aa8',
  info:'Одежда, деньги и фразы для магазина.',
  cells:{A1:[
   ['sh-clothes','Clothes','что надеть',`
    shirt|рубашка|n|He's wearing a white shirt.;
    T-shirt|футболка|n|I usually wear a T-shirt and jeans.;
    trousers|брюки|n|These trousers are too long.;
    jeans|джинсы|n|I love my old jeans.;
    dress|платье|n|What a beautiful dress!;
    skirt|юбка|n|She's wearing a black skirt.;
    jacket|куртка, пиджак|n|Take a jacket. It's cold.;
    coat|пальто|n|I need a warm coat for winter.;
    jumper|свитер|n|My grandmother made this jumper.;
    shoes|туфли, обувь|n|These shoes are very comfortable.;
    trainers|кроссовки|n|I wear trainers to the gym.;
    boots|ботинки, сапоги|n|I need new boots for the forest.;
    hat|шапка, шляпа|n|Wear a hat in the sun.;
    socks|носки|n|Where are my socks?;
    bag|сумка|n|My bag is very heavy.;
    wear|носить (одежду)|v|I wear glasses.`],
   ['sh-shop','Shopping & money','в магазине',`
    buy|покупать|v|I want to buy a new phone.;
    sell|продавать|v|They sell fresh bread here.;
    pay|платить|v|Can I pay by card?;
    cost|стоить|v|How much does it cost?;
    price|цена|n|The price is too high.;
    money|деньги|n|I don't have much money.;
    cash|наличные|n|Do you have cash?;
    card|карта (банковская), открытка|n|I always pay by card.;
    size|размер|n|What size are you?;
    try on|примерить|v|Can I try on this jacket?;
    How much is it?|Сколько это? (о цене)|o|How much is it? — Twenty złoty.;
    Can I help you?|Чем могу помочь?|o|Good morning. Can I help you?;
    I'm just looking.|Я просто смотрю.|o|No, thanks. I'm just looking.;
    receipt|чек (из магазина, после оплаты)|n|Here's your receipt.`],
   ],
A2:[
   ['sh2-shopping','Shopping','в магазине и онлайн',`
    customer|покупатель|n|The shop has a lot of customers.;
    changing room|примерочная|n|Where's the changing room?|амер. fitting room;
    fit|подходить по размеру|v|These jeans don't fit me.|идёт по стилю, к лицу — suit;
    suit|идти, быть к лицу|v|That colour suits you.;
    take back|вернуть в магазин|v|I want to take back this shirt.;
    refund|возврат денег|n|Can I have a refund?;
    sale|распродажа|n|Everything is half price in the sale.|продаётся — for sale;
    discount|скидка|n|Students get a 10% discount.;
    order online|заказать онлайн|o|I often order clothes online.;
    deliver|доставлять|v|They deliver in two days.;
    delivery|доставка|n|Delivery is free.;
    queue|очередь|n|There's a long queue at the checkout.|амер. line;
    checkout|касса|n|Pay at the checkout.;
    pay for|заплатить за|v|I paid for the tickets online.`],
   ['sh2-money','Paying & money','оплата и деньги',`
    purse|кошелёк (женский)|n|My purse is in my bag.;
    credit card|кредитная карта|n|Can I pay by credit card?;
    pay by card|платить картой|o|Can I pay by card?;
    pay in cash|платить наличными|o|I always pay in cash.;
    PIN|пин-код|n|Please enter your PIN.;
    save money|копить, экономить деньги|o|I want to save money for a car.;
    change money|менять деньги|o|Where can I change money?;
    special offer|специальное предложение|n|These shoes are on special offer.;
    half price|за полцены|o|Everything is half price today.;
    It's free.|Это бесплатно.|o|You don't need a ticket. It's free.;
    How much does it cost?|Сколько это стоит? (с глаголом «стоить»)|o|How much does it cost to park here?;
    Keep the change.|Сдачи не надо.|o|Here's twenty. Keep the change.`],
   ['sh2-accessories','Accessories','аксессуары и одежда',`
    necklace|ожерелье, цепочка|n|She's wearing a gold necklace.;
    earrings|серьги|n|I bought her earrings for her birthday.;
    bracelet|браслет|n|That's a nice bracelet.;
    handbag|сумочка|n|Her handbag is very expensive.;
    sunglasses|солнцезащитные очки|n|Don't forget your sunglasses.;
    backpack|рюкзак|n|I take a backpack when I go hiking.;
    tights|колготки|n|She's wearing black tights.;
    slippers|тапочки|n|Put on your slippers.;
    raincoat|плащ, дождевик|n|Take a raincoat, it's going to rain.;
    hoodie|худи, толстовка с капюшоном|n|He always wears a hoodie.;
    blouse|блузка|n|She wore a white blouse.;
    sweatshirt|толстовка|n|This sweatshirt is very warm.`],
   ],
B1:[
   ['sh3-money','Money & banking','деньги и банк',`
    owe|быть должным|v|I owe you twenty złoty.;
    afford|позволить себе|v|We can't afford a new car.;
    bank account|банковский счёт|n|I opened a bank account.;
    loan|кредит, заём|n|We took out a loan.|ипотека — mortgage;
    save up|копить (на что-то)|v|I'm saving up for a holiday.;
    waste|тратить впустую|v|Don't waste money on that.;
    spend|тратить|v|I spend too much on clothes.|проводить время — тоже spend;
    cash machine|банкомат|n|Is there a cash machine near here?|также ATM;
    bill|счёт (за услуги)|n|I need to pay the electricity bill.;
    salary|зарплата|n|He has a good salary.;
    cost of living|стоимость жизни|n|The cost of living is high here.;
    budget|бюджет|n|We're on a tight budget.;
    be in debt|быть в долгах|o|He's in debt after the holiday.|b в debt не читается`],
   ['sh3-shopping-2','Shopping B1','покупки',`
    bargain|выгодная покупка|n|This jacket was a bargain.;
    price tag|ценник|n|Look at the price tag.;
    on sale|со скидкой, в продаже|o|These shoes are on sale.;
    reduced|уценённый|a|All items are reduced.;
    sold out|распродано|a|The tickets are sold out.;
    in stock|в наличии|o|Is this in stock?;
    out of stock|нет в наличии|o|Sorry, it's out of stock.;
    try something on|примерить|o|Can I try this on?;
    suit|идти (о стиле, цвете)|v|That colour suits you.;
    match|сочетаться|v|The shoes match the bag.;
    go with|подходить к|v|Does this shirt go with these trousers?;
    shopping bag|сумка для покупок|n|Bring a shopping bag.;
    cashier|кассир|n|Pay the cashier.;
    self-checkout|касса самообслуживания|n|I use the self-checkout.`],
   ['sh3-problems','Shopping problems','проблемы с покупкой',`
    damaged|повреждённый|a|The box arrived damaged.;
    scratched|поцарапанный|a|The screen is scratched.;
    stained|в пятнах|a|This shirt is stained.;
    missing|недостающий, пропавший|a|One button is missing.;
    customer service|служба поддержки клиентов|n|I called customer service.;
    return|вернуть (товар)|v|I'd like to return these shoes.;
    send back|отправить обратно|v|I sent the jacket back.;
    swap|поменять|v|Can I swap this for a bigger size?;
    replacement|замена|n|They sent me a replacement.;
    proof of purchase|доказательство покупки|n|Please keep your receipt as proof of purchase.;
    It doesn't work.|Это не работает.|o|I bought this yesterday and it doesn't work.;
    the wrong size|не тот размер|o|They sent me the wrong size.;
    Can I speak to the manager?|Могу я поговорить с менеджером?|o|I'm not happy. Can I speak to the manager?;
    money back|возврат денег|n|I want my money back.`],
   ],
B2:[
   ['sh4-consumer','Consumer language','язык покупателя',`
    bargain|выгодная покупка|n|It was a real bargain!;
    rip-off|грабёж, завышенная цена|n|20 euros for a coffee? What a rip-off!;
    brand|бренд|n|What brand is your phone?;
    second-hand|подержанный|a|I bought a second-hand bike.;
    guarantee|гарантия|n|It has a two-year guarantee.|также warranty;
    faulty|бракованный|a|The phone was faulty, so I returned it.;
    exchange|обменять (товар)|v|Can I exchange it for a bigger size?;
    compare prices|сравнивать цены|o|Always compare prices online.;
    impulse buy|спонтанная покупка|n|This dress was an impulse buy.;
    shop around|присмотреться в разных магазинах|v|It pays to shop around.;
    value for money|соотношение цены и качества|o|The hotel is good value for money.;
    advertisement|реклама, объявление|n|I saw an advertisement for it.|разг. ad, advert;
    consumer|потребитель|n|Consumers want cheaper products.;
    subscription|подписка|n|I cancelled my Netflix subscription.`],
   ['sh4-money-2','Finance B2','финансы',`
    income|доход|n|What's your monthly income?;
    expenses|расходы|n|Our expenses are high.;
    pension|пенсия|n|He lives on a small pension.;
    invest|инвестировать|v|She invested in property.;
    shares|акции|n|He bought shares in the company.;
    inflation|инфляция|n|Inflation is rising.;
    currency|валюта|n|What's the local currency?;
    exchange rate|курс валюты|n|The exchange rate is good today.;
    overdraft|овердрафт|n|I'm in my overdraft.;
    credit card debt|долг по кредитке|n|He has huge credit card debt.;
    financial advisor|финансовый консультант|n|Ask a financial advisor.;
    tax return|налоговая декларация|n|I filed my tax return.;
    well-off|обеспеченный|a|They're quite well-off.;
    hard up|стеснённый в средствах|a|We're hard up this month.`],
   ['sh4-shopping-2','Shopping habits','привычки покупателя',`
    splash out|раскошелиться|v|We splashed out on a new TV.;
    window-shopping|разглядывание витрин|n|I love window-shopping.;
    shopaholic|шопоголик|n|She's a real shopaholic.;
    haggle|торговаться (о цене)|v|We haggled at the market.;
    loyalty card|карта лояльности|n|Do you have a loyalty card?;
    cashback|кэшбэк|n|I get 2% cashback.;
    counterfeit|поддельный|a|These are counterfeit watches.;
    limited edition|ограниченный выпуск|n|It's a limited edition.;
    overpriced|переплаченный|a|These shoes are overpriced.;
    good value for money|хорошее соотношение цены и качества|o|The hotel is good value for money.;
    browse|рассматривать товары|v|I'm just browsing.;
    return policy|правила возврата|n|What's your return policy?;
    spending spree|шопинг-загул|n|I went on a spending spree.;
    tempting|соблазнительный|a|The offer is very tempting.`],
   ['sh4-online','Online shopping','покупки онлайн',`
    add to basket|добавить в корзину|o|Click here to add to basket.|амер. add to cart;
    wish list|список желаний|n|I put it on my wish list.;
    track an order|отслеживать заказ|o|You can track your order online.;
    tracking number|трек-номер|n|Here's your tracking number.;
    out for delivery|передан курьеру|o|Your parcel is out for delivery.;
    dispatch|отправлять (товар)|v|Your order will be dispatched today.;
    parcel locker|постамат|n|I picked it up from a parcel locker.;
    returns label|ярлык для возврата|n|Print the returns label.;
    promo code|промокод|n|Enter the promo code at checkout.;
    customer reviews|отзывы покупателей|n|Read the customer reviews first.;
    secure payment|безопасная оплата|n|This site offers secure payment.;
    next-day delivery|доставка на следующий день|n|Next-day delivery costs extra.;
    order history|история заказов|n|Check your order history.;
    sign up|зарегистрироваться (на сайте)|v|Sign up and get 10% off.`],
   ['sh4-finance','Personal finance','личные финансы',`
    overspend|тратить слишком много|v|I always overspend at Christmas.;
    live within your means|жить по средствам|o|It's important to live within your means.;
    payday|день зарплаты|n|I'll pay you back on payday.;
    direct debit|автоплатёж (списание)|n|I pay my rent by direct debit.;
    standing order|регулярный перевод|n|I set up a standing order.;
    bank statement|банковская выписка|n|Check your bank statement every month.;
    current account|текущий счёт|n|My salary goes into my current account.;
    savings account|сберегательный счёт|n|I opened a savings account.;
    interest rate|процентная ставка|n|The interest rate is very low.;
    pay off|погасить (долг)|v|We paid off the mortgage last year.;
    take out a loan|взять кредит|o|They took out a loan to buy a car.;
    credit rating|кредитный рейтинг|n|He has a good credit rating.;
    cut back on|сократить (расходы)|v|We need to cut back on spending.;
    set aside|откладывать (деньги)|v|I set aside some money every month.`],
   ]},
  extra:{A1:[
   ['sh-clothes-2','Clothes 2','аксессуары и мелочи',`
    scarf|шарф|n|Wear a scarf, it's cold.;
    gloves|перчатки|n|I lost my gloves.;
    belt|ремень|n|These trousers need a belt.;
    tie|галстук|n|He wears a tie to work.;
    suit|костюм|n|He bought a new suit for the wedding.;
    shorts|шорты|n|It's hot. Wear shorts.;
    sandals|сандалии|n|I wear sandals in summer.;
    pyjamas|пижама|n|The kids are in their pyjamas.|амер. pajamas;
    cap|кепка|n|He always wears a cap.;
    umbrella|зонт|n|Take an umbrella.;
    glasses|очки|n|I can't find my glasses.;
    watch|наручные часы|n|What a nice watch!;
    ring|кольцо|n|She has a gold ring.;
    wallet|кошелёк, бумажник|n|My wallet is in my bag.|женский кошелёк — purse;
    put on|надевать|v|Put on your coat.`],
   ['sh-shop-2','Shopping phrases','фразы в магазине',`
    euro|евро|n|It costs ten euros.;
    dollar|доллар|n|One dollar, please.;
    pound|фунт (деньги)|n|The ticket is five pounds.;
    cent|цент|n|It's ninety-nine cents.;
    shopping|покупки|n|I do the shopping on Fridays.;
    a pair of|пара (чего-то)|o|I need a pair of shoes.;
    Do you have …?|У вас есть …?|o|Do you have this in blue?;
    I'll take it.|Я возьму это (покупаю)|o|It's nice. I'll take it.;
    That's all.|Это всё (больше ничего не нужно)|o|Two coffees. That's all, thanks.;
    It's too big.|Это слишком большое.|o|This jacket is too big.;
    It's too small.|Это слишком маленькое.|o|These shoes are too small.;
    What size are you?|Какой у вас размер?|o|What size are you? — Medium.;
    Where can I pay?|Где можно оплатить?|o|Excuse me, where can I pay?`],
   ],
A2:[
   ['sh2-shops','Shops','какие бывают магазины',`
    department store|универмаг|n|I bought it in a department store.;
    newsagent's|газетный киоск|n|Buy a newspaper at the newsagent's.;
    bookshop|книжный магазин|n|There's a nice bookshop near here.|амер. bookstore;
    florist's|цветочный магазин|n|I bought roses at the florist's.;
    jeweller's|ювелирный|n|He bought the ring at a jeweller's.|амер. jewelry store;
    butcher's|мясная лавка|n|We buy meat at the butcher's.;
    hairdresser's|парикмахерская|n|I'm going to the hairdresser's.;
    shoe shop|обувной магазин|n|The shoe shop has a sale.;
    toy shop|магазин игрушек|n|The kids love the toy shop.;
    opening hours|часы работы|n|What are the opening hours?;
    shop window|витрина|n|I saw it in the shop window.;
    shopping list|список покупок|n|Don't forget the shopping list.;
    trolley|тележка|n|Take a trolley.|амер. cart;
    basket|корзина|n|I only need a basket.`],
   ['sh2-clothes','Clothes & style','фасоны и материалы',`
    striped|полосатый|a|He's wearing a striped shirt.;
    checked|клетчатый|a|I like checked shirts.;
    plain|однотонный|a|I prefer plain T-shirts.;
    spotted|в горошек|a|She has a spotted dress.;
    tight|тесный, облегающий|a|These jeans are too tight.;
    loose|свободный|a|I like loose clothes.;
    casual|повседневный|a|I wear casual clothes at the weekend.;
    smart|нарядный, элегантный|a|You look very smart today.|ещё «умный» (амер.);
    fashionable|модный|a|This colour is fashionable this year.;
    old-fashioned|старомодный|a|His clothes are old-fashioned.;
    sleeve|рукав|n|The sleeves are too long.;
    pocket|карман|n|My phone is in my pocket.;
    button|пуговица|n|A button fell off my coat.;
    zip|молния|n|The zip on my jacket is broken.|амер. zipper`],
   ],
B1:[
   ['sh3-money-2','Money 2','деньги подробнее',`
    earn|зарабатывать|v|How much do you earn?;
    cash|наличные|n|Do you pay in cash or by card?;
    change|сдача, мелочь|n|Here's your change.;
    coin|монета|n|I need coins for the machine.;
    note|купюра|n|Do you have a ten-euro note?|амер. bill;
    pocket money|карманные деньги|n|The kids get pocket money every week.;
    savings|сбережения|n|We spent our savings on a car.;
    tax|налог|n|Prices include tax.;
    interest|проценты (по вкладу)|n|The bank pays 2% interest.;
    withdraw|снять (деньги)|v|I withdrew 200 złoty.;
    transfer|перевести (деньги)|v|I'll transfer the money today.;
    lend money|дать взаймы|o|Can you lend me some money?;
    rich|богатый|a|He became rich.;
    broke|на мели (без денег)|a|I'm broke until payday.|разг.`],
   ['sh3-clothes-3','Clothes B1','одежда и стиль',`
    outfit|наряд|n|I love your outfit!;
    dress up|наряжаться|v|We dressed up for the party.;
    get dressed|одеваться|o|Get dressed, we're late!;
    get changed|переодеться|o|I need to get changed.;
    take off|снять (одежду)|v|Take off your coat.;
    hang up|повесить (одежду)|v|Hang up your jacket.;
    fit|быть впору|v|These shoes don't fit.;
    baggy|мешковатый|a|He wears baggy jeans.;
    fitted|приталенный|a|She wears a fitted jacket.;
    designer|дизайнерский|a|She only buys designer clothes.;
    second-hand|секонд-хенд|a|I buy second-hand clothes.;
    wardrobe|гардероб|n|I need a new wardrobe for work.;
    high heels|высокие каблуки|n|She can't walk in high heels.;
    trainers|кроссовки|n|I wear trainers every day.`],
   ],
B2:[
   ['sh4-ads','Advertising','реклама и маркетинг',`
    advertise|рекламировать|v|They advertise on TV.;
    commercial|рекламный ролик|n|I hate TV commercials.;
    slogan|слоган|n|The slogan is catchy.;
    catchy|запоминающийся|a|It's a catchy tune.;
    target audience|целевая аудитория|n|Young people are the target audience.;
    sponsor|спонсировать|v|The company sponsors the team.;
    logo|логотип|n|I like their new logo.;
    persuasive|убедительный|a|The advert is very persuasive.;
    misleading|вводящий в заблуждение|a|The advert was misleading.;
    influencer|инфлюенсер|n|She's a fashion influencer.;
    go viral|стать вирусным|o|The video went viral.;
    campaign|кампания|n|The campaign was a success.;
    free sample|бесплатный образец|n|They gave out free samples.;
    junk mail|рекламный мусор|n|My mailbox is full of junk mail.`],
   ['sh4-clothes','Fashion B2','мода',`
    trendy|модный (разг., в тренде)|a|It's a trendy café.;
    fashion-conscious|следящий за модой|a|Teenagers are very fashion-conscious.;
    out of fashion|вышедший из моды|o|Those jeans are out of fashion.;
    timeless|вне времени|a|A black dress is timeless.;
    flattering|красящий, выгодный|a|That colour is very flattering.;
    hand-made|ручной работы|a|It's a hand-made bag.;
    tailor-made|сшитый на заказ|a|He wears tailor-made suits.;
    fast fashion|быстрая мода|n|Fast fashion is bad for the planet.;
    outfit|образ, наряд|n|What a great outfit!;
    accessories|аксессуары|n|She loves accessories.;
    dress code|дресс-код|n|What's the dress code?;
    smart casual|полуофициальный стиль|a|The dress code is smart casual.;
    worn-out|изношенный|a|My shoes are worn-out.;
    catwalk|подиум|n|Models walked down the catwalk.`],
   ]}},

 {key:'work', name:'Work & study', ru:'Работа и учёба', color:'#557fa1',
  info:'Профессии, работа, учёба и фразы для урока.',
  cells:{A1:[
   ['wo-jobs','Jobs','кем ты работаешь',`
    teacher|учитель|n|My mother is an English teacher.;
    doctor|врач|n|You need to see a doctor.;
    nurse|медсестра, медбрат|n|The nurse is very kind.;
    driver|водитель|n|He's a bus driver.;
    engineer|инженер|n|My brother is an engineer.;
    lawyer|юрист|n|She works as a lawyer.;
    shop assistant|продавец|n|The shop assistant is very helpful.;
    police officer|полицейский|n|Ask the police officer.;
    cook|повар|n|He's a cook in a restaurant.;
    farmer|фермер|n|The farmer has cows and sheep.;
    receptionist|администратор|n|Ask the receptionist for the key.;
    manager|менеджер|n|I want to speak to the manager.;
    programmer|программист|n|Programmers often work from home.;
    job|работа (должность, место)|n|What's your job?`],
   ['wo-work','Work & study','на работе и в школе',`
    office|офис|n|I work in an office.;
    company|компания|n|She works for a big company.;
    boss|начальник|n|My boss is very nice.;
    colleague|коллега|n|I have lunch with my colleagues.;
    student|студент, учащийся|n|He's a student at the university.;
    school|школа|n|The school is near our house.;
    university|университет|n|She studies at the university.;
    lesson|урок|n|The lesson starts at nine.;
    homework|домашнее задание|n|We have a lot of homework.;
    exam|экзамен|n|I have an exam next year.;
    learn|учить (новое), узнавать|v|I want to learn English.;
    teach|преподавать|v|She teaches maths.;
    earn|зарабатывать|v|Doctors earn a lot of money.;
    work for|работать на (компанию)|v|I work for an IT company.`],
   ['wo-class','Classroom language','фразы на уроке',`
    book|книга|n|This book is very interesting.;
    page|страница|n|Open your books at page ten.;
    pen|ручка|n|I need a pen.;
    notebook|тетрадь|n|Write the words in your notebook.;
    dictionary|словарь|n|Use a dictionary.;
    question|вопрос|n|Can I ask a question?;
    answer|ответ|n|What's the answer?;
    word|слово|n|What's this word in English?;
    Open your books.|Откройте книги.|o|Open your books at page twelve.;
    repeat|повторить|v|Can you repeat that, please?;
    How do you spell …?|Как пишется …?|o|How do you spell your name?;
    What does … mean?|Что значит …?|o|What does "busy" mean?;
    I don't understand.|Я не понимаю.|o|Sorry, I don't understand.`],
   ],
A2:[
   ['wo2-school','School subjects','школьные предметы',`
    maths|математика|n|I was good at maths.|амер. math;
    history|история|n|History is my favourite subject.;
    geography|география|n|We learn about maps in geography.;
    biology|биология|n|In biology we study animals and plants.;
    chemistry|химия|n|Chemistry was difficult for me.;
    physics|физика|n|Physics is about energy and forces.|единственное число: physics is;
    literature|литература|n|We read Shakespeare in literature.;
    foreign languages|иностранные языки|n|I love learning foreign languages.;
    PE|физкультура|n|We have PE on Monday.|physical education;
    art|рисование, искусство|n|Art is my son's favourite subject.;
    subject|предмет|n|What's your favourite subject?;
    term|четверть, семестр|n|The summer term ends in June.|амер. semester;
    timetable|расписание (уроков, транспорта)|n|Check the timetable.|амер. schedule`],
   ['wo2-tech','Technology','компьютер и телефон',`
    laptop|ноутбук|n|I work on my laptop.;
    screen|экран|n|My phone screen is broken.;
    keyboard|клавиатура|n|This keyboard is very quiet.;
    password|пароль|n|Don't forget your password.;
    download|скачать|v|Download the app for free.;
    upload|загрузить (в сеть)|v|I upload my videos on Sundays.;
    click|кликнуть|v|Click here to start.;
    save|сохранить (файл)|v|Save the file before you close it.|ещё «копить» (деньги);
    delete|удалить|v|Delete the old photos.;
    charge|заряжать|v|I need to charge my phone.|зарядка — charger;
    search|искать (в сети)|v|Search for it online.;
    website|сайт|n|Check the museum's website.;
    app|приложение|n|I use an app to learn words.;
    Wi-Fi|вайфай|n|What's the Wi-Fi password?`],
   ['wo2-jobs','Jobs 2','профессии',`
    secretary|секретарь|n|The secretary answers the phone.;
    soldier|солдат|n|Her son is a soldier.;
    photographer|фотограф|n|The photographer took pictures of the wedding.;
    designer|дизайнер|n|She's a fashion designer.;
    tour guide|экскурсовод|n|Our tour guide spoke three languages.;
    baker|пекарь|n|The baker starts work at 4 a.m.;
    postman|почтальон|n|The postman comes at ten.|нейтр. postal worker;
    security guard|охранник|n|A security guard stopped me at the door.;
    babysitter|няня (на время)|n|We need a babysitter for Saturday.;
    painter|маляр, художник|n|The painter is painting our kitchen.;
    model|модель|n|She works as a model.;
    businesswoman|деловая женщина|n|My aunt is a businesswoman.;
    housewife|домохозяйка|n|My mother was a housewife.`],
   ],
B1:[
   ['wo3-work','Work collocations','поиск работы и карьера',`
    apply for|подавать заявку на|v|I applied for a job in Kraków.|заявка — application;
    CV|резюме|n|Send your CV by email.|амер. résumé;
    interview|собеседование|n|I have a job interview tomorrow.;
    get promoted|получить повышение|o|She got promoted to manager.;
    be fired|быть уволенным|o|He was fired for being late.|разг. get the sack;
    resign|уволиться по собственному|v|She resigned last month.|также quit;
    retire|выйти на пенсию|v|My dad retired at 65.;
    full-time|на полную ставку|a|I have a full-time job.;
    part-time|на неполную ставку|a|She works part-time.;
    work from home|работать из дома|o|I work from home on Fridays.;
    overtime|сверхурочно|n|I often work overtime.;
    experience|опыт|n|Do you have any experience?|опыт работы — неисчисл.;
    unemployed|безработный|a|He's been unemployed for a year.`],
   ['wo3-education','Education','учёба и университет',`
    degree|степень, диплом|n|She has a degree in biology.;
    graduate|окончить вуз|v|I graduated in 2015.;
    revise|повторять (к экзамену)|v|I need to revise for my exam.|амер. review;
    cheat|списывать, жульничать|v|He cheated in the exam.;
    grade|оценка (амер.), класс (школы)|n|I got a good grade.|брит. также mark;
    take an exam|сдавать экзамен|o|I'm taking an exam tomorrow.|успешно сдать — pass;
    lecture|лекция|n|The lecture starts at nine.;
    state school|государственная школа|n|I went to a state school.|частная — private school;
    primary school|начальная школа|n|My son is at primary school.;
    secondary school|средняя школа|n|She teaches at a secondary school.|амер. high school;
    qualification|квалификация, диплом|n|You need the right qualifications.;
    scholarship|стипендия, грант|n|She got a scholarship to study abroad.;
    certificate|сертификат, свидетельство|n|I passed and got a certificate.`],
   ['wo3-jobs-3','Jobs B1','профессии подробнее',`
    accountant|бухгалтер|n|My sister is an accountant.;
    architect|архитектор|n|The architect designed the museum.;
    surgeon|хирург|n|The surgeon operated on my knee.;
    firefighter|пожарный|n|Firefighters are very brave.;
    plumber|сантехник|n|Call a plumber.;
    electrician|электрик|n|The electrician fixed the lights.;
    lawyer|юрист|n|You need a good lawyer.;
    scientist|учёный|n|Scientists study climate change.;
    engineer|инженер|n|She's a software engineer.;
    chef|шеф-повар|n|He's a chef in a hotel.;
    estate agent|риелтор|n|The estate agent called.;
    sales assistant|продавец-консультант|n|Ask the sales assistant.;
    social worker|социальный работник|n|She works as a social worker.;
    civil servant|госслужащий|n|He's a civil servant.`],
   ['wo3-apply','Applying for a job','как устроиться',`
    job advert|объявление о вакансии|n|I saw a job advert online.|амер. job ad;
    vacancy|вакансия|n|Are there any vacancies?;
    applicant|соискатель|n|There are fifty applicants.;
    application form|анкета кандидата|n|Fill in the application form.;
    cover letter|сопроводительное письмо|n|Send a CV and a cover letter.;
    reference|рекомендация|n|Can you give me a reference?;
    shortlist|короткий список|v|I was shortlisted for the job.;
    hire|нанять|v|They hired three new people.;
    salary|зарплата|n|The salary is good.;
    benefits|льготы|n|The job has great benefits.;
    trial period|испытательный срок|n|There's a three-month trial period.;
    qualified|квалифицированный|a|She's well qualified.;
    skill|навык|n|Communication is an important skill.;
    employ|нанимать, давать работу|v|The company employs 500 people.`],
   ['wo3-phones','Phones & messages','телефон и сообщения',`
    ring|звонить (брит.)|v|I'll ring you tomorrow.;
    voicemail|голосовая почта|n|I left a message on his voicemail.;
    missed call|пропущенный звонок|n|I have three missed calls from my mum.;
    leave a message|оставить сообщение|o|Can I leave a message for Anna?;
    attachment|вложение|n|Please open the attachment.;
    attach|прикрепить|v|I've attached the photos.;
    forward|переслать|v|Can you forward me the email?;
    inbox|входящие|n|My inbox is full.;
    spam|спам|n|The email went to spam.;
    profile|профиль|n|Update your profile photo.;
    follow|подписаться, следить|v|I follow her on Instagram.;
    notification|уведомление|n|Turn off notifications at night.;
    comment|комментарий, комментировать|n|Thanks for your comment!`],
   ],
B2:[
   ['wo4-career','Career & business','карьера и бизнес',`
    negotiate|вести переговоры|v|We negotiated a better price.;
    freelance|работающий на себя|a|I work freelance as a designer.|также self-employed;
    deadline|крайний срок|n|The deadline is on Friday.;
    meet a deadline|уложиться в срок|o|We worked late to meet the deadline.;
    run a business|управлять бизнесом|o|She runs a small business.;
    make a profit|получить прибыль|o|The company made a profit last year.|убыток — make a loss;
    launch|запустить (продукт)|v|They launched a new app.;
    staff|персонал|n|We have fifty staff.;
    employer|работодатель|n|My employer pays for my course.;
    employee|сотрудник|n|The company has 200 employees.;
    career|карьера|n|She has a successful career.|ударение на второй слог;
    skills|навыки|n|What skills do you need for this job?;
    work-life balance|баланс работы и жизни|n|I want a better work-life balance.;
    promotion|повышение|n|She got a promotion.`],
   ['wo4-office','Office life','офисная жизнь',`
    open-plan office|открытый офис|n|I work in an open-plan office.;
    cubicle|кабинка|n|He works in a small cubicle.;
    agenda|повестка дня|n|What's on the agenda?;
    minutes|протокол (собрания)|n|Who's taking the minutes?;
    brainstorm|мозговой штурм|v|Let's brainstorm some ideas.;
    feedback|обратная связь|n|Thanks for your feedback.;
    delegate|делегировать|v|A good manager delegates tasks.;
    follow up|проконтролировать, напомнить|v|I'll follow up with an email.;
    cc|поставить в копию|v|Please cc me on the email.;
    workload|нагрузка|n|My workload is huge.;
    overtime|сверхурочная работа|n|I did five hours of overtime.;
    remote work|удалённая работа|n|Remote work is popular now.;
    hybrid|гибридный|a|We have a hybrid schedule.;
    colleague|коллега|n|I get on well with my colleagues.`],
   ['wo4-skills','Skills & qualities','навыки',`
    leadership|лидерство|n|She has great leadership skills.;
    teamwork|командная работа|n|Teamwork is essential.;
    problem-solving|решение проблем|n|Problem-solving is a key skill.;
    communication skills|навыки общения|n|You need good communication skills.;
    initiative|инициативность|n|She shows a lot of initiative.;
    flexible|гибкий|a|I'm flexible about working hours.;
    self-motivated|самомотивированный|a|We need someone self-motivated.;
    attention to detail|внимание к деталям|n|The job needs attention to detail.;
    multilingual|многоязычный|a|She's multilingual.;
    computer literate|владеющий компьютером|a|Applicants must be computer literate.;
    hands-on|практический|a|I have hands-on experience.;
    deadline-driven|ориентированный на сроки|a|It's a deadline-driven job.;
    punctual|пунктуальный|a|Be punctual.;
    adaptable|легко приспосабливающийся|a|You need to be adaptable.`],
   ['wo4-education','Education B2','образование B2',`
    tuition fees|плата за обучение|n|Tuition fees are high in the UK.;
    undergraduate|студент бакалавриата|n|She's an undergraduate at Oxford.;
    postgraduate|магистрант, аспирант|n|He's a postgraduate student.;
    master's degree|степень магистра|n|I have a master's degree.;
    PhD|кандидатская степень|n|She's doing a PhD in biology.;
    thesis|диссертация, дипломная работа|n|I'm writing my thesis.;
    dissertation|диплом, диссертация|n|My dissertation is about birds.;
    campus|кампус|n|The campus is beautiful.;
    lecturer|преподаватель вуза|n|The lecturer was brilliant.;
    seminar|семинар|n|We have a seminar on Tuesday.;
    drop out|бросить учёбу|v|He dropped out of university.;
    mature student|студент старшего возраста|n|I'm a mature student.;
    gap year|год перерыва перед вузом|n|She took a gap year.;
    lifelong learning|обучение на протяжении жизни|n|Lifelong learning keeps your brain young.`],
   ['wo4-tech','Technology B2','технологии',`
    artificial intelligence|искусственный интеллект|n|Artificial intelligence is changing work.;
    algorithm|алгоритм|n|The algorithm recommends videos.;
    data|данные|n|We collect a lot of data.;
    privacy|конфиденциальность|n|Online privacy is important.;
    cyberbullying|кибербуллинг|n|Cyberbullying is a serious problem.;
    update|обновить, обновление|v|Update your software.;
    install|установить|v|Install the app.;
    crash|вылететь, зависнуть|v|My computer crashed.;
    back up|сделать резервную копию|v|Back up your photos.;
    cloud storage|облачное хранилище|n|I keep my files in cloud storage.;
    user-friendly|удобный (в использовании)|a|The app is very user-friendly.;
    cutting-edge|передовой|a|It's cutting-edge technology.;
    device|устройство|n|Turn off your devices.;
    virtual reality|виртуальная реальность|n|Virtual reality games are fun.`],
   ['wo4-jobhunt','Job hunting B2','поиск работы',`
    job hunting|поиск работы|n|Job hunting can be stressful.;
    recruitment|набор персонала|n|She works in recruitment.;
    recruit|нанимать, набирать|v|We're recruiting new staff.;
    candidate|кандидат|n|There were ten candidates for the job.;
    job offer|предложение о работе|n|I got a job offer yesterday!;
    notice period|срок уведомления об увольнении|n|My notice period is one month.;
    hand in your notice|подать заявление об уходе|o|He handed in his notice on Friday.;
    probation period|испытательный срок|n|The probation period is three months.;
    fixed-term contract|срочный договор|n|I'm on a fixed-term contract.;
    salary expectations|ожидания по зарплате|n|What are your salary expectations?;
    lay off|сокращать (сотрудников)|v|The company laid off 200 workers.;
    sack|уволить (разг.)|v|He was sacked for being late.|разг., нейтр. — dismiss;
    dismiss|уволить (офиц.)|v|She was dismissed for misconduct.;
    job description|описание должности|n|Read the job description carefully.`],
   ]},
  extra:{A1:[
   ['wo-jobs-2','Jobs 2','ещё профессии',`
    dentist|стоматолог|n|I'm going to the dentist.;
    pilot|пилот|n|He's an airline pilot.;
    actor|актёр|n|She wants to be an actor.;
    singer|певец|n|She's a famous singer.;
    writer|писатель|n|He's a writer of children's books.;
    artist|художник, человек искусства|n|My aunt is an artist.;
    hairdresser|парикмахер|n|My hairdresser is very good.;
    builder|строитель|n|The builders start at seven.;
    mechanic|механик|n|The mechanic fixed my car.;
    cleaner|уборщик|n|The cleaner comes on Fridays.;
    vet|ветеринар|n|Take the cat to the vet.;
    waiter|официант|n|My son works as a waiter.;
    factory worker|рабочий на заводе|n|He's a factory worker.;
    businessman|бизнесмен|n|He's a successful businessman.|женщина — businesswoman`],
   ['wo-class-2','School things','школьные вещи и слова',`
    board|доска|n|Look at the board, please.;
    pencil|карандаш|n|Write in pencil.;
    rubber|ластик (брит.)|n|Can I borrow your rubber?|амер. eraser;
    ruler|линейка|n|I need a ruler.;
    schoolbag|школьный рюкзак, портфель|n|His schoolbag is very heavy.;
    scissors|ножницы|n|Where are the scissors?;
    calculator|калькулятор|n|You can't use a calculator in the exam.;
    class|класс, занятие (группа или урок)|n|My English class is on Monday.;
    letter|буква, письмо|n|A is the first letter.;
    sentence|предложение|n|Write a sentence with this word.;
    number|номер, число (цифра)|n|Write the number seven.;
    example|пример|n|Can you give me an example?;
    the alphabet|алфавит|n|The English alphabet has 26 letters.;
    spell|произносить по буквам|v|Can you spell your name?`],
   ],
A2:[
   ['wo2-workphrases','Work phrases','что делаешь на работе',`
    work in a team|работать в команде|o|I like working in a team.;
    work long hours|работать много часов|o|Doctors work long hours.;
    work shifts|работать посменно|o|Nurses work shifts.;
    have a meeting|проводить встречу|o|We have a meeting at ten.;
    answer the phone|отвечать на звонки|o|I answer the phone all day.;
    deal with customers|работать с клиентами|o|I deal with customers.;
    travel for work|ездить в командировки|o|I travel for work a lot.;
    go on business|поехать по делам|o|He's gone to Berlin on business.;
    take a day off|взять выходной|o|I'm taking a day off tomorrow.;
    lunch break|обеденный перерыв|n|I have a one-hour lunch break.;
    sick leave|больничный|n|She's on sick leave.;
    client|клиент|n|I have a meeting with a client.;
    project|проект|n|We're working on a new project.;
    report|отчёт|n|I need to finish this report.`],
   ['wo2-tech-2','Technology 2','гаджеты и соцсети',`
    smartphone|смартфон|n|Everyone has a smartphone now.;
    tablet|планшет|n|The kids watch cartoons on the tablet.;
    printer|принтер|n|The printer isn't working.;
    mouse|мышь (компьютерная)|n|My mouse doesn't work.;
    headphones|наушники|n|I listen to podcasts with headphones.;
    charger|зарядка|n|Can I borrow your charger?;
    battery|батарея, аккумулятор|n|My battery is low.;
    message|сообщение|n|I sent you a message.;
    text|писать сообщение|v|Text me when you arrive.;
    post|публиковать|v|She posts photos every day.;
    share|делиться|v|Share the link with me.;
    online|онлайн, в сети|o|I buy most things online.;
    social media|соцсети|n|I spend too much time on social media.;
    log in|войти (в аккаунт)|v|Log in with your password.|выйти — log out`],
   ['wo2-school-2','School life','школьная жизнь',`
    pupil|ученик|n|The school has 500 pupils.;
    classmate|одноклассник|n|She was my classmate.;
    head teacher|директор школы|n|The head teacher wants to see you.|амер. principal;
    break|перемена|n|We play football at break.;
    test|контрольная|n|We have a maths test tomorrow.;
    mark|оценка (брит.)|n|I got a good mark.|амер. grade;
    uniform|форма|n|Pupils wear a uniform.;
    school trip|школьная экскурсия|n|We went on a school trip to Kraków.;
    playground|школьный двор, площадка|n|The children are in the playground.;
    rule|правило|n|Follow the school rules.;
    canteen|столовая|n|We have lunch in the canteen.;
    be late for|опоздать на|o|Don't be late for school.`],
   ],
B1:[
   ['wo3-work-2','Work B1 2','на работе',`
    workplace|рабочее место|n|The workplace should be safe.;
    colleague|коллега|n|My colleagues are friendly.;
    manager|руководитель|n|I spoke to the manager.;
    department|отдел|n|She works in the sales department.;
    head office|главный офис|n|Head office is in London.;
    task|задача|n|I have many tasks today.;
    responsibility|обязанность|n|It's your responsibility.;
    earn a living|зарабатывать на жизнь|o|How do you earn a living?;
    be in charge of|отвечать за|o|She's in charge of the team.;
    run|руководить|v|He runs a small company.;
    attend|посещать (занятия, мероприятия)|v|I attended a meeting.;
    organise|организовать|v|I organised the conference.|амер. organize;
    announce|объявить|v|They announced new rules.;
    pay rise|повышение зарплаты|n|I asked for a pay rise.|амер. raise`],
   ['wo3-study-2','Studying B1','учёба',`
    take notes|записывать, конспектировать|o|Take notes during the lecture.;
    memorise|заучивать|v|I memorised the words.|амер. memorize;
    revise|повторять (материал перед экзаменом)|v|I'm revising for my exams.;
    essay|эссе|n|I have to write an essay.;
    deadline|срок сдачи|n|The deadline is tomorrow.;
    hand in|сдать (работу)|v|Hand in your homework on Monday.;
    online course|онлайн-курс|n|I'm doing an online course.;
    tutor|репетитор|n|I have a private tutor.;
    classroom|класс (комната)|n|The classroom is on the second floor.;
    knowledge|знания|n|Test your knowledge.;
    improve|улучшить|v|My English has improved.;
    fluent|беглый (о языке)|a|She's fluent in three languages.;
    native speaker|носитель языка|n|Our teacher is a native speaker.;
    mistake|ошибка|n|Everyone makes mistakes.`],
   ['wo3-office','Office equipment','канцелярия и офисная техника',`
    photocopier|копировальный аппарат|n|The photocopier is broken again.;
    stapler|степлер|n|Can I borrow your stapler?;
    scanner|сканер|n|Use the scanner on the second floor.;
    filing cabinet|шкаф для документов|n|The files are in the filing cabinet.;
    noticeboard|доска объявлений|n|Check the noticeboard for news.;
    whiteboard|белая маркерная доска|n|He wrote the plan on the whiteboard.;
    paper clip|скрепка|n|I need a paper clip.;
    envelope|конверт|n|Put the letter in an envelope.;
    folder|папка|n|Save it in this folder.;
    stamp|марка, печать|n|I need a stamp for this letter.;
    highlighter|маркер-выделитель|n|I use a highlighter for new words.;
    sticky note|стикер|n|She left a sticky note on my screen.;
    hole punch|дырокол|n|Where's the hole punch?;
    sellotape|скотч (брит.)|n|Fix it with sellotape.|амер. Scotch tape`],
   ],
B2:[
   ['wo4-career-2','Career B2 2','карьерный путь',`
    career ladder|карьерная лестница|n|She climbed the career ladder quickly.;
    job security|стабильность работы|n|Job security is important to me.;
    prospects|перспективы|n|The job has good prospects.;
    headhunt|переманить|v|She was headhunted by a rival company.;
    redundant|сокращённый|a|He was made redundant.;
    maternity leave|декретный отпуск|n|She's on maternity leave.;
    career break|перерыв в карьере|n|I took a career break to travel.;
    internship|стажировка|n|I did an internship at a bank.;
    apprenticeship|ученичество|n|He did an apprenticeship as an electrician.;
    mentor|наставник|n|My mentor helped me a lot.;
    networking|нетворкинг|n|Networking is key in business.;
    burn out|выгореть|v|If you work too hard, you'll burn out.;
    pay cut|снижение зарплаты|n|We all took a pay cut.;
    perks|бонусы, льготы|n|Free lunch is one of the perks.`],
   ['wo4-business-2','Business B2','бизнес',`
    company|компания|n|It's a family company.;
    start-up|стартап|n|He works for a tech start-up.;
    entrepreneur|предприниматель|n|She's a successful entrepreneur.;
    turnover|оборот|n|The company has a turnover of a million euros.;
    revenue|выручка|n|Revenue increased by 10%.;
    competitor|конкурент|n|Our main competitor is cheaper.;
    merger|слияние|n|The merger created a huge company.;
    go bankrupt|обанкротиться|o|The shop went bankrupt.;
    expand|расширяться|v|The company is expanding abroad.;
    market research|исследование рынка|n|We did some market research.;
    supplier|поставщик|n|We changed our supplier.;
    brand|бренд|n|It's a well-known brand.;
    headquarters|штаб-квартира|n|The headquarters are in Warsaw.;
    shareholder|акционер|n|The shareholders were happy.`],
   ['wo4-meetings','Meetings & negotiations','встречи и переговоры',`
    chair a meeting|вести собрание|o|Who's chairing the meeting?;
    set the agenda|определить повестку|o|Let's set the agenda.;
    make a point|высказать мысль|o|She made a good point.;
    get to the point|перейти к сути|o|Let's get to the point.;
    compromise|компромисс|n|We reached a compromise.;
    proposal|предложение (план, проект)|n|They accepted our proposal.;
    bargain|торговаться|v|We bargained for a better price.;
    deal|сделка|n|We made a deal.;
    terms|условия|n|What are the terms of the contract?;
    deadline|крайний срок|n|We extended the deadline.;
    sign a contract|подписать договор|o|We signed a contract.;
    call off|отменить|v|They called off the meeting.;
    reach a consensus|прийти к единому мнению|o|We reached a consensus.;
    follow-up meeting|повторная встреча|n|Let's schedule a follow-up meeting.`],
   ['wo4-workplace','Workplace issues','проблемы на работе',`
    team spirit|командный дух|n|There's great team spirit in our office.;
    morale|моральный дух|n|Staff morale is very low.;
    office politics|офисные интриги|n|I hate office politics.;
    appraisal|аттестация, оценка работы|n|I have my annual appraisal next week.;
    performance review|оценка эффективности|n|My performance review went well.;
    micromanage|контролировать каждую мелочь|v|My boss micromanages everything.;
    trade union|профсоюз|n|She joined the trade union.;
    pay gap|разрыв в оплате|n|There's still a gender pay gap.;
    job satisfaction|удовлетворённость работой|n|Job satisfaction is more important than money.;
    staff turnover|текучесть кадров|n|The company has high staff turnover.;
    sick note|больничный лист|n|You need a sick note from your doctor.;
    flexitime|гибкий график|n|We work flexitime.;
    shift work|сменная работа|n|Shift work can affect your health.;
    unpaid leave|отпуск без сохранения зарплаты|n|I took a month's unpaid leave.`],
   ]}},

 {key:'free', name:'Free time', ru:'Досуг и путешествия', color:'#7a5230',
  info:'Хобби, спорт, отпуск и поездки.',
  cells:{A1:[
   ['fr-hobbies','Hobbies','что делаешь в свободное время',`
    hobby|хобби|n|My hobby is watching birds.;
    free time|свободное время|n|What do you do in your free time?;
    play football|играть в футбол|v|The boys play football after school.;
    go running|бегать (заниматься бегом)|v|I go running in the park.;
    go to the gym|ходить в спортзал|v|I go to the gym twice a week.;
    listen to music|слушать музыку|v|I listen to music in the car.;
    play the guitar|играть на гитаре|v|Can you play the guitar?;
    watch films|смотреть фильмы|v|We watch films on Friday evening.;
    go for a walk|гулять|v|Let's go for a walk in the forest.;
    dance|танцевать|v|I can't dance.;
    sing|петь|v|She sings very well.;
    paint|рисовать красками|v|My sister likes to paint.;
    draw|рисовать (карандашом, ручкой)|v|Can you draw a bird?`],
   ['fr-holiday','Holidays','отпуск и поездки',`
    holiday|отпуск, каникулы|n|We're on holiday in Italy.;
    trip|поездка (куда-то и обратно)|n|How was your trip?;
    beach|пляж|n|Let's go to the beach.;
    mountains|горы|n|We go to the mountains in winter.;
    sea|море|n|The sea is warm today.;
    lake|озеро|n|There are many lakes in Masuria.;
    city|город (большой)|n|Kraków is a beautiful city.;
    suitcase|чемодан|n|My suitcase is very heavy.;
    passport|паспорт|n|Don't forget your passport!;
    travel|путешествовать|v|I love to travel.;
    visit|посещать, навещать (место, людей)|v|We want to visit Rome.;
    stay at a hotel|остановиться в гостинице|v|We stay at a hotel near the beach.;
    book|бронировать|v|I want to book a room for two nights.;
    go sightseeing|осматривать достопримечательности|v|Let's go sightseeing tomorrow.`],
   ],
A2:[
   ['fr2-sports','Sports: play, go or do?','какой глагол',`
    play tennis|играть в теннис|o|We play tennis on Fridays.|play — игры с мячом и соревнования;
    play volleyball|играть в волейбол|o|They play volleyball on the beach.;
    go skiing|кататься на лыжах|o|We go skiing in the mountains.|go — занятия на -ing;
    go cycling|кататься на велосипеде|o|I go cycling at the weekend.|также ride a bike;
    go fishing|рыбачить|o|My dad goes fishing on Sundays.;
    go hiking|ходить в походы|o|We go hiking in the Tatra Mountains.;
    do yoga|заниматься йогой|o|I do yoga every morning.|do — занятия без мяча и соперника;
    do exercise|делать упражнения|o|You should do more exercise.;
    do karate|заниматься карате|o|My son does karate.;
    team|команда|n|Which team do you support?;
    match|матч|n|We watched the match on TV.|амер. game;
    score|забить (гол)|v|He scored two goals.|ещё «счёт» (n): What's the score?;
    goal|гол, цель|n|What a goal!;
    fan|болельщик, фанат|n|I'm a big football fan.`],
   ['fr2-hotel','Hotels & holidays','отель, отдых и что пошло не так',`
    reception|стойка регистрации|n|Ask at reception.;
    single room|одноместный номер|n|I'd like a single room.;
    double room|номер с двуспальной кроватью|n|A double room for two nights, please.|две кровати — twin room;
    view|вид (из окна)|n|The room has a sea view.;
    lift|лифт|n|The lift doesn't work.|амер. elevator;
    complain|жаловаться|v|We complained about the noise.|жалоба — complaint;
    noise|шум|n|There was a lot of noise at night.;
    sunburn|солнечный ожог|n|I got sunburn on the first day.;
    guidebook|путеводитель|n|The guidebook says it's open.;
    souvenir|сувенир|n|I bought some souvenirs.;
    campsite|кемпинг|n|We stayed at a campsite.;
    tent|палатка|n|It rained and our tent got wet.;
    abroad|за границей, за границу|o|We go abroad every summer.|без предлога: go abroad`],
   ['fr2-hobbies','Hobbies 2','увлечения',`
    collect stamps|собирать марки|o|My grandfather collects stamps.;
    do puzzles|собирать пазлы|o|We do puzzles in the evening.;
    do crosswords|разгадывать кроссворды|o|My dad does crosswords every day.;
    go horse riding|кататься верхом|o|I go horse riding at the weekend.;
    go sailing|ходить под парусом|o|We go sailing on the lake.;
    go surfing|заниматься сёрфингом|o|They go surfing in Portugal.;
    go skating|кататься на коньках|o|Let's go skating!;
    go climbing|заниматься скалолазанием|o|I go climbing twice a week.;
    play basketball|играть в баскетбол|o|He plays basketball at school.;
    play golf|играть в гольф|o|My boss plays golf.;
    play an instrument|играть на музыкальном инструменте|o|Do you play an instrument?;
    take photos|фотографировать|o|I love taking photos of birds.;
    bake cakes|печь торты|o|She bakes cakes for her friends.;
    knit|вязать|v|My grandmother knits scarves.`],
   ],
B1:[
   ['fr3-cinema','Cinema & books','фильмы, сериалы, книги',`
    plot|сюжет|n|The plot is very complicated.;
    director|режиссёр|n|Who's the director of the film?;
    cast|актёрский состав|n|The film has a great cast.;
    character|персонаж|n|The main character is a robot.|характер — personality;
    scene|сцена (эпизод фильма)|n|The last scene is very sad.;
    set in|действие происходит в|o|The film is set in New York.;
    based on|основан на|o|It's based on a true story.;
    subtitles|субтитры|n|We watch series with subtitles.;
    dubbed|дублированный|a|I don't like dubbed films.;
    review|рецензия, отзыв|n|The film got great reviews.;
    bestseller|бестселлер|n|Her new novel is a bestseller.;
    novel|роман|n|I'm reading a novel by Stephen King.|новелла — short story;
    episode|серия|n|We watch one episode every evening.;
    series|сериал|n|We're watching a series about robots.|ед. и мн. ч. одинаковы`],
   ['fr3-tv','TV & series','телевидение и сериалы',`
    channel|канал|n|What channel is it on?;
    programme|передача|n|It's my favourite programme.|амер. program;
    the news|новости|n|Did you see the news?|всегда с the, глагол в ед. ч.;
    reality show|реалити-шоу|n|I hate reality shows.;
    quiz show|викторина|n|We watch a quiz show every evening.;
    sitcom|ситком|n|Friends is a famous sitcom.;
    soap opera|мыльная опера|n|My mum loves soap operas.;
    streaming|стриминг|n|We only watch streaming services.;
    binge-watch|смотреть запоем|v|We binge-watched the whole series.;
    season|сезон|n|The second season is better.;
    spoiler|спойлер|n|No spoilers, please!;
    remote control|пульт|n|Where's the remote control?;
    turn over|переключить (канал)|v|Turn over, this is boring.;
    subtitles|субтитры|n|Turn on the subtitles.`],
   ['fr3-sport-3','Sport B1','спорт подробнее',`
    athlete|спортсмен|n|She's a professional athlete.;
    tournament|турнир|n|They won the tournament.;
    league|лига|n|They're top of the league.;
    score a goal|забить гол|o|He scored a goal.;
    lose a match|проиграть матч|o|We lost the match 2–0.;
    support a team|болеть за команду|o|Which team do you support?;
    fitness|физическая форма|n|I go to a fitness class.;
    warm up|разминаться|v|Always warm up first.;
    injury|травма|n|He missed the match because of an injury.;
    extreme sports|экстремальные виды спорта|n|He loves extreme sports.;
    marathon|марафон|n|She ran a marathon.;
    trainer|тренер (персональный)|n|I have a personal trainer.;
    equipment|снаряжение|n|Skiing equipment is expensive.;
    opponent|соперник|n|Our opponents were stronger.`],
   ],
B2:[
   ['fr4-arts','Arts & media','искусство и медиа',`
    exhibition|выставка|n|We went to an exhibition of modern art.;
    gallery|галерея|n|The gallery is free on Sundays.;
    audience|аудитория, публика|n|The audience loved the show.;
    performance|выступление|n|It was a great performance.;
    headline|заголовок|n|Did you see the headlines today?;
    journalist|журналист|n|She's a journalist for a local paper.;
    broadcast|транслировать|v|The match was broadcast live.;
    viewer|зритель (ТВ, видео)|n|The show has millions of viewers.;
    podcast|подкаст|n|I listen to podcasts in the car.;
    subscriber|подписчик|n|The channel has five hundred subscribers.;
    fake news|фейковые новости|n|Be careful of fake news.;
    critic|критик|n|The critics loved the film.|критика — criticism;
    masterpiece|шедевр|n|This painting is a masterpiece.;
    sculpture|скульптура|n|There's a sculpture in the square.`],
   ['fr4-film-2','Cinema B2','кино подробнее',`
    blockbuster|блокбастер|n|It was the biggest blockbuster of the year.;
    sequel|продолжение|n|The sequel was worse.;
    prequel|приквел|n|The prequel explains everything.;
    remake|ремейк|n|It's a remake of an old film.;
    soundtrack|саундтрек|n|I love the soundtrack.;
    special effects|спецэффекты|n|The special effects were amazing.;
    screenplay|сценарий|n|He wrote the screenplay.;
    starring|в главной роли|o|It's a film starring Tom Hanks.;
    box office|кассовые сборы|n|It was a box office hit.;
    premiere|премьера|n|We went to the premiere.;
    flop|провал|n|The film was a flop.;
    gripping|захватывающий (о сюжете)|a|It's a gripping thriller.;
    thought-provoking|заставляющий задуматься|a|It's a thought-provoking film.;
    far-fetched|надуманный|a|The plot was far-fetched.`],
   ['fr4-sport','Sport B2','спорт B2',`
    spectator|зритель (на стадионе)|n|Thousands of spectators watched.;
    umpire|судья (теннис, крикет)|n|The umpire made a mistake.;
    tie|ничья|n|The game ended in a tie.;
    penalty|пенальти, штраф|n|He missed the penalty.;
    substitute|запасной игрок|n|He came on as a substitute.;
    record|рекорд|n|She broke the world record.;
    trophy|трофей|n|They lifted the trophy.;
    medal|медаль|n|She won a gold medal.;
    defeat|поражение|n|It was a painful defeat.;
    victory|победа|n|It was a great victory.;
    stamina|выносливость (запас сил)|n|Running builds stamina.;
    pull a muscle|потянуть мышцу|o|I pulled a muscle.;
    doping|допинг|n|He was banned for doping.;
    sportsmanship|спортивное поведение|n|It was great sportsmanship.`],
   ['fr4-media','Media & internet','медиа и интернет',`
    content creator|автор контента|n|He's a YouTube content creator.;
    vlog|видеоблог|n|She makes travel vlogs.;
    channel|канал|n|Subscribe to my channel!;
    thumbnail|превью видео|n|The thumbnail needs to be eye-catching.;
    views|просмотры|n|The video got a million views.;
    comment section|комментарии|n|Don't read the comment section.;
    go live|выйти в прямой эфир|o|I'll go live at eight.;
    edit|монтировать|v|I edit my videos at night.;
    footage|видеозапись, материал|n|I have great footage of storks.;
    narration|закадровый текст|n|I record the narration myself.;
    engagement|вовлечённость|n|Engagement is high on this video.;
    monetise|монетизировать|v|You can monetise your channel.;
    trending|в трендах|a|The video is trending.;
    clickbait|кликбейт|n|That title is clickbait.`],
   ['fr4-outdoor','Outdoor activities','активный отдых',`
    trekking|треккинг, пеший поход|n|We went trekking in Nepal.;
    kayaking|каякинг|n|Kayaking on the river was amazing.;
    paragliding|парапланеризм|n|I'd love to try paragliding.;
    scuba diving|дайвинг с аквалангом|n|We went scuba diving in Egypt.;
    snorkelling|плавание с маской|n|The snorkelling here is great.;
    abseiling|спуск по верёвке|n|Abseiling is scary the first time.;
    white-water rafting|рафтинг|n|We went white-water rafting.;
    orienteering|спортивное ориентирование|n|Orienteering is popular in Scandinavia.;
    caving|спелеология|n|Caving isn't for people who hate small spaces.;
    bungee jumping|банджи-джампинг|n|I'd never go bungee jumping.;
    wild camping|дикий кемпинг|n|Wild camping is allowed here.;
    trail|тропа, маршрут|n|We followed a trail through the forest.;
    adrenaline rush|выброс адреналина|n|I love the adrenaline rush.;
    thrill-seeker|любитель острых ощущений|n|My brother is a real thrill-seeker.`],
   ]},
  extra:{A1:[
   ['fr-hobbies-2','Hobbies 2','ещё занятия',`
    play chess|играть в шахматы|o|My grandfather taught me to play chess.;
    play computer games|играть в компьютерные игры|o|My son plays computer games.;
    go camping|ходить в поход с палаткой|o|We go camping in summer.;
    go to the cinema|ходить в кино|o|Let's go to the cinema.;
    go to concerts|ходить на концерты|o|I love going to concerts.;
    meet friends|встречаться с друзьями|o|I meet friends on Friday evenings.;
    cook|готовить|v|I love to cook.;
    read magazines|читать журналы|o|I read magazines on the train.;
    surf the internet|сидеть в интернете|o|I surf the internet in the evening.;
    go dancing|ходить на танцы|o|We go dancing on Saturdays.;
    ride a horse|ездить верхом|o|Can you ride a horse?;
    gardening|садоводство|n|My mother loves gardening.;
    watch birds|наблюдать за птицами|o|I watch birds in the park.|хобби — birdwatching`],
   ['fr-games','Games & fun','игры и развлечения',`
    game|игра|n|This is a great game.;
    film|фильм|n|Let's watch a film tonight.|амер. movie;
    music|музыка|n|I like rock music.;
    ball|мяч|n|The dog is playing with a ball.;
    toy|игрушка|n|My kitten loves this toy.;
    play cards|играть в карты|o|We play cards on Friday evenings.;
    picnic|пикник|n|Let's have a picnic in the park.;
    fun|веселье|n|The party was great fun.;
    favourite|любимый|a|Blue is my favourite colour.;
    video|видео|n|Look at this funny video!;
    go to the beach|ходить на пляж|o|We go to the beach every day in summer.;
    go to the park|ходить в парк|o|Let's go to the park.;
    stay at home|оставаться дома|o|I want to stay at home today.`],
   ],
A2:[
   ['fr2-sports-2','Sports 2','соревнования',`
    race|гонка, забег|n|He won the race.;
    competition|соревнование, конкурс|n|She entered a photography competition.;
    prize|приз|n|The first prize is a holiday.;
    champion|чемпион|n|He's the world champion.;
    stadium|стадион|n|The stadium was full.;
    pitch|поле (футбольное)|n|The players are on the pitch.|амер. field;
    court|корт|n|Let's book a tennis court.;
    player|игрок|n|He's a great player.;
    referee|судья (в игре)|n|The referee stopped the game.;
    coach|тренер|n|Our coach is very strict.;
    beat|обыграть|v|We beat them 3–1.;
    draw|сыграть вничью|v|The match was a draw.;
    train|тренироваться|v|I train three times a week.;
    cheer|болеть, подбадривать|v|The fans cheered.`],
   ['fr2-holidays-2','Holidays 2','путешествия',`
    go on holiday|поехать в отпуск|o|We're going on holiday next week.;
    go on a trip|поехать в поездку|o|We went on a trip to Prague.;
    sunbathe|загорать|v|We sunbathed on the beach.;
    tourist|турист|n|The city is full of tourists.;
    sights|достопримечательности|n|We saw all the sights.;
    map|карта (местности)|n|Let's look at the map.;
    travel agent|турагент|n|We booked the trip with a travel agent.;
    package holiday|пакетный тур|n|A package holiday is cheaper.;
    rent a car|взять машину напрокат|o|We rented a car at the airport.;
    sun cream|солнцезащитный крем|n|Don't forget the sun cream.;
    postcard|открытка|n|I sent you a postcard.;
    youth hostel|хостел|n|We stayed in a youth hostel.;
    check out|выехать (из отеля)|v|We check out at eleven.`],
   ['fr2-music','Music & films','музыка и кино',`
    concert|концерт|n|We went to a concert last night.;
    band|группа (музыкальная)|n|What's your favourite band?;
    song|песня|n|I love this song.;
    musician|музыкант|n|He's a talented musician.;
    instrument|инструмент|n|Do you play an instrument?;
    drums|барабаны|n|My son plays the drums.;
    piano|пианино|n|She plays the piano.;
    violin|скрипка|n|He's learning the violin.;
    film star|кинозвезда|n|She's a famous film star.;
    comedy|комедия|n|Let's watch a comedy.;
    horror film|фильм ужасов|n|I don't like horror films.;
    cartoon|мультфильм|n|The kids are watching cartoons.;
    documentary|документальный фильм|n|We watched a documentary about birds.;
    action film|боевик|n|He loves action films.`],
   ],
B1:[
   ['fr3-books','Reading & books','чтение',`
    author|автор|n|Who's the author?;
    chapter|глава|n|I read one chapter every night.;
    fiction|художественная литература|n|I prefer fiction.;
    non-fiction|нехудожественная литература|n|He reads non-fiction.;
    biography|биография|n|I'm reading a biography of Chopin.;
    science fiction|научная фантастика|n|I love science fiction.;
    crime novel|детектив|n|Agatha Christie wrote crime novels.;
    e-book|электронная книга|n|I read e-books on my phone.;
    paperback|книга в мягкой обложке|n|The paperback is cheaper.;
    page-turner|захватывающая книга|n|This book is a real page-turner.;
    ending|концовка|n|The ending was surprising.;
    translation|перевод|n|I read it in translation.;
    borrow a book|взять книгу|o|I borrowed a book from the library.;
    bookworm|книголюб|n|My daughter is a bookworm.`],
   ['fr3-events','Going out','мероприятия',`
    festival|фестиваль|n|We went to a music festival.;
    gig|концерт (небольшой, живой)|n|The band has a gig tonight.;
    exhibition|выставка|n|There's a new exhibition at the museum.;
    performance|представление|n|The performance starts at eight.;
    ticket|билет|n|I bought two tickets.;
    sold out|все билеты проданы|a|The concert is sold out.;
    queue up|стоять в очереди|v|We queued up for an hour.;
    the front row|первый ряд|n|We sat in the front row.;
    interval|антракт|n|We had a drink in the interval.|амер. intermission;
    applause|аплодисменты|n|There was loud applause.;
    crowd|толпа|n|The crowd was huge.;
    venue|место проведения|n|The venue is near the station.;
    fireworks|фейерверк|n|We watched the fireworks.;
    celebrate|праздновать|v|How do you celebrate New Year?`],
   ['fr3-music','Music B1','музыка',`
    lead singer|солист|n|The lead singer has a great voice.;
    guitarist|гитарист|n|He's the band's guitarist.;
    drummer|барабанщик|n|Our drummer is only sixteen.;
    pianist|пианист|n|She's a famous pianist.;
    pop music|поп-музыка|n|My daughter loves pop music.;
    classical music|классическая музыка|n|I listen to classical music when I work.;
    jazz|джаз|n|There's live jazz in this bar.;
    rock music|рок-музыка|n|My dad likes rock music.;
    folk music|фолк, народная музыка|n|Polish folk music is very lively.;
    hip hop|хип-хоп|n|He listens to hip hop.;
    hit|хит|n|This song was a big hit.;
    stage|сцена (подмостки)|n|The band came on stage at nine.;
    microphone|микрофон|n|Speak into the microphone.;
    sing along|подпевать|v|Everyone sang along.`],
   ],
B2:[
   ['fr4-arts-2','Arts B2','искусство',`
    portrait|портрет|n|She painted a portrait of her son.;
    landscape|пейзаж (картина)|n|He paints landscapes.;
    still life|натюрморт|n|It's a still life with fruit.;
    abstract|абстрактный|a|I don't understand abstract art.;
    masterpiece|шедевр|n|The Mona Lisa is a masterpiece.;
    canvas|холст|n|Oil on canvas.;
    sketch|набросок|n|He made a quick sketch.;
    curator|куратор|n|The curator chose the paintings.;
    installation|инсталляция|n|The installation was strange.;
    art critic|искусствовед|n|The art critic loved it.;
    auction|аукцион|n|The painting was sold at auction.;
    priceless|бесценный|a|The painting is priceless.;
    photography|фотография (искусство)|n|I'm into wildlife photography.;
    street art|стрит-арт|n|Street art is everywhere here.`],
   ['fr4-music','Music B2','музыка',`
    lyrics|текст песни|n|I love the lyrics.;
    chorus|припев|n|Everyone sang the chorus.;
    tune|мелодия|n|It's a catchy tune.;
    album|альбом|n|Their new album is out.;
    record|записать|v|They recorded the album in London.;
    live|вживую|o|I saw them live.;
    tour|гастроли|n|The band is on tour.;
    orchestra|оркестр|n|She plays in an orchestra.;
    conductor|дирижёр|n|The conductor bowed.;
    choir|хор|n|I sing in a choir.;
    composer|композитор|n|Chopin was a Polish composer.;
    out of tune|фальшиво|o|The piano is out of tune.;
    playlist|плейлист|n|Make a playlist for the party.;
    genre|жанр|n|What's your favourite genre?`],
   ['fr4-hobbies','Hobbies & interests B2','хобби',`
    take up|заняться|v|I took up photography.;
    be into|увлекаться (разг.)|o|I'm really into birdwatching.;
    passionate about|увлечённый|o|She's passionate about nature.;
    enthusiast|энтузиаст|n|He's a keen cycling enthusiast.;
    amateur|любитель|n|I'm an amateur photographer.;
    collect|коллекционировать|v|He collects stamps.;
    DIY|ремонт своими руками|n|DIY is my hobby.;
    pottery|гончарное дело|n|I'm doing a pottery class.;
    knitting|вязание|n|Knitting is relaxing.;
    rock climbing|скалолазание|n|We went rock climbing.;
    board games|настольные игры|n|We play board games on Fridays.;
    volunteering|волонтёрство|n|Volunteering is rewarding.;
    pastime|времяпрепровождение|n|Reading is my favourite pastime.;
    therapeutic|успокаивающий, терапевтический|a|Gardening is therapeutic.`],
   ['fr4-books','Books & reading B2','книги и чтение',`
    narrator|рассказчик|n|The narrator is a ten-year-old boy.;
    protagonist|главный герой|n|The protagonist is a young detective.;
    setting|место действия|n|The setting is a small Scottish village.;
    plot twist|неожиданный поворот|n|I didn't see that plot twist coming.;
    hardback|книга в твёрдой обложке|n|The hardback is more expensive.;
    edition|издание|n|This is the first edition.;
    publish|издавать|v|Her first novel was published in 2020.;
    publisher|издатель|n|He sent the book to a publisher.;
    memoir|мемуары|n|She wrote a memoir about her childhood.;
    short story|рассказ|n|I prefer short stories to novels.;
    poetry|поэзия|n|He reads a lot of poetry.;
    literary|литературный|a|It won a literary prize.;
    cliffhanger|обрыв на самом интересном|n|The chapter ends on a cliffhanger.;
    unputdownable|не оторваться (о книге)|a|This thriller is unputdownable.`],
   ]}},

 {key:'body', name:'Body & health', ru:'Тело и здоровье', color:'#b98535',
  info:'Части тела и базовые фразы про самочувствие.',
  cells:{A1:[
   ['bo-body','Parts of the body','тело и лицо',`
    head|голова|n|My head hurts.;
    face|лицо|n|Wash your face.;
    eye|глаз|n|She has blue eyes.;
    ear|ухо|n|Cats have small ears.;
    nose|нос|n|He has a long nose.;
    mouth|рот|n|Open your mouth, please.;
    tooth / teeth|зуб / зубы|n|Brush your teeth twice a day.;
    hair|волосы|n|She has short dark hair.;
    hand|кисть руки|n|Give me your hand.;
    arm|рука (от плеча до кисти)|n|She has a bag on her arm.;
    leg|нога (от бедра до стопы)|n|My legs are tired.;
    foot / feet|стопа / стопы|n|My feet are cold.;
    back|спина|n|I have a bad back.;
    stomach|живот|n|I have a pain in my stomach.;
    finger|палец (руки)|n|I have a ring on my finger.`],
   ['bo-health','Feeling ill','у врача',`
    ill|больной (болеющий)|a|I'm ill today. I can't go to work.;
    well|здоровый, хорошо|a|I don't feel well.;
    headache|головная боль|n|I have a headache.;
    toothache|зубная боль|n|I have toothache.;
    a cold|простуда|n|I have a cold.;
    a temperature|температура (жар)|n|The baby has a temperature.;
    a cough|кашель|n|I have a cough and a cold.;
    medicine|лекарство|n|Take this medicine three times a day.;
    It hurts.|Больно. Болит.|o|It hurts when I walk.;
    I feel sick.|Меня тошнит.|o|I feel sick. I need some air.;
    see a doctor|сходить к врачу|v|You should see a doctor.;
    stay in bed|лежать в постели|v|Stay in bed and drink water.;
    Get well soon!|Выздоравливай!|o|Get well soon, Anna!`],
   ],
A2:[
   ['bo2-illness','Illness & symptoms','симптомы и у врача',`
    sore throat|больное горло|n|I have a sore throat.;
    runny nose|насморк|n|The baby has a runny nose.;
    sneeze|чихать|v|I sneeze a lot in spring.;
    allergic|с аллергией|a|I'm allergic to cats.|allergic to — аллергия на;
    flu|грипп|n|She's in bed with flu.;
    earache|боль в ухе|n|The child has earache.;
    backache|боль в спине|n|Too much sitting gives me backache.;
    dizzy|с головокружением|a|I feel dizzy.;
    hurt|ушибить, болеть|v|I hurt my knee.;
    break|сломать|v|He broke his arm skiing.;
    swollen|опухший|a|My ankle is swollen.;
    appointment|запись (к врачу)|n|I have an appointment at ten.;
    prescription|рецепт (от врача)|n|The doctor gave me a prescription.;
    rest|отдыхать|v|You need to rest.`],
   ['bo2-accidents','Small accidents','мелкие травмы и врач',`
    blood|кровь|n|There was blood on his shirt.;
    bone|кость|n|The dog has a bone.;
    pill|таблетка|n|Take one pill after meals.;
    break your arm|сломать руку|o|He broke his arm skiing.;
    cut your finger|порезать палец|o|I cut my finger with a knife.;
    fall over|упасть, споткнувшись|v|She fell over in the street.;
    burn your hand|обжечь руку|o|Be careful, don't burn your hand.;
    feel better|чувствовать себя лучше|o|Do you feel better today?;
    have a pain|чувствовать боль|o|I have a pain in my back.;
    take your temperature|измерить температуру|o|The nurse took my temperature.;
    go to hospital|лечь в больницу|o|He had to go to hospital.|амер. go to the hospital;
    see a dentist|сходить к стоматологу|o|You should see a dentist.;
    drink plenty of water|пить много воды|o|Rest and drink plenty of water.`],
   ],
B1:[
   ['bo3-doctor','At the doctor\'s','травмы и лечение',`
    injury|травма|n|He has a knee injury.;
    injured|раненый, травмированный|a|Two people were injured.;
    bleed|кровоточить|v|My finger is bleeding.;
    bruise|синяк|n|I have a bruise on my arm.;
    sprain|растянуть (связку)|v|I sprained my ankle.;
    twist|подвернуть|v|She twisted her ankle.;
    operation|операция|n|He needs an operation.|также surgery;
    recover|выздороветь|v|She's recovering from flu.;
    painkiller|обезболивающее|n|Take a painkiller.;
    symptom|симптом|n|What are your symptoms?;
    blood pressure|давление|n|The nurse checked my blood pressure.;
    emergency|экстренный случай|n|Call 112 in an emergency.;
    ambulance|скорая помощь|n|Call an ambulance!`],
   ['bo3-health-3','Health B1','здоровье',`
    infection|инфекция|n|She has an ear infection.;
    virus|вирус|n|It's just a virus.;
    rash|сыпь|n|The baby has a rash.;
    blister|мозоль (волдырь)|n|My new shoes gave me a blister.;
    vomit|рвать|v|The child vomited in the car.|разг. be sick;
    faint|упасть в обморок|v|She fainted in the heat.;
    cough|кашлять|v|I've been coughing all night.;
    bleed|кровоточить|v|His nose is bleeding.;
    check-up|осмотр|n|I go for a check-up every year.;
    X-ray|рентген|n|The doctor sent me for an X-ray.;
    surgery|кабинет врача, операция|n|The surgery opens at eight.;
    chemist|аптекарь|n|Ask the chemist.|аптека — chemist's;
    tablet|таблетка|n|Take two tablets a day.;
    side effects|побочные эффекты|n|Are there any side effects?`],
   ['bo3-sleep','Sleep & energy','сон и бодрость',`
    fall asleep|заснуть|o|I fell asleep in front of the TV.;
    be asleep|спать|o|The kids are asleep.;
    awake|не спящий|a|Are you still awake?;
    stay awake|не спать|o|I couldn't stay awake.;
    nightmare|кошмар|n|I had a nightmare last night.;
    dream|сон, мечта, видеть сон|n|I had a strange dream.;
    snore|храпеть|v|My husband snores.;
    sleepy|сонный|a|I feel sleepy after lunch.;
    lie in|поваляться в постели|v|I lie in on Sundays.;
    get enough sleep|высыпаться|o|You need to get enough sleep.;
    light sleeper|человек с чутким сном|n|I'm a light sleeper.;
    heavy sleeper|человек с крепким сном|n|He's a heavy sleeper, nothing wakes him.;
    alarm clock|будильник|n|My alarm clock didn't go off.;
    energetic|энергичный|a|I feel energetic in the morning.`],
   ],
B2:[
   ['bo4-health','Health B2','здоровье B2',`
    chronic|хронический|a|He has chronic back pain.;
    acute|острый (о болезни)|a|She has acute pain.;
    diagnose|ставить диагноз|v|He was diagnosed with diabetes.;
    diagnosis|диагноз|n|The diagnosis was good.;
    treatment|лечение|n|The treatment worked.;
    prescribe|выписать (лекарство)|v|The doctor prescribed antibiotics.;
    antibiotics|антибиотики|n|Take the antibiotics for a week.;
    vaccine|вакцина|n|The vaccine is free.;
    side effect|побочный эффект|n|Drowsiness is a side effect.;
    recovery|выздоровление|n|She made a full recovery.;
    GP|терапевт (семейный врач)|n|Make an appointment with your GP.;
    specialist|специалист|n|I was sent to a specialist.;
    A&E|отделение неотложной помощи|n|We spent the night in A&E.|амер. ER;
    stitches|швы|n|I needed five stitches.`],
   ['bo4-mind','Mind & wellbeing','психика и самочувствие',`
    wellbeing|благополучие|n|Exercise improves your wellbeing.;
    mental health|психическое здоровье|n|Mental health is important.;
    anxiety|тревожность|n|She suffers from anxiety.;
    depression|депрессия|n|Depression is a common illness.;
    insomnia|бессонница|n|I have insomnia.;
    therapy|терапия|n|Therapy helped me a lot.;
    meditation|медитация|n|I do meditation every morning.;
    mindfulness|осознанность|n|Mindfulness reduces stress.;
    self-esteem|самооценка|n|She has low self-esteem.;
    cope|справляться (с трудностями)|v|I can't cope with stress.;
    overwhelmed|перегруженный|a|I feel overwhelmed.;
    burnt out|выгоревший|a|I'm completely burnt out.;
    resilient|устойчивый, жизнестойкий|a|Children are very resilient.;
    peace of mind|душевное спокойствие|n|Insurance gives me peace of mind.`],
   ['bo4-fitness','Fitness B2','фитнес',`
    workout|тренировка|n|I do a short workout every morning.;
    personal trainer|персональный тренер|n|My personal trainer is very strict.;
    cardio|кардиотренировка|n|I do cardio three times a week.;
    weightlifting|тяжёлая атлетика, работа с весами|n|Weightlifting makes you stronger.;
    reps|повторения|n|Do three sets of ten reps.;
    stretching|растяжка|n|Don't forget stretching after running.;
    build muscle|наращивать мышцы|o|He's trying to build muscle.;
    get in shape|прийти в форму|o|I want to get in shape for summer.;
    out of shape|не в форме|o|I'm really out of shape.;
    tone up|подтянуть (тело)|v|Swimming helps you tone up.;
    endurance|выносливость (долго выдерживать нагрузку)|n|Running improves your endurance.;
    flexibility|гибкость|n|Yoga is good for flexibility.;
    fitness tracker|фитнес-браслет|n|My fitness tracker counts my steps.;
    sedentary lifestyle|сидячий образ жизни|n|A sedentary lifestyle is bad for your health.`],
   ['bo4-symptoms','Pain & symptoms','боль и симптомы',`
    ache|ноющая боль, болеть|n|I have an ache in my shoulder.;
    throbbing|пульсирующий|a|I've got a throbbing headache.;
    sharp pain|острая боль|n|I felt a sharp pain in my knee.;
    dull pain|тупая боль|n|There's a dull pain in my back.;
    itchy|зудящий|a|My skin is really itchy.;
    numb|онемевший|a|My fingers are numb with cold.;
    stiff|негнущийся, затёкший|a|My neck is stiff.;
    sore|больной, воспалённый|a|My legs are sore after running.;
    nauseous|испытывающий тошноту|a|I feel a bit nauseous.;
    under the weather|приболевший, не в форме|o|I'm feeling a bit under the weather.;
    out of breath|запыхавшийся|o|I was out of breath after the stairs.;
    feel faint|чувствовать слабость, вот-вот упасть в обморок|o|I felt faint in the heat.;
    pass out|потерять сознание|v|He passed out in the heat.;
    bloated|вздутый (о животе)|a|I feel bloated after that meal.`],
   ]},
  extra:{A1:[
   ['bo-body-2','Body 2','ещё части тела',`
    neck|шея|n|I have a pain in my neck.;
    shoulder|плечо|n|My shoulder hurts.;
    knee|колено|n|I hurt my knee.|k не читается;
    toe|палец ноги|n|I broke my toe.;
    thumb|большой палец (руки)|n|I cut my thumb.;
    chest|грудь, грудная клетка|n|I have a pain in my chest.;
    elbow|локоть|n|Don't put your elbows on the table.;
    lips|губы|n|My lips are dry.;
    tongue|язык (орган)|n|Show me your tongue.;
    skin|кожа|n|She has very pale skin.;
    heart|сердце|n|My heart is beating fast.;
    brain|мозг|n|The brain needs sleep.;
    body|тело|n|Exercise is good for your body.`],
   ],
A2:[
   ['bo2-healthy','Healthy lifestyle','здоровый образ жизни',`
    healthy|здоровый, полезный|a|Eat healthy food.;
    fit|в форме|a|I want to get fit.;
    keep fit|поддерживать форму|o|I swim to keep fit.;
    stress|стресс|n|Exercise helps with stress.;
    junk food|вредная еда, фастфуд|n|Try to eat less junk food.;
    vitamins|витамины|n|Fruit is full of vitamins.;
    put on weight|поправиться|o|I put on weight in winter.;
    lose weight|похудеть|o|He wants to lose weight.;
    go on a diet|сесть на диету|o|I'm going on a diet.;
    balanced diet|сбалансированное питание|n|A balanced diet is important.;
    smoke|курить|v|He doesn't smoke.;
    alcohol|алкоголь|n|I don't drink alcohol.;
    sleep well|хорошо спать|o|I didn't sleep well last night.`],
   ],
B1:[
   ['bo3-body-3','Body B1','тело подробнее',`
    forehead|лоб|n|He has a scar on his forehead.;
    cheek|щека|n|She kissed him on the cheek.;
    chin|подбородок|n|He has a beard on his chin.;
    eyebrow|бровь|n|She raised her eyebrows.;
    eyelash|ресница|n|She has long eyelashes.;
    hip|бедро (таз)|n|My hip hurts.;
    waist|талия|n|The belt goes round your waist.;
    ankle|лодыжка|n|I twisted my ankle.;
    wrist|запястье|n|I wear my watch on my left wrist.;
    heel|пятка|n|I have a blister on my heel.;
    lungs|лёгкие|n|Smoking damages your lungs.;
    liver|печень|n|Alcohol damages the liver.;
    muscle|мышца|n|My muscles hurt after the gym.;
    nail|ноготь|n|She painted her nails.`],
   ['bo3-senses','Senses & actions','органы чувств и движения',`
    smell|пахнуть, нюхать|v|This soup smells great.;
    taste|быть на вкус|v|It tastes delicious.;
    touch|трогать|v|Don't touch the paintings.;
    stare|пристально смотреть|v|Don't stare at people.;
    glance|взглянуть мельком|v|She glanced at her watch.;
    notice|заметить|v|I noticed a small bird.;
    blink|моргать|v|Try not to blink.;
    yawn|зевать|v|Stop yawning!;
    nod|кивать|v|He nodded and smiled.;
    shake hands|пожать руки|o|They shook hands.;
    wave|махать|v|She waved goodbye.;
    hug|обнимать|v|She hugged her son.;
    kneel|вставать на колени|v|He knelt down to propose.;
    whistle|свистеть|v|He whistled a song.`],
   ],
B2:[
   ['bo4-body-2','Body & movement B2','тело и движения',`
    limp|хромать|v|He was limping after the match.;
    stumble|спотыкаться|v|I stumbled on the stairs.;
    stretch|потягиваться, растягиваться|v|Stretch after running.;
    crawl|ползать|v|The baby is crawling.;
    tiptoe|ходить на цыпочках|v|I tiptoed into the room.;
    stroll|прогуливаться|v|We strolled along the beach.;
    stagger|шататься|v|He staggered home.;
    lean|облокачиваться|v|Don't lean on the door.;
    grab|схватить|v|He grabbed my arm.;
    squeeze|сжимать, выжимать|v|She squeezed my hand.;
    scratch|чесать|v|Don't scratch the bite.;
    clench|сжимать (кулаки, зубы)|v|He clenched his fists.;
    shiver|дрожать (от холода)|v|I was shivering with cold.;
    sweat|потеть|v|I was sweating in the heat.`],
   ['bo4-idioms-2','Body idioms 2','ещё идиомы',`
    have a sweet tooth|любить сладкое|o|I have a sweet tooth.;
    put your foot in it|сказать что-то неуместное|o|I really put my foot in it.;
    keep your chin up|не унывай|o|Keep your chin up, it'll be fine.;
    get something off your chest|высказаться|o|I need to get this off my chest.;
    have your hands full|быть очень занятым|o|She has her hands full with three kids.;
    learn by heart|выучить наизусть|o|Learn these words by heart.;
    a slap in the face|пощёчина, оскорбление|o|It was a slap in the face.;
    be head over heels|быть по уши влюблённым|o|He's head over heels in love.;
    have a lot on your plate|иметь много дел|o|I have a lot on my plate.;
    turn your back on|отвернуться от|o|Don't turn your back on your friends.;
    rule of thumb|практическое правило|o|As a rule of thumb, sleep eight hours.;
    see eye to eye|сходиться во мнениях|o|We don't see eye to eye.;
    by word of mouth|из уст в уста|o|I heard about it by word of mouth.;
    tongue-tied|потерявший дар речи|a|I was tongue-tied.`],
   ['bo4-injuries','Accidents & injuries','травмы',`
    fracture|перелом|n|She has a fracture in her wrist.;
    dislocate|вывихнуть|v|He dislocated his shoulder.;
    concussion|сотрясение мозга|n|He had concussion after the fall.;
    burn|ожог|n|She got a burn from the oven.;
    bandage|бинт|n|The nurse put on a bandage.;
    plaster|пластырь, гипс|n|Put a plaster on the cut.;
    crutches|костыли|n|He's on crutches.;
    wheelchair|инвалидная коляска|n|She uses a wheelchair.;
    first aid|первая помощь|n|Do you know first aid?;
    paramedic|фельдшер скорой|n|The paramedics arrived quickly.;
    unconscious|без сознания|a|He was unconscious.;
    wound|рана|n|The wound healed quickly.;
    swelling|отёк|n|Put ice on the swelling.;
    heal|заживать|v|The cut is healing.`],
   ['bo4-idioms','Body idioms','тело в выражениях',`
    cost an arm and a leg|стоить целое состояние|o|The new car cost an arm and a leg.;
    keep an eye on|присматривать за|o|Can you keep an eye on my bag?;
    pull someone's leg|разыгрывать, подшучивать|o|Relax, I'm just pulling your leg.;
    get cold feet|струсить в последний момент|o|He got cold feet before the wedding.;
    be all ears|внимательно слушать|o|Tell me everything, I'm all ears.;
    break a leg|ни пуха ни пера|o|Break a leg tonight!|пожелание перед выступлением;
    by heart|наизусть|o|I learned the poem by heart.;
    off the top of my head|навскидку|o|Off the top of my head, I'd say fifty.;
    give someone a hand|помочь|o|Can you give me a hand?;
    keep someone on their toes|держать в тонусе|o|This job keeps me on my toes.;
    face the music|отвечать за последствия|o|He has to face the music now.;
    get something off your chest|облегчить душу|o|Tell me — get it off your chest.;
    turn a blind eye|закрывать глаза на|o|The teacher turned a blind eye to it.;
    stick your neck out|рисковать ради кого-то|o|I stuck my neck out for you.`],
   ]}},

 {key:'nature', name:'Nature & weather', ru:'Природа, погода, животные', color:'#4a8a5a',
  info:'Погода, животные, растения и ландшафт.',
  cells:{A1:[
   ['na-weather','Weather','какая погода',`
    weather|погода|n|What's the weather like today?;
    sun|солнце|n|The sun is hot today.;
    rain|дождь|n|I love the sound of rain.;
    snow|снег|n|The children play in the snow.;
    wind|ветер|n|The wind is very strong.;
    cloud|облако|n|There isn't a cloud in the sky.;
    sunny|солнечный|a|It's sunny and warm.;
    rainy|дождливый|a|It's a rainy day.;
    cloudy|облачный|a|It's cloudy but not cold.;
    windy|ветреный|a|It's windy by the sea.;
    hot|жаркий|a|It's very hot in August.;
    warm|тёплый|a|It's warm in May.;
    cold|холодный|a|It's cold outside. Wear a coat.;
    It's raining.|Идёт дождь.|o|Take an umbrella. It's raining.`],
   ['na-animals','Animals & plants','живая природа',`
    animal|животное|n|What's your favourite animal?;
    dog|собака|n|We walk the dog every morning.;
    cat|кошка|n|The cat sleeps all day.;
    bird|птица|n|I can hear a bird.;
    horse|лошадь|n|Can you ride a horse?;
    cow|корова|n|Cows give milk.;
    pig|свинья|n|The farmer has three pigs.;
    sheep|овца|n|There are sheep in the field.;
    mouse|мышь|n|The cat is looking at a mouse.;
    duck|утка|n|There are ducks on the lake.;
    tree|дерево|n|There's a bird in the tree.;
    flower|цветок|n|These flowers are for you.;
    forest|лес|n|We walk in the forest on Sunday.;
    river|река|n|The Vistula is a long river.;
    field|поле|n|The cows are in the field.`],
   ],
A2:[
   ['na2-landscape','Landscape','пейзаж',`
    hill|холм|n|There's a castle on the hill.;
    valley|долина|n|The village is in a green valley.;
    coast|побережье|n|We drove along the coast.;
    island|остров|n|We spent a week on a Greek island.|s не читается;
    cliff|скала, обрыв|n|Birds nest on the cliffs.;
    desert|пустыня|n|The Sahara is a huge desert.|десерт — dessert;
    path|тропинка|n|Follow the path through the forest.;
    bridge|мост|n|There's an old bridge over the river.;
    waterfall|водопад|n|The waterfall is thirty metres high.;
    wood|лесок, роща|n|We walked in the wood behind the house.|часто во мн. ч.: the woods;
    ocean|океан|n|The Atlantic Ocean is cold.;
    countryside|сельская местность|n|I love the countryside.|неисчисл., с the;
    wildlife|дикая природа|n|The park is full of wildlife.;
    nature|природа|n|I love being in nature.|без the`],
   ['na2-animals','Wild animals','дикие животные',`
    whale|кит|n|We saw a whale from the boat.;
    dolphin|дельфин|n|Dolphins are very clever.;
    shark|акула|n|There are sharks in this sea.;
    crocodile|крокодил|n|Crocodiles live in rivers.;
    kangaroo|кенгуру|n|Kangaroos live in Australia.;
    zebra|зебра|n|A zebra has black and white stripes.;
    camel|верблюд|n|Camels can live without water for days.;
    penguin|пингвин|n|Penguins can't fly.;
    polar bear|белый медведь|n|Polar bears live in the Arctic.;
    turtle|черепаха (морская)|n|A turtle swam past us.|сухопутная — tortoise;
    spider|паук|n|There's a spider in the bath!;
    ant|муравей|n|There are ants in the kitchen.;
    fly|муха|n|There's a fly in my soup!`],
   ],
B1:[
   ['na3-animals','Animals & insects','крылья, перья, гнёзда',`
    wing|крыло|n|The bird has black wings.;
    feather|перо|n|I found a feather in the garden.;
    beak|клюв|n|Woodpeckers have strong beaks.;
    nest|гнездо|n|There's a nest in the tree.;
    fur|мех|n|The cat has soft fur.;
    tail|хвост|n|The dog is wagging its tail.;
    claw|коготь|n|Eagles have sharp claws.;
    bee|пчела|n|Bees make honey.;
    butterfly|бабочка|n|A butterfly landed on the flower.;
    mosquito|комар|n|I got bitten by a mosquito.;
    insect|насекомое|n|Many birds eat insects.;
    wild|дикий|a|Wild animals live in the forest.|домашнее животное — pet;
    species|вид (биологический)|n|There are many species of birds here.|ед. и мн. ч. одинаковы;
    migrate|мигрировать, улетать|v|Storks migrate to Africa in autumn.|перелёт — migration`],
   ['na3-environment','Environment','экология',`
    pollution|загрязнение|n|Air pollution is a big problem.;
    recycle|перерабатывать|v|We recycle glass and paper.;
    climate change|изменение климата|n|Climate change affects birds too.;
    global warming|глобальное потепление|n|Global warming is melting the ice.;
    rubbish|мусор|n|Don't drop rubbish in the park.|амер. garbage, trash;
    plastic|пластик|n|Try to use less plastic.;
    waste|отходы|n|We produce too much waste.;
    energy|энергия|n|Save energy — turn off the lights.;
    solar power|солнечная энергия|n|Our house uses solar power.;
    protect|защищать|v|We must protect the forests.;
    endangered|вымирающий|a|The tiger is an endangered species.;
    destroy|уничтожать|v|Fires destroyed the forest.;
    environment|окружающая среда|n|We need to protect the environment.`],
   ['na3-weather-3','Weather B1','погода подробнее',`
    breeze|лёгкий ветерок|n|There's a nice breeze.;
    gale|сильный ветер|n|The gale damaged the roof.;
    drizzle|моросящий дождь|n|It's just drizzle.;
    heavy rain|сильный дождь|n|Heavy rain is expected.;
    thunderstorm|гроза|n|There was a thunderstorm last night.;
    sleet|мокрый снег|n|Rain turned to sleet.;
    freezing|очень холодно|a|It's freezing today.;
    boiling|очень жарко|a|It's boiling!;
    changeable|переменчивый|a|The weather is changeable.;
    bright|ясный|a|It's a bright morning.;
    clear up|проясниться|v|It will clear up later.;
    temperature|температура|n|The temperature is rising.;
    melt|таять|v|The snow is melting.;
    puddle|лужа|n|The kids jumped in the puddles.`],
   ['na3-pets','Pets & animal care','питомцы и уход',`
    kitten|котёнок|n|Our kitten is five months old.;
    puppy|щенок|n|They got a puppy for Christmas.;
    cage|клетка|n|The bird lives in a cage.;
    collar|ошейник|n|The dog has a red collar.;
    lead|поводок (брит.)|n|Keep your dog on a lead.|амер. leash;
    paw|лапа|n|The cat hurt its paw.;
    litter tray|кошачий лоток|n|Clean the litter tray every day.|амер. litter box;
    pet food|корм для животных|n|Pet food is expensive.;
    bark|лаять|v|The dog barks at strangers.;
    purr|мурлыкать|v|The cat purrs when you stroke it.;
    bite|кусать|v|Don't worry, he doesn't bite.;
    lick|лизать|v|The puppy licked my hand.;
    stroke|гладить (животное)|v|Can I stroke your dog?;
    take to the vet|отвезти к ветеринару|o|We took the cat to the vet.`],
   ],
B2:[
   ['na4-weather','Extreme weather','погода и стихия',`
    drought|засуха|n|The drought killed the crops.|gh не читается;
    flood|наводнение|n|The flood destroyed many homes.;
    heatwave|аномальная жара|n|Europe had a heatwave this summer.;
    storm|шторм, буря|n|The storm lasted all night.;
    thunder|гром|n|I heard thunder in the distance.;
    lightning|молния|n|The tree was hit by lightning.;
    hurricane|ураган|n|The hurricane hit Florida.;
    hail|град|n|Hail damaged the cars.;
    fog|туман|n|The airport was closed because of fog.;
    frost|заморозки, иней|n|There was frost on the grass.;
    blizzard|метель|n|We got stuck in a blizzard.;
    earthquake|землетрясение|n|The earthquake shook the city.;
    forecast|прогноз|n|What's the weather forecast for tomorrow?;
    pour|лить (о дожде)|v|It's pouring with rain.|также it's pouring down`],
   ['na4-env','Environment B2','экология B2',`
    sustainable|устойчивый, экологичный|a|We need sustainable energy.;
    biodiversity|биоразнообразие|n|Forests have high biodiversity.;
    ecosystem|экосистема|n|Pollution damages the ecosystem.;
    conservation|охрана природы|n|She works in conservation.;
    greenhouse gases|парниковые газы|n|Cars produce greenhouse gases.;
    carbon neutral|углеродно-нейтральный|a|The company is carbon neutral.;
    single-use plastic|одноразовый пластик|n|Ban single-use plastic!;
    landfill|свалка|n|Most rubbish goes to landfill.;
    compost|компост|n|We make compost from food waste.;
    poaching|браконьерство|n|Poaching threatens elephants.;
    rising sea levels|повышение уровня моря|n|Rising sea levels threaten cities.;
    natural resources|природные ресурсы|n|We waste natural resources.;
    eco-friendly|экологичный|a|Buy eco-friendly products.;
    melting ice caps|тающие ледники|n|Melting ice caps are a sign of warming.`],
   ['na4-animals','Animals B2','животный мир',`
    predator|хищник|n|The fox is a predator.;
    prey|добыча|n|Mice are prey for owls.;
    mammal|млекопитающее|n|Whales are mammals.;
    reptile|рептилия|n|Snakes are reptiles.;
    amphibian|земноводное|n|Frogs are amphibians.;
    herd|стадо|n|A herd of cows.;
    pack|стая (волков)|n|A pack of wolves.;
    hibernate|впадать в спячку|v|Bears hibernate in winter.;
    camouflage|камуфляж|n|Its fur is good camouflage.;
    endangered species|вымирающий вид|n|The panda is an endangered species.;
    extinction|вымирание|n|Many species face extinction.;
    habitat loss|потеря среды обитания|n|Habitat loss is the biggest threat.;
    domesticated|одомашненный|a|Dogs are domesticated animals.;
    tame|ручной|a|The bird is quite tame.`],
   ['na4-landscape','Landscape B2','пейзаж подробнее',`
    glacier|ледник|n|The glacier is melting.;
    canyon|каньон|n|We visited the Grand Canyon.;
    plateau|плато|n|The village is on a high plateau.;
    estuary|устье реки|n|Birds feed in the estuary.;
    wetland|водно-болотные угодья|n|Wetlands are important for birds.;
    reed bed|заросли тростника|n|Warblers nest in the reed beds.;
    dune|дюна|n|We walked over the sand dunes.;
    cliff edge|край обрыва|n|Don't go near the cliff edge.;
    ridge|хребет|n|We walked along the ridge.;
    woodland|лесной массив|n|There's a lot of woodland here.;
    undergrowth|подлесок|n|A deer hid in the undergrowth.;
    horizon|горизонт|n|The sun disappeared below the horizon.;
    tide|прилив и отлив|n|The tide is coming in.;
    untouched|нетронутый|a|It's an untouched wilderness.`],
   ['na4-energy','Energy & resources','энергия и ресурсы',`
    solar panel|солнечная панель|n|We put solar panels on the roof.;
    wind turbine|ветряная турбина|n|There are wind turbines on the hill.;
    power station|электростанция|n|The power station uses coal.;
    nuclear power|атомная энергия|n|Nuclear power is still controversial.;
    energy-efficient|энергоэффективный|a|Buy energy-efficient light bulbs.;
    fuel|топливо|n|Fuel prices are going up.;
    shortage|нехватка|n|There's a water shortage this summer.;
    consumption|потребление|n|Energy consumption is rising.;
    scarce|дефицитный, скудный|a|Water is scarce in the desert.;
    deplete|истощать|v|We are depleting the Earth's resources.;
    oil spill|разлив нефти|n|The oil spill killed thousands of birds.;
    water supply|водоснабжение|n|The water supply was cut off.;
    waste disposal|утилизация отходов|n|Waste disposal is a big problem.;
    reduce your footprint|уменьшить свой (углеродный) след|o|Cycle to work to reduce your footprint.`],
   ]},
  extra:{A1:[
   ['na-animals-2','Animals 2','дикие животные и птицы',`
    pet|домашний питомец|n|Do you have a pet?;
    rabbit|кролик|n|The children have a rabbit.;
    lion|лев|n|The lion is the king of animals.;
    tiger|тигр|n|Tigers are orange and black.;
    elephant|слон|n|Elephants are very big.;
    monkey|обезьяна|n|The monkeys are funny.;
    bear|медведь|n|There are bears in the mountains.;
    snake|змея|n|I'm afraid of snakes.;
    giraffe|жираф|n|Giraffes have long necks.;
    frog|лягушка|n|There are frogs in the pond.;
    wolf|волк|n|Wolves live in the forest.|мн. ч. wolves;
    fox|лиса|n|I saw a fox in the garden.;
    owl|сова|n|Owls hunt at night.;
    eagle|орёл|n|An eagle flew over the mountains.`],
   ['na-world','Nature & the world','природа и мир',`
    sky|небо|n|The sky is blue today.;
    star|звезда|n|Look at the stars!;
    moon|луна|n|The moon is very big tonight.;
    world|мир|n|I want to travel around the world.;
    earth|земля, Земля|n|The Earth goes round the Sun.;
    sand|песок|n|The sand is very hot.;
    grass|трава|n|Don't walk on the grass.;
    stone|камень|n|The house is made of stone.;
    ice|лёд|n|There's ice on the road.;
    fire|огонь, пожар|n|Sit next to the fire.;
    air|воздух|n|The air is fresh in the mountains.;
    plant|растение|n|I have a lot of plants at home.`],
   ],
A2:[
   ['na2-weather-2','Weather 2','градусы и погода',`
    degrees|градусы|n|It's twenty degrees today.;
    minus|минус|o|It's minus five outside.;
    sunshine|солнечный свет|n|Enjoy the sunshine!;
    shower|кратковременный дождь|n|There will be showers in the afternoon.|ещё «душ»;
    wet|мокрый, дождливый|a|It's a wet day.;
    dry|сухой|a|The weather will be dry tomorrow.;
    foggy|туманный|a|It's foggy this morning.;
    icy|скользкий, обледенелый|a|The roads are icy.;
    stormy|штормовой|a|It was a stormy night.;
    humid|влажный|a|It's hot and humid in summer.;
    mild|мягкий (о погоде)|a|The winter was mild.;
    rainbow|радуга|n|Look, a rainbow!;
    cool|прохладный|a|It's cool in the evening.|ещё «классный» (разг.);
    weather forecast|прогноз погоды|n|Check the weather forecast.`],
   ['na2-birds','Birds & farm animals','птицы и животные',`
    pigeon|голубь|n|There are pigeons in the square.;
    sparrow|воробей|n|A sparrow is sitting on the fence.;
    crow|ворона|n|Crows are very clever birds.;
    swan|лебедь|n|Swans are swimming on the lake.;
    goose|гусь|n|A goose is chasing the children.|мн. ч. geese;
    seagull|чайка|n|Seagulls follow the boats.;
    parrot|попугай|n|Our parrot can talk.;
    hen|курица (птица)|n|The hens lay eggs every day.;
    goat|коза|n|We had goat's cheese.;
    donkey|осёл|n|The children rode a donkey.;
    squirrel|белка|n|A squirrel ran up the tree.;
    hedgehog|ёж|n|We found a hedgehog in the garden.;
    deer|олень|n|We saw deer in the forest.|мн. ч. тоже deer;
    bat|летучая мышь|n|Bats come out at night.|ещё «бита»`],
   ],
B1:[
   ['na3-landscape-2','Landscape B1','ландшафт',`
    stream|ручей|n|There's a stream in the forest.;
    pond|пруд|n|There are ducks on the pond.;
    cave|пещера|n|We explored a cave.;
    rock|скала, валун|n|Birds nest on the rocks.;
    peak|вершина|n|We reached the peak.;
    slope|склон|n|The ski slopes are busy.;
    shore|берег (моря, озера)|n|We walked along the shore.;
    bay|залив|n|The hotel overlooks the bay.;
    marsh|болото|n|Many birds live in the marsh.|также swamp;
    meadow|луг|n|Flowers grow in the meadow.;
    volcano|вулкан|n|Etna is an active volcano.;
    jungle|джунгли|n|Monkeys live in the jungle.;
    national park|национальный парк|n|We visited a national park.;
    scenery|пейзаж|n|The scenery was beautiful.`],
   ['na3-birds','Birds B1','птицы',`
    woodpecker|дятел|n|A woodpecker is tapping on the tree.;
    stork|аист|n|Storks nest on roofs in Poland.;
    heron|цапля|n|A heron was fishing in the river.;
    robin|малиновка|n|A robin is singing in the garden.;
    blackbird|чёрный дрозд|n|Blackbirds sing early in the morning.;
    swallow|ласточка|n|Swallows arrive in spring.;
    falcon|сокол|n|The falcon is the fastest bird.;
    hawk|ястреб|n|A hawk was circling above us.;
    cuckoo|кукушка|n|I heard a cuckoo in the forest.;
    magpie|сорока|n|Magpies like shiny things.;
    flock|стая|n|A flock of geese flew over.;
    lay eggs|откладывать яйца|o|The bird laid four eggs.;
    hatch|вылупляться|v|The chicks hatched yesterday.;
    chick|птенец|n|The chicks are hungry.`],
   ['na3-env-2','Environment 2','экология подробнее',`
    renewable energy|возобновляемая энергия|n|We need more renewable energy.;
    wind farm|ветряная электростанция|n|There's a wind farm by the sea.;
    carbon footprint|углеродный след|n|Flying increases your carbon footprint.;
    emissions|выбросы|n|Cars produce emissions.;
    fossil fuels|ископаемое топливо|n|Coal is a fossil fuel.;
    deforestation|вырубка лесов|n|Deforestation is a big problem.;
    extinct|вымерший|a|Dinosaurs are extinct.;
    habitat|среда обитания|n|The birds lost their habitat.;
    wildlife|дикая природа|n|Protect the wildlife.;
    reusable|многоразовый|a|Take a reusable bag.;
    throw away|выбрасывать|v|Don't throw away plastic bottles.;
    save water|экономить воду|o|Turn off the tap to save water.;
    litter|мусор (на улице)|n|Don't drop litter.;
    green|экологичный|a|We try to live a green life.`],
   ],
B2:[
   ['na4-birds','Birds B2','птицы подробнее',`
    birdwatching|наблюдение за птицами|n|Birdwatching is my passion.;
    binoculars|бинокль|n|Pass me the binoculars.;
    plumage|оперение|n|The male has bright plumage.;
    migration|миграция|n|Autumn migration starts in September.;
    breeding season|сезон размножения|n|Don't disturb birds in the breeding season.;
    ringing|кольцевание|n|Bird ringing helps scientists.|кольцевать — to ring;
    wingspan|размах крыльев|n|The eagle has a huge wingspan.;
    bird of prey|хищная птица|n|The buzzard is a bird of prey.;
    waterfowl|водоплавающие птицы|n|The lake is full of waterfowl.;
    songbird|певчая птица|n|The nightingale is a famous songbird.;
    perch|сидеть (на ветке)|v|A bird perched on the fence.;
    flap|махать (крыльями)|v|The bird flapped its wings.;
    soar|парить|v|An eagle soared over the valley.;
    roost|ночёвка, насест|n|Starlings gather at the roost.`],
   ['na4-weather-2','Weather B2 2','погода B2',`
    overcast|пасмурный|a|It's overcast today.;
    muggy|душный|a|It's hot and muggy.;
    scorching|палящий|a|It was a scorching day.;
    chilly|прохладный, зябкий|a|It's a bit chilly.;
    torrential rain|проливной дождь|n|Torrential rain caused floods.;
    downpour|ливень|n|We got caught in a downpour.;
    mist|дымка|n|There's mist over the lake.;
    gust|порыв ветра|n|A gust of wind blew my hat off.;
    sunny spells|солнечные прояснения|n|Sunny spells and showers.;
    cold snap|резкое похолодание|n|A cold snap is coming.;
    forecast|предсказывать (погоду)|v|Snow is forecast for tomorrow.;
    unpredictable|непредсказуемый|a|The weather is unpredictable.;
    hailstorm|град (буря)|n|A hailstorm damaged the crops.;
    frostbite|обморожение|n|He got frostbite on his toes.`],
   ['na4-plants','Plants & trees','растения и деревья',`
    oak|дуб|n|That oak is 300 years old.;
    pine|сосна|n|The forest is full of pines.;
    birch|берёза|n|Birches have white bark.;
    willow|ива|n|A willow grows by the river.;
    bark|кора|n|The bark is rough.;
    branch|ветка|n|A bird sat on the branch.;
    trunk|ствол|n|The tree has a thick trunk.;
    root|корень|n|The roots are deep.;
    leaf|лист|n|The leaves turn red in autumn.|мн. ч. leaves;
    seed|семя|n|Birds eat seeds.;
    bush|куст|n|A robin is in the bush.;
    moss|мох|n|Moss grows on the rocks.;
    bloom|цвести|v|The roses are blooming.;
    evergreen|вечнозелёный|a|Pines are evergreen.`],
   ['na4-sea','Sea & coast','море и побережье',`
    coastline|береговая линия|n|The coastline is very beautiful here.;
    wave|волна|n|The waves were huge.;
    current|течение|n|Don't swim here, the current is strong.;
    shallow|мелкий|a|The water is shallow near the beach.;
    coral reef|коралловый риф|n|We snorkelled over the coral reef.;
    seaweed|водоросли|n|The beach was covered in seaweed.;
    shell|ракушка|n|The kids collected shells.;
    lighthouse|маяк|n|There's an old lighthouse on the cliff.;
    harbour|гавань|n|The boats are in the harbour.;
    pier|пирс|n|We walked to the end of the pier.;
    rock pool|лужа между скал (в отлив)|n|We found crabs in the rock pools.;
    shipwreck|кораблекрушение, затонувший корабль|n|Divers explored the shipwreck.;
    low tide|отлив|n|At low tide you can walk to the island.;
    washed up|выброшенный на берег|a|A dead whale was washed up on the beach.`],
   ]}},

 {key:'basics', name:'Small words', ru:'Служебные слова и фразы', color:'#b3401f',
  info:'Без этих слов не собрать ни одного предложения: вопросы, союзы, вежливые фразы.',
  cells:{A1:[
   ['ba-social','Social phrases','приветствия и вежливость',`
    Hello / Hi|Привет, здравствуйте|o|Hi, I'm Demid. Nice to meet you.;
    Goodbye|До свидания|o|Goodbye! See you tomorrow.;
    Good morning|Доброе утро|o|Good morning! How are you?;
    Good night|Спокойной ночи|o|Good night. Sleep well.;
    How are you?|Как дела?|o|Hi, Tom! How are you?;
    I'm fine, thanks.|Хорошо, спасибо.|o|I'm fine, thanks. And you?;
    Nice to meet you.|Приятно познакомиться.|o|Nice to meet you too.;
    please|пожалуйста (просьба)|o|A coffee, please.;
    Thank you|Спасибо|o|Thank you very much!;
    Sorry|Извините (вина)|o|Sorry, I'm late.;
    Excuse me|Извините (обращение)|o|Excuse me, is this seat free?;
    You're welcome.|Пожалуйста, не за что (в ответ на спасибо)|o|Thank you! — You're welcome.;
    See you later.|Увидимся (прощаясь до скорой встречи)|o|Bye! See you later.`],
   ['ba-questions','Question words','вопросительные слова',`
    what|что, какой|o|What's your name?;
    where|где, куда|o|Where do you live?;
    when|когда|o|When is your birthday?;
    who|кто|o|Who is that woman?;
    why|почему|o|Why are you sad?;
    how|как|o|How do you get to work?;
    how old|сколько лет|o|How old are you?;
    how much|сколько (неисчисл.)|o|How much is this?;
    how many|сколько (исчисл.)|o|How many children do you have?;
    which|который, какой (из нескольких)|o|Which bus goes to the centre?;
    what time|во сколько|o|What time do you get up?;
    whose|чей|o|Whose bag is this?`],
   ['ba-linkers','Little words','союзы и частицы',`
    and|и|o|I like tea and coffee.;
    but|но|o|It's small but nice.;
    or|или|o|Tea or coffee?;
    because|потому что|o|I'm tired because I work a lot.;
    so|поэтому|o|It's raining, so we're at home.;
    very|очень|o|It's very cold today.;
    too|тоже, слишком|o|I like it too.;
    also|также|o|She also speaks German.;
    here|здесь|o|Come here!;
    there|там|o|Look! There's a bird over there.;
    now|сейчас|o|I'm busy now.;
    a lot of|много|o|I have a lot of work.;
    some|несколько, немного|o|I need some eggs.;
    any|какой-нибудь (в вопросах)|o|Do you have any questions?`],
   ],
A2:[
   ['ba2-linkers','Linkers','связки в рассказе',`
    although|хотя|o|Although it was cold, we went out.;
    however|однако|o|It's cheap. However, it's not very good.|в начале предложения, после — запятая;
    then|затем, потом|o|First wash your hands, then eat.;
    after that|после этого|o|We had dinner. After that, we watched a film.;
    finally|наконец, в конце|o|Finally, we arrived home.;
    first|сначала, во-первых (по порядку)|o|First, open the box.|также first of all;
    as|так как|o|As it was late, we took a taxi.;
    if|если|o|If it rains, we'll stay at home.;
    for example|например|o|I like sports, for example tennis.|сокращение e.g.;
    instead|вместо этого|o|I didn't take the bus. I walked instead.|вместо чего-то — instead of;
    anyway|всё равно, в любом случае|o|It's expensive, but I'll buy it anyway.;
    suddenly|вдруг|o|Suddenly, the lights went out.;
    actually|на самом деле|o|Actually, I'm from Poland.|не «актуально»! актуальный — current;
    luckily|к счастью|o|Luckily, nobody was hurt.`],
   ['ba2-movement','Prepositions of movement','куда движемся',`
    into|в (внутрь)|o|She went into the shop.;
    out of|из (наружу)|o|He ran out of the house.;
    across|через, на другую сторону|o|We swam across the river.;
    through|сквозь, через|o|The train goes through a tunnel.;
    past|мимо|o|Go past the church.;
    along|вдоль|o|We walked along the beach.;
    up|вверх|o|Walk up the hill.;
    down|вниз|o|Go down the stairs.;
    over|через (поверх)|o|The dog jumped over the fence.;
    around|вокруг|o|We walked around the lake.;
    towards|по направлению к|o|He walked towards me.|амер. toward;
    onto|на (на поверхность)|o|The cat jumped onto the table.;
    off|с (поверхности)|o|The book fell off the shelf.;
    back|обратно|o|Come back here!`],
   ],
B1:[
   ['ba3-discourse','Discourse markers','слова для живой речи',`
    by the way|кстати|o|By the way, did you call Tom?;
    anyway|в общем, так вот|o|Anyway, let's get back to work.|ещё «всё равно» — см. A2;
    in fact|на самом деле, фактически|o|In fact, I've never been there.;
    basically|в общем, по сути|o|Basically, it's a good idea.;
    obviously|очевидно, конечно|o|Obviously, I was angry.;
    apparently|судя по всему, говорят|o|Apparently, it's going to rain.;
    of course|конечно (само собой)|o|Of course you can come.;
    to be honest|честно говоря|o|To be honest, I didn't like it.;
    in my opinion|по-моему|o|In my opinion, it's too expensive.|не in my mind;
    on the other hand|с другой стороны|o|It's cheap. On the other hand, it's far.;
    at least|по крайней мере|o|At least it didn't rain.;
    as far as I know|насколько я знаю|o|As far as I know, he's still in Poland.;
    I mean|то есть, я имею в виду|o|It's nice. I mean, it's not perfect.`],
   ['ba3-linkers-2','Linkers B1','связки',`
    also|также|o|She's also a teacher.;
    as well|тоже|o|I'd like a coffee as well.|в конце фразы;
    besides|кроме того|o|Besides, it's too expensive.;
    otherwise|иначе|o|Hurry, otherwise we'll be late.;
    unless|если не|o|I won't go unless you come.;
    as soon as|как только|o|Call me as soon as you arrive.;
    in case|на случай если|o|Take an umbrella in case it rains.;
    whether|ли|o|I don't know whether he's coming.;
    because of|из-за|o|We stayed at home because of the rain.;
    so that|чтобы|o|Speak slowly so that everyone understands.;
    such as|такие как|o|I like sports such as tennis.;
    firstly|во-первых|o|Firstly, let me say thank you.;
    in addition|вдобавок|o|In addition, we offer free parking.;
    on the one hand|с одной стороны|o|On the one hand, it's cheap.`],
   ['ba3-verbprep','Verbs + prepositions','глагол + предлог',`
    wait for|ждать (кого-то)|v|I'm waiting for the bus.;
    belong to|принадлежать|v|This bag belongs to Anna.;
    ask for|просить (что-то)|v|He asked for the bill.;
    agree with|соглашаться с|v|I agree with you.;
    laugh at|смеяться над|v|Don't laugh at me!;
    believe in|верить в|v|Do you believe in ghosts?;
    care about|заботиться о, волноваться за|v|She really cares about animals.;
    dream of|мечтать о|v|I dream of living by the sea.;
    think of|думать о, придумать|v|What do you think of this idea?;
    succeed in|преуспеть в|v|She succeeded in passing the exam.;
    consist of|состоять из|v|The team consists of five people.;
    look at|смотреть на|v|Look at this photo!;
    argue about|спорить о|v|They always argue about money.;
    apologise for|извиняться за|v|I apologise for being late.`],
   ],
B2:[
   ['ba4-wordbuilding','Word building','одно слово — разные формы',`
    success|успех|n|The party was a big success.|глагол — succeed;
    successful|успешный|a|He's a successful writer.;
    decision|решение|n|It was a difficult decision.|глагол — decide;
    choice|выбор|n|You have no choice.|глагол — choose;
    knowledge|знания|n|His knowledge of history is amazing.|глагол — know, неисчисл.;
    growth|рост|n|The growth of the city was very fast.|глагол — grow;
    behaviour|поведение|n|His behaviour was terrible.|глагол — behave, амер. behavior;
    advice|совет|n|Can you give me some advice?|глагол — advise (c→s), неисчисл.;
    belief|убеждение, вера|n|It's my personal belief.|глагол — believe;
    width|ширина|n|What's the width of the table?|прилагательное — wide;
    length|длина|n|The length of the river is 1,000 km.|прилагательное — long;
    height|высота, рост|n|What's your height?|прилагательное — high;
    strength|сила|n|You need strength for this job.|прилагательное — strong;
    improvement|улучшение|n|There's a big improvement in your English.|глагол — improve`],
   ['ba4-contrast','Linkers of contrast & purpose','despite, whereas, so that',`
    despite|несмотря на|o|Despite the rain, we went out.|+ существительное или -ing;
    in spite of|несмотря на|o|In spite of being tired, he kept working.;
    even though|хотя, даже несмотря на то что|o|Even though it was late, she called me.;
    whereas|тогда как|o|I love tea, whereas my wife prefers coffee.;
    nevertheless|тем не менее|o|It was hard. Nevertheless, we finished.;
    so that|чтобы|o|I left early so that I wouldn't be late.;
    in order to|для того чтобы|o|I study in order to pass the exam.|отрицание — in order not to;
    so as to|чтобы (книжн.)|o|We spoke quietly so as not to wake the baby.;
    therefore|поэтому, следовательно|o|He was ill. Therefore, he stayed at home.;
    as a result|в результате|o|It rained. As a result, the match was cancelled.;
    due to|из-за (книжн., по причине)|o|The flight was delayed due to fog.|также because of;
    on the contrary|напротив|o|It wasn't boring. On the contrary, it was great.;
    moreover|более того|o|It's cheap. Moreover, it's very good.|в речи чаще what's more`],
   ['ba4-linkers-2','Linkers B2 2','связки для письма',`
    furthermore|более того, кроме того (книжн.)|o|Furthermore, it's cheaper.;
    consequently|следовательно|o|He was late. Consequently, he missed the train.;
    thus|таким образом|o|Thus, we need a new plan.;
    hence|отсюда, поэтому|o|It's handmade, hence the high price.;
    whilst|в то время как (брит., книжн.)|o|Whilst I agree, I have doubts.|брит., = while;
    albeit|хотя и|o|It was a success, albeit a small one.;
    provided that|при условии что|o|You can go, provided that you're back by ten.;
    as long as|пока, при условии|o|As long as you're happy, I'm happy.;
    in terms of|с точки зрения|o|In terms of price, it's the best.;
    regarding|относительно|o|I'm writing regarding your order.;
    in contrast|напротив, в отличие|o|In contrast, the north is cold.;
    to sum up|подводя итог|o|To sum up, it was a great year.;
    all in all|в целом|o|All in all, it was a good trip.;
    having said that|тем не менее|o|It's expensive. Having said that, it's worth it.`],
   ['ba4-phrases','Conversation phrases B2','фразы для беседы',`
    That's a good point.|Хорошее замечание.|o|That's a good point, I didn't think of that.;
    I see what you mean.|Понимаю, о чём ты.|o|I see what you mean, but I disagree.;
    I couldn't agree more.|Полностью согласен.|o|It's too expensive. — I couldn't agree more.;
    I'm not so sure about that.|Я в этом не очень уверен (вежливое несогласие)|o|I'm not so sure about that.;
    It's not my cup of tea.|Это не моё.|o|Jazz isn't my cup of tea.;
    Let me think.|Дай подумать.|o|Hmm, let me think.;
    What do you reckon?|Как думаешь?|o|What do you reckon, will it rain?|брит. разг.;
    As far as I'm concerned|что касается меня|o|As far as I'm concerned, it's fine.;
    To be fair|справедливости ради|o|To be fair, he did try.;
    That's beside the point.|Это к делу не относится.|o|That's beside the point.;
    It's worth a try.|Стоит попробовать.|o|It's worth a try.;
    Correct me if I'm wrong.|Поправь, если ошибаюсь.|o|Correct me if I'm wrong, but…;
    Believe it or not|хочешь верь, хочешь нет|o|Believe it or not, I've never been to London.;
    The thing is…|Дело в том, что…|o|The thing is, I don't have time.`],
   ['ba4-opinion','Giving your opinion B2','выражение мнения',`
    from my point of view|с моей точки зрения|o|From my point of view, it's a mistake.;
    it seems to me|мне кажется|o|It seems to me that he's right.;
    I'm convinced that|я убеждён, что|o|I'm convinced that we'll win.;
    I tend to think|я склонен думать|o|I tend to think it's too expensive.;
    there's no doubt that|нет сомнений, что|o|There's no doubt that she's talented.;
    be in favour of|быть за|o|I'm in favour of the new law.;
    be against|быть против|o|Most people are against the plan.;
    on balance|в целом, взвесив всё|o|On balance, I think we should go.;
    it's widely believed|широко распространено мнение|o|It's widely believed that coffee is bad for you.;
    it could be argued|можно утверждать|o|It could be argued that prices are too high.;
    I'd go along with that|я с этим соглашусь|o|I'd go along with that.;
    I take your point|я понимаю вашу мысль|o|I take your point, but I still disagree.;
    that's debatable|это спорно|o|That's debatable.;
    I beg to differ|позволю себе не согласиться|o|I beg to differ — it was a great film.`],
   ]},
  extra:{A1:[
   ['ba-phrases','Useful phrases','короткие реакции',`
    Let's…|Давай…|o|Let's go!;
    I don't know.|Я не знаю.|o|Where is it? — I don't know.;
    I think so.|Думаю, да.|o|Is it open? — I think so.;
    Me too.|Я тоже.|o|I'm hungry. — Me too.;
    Really?|Правда?|o|I'm getting married! — Really?;
    No problem.|Без проблем.|o|Can you help me? — No problem.;
    Good luck!|Удачи!|o|Good luck with your exam!;
    Have a nice day!|Хорошего дня!|o|Thanks! Have a nice day!;
    Happy birthday!|С днём рождения!|o|Happy birthday, Anna!;
    Well done!|Молодец!|o|You passed? Well done!;
    Wait a minute.|Подожди минутку.|o|Wait a minute, I'm coming.;
    Here you go.|Вот, держи (протягивая что-то, разг.)|o|Can I have the salt? — Here you go.;
    What's wrong?|Что случилось?|o|You look sad. What's wrong?;
    Never mind.|Ничего страшного, забудь (в ответ на извинение)|o|Sorry, I forgot. — Never mind.`],
   ['ba-pronouns','This, that & something','указательные и неопределённые слова',`
    this|этот, это (рядом)|o|This is my brother.;
    that|тот, то (далеко)|o|Who is that man?;
    these|эти (рядом)|o|These shoes are new.;
    those|те (далеко)|o|Look at those birds!;
    something|что-то|o|I want something to eat.;
    nothing|ничего|o|There's nothing in the fridge.;
    everything|всё|o|Everything is fine.;
    someone|кто-то|o|Someone is at the door.;
    everyone|все (люди)|o|Everyone is here.;
    nobody|никто|o|Nobody knows his name.;
    other|другой|a|Where is the other shoe?;
    another|ещё один, другой|o|Can I have another coffee?;
    only|только|o|I have only one sister.`],
   ],
A2:[
   ['ba2-quant','Quantities & little words','both, each, enough',`
    both|оба|o|Both my sisters live in London.;
    either|любой из двух|o|You can take either bus.;
    neither|ни один из двух|o|Neither answer is right.;
    each|каждый (по отдельности)|o|Each room has a TV.;
    every|каждый|o|I run every day.;
    all|все, весь|o|All the students passed.;
    none|никто, ни один|o|None of my friends came.;
    most|большинство|o|Most people like music.;
    several|несколько (больше двух-трёх)|o|I've been there several times.;
    enough|достаточно|o|We don't have enough time.;
    too much|слишком много (неисчисл.)|o|I ate too much.;
    too many|слишком много (исчисл.)|o|There are too many people here.;
    a bit|немного|o|I'm a bit tired.;
    quite|довольно|o|The film was quite good.`],
   ['ba2-place','Prepositions of place 2','где именно',`
    inside|внутри|o|Let's wait inside.;
    outside|снаружи|o|The children are playing outside.;
    beside|рядом с, возле|o|Sit beside me.;
    below|ниже, под|o|The temperature is below zero.;
    at the top of|наверху (чего-то)|o|The castle is at the top of the hill.;
    at the bottom of|внизу (чего-то)|o|Sign at the bottom of the page.;
    on the left|слева|o|The bank is on the left.;
    on the right|справа|o|It's the second door on the right.;
    in the corner|в углу|o|There's a lamp in the corner.;
    in the middle|посередине|o|The table is in the middle of the room.;
    next door|по соседству|o|My friend lives next door.;
    far from|далеко от|o|My house is far from the centre.;
    close to|близко к|o|The hotel is close to the beach.;
    at home|дома|o|I'm at home today.`],
   ['ba2-phrases','Useful phrases A2','полезные фразы',`
    How about …?|Как насчёт …?|o|How about going to the cinema?;
    Why don't we …?|Почему бы нам не …?|o|Why don't we have a pizza?;
    What about you?|А ты?|o|I'm from Poland. What about you?;
    I'd love to.|С удовольствием.|o|Do you want to come? — I'd love to.;
    I'm afraid I can't.|Боюсь, я не могу (вежливый отказ)|o|I'm afraid I can't come tonight.;
    Don't worry.|Не волнуйся.|o|Don't worry, it's OK.;
    Sure.|Конечно (разг., соглашаясь)|o|Can you help me? — Sure.;
    Not really.|Не особо.|o|Are you hungry? — Not really.;
    I hope so.|Надеюсь, что да.|o|Will it be sunny? — I hope so.;
    I don't think so.|Не думаю.|o|Is he coming? — I don't think so.;
    What a shame!|Как жаль! (разг., частое)|o|You can't come? What a shame!;
    That's a good idea.|Хорошая идея.|o|Let's walk. — That's a good idea.;
    Help yourself.|Угощайтесь.|o|There's coffee in the kitchen. Help yourself.`],
   ],
B1:[
   ['ba3-phrases-2','Useful phrases B1','разговорные фразы',`
    It depends.|Зависит от обстоятельств.|o|Do you like it? — It depends.;
    It doesn't matter.|Неважно, это не имеет значения|o|Sorry I'm late. — It doesn't matter.;
    I'm not sure.|Я не уверен.|o|I'm not sure about that.;
    What a pity!|Какая жалость!|o|You can't come? What a pity!;
    Fair enough.|Справедливо, логично (соглашаясь)|o|I'm tired, I'll stay in. — Fair enough.;
    No way!|Ни за что! Не может быть!|o|He won the lottery? No way!;
    Go ahead.|Давай, конечно (разрешая что-то сделать)|o|Can I use your phone? — Go ahead.;
    It's up to you.|Решай сам.|o|Pizza or pasta? It's up to you.;
    I'd rather…|Я бы предпочёл…|o|I'd rather stay at home.;
    Don't mention it.|Не стоит благодарности|o|Thanks! — Don't mention it.;
    Make yourself at home.|Будь как дома.|o|Come in, make yourself at home.;
    Sounds good.|Звучит здорово, годится (соглашаясь)|o|Let's meet at six. — Sounds good.;
    Take it easy.|Не напрягайся, успокойся|o|Take it easy, it's not important.;
    Guess what!|Знаешь что? Представляешь! (перед новостью)|o|Guess what! I got the job!`],
   ['ba3-adverbs','Adverbs B1','наречия',`
    especially|особенно|o|I love fruit, especially apples.;
    probably|вероятно|o|It will probably rain.;
    definitely|определённо|o|I'll definitely come.;
    certainly|конечно, несомненно|o|I'll certainly help.;
    hardly|едва|o|I can hardly hear you.;
    nearly|почти, чуть не|o|I nearly missed the bus.;
    almost|почти|o|It's almost ready.;
    exactly|точно|o|That's exactly right.;
    completely|полностью|o|I completely forgot.;
    quite|довольно|o|It's quite cold today.;
    rather|довольно, скорее|o|It's rather expensive.;
    fairly|довольно, достаточно (умеренно)|o|I'm fairly sure.;
    extremely|крайне|o|It's extremely important.;
    slightly|слегка|o|I'm slightly tired.`],
   ],
B2:[
   ['ba4-adverbs','Adverbs B2','наречия B2',`
    arguably|пожалуй|o|It's arguably the best film ever.;
    presumably|предположительно|o|Presumably, he's forgotten.;
    hopefully|надеюсь|o|Hopefully it won't rain.;
    surprisingly|удивительно|o|Surprisingly, it was cheap.;
    unfortunately|к сожалению|o|Unfortunately, I can't come.;
    fortunately|к счастью|o|Fortunately, nobody was hurt.;
    gradually|постепенно|o|My English is gradually improving.;
    eventually|в конце концов|o|Eventually, we agreed.;
    deliberately|намеренно|o|He did it deliberately.;
    accidentally|случайно|o|I accidentally deleted the file.;
    thoroughly|тщательно|o|Read the contract thoroughly.;
    barely|едва|o|I could barely see.;
    merely|лишь|o|It was merely a joke.;
    seemingly|по-видимому, судя по всему|o|The task is seemingly simple.`],
   ['ba4-wordbuilding-2','Word building 2','ещё словообразование',`
    agreement|соглашение|n|We reached an agreement.|глагол — agree;
    arrival|прибытие|n|Arrival time is ten.|глагол — arrive;
    departure|отправление|n|Departure is at six.|глагол — depart;
    failure|неудача|n|The plan was a failure.|глагол — fail;
    pleasure|удовольствие|n|It's a pleasure to meet you.|глагол — please;
    loss|потеря|n|It was a big loss.|глагол — lose;
    safety|безопасность|n|Safety first!|прилагательное — safe;
    freedom|свобода|n|We value freedom.|прилагательное — free;
    truth|правда|n|Tell me the truth.|прилагательное — true;
    depth|глубина|n|The depth of the lake is ten metres.|прилагательное — deep;
    warmth|тепло|n|I felt the warmth of the sun.|прилагательное — warm;
    creative|творческий|a|She's very creative.|глагол — create;
    attractive|привлекательный|a|It's an attractive offer.|глагол — attract;
    dependable|надёжный (на кого можно положиться)|a|He's very dependable.|глагол — depend`],
   ['ba4-quantifiers','Quantifiers B2','количество B2',`
    a great deal of|очень много (неисчисл.)|o|It takes a great deal of time.;
    a large number of|большое количество (исчисл.)|o|A large number of people came.;
    plenty of|полно|o|We have plenty of time.;
    hardly any|почти нет|o|There's hardly any milk left.;
    a handful of|горстка|o|Only a handful of people came.;
    the vast majority|подавляющее большинство|o|The vast majority agreed.;
    a fraction of|доля|o|It costs a fraction of the price.;
    loads of|куча (разг.)|o|I have loads of work.;
    a wide range of|широкий выбор|o|They sell a wide range of products.;
    a bit of|немного|o|I need a bit of help.;
    neither of|ни один из|o|Neither of them came.;
    either of|любой из (двух)|o|Either of the rooms is fine.;
    the whole|весь, целый|o|I ate the whole cake.;
    numerous|многочисленный|a|I've been there numerous times.`],
   ['ba4-formal','Formal & informal','формально и разговорно',`
    purchase|покупать (формально)|v|You can purchase tickets online.|разговорно — buy;
    request|просить (формально)|v|Guests are requested to leave by noon.|разговорно — ask;
    inform|сообщать (офиц.)|v|Please inform us of any changes.|разговорно — tell;
    assist|помогать (офиц.)|v|Can I assist you?|разговорно — help;
    commence|начинаться (офиц.)|v|The ceremony will commence at noon.|разговорно — start;
    sufficient|достаточный (офиц.)|a|We have sufficient funds.|разговорно — enough;
    reside|проживать (офиц.)|v|He resides in Kraków.|разговорно — live;
    enquire|наводить справки (офиц.)|v|I'm writing to enquire about the job.|разговорно — ask;
    kid|ребёнок (разг.)|n|How are the kids?|формально — child;
    guy|парень (разг.)|n|He's a nice guy.|формально — man;
    stuff|вещи, штуки (разг.)|n|Put your stuff in the car.|формально — belongings;
    gonna|собираюсь (разг.)|o|I'm gonna call him.|= going to, только в речи;
    wanna|хочу (разг.)|o|Do you wanna come?|= want to, только в речи;
    cheers|спасибо, пока (брит. разг.)|o|Cheers, mate!`],
   ]}}

];
// notes: other translations / usage context shown on the back of a card. key "cardId|english"
const NOTES = {
 'pe-family|mother':'разг. mum (брит.), mom (амер.)',
 'pe-family|father':'разг. dad',
 'pe-family|children':'ед. ч. child; разг. kids',
 'pe-family|baby':'младенец; ребёнок постарше — toddler, kid',
 'pe-family|grandmother':'разг. grandma, granny',
 'pe-family|grandfather':'разг. grandpa, grandad',
 'pe-info|first name':'также name; в анкетах — forename, given name',
 'pe-info|surname':'также last name (амер.), family name',
 'pe-info|phone number':'также mobile number (брит.), cell number (амер.)',
 'pe-info|email':'также email address',
 'pe-info|live':'жить постоянно; пожить временно — stay',
 'pe-countries|Polish':'национальности и языки пишутся с большой буквы: Polish, Russian',
 'pe-countries|England':'только Англия; вся страна — the UK или Britain',
 'pe-countries|British':'English — только про Англию и язык',
 'pe-countries|the USA':'также the US, America, the States',
 'de-common|big':'также large (формальнее, размер одежды L)',
 'de-common|small':'также little (с оттенком чувства: a little house)',
 'de-common|old':'о пожилых людях вежливее — elderly',
 'de-common|long':'только длина и время; высокий человек — tall',
 'de-common|short':'короткий и низкий (о человеке); низкий стол, цена — low',
 'de-common|tall':'люди, деревья, здания; высокая гора, цена — high',
 'de-common|beautiful':'также pretty (миловидная), handsome (о мужчине)',
 'de-common|easy':'также simple',
 'de-common|difficult':'также hard (чаще в речи)',
 'de-colours|blue':'и синий, и голубой; голубой точнее — light blue',
 'de-colours|grey':'амер. gray',
 'de-colours|purple':'сиреневый — lilac, фиолетовый (цветок) — violet',
 'de-colours|light':'светлые волосы — fair или blond hair',
 'de-colours|colour':'амер. color',
 'de-feel|happy':'рад — также glad (после be: I\'m glad)',
 'de-feel|sad':'также unhappy; расстроен — upset',
 'de-feel|angry':'разг. cross (брит.), mad (амер.)',
 'de-feel|worried':'волнуюсь перед событием — nervous',
 'de-feel|fine':'также OK, all right',
 'de-feel|excited':'радостное волнение; от страха — nervous',
 'ti-numbers|a hundred':'также one hundred',
 'ti-numbers|a thousand':'также one thousand',
 'ti-numbers|second':'второй; ещё значит «секунда»',
 'ti-days|afternoon':'примерно с 12 до 17; после — evening',
 'ti-days|night':'Good night — только прощание перед сном',
 'ti-months|autumn':'амер. fall',
 'ti-clock|What time is it?':'также What\'s the time? (брит.)',
 'ti-clock|half past two':'также two thirty',
 'ti-clock|late':'поздно и опоздавший (I\'m late); позже — later',
 'ti-prep|at the weekend':'амер. on the weekend',
 'da-routine|get up':'встать с кровати; проснуться — wake up',
 'da-routine|wake up':'проснуться; встать с кровати — get up',
 'da-routine|cook dinner':'также make dinner',
 'da-routine|watch TV':'смотреть ТВ, фильм — watch; смотреть на — look at',
 'da-routine|start':'также begin (формальнее)',
 'da-routine|finish':'также end (о событии: The film ends at ten)',
 'da-verbs|go':'пешком — walk, на машине — drive',
 'da-verbs|love':'также «очень нравится»: I love pizza',
 'da-verbs|speak':'разговаривать — talk, сказать — say, рассказать — tell',
 'da-verbs|study':'учиться (в школе, вузе); узнавать новое — learn',
 'da-verbs|listen':'всегда listen to + что/кого',
 'da-verbs|play':'игры и спорт — play football; инструмент — play the guitar',
 'da-verbs|see':'видеть; смотреть — watch, look at',
 'da-phrases|make a mistake':'не do a mistake',
 'da-phrases|take a photo':'также take a picture',
 'ho-rooms|house':'дом-здание; дом как место, где живёшь — home (at home)',
 'ho-rooms|flat':'амер. apartment',
 'ho-rooms|living room':'также lounge, sitting room (брит.)',
 'ho-rooms|garden':'амер. yard (двор)',
 'ho-rooms|stairs':'лестница в доме; приставная — ladder',
 'ho-rooms|floor':'и пол, и этаж; первый этаж в Англии — ground floor',
 'ho-things|table':'письменный стол — desk',
 'ho-things|chair':'кресло — armchair',
 'ho-things|sofa':'также couch',
 'ho-things|bath':'амер. bathtub',
 'ho-things|fridge':'полностью refrigerator',
 'ho-things|cooker':'амер. stove; духовка — oven. Повар — cook!',
 'ho-things|lamp':'лампочка — light bulb',
 'ho-things|shelf':'мн. ч. shelves',
 'ho-things|cupboard':'для одежды — wardrobe',
 'ho-things|wardrobe':'амер. closet',
 'ho-prep|opposite':'амер. across from',
 'ho-prep|in front of':'перед чем-то; через дорогу напротив — opposite',
 'ho-prep|near':'также close to',
 'ho-prep|above':'прямо над — также over',
 'fo-food|bread':'неисчисл.: some bread, a loaf of bread',
 'fo-food|butter':'растительное масло — oil',
 'fo-food|meat':'говядина — beef, свинина — pork',
 'fo-food|chicken':'и птица, и курятина',
 'fo-food|fish':'мн. ч. тоже fish',
 'fo-food|pasta':'любые макароны; спагетти — spaghetti',
 'fo-food|potatoes':'ед. ч. potato; картошка фри — chips (брит.), fries (амер.)',
 'fo-food|vegetables':'разг. veg, veggies',
 'fo-food|fruit':'обычно неисчисл.: some fruit',
 'fo-drinks|lunch':'дневной приём пищи',
 'fo-drinks|dinner':'поздний ужин — также supper; в Англии иногда tea',
 'fo-drinks|a cup of':'кружка — a mug of',
 'fo-drinks|a glass of':'и стакан, и бокал',
 'fo-drinks|eat':'о приёмах пищи чаще have: have lunch',
 'fo-drinks|drink':'в речи часто have: have a coffee',
 'fo-cafe|bill':'амер. check',
 'fo-cafe|waiter':'официантка — waitress; нейтрально — server (амер.)',
 'fo-cafe|Can I have …?':'вежливее — Could I have …?',
 'fo-cafe|I\'d like …':'вежливее, чем I want',
 'fo-cafe|take away':'амер. to go',
 'fo-cafe|cake':'печенье — biscuit (брит.), cookie (амер.)',
 'to-places|street':'также road (часто в адресах)',
 'to-places|station':'ж/д вокзал — train station, автовокзал — bus station',
 'to-places|bank':'ещё «берег реки»',
 'to-places|shop':'амер. store',
 'to-places|chemist\'s':'также pharmacy, амер. drugstore',
 'to-places|cinema':'амер. movie theater',
 'to-transport|taxi':'также cab',
 'to-transport|bike':'полностью bicycle; мотоцикл — motorbike',
 'to-transport|plane':'также aeroplane (брит.), airplane (амер.)',
 'to-transport|underground':'в Лондоне the Tube, в США subway; также metro',
 'to-transport|on foot':'не by foot',
 'to-transport|get on':'автобус, поезд; в машину, такси — get in',
 'to-transport|get off':'автобус, поезд; из машины, такси — get out',
 'to-directions|go straight on':'амер. go straight ahead',
 'to-directions|far':'в утверждениях чаще a long way',
 'sh-clothes|shirt':'блузка — blouse',
 'sh-clothes|trousers':'амер. pants (в Англии pants — трусы!)',
 'sh-clothes|jacket':'и куртка, и пиджак',
 'sh-clothes|jumper':'также sweater, pullover',
 'sh-clothes|trainers':'амер. sneakers',
 'sh-clothes|hat':'кепка — cap',
 'sh-clothes|bag':'рюкзак — backpack; дамская сумочка — handbag (амер. purse)',
 'sh-clothes|wear':'носить, быть одетым; надеть — put on',
 'sh-shop|buy':'разг. get (I got it at Lidl)',
 'sh-shop|pay':'заплатить за — pay for',
 'sh-shop|card':'полностью bank card, credit card',
 'wo-jobs|cook':'в ресторане — также chef. Плита — cooker!',
 'wo-jobs|lawyer':'также solicitor (брит.), attorney (амер.)',
 'wo-jobs|shop assistant':'амер. salesperson, sales clerk',
 'wo-jobs|police officer':'также policeman, policewoman',
 'wo-jobs|programmer':'также developer, software engineer',
 'wo-jobs|job':'должность; работа как занятие — work (неисчисл.)',
 'wo-work|company':'также firm',
 'wo-work|colleague':'также coworker',
 'wo-work|student':'школьник — pupil (брит.)',
 'wo-work|university':'разг. uni (брит.); в США часто college',
 'wo-work|lesson':'также class',
 'wo-work|homework':'неисчисл.: не homeworks',
 'wo-work|exam':'небольшая проверка — test',
 'wo-work|learn':'узнавать, выучить; учиться в школе, вузе — study',
 'wo-class|notebook':'школьная тетрадь — также exercise book; ноутбук — laptop',
 'fr-hobbies|free time':'также spare time',
 'fr-hobbies|play football':'амер. soccer',
 'fr-hobbies|go running':'также run; бегать трусцой — jog',
 'fr-hobbies|watch films':'амер. movies',
 'fr-hobbies|go for a walk':'также walk, take a walk',
 'fr-hobbies|paint':'красками; карандашом, ручкой — draw',
 'fr-hobbies|draw':'карандашом, ручкой; красками — paint',
 'fr-holiday|holiday':'амер. vacation; ещё «праздник»',
 'fr-holiday|trip':'дорога, переезд — journey',
 'fr-holiday|city':'небольшой город — town',
 'fr-holiday|travel':'путешествовать вообще; конкретная поездка — trip',
 'fr-holiday|stay at a hotel':'также stay in a hotel',
 'fr-holiday|book':'также reserve',
 'bo-body|hand':'кисть; вся рука — arm',
 'bo-body|arm':'от плеча до кисти; кисть — hand',
 'bo-body|leg':'нога целиком; стопа — foot',
 'bo-body|finger':'палец ноги — toe, большой палец руки — thumb',
 'bo-body|hair':'неисчисл.: her hair is long',
 'bo-body|stomach':'разг. tummy, belly',
 'bo-health|ill':'амер. чаще sick',
 'bo-health|a temperature':'также a fever',
 'bo-health|medicine':'таблетка — pill, tablet',
 'bo-health|It hurts.':'также My … hurts, I have a pain in …',
 'bo-health|I feel sick.':'брит. «тошнит»; в США sick часто значит «болен»',
 'bo-health|see a doctor':'также go to the doctor',
 'na-weather|rain':'идёт дождь — it\'s raining (глагол rain)',
 'na-weather|snow':'идёт снег — it\'s snowing',
 'na-weather|hot':'жарко; просто тепло — warm',
 'na-weather|cold':'ещё «простуда»: a cold',
 'na-animals|dog':'щенок — puppy',
 'na-animals|cat':'котёнок — kitten',
 'na-animals|cow':'бык — bull',
 'na-animals|sheep':'мн. ч. тоже sheep',
 'na-animals|mouse':'мн. ч. mice',
 'na-animals|forest':'небольшой лес, роща — wood(s)',
 'na-animals|field':'луг — meadow',
 'ba-social|Hello / Hi':'Hi — неформально',
 'ba-social|Goodbye':'разг. Bye, See you',
 'ba-social|Good night':'только прощание на ночь; добрый вечер — Good evening',
 'ba-social|How are you?':'разг. How\'s it going?',
 'ba-social|I\'m fine, thanks.':'также Good, thanks. / Not bad.',
 'ba-social|Nice to meet you.':'также Pleased to meet you.',
 'ba-social|Thank you':'разг. Thanks, Cheers (брит.)',
 'ba-social|Sorry':'чтобы обратиться к кому-то — Excuse me',
 'ba-social|Excuse me':'извиниться за ошибку — Sorry',
 'ba-social|You\'re welcome.':'также No problem.',
 'ba-social|See you later.':'также See you soon.',
 'ba-questions|which':'выбор из нескольких вариантов; вообще — what',
 'ba-linkers|too':'«тоже» — в конце фразы; «слишком» — перед прилагательным: too hot',
 'ba-linkers|also':'обычно перед глаголом; в конце фразы — too',
 'ba-linkers|so':'ещё «так, настолько»: so good',
 'ba-linkers|a lot of':'также lots of; much / many — в вопросах и отрицаниях',
 'ba-linkers|some':'в утверждениях; в вопросах и отрицаниях — any',
 'ba-linkers|any':'в отрицаниях — «никакой»: I don\'t have any',
};
