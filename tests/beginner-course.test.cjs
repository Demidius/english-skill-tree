const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8').replace(/\r\n/g,'\n');
const plain=v=>JSON.parse(JSON.stringify(v));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';
const ctx=vm.createContext({console});
const run=s=>vm.runInContext(s,ctx);
for(const f of ['learning-core.js','data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-a1-phrases.js','data-word-dedupe.js'])run(read(f));
run(`function inventory(){return W_BRANCHES.flatMap(b=>['cells','extra'].flatMap(part=>Object.entries(b[part]||{}).flatMap(([level,cards])=>cards.flatMap(c=>c[3].split(';').filter(s=>s.trim()).map(s=>{const f=s.split('|').map(s=>s.trim());return {id:c[0],level,part,en:f[0],ru:f[1],p:f[2],ex:f[3]||'',note:f[4]||''};})))));}`);
const before=plain(run('inventory()'));
for(const f of ['data-beginner-course.js','beginner-curriculum.js','verb-forms.js'])run(read(f));
const after=plain(run('inventory()')),lessons=plain(run('BEGINNER_COURSE')),aliases=plain(run('WORD_PROGRESS_ALIASES'));
const byKey=new Map(after.map(r=>[r.id+'|'+slug(r.en),r]));
const allRefs=lessons.flatMap(l=>l.sections.flatMap(s=>s.refs));
const app=read('app.js');

test('all 24 lessons, six practical episodes and six reviews follow the books',()=>{
 assert.equal(lessons.filter(l=>l.kind==='lesson').length,24);
 assert.equal(lessons.filter(l=>l.kind==='practical').length,6);
 assert.equal(lessons.filter(l=>l.kind==='review').length,6);
 assert.equal(lessons.filter(l=>l.kind==='reference').length,5);
 assert.deepEqual(lessons.slice(0,6).map(l=>l.code),['1A','1B','PE1','2A','2B','R1']);
 assert.deepEqual(lessons.slice(30,36).map(l=>l.code),['11A','11B','PE6','12A','12B','R11']);
 assert.equal(lessons.reduce((n,l)=>n+l.sections.length,0),110);
 assert.equal(allRefs.length,2526);
 for(const l of lessons){
  assert.ok(l.title&&l.ru);
  if(l.kind!=='reference')assert.match(l.source,/^SB /);
  for(const s of l.sections){assert.ok(s.refs.length>0,s.title);assert.equal(s.refs.length,s.words.length);}
 }
});

test('every course entry resolves to an A1 base word and former gaps are available',()=>{
 assert.equal(byKey.size,after.length,'No two active words share a progress key');
 for(const [id,k,en,ru] of allRefs){const row=byKey.get(id+'|'+k);assert.ok(row,en);assert.equal(row.level,'A1');assert.equal(row.part,'cells');assert.ok(ru);}
 for(const en of ['Switzerland','Swiss','fourteen','seventy','omelette','drama','spa','cereal','healthy','platform','journalist','Enjoy your stay.','How was your day?']){
  assert.ok(allRefs.some(r=>r[2].toLowerCase().replace(/[.!?]$/,'')===en.toLowerCase().replace(/[.!?]$/,'')),en);
 }
 for(const row of after.filter(r=>r.level==='A1'&&r.part==='cells'))assert.ok(allRefs.some(([id,k])=>id===row.id&&k===slug(row.en)));
});

test('all pre-existing words survive in place or through a migration alias',()=>{
 const sources=new Set(Object.values(aliases).flat().map(pair=>pair.join('|')));
 for(const old of before){const key=old.id+'|'+slug(old.en);assert.ok(byKey.has(key)||sources.has(key),'Lost word/progress: '+key);}
 for(const row of after.filter(r=>r.level==='A1'&&r.part==='extra')){
  assert.ok(before.some(old=>old.id===row.id&&old.en===row.en&&old.ru===row.ru),'Extra must retain existing vocabulary');
 }
 for(const old of before.filter(r=>r.level!=='A1')){
  const current=byKey.get(old.id+'|'+slug(old.en));if(current)assert.deepEqual(current,old,'Unrelated higher-level word changed');
 }
 for(const id of [...new Set(before.map(r=>r.id)),...new Set(after.map(r=>r.id))])assert.ok(run('WORD_LEGACY_TOPICS.has('+JSON.stringify(id)+')'),id);
});

test('repeated words share one record and alphabet letters keep their own records',()=>{
 const family=allRefs.filter(r=>r[2].toLowerCase()==='hotel');assert.ok(family.length>=2);
 assert.equal(new Set(family.map(r=>r.slice(0,2).join('|'))).size,1);
 const alphabet=lessons.find(l=>l.code==='PE1').sections.find(s=>s.title==='Алфавит');
 assert.equal(alphabet.refs.length,26);assert.equal(new Set(alphabet.refs.map(r=>r.slice(0,2).join('|'))).size,26);
 assert.ok(!lessons.find(l=>l.code==='APP1').sections.flatMap(s=>s.refs).some(r=>r[0]===alphabet.refs[0][0]&&r[1]===alphabet.refs[0][1]));
});

test('textbook numbers and plural forms are not left in Extra because of old tags',()=>{
 for(const en of ['mother','daughter','children','eleven','thirteen','first','twentieth']){
  const source=before.find(r=>r.level==='A1'&&r.en===en);assert.ok(source,en);
  assert.ok(!after.some(r=>r.level==='A1'&&r.part==='extra'&&r.en===en),en);
  assert.ok(Object.entries(aliases).some(([key,refs])=>key.startsWith('efb-')&&refs.some(([id,k])=>id===source.id&&k===slug(en))),en);
 }
});

run('const prog={};'+app.slice(app.indexOf('  function rec(id,k){'),app.indexOf('  const lvl=(id,k)=>rec(id,k)[0];'))+'\nthis.prog=prog;this.rec=rec;');
test('moved words retain full SRS records, newest edits, explicit resets and undo',()=>{
 const migrations=Object.entries(aliases).filter(([key,sources])=>key.startsWith('efb-')&&sources.length);
 assert.ok(migrations.length>400);
 for(const [target,sources] of migrations){
  const [id,k]=target.split('|');
  for(const [oldId,oldK] of sources){
   Object.keys(ctx.prog).forEach(id=>delete ctx.prog[id]);
   const previous=[8,1000,12,900000,45,2.6];ctx.prog[oldId]={[oldK]:previous};
   assert.equal(ctx.rec(id,k),previous);
   ctx.prog[id]={[k]:[2,2000,13,950000,1,2.4]};assert.equal(ctx.rec(id,k)[0],2);
   ctx.prog[id][k]=[0,3000,0];assert.equal(ctx.rec(id,k)[0],0);
   delete ctx.prog[id][k];assert.equal(ctx.rec(id,k),previous);
  }
 }
 Object.keys(ctx.prog).forEach(id=>delete ctx.prog[id]);
});

run(`const CARDS={}; inventory().forEach(r=>{const c=CARDS[r.id]||(CARDS[r.id]={words:[]});c.words.push({...r,k:(${slug.toString()})(r.en),tid:r.id});});
 const lvl=(id,k)=>rec(id,k)[0];const isNew=r=>!r[3]&&!r[2]&&!r[0];const isDue=(r,n)=>r[3]?r[3]<=n:!!(r[2]||r[0]);
 let S=null;const api={};const modal={innerHTML:'',classList:{add(){}}};
 function needProfile(){return false;}function shuffle(a){return a;}function openModal(){}function renderCard(){}function lvHead(){return '';}
 ${app.slice(app.indexOf('function progressStats('),app.indexOf('function cefrProgressHTML('))}
 ${app.slice(app.indexOf('  function courseWords('),app.indexOf('  function pickWords('))}
 this.courseWords=courseWords;this.courseInfo=courseInfo;this.startCourse=openCourseSession;this.getSession=()=>S;`);
test('lesson practice selects only new/due words and writes to their canonical topics',()=>{
 const lesson=lessons.find(l=>l.code==='1A'),words=ctx.courseWords(lesson.id,null),now=Date.now();
 const [a,b,c]=words;
 ctx.prog[a.tid]={[a.k]:[8,now,5,now+864e5,45,2.5]};
 (ctx.prog[b.tid]||={})[b.k]=[10,now-864e5,8,now-1,180,2.5];
 (ctx.prog[c.tid]||={})[c.k]=[2,now-864e5,3,now-1,1,2.5];
 ctx.startCourse(lesson.id,null);const s=ctx.getSession();
 assert.equal(s.course,lesson.id);assert.equal(s.queue.length,words.length-1);
 assert.ok(!s.queue.some(w=>w.tid===a.tid&&w.k===a.k));
 assert.ok(s.queue.some(w=>w.tid===b.tid&&w.k===b.k));
 assert.equal(new Set(s.queue.map(w=>w.tid+'|'+w.k)).size,s.queue.length);
 for(const w of s.queue)assert.ok(byKey.has(w.tid+'|'+w.k));
 const sectionWords=ctx.courseWords(lesson.id,1);ctx.startCourse(lesson.id,1);
 assert.deepEqual(plain(ctx.getSession().queue.map(w=>w.k)),plain(sectionWords.map(w=>w.k)));
 Object.keys(ctx.prog).forEach(id=>delete ctx.prog[id]);
});

test('migrated answer variants work with the lesson-specific prompt',()=>{
 const callbacks={};ctx.document={addEventListener(name,fn){(callbacks[name]||=[]).push(fn);},createElement(){return{};},head:{appendChild(){}},body:{}};
 ctx.MutationObserver=class{observe(){}};
 run(read('type-to-know.js').replace(/\}\)\(\);\s*$/, 'this.accepts=(typed,w,ru)=>ok(norm(typed),w,ru);})();'));
 const moved=en=>after.find(r=>r.en.toLowerCase()===en.toLowerCase()&&r.id.startsWith('efb-'));
 for(const [en,typed] of [['grey','gray'],['surname','last name'],['shop','store']]){
  const row=moved(en);assert.ok(row,en);assert.ok(ctx.accepts(typed,{id:row.id,en:row.en,p:row.p},row.ru),typed);
 }
 const row=moved('work for');if(row){assert.ok(ctx.accepts('work for a company',{id:row.id,en:row.en,p:row.p},row.ru));assert.ok(!ctx.accepts('work for banana nonsense',{id:row.id,en:row.en,p:row.p},row.ru));}
});
