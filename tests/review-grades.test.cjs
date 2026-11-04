const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const DAY=864e5, now=Date.UTC(2026,10,4,12);
const grades=['again','hard','same','good','easy'];
function fixture(){
  const c=vm.createContext({});
  vm.runInContext(app.slice(app.indexOf('const COEF_DEFAULT='),app.indexOf('function sgn('))+
    app.slice(app.indexOf('  const DAY=864e5'),app.indexOf('  const isDue='))+
    '\nthis.api={sched,gradeSpread,gradeDaysLabel,GRADES,COEF,applyCoef};',c);
  c.api.applyCoef({review:Object.fromEntries(['again','hard','same','good','easy'].map(g=>[g+'JitterPct',0]))});
  return c;
}
test('five ratings change every level by -2, -1, 0, +1, +2 with bounds 0-10',()=>{
  const {api}=fixture();
  for(let lv=0;lv<=10;lv++) for(const early of [false,true]){
    const r=[lv,now-DAY,3,now+(early?DAY:-DAY),5,2.5];
    grades.forEach((g,i)=>{
      const sc=api.sched(r,g,now,'t|bird');
      assert.equal(sc.lv,Math.max(0,Math.min(10,lv+i-2)),lv+' '+g+' '+early);
      assert.ok(sc.due>now);assert.ok(sc.ivl>0);
    });
  }
});
test('all five options use the resulting level interval, including levels 0 and 1',()=>{
  const {api}=fixture();
  for(let lv=0;lv<10;lv++) for(const g of grades){
    const sc=api.sched([lv,0,0],g,now,'t|bird');
    assert.equal(sc.ivl,api.COEF.review['level'+sc.lv+'Days']);
  }
  assert.equal(api.sched([2,0,1], 'again',now).ivl,1);
  assert.equal(api.sched([2,0,1], 'hard',now).ivl,2);
  api.applyCoef({review:{level0Days:0.25,level1Days:0.5,againJitterPct:0,hardJitterPct:0}});
  assert.equal(api.sched([2,0,1],'again',now).due,now+0.25*DAY);
  assert.equal(api.sched([2,0,1],'hard',now).due,now+0.5*DAY);
});
test('spread is configured separately for all five buttons and remains stable',()=>{
  const {api}=fixture(), r=[5,12345,3];
  for(const g of grades){
    api.applyCoef({review:Object.fromEntries(grades.map(k=>[k+'JitterPct',k===g?30:0]))});
    const a=api.sched(r,g,now,'t|bird'),b=api.sched(r,g,now,'t|bird');
    assert.equal(a.ivl,b.ivl);assert.equal(a.due,b.due);
    assert.ok(a.ivl>=api.COEF.review['level'+a.lv+'Days']*0.7-0.001);
    assert.ok(a.ivl<=api.COEF.review['level'+a.lv+'Days']*1.3+0.001);
    for(const other of grades.filter(k=>k!==g))assert.equal(api.gradeSpread(r,other,'t|bird'),1);
  }
});
test('button labels stay in days for fractions, months and years',()=>{
  const {api}=fixture();
  for(const days of [0.01,0.25,0.5,1,3,60,180,365,3650]){
    const label=api.gradeDaysLabel({ivl:days,due:now+days*DAY},now);
    assert.match(label,/^[\d\s,]+ дн\.$/u);
    const amount=Number(label.replace(' дн.','').replace(/\s/g,'').replace(',','.'));
    assert.equal(amount,days);
  }
});
function cardFixture(){
  const c=fixture(),word={tid:'t',k:'bird',en:'bird',ru:'птица'},saved=[];
  Object.assign(c,{MAXL:10,canSpeak:false,autoSay:false,esc:String,CARDS:{t:{title:'Birds'}},
    S:{mode:'session',queue:[word],flipped:true,done:0,hist:[],fails:{},seen:[],start:{}},
    prog:{t:{bird:[5,now-DAY,3,now-1,15,2.5]}},
    rec:(id,k)=>c.prog[id][k],lvl:(id,k)=>c.prog[id][k][0],head:()=>'',
    cardInfo:()=>({pct:50}),sayBtn:()=>'',trHTML:()=>'',extraHTML:()=>'',lvlHTML:()=>'',
    modal:{innerHTML:'',classList:{add(){}},querySelector:()=>({focus(){}})},
    needProfile:()=>false,OPEN:{},okey:id=>id,computeOpen(){},ALL:[],paint(){},stats(){},board:{applyFilter(){}},
    saveCard:(id,k)=>saved.push(c.prog[id][k]),Date:class extends Date{static now(){return now}},saved});
  vm.runInContext(app.slice(app.indexOf('  function renderCard(){'),app.indexOf('  function normAns('))+
    app.slice(app.indexOf('  function grade(g){'),app.indexOf('  function renderWait(){')),c);
  return c;
}
test('rendered card has five ordered buttons with days and no level transitions',()=>{
  const c=cardFixture();c.renderCard();
  const buttons=[...c.modal.innerHTML.matchAll(/<button[^>]*class="grade [^"]*"[^>]*data-g="([^"]+)"[^>]*>(.*?)<\/button>/g)];
  assert.deepEqual(buttons.map(b=>b[1]),grades);
  for(const [,key,html]of buttons){
    assert.match(html,/<small>[\d\s,]+ дн\.<\/small>/u);
    assert.doesNotMatch(html,/ур\.|уровень|→|->|мес\.|мин/);
  }
});
test('saved interval and due date equal the preview even across a study-day boundary',()=>{
  for(const g of grades){
    const c=cardFixture();c.renderCard();
    const expected=c.S.gradePreview.options[g];
    c.Date=class extends Date{static now(){return now+DAY}};
    c.renderCard=()=>{};c.grade(g);
    assert.equal(c.saved.length,1);
    assert.equal(c.saved[0][0],expected.lv);
    assert.equal(c.saved[0][3],expected.due);
    assert.equal(c.saved[0][4],expected.ivl);
  }
});
test('an incoming progress change is used instead of a stale preview',()=>{
  const c=cardFixture();c.renderCard();c.prog.t.bird=[8,now,4,now+DAY,60,2.5];
  c.renderCard=()=>{};c.grade('hard');assert.equal(c.saved[0][0],7);
});
test('a card left open past its preview date receives a future due date',()=>{
  const c=cardFixture();c.renderCard();
  c.Date=class extends Date{static now(){return now+365*DAY}};
  c.renderCard=()=>{};c.grade('same');assert.ok(c.saved[0][3]>now+365*DAY);
});
test('number keys 1-5 follow the button order and only rate a revealed card',()=>{
  const seen=[],c=vm.createContext({S:{mode:'session',flipped:true},grade:g=>seen.push(g)});
  const start=app.indexOf('    onKey(ev){',app.indexOf('  const api={',app.indexOf('  function grade(g){')));
  const end=app.indexOf('    onClose()',start);
  vm.runInContext('this.onKey=function '+app.slice(start,end).trim().replace(/,$/,'')+';',c);
  for(const key of ['1','2','3','4','5'])c.onKey({key,preventDefault(){}});
  assert.deepEqual(seen,grades);
  c.S.flipped=false;c.onKey({key:'3'});assert.equal(seen.length,5);
});
test('reset and the separate known-word check retain their behavior',()=>{
  const {api}=fixture(),r=[8,now-DAY,2,now+5*DAY,60,2.5];
  const known=api.sched(r,'known',now);assert.equal(known.lv,8);assert.equal(known.due,r[3]);
  assert.equal(api.sched([0,0,0],'known',now).lv,8);
  assert.equal(api.sched(r,'reset',now).lv,0);assert.equal(api.sched(r,'reset',now).due,0);
});
