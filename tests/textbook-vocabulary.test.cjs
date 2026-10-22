const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Search=require('../catalog-search.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8').replace(/\r\n/g,'\n');
const c=vm.createContext({console});
const run=s=>vm.runInContext(s,c), json=s=>JSON.parse(run('JSON.stringify('+s+')'));
for(const f of ['data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-ef-course.js'])run(read(f));
const before=json('W_BRANCHES');
for(const f of ['data-textbook-vocabulary.js','data-textbook-topics.js','textbook-vocabulary.js'])run(read(f));
const d=json('({wordBranches:W_BRANCHES,course:BEGINNER_COURSE,grammarBranches:G_BRANCHES,topicBooks:WORD_TOPIC_BOOKS,entryMetadata:WORD_ENTRY_METADATA,entries:TEXTBOOK_ENTRIES,aliases:WORD_PROGRESS_ALIASES,legacy:[...WORD_LEGACY_TOPICS]})');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';
const rows=branches=>branches.flatMap(b=>['cells','extra'].flatMap(part=>Object.entries(b[part]||{}).flatMap(([level,cards])=>cards.flatMap(card=>card[3].split(';').filter(r=>r.trim()).map(row=>{
 const [en,ru,p]=row.split('|').map(s=>s.trim());return {id:card[0],k:slug(en),en,ru,p,level,extra:part==='extra'};
})))));
const after=rows(d.wordBranches), keys=new Set(after.map(w=>w.id+'|'+w.k));
const index=Search.createIndex(d), entries=Object.values(d.entries);
const app=read('app.js');
run('const prog={}; const CARDS={}; this.records=prog;');
for(const w of after)run('CARDS['+JSON.stringify(w.id)+'] ||= {words:[],extra:'+w.extra+',level:'+JSON.stringify(w.level)+'}; CARDS['+JSON.stringify(w.id)+'].words.push('+JSON.stringify({...w,tid:w.id})+');');
run(app.slice(app.indexOf('  function rec(id,k){'),app.indexOf('  const lvl=(id,k)=>rec(id,k)[0];')));
run(app.slice(app.indexOf('  function courseWords('),app.indexOf('  function courseInfo(')));
run('this.courseWords=courseWords;this.rec=rec;');

test('2162 canonical meanings resolve to 2162 distinct live progress keys',()=>{
 assert.equal(entries.length,2162);assert.equal(new Set(entries.map(e=>e.topicId+'|'+e.wordKey)).size,2162);
 for(const e of entries)assert.ok(keys.has(e.topicId+'|'+e.wordKey),e.id);
 assert.equal(keys.size,after.length);
});
test('all 67 lessons preserve 2443 canonical entry references',()=>{
 assert.equal(d.course.length,67);assert.equal(d.course.filter(l=>l.book==='PI').length,42);assert.equal(d.course.filter(l=>l.book==='INT').length,25);
 assert.equal(d.course.reduce((n,l)=>n+l.entryIds.length,0),2443);
 for(const l of d.course){const words=c.courseWords(l.id,null,'all');assert.equal(words.length,l.entryIds.length,l.id);assert.equal(new Set(words.map(w=>w.tid+'|'+w.k)).size,words.length);}
 assert.equal(entries.filter(e=>e.lesson_ids.length>1).length,240);
});
test('every pre-import word record remains reachable directly or through aliases',()=>{
 const reachable=new Set([...keys,...Object.values(d.aliases).flat().map(a=>a.join('|'))]);
 for(const w of rows(before))assert.ok(reachable.has(w.id+'|'+w.k),w.id+'|'+w.k);
 for(const e of entries)for(const [id,k] of e.matches)assert.ok(e.topicId+'|'+e.wordKey===id+'|'+k||(d.aliases[e.topicId+'|'+e.wordKey]||[]).some(a=>a[0]===id&&a[1]===k));
});
test('520 existing meanings are reused and all new topics participate in pending-write restoration',()=>{
 assert.equal(entries.filter(e=>e.matches.length).length,520);
 for(const e of entries.filter(e=>!e.matches.length))assert.ok(d.legacy.includes(e.topicId));
 assert.match(app,/new Set\(\[\.\.\.ALL,\.\.\.WORD_LEGACY_TOPICS\]\)/);
});
test('plural forms reuse earlier progress while different senses stay separate',()=>{
 for(const en of ['sock','shoe','trainer','shelf','parent']){const e=entries.find(e=>e.english===en);assert.ok(e.matches.length,en);}
 for(const en of ['cold','tip','mouse','offer','painting']){
  const es=entries.filter(e=>e.english.toLowerCase()===en);assert.ok(es.length>=2,en);
  assert.equal(new Set(es.map(e=>e.topicId+'|'+e.wordKey)).size,es.length,en);
 }
 const animalTrainer=after.find(w=>w.en==='trainer'&&w.ru.includes('тренер'));
 const shoe=entries.find(e=>e.english==='trainer');assert.ok(animalTrainer);assert.notEqual(shoe.topicId+'|'+shoe.wordKey,animalTrainer.id+'|'+animalTrainer.k);
});
test('all occurrences use a shared record including due dates, review count and explicit resets',()=>{
 const e=entries.find(e=>e.lesson_ids.length>1&&e.matches.length>1);
 const [oldId,oldK]=e.matches.find(m=>m[0]!==e.topicId||m[1]!==e.wordKey);
 const record=[8,100,6,999999,45,2.6];c.records[oldId]={[oldK]:record};
 for(const lesson of e.lesson_ids){const w=c.courseWords(lesson,null,'all').find(w=>w.tid===e.topicId&&w.k===e.wordKey);assert.ok(w);assert.deepEqual([...c.rec(w.tid,w.k)],record);}
 c.records[e.topicId]={[e.wordKey]:[0,200,6]};
 for(const lesson of e.lesson_ids){const w=c.courseWords(lesson,null,'all').find(w=>w.tid===e.topicId&&w.k===e.wordKey);assert.equal(c.rec(w.tid,w.k)[0],0);}
});
test('shared words appear only once in global inventory and review selection',()=>{
 const code=app.slice(app.indexOf('  function lvWords('),app.indexOf('  function rvCounts('));
 run('const ALL=Object.keys(CARDS);'+code+';this.reviewWords=lvWords;');
 const words=c.reviewWords(['A1','A2','B1','B2'],'all');
 assert.equal(words.length,after.length);assert.equal(new Set(words.map(w=>w.tid+'|'+w.k)).size,words.length);
});
test('search disambiguates identical lesson codes by book and keeps location identity',()=>{
 for(const book of ['PI','INT']){
  const result=Search.find(index,book+' 1A');assert.equal(result.groups.lessons.length,1);assert.equal(result.groups.lessons[0].courseId,book+'-1A');
  assert.ok(result.groups.topics.every(i=>i.book===book));
 }
 const shared=entries.find(e=>e.lesson_ids.some(id=>id.startsWith('PI-'))&&e.lesson_ids.some(id=>id.startsWith('INT-')));
 for(const book of ['PI','INT']){
  const code=shared.lesson_ids.find(id=>id.startsWith(book+'-')).slice(book.length+1);
  const item=Search.find(index,book+' '+code+' '+shared.english).groups.words.find(w=>w.topicId===shared.topicId&&w.wordKey===shared.wordKey);
  assert.ok(item,book);assert.equal(item.location.book,book);assert.ok(item.location.codes.includes(code));
 }
});
test('rule links use textbook identity rather than accidentally linking Elementary to Pre-Intermediate',()=>{
 const pi=Search.related(index,'1A','A2','words','PI');assert.ok(pi.some(i=>i.courseId==='PI-1A'));assert.ok(pi.every(i=>i.book==='PI'));
 assert.equal(Search.related(index,'4A','A2','rules','ELEMENTARY').length,0);
 assert.ok(Search.related(index,'4A','A2','rules','PI').length);
 assert.ok(Search.related(index,'1A','B1','words','INT').some(i=>i.courseId==='INT-1A'));
});
test('lesson search targets a visible lesson topic without invoking a dialog',()=>{
 for(const lesson of d.course){const ids=Search.topicIds({courseId:lesson.id},d.course);assert.ok(ids.length);for(const id of ids)assert.ok(after.some(w=>w.id===id));assert.equal(d.topicBooks[ids[0]],lesson.book,lesson.id+' should focus its own book');}
 const focus=read('catalog-search.js').split('function focusTopic(item) {')[1].split("    input.addEventListener")[0];
 assert.match(focus,/search-topic-hit/);assert.match(focus,/scrollIntoView/);assert.doesNotMatch(focus,/openCourse|openModal|openTopic/);
});
test('the checked-in browser catalog matches the editable source',()=>{
 assert.deepEqual(json('TEXTBOOK_VOCABULARY'),JSON.parse(read('data/textbook-vocabulary.json')));
});
test('forms and contextual examples remain searchable without becoming duplicate cards',()=>{
 for(const en of ['sock','watch']){
  const entry=entries.find(e=>e.english===en), query=entry.variants[0]||entry.examples[0];
  assert.ok(Search.find(index,query).groups.words.some(w=>w.topicId===entry.topicId&&w.wordKey===entry.wordKey));
 }
});
test('typing a listed plural uses the canonical progress key',()=>{
 const source=read('type-to-know.js'),entry=entries.find(e=>e.english==='shelf');
 const sandbox={WORD_ENTRY_METADATA:d.entryMetadata,WORD_PROGRESS_ALIASES:d.aliases};vm.createContext(sandbox);
 vm.runInContext(source.slice(source.indexOf('  const norm ='),source.indexOf("  document.addEventListener('submit'"))+';this.ok=ok;',sandbox);
 assert.equal(sandbox.ok('shelves',{id:entry.topicId,k:entry.wordKey,en:'shelf'},entry.translation_ru),true);
});

test('new vocabulary lives only in Extra within the existing thematic branches',()=>{
 assert.deepEqual(d.wordBranches.map(b=>b.key),before.map(b=>b.key));
 assert.equal(d.wordBranches.some(b=>b.key==='textbooks'),false);
 const oldKeys=JSON.parse(read('tests/fixtures/textbook-progress-keys.json'));
 for(const e of entries.filter(e=>!e.matches.length)){
  const word=after.find(w=>w.id===e.topicId&&w.k===e.wordKey);
  assert.ok(word.extra,e.english);
  const [oldId,oldK]=oldKeys[e.id];
  assert.ok(d.aliases[e.topicId+'|'+e.wordKey].some(a=>a[0]===oldId&&a[1]===oldK),e.id);
  assert.ok(d.legacy.includes(oldId),oldId);
  const record=[8,300,7,987654321,45,2.6];
  c.records[oldId]||={}; c.records[oldId][oldK]=record;
  assert.deepEqual([...c.rec(e.topicId,e.wordKey)],record,e.id);
  c.records[e.topicId]||={}; c.records[e.topicId][e.wordKey]=[0,400,7];
  assert.equal(c.rec(e.topicId,e.wordKey)[0],0,'reset '+e.id);
  delete c.records[oldId][oldK]; delete c.records[e.topicId][e.wordKey];
 }
 assert.equal(Object.keys(oldKeys).length,1642);
 for(const b of d.wordBranches) for(const cards of Object.values(b.extra||{})) for(const card of cards.filter(c=>c[0].startsWith('efx-'))){
  assert.ok(card[3].split(';').filter(Boolean).length<=24,card[0]);
  assert.doesNotMatch(card[1],/Textbook|Intermediate|New entries/);
 }
});

test('mixed lessons are distributed by meaning, not by their lesson number',()=>{
 const examples={blouse:'shopping',behind:'basics',sink:'home',sunny:'nature',passport:'town',beard:'people',ibuprofen:'body',keyboard:'work',crab:'food',goalkeeper:'free',million:'time'};
 for(const [en,branch] of Object.entries(examples)){
  const e=entries.find(e=>e.english===en&&!e.matches.length);
  assert.ok(e,en);
  assert.ok(d.wordBranches.find(b=>b.key===branch).extra[after.find(w=>w.id===e.topicId).level].some(c=>c[0]===e.topicId),en);
 }
 const newCards=new Map(d.wordBranches.flatMap(b=>Object.values(b.extra||{}).flat().map(c=>[c[0],c])));
 const phone=entries.find(e=>e.english==='phone call');assert.match(newCards.get(phone.topicId)[1],/Phones/);
 const drug=entries.filter(e=>e.english==='drug');assert.equal(new Set(drug.map(e=>e.topicId+'|'+e.wordKey)).size,drug.length);
});

test('the separate textbook panel and full-lesson redirects are removed',()=>{
 const html=read('index.html');
 assert.doesNotMatch(html,/textbook-course\.(js|css)/);
 assert.ok(html.indexOf('data-textbook-topics.js')<html.indexOf('src="textbook-vocabulary.js'));
 assert.doesNotMatch(app,/WORD_TOPIC_COURSE/);
 for(const l of d.course) assert.doesNotMatch(l.source,/\bWB\b/);
});

