const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Search=require('../catalog-search.js');
const context=vm.createContext({console});
for(const file of ['learning-core.js','data-words.js','data-wordex.js','data-wordtr.js','data-exru.js','data-grammar.js','data-patch.js','fixes.js','data-a1-phrases.js','data-word-dedupe.js','data-beginner-course.js','beginner-curriculum.js','data-beginner-core.js','beginner-core.js']){
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
}
const data=JSON.parse(vm.runInContext('JSON.stringify({wordBranches:W_BRANCHES,course:BEGINNER_COURSE,grammarBranches:G_BRANCHES})',context));
const index=Search.createIndex(data),find=(q,scope)=>Search.find(index,q,scope);

test('search covers the entire live vocabulary and all course sections',()=>{
  const words=data.wordBranches.flatMap(b=>['cells','extra'].flatMap(p=>Object.values(b[p]||{}).flatMap(cs=>cs.flatMap(c=>c[3].split(';').filter(r=>r.trim())))));
  assert.equal(index.filter(i=>i.kind==='words').length,words.length);
  assert.equal(index.filter(i=>i.kind==='lessons').length,data.course.length);
  for(const lesson of data.course)for(const [sectionIndex,section] of lesson.sections.entries()){
    assert.ok(index.some(i=>i.kind==='topics'&&i.courseId===lesson.id&&i.sectionIndex===sectionIndex));
    for(const [topicId,wordKey] of section.refs)assert.ok(index.some(i=>i.kind==='words'&&i.topicId===topicId&&i.wordKey===wordKey&&i.locations.some(l=>l.courseId===lesson.id&&l.sectionIndex===sectionIndex)));
  }
});
test('English and Russian searches find words and topic names',()=>{
  assert.ok(find('family').groups.words.some(i=>i.title==='family'));
  assert.ok(find('семья').groups.words.some(i=>i.title==='family'));
  assert.ok(find('семь').groups.topics.some(i=>/семь/i.test(i.title)));
  assert.ok(find('FAMILY').groups.words.some(i=>i.title==='family'));
});
test('lesson codes are exact and accept spacing and a Russian keyboard letter',()=>{
  for(const q of ['4A','4 A','4а','урок 4A']){
    const result=find(q);
    assert.deepEqual(result.groups.lessons.map(i=>i.label),['4A']);
    assert.ok(result.groups.topics.length);
    assert.equal(result.groups.words.length,0);
    assert.ok(result.groups.topics.every(i=>i.codes.includes('4A')));
  }
  assert.deepEqual(find('1A').groups.lessons.map(i=>i.label),['1A']);
  assert.deepEqual(find('pe 1').groups.lessons.map(i=>i.label),['PE 1']);
  assert.deepEqual(find('R1').groups.lessons.map(i=>i.label),['Повторение 1-2']);
  assert.deepEqual(find('APP1').groups.lessons.map(i=>i.label),['Справочник 1']);
  assert.equal(find('word4Aword').total,0);
});
test('a code plus a word opens the matching lesson occurrence',()=>{
  const result=find('4A family');
  const word=result.groups.words.find(i=>i.title==='family');
  assert.ok(word);
  assert.ok(word.location.codes.includes('4A'));
  assert.ok(word.location.courseId);
});
test('lesson-specific forms and translations resolve to canonical progress records',()=>{
  const alias=data.course.flatMap(l=>l.sections.flatMap(s=>s.refs.map(ref=>({l,ref})))).find(({ref})=>{
    const item=index.find(i=>i.kind==='words'&&i.topicId===ref[0]&&i.wordKey===ref[1]);
    return ref[2]!==item.title&&ref[2].length>3&&!/^[0-9]/.test(ref[2]);
  });
  assert.ok(alias);
  const [topicId,wordKey,en]=alias.ref;
  assert.ok(find(en).groups.words.some(i=>i.topicId===topicId&&i.wordKey===wordKey));
});
test('extra and higher-level vocabulary stay searchable and can be filtered by level',()=>{
  for(const level of ['A1','A2','B1','B2']){
    const extra=index.find(i=>i.kind==='words'&&i.level===level&&i.extra);
    assert.ok(extra);
    assert.ok(find(extra.title+' '+level).groups.words.some(i=>i.topicId===extra.topicId&&i.wordKey===extra.wordKey));
    assert.ok(find(level).groups.words.every(i=>i.level===level));
  }
});
test('rules search supports titles, Russian text and codes inside lesson ranges',()=>{
  assert.ok(find('Present Simple','rules').groups.rules.some(i=>i.topicId==='pres-simple'));
  assert.ok(find('привычки','rules').groups.rules.some(i=>i.topicId==='pres-simple'));
  assert.ok(find('5B A1','rules').groups.rules.some(i=>i.topicId==='pres-simple'));
  assert.ok(find('1B A1','rules').groups.rules.some(i=>i.topicId==='pres-be'));
  assert.equal(find('1C A1','rules').total,0);
  assert.equal(find('family','rules').groups.words.length,0);
});
test('accents, apostrophes and ё do not prevent a match; empty and unknown queries are safe',()=>{
  const fixture=Search.createIndex({wordBranches:[{ru:'Еда',name:'Food',cells:{A1:[['food','Drinks','напитки',"café|кафе|n;you're welcome|пожалуйста|o;fir tree|ёлка|n"]]}}]});
  for(const q of ['cafe','CAFÉ','you’re welcome','youre welcome','елка','ёлка'])assert.ok(Search.find(fixture,q).groups.words.length,q);
  for(const q of ['', '   ', '!!', '<script>alert(1)</script>', 'несуществующееслово'])assert.equal(find(q).total,0,q);
});

test('lesson links keep textbook levels separate and match exact lesson codes',()=>{
  const fixture=Search.createIndex({
    wordBranches:[{name:'People',ru:'Люди',cells:{
      A1:[['v1','Countries','Страны','country|страна|n','1A'],['v2','People','Люди','person|человек|n','1B'],['v3','Family','Семья','family|семья|n','2A'],['v4','Things','Вещи','thing|вещь|n','10A'],['v5','Hotel','Отель','hotel|отель|n','PE 3']],
      A2:[['v6','Family A2','Семья A2','relative|родственник|n','1B']]
    }}],
    grammarBranches:[{name:'Present',ru:'Настоящее',cells:{
      A1:[['g1','be','быть','','1A–2A']],
      A2:[['g2','Present Simple','привычки','','1B']]
    }}]
  });
  const before=JSON.stringify(fixture);
  assert.deepEqual(Search.related(fixture,'1B','A1','rules').map(i=>i.topicId),['g1']);
  assert.deepEqual(Search.related(fixture,'1B','A2','rules').map(i=>i.topicId),['g2']);
  assert.deepEqual(Search.related(fixture,'1A','A1','words').map(i=>i.topicId),['v1']);
  assert.deepEqual(Search.related(fixture,'1A–2A','A1','words').map(i=>i.topicId),['v1','v2','v3']);
  assert.deepEqual(Search.related(fixture,'1B','A2','words').map(i=>i.topicId),['v6']);
  assert.deepEqual(Search.related(fixture,'PE 3','A1','rules'),[]);
  assert.deepEqual(Search.related(fixture,'','A1','words'),[]);
  assert.deepEqual(Search.related(fixture,'1B','B2','words'),[]);
  assert.deepEqual(Search.related(fixture,'1B','A1','unknown'),[]);
  assert.equal(JSON.stringify(fixture),before);
});

test('search navigation resolves the card on the tree without changing word identity',()=>{
  const course=[{id:'lesson-4a',sections:[{refs:[['people','person'],['family','mother']]},{refs:[['family','father'],['home','house']]}]}];
  assert.deepEqual(Search.topicIds({kind:'words',topicId:'family',location:{courseId:'lesson-4a',sectionIndex:1}},course),['family']);
  assert.deepEqual(Search.topicIds({kind:'rules',topicId:'pres-simple'},course),['pres-simple']);
  assert.deepEqual(Search.topicIds({kind:'topics',courseId:'lesson-4a',sectionIndex:0},course),['people','family']);
  assert.deepEqual(Search.topicIds({kind:'lessons',courseId:'lesson-4a'},course),['people','family','home']);
  assert.deepEqual(Search.topicIds({courseId:'missing'},course),[]);
  assert.deepEqual(Search.topicIds({courseId:'lesson-4a',sectionIndex:9},course),[]);
  assert.deepEqual(Search.topicIds(null,course),[]);
});

test('lesson links fill the search with the correct book and fall back to the rule title',()=>{
  assert.equal(Search.lessonQuery('11a','used to','A2'),'PI 11A');
  assert.equal(Search.lessonQuery('1B','Future forms','B1'),'INT 1B');
  assert.equal(Search.lessonQuery('1A–2A','be','A1'),'A1 1A-2A');
  assert.equal(Search.lessonQuery('PE 5','Indirect questions','B1'),'INT PE5');
  assert.equal(Search.lessonQuery('SB p. 42, урок 4а','Family','A2'),'PI 4A');
  assert.equal(Search.lessonQuery('','Phrasal verbs','A2'),'Phrasal verbs');
  assert.equal(Search.lessonQuery('Additional grammar','Word order','B2'),'Word order');
});

test('a lesson range or list finds every included lesson instead of requiring all codes on one item',()=>{
  const fixture=Search.createIndex({wordBranches:[{name:'People',ru:'Люди',cells:{A1:[
    ['one','One','','one|один|n','1A'],['two','Two','','two|два|n','1B'],
    ['three','Three','','three|три|n','2A'],['four','Four','','four|четыре|n','2B']
  ],A2:[['other','Other','','other|другой|n','1A']]}}]});
  const matches=q=>Search.find(fixture,q).groups.topics.map(i=>i.topicId);
  assert.deepEqual(matches(Search.lessonQuery('1A–2A','be','A1')),['one','two','three']);
  assert.deepEqual(matches('A1 1A, 2A'),['one','three']);
  assert.deepEqual(matches('A1 1B'),['two']);
});

test('a vocabulary link switches mode and fills search even without related vocabulary',()=>{
  const source=fs.readFileSync(path.join(__dirname,'..','catalog-search.js'),'utf8'),events=[];
  const c=vm.createContext({CatalogSearch:Search,setMode:mode=>events.push(['mode',mode]),searches:{words:q=>events.push(['search',q])}});
  vm.runInContext(source.slice(source.indexOf('  function openRelated(scope,'),source.indexOf('  const linkedRefs')),c);
  c.openRelated('words','A2','11A',undefined,'used to');
  c.openRelated('words','B2','',undefined,'Word order');
  assert.deepEqual(events,[['mode','w'],['search','PI 11A'],['mode','w'],['search','Word order']]);
});

test('rules without a lesson code retain a vocabulary link and a safely encoded title',()=>{
  const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'),c=vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('function esc('),source.indexOf('function el(')),c);
  const html=c.lessonRefHTML('words','A2','',null,'Words "&" phrases');
  assert.match(html,/data-lesson-title="Words &quot;&amp;&quot; phrases"/);
  assert.match(html,/>Лексика<\/span>/);
  assert.equal(c.lessonRefHTML('rules','A2',''), '');
});

