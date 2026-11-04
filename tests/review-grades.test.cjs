const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const DAY=864e5,MIN=6e4,now=Date.UTC(2026,10,4,12),grades=['again','hard','good','easy'];
const copy=x=>JSON.parse(JSON.stringify(x));
function fixture(){
 const c=vm.createContext({});
 vm.runInContext(app.slice(app.indexOf('const COEF_DEFAULT='),app.indexOf('function sgn('))+
 app.slice(app.indexOf('  const DAY=864e5'),app.indexOf('  const isDue='))+
 '\nthis.api={sched,reviewState,gradeDaysLabel,GRADES,COEF,applyCoef};',c);
 c.api.applyCoef({review:{ankiFuzzPct:0}});return c;
}
function record(sc,r=[0,0,0],at=now){return [sc.lv,at,(r[2]||0)+1,sc.due,sc.ivl,sc.ease,sc.state,sc.step,sc.lapse]}
const mature=(days=10,ease=2.5)=>[5,now-days*DAY,5,now,days,ease];
test('new cards offer Again 1m, Hard 6m, Good 10m and Easy 4d',()=>{
 const {api}=fixture(),r=[0,0,0];
 assert.deepEqual(copy(api.GRADES.map(x=>x.key)),grades);
 assert.deepEqual(copy(api.GRADES.map(x=>x.label)),['Снова','Трудно','Хорошо','Легко']);
 for(const [g,minutes]of [['again',1],['hard',6],['good',10]]){
  const sc=api.sched(r,g,now);assert.equal(sc.due,now+minutes*MIN);assert.equal(sc.state,1);
 }
 const easy=api.sched(r,'easy',now);assert.equal(easy.ivl,4);assert.equal(easy.state,2);
});
test('Good advances learning to graduation; Again resets the step',()=>{
 const {api}=fixture(),first=api.sched([0,0,0],'good',now),r=record(first);
 assert.equal(first.step,1);
 const again=api.sched(r,'again',first.due);assert.equal(again.step,0);assert.equal(again.due,first.due+MIN);
 const hard=api.sched(r,'hard',first.due);assert.equal(hard.step,1);assert.equal(hard.due,first.due+10*MIN);
 const good=api.sched(r,'good',first.due);assert.equal(good.state,2);assert.equal(good.ivl,1);
});
test('learning failures never reduce ease',()=>{
 const {api}=fixture();let r=[0,0,0];
 for(let i=0;i<20;i++){const sc=api.sched(r,i%2?'hard':'again',now+i*MIN);assert.equal(sc.ease,2.5);r=record(sc,r)}
});
test('mature reviews use the previous interval and ease, rather than fixed level increments',()=>{
 const {api}=fixture(),r=mature();
 assert.equal(api.sched(r,'hard',now).ivl,12);
 assert.equal(api.sched(r,'good',now).ivl,25);
 assert.equal(api.sched(r,'easy',now).ivl,33);
 assert.equal(api.sched(r,'hard',now).ease,2.35);
 assert.equal(api.sched(r,'good',now).ease,2.5);
 assert.equal(api.sched(r,'easy',now).ease,2.65);
});
test('Again enters persistent relearning; passing relearning schedules a one-day review',()=>{
 const {api}=fixture(),r=mature(60);
 const again=api.sched(r,'again',now);assert.equal(again.state,3);assert.equal(again.due,now+10*MIN);assert.equal(again.ease,2.3);
 const resumed=record(again,r),good=api.sched(resumed,'good',again.due);
 assert.equal(good.state,2);assert.equal(good.ivl,1);assert.equal(good.ease,2.3);
 assert.equal(api.sched(resumed,'hard',again.due).due,again.due+15*MIN);
});
test('overdue reviews account for lateness without resetting progress',()=>{
 const {api}=fixture(),r=mature();r[3]=now-20*DAY;
 assert.equal(api.sched(r,'hard',now).ivl,12);
 assert.equal(api.sched(r,'good',now).ivl,50);
 assert.equal(api.sched(r,'easy',now).ivl,98);
});
test('fuzz is deterministic and keeps Hard <= Good <= Easy up to the interval cap',()=>{
 const {api}=fixture();api.applyCoef({review:{ankiFuzzPct:15,maxIvl:180}});
 for(let i=0;i<100;i++){
  const r=mature(i+1),a=grades.slice(1).map(g=>api.sched(r,g,now,'t|'+i));
  assert.ok(a[0].ivl<=a[1].ivl&&a[1].ivl<=a[2].ivl);
  for(let n=0;n<a.length;n++){assert.ok(a[n].ivl<=180);assert.equal(a[n].due,api.sched(r,grades[n+1],now,'t|'+i).due)}
 }
});
test('early practice does not postpone mature cards; early learning may advance',()=>{
 const {api}=fixture(),r=mature();r[3]=now+5*DAY;
 for(const g of ['hard','good','easy']){const sc=api.sched(r,g,now);assert.equal(sc.due,r[3]);assert.equal(sc.ivl,r[4])}
 const learning=record(api.sched([0,0,0],'good',now));assert.equal(api.sched(learning,'good',now).state,2);
});
test('configured learning steps are used; review settings do not rewrite existing records',()=>{
 const {api}=fixture(),r=mature(),before=copy(r);
 api.applyCoef({review:{learnFirstMinutes:2,learnSecondMinutes:20,relearnMinutes:15,graduatingDays:2,easyDays:5}});
 assert.equal(api.sched([0,0,0],'again',now).due,now+2*MIN);
 assert.equal(api.sched([0,0,0],'good',now).due,now+20*MIN);
 assert.equal(api.sched([0,0,0],'easy',now).ivl,5);
 assert.equal(api.sched(r,'again',now).due,now+15*MIN);assert.deepEqual(r,before);
});
test('previews display short learning steps as minutes and mature reviews as days',()=>{
 const {api}=fixture();
 assert.equal(api.gradeDaysLabel(api.sched([0,0,0],'again',now),now),'1 мин');
 assert.equal(api.gradeDaysLabel(api.sched([0,0,0],'hard',now),now),'6 мин');
 assert.equal(api.gradeDaysLabel(api.sched([0,0,0],'good',now),now),'10 мин');
 assert.match(api.gradeDaysLabel(api.sched(mature(),'good',now),now),/дн\.$/);
 const evening=Date.UTC(2026,10,4,22);
 assert.equal(api.gradeDaysLabel(api.sched([0,0,0],'easy',evening),evening),'4 дн.');
});
function cardFixture(r=mature()){
 const c=fixture(),word={tid:'t',k:'bird',en:'bird',ru:'птица',note:'Подсказка'},saved=[];
 Object.assign(c,{MAXL:10,canSpeak:false,autoSay:false,esc:String,CARDS:{t:{title:'Birds'}},
  S:{mode:'session',queue:[word],flipped:true,done:0,hist:[],fails:{},seen:[],start:{}},
  prog:{t:{bird:r}},rec:(id,k)=>c.prog[id][k],lvl:(id,k)=>c.prog[id][k][0],head:()=>'',
  cardInfo:()=>({pct:50}),sayBtn:()=>'',trHTML:()=>'',extraHTML:()=>'',lvlHTML:()=>'',
  modal:{innerHTML:'',classList:{add(){}},querySelector:()=>({focus(){}})},
  needProfile:()=>false,OPEN:{},okey:id=>id,computeOpen(){},ALL:[],paint(){},stats(){},board:{applyFilter(){}},
  saveCard:(id,k)=>saved.push(c.prog[id][k]),Date:class extends Date{static now(){return now}},saved});
 vm.runInContext(app.slice(app.indexOf('  function renderCard(){'),app.indexOf('  function normAns('))+
  app.slice(app.indexOf('  function grade(g){'),app.indexOf('  function renderWait(){')),c);
 return c;
}
test('rendering exposes four ratings and collapsed examples',()=>{
 const c=cardFixture();c.renderCard();
 const buttons=[...c.modal.innerHTML.matchAll(/<button[^>]*class="grade [^"]*"[^>]*data-g="([^"]+)"[^>]*>(.*?)<\/button>/g)];
 assert.deepEqual(buttons.map(b=>b[1]),grades);
 for(const b of buttons){assert.match(b[2],/^<small>.*<\/small><span class="grade-label">/);assert.doesNotMatch(b[2],/уровень|ур\./)}
 assert.match(c.modal.innerHTML,/<details class="fc-details">/);
 assert.doesNotMatch(c.modal.innerHTML,/<details[^>]* open/);
});
test('learning cards are requeued for every short-step rating; mature ratings complete the card',()=>{
 for(const g of ['again','hard','good']){
  const c=cardFixture([0,0,0]);c.renderCard();c.renderCard=()=>{};c.grade(g);
  assert.equal(c.S.wait.length,1);assert.equal(c.S.done,0);assert.equal(c.saved[0][6],1);
 }
 const c=cardFixture();c.renderCard();c.renderCard=()=>{};c.grade('good');assert.equal(c.S.wait.length,0);assert.equal(c.S.done,1);
});
test('waiting to answer preserves the full short delay after clicking',()=>{
 const c=cardFixture([0,0,0]);c.renderCard();c.Date=class extends Date{static now(){return now+30e3}};
 c.renderCard=()=>{};c.grade('good');assert.equal(c.saved[0][3],now+30e3+10*MIN);
});
test('saved mature schedules match previews, but stale and changed records are recalculated',()=>{
 const c=cardFixture();c.renderCard();const expected=c.S.gradePreview.options.good;
 c.renderCard=()=>{};c.grade('good');assert.equal(c.saved[0][3],expected.due);assert.equal(c.saved[0][4],expected.ivl);
 const changed=cardFixture();changed.renderCard();changed.prog.t.bird=mature(20);changed.renderCard=()=>{};changed.grade('good');assert.equal(changed.saved[0][4],50);
});
test('learning state and prior interval survive cleaning, JSON storage and reload',()=>{
 const c=fixture();Object.assign(c,{MAXL:10,Date});
 vm.runInContext(app.slice(app.indexOf('  function cleanRec('),app.indexOf('  function legacySpreadDays('))+'\nthis.clean=cleanRec;',c);
 const legacy=mature(),learning=record(c.api.sched([0,0,0],'good',now));
 const relearning=record(c.api.sched(legacy,'again',now),legacy);
 const cleaned=copy(c.clean({old:legacy,learning,relearning}));
 assert.deepEqual(cleaned.old,legacy);assert.deepEqual(cleaned.learning,learning);assert.deepEqual(cleaned.relearning,relearning);
 assert.equal(c.api.sched(cleaned.learning,'good',learning[3]).state,2);
 assert.equal(c.api.sched(cleaned.relearning,'good',relearning[3]).ivl,1);
});
test('undo restores all scheduling fields and learning queues',()=>{
 const c=cardFixture(record(fixture().api.sched([0,0,0],'good',now)));
 const before=copy(c.prog.t.bird);c.renderCard();c.renderCard=()=>{};c.grade('good');
 vm.runInContext(app.slice(app.indexOf('  function undo(){'),app.indexOf('  function renderDone(){')),c);
 c.undo();assert.deepEqual(copy(c.prog.t.bird),before);assert.equal(c.S.queue.length,1);assert.equal(c.S.wait.length,0);
});
test('Space/Enter reveal then rate Good; 1-4 select ratings without a fifth grade',()=>{
 const seen=[],c=vm.createContext({S:{mode:'session',flipped:true},grade:g=>seen.push(g),flip(){c.S.flipped=true}});
 const start=app.indexOf('    onKey(ev){',app.indexOf('  const api={',app.indexOf('  function grade(g){'))),end=app.indexOf('    onClose()',start);
 vm.runInContext('this.onKey=function '+app.slice(start,end).trim().replace(/,$/,'')+';',c);
 for(const key of ['1','2','3','4',' ','Enter'])c.onKey({key,preventDefault(){}});
 assert.deepEqual(seen,['again','hard','good','easy','good','good']);
 c.onKey({key:'5'});assert.equal(seen.length,6);
 c.S.flipped=false;c.onKey({key:' ',preventDefault(){}});assert.equal(c.S.flipped,true);assert.equal(seen.length,6);
});
test('reset returns a word to new without losing undo history',()=>{
 const c=cardFixture();c.renderCard();c.renderCard=()=>{};c.grade('reset');
 assert.deepEqual(copy(c.prog.t.bird).slice(0,3),[0,now,0]);assert.equal(c.S.hist.length,1);
});
test('a correct typed answer reveals the card without jumping its level or saving an automatic grade',()=>{
 const c=cardFixture([0,0,0]),input={value:'bird',focus(){}};
 c.S.flipped=false;c.S.kbox=true;c.modal.querySelector=()=>input;
 c.answers=()=>new Set(['bird']);c.normAns=s=>s;c.renderCard=()=>{};
 vm.runInContext(app.slice(app.indexOf('  function checkKnown(){'),app.indexOf('  function flip(){')),c);
 c.checkKnown();assert.equal(c.S.flipped,true);assert.equal(c.S.kcorrect,'bird');
 assert.equal(c.saved.length,0);assert.equal(c.prog.t.bird[0],0);
});
test('due learning cards take priority; look-ahead is used only when no other cards remain',()=>{
 const c=cardFixture(),word=c.S.queue[0];c.S.flipped=false;
 c.S.wait=[{w:word,due:now+10*MIN}];c.renderCard();assert.equal(c.S.wait.length,1);
 c.S.queue=[];c.renderCard();assert.equal(c.S.wait.length,0);assert.equal(c.S.queue.length,1);
});
test('topic sessions keep all due cards ahead of the configured number of new words',()=>{
 const c=fixture(),words=Array.from({length:25},(_,i)=>({k:'new'+i}));
 words.push({k:'due'},{k:'early'});
 Object.assign(c,{CARDS:{t:{words}},SESSION:Infinity,shuffle:a=>a,
  rec:(id,k)=>k==='due'?mature():k==='early'?[8,now,2,now+DAY,60,2.5]:[0,0,0],
  isNew:r=>!r[3]&&!r[2]&&!r[0],isDue:r=>!!r[3]&&r[3]<=now,Date:class extends Date{static now(){return now}}});
 vm.runInContext(app.slice(app.indexOf('  function pickWords('),app.indexOf('  function openLocked('))+'\nthis.pick=pickWords;',c);
 const result=c.pick('t');assert.equal(result.words.length,21);assert.equal(result.words[0].k,'due');
 assert.ok(!result.words.some(w=>w.k==='early'));
});
