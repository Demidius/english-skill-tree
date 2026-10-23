// Формы глаголов (V1 · V2 · V3) для всех глаголов и глагольных фраз, у которых их ещё нет.
// Подключается после data-*.js и до app.js.
(function () {
  if (typeof W_BRANCHES === 'undefined' || typeof WORD_EX === 'undefined') return;
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'w';
  // неправильные глаголы: base past participle (варианты через /)
  const IRR = `be was/were been;bear bore born;beat beat beaten;become became become;begin began begun;bend bent bent;bet bet bet;bind bound bound;bite bit bitten;bleed bled bled;blow blew blown;break broke broken;breed bred bred;bring brought brought;broadcast broadcast broadcast;build built built;burn burnt/burned burnt/burned;burst burst burst;buy bought bought;catch caught caught;choose chose chosen;cling clung clung;come came come;cost cost cost;creep crept crept;cut cut cut;deal dealt dealt;dig dug dug;do did done;draw drew drawn;dream dreamt/dreamed dreamt/dreamed;drink drank drunk;drive drove driven;eat ate eaten;fall fell fallen;feed fed fed;feel felt felt;fight fought fought;find found found;flee fled fled;fly flew flown;forbid forbade forbidden;forecast forecast forecast;forget forgot forgotten;forgive forgave forgiven;freeze froze frozen;get got got;give gave given;go went gone;grind ground ground;grow grew grown;hang hung hung;have had had;hear heard heard;hide hid hidden;hit hit hit;hold held held;hurt hurt hurt;keep kept kept;kneel knelt/kneeled knelt/kneeled;know knew known;lay laid laid;lead led led;lean leant/leaned leant/leaned;learn learnt/learned learnt/learned;leave left left;lend lent lent;let let let;lie lay lain;light lit lit;lose lost lost;make made made;mean meant meant;meet met met;mislead misled misled;misunderstand misunderstood misunderstood;mow mowed mown/mowed;outgrow outgrew outgrown;overcome overcame overcome;overspend overspent overspent;oversleep overslept overslept;overtake overtook overtaken;pay paid paid;put put put;quit quit quit;read read read;rewrite rewrote rewritten;ride rode ridden;ring rang rung;rise rose risen;run ran run;say said said;see saw seen;seek sought sought;sell sold sold;send sent sent;set set set;shake shook shaken;shine shone shone;shoot shot shot;show showed shown;shrink shrank shrunk;shut shut shut;sing sang sung;sink sank sunk;sit sat sat;sleep slept slept;slide slid slid;smell smelt/smelled smelt/smelled;speak spoke spoken;spell spelt/spelled spelt/spelled;spend spent spent;spill spilt/spilled spilt/spilled;spin spun spun;split split split;spoil spoilt/spoiled spoilt/spoiled;spread spread spread;stand stood stood;steal stole stolen;stick stuck stuck;sting stung stung;stink stank stunk;strike struck struck;swear swore sworn;sweep swept swept;swim swam swum;swing swung swung;take took taken;teach taught taught;tear tore torn;tell told told;think thought thought;throw threw thrown;undergo underwent undergone;unwind unwound unwound;understand understood understood;upset upset upset;wake woke woken;wear wore worn;win won won;wind wound wound;withdraw withdrew withdrawn;write wrote written`;
  const irr = {};
  IRR.split(';').forEach(s => { const [b, p, pp] = s.trim().split(' '); irr[b] = [p, pp]; });
  irr.overeat = ['overate', 'overeaten'];
  // удвоение согласной перед -ed (брит.)
  const DBL = new Set('acquit admit beg cancel chat clog commit control drop flap grab grin hug hum jog kidnap knit label mop nod occur patrol plan plug prefer refer regret rob scrub ship shop shrug sip skip slip stop swap transfer travel trip unplug zip'.split(' '));
  function ed(b) {
    if (DBL.has(b)) return b + b.slice(-1) + 'ed';
    if (b === 'panic' || b === 'picnic') return b + 'ked';
    if (/e$/.test(b)) return b + 'd';
    if (/[^aeiou]y$/.test(b)) return b.slice(0, -1) + 'ied';
    return b + 'ed';
  }
  // base — инфинитив из подсказки в переводе: «сидел, сел (sit)» → sit.
  // Карточка с прошедшей формой (sat, went, watched…) получает полную тройку от инфинитива.
  function forms(phrase, base) {
    const words = phrase.split(' ');
    const b = base || words[0].toLowerCase(), rest = words.slice(1).join(' ');
    const tail = rest ? ' ' + rest : '';
    const v1 = base ? base + tail : phrase;
    if (b === 'can') return [['can', 'could', '—'], 1];
    const ir = irr[b];
    if (ir) {
      const p = ir[0].split('/').map(x => x + tail).join(' / ');
      const pp = ir[1].split('/').map(x => x + tail).join(' / ');
      return [[v1, p, pp], 1];
    }
    const e = ed(b) + tail;
    return [[v1, e, e], 0];
  }
  function baseHint(en, ru) {
    const m = /\(([a-z]+)[):]/.exec(ru || '');
    const first = en.split(' ')[0].toLowerCase();
    if (!m || m[1] === first) return null;
    const h = m[1];
    // подсказка засчитывается, только если слово на карточке и правда форма этого глагола
    if (h === 'can') return first === 'could' ? h : null;
    if (irr[h]) return (irr[h][0] + '/' + irr[h][1]).split('/').includes(first) ? h : null;
    return ed(h) === first ? h : null;
  }
  // глагольные фразы без отметки «глагол»: первое слово — глагол
  const VERBISH = new Set(`accept add agree apologise argue ask be believe belong book borrow brush buy call care catch change check clean clear collect commit compare consist cook cross cut do drill drink eat empty extend fall feed feel fill find follow get give go grab grow hand have iron keep laugh leave lend listen live look lose make meet move mow pass pay pick plan plant play put raise reach read reduce register ride run save say see sell send set shake share sign sing sit skip sleep sort spare spend stay succeed support take talk tell think tone track travel try turn wait walk wash waste watch wear win work write`.split(' '));
  // не глаголы или устойчивые выражения без форм
  const SKIP = new Set(['cc', 'set-in', 'look-out', 'take-care', 'have-a-good-trip', 'set-menu', 'spare-time', 'spare-room', 'spare-key']);
  W_BRANCHES.forEach(br => ['cells', 'extra'].forEach(p => Object.values(br[p] || {}).forEach(cs => cs.forEach(c => {
    if (!c || typeof c[3] !== 'string') return;
    c[3].split(';').forEach(x => {
      const f = x.split('|').map(s => s.trim());
      const en = f[0], ru = f[1], pos = f[2];
      if (!en || /[?.!…\/]/.test(en) || /^[A-Z]/.test(en)) return;
      const first = en.split(' ')[0].toLowerCase();
      const isVerb = pos === 'v' || (pos === 'o' && en.includes(' ') && VERBISH.has(first));
      if (!isVerb) return;
      const k = slug(en);
      if (SKIP.has(k)) return;
      const d = WORD_EX[k];
      const base = baseHint(en, ru);
      // у прошедших форм тройка всегда считается заново: старые данные бывали ошибочны (sat · sated · sated)
      if (d && d[0] && !base) return;
      const [fm, ir] = forms(en, base);
      if (d) { d[0] = fm; d[1] = ir; }
      else WORD_EX[k] = [fm, ir, '', '', '', '', [], [], ''];
    });
  }))));
})();
