const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Core=require('../learning-core.js');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('app.js'),json=v=>JSON.parse(JSON.stringify(v));
function clock(){let n=0;const jobs=new Map();return {jobs,setTimer(fn,delay){jobs.set(++n,{fn,delay});return n},clearTimer(id){jobs.delete(id)}};}
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject};}
function queue(send,extra={}){const time=clock();return {time,q:Core.createWriteQueue({...time,send,...extra})};}

test('a second word reviewed during a write remains pending after the first acknowledgement',async()=>{
 const first=deferred(),sent=[];
 const {q}=queue((id,p)=>{sent.push(json(p));return sent.length===1?first.promise:Promise.resolve()});
 q.put('topic',{first:[2,1,1]});const flight=q.flush('topic');await Promise.resolve();
 q.put('topic',{second:[8,2,1]});first.resolve();await flight;
 assert.equal(q.pending('topic'),true);await q.flush('topic');
 assert.deepEqual(sent,[{first:[2,1,1]},{second:[8,2,1]}]);assert.equal(q.pending(),false);
});
test('an older acknowledgement cannot discard a newer edit of the same word',async()=>{
 const first=deferred(),sent=[];
 const {q}=queue((id,p)=>{sent.push(json(p));return sent.length===1?first.promise:Promise.resolve()});
 q.put('t',{word:[2]});const flight=q.flush('t');await Promise.resolve();
 q.put('t',{word:[8]});first.resolve();await flight;await q.flush('t');
 assert.deepEqual(sent,[{word:[2]},{word:[8]}]);
});
test('failed writes stay journalled and retry, including after a reload',async()=>{
 let journal,errors=0;
 const {q,time}=queue(()=>Promise.reject({code:'unavailable'}),{save:data=>journal=json(data),onError:()=>errors++});
 q.put('t',{word:[8,10,1]});await q.flush('t');
 assert.equal(q.pending(),true);assert.equal(errors,1);assert.equal([...time.jobs.values()][0].delay,1000);
 assert.deepEqual(journal,{t:{word:[8,10,1]}});
 const sent=[],fresh=queue((id,p)=>{sent.push(json(p));return Promise.resolve()},{save:data=>journal=json(data)}).q;
 fresh.restore(journal);await fresh.flushAll();assert.deepEqual(sent,[{word:[8,10,1]}]);assert.deepEqual(journal,{});
});
test('remote snapshots merge untouched words while preserving unsaved edits and deletions',()=>{
 const {q}=queue(()=>Promise.resolve());q.put('t',{mine:[8],removed:null});
 assert.deepEqual(q.overlay('t',{mine:[0],other:[4],removed:[2]}),{mine:[8],other:[4]});
});
test('browser adapter merges only changed words and captures the original owner',async()=>{
 const sent=[],journal=new Map(),time=clock();let q;
 const c={SkillCore:{createWriteQueue:o=>(q=Core.createWriteQueue({...o,...time}))},queues:new Map(),local:false,current:'alice',ME:'alice',DOCV:3,
   prog:{topic:{a:[8,1,1],untouched:[0,0,0]}},canWrite:()=>true,onWriteError:assert.fail,
   localStorage:{setItem:(k,v)=>journal.set(k,v)},lsGet:k=>journal.get(k),firebase:{firestore:{FieldValue:{delete:()=>null}}},
   db:{collection:p=>({doc:id=>({set:(payload,opts)=>{sent.push({p,id,payload:json(payload),opts});return Promise.resolve()}})})},
   window:{addEventListener(){}},document:{getElementById:()=>({hidden:true})}};
 vm.createContext(c);vm.runInContext(app.slice(app.indexOf('  function queueFor('),app.indexOf('  function select(pid){',app.indexOf('  function queueFor('))),c);
 vm.runInContext('saveCard("topic","a")',c);c.current='bob';await q.flushAll();
 assert.equal(sent[0].p,'profiles/alice/cards');assert.deepEqual(sent[0].payload.w,{a:[8,1,1]});assert.equal(sent[0].opts.merge,true);
});
test('two devices changing different words do not overwrite each other',async()=>{
 const server={a:[0],b:[0]},send=(id,p)=>{Object.assign(server,p);return Promise.resolve()};
 const a=queue(send).q,b=queue(send).q;a.put('t',{a:[8]});b.put('t',{b:[2]});
 await a.flushAll();await b.flushAll();assert.deepEqual(server,{a:[8],b:[2]});
});
test('rule codes parse +2 completely and preserve following rules',()=>{
 assert.deepEqual(Core.parseRuleCode('Code:\nEFST1|ABCDEF1234567890|cl-rel:2:+2|mod-haveto:0:+|past:3:-|other:4:0\n'),{
 tag:'ABCDEF1234567890',items:[{id:'cl-rel',from:2,sign:2},{id:'mod-haveto',from:0,sign:1},{id:'past',from:3,sign:-1},{id:'other',from:4,sign:0}]});
 for(const text of ['EFST1|ABCD|cl-rel:2:+3|other:0:+','EFST1|ABCD|cl-rel:11:+','EFST1|ABCD|cl-rel:2:+2oops','EFST1|ABCD|cl-rel:2:+|broken'])assert.equal(Core.parseRuleCode(text),null);
 assert.equal(Core.parseRuleCode('EFST1|ABCD|cl-rel:2:+').items[0].sign,1);
});
test('an old code cannot propose a fresh increment after a level has moved',()=>{
 const source=read('prompts.js'),c={SkillCore:Core,COEF:{rulesPractice:{ok:1,wrong:-2}},GMAX:10,rules:()=>[{id:'cl-rel',lv:2}]};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('  function parseCode('),source.indexOf('  // ---------- окно'))+'\nthis.result=plan(parseCode("EFST1|ABCD|cl-rel:0:+"));',c);
 assert.equal(c.result[0].on,false);assert.equal(c.result[0].to,2);
});
function ruleStore(){
 const records=new Map([['profiles/alice/progress/cl-rel',{lv:0,read:true}]]);
 const c={local:false,current:'alice',needProfile:()=>false,STATUS_FROM_OLD:{},gstatus:l=>l?'learning':'not_started',
   db:{doc:p=>p,async runTransaction(fn){const writes=[];const result=await fn({get:async p=>({exists:records.has(p),data:()=>records.get(p)}),set:(p,v,o)=>writes.push([p,v,o])});writes.forEach(([p,v,o])=>records.set(p,o?.merge?{...records.get(p),...v}:v));return result;}}};
 vm.createContext(c);vm.runInContext(app.slice(app.indexOf('  async function applyRuleCode('),app.indexOf('  // ---- tests ----'))+'\nthis.apply=applyRuleCode;',c);
 return {records,apply:c.apply};
}
test('server ledger blocks a repeated AI code even after resetting the level',async()=>{
 const {records,apply}=ruleStore();await apply('ABCD',[{id:'cl-rel',from:0,to:2}]);
 assert.equal(records.get('profiles/alice/progress/cl-rel').lv,2);assert.equal(records.get('profiles/alice/progress/cl-rel').read,true);
 records.set('profiles/alice/progress/cl-rel',{lv:0,read:true});
 assert.equal((await apply('ABCD',[{id:'cl-rel',from:0,to:2}])).alreadyUsed,true);
 assert.equal(records.get('profiles/alice/progress/cl-rel').lv,0);
});
test('stale previews cannot overwrite a rule changed on another device',async()=>{
 const {records,apply}=ruleStore();records.set('profiles/alice/progress/cl-rel',{lv:3});
 await assert.rejects(apply('ABCD',[{id:'cl-rel',from:0,to:1}]),/Уровни изменились/);
 assert.equal(records.has('profiles/alice/progress/__prompt_ABCD'),false);assert.equal(records.get('profiles/alice/progress/cl-rel').lv,3);
});
const callbacks={},front={textContent:''};
const context=vm.createContext({SkillCore:Core,EX_RU:{},window:{},MutationObserver:class{observe(){}},
 document:{addEventListener(n,fn){(callbacks[n]||=[]).push(fn)},createElement(){return{}},head:{appendChild(){}},body:{},querySelector:()=>front}});
const run=s=>vm.runInContext(s,context),data=expr=>json(run(expr));
for(const p of ['data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-a1-phrases.js','data-word-dedupe.js','verb-forms.js'])run(read(p));
const rows=data("W_BRANCHES.flatMap(b=>['cells','extra'].flatMap(p=>Object.values(b[p]||{}).flatMap(cs=>cs.flatMap(c=>c[3].split(';').filter(s=>s.trim()).map(s=>{const f=s.split('|').map(x=>x.trim());return {id:c[0],en:f[0],ru:f[1],p:f[2]};})))))");
run(app.slice(app.indexOf('  function normAns('),app.indexOf('  function renderKnownOk('))+'\nthis.accepts=(en,t)=>answers(en).has(normAns(t));');
run(read('extras.js').split('// Единый блок на ПК:')[0]);run(read('type-to-know.js'));
function accepts(en,typed){
 const row=rows.find(r=>r.en===en);assert.ok(row,en);front.textContent=row.ru;
 const inp={value:typed,focus(){},select(){}},form={dataset:{},classList:{contains:()=>true},querySelector:s=>s==='#knownIn'?inp:null};
 const event={target:form,preventDefault(){this.blocked=true},stopPropagation(){}};
 for(const callback of callbacks.submit||[]){callback(event);if(event.blocked)break;}
 return !event.blocked&&context.accepts(en,inp.value);
}
test('answer pipeline rejects false contractions and possessive expansions',()=>{
 for(const [en,typed] of [["It's free.",'It has free'],["It's raining.",'It has raining'],["chemist's",'chemist has'],["get on someone's nerves",'get on someone has nerves']])assert.equal(accepts(en,typed),false,typed);
 for(const [en,typed] of [["It's free.",'It is free'],["It's raining.",'It is raining'],["chemist's","chemist's"]])assert.equal(accepts(en,typed),true,typed);
});
test('articles stay flexible without accepting a/an mistakes',()=>{
 assert.equal(accepts('ride a horse','ride an horse'),false);assert.equal(accepts('ride a horse','ride the horse'),true);
 assert.equal(Core.articleEquivalent('take an exam','take a exam'),false);assert.equal(Core.articleEquivalent('take an exam','take the exam'),true);
});
test('parenthetical hints cannot accept arbitrary trailing words',()=>{
 assert.equal(accepts('work for','work for banana nonsense'),false);assert.equal(accepts('work for','work for a company'),true);
 assert.equal(accepts('be late for','be late for school'),true);
});
test('specified phrasal verbs accept word-order variants and reject one-word synonyms',()=>{
 assert.equal(accepts('give back a book','return the book'),false);assert.equal(accepts('give back a book','give the book back'),true);
 assert.match(rows.find(r=>r.en==='give back a book').ru,/фразовый глагол/);
});
test('bilingual duplicates are consolidated while distinct senses remain',()=>{
 assert.equal(rows.length,4328);assert.equal(new Set(rows.map(r=>r.en.toLowerCase()+'|'+r.ru)).size,rows.length);
 assert.ok(rows.some(r=>r.en==='pick up'&&r.ru.includes('заехать')));assert.ok(rows.some(r=>r.en==='take off'));
});
test('old duplicate progress survives, including a later explicit reset',()=>{
 run('const prog={};'+app.slice(app.indexOf('  function rec(id,k){'),app.indexOf('  const lvl=(id,k)=>rec(id,k)[0];'))+'\nthis.prog=prog;this.rec=rec;');
 const [target,sources]=Object.entries(data('WORD_PROGRESS_ALIASES')).find(([k])=>k.endsWith('|reliable'));
 const [id,k]=target.split('|'),[oldId,oldK]=sources[0];context.prog[oldId]={[oldK]:[8,100,5,1000,45,2.5]};
 assert.equal(context.rec(id,k)[0],8);context.prog[id]={[k]:[0,200,0]};assert.equal(context.rec(id,k)[0],0);
 assert.ok(data('WORD_LEGACY_TOPICS.has('+JSON.stringify(oldId)+')'));
});
test('overeat has the correct irregular forms',()=>{assert.deepEqual(data('WORD_EX.overeat[0]'),['overeat','overate','overeaten']);});
test('an early check cannot raise a known word or postpone its due date',()=>{
 const c={COEF:{review:{hardPct:120,easyPct:130,maxIvl:365}}};vm.createContext(c);
 vm.runInContext(app.slice(app.indexOf('  const DAY=864e5'),app.indexOf('  function whenLabel('))+'\nthis.sched=sched;',c);
 const last=Date.UTC(2026,0,1),now=last+40*864e5,due=last+45*864e5;
 const result=c.sched([8,last,2,due,45,2.5],'known',now);assert.equal(result.lv,8);assert.equal(result.due,due);
 assert.equal(c.sched([0,0,0],'known',now).lv,8);
});
test('topic sessions select only new or due words, including due level-10 words',()=>{
 const words=[{k:'new'},{k:'early'},{k:'due'},{k:'mastered'}],now=Date.now();
 const records={new:[0,0,0],early:[8,1,1,now+864e5],due:[2,1,1,now-1],mastered:[10,1,1,now-1]};
 const c={CARDS:{t:{words}},rec:(id,k)=>records[k],isNew:r=>!r[3]&&!r[2]&&!r[0],isDue:(r,n)=>r[3]?r[3]<=n:!!(r[2]||r[0]),shuffle:a=>a,SESSION:Infinity};
 vm.createContext(c);vm.runInContext(app.slice(app.indexOf('  function pickWords('),app.indexOf('  function openLocked('))+'\nthis.result=pickWords("t");',c);
 assert.deepEqual(json(c.result.words.map(w=>w.k)),['new','due','mastered']);
});
test('empty CEFR filters remain empty after reloading',()=>{
 const expr=app.match(/let rvLv=(.*);\n/)[1],c={lsGet:()=>'',RVKEY:'test',LEVELS:['A1','A2','B1','B2'].map(key=>({key}))};
 assert.deepEqual(json(vm.runInNewContext(expr,c)),[]);
});
