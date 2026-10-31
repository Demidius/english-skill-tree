const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const ctx={console};ctx.window=ctx;
vm.createContext(ctx);
for(const file of ['data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-ef-course.js','data-textbook-vocabulary.js','data-textbook-topics.js','textbook-vocabulary.js','verb-forms.js','word-audit.js','word-audit-2.js','word-details-data.js'])
 vm.runInContext(read(file),ctx,{filename:file});
ctx.esc=value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
ctx.trBtn=()=>'';ctx.sayBtn=()=>'<button>audio</button>';
const app=read('app.js'),begin=app.indexOf('  function extraHTML(w){'),end=app.indexOf('  function exampleHTML(w){',begin);
vm.runInContext(app.slice(begin,end)+'\nvar renderDetails=extraHTML;',ctx);
const branches=JSON.parse(vm.runInContext('JSON.stringify(W_BRANCHES)',ctx));
const support=JSON.parse(vm.runInContext('JSON.stringify(WORD_DETAILS)',ctx));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';
const words=[];
for(const b of branches)for(const part of ['cells','extra'])for(const cards of Object.values(b[part]||{}))for(const card of cards)for(const row of card[3].split(';')){
 const f=row.split('|').map(s=>s.trim());if(!f[0])continue;
 words.push({tid:card[0],en:f[0],ru:f[1]||'',p:['n','v','a','o'].includes(f[2])?f[2]:'n',ex:f[3]||'',k:slug(f[0])});
}
test('every active word has a visible usage example and both relationship sections',()=>{
 assert.equal(words.length,6012);assert.equal(Object.keys(support).length,words.length);
 for(const w of words){
  const key=w.tid+'|'+w.k,h=ctx.renderDetails(w);
  assert.ok(support[key],key);
  assert.ok(w.ex||h.includes('class="wx-ex"'),'no visible example: '+key);
  assert.match(h,/Синонимы и близкие выражения/);
  assert.match(h,/Антонимы и противоположные выражения/);
 }
});
test('sentence examples are not labelled as a fabricated grammar tense',()=>{
 const w=words.find(w=>w.en==="I'm back.");
 const h=ctx.renderDetails(w);
 assert.match(h,/Пример/);assert.doesNotMatch(h,/Present Simple|Past Simple|Present Perfect|Present Continuous/);
 assert.match(h,/returned/);
});
test('examples and relations keep different senses separate',()=>{
 const medicine=support['efx-pi-health-1|drug'],illegal=support['efx-pi-health-2|drug'];
 assert.match(medicine[0][0][0],/doctor/i);assert.match(illegal[0][0][0],/police|illegal/i);
 assert.ok(medicine[1].some(([s])=>s==='medicine'));
 assert.ok(!illegal[1].some(([s])=>s==='medicine'));
 assert.match(support['efx-pi-wordformation-1|fly'][0][0][0],/birds/i);
 assert.match(support['efx-pi-animals-1|fly'][0][0][0],/sandwich/i);
 assert.notEqual(support['efx-int-wordformation-2|fortune'][0][0][0],support['efx-int-money-1|fortune'][0][0][0]);
});
test('gaps have honest notes instead of invented lexical opposites',()=>{
 const w=words.find(w=>w.en==='Switzerland');
 const h=ctx.renderDetails(w);
 assert.match(h,/нет прямого антонима/);
 assert.doesNotMatch(h,/<em>.*(?:Poland|China|Sweden)/);
});
test('supplemental content is escaped in text and translation attributes',()=>{
 const key='test|test';
 vm.runInContext("WORD_DETAILS['test|test']=[[[\"<img src=x>\",\"\\\" onclick=\\\"x\"]],[[\"<script>\",\"<b>\"]],[],0];",ctx);
 const h=ctx.renderDetails({tid:'test',k:'test',en:'test',p:'o'});
 assert.ok(!h.includes('<img'));assert.ok(!h.includes('<script>'));
 assert.match(h,/&lt;img/);assert.match(h,/&quot; onclick=&quot;x/);
 vm.runInContext("delete WORD_DETAILS['test|test'];",ctx);
});
test('past and participle examples do not contain malformed infinitive templates',()=>{
 for(const row of Object.values(support))for(const [en] of row[0]){
  assert.ok(en.trim().split(/\s+/).length>=3,en);
  assert.doesNotMatch(en,/We need to (?:was|were|had|ate|slept|thought|took|been|eaten|given|spoken|taken|could|fell|flew|gave|knew|rang|sang|swam|taught|understood)\b/i);
  assert.doesNotMatch(en,/There were less than people|between the windows people|I am from\./i);
 }
});
test('returning home accepts genuine paraphrases while a typo still needs correction',()=>{
 const Core=require('../learning-core.js'),listeners=[];
 const document={head:{appendChild(){}},body:{},createElement:()=>({}),addEventListener:(name,fn)=>listeners.push({name,fn})};
 class MutationObserver{observe(){}}
 new Function('document','MutationObserver','SkillCore',read('type-to-know.js'))(document,MutationObserver,Core);
 function check(answer){
  const en="I'm back.",inp={value:answer};
  const form={classList:{contains:c=>c==='kbox'},dataset:{wordId:'efa1-11b-2',wordEn:en},querySelector:()=>inp};
  document.querySelector=()=>({textContent:'Я вернулся.'});
  for(const l of listeners.filter(l=>l.name==='submit'))l.fn({target:form});
  return inp.value===en;
 }
 for(const answer of ['I returned',"I've returned",'I have returned','I am back'])assert.equal(check(answer),true,answer);
 for(const answer of ['I retund','I left',"I'm away"])assert.equal(check(answer),false,answer);
});
test('the data is loaded before the renderer',()=>{
 const index=read('index.html');
 assert.ok(index.indexOf('word-details-data.js')<index.indexOf('<script src="app.js'));
});

test('an early flight has a natural paraphrase and contrasting expression',()=>{
 const row=support['efa1-11b-2|an-early-flight'];
 assert.ok(row[1].some(([text])=>/early in the day/.test(text)));
 assert.ok(row[2].some(([text])=>text==='a late flight'));
});
