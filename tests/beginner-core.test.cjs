const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Search=require('../catalog-search.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const plain=v=>JSON.parse(JSON.stringify(v));
const ctx=vm.createContext({console}),run=s=>vm.runInContext(s,ctx);
const files=['learning-core.js','data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-a1-phrases.js','data-word-dedupe.js','data-beginner-course.js','beginner-curriculum.js'];
for(const f of files)run(read(f));
run(`function inventory(){return W_BRANCHES.flatMap(b=>['cells','extra'].flatMap(part=>Object.entries(b[part]||{}).flatMap(([level,cards])=>cards.flatMap(c=>c[3].split(';').filter(r=>r.trim()).map(row=>{const [en,ru,p,ex,note]=row.split('|').map(s=>s.trim());const k=en.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';return {id:c[0],k,en,ru,p,ex,note,part,level};})))));}`);
const before=plain(run('inventory()')),oldLessons=plain(run('BEGINNER_COURSE'));
for(const f of ['data-beginner-core.js','beginner-core.js'])run(read(f));
const after=plain(run('inventory()')),lessons=plain(run('BEGINNER_COURSE')),aliases=plain(run('WORD_PROGRESS_ALIASES'));
const byKey=new Map(after.map(w=>[w.id+'|'+w.k,w]));
const destination=old=>byKey.has(old.id+'|'+old.k)?old.id+'|'+old.k:Object.keys(aliases).find(k=>byKey.has(k)&&aliases[k].some(([id,key])=>id===old.id&&key===old.k));

test('core partition keeps every word, meaning, example and progress source',()=>{
  assert.equal(after.length,before.length);
  assert.equal(byKey.size,after.length);
  for(const old of before){
    const key=destination(old);assert.ok(key,'Missing '+old.en);
    const current=byKey.get(key);
    for(const field of ['en','ru','p','ex','note','level'])assert.equal(current[field],old[field],old.en+' / '+field);
    assert.ok(run(`WORD_LEGACY_TOPICS.has(${JSON.stringify(old.id)})`));
  }
  assert.equal(after.filter(w=>w.level==='A1'&&w.part==='cells').length,1320);
  assert.equal(after.filter(w=>w.level==='A1'&&w.part==='extra').length,1215);
});
test('every lesson and subtopic stays in order and resolves after partition',()=>{
  assert.equal(lessons.length,oldLessons.length);
  lessons.forEach((l,i)=>{
    assert.equal(l.code,oldLessons[i].code);assert.equal(l.sections.length,oldLessons[i].sections.length);
    l.sections.forEach((s,j)=>{
      assert.equal(s.title,oldLessons[i].sections[j].title);
      assert.equal(s.refs.length,oldLessons[i].sections[j].refs.length);
      s.refs.forEach((r,k)=>{
        assert.ok(byKey.has(r[0]+'|'+r[1]),r[2]);
        assert.deepEqual(r.slice(2),oldLessons[i].sections[j].refs[k].slice(2));
      });
    });
    if(l.kind!=='reference')assert.ok(l.sections.flatMap(s=>s.refs).some(([id,k])=>byKey.get(id+'|'+k).part==='cells'),l.code);
  });
});
test('editorial selection retains main sets and conversational phrases, moves incidental material',()=>{
  const part=en=>after.find(w=>w.en===en&&w.id.startsWith('efb-'))?.part;
  for(const en of ['family','mother','red','fourteen','Monday','How was your day?','Enjoy your stay.','have breakfast','go to work'])assert.equal(part(en),'cells',en);
  for(const en of ['barista','pyramids','trilogy','psychic','iceberg','miso soup','twenty-two','word stress','Present Simple'])assert.equal(part(en),'extra',en);
  const alphabet=lessons.find(l=>l.code==='PE1').sections.find(s=>s.title==='Алфавит');
  assert.ok(alphabet.refs.every(([id,k])=>byKey.get(id+'|'+k).part==='extra'));
  assert.equal(new Set(alphabet.refs.map(r=>r[0]+'|'+r[1])).size,26);
});
const app=read('app.js');
run(`const prog={};${app.slice(app.indexOf('  function rec(id,k){'),app.indexOf('  const lvl=(id,k)=>rec(id,k)[0];'))}
const CARDS={};inventory().forEach(w=>{const c=CARDS[w.id]||(CARDS[w.id]={extra:w.part==='extra',words:[]});c.words.push({...w,tid:w.id});});
const lvl=(id,k)=>rec(id,k)[0],isNew=r=>!r[0]&&!r[2]&&!r[3],isDue=(r,n)=>r[3]?r[3]<=n:!!(r[0]||r[2]);
let S=null;const api={},modal={innerHTML:'',classList:{add(){}}};
function needProfile(){return false;}function shuffle(a){return a;}function openModal(){}function renderCard(){}function lvHead(){return '';}
${app.slice(app.indexOf('function progressStats('),app.indexOf('function cefrProgressHTML('))}
${app.slice(app.indexOf('  function courseWords('),app.indexOf('  function pickWords('))}
this.prog=prog;this.rec=rec;this.courseWords=courseWords;this.courseInfo=courseInfo;this.start=openCourseSession;this.session=()=>S;`);
test('new Extra cards retain full previous course records and older legacy records',()=>{
  const moved=before.filter(w=>destination(w)!==w.id+'|'+w.k);
  assert.ok(moved.length>400);
  for(const old of moved){
    const [id,k]=destination(old).split('|');Object.keys(ctx.prog).forEach(x=>delete ctx.prog[x]);
    const record=[8,2000,12,900000,45,2.6];ctx.prog[old.id]={[old.k]:record};assert.equal(ctx.rec(id,k),record);
    const legacy=aliases[id+'|'+k].find(([tid])=>!tid.startsWith('efb-'));
    if(legacy){ctx.prog[legacy[0]]={[legacy[1]]:[5,1000,7,800000,20,2.3]};assert.equal(ctx.rec(id,k),record);}
    ctx.prog[id]={[k]:[0,3000,0]};assert.equal(ctx.rec(id,k)[0],0);
    delete ctx.prog[id][k];assert.equal(ctx.rec(id,k),record);
  }
  Object.keys(ctx.prog).forEach(x=>delete ctx.prog[x]);
});
test('base and supplementary practice are disjoint, exhaustive and respect due dates',()=>{
  for(const lesson of lessons){
    const base=plain(ctx.courseWords(lesson.id,null)),extra=plain(ctx.courseWords(lesson.id,null,'extra')),all=plain(ctx.courseWords(lesson.id,null,'all'));
    const key=w=>w.tid+'|'+w.k,baseKeys=new Set(base.map(key));
    assert.ok(extra.every(w=>!baseKeys.has(key(w))));
    assert.deepEqual([...base.map(key),...extra.map(key)].sort(),all.map(key).sort());
    assert.ok(base.every(w=>byKey.get(key(w)).part==='cells'));
    assert.ok(extra.every(w=>byKey.get(key(w)).part==='extra'));
  }
  const lesson=lessons.find(l=>l.code==='1A'),optional=ctx.courseWords(lesson.id,null,'extra'),now=Date.now();
  const [future,due]=optional;ctx.prog[future.tid]={[future.k]:[8,now,10,now+864e5,45,2.5]};
  (ctx.prog[due.tid]||={})[due.k]=[8,now-864e5,10,now-1,45,2.5];
  ctx.start(lesson.id,null,'extra');const s=ctx.session();
  assert.equal(s.part,'extra');assert.ok(!s.queue.some(w=>w.tid===future.tid&&w.k===future.k));
  assert.ok(s.queue.some(w=>w.tid===due.tid&&w.k===due.k));
  assert.ok(s.queue.every(w=>byKey.get(w.tid+'|'+w.k).part==='extra'));
  Object.keys(ctx.prog).forEach(x=>delete ctx.prog[x]);
});
test('search finds supplementary words at their updated lesson location',()=>{
  const data=plain(run('({wordBranches:W_BRANCHES,course:BEGINNER_COURSE,grammarBranches:G_BRANCHES})'));
  const index=Search.createIndex(data);
  const barista=Search.find(index,'barista').groups.words.find(w=>w.title==='barista');
  assert.ok(barista.extra);assert.equal(barista.location.courseId,'efb-1a');assert.ok(byKey.has(barista.topicId+'|'+barista.wordKey));
  assert.ok(!Search.find(index,'family').groups.words.find(w=>w.title==='family').extra);
  assert.ok(Search.find(index,'APP5').groups.lessons.length);
  const instruction=Search.find(index,'word stress').groups.words.find(w=>w.title==='word stress');
  assert.ok(instruction.extra);assert.equal(instruction.location.courseId,'efb-app5');
});
