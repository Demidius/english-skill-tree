// Adapt textbook entry IDs to the existing topic|word progress store.
// This only changes catalog references. It never writes a learner's records.
const TEXTBOOK_BOOKS = {
  PI: {title:'Pre-Intermediate', level:'A2', ruleLevel:'A2'},
  INT: {title:'Intermediate', level:'B1', ruleLevel:'B1'}
};
const WORD_TOPIC_BOOKS = {};
const WORD_TOPIC_COURSE = {};
const TEXTBOOK_ENTRIES = {};
const WORD_ENTRY_METADATA = {};
(function () {
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'w';
  const rowKey = (id, en) => id + '|' + slug(en);
  const inventory = new Map(), positions = new Map();
  for (const b of W_BRANCHES) for (const part of ['cells','extra']) for (const [level,cards] of Object.entries(b[part] || {})) for (const c of cards) {
    WORD_TOPIC_BOOKS[c[0]] = level === 'A1' ? 'BEGINNER' : level === 'A2' ? 'ELEMENTARY' : level === 'B1' ? 'INT' : 'UPPER';
    for (const row of c[3].split(';').filter(r=>r.trim())) {
      const en=row.split('|')[0].trim(), key=rowKey(c[0],en);
      inventory.set(key,row); positions.set(key,{level,extra:part==='extra'});
    }
  }
  const removals = new Set(), owners = new Map(), newCards = new Map();
  const rank = key => ['A1','A2','B1','B2'].indexOf(positions.get(key).level)*2 + Number(positions.get(key).extra);
  function mergeAliases(target, sources) {
    const all = [...(WORD_PROGRESS_ALIASES[target] || [])];
    for (const key of sources) {
      all.push(...(WORD_PROGRESS_ALIASES[key] || []));
      if(key!==target) all.push(key.split('|'));
    }
    WORD_PROGRESS_ALIASES[target] = [...new Map(all.filter(a=>a.join('|')!==target).map(a=>[a.join('|'),a])).values()];
    for(const [id] of WORD_PROGRESS_ALIASES[target]) WORD_LEGACY_TOPICS.add(id);
  }
  for (const entry of TEXTBOOK_VOCABULARY.catalog) {
    const matches=entry.matches.map(m=>m[0]+'|'+m[1]).filter(k=>inventory.has(k)).sort((a,b)=>rank(a)-rank(b));
    for(const key of matches) {
      if(owners.has(key)) throw Error('Two meanings share a progress key: '+key);
      owners.set(key,entry.id);
    }
    let topic, key;
    if(matches.length) {
      [topic,key]=matches[0].split('|');
      mergeAliases(matches[0],matches);
      matches.slice(1).forEach(k=>removals.add(k));
    } else {
      const lesson=TEXTBOOK_VOCABULARY.lessons.find(l=>l.id===entry.first_lesson);
      const book=TEXTBOOK_BOOKS[lesson.book];
      topic='eft-'+lesson.id.toLowerCase(); key=slug(entry.english);
      // Two meanings can occur in the same lesson without sharing a slug key.
      if(newCards.get(topic)?.keys.has(key)) topic+='-'+entry.id.split('-').at(-1);
      if(!newCards.has(topic)) newCards.set(topic,{lesson,book,rows:[],keys:new Set()});
      const card=newCards.get(topic), clean=s=>String(s||'').replace(/[;|]/g,',');
      card.keys.add(key);
      card.rows.push([clean(entry.english),clean(entry.translation_ru),'o',clean(entry.examples.join(' / '))].join('|'));
      WORD_TOPIC_BOOKS[topic]=lesson.book; WORD_TOPIC_COURSE[topic]=lesson.id;
      WORD_LEGACY_TOPICS.add(topic);
    }
    TEXTBOOK_ENTRIES[entry.id]={...entry,topicId:topic,wordKey:key};
    WORD_ENTRY_METADATA[topic+'|'+key]=TEXTBOOK_ENTRIES[entry.id];
  }
  for(const b of W_BRANCHES) for(const part of ['cells','extra']) for(const level of Object.keys(b[part]||{})) {
    b[part][level]=b[part][level].filter(c=>{
      c[3]=c[3].split(';').filter(row=>row.trim()&&!removals.has(rowKey(c[0],row.split('|')[0].trim()))).join(';');
      return c[3].trim();
    });
  }
  const branch={key:'textbooks',name:'Textbook lessons',ru:'Уроки учебников',color:'#8a785a',cells:{A1:[],A2:[],B1:[],B2:[]}};
  for(const [id,card] of newCards) branch.cells[card.book.level].push([id,card.book.title+' · '+card.lesson.code,'Новые записи · '+card.lesson.title,card.rows.join(';'),card.lesson.code]);
  W_BRANCHES.push(branch);
  for(const lesson of TEXTBOOK_VOCABULARY.lessons) {
    const book=TEXTBOOK_BOOKS[lesson.book];
    BEGINNER_COURSE.push({id:lesson.id,book:lesson.book,bookTitle:book.title,level:book.level,ruleLevel:book.ruleLevel,
      code:lesson.code,label:lesson.code,title:lesson.title,ru:lesson.subtitle,source:lesson.source,
      entryIds:lesson.entry_ids,firstMentions:lesson.first_mentions,repeatMentions:lesson.repeat_mentions,
      topicIds:[...newCards].filter(([,c])=>c.lesson.id===lesson.id).map(([id])=>id),
      sections:[{title:lesson.subtitle||lesson.title,refs:lesson.entry_ids.map(id=>{
        const e=TEXTBOOK_ENTRIES[id]; return [e.topicId,e.wordKey,e.english,e.translation_ru];
      })}]});
  }
})();
