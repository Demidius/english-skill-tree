const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Search=require('../catalog-search.js');
const context=vm.createContext({console});
for(const file of ['learning-core.js','data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-ef-course.js']){
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
}
const data=JSON.parse(vm.runInContext('JSON.stringify({wordBranches:W_BRANCHES,course:BEGINNER_COURSE,grammarBranches:G_BRANCHES})',context));
const index=Search.createIndex(data),find=(q,scope)=>Search.find(index,q,scope);

test('search covers the entire live vocabulary',()=>{
  const words=data.wordBranches.flatMap(b=>['cells','extra'].flatMap(p=>Object.values(b[p]||{}).flatMap(cs=>cs.flatMap(c=>c[3].split(';').filter(r=>r.trim())))));
  assert.equal(index.filter(i=>i.kind==='words').length,words.length);
  assert.equal(data.course.length,0);
});
test('English and Russian searches find words and topic names',()=>{
  assert.ok(find('father').groups.words.some(i=>i.title==='father'));
  assert.ok(find('отец').groups.words.some(i=>i.title==='father'));
  assert.ok(find('семья').groups.topics.some(i=>/семья/i.test(i.subtitle)));
});
test('lesson codes find the textbook topics of that lesson',()=>{
  for(const q of ['4A','4 A','4а','урок 4A']){
    const result=find(q);
    assert.ok(result.groups.topics.length);
    assert.equal(result.groups.words.length,0);
    assert.ok(result.groups.topics.every(i=>i.codes.includes('4A')));
  }
  assert.ok(find('pe 1').groups.topics.length);
  assert.deepEqual([...new Set(find('A2 4A').groups.topics.map(i=>i.level))],['A2']);
  assert.equal(find('word4Aword').total,0);
});
test('a code plus a word finds that word in the lesson',()=>{
  const word=find('4A father').groups.words.find(i=>i.title==='father');
  assert.ok(word);assert.ok(word.codes.includes('4A'));
});
test('rule search stays separate',()=>{
  assert.equal(find('father','rules').groups.words.length,0);
});
