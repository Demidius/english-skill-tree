const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context=vm.createContext({console});
for(const file of ['data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-ef-course.js'])
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const d=JSON.parse(vm.runInContext('JSON.stringify({W:W_BRANCHES,L:LEVELS,A:WORD_PROGRESS_ALIASES,T:[...WORD_LEGACY_TOPICS]})',context));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';
const cards=lv=>d.W.flatMap(b=>(b.cells[lv]||[]));

test('A1 is English File Beginner and A2 is Elementary',()=>{
  assert.equal(d.L.find(l=>l.key==='A1').book,'Beginner');
  assert.equal(d.L.find(l=>l.key==='A2').book,'Elementary');
});
test('A1 and A2 hold only textbook lesson topics and no extra topics',()=>{
  for(const lv of ['A1','A2']){
    assert.ok(cards(lv).length>40);
    for(const c of cards(lv)){assert.match(c[0],/^efa[12]-/);assert.match(c[4],/^(\d{1,2}[ABC]|PE \d)$/);}
    for(const b of d.W) assert.ok(!(b.extra&&b.extra[lv]&&b.extra[lv].length),b.key+' '+lv);
  }
});
test('each word appears once per level and every row is well formed',()=>{
  for(const lv of ['A1','A2']){
    const seen=new Set();
    for(const c of cards(lv)) for(const row of c[3].split(';')){
      const f=row.split('|').map(s=>s.trim());
      assert.ok(f[0]&&f[1]&&['n','v','a','o'].includes(f[2]),row);
      const k=slug(f[0]);assert.ok(!seen.has(lv+k),lv+' '+f[0]);seen.add(lv+k);
    }
  }
});
test('lesson vocabulary is where the book puts it',()=>{
  const has=(lv,code,en)=>cards(lv).some(c=>c[4]===code&&c[3].split(';').some(r=>r.split('|')[0].trim()===en));
  assert.ok(has('A1','1A','Monday'));assert.ok(has('A1','3B','a key ring'));assert.ok(has('A1','10A','a remote control'));
  assert.ok(has('A2','8B','a washing machine'));assert.ok(has('A2','9B','a jar'));assert.ok(has('A2','PE 6','a coach'));
});
test('progress from the old A1 topics carries over',()=>{
  const k='efa1-4a-2|mother';assert.ok(d.A[k].some(([id])=>id==='pe-family'));
  assert.ok(d.T.includes('pe-family'));
});


test('A1 demonstrative translation prompts clarify object distance',()=>{
  const entries=cards('A1').flatMap(c=>c[3].split(';').map(r=>r.split('|')));
  const translation=en=>entries.find(r=>r[0].trim()===en)?.[1]?.trim();
  assert.equal(translation("What's that?"),'Что это? (предмет далеко)');
  assert.equal(translation('How much is that?'),'Сколько это стоит? (предмет далеко)');
});
