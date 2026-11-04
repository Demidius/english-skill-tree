const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const app=read('app.js'),DAY=864e5,MIN=6e4,now=Date.UTC(2026,10,4,12);
const grades=['again','hard','good','easy'],copy=x=>JSON.parse(JSON.stringify(x));
function fixture(review={}){
 const c=vm.createContext({});
 vm.runInContext(app.slice(app.indexOf('const COEF_DEFAULT='),app.indexOf('function sgn('))+
  app.slice(app.indexOf('  const DAY=864e5'),app.indexOf('  const isDue='))+
  '\nthis.api={sched,whenLabel,GRADE_STEP,COEF,applyCoef};',c);
 c.api.applyCoef({review:{againJitterPct:0,hardJitterPct:0,goodJitterPct:0,easyJitterPct:0,...review}});
 return c;
}
const dueRecord=(level=5)=>[level,now-10*DAY,5,now,10,2.5];
function cardFixture(r=dueRecord()){
 const c=fixture(),word={tid:'t',k:'bird',en:'bird',ru:'птица'},saved=[];
 Object.assign(c,{MAXL:10,canSpeak:false,autoSay:false,esc:String,CARDS:{t:{title:'Birds'}},
  S:{mode:'session',queue:[word],flipped:true,done:0,hist:[],fails:{},seen:[],start:{}},
  prog:{t:{bird:r}},rec:(id,k)=>c.prog[id][k],lvl:(id,k)=>c.prog[id][k][0],head:()=>'',
  cardInfo:()=>({pct:50}),sayBtn:()=>'',trHTML:()=>'',extraHTML:()=>'<div>Синонимы</div>',lvlHTML:()=>'',
  modal:{innerHTML:'',classList:{add(){}},querySelector:()=>({focus(){}})},
  needProfile:()=>false,OPEN:{},okey:id=>id,computeOpen(){},ALL:[],paint(){},stats(){},board:{applyFilter(){}},
  saveCard:(id,k)=>saved.push(copy(c.prog[id][k])),Date:class extends Date{static now(){return now}},saved});
 vm.runInContext(app.slice(app.indexOf('  function renderCard(){'),app.indexOf('  function normAns('))+
  app.slice(app.indexOf('  function grade(g){'),app.indexOf('  function renderWait(){')),c);
 return c;
}
test('the morning ratings lower by two, keep, raise by one and raise by two',()=>{
 const {api}=fixture();
 assert.deepEqual(copy(api.GRADE_STEP),{again:-2,hard:0,good:1,easy:2});
 assert.deepEqual(grades.map(g=>api.sched(dueRecord(),g,now).lv),[3,5,6,7]);
 assert.deepEqual(grades.map(g=>api.sched(dueRecord(),g,now).ivl),[5,15,20,30]);
});
test('new words use the configured level intervals and the short Forgot timer',()=>{
 const {api}=fixture({level0Days:0.5,level1Days:0.5,level2Days:1,againMinutes:10}),r=[0,0,0];
 assert.equal(api.sched(r,'again',now).due,now+10*MIN);
 assert.deepEqual(grades.map(g=>api.sched(r,g,now).lv),[0,0,1,2]);
 for(const g of ['hard','good'])assert.equal(api.sched(r,g,now).due,now+0.5*DAY);
 assert.equal(api.whenLabel(0.5,now+0.5*DAY,now),'12 ч');
 assert.equal(api.whenLabel(1,api.sched(r,'easy',now).due,now),'1 дн.');
});
test('Forgot requeues weak words; other ratings finish this review',()=>{
 for(const g of grades){
  const c=cardFixture([0,0,0]);c.renderCard=()=>{};c.grade(g);
  assert.equal(c.S.wait.length,g==='again'?1:0);
  assert.equal(c.S.done,g==='again'?0:1);
  assert.equal(c.saved[0].length,6);
 }
});
test('levels stay within 0-10 and maximum intervals are respected',()=>{
 const {api}=fixture({maxIvl:180});
 assert.equal(api.sched(dueRecord(1),'again',now).lv,0);
 for(const g of ['good','easy']){
  const result=api.sched([10,now-DAY,5,now,180,2.5],g,now);
  assert.equal(result.lv,10);assert.equal(result.ivl,180);
 }
});
test('early practice preserves positive ratings and existing due dates',()=>{
 const {api}=fixture(),r=[8,now-DAY,4,now+20*DAY,60,2.5];
 for(const g of ['good','easy']){
  const sc=api.sched(r,g,now);assert.equal(sc.lv,8);assert.equal(sc.due,r[3]);assert.equal(sc.ivl,r[4]);
 }
 assert.equal(api.sched(r,'again',now).lv,6);
});
test('per-rating random spread is stable between the preview and saving',()=>{
 const {api}=fixture({againJitterPct:10,hardJitterPct:10,goodJitterPct:15,easyJitterPct:20});
 for(let i=0;i<30;i++)for(const g of grades){
  const r=dueRecord(),key='t|'+i,sc=api.sched(r,g,now,key);
  assert.deepEqual(copy(sc),copy(api.sched(r,g,now,key)));
  const base={again:5,hard:15,good:20,easy:30}[g],pct={again:10,hard:10,good:15,easy:20}[g]/100;
  assert.ok(sc.ivl>=base*(1-pct)-0.001&&sc.ivl<=base*(1+pct)+0.001);
 }
});
test('four buttons show the original labels, interval and level transition',()=>{
 const c=cardFixture();c.renderCard();
 const buttons=[...c.modal.innerHTML.matchAll(/<button[^>]*class="grade [^"]*"[^>]*data-g="([^"]+)"[^>]*>(.*?)<\/button>/g)];
 assert.deepEqual(buttons.map(b=>b[1]),grades);
 for(const [i,label] of ['Забыл','Трудно','Хорошо','Отлично'].entries()){
  assert.ok(buttons[i][2].startsWith(label+'<small>'));
  assert.match(buttons[i][2],/class="g-lv"/);assert.match(buttons[i][2],/ур\. 5/);
 }
 assert.match(c.modal.innerHTML,/Синонимы/);assert.doesNotMatch(c.modal.innerHTML,/<details/);
 assert.match(c.modal.innerHTML,/data-g="reset">Обнулить/);
});
test('mobile layout restores the two by two button grid',()=>{
 assert.match(read('style.css'),/@media \(max-width: 720px\)\{[\s\S]*?\.grades\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\);\}/);
});
test('previously saved Anki records retain level, review count and due date when read',()=>{
 const c=fixture();c.MAXL=10;c.Date=Date;
 vm.runInContext(app.slice(app.indexOf('  function cleanRec('),app.indexOf('  function legacySpreadDays('))+'\nthis.clean=cleanRec;',c);
 for(const suffix of [[2,0,0],[1,1,0],[3,0,1]]){
  const r=[5,now,7,now+DAY,1,2.3,...suffix],cleaned=copy(c.clean({bird:r},1)).bird;
  assert.deepEqual(cleaned,r.slice(0,6));
 }
});
test('restored ratings work with records saved by the Anki version',()=>{
 const c=cardFixture([...dueRecord(),2,0,0]);c.renderCard=()=>{};c.grade('good');
 assert.equal(c.saved[0][0],6);assert.equal(c.saved[0][2],6);assert.equal(c.saved[0][4],20);
});
test('undo restores the complete prior record and queue',()=>{
 const original=[...dueRecord(),3,0,1],c=cardFixture(original);c.renderCard=()=>{};c.grade('good');
 vm.runInContext(app.slice(app.indexOf('  function undo(){'),app.indexOf('  function renderDone(){')),c);
 c.undo();assert.deepEqual(copy(c.prog.t.bird),original);assert.equal(c.S.queue.length,1);assert.equal(c.S.done,0);
});
test('I Know restores the level-eight shortcut after a correct typed answer',()=>{
 const c=cardFixture([0,0,0]),input={value:'bird',focus(){}};let rating;
 c.S.flipped=false;c.S.kbox=true;c.modal.querySelector=()=>input;
 c.answers=()=>new Set(['bird']);c.normAns=s=>s;c.grade=g=>{rating=g};
 vm.runInContext(app.slice(app.indexOf('  function checkKnown(){'),app.indexOf('  function flip(){')),c);
 c.checkKnown();assert.equal(rating,'known');assert.equal(c.S.kdone.en,'bird');
 assert.equal(c.api.sched([0,0,0],'known',now).lv,8);
});
test('keyboard 1-4 selects ratings and 0 resets; Space reveals the answer',()=>{
 const seen=[],c=vm.createContext({S:{mode:'session',flipped:true},grade:g=>seen.push(g),flip(){c.S.flipped=true}});
 const start=app.indexOf('    onKey(ev){',app.indexOf('  const api={',app.indexOf('  function grade(g){'))),end=app.indexOf('    onClose()',start);
 vm.runInContext('this.onKey=function '+app.slice(start,end).trim().replace(/,$/,'')+';',c);
 for(const key of ['1','2','3','4','0'])c.onKey({key,preventDefault(){}});
 assert.deepEqual(seen,['again','hard','good','easy','reset']);
 c.S.flipped=false;c.onKey({key:' ',preventDefault(){}});assert.equal(c.S.flipped,true);
});
test('waiting repeats do not appear before their assigned time',()=>{
 const c=cardFixture(),word=c.S.queue[0];c.S.flipped=false;c.S.wait=[{w:word,due:now+10*MIN}];
 c.renderCard();assert.equal(c.S.wait.length,1);assert.equal(c.S.queue.length,1);
});

