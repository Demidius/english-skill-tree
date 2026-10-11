// Правки к словарям — подключается после data-*.js и до app.js.
// Позволяет исправлять переводы и добавлять транскрипции без перезаливки больших файлов.
(function () {
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'w';

  // 1) Уточнения русских переводов: id карточки | английское | новый русский
  const RU = `
pe-info-2|language|язык (на котором говорят)
bo-body-2|tongue|язык (часть тела)
pe2-look|slim|стройный (худощавый)
de-common-3|sure|уверенный (в чём-то)
pe3-rel-2|get along with|ладить, уживаться с
pe3-rel-2|support|поддерживать (помогать)
na3-animals|tail|хвост (животного)
ba2-quant|most|большинство (из)
pe2-character-2|modest|скромный (не хвастливый)
de-common|beautiful|красивый (о женщине, вещах)
pe3-generations|adult|взрослый (человек)
de2-eding|exciting|захватывающий, волнующий
de2-eding|frightened|напуганный
de2-common|comfortable|удобный (мягкий, уютный)
de3-adjprep|keen on|очень любить, увлекаться
de3-strong|huge|огромный (разг.)
de4-adj-2|vast|огромный (о пространстве)
de3-adjprep-2|sick of|надоело (до тошноты)
de4-feel-2|heartbroken|с разбитым сердцем
de3-strong-2|devastated|опустошённый, убитый горем
de2-things|soft|мягкий (на ощупь)
de2-things|sharp|острый (о ноже)
fo3-restaurant|spicy|острый (о еде)
da2-talk|shout|кричать (громко)
ti2-expr-2|earlier|раньше (ранее)
da2-phrasal|look for|искать (что-то потерянное)
da3-verbs-b1|deal with|справляться с, иметь дело с
fo4-diet-2|cut down on|сократить (в еде)
wo4-meetings|call off|отменить (встречу, разг.)
bo3-sleep|be asleep|спать (быть спящим)
da2-phrasal-2|write down|записать (на бумаге)
fr4-music|record|записать (звук, видео)
da3-verbs-b1-2|prepare|готовить(ся), подготавливать
fr-hobbies-2|cook|готовить (еду)
da3-verbs-b1-2|reduce|сокращать, уменьшать
da3-verbs-b1-2|require|требовать (быть нужным)
da4-verbs-2|demand|требовать (настойчиво)
to4-law|acquit|оправдать (в суде)
da4-phrasal-2|rule out|исключить (вариант)
ho-prep|opposite|напротив (через дорогу)
ba4-contrast|on the contrary|напротив, наоборот
ho2-housework|do the ironing|гладить (бельё)
ho3-problems|damp|сырой (влажный)
ho3-house-2|tool|инструмент (рабочий)
fr2-music|instrument|инструмент (музыкальный)
ho4-renting|move out|выехать (из квартиры)
ho3-neighbours|neighbourhood|район (где живёшь)
to3-city-2|district|район (города)
ho3-neighbours|resident|житель (дома, района)
to3-travel-2|accommodation|жильё (на время поездки)
fo-food|chicken|курица (мясо)
fo2-cooking|recipe|рецепт (блюда)
ba2-quant|a bit|немного, чуть-чуть
fo3-cooking-3|home-cooked|домашний (о блюде)
fo4-taste|crunchy|хрустящий (твёрдый)
fo4-idioms-2|walk on eggshells|ходить на цыпочках (бояться задеть)
bo4-body-2|tiptoe|ходить на цыпочках (буквально)
fo4-idioms|bring home the bacon|зарабатывать на жизнь (идиома)
to-places|chemist's|аптека (брит.)
sh2-shopping|checkout|касса (в магазине)
to4-law|judge|судья (в суде)
wo4-meetings|bargain|торговаться (об условиях)
sh2-clothes|zip|молния (застёжка)
na4-weather|lightning|молния (в грозу)
wo-class-2|sentence|предложение (в грамматике)
fr2-sports-2|coach|тренер (команды)
na3-landscape-2|scenery|пейзаж, природа вокруг
bo3-senses|wave|махать (рукой)
na3-environment|rubbish|мусор (брит.)
na3-env-2|green|экологичный (разг.)
na3-birds|flock|стая (птиц)
ba4-linkers-2|having said that|тем не менее, хотя
ba4-wordbuilding-2|truth|правда (истина)
ba4-adverbs|barely|едва (с трудом)
ba3-adverbs|hardly|едва ли, почти не
`;

  // 2) Транскрипции: английское | IPA (брит.) | по-русски
  const TR = `
relationship|rɪˈleɪʃnʃɪp|рилэ́йшншип
stepmother|ˈstepmʌðə|сте́пмазэ
stepbrother|ˈstepbrʌðə|сте́пбразэ
half-sister|ˈhɑːf sɪstə|ха́ф систэ
bride|braɪd|бра́йд
groom|ɡruːm|гру́м
guest|ɡest|ге́ст
fiancé|fiˈɒnseɪ|фио́нсэй
be in love|bi ɪn ˈlʌv|би ин ла́в
introduce|ˌɪntrəˈdjuːs|интрэдью́с
kiss|kɪs|ки́с
together|təˈɡeðə|тэге́зэ
host|həʊst|хо́уст
get-together|ˈɡet təɡeðə|ге́т тэгезэ
housewarming party|ˈhaʊswɔːmɪŋ pɑːti|ха́усуоминг пати
reunion|riːˈjuːniən|рию́ниэн
socialise|ˈsəʊʃəlaɪz|со́ушэлайз
meet up|miːt ˈʌp|мит а́п
stay in|steɪ ˈɪn|стэй и́н
accept an invitation|əkˈsept ən ˌɪnvɪˈteɪʃn|эксэ́пт эн инвитэ́йшн
turn down an invitation|tɜːn ˈdaʊn ən ˌɪnvɪˈteɪʃn|тён да́ун эн инвитэ́йшн
have people over|hæv ˈpiːpl əʊvə|хэв пи́пл оувэ
small talk|ˈsmɔːl tɔːk|смо́л ток
make conversation|meɪk ˌkɒnvəˈseɪʃn|мэйк конвэсэ́йшн
introduce yourself|ˌɪntrəˈdjuːs jɔːˈself|интрэдью́с йосэ́лф
reserved|rɪˈzɜːvd|ризё́вд
outgoing|ˈaʊtɡəʊɪŋ|а́утгоуинг
determined|dɪˈtɜːmɪnd|дитё́минд
cautious|ˈkɔːʃəs|ко́шэс
impulsive|ɪmˈpʌlsɪv|импа́лсив
trustworthy|ˈtrʌstwɜːði|тра́стуёзи
loyal|ˈlɔɪəl|ло́йэл
sincere|sɪnˈsɪə|синси́э
humble|ˈhʌmbl|ха́мбл
vain|veɪn|вэ́йн
stingy|ˈstɪndʒi|сти́нджи
spontaneous|spɒnˈteɪniəs|спонтэ́йниэс
eccentric|ɪkˈsentrɪk|иксэ́нтрик
rebellious|rɪˈbeljəs|ribе́льес
sibling|ˈsɪblɪŋ|си́блинг
extended family|ɪkˌstendɪd ˈfæməli|икстэ́ндид фэ́мэли
nuclear family|ˌnjuːkliə ˈfæməli|нью́клиэ фэ́мэли
single parent|ˌsɪŋɡl ˈpeərənt|сингл пе́эрэнт
foster parents|ˈfɒstə peərənts|фо́стэ пеэрэнтс
household|ˈhaʊshəʊld|ха́усхоулд
breadwinner|ˈbredwɪnə|брэ́дуинэ
raise|reɪz|рэ́йз
spoil|spɔɪl|спо́йл
discipline|ˈdɪsəplɪn|ди́сэплин
sibling rivalry|ˌsɪblɪŋ ˈraɪvlri|сиблинг ра́йвлри
generation gap|ˌdʒenəˈreɪʃn ɡæp|дженэрэ́йшн гэп
inherit|ɪnˈherɪt|инхе́рит
ancestor|ˈænsestə|э́нсэстэ
excellent|ˈeksələnt|э́ксэлэнт
horrible|ˈhɒrəbl|хо́рэбл
popular|ˈpɒpjələ|по́пьюлэ
special|ˈspeʃl|спе́шл
comfortable|ˈkʌmftəbl|ка́мфтэбл
normal|ˈnɔːml|но́мл
correct|kəˈrekt|кэрэ́кт
simple|ˈsɪmpl|си́мпл
lucky|ˈlʌki|ла́ки
alone|əˈləʊn|эло́ун
alive|əˈlaɪv|эла́йв
dead|ded|дэ́д
crazy|ˈkreɪzi|крэ́йзи
available|əˈveɪləbl|эвэ́йлэбл
convenient|kənˈviːniənt|кэнви́ниэнт
familiar|fəˈmɪliə|фэми́лиэ
typical|ˈtɪpɪkl|ти́пикл
suitable|ˈsuːtəbl|сю́тэбл
necessary|ˈnesəsəri|нэ́сэсэри
valuable|ˈvæljuəbl|вэ́льюэбл
private|ˈpraɪvət|пра́йвэт
public|ˈpʌblɪk|па́блик
complicated|ˈkɒmplɪkeɪtɪd|ко́мпликэйтид
accurate|ˈækjərət|э́кьюрэт
basic|ˈbeɪsɪk|бэ́йсик
original|əˈrɪdʒənl|эри́джэнл
traditional|trəˈdɪʃənl|трэди́шэнл
fragile|ˈfrædʒaɪl|фрэ́джайл
durable|ˈdjʊərəbl|дью́эрэбл
sturdy|ˈstɜːdi|стё́ди
flimsy|ˈflɪmzi|фли́мзи
compact|kəmˈpækt|кэмпэ́кт
bulky|ˈbʌlki|ба́лки
lightweight|ˈlaɪtweɪt|ла́йтуэйт
transparent|trænsˈpærənt|трэнспэ́рэнт
waterproof|ˈwɔːtəpruːf|уо́тэпруф
portable|ˈpɔːtəbl|по́тэбл
versatile|ˈvɜːsətaɪl|вё́сэтайл
handy|ˈhændi|хэ́нди
delicate|ˈdelɪkət|дэ́ликэт
solid|ˈsɒlɪd|со́лид
great|ɡreɪt|грэ́йт
lovely|ˈlʌvli|ла́вли
wonderful|ˈwʌndəfl|уа́ндэфл
perfect|ˈpɜːfɪkt|пё́фикт
important|ɪmˈpɔːtnt|импо́тнт
possible|ˈpɒsəbl|по́сэбл
ready|ˈredi|рэ́ди
Sure.|ʃɔː|шо́
true|truː|тру́
real|rɪəl|ри́эл
famous|ˈfeɪməs|фэ́ймэс
free|friː|фри́
quick|kwɪk|куи́к
half an hour|ˌhɑːf ən ˈaʊə|ха́ф эн а́уэ
a quarter of an hour|ə ˌkwɔːtər əv ən ˈaʊə|э куо́тэр эв эн а́уэ
an hour and a half|ən ˌaʊər ənd ə ˈhɑːf|эн а́уэр энд э ха́ф
a long time|ə ˌlɒŋ ˈtaɪm|э лонг та́йм
for a while|fər ə ˈwaɪl|фор э уа́йл
all night|ˌɔːl ˈnaɪt|ол на́йт
the whole day|ðə ˌhəʊl ˈdeɪ|зэ хоул дэ́й
once a week|ˌwʌns ə ˈwiːk|уанс э уи́к
every other day|ˌevri ˌʌðə ˈdeɪ|эври азэ дэ́й
at the same time|ət ðə ˌseɪm ˈtaɪm|эт зэ сэйм та́йм
at first|ət ˈfɜːst|эт фё́ст
one day|ˌwʌn ˈdeɪ|уан дэ́й
some day|ˈsʌm deɪ|са́м дэй
the next day|ðə ˌnekst ˈdeɪ|зэ нэкст дэ́й
schedule|ˈʃedjuːl|шэ́дьюл
diary|ˈdaɪəri|да́йэри
arrange|əˈreɪndʒ|эрэ́йндж
make an appointment|meɪk ən əˈpɔɪntmənt|мэйк эн эпо́йнтмэнт
reschedule|ˌriːˈʃedjuːl|риш​е́дьюл
fully booked|ˌfʊli ˈbʊkt|фули бу́кт
be due|bi ˈdjuː|би дью́
plan ahead|ˌplæn əˈhed|плэн эхэ́д
spend time|ˌspend ˈtaɪm|спэнд та́йм
waste time|ˌweɪst ˈtaɪm|уэйст та́йм
save time|ˌseɪv ˈtaɪm|сэйв та́йм
have time for|hæv ˈtaɪm fə|хэв та́йм фэ
be short of time|bi ˌʃɔːt əv ˈtaɪm|би шот эв та́йм
at the last minute|ət ðə ˌlɑːst ˈmɪnɪt|эт зэ ласт ми́нит
beforehand|bɪˈfɔːhænd|бифо́хэнд
afterwards|ˈɑːftəwədz|а́фтэуэдз
initially|ɪˈnɪʃəli|ини́шэли
subsequently|ˈsʌbsɪkwəntli|са́бсикуэнтли
previously|ˈpriːviəsli|при́виэсли
lately|ˈleɪtli|лэ́йтли
ultimately|ˈʌltɪmətli|а́лтимэтли
in due course|ɪn ˌdjuː ˈkɔːs|ин дью ко́с
overnight|ˌəʊvəˈnaɪt|оувэна́йт
at the outset|ət ði ˈaʊtset|эт зи а́утсэт
up to date|ˌʌp tə ˈdeɪt|ап тэ дэ́йт
out of date|ˌaʊt əv ˈdeɪt|аут эв дэ́йт
to date|tə ˈdeɪt|тэ дэ́йт
recent|ˈriːsnt|ри́снт
time|taɪm|та́йм
calendar|ˈkælɪndə|кэ́линдэ
tonight|təˈnaɪt|тэна́йт
this morning|ðɪs ˈmɔːnɪŋ|зис мо́нинг
last night|ˌlɑːst ˈnaɪt|ласт на́йт
next week|ˌnekst ˈwiːk|нэкст уи́к
next year|ˌnekst ˈjɪə|нэкст йи́э
again|əˈɡen|эгэ́н
Christmas|ˈkrɪsməs|кри́смэс
New Year|ˌnjuː ˈjɪə|нью йи́э
Easter|ˈiːstə|и́стэ
party|ˈpɑːti|па́ти
present|ˈpreznt|прэ́знт
in good time|ɪn ˌɡʊd ˈtaɪm|ин гуд та́йм
last-minute|ˌlɑːst ˈmɪnɪt|ласт ми́нит
a tight deadline|ə ˌtaɪt ˈdedlaɪn|э тайт дэ́длайн
extend a deadline|ɪkˌstend ə ˈdedlaɪn|икстэнд э дэ́длайн
buy time|ˌbaɪ ˈtaɪm|бай та́йм
make up for lost time|meɪk ˈʌp fə ˌlɒst ˈtaɪm|мэйк ап фэ лост та́йм
be pressed for time|bi ˌprest fə ˈtaɪm|би прэст фэ та́йм
time-saving|ˈtaɪm seɪvɪŋ|та́йм сэйвинг
timescale|ˈtaɪmskeɪl|та́ймскэйл
against the clock|əˌɡenst ðə ˈklɒk|эгэнст зэ кло́к
spare a minute|ˌspeər ə ˈmɪnɪt|спеэр э ми́нит
at the eleventh hour|ət ði ɪˌlevnθ ˈaʊə|эт зи илэвнс а́уэ
in the blink of an eye|ɪn ðə ˌblɪŋk əv ən ˈaɪ|ин зэ блинк эв эн а́й
believe|bɪˈliːv|били́в
choose|tʃuːz|чу́з
decide|dɪˈsaɪd|диса́йд
guess|ɡes|гэ́с
build|bɪld|би́лд
catch|kætʃ|кэ́ч
join|dʒɔɪn|джо́йн
fall|fɔːl|фо́л
hide|haɪd|ха́йд
hold|həʊld|хо́улд
keep|kiːp|ки́п
move|muːv|му́в
worry|ˈwʌri|уа́ри
run errands|ˌrʌn ˈerəndz|ран э́рэндз
pay the bills|ˌpeɪ ðə ˈbɪlz|пэй зэ би́лз
get a haircut|ˌɡet ə ˈheəkʌt|гет э хе́экат
collect a parcel|kəˌlekt ə ˈpɑːsl|кэлэкт э па́сл
iron a shirt|ˌaɪən ə ˈʃɜːt|айэн э шё́т
change the sheets|ˌtʃeɪndʒ ðə ˈʃiːts|чэйндж зэ ши́тс
empty the dishwasher|ˌempti ðə ˈdɪʃwɒʃə|эмпти зэ ди́шуошэ
feed the pets|ˌfiːd ðə ˈpets|фид зэ пэ́тс
wash the car|ˌwɒʃ ðə ˈkɑː|уош зэ ка́
sort out the post|ˌsɔːt ˈaʊt ðə ˈpəʊst|сот аут зэ по́уст
handle|ˈhændl|хэ́ндл
tackle|ˈtækl|тэ́кл
involve|ɪnˈvɒlv|инво́лв
affect|əˈfekt|эфэ́кт
gain|ɡeɪn|гэ́йн
maintain|meɪnˈteɪn|мэйнтэ́йн
contribute|kənˈtrɪbjuːt|кэнтри́бьют
reveal|rɪˈviːl|риви́л
predict|prɪˈdɪkt|приди́кт
resist|rɪˈzɪst|рizи́ст
tolerate|ˈtɒləreɪt|то́лэрэйт
consume|kənˈsjuːm|кэнсью́м
appreciate|əˈpriːʃieɪt|эпри́шиэйт
recommend|ˌrekəˈmend|рэкэмэ́нд
put|pʊt|пу́т
use|juːz|ю́з
try|traɪ|тра́й
show|ʃəʊ|шо́у
carry|ˈkæri|кэ́ри
wash|wɒʃ|уо́ш
laugh|lɑːf|ла́ф
cry|kraɪ|кра́й
smile|smaɪl|сма́йл
jump|dʒʌmp|джа́мп
swim|swɪm|суи́м
fly|flaɪ|фла́й
understand|ˌʌndəˈstænd|андэстэ́нд
electricity|ɪˌlekˈtrɪsəti|илэктри́сэти
gas|ɡæs|гэ́с
electricity bill|ɪlekˈtrɪsəti bɪl|илэктри́сэти бил
water bill|ˈwɔːtə bɪl|уо́тэ бил
internet connection|ˈɪntənet kəˌnekʃn|и́нтэнэт кэнэкшн
lock|lɒk|ло́к
unlock|ʌnˈlɒk|анло́к
spare key|ˌspeə ˈkiː|спеэ ки́
burglar alarm|ˈbɜːɡlər əlɑːm|бё́глэр элам
meter|ˈmiːtə|ми́тэ
plug in|ˌplʌɡ ˈɪn|плаг и́н
unplug|ʌnˈplʌɡ|анпла́г
switch on|ˌswɪtʃ ˈɒn|суич о́н
switch off|ˌswɪtʃ ˈɒf|суич о́ф
décor|ˈdeɪkɔː|дэ́йко
furnishings|ˈfɜːnɪʃɪŋz|фё́нишингз
tiles|taɪlz|та́йлз
lampshade|ˈlæmpʃeɪd|лэ́мпшэйд
chandelier|ˌʃændəˈlɪə|шэндэли́э
built-in wardrobe|ˌbɪlt ɪn ˈwɔːdrəʊb|билт ин уо́дроуб
skylight|ˈskaɪlaɪt|ска́йлайт
bay window|ˌbeɪ ˈwɪndəʊ|бэй уи́ндоу
airy|ˈeəri|е́эри
clutter|ˈklʌtə|кла́тэ
cluttered|ˈklʌtəd|кла́тэд
minimalist|ˈmɪnɪməlɪst|ми́нимэлист
rustic|ˈrʌstɪk|ра́стик
natural light|ˌnætʃrəl ˈlaɪt|нэчрэл ла́йт
TV|ˌtiː ˈviː|ти ви́
computer|kəmˈpjuːtə|кэмпью́тэ
phone|fəʊn|фо́ун
radio|ˈreɪdiəʊ|рэ́йдиоу
camera|ˈkæmərə|кэ́мэрэ
toilet|ˈtɔɪlət|то́йлэт
soap|səʊp|со́уп
toothbrush|ˈtuːθbrʌʃ|ту́сбраш
toothpaste|ˈtuːθpeɪst|ту́спэйст
shampoo|ʃæmˈpuː|шэмпу́
box|bɒks|бо́кс
photo|ˈfəʊtəʊ|фо́утоу
paper|ˈpeɪpə|пэ́йпэ
garden gate|ˌɡɑːdn ˈɡeɪt|гадн гэ́йт
lawn|lɔːn|ло́н
flower bed|ˈflaʊə bed|фла́уэ бэд
pot|pɒt|по́т
shed|ʃed|шэ́д
swing|swɪŋ|суи́нг
barbecue|ˈbɑːbɪkjuː|ба́бикью
bench|bentʃ|бэ́нч
mow the lawn|ˌməʊ ðə ˈlɔːn|моу зэ ло́н
grow vegetables|ˌɡrəʊ ˈvedʒtəblz|гроу вэ́джтэблз
plant flowers|ˌplɑːnt ˈflaʊəz|плант фла́уэз
pick fruit|ˌpɪk ˈfruːt|пик фру́т
drill|drɪl|дри́л
screwdriver|ˈskruːdraɪvə|скру́драйвэ
screw|skruː|скру́
spanner|ˈspænə|спэ́нэ
saw|sɔː|со́
tape measure|ˈteɪp meʒə|тэ́йп мэжэ
paintbrush|ˈpeɪntbrʌʃ|пэ́йнтбраш
sandpaper|ˈsændpeɪpə|сэ́ндпэйпэ
assemble|əˈsembl|эсэ́мбл
put up shelves|ˌpʊt ʌp ˈʃelvz|пут ап шэ́лвз
tighten|ˈtaɪtn|та́йтн
loosen|ˈluːsn|лу́сн
drill a hole|ˌdrɪl ə ˈhəʊl|дрил э хо́ул
toolbox|ˈtuːlbɒks|ту́лбокс
pineapple|ˈpaɪnæpl|па́йнэпл
plum|plʌm|пла́м
melon|ˈmelən|мэ́лэн
mango|ˈmæŋɡəʊ|мэ́нгоу
lettuce|ˈletɪs|лэ́тис
beans|biːnz|би́нз
corn|kɔːn|ко́н
spinach|ˈspɪnɪtʃ|спи́нич
broccoli|ˈbrɒkəli|бро́кэли
cauliflower|ˈkɒliflaʊə|ко́лифлауэ
pumpkin|ˈpʌmpkɪn|па́мпкин
avocado|ˌævəˈkɑːdəʊ|эвэка́доу
olives|ˈɒlɪvz|о́ливз
groceries|ˈɡrəʊsəriz|гро́усэриз
best-before date|ˌbest bɪˈfɔː deɪt|бэст бифо́ дэйт
use-by date|ˈjuːz baɪ deɪt|ю́з бай дэйт
free-range|ˌfriː ˈreɪndʒ|фри рэ́йндж
locally sourced|ˌləʊkəli ˈsɔːst|лоукэли со́ст
in season|ɪn ˈsiːzn|ин си́зн
seasonal produce|ˌsiːzənl ˈprɒdjuːs|сизэнл про́дьюс
ready meal|ˈredi miːl|рэ́ди мил
home-grown|ˌhəʊm ˈɡrəʊn|хоум гро́ун
farmers' market|ˈfɑːməz mɑːkɪt|фа́мэз макит
perishable|ˈperɪʃəbl|пэ́ришэбл
staple food|ˌsteɪpl ˈfuːd|стэйпл фу́д
bulk buying|ˌbʌlk ˈbaɪɪŋ|балк ба́йинг
food waste|ˈfuːd weɪst|фу́д уэйст
nibble|ˈnɪbl|ни́бл
sip|sɪp|си́п
gobble|ˈɡɒbl|го́бл
munch|mʌntʃ|ма́нч
devour|dɪˈvaʊə|дива́уэ
peckish|ˈpekɪʃ|пэ́киш
full up|ˌfʊl ˈʌp|фул а́п
a second helping|ə ˌsekənd ˈhelpɪŋ|э сэкэнд хэ́лпинг
fussy eater|ˌfʌsi ˈiːtə|фаси и́тэ
grab a bite|ˌɡræb ə ˈbaɪt|грэб э ба́йт
wolf down|ˌwʊlf ˈdaʊn|уулф да́ун
skip breakfast|ˌskɪp ˈbrekfəst|скип брэ́кфэст
comfort food|ˈkʌmfət fuːd|ка́мфэт фуд
food|fuːd|фу́д
meal|miːl|ми́л
pizza|ˈpiːtsə|пи́цэ
sandwich|ˈsænwɪdʒ|сэ́нуидж
hamburger|ˈhæmbɜːɡə|хэ́мбёгэ
chips|tʃɪps|чи́пс
sweets|swiːts|суи́тс
pie|paɪ|па́й
pear|peə|пе́э
peach|piːtʃ|пи́ч
cherry|ˈtʃeri|чэ́ри
watermelon|ˈwɔːtəmelən|уо́тэмэлэн
lemonade|ˌleməˈneɪd|лэмэнэ́йд
hot chocolate|ˌhɒt ˈtʃɒklət|хот чо́клэт
chopping board|ˈtʃɒpɪŋ bɔːd|чо́пинг бод
lid|lɪd|ли́д
tray|treɪ|трэ́й
teapot|ˈtiːpɒt|ти́пот
jug|dʒʌɡ|джа́г
tin opener|ˈtɪn əʊpənə|ти́н оупэнэ
bottle opener|ˈbɒtl əʊpənə|бо́тл оупэнэ
grater|ˈɡreɪtə|грэ́йтэ
kitchen scales|ˈkɪtʃɪn skeɪlz|ки́чин скэйлз
baking tray|ˈbeɪkɪŋ treɪ|бэ́йкинг трэй
oven glove|ˈʌvn ɡlʌv|а́вн глав
peeler|ˈpiːlə|пи́лэ
ladle|ˈleɪdl|лэ́йдл
wooden spoon|ˌwʊdn ˈspuːn|вудн спу́н
art gallery|ˈɑːt ɡæləri|а́т гэлэри
aquarium|əˈkweəriəm|экуе́эриэм
theme park|ˈθiːm pɑːk|си́м пак
nightclub|ˈnaɪtklʌb|на́йтклаб
factory|ˈfæktri|фэ́ктри
port|pɔːt|по́т
fountain|ˈfaʊntən|фа́унтэн
statue|ˈstætʃuː|стэ́чу
pub|pʌb|па́б
bar|bɑː|ба́
pharmacy|ˈfɑːməsi|фа́мэси
college|ˈkɒlɪdʒ|ко́лидж
concert hall|ˈkɒnsət hɔːl|ко́нсэт хол
post box|ˈpəʊst bɒks|по́уст бокс
public toilet|ˌpʌblɪk ˈtɔɪlət|паблик то́йлэт
parking meter|ˈpɑːkɪŋ miːtə|па́кинг митэ
bus shelter|ˈbʌs ʃeltə|ба́с шэлтэ
taxi rank|ˈtæksi ræŋk|тэ́кси рэнк
kiosk|ˈkiːɒsk|ки́оск
street light|ˈstriːt laɪt|стри́т лайт
litter bin|ˈlɪtə bɪn|ли́тэ бин
traffic warden|ˈtræfɪk wɔːdn|трэ́фик уодн
recycling bin|riːˈsaɪklɪŋ bɪn|рисайклинг бин
information desk|ˌɪnfəˈmeɪʃn desk|инфэмэ́йшн дэск
lost property office|ˌlɒst ˈprɒpəti ɒfɪs|лост про́пэти офис
left luggage|ˌleft ˈlʌɡɪdʒ|лэфт ла́гидж
B&B|ˌbiː ən ˈbiː|би эн би́
half board|ˌhɑːf ˈbɔːd|хаф бо́д
full board|ˌfʊl ˈbɔːd|фул бо́д
resort|rɪˈzɔːt|ризо́т
cruise|kruːz|кру́з
guided tour|ˌɡaɪdɪd ˈtʊə|гайдид ту́э
off-peak|ˌɒf ˈpiːk|оф пи́к
peak season|ˈpiːk siːzn|пи́к сизн
last-minute deal|ˌlɑːst mɪnɪt ˈdiːl|ласт минит ди́л
upgrade|ʌpˈɡreɪd|апгрэ́йд
complimentary|ˌkɒmplɪˈmentri|комплимэ́нтри
cancellation fee|ˌkænsəˈleɪʃn fiː|кэнсэлэ́йшн фи
travel insurance|ˈtrævl ɪnʃʊərəns|трэ́вл иншуэрэнс
excursion|ɪkˈskɜːʃn|икскё́шн
road|rəʊd|ро́уд
boat|bəʊt|бо́ут
ship|ʃɪp|ши́п
helicopter|ˈhelɪkɒptə|хэ́ликоптэ
scooter|ˈskuːtə|ску́тэ
seat|siːt|си́т
north|nɔːθ|но́с
south|saʊθ|са́ус
east|iːst|и́ст
west|west|уэ́ст
walk to work|ˌwɔːk tə ˈwɜːk|уок тэ уё́к
ride a bike|ˌraɪd ə ˈbaɪk|райд э ба́йк
public services|ˌpʌblɪk ˈsɜːvɪsɪz|паблик сё́висиз
local authority|ˌləʊkl ɔːˈθɒrəti|лоукл осо́рэти
recycling centre|riːˈsaɪklɪŋ sentə|риса́йклинг сэнтэ
leisure centre|ˈleʒə sentə|лэ́жэ сэнтэ
community centre|kəˈmjuːnəti sentə|кэмью́нэти сэнтэ
job centre|ˈdʒɒb sentə|джо́б сэнтэ
social housing|ˌsəʊʃl ˈhaʊzɪŋ|соушл ха́узинг
charity shop|ˈtʃærəti ʃɒp|чэ́рэти шоп
food bank|ˈfuːd bæŋk|фу́д бэнк
refuse collection|ˈrefjuːs kəlekʃn|рэ́фьюс кэлэкшн
polling station|ˈpəʊlɪŋ steɪʃn|по́улинг стэйшн
register with a GP|ˌredʒɪstə wɪð ə ˌdʒiː ˈpiː|рэджистэ уиз э джи пи́
residents' association|ˌrezɪdənts əsəʊsiˈeɪʃn|рэзидэнтс эсоусиэ́йшн
library card|ˈlaɪbrəri kɑːd|ла́йбрэри кад
purse|pɜːs|пё́с
credit card|ˈkredɪt kɑːd|крэ́дит кад
pay by card|ˌpeɪ baɪ ˈkɑːd|пэй бай ка́д
pay in cash|ˌpeɪ ɪn ˈkæʃ|пэй ин кэ́ш
PIN|pɪn|пи́н
save money|ˌseɪv ˈmʌni|сэйв ма́ни
change money|ˌtʃeɪndʒ ˈmʌni|чэйндж ма́ни
special offer|ˌspeʃl ˈɒfə|спешл о́фэ
half price|ˌhɑːf ˈpraɪs|хаф пра́йс
It's free.|ɪts ˈfriː|итс фри́
How much does it cost?|ˌhaʊ ˈmʌtʃ dəz ɪt ˈkɒst|хау мач дэз ит ко́ст
Keep the change.|ˌkiːp ðə ˈtʃeɪndʒ|кип зэ чэ́йндж
necklace|ˈnekləs|нэ́клэс
earrings|ˈɪərɪŋz|и́эрингз
bracelet|ˈbreɪslət|брэ́йслэт
handbag|ˈhændbæɡ|хэ́ндбэг
sunglasses|ˈsʌnɡlɑːsɪz|са́нгласиз
backpack|ˈbækpæk|бэ́кпэк
tights|taɪts|та́йтс
slippers|ˈslɪpəz|сли́пэз
raincoat|ˈreɪnkəʊt|рэ́йнкоут
hoodie|ˈhʊdi|ху́ди
blouse|blaʊz|бла́уз
sweatshirt|ˈswetʃɜːt|суэ́тшёт
damaged|ˈdæmɪdʒd|дэ́миджд
scratched|skrætʃt|скрэ́чт
stained|steɪnd|стэ́йнд
missing|ˈmɪsɪŋ|ми́синг
customer service|ˌkʌstəmə ˈsɜːvɪs|кастэмэ сё́вис
return|rɪˈtɜːn|ритё́н
send back|ˌsend ˈbæk|сэнд бэ́к
swap|swɒp|суо́п
replacement|rɪˈpleɪsmənt|риплэ́йсмэнт
proof of purchase|ˌpruːf əv ˈpɜːtʃəs|пруф эв пё́чэс
It doesn't work.|ɪt ˌdʌznt ˈwɜːk|ит дазнт уё́к
the wrong size|ðə ˌrɒŋ ˈsaɪz|зэ ронг са́йз
Can I speak to the manager?|kən aɪ ˌspiːk tə ðə ˈmænɪdʒə|кэн ай спик тэ зэ мэ́ниджэ
money back|ˌmʌni ˈbæk|мани бэ́к
add to basket|ˌæd tə ˈbɑːskɪt|эд тэ ба́скит
wish list|ˈwɪʃ lɪst|уи́ш лист
track an order|ˌtræk ən ˈɔːdə|трэк эн о́дэ
tracking number|ˈtrækɪŋ nʌmbə|трэ́кинг намбэ
out for delivery|ˌaʊt fə dɪˈlɪvəri|аут фэ дили́вэри
dispatch|dɪˈspætʃ|диспэ́ч
parcel locker|ˈpɑːsl lɒkə|па́сл локэ
returns label|rɪˈtɜːnz leɪbl|ритё́нз лэйбл
promo code|ˈprəʊməʊ kəʊd|про́умоу коуд
customer reviews|ˌkʌstəmə rɪˈvjuːz|кастэмэ ривью́з
secure payment|sɪˌkjʊə ˈpeɪmənt|сикьюэ пэ́ймэнт
next-day delivery|ˌnekst deɪ dɪˈlɪvəri|нэкст дэй дили́вэри
order history|ˈɔːdə hɪstri|о́дэ хистри
sign up|ˌsaɪn ˈʌp|сайн а́п
overspend|ˌəʊvəˈspend|оувэспэ́нд
live within your means|ˌlɪv wɪˌðɪn jɔː ˈmiːnz|лив уизин йо ми́нз
payday|ˈpeɪdeɪ|пэ́йдэй
direct debit|dəˌrekt ˈdebɪt|дэрэкт дэ́бит
standing order|ˌstændɪŋ ˈɔːdə|стэндинг о́дэ
bank statement|ˈbæŋk steɪtmənt|бэ́нк стэйтмэнт
current account|ˈkʌrənt əkaʊnt|ка́рэнт экаунт
savings account|ˈseɪvɪŋz əkaʊnt|сэ́йвингз экаунт
interest rate|ˈɪntrəst reɪt|и́нтрэст рэйт
pay off|ˌpeɪ ˈɒf|пэй о́ф
take out a loan|ˌteɪk aʊt ə ˈləʊn|тэйк аут э ло́ун
credit rating|ˈkredɪt reɪtɪŋ|крэ́дит рэйтинг
cut back on|ˌkʌt ˈbæk ɒn|кат бэ́к он
set aside|ˌset əˈsaɪd|сэт эса́йд
euro|ˈjʊərəʊ|ю́эроу
dollar|ˈdɒlə|до́лэ
pound|paʊnd|па́унд
cent|sent|сэ́нт
shopping|ˈʃɒpɪŋ|шо́пинг
a pair of|ə ˈpeər əv|э пе́эр эв
Do you have …?|də ju ˈhæv|ду ю хэ́в
I'll take it.|aɪl ˈteɪk ɪt|айл тэ́йк ит
That's all.|ˌðæts ˈɔːl|зэтс о́л
It's too big.|ɪts ˌtuː ˈbɪɡ|итс ту би́г
It's too small.|ɪts ˌtuː ˈsmɔːl|итс ту смо́л
What size are you?|ˌwɒt ˈsaɪz ə juː|уот са́йз а ю
Where can I pay?|ˌweə kən aɪ ˈpeɪ|уэ кэн ай пэ́й
secretary|ˈsekrətri|сэ́крэтри
soldier|ˈsəʊldʒə|со́улджэ
photographer|fəˈtɒɡrəfə|фэто́грэфэ
tour guide|ˈtʊə ɡaɪd|ту́э гайд
baker|ˈbeɪkə|бэ́йкэ
postman|ˈpəʊstmən|по́устмэн
security guard|sɪˈkjʊərəti ɡɑːd|сикью́эрэти гад
babysitter|ˈbeɪbisɪtə|бэ́йбиситэ
painter|ˈpeɪntə|пэ́йнтэ
model|ˈmɒdl|мо́дл
businesswoman|ˈbɪznəswʊmən|би́знэсвумэн
housewife|ˈhaʊswaɪf|ха́усуайф
voicemail|ˈvɔɪsmeɪl|во́йсмэйл
missed call|ˌmɪst ˈkɔːl|мист ко́л
leave a message|ˌliːv ə ˈmesɪdʒ|лив э мэ́сидж
attachment|əˈtætʃmənt|этэ́чмэнт
attach|əˈtætʃ|этэ́ч
forward|ˈfɔːwəd|фо́уэд
inbox|ˈɪnbɒks|и́нбокс
spam|spæm|спэ́м
profile|ˈprəʊfaɪl|про́уфайл
follow|ˈfɒləʊ|фо́лоу
notification|ˌnəʊtɪfɪˈkeɪʃn|ноутификэ́йшн
comment|ˈkɒment|ко́мэнт
job hunting|ˈdʒɒb hʌntɪŋ|джо́б хантинг
recruitment|rɪˈkruːtmənt|рикру́тмэнт
recruit|rɪˈkruːt|рикру́т
candidate|ˈkændɪdət|кэ́ндидэт
job offer|ˈdʒɒb ɒfə|джо́б офэ
notice period|ˈnəʊtɪs pɪəriəd|но́утис пиэриэд
hand in your notice|ˌhænd ɪn jɔː ˈnəʊtɪs|хэнд ин йо но́утис
probation period|prəˈbeɪʃn pɪəriəd|прэбэ́йшн пиэриэд
fixed-term contract|ˌfɪkst tɜːm ˈkɒntrækt|фикст тём ко́нтрэкт
salary expectations|ˌsæləri ˌekspekˈteɪʃnz|сэлэри экспэктэ́йшнз
lay off|ˌleɪ ˈɒf|лэй о́ф
sack|sæk|сэ́к
dismiss|dɪsˈmɪs|дисми́с
job description|ˈdʒɒb dɪskrɪpʃn|джо́б дискрипшн
board|bɔːd|бо́д
pencil|ˈpensl|пэ́нсл
rubber|ˈrʌbə|ра́бэ
ruler|ˈruːlə|ру́лэ
schoolbag|ˈskuːlbæɡ|ску́лбэг
scissors|ˈsɪzəz|си́зэз
calculator|ˈkælkjuleɪtə|кэ́лкьюлэйтэ
class|klɑːs|кла́с
letter|ˈletə|лэ́тэ
number|ˈnʌmbə|на́мбэ
example|ɪɡˈzɑːmpl|игза́мпл
the alphabet|ði ˈælfəbet|зи э́лфэбэт
spell|spel|спэ́л
photocopier|ˈfəʊtəʊkɒpiə|фо́утоукопиэ
stapler|ˈsteɪplə|стэ́йплэ
scanner|ˈskænə|скэ́нэ
filing cabinet|ˈfaɪlɪŋ kæbɪnət|фа́йлинг кэбинэт
noticeboard|ˈnəʊtɪsbɔːd|но́утисбод
whiteboard|ˈwaɪtbɔːd|уа́йтбод
paper clip|ˈpeɪpə klɪp|пэ́йпэ клип
envelope|ˈenvələʊp|э́нвэлоуп
folder|ˈfəʊldə|фо́улдэ
stamp|stæmp|стэ́мп
highlighter|ˈhaɪlaɪtə|ха́йлайтэ
sticky note|ˈstɪki nəʊt|сти́ки ноут
hole punch|ˈhəʊl pʌntʃ|хо́ул панч
sellotape|ˈseləteɪp|сэ́лэтэйп
team spirit|ˌtiːm ˈspɪrɪt|тим спи́рит
morale|məˈrɑːl|мэра́л
office politics|ˌɒfɪs ˈpɒlətɪks|офис по́лэтикс
appraisal|əˈpreɪzl|эпрэ́йзл
performance review|pəˈfɔːməns rɪvjuː|пэфо́мэнс ривью
micromanage|ˌmaɪkrəʊˈmænɪdʒ|майкроумэ́нидж
trade union|ˌtreɪd ˈjuːniən|трэйд ю́ниэн
pay gap|ˈpeɪ ɡæp|пэ́й гэп
job satisfaction|ˌdʒɒb sætɪsˈfækʃn|джоб сэтисфэ́кшн
staff turnover|ˌstɑːf ˈtɜːnəʊvə|стаф тё́ноувэ
sick note|ˈsɪk nəʊt|си́к ноут
flexitime|ˈfleksitaɪm|флэ́кситайм
shift work|ˈʃɪft wɜːk|ши́фт уёк
unpaid leave|ˌʌnpeɪd ˈliːv|анпэйд ли́в
collect stamps|kəˌlekt ˈstæmps|кэлэкт стэ́мпс
do puzzles|ˌduː ˈpʌzlz|ду па́злз
do crosswords|ˌduː ˈkrɒswɜːdz|ду кро́суёдз
go horse riding|ˌɡəʊ ˈhɔːs raɪdɪŋ|гоу хо́с райдинг
go sailing|ˌɡəʊ ˈseɪlɪŋ|гоу сэ́йлинг
go surfing|ˌɡəʊ ˈsɜːfɪŋ|гоу сё́финг
go skating|ˌɡəʊ ˈskeɪtɪŋ|гоу скэ́йтинг
go climbing|ˌɡəʊ ˈklaɪmɪŋ|гоу кла́йминг
play basketball|ˌpleɪ ˈbɑːskɪtbɔːl|плэй ба́скитбол
play golf|ˌpleɪ ˈɡɒlf|плэй го́лф
play an instrument|ˌpleɪ ən ˈɪnstrəmənt|плэй эн и́нстрэмэнт
take photos|ˌteɪk ˈfəʊtəʊz|тэйк фо́утоуз
bake cakes|ˌbeɪk ˈkeɪks|бэйк кэ́йкс
knit|nɪt|ни́т
trekking|ˈtrekɪŋ|трэ́кинг
kayaking|ˈkaɪækɪŋ|ка́йэкинг
paragliding|ˈpærəɡlaɪdɪŋ|пэ́рэглайдинг
scuba diving|ˈskuːbə daɪvɪŋ|ску́бэ дайвинг
snorkelling|ˈsnɔːkəlɪŋ|сно́кэлинг
abseiling|ˈæbseɪlɪŋ|э́бсэйлинг
white-water rafting|ˌwaɪt wɔːtə ˈrɑːftɪŋ|уайт уотэ ра́фтинг
orienteering|ˌɔːriənˈtɪərɪŋ|ориэнти́эринг
caving|ˈkeɪvɪŋ|кэ́йвинг
bungee jumping|ˈbʌndʒi dʒʌmpɪŋ|ба́нджи джампинг
wild camping|ˌwaɪld ˈkæmpɪŋ|уайлд кэ́мпинг
trail|treɪl|трэ́йл
adrenaline rush|əˈdrenəlɪn rʌʃ|эдрэ́нэлин раш
thrill-seeker|ˈθrɪl siːkə|сри́л сикэ
game|ɡeɪm|гэ́йм
film|fɪlm|фи́лм
music|ˈmjuːzɪk|мью́зик
ball|bɔːl|бо́л
toy|tɔɪ|то́й
play cards|ˌpleɪ ˈkɑːdz|плэй ка́дз
picnic|ˈpɪknɪk|пи́кник
fun|fʌn|фа́н
favourite|ˈfeɪvərɪt|фэ́йвэрит
video|ˈvɪdiəʊ|ви́диоу
go to the beach|ˌɡəʊ tə ðə ˈbiːtʃ|гоу тэ зэ би́ч
go to the park|ˌɡəʊ tə ðə ˈpɑːk|гоу тэ зэ па́к
stay at home|ˌsteɪ ət ˈhəʊm|стэй эт хо́ум
lead singer|ˌliːd ˈsɪŋə|лид си́нгэ
guitarist|ɡɪˈtɑːrɪst|гита́рист
drummer|ˈdrʌmə|дра́мэ
pianist|ˈpiːənɪst|пи́энист
pop music|ˈpɒp mjuːzɪk|по́п мьюзик
classical music|ˌklæsɪkl ˈmjuːzɪk|клэсикл мью́зик
jazz|dʒæz|джэ́з
rock music|ˈrɒk mjuːzɪk|ро́к мьюзик
folk music|ˈfəʊk mjuːzɪk|фо́ук мьюзик
hip hop|ˈhɪp hɒp|хи́п хоп
hit|hɪt|хи́т
stage|steɪdʒ|стэ́йдж
microphone|ˈmaɪkrəfəʊn|ма́йкрэфоун
sing along|ˌsɪŋ əˈlɒŋ|синг эло́нг
narrator|nəˈreɪtə|нэрэ́йтэ
protagonist|prəˈtæɡənɪst|прэтэ́гэнист
setting|ˈsetɪŋ|сэ́тинг
plot twist|ˈplɒt twɪst|пло́т туист
hardback|ˈhɑːdbæk|ха́дбэк
edition|ɪˈdɪʃn|иди́шн
publish|ˈpʌblɪʃ|па́блиш
publisher|ˈpʌblɪʃə|па́блишэ
memoir|ˈmemwɑː|мэ́муа
short story|ˌʃɔːt ˈstɔːri|шот сто́ри
poetry|ˈpəʊətri|по́уэтри
literary|ˈlɪtərəri|ли́тэрэри
cliffhanger|ˈklɪfhæŋə|кли́фхэнгэ
unputdownable|ˌʌnpʊtˈdaʊnəbl|анпутда́унэбл
blood|blʌd|бла́д
bone|bəʊn|бо́ун
pill|pɪl|пи́л
break your arm|ˌbreɪk jər ˈɑːm|брэйк йор а́м
cut your finger|ˌkʌt jə ˈfɪŋɡə|кат йэ фи́нгэ
fall over|ˌfɔːl ˈəʊvə|фол о́увэ
burn your hand|ˌbɜːn jə ˈhænd|бён йэ хэ́нд
feel better|ˌfiːl ˈbetə|фил бэ́тэ
have a pain|ˌhæv ə ˈpeɪn|хэв э пэ́йн
take your temperature|ˌteɪk jə ˈtemprətʃə|тэйк йэ тэ́мпрэчэ
go to hospital|ˌɡəʊ tə ˈhɒspɪtl|гоу тэ хо́спитл
see a dentist|ˌsiː ə ˈdentɪst|си э дэ́нтист
drink plenty of water|ˌdrɪŋk ˌplenti əv ˈwɔːtə|дринк плэнти эв уо́тэ
fall asleep|ˌfɔːl əˈsliːp|фол эсли́п
be asleep|bi əˈsliːp|би эсли́п
awake|əˈweɪk|эуэ́йк
stay awake|ˌsteɪ əˈweɪk|стэй эуэ́йк
nightmare|ˈnaɪtmeə|на́йтмеэ
dream|driːm|дри́м
snore|snɔː|сно́
sleepy|ˈsliːpi|сли́пи
lie in|ˌlaɪ ˈɪn|лай и́н
get enough sleep|ɡet ɪˌnʌf ˈsliːp|гет инаф сли́п
light sleeper|ˌlaɪt ˈsliːpə|лайт сли́пэ
heavy sleeper|ˌhevi ˈsliːpə|хэви сли́пэ
alarm clock|əˈlɑːm klɒk|эла́м клок
energetic|ˌenəˈdʒetɪk|энэджэ́тик
workout|ˈwɜːkaʊt|уё́каут
personal trainer|ˌpɜːsənl ˈtreɪnə|пёсэнл трэ́йнэ
cardio|ˈkɑːdiəʊ|ка́диоу
weightlifting|ˈweɪtlɪftɪŋ|уэ́йтлифтинг
reps|reps|рэ́пс
stretching|ˈstretʃɪŋ|стрэ́чинг
build muscle|ˌbɪld ˈmʌsl|билд ма́сл
get in shape|ˌɡet ɪn ˈʃeɪp|гет ин шэ́йп
out of shape|ˌaʊt əv ˈʃeɪp|аут эв шэ́йп
tone up|ˌtəʊn ˈʌp|тоун а́п
endurance|ɪnˈdjʊərəns|индью́эрэнс
flexibility|ˌfleksəˈbɪləti|флэксэби́лэти
fitness tracker|ˈfɪtnəs trækə|фи́тнэс трэкэ
sedentary lifestyle|ˌsedntri ˈlaɪfstaɪl|сэднтри ла́йфстайл
ache|eɪk|э́йк
throbbing|ˈθrɒbɪŋ|сро́бинг
sharp pain|ˌʃɑːp ˈpeɪn|шап пэ́йн
dull pain|ˌdʌl ˈpeɪn|дал пэ́йн
itchy|ˈɪtʃi|и́чи
numb|nʌm|на́м
stiff|stɪf|сти́ф
sore|sɔː|со́
nauseous|ˈnɔːziəs|но́зиэс
under the weather|ˌʌndə ðə ˈweðə|андэ зэ уэ́зэ
out of breath|ˌaʊt əv ˈbreθ|аут эв брэ́с
feel faint|ˌfiːl ˈfeɪnt|фил фэ́йнт
pass out|ˌpɑːs ˈaʊt|пас а́ут
bloated|ˈbləʊtɪd|бло́утид
whale|weɪl|уэ́йл
dolphin|ˈdɒlfɪn|до́лфин
shark|ʃɑːk|ша́к
crocodile|ˈkrɒkədaɪl|кро́кэдайл
kangaroo|ˌkæŋɡəˈruː|кэнгэру́
zebra|ˈzebrə|зэ́брэ
camel|ˈkæml|кэ́мл
penguin|ˈpeŋɡwɪn|пэ́нгуин
polar bear|ˌpəʊlə ˈbeə|поулэ бе́э
turtle|ˈtɜːtl|тё́тл
spider|ˈspaɪdə|спа́йдэ
ant|ænt|э́нт
kitten|ˈkɪtn|ки́тн
puppy|ˈpʌpi|па́пи
cage|keɪdʒ|кэ́йдж
collar|ˈkɒlə|ко́лэ
lead|liːd|ли́д
paw|pɔː|по́
litter tray|ˈlɪtə treɪ|ли́тэ трэй
pet food|ˈpet fuːd|пэ́т фуд
purr|pɜː|пё́
bite|baɪt|ба́йт
lick|lɪk|ли́к
stroke|strəʊk|стро́ук
take to the vet|ˌteɪk tə ðə ˈvet|тэйк тэ зэ вэ́т
solar panel|ˌsəʊlə ˈpænl|соулэ пэ́нл
wind turbine|ˈwɪnd tɜːbaɪn|уи́нд тёбайн
power station|ˈpaʊə steɪʃn|па́уэ стэйшн
nuclear power|ˌnjuːkliə ˈpaʊə|ньюклиэ па́уэ
energy-efficient|ˌenədʒi ɪˈfɪʃnt|энэджи ифи́шнт
fuel|ˈfjuːəl|фью́эл
shortage|ˈʃɔːtɪdʒ|шо́тидж
consumption|kənˈsʌmpʃn|кэнса́мпшн
scarce|skeəs|ске́эс
deplete|dɪˈpliːt|дипли́т
oil spill|ˈɔɪl spɪl|о́йл спил
water supply|ˈwɔːtə səplaɪ|уо́тэ сэплай
waste disposal|ˈweɪst dɪspəʊzl|уэ́йст диспоузл
reduce your footprint|rɪˌdjuːs jə ˈfʊtprɪnt|ридьюс йэ фу́тпринт
sky|skaɪ|ска́й
star|stɑː|ста́
moon|muːn|му́н
world|wɜːld|уё́лд
earth|ɜːθ|ё́с
sand|sænd|сэ́нд
grass|ɡrɑːs|гра́с
stone|stəʊn|сто́ун
ice|aɪs|а́йс
fire|ˈfaɪə|фа́йэ
air|eə|е́э
plant|plɑːnt|пла́нт
coastline|ˈkəʊstlaɪn|ко́устлайн
current|ˈkʌrənt|ка́рэнт
shallow|ˈʃæləʊ|шэ́лоу
coral reef|ˌkɒrəl ˈriːf|корэл ри́ф
seaweed|ˈsiːwiːd|си́уид
shell|ʃel|шэ́л
lighthouse|ˈlaɪthaʊs|ла́йтхаус
harbour|ˈhɑːbə|ха́бэ
pier|pɪə|пи́э
rock pool|ˈrɒk puːl|ро́к пул
shipwreck|ˈʃɪprek|ши́прэк
low tide|ˌləʊ ˈtaɪd|лоу та́йд
washed up|ˌwɒʃt ˈʌp|уошт а́п
wait for|ˈweɪt fə|уэ́йт фэ
belong to|bɪˈlɒŋ tə|било́нг тэ
ask for|ˈɑːsk fə|а́ск фэ
agree with|əˈɡriː wɪð|эгри́ уиз
laugh at|ˈlɑːf ət|ла́ф эт
believe in|bɪˈliːv ɪn|били́в ин
care about|ˈkeər əbaʊt|ке́эр эбаут
dream of|ˈdriːm əv|дри́м эв
think of|ˈθɪŋk əv|си́нк эв
succeed in|səkˈsiːd ɪn|сэкси́д ин
consist of|kənˈsɪst əv|кэнси́ст эв
look at|ˈlʊk ət|лу́к эт
argue about|ˈɑːɡjuː əbaʊt|а́гью эбаут
apologise for|əˈpɒlədʒaɪz fə|эпо́лэджайз фэ
from my point of view|frəm maɪ ˌpɔɪnt əv ˈvjuː|фрэм май пойнт эв вью́
it seems to me|ɪt ˈsiːmz tə miː|ит си́мз тэ ми
I'm convinced that|aɪm kənˈvɪnst ðət|айм кэнви́нст зэт
I tend to think|aɪ ˌtend tə ˈθɪŋk|ай тэнд тэ си́нк
there's no doubt that|ðeəz ˌnəʊ ˈdaʊt ðət|зеэз ноу да́ут зэт
be in favour of|bi ɪn ˈfeɪvər əv|би ин фэ́йвэр эв
be against|bi əˈɡenst|би эгэ́нст
on balance|ɒn ˈbæləns|он бэ́лэнс
it's widely believed|ɪts ˌwaɪdli bɪˈliːvd|итс уайдли били́вд
it could be argued|ɪt kəd bi ˈɑːɡjuːd|ит кэд би а́гьюд
I'd go along with that|aɪd ˌɡəʊ əˈlɒŋ wɪð ðæt|айд гоу эло́нг уиз зэт
I take your point|aɪ ˌteɪk jə ˈpɔɪnt|ай тэйк йэ по́йнт
that's debatable|ðæts dɪˈbeɪtəbl|зэтс дибэ́йтэбл
I beg to differ|aɪ ˌbeɡ tə ˈdɪfə|ай бэг тэ ди́фэ
this|ðɪs|зи́с
that|ðæt|зэ́т
these|ðiːz|зи́з
those|ðəʊz|зо́уз
something|ˈsʌmθɪŋ|са́мсинг
nothing|ˈnʌθɪŋ|на́синг
everything|ˈevriθɪŋ|э́врисинг
someone|ˈsʌmwʌn|са́муан
everyone|ˈevriwʌn|э́вриуан
nobody|ˈnəʊbədi|но́убэди
other|ˈʌðə|а́зэ
another|əˈnʌðə|эна́зэ
only|ˈəʊnli|о́унли
How about …?|ˈhaʊ əbaʊt|ха́у эбаут
Why don't we …?|ˌwaɪ ˈdəʊnt wiː|уай до́унт уи
What about you?|ˌwɒt əbaʊt ˈjuː|уот эбаут ю́
I'd love to.|aɪd ˈlʌv tuː|айд ла́в ту
I'm afraid I can't.|aɪm əˌfreɪd aɪ ˈkɑːnt|айм эфрэйд ай ка́нт
Don't worry.|ˌdəʊnt ˈwʌri|доунт уа́ри
Not really.|ˌnɒt ˈrɪəli|нот ри́эли
I hope so.|aɪ ˈhəʊp səʊ|ай хо́уп соу
I don't think so.|aɪ ˌdəʊnt ˈθɪŋk səʊ|ай доунт си́нк соу
What a shame!|ˌwɒt ə ˈʃeɪm|уот э шэ́йм
That's a good idea.|ˌðæts ə ˌɡʊd aɪˈdɪə|зэтс э гуд айди́э
Help yourself.|ˌhelp jɔːˈself|хэлп йосэ́лф
`;

  // ---- применение ----
  const idx = {};
  if (typeof W_BRANCHES !== 'undefined') {
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
  }
  if (typeof WORD_TR !== 'undefined') {
    TR.trim().split('\n').forEach(line => {
      const [en, ipa, ru] = line.split('|').map(s => s.trim());
      if (!en || !ipa) return;
      const k = slug(en);
      if (!WORD_TR[k]) WORD_TR[k] = [ipa, ru.replace(/[\u200b]/g, '')];
    });
  }
})();
