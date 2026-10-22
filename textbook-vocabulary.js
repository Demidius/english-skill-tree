// Adapt textbook entry IDs to the existing topic|word progress store.
// This only changes catalog references. It never writes a learner's records.
const TEXTBOOK_BOOKS = {
  PI: {title:'Pre-Intermediate', level:'A2', ruleLevel:'A2'},
  INT: {title:'Intermediate', level:'B1', ruleLevel:'B1'}
};
const WORD_TOPIC_BOOKS = {};
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
      WORD_TOPIC_BOOKS[topic]=lesson.book;
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
  // Keep the previous lesson-owned keys as aliases, then place supplementary
  // words in compact thematic cards. Earlier canonical words stay in place.
  const routes = new Map(), groups = new Map();
  for (const lesson of TEXTBOOK_VOCABULARY.lessons) {
    const spec = TEXTBOOK_EXTRA_TOPICS.lessons[lesson.id];
    if (!spec || !TEXTBOOK_EXTRA_TOPICS.topics[spec.topic]) throw Error('Missing topic: ' + lesson.id);
    const overrides = new Map();
    for (const [topic, names] of Object.entries(spec.overrides || {})) {
      if (!TEXTBOOK_EXTRA_TOPICS.topics[topic]) throw Error('Unknown topic: ' + topic);
      for (const en of names.split('|')) {
        if (overrides.has(en)) throw Error('Duplicate topic assignment: ' + lesson.id + '/' + en);
        overrides.set(en, topic);
      }
    }
    routes.set(lesson.id, {topic:spec.topic, overrides});
  }
  for (const entry of Object.values(TEXTBOOK_ENTRIES)) {
    if (entry.matches.length) continue;
    const lesson = TEXTBOOK_VOCABULARY.lessons.find(l => l.id === entry.first_lesson);
    const route = routes.get(lesson.id), topic = route.overrides.get(entry.english) || route.topic;
    const groupKey = lesson.book + '|' + topic;
    if (!groups.has(groupKey)) groups.set(groupKey, {book:lesson.book, topic, entries:[]});
    groups.get(groupKey).entries.push(entry);
  }
  for (const group of groups.values()) {
    const [branchKey, title, ru] = TEXTBOOK_EXTRA_TOPICS.topics[group.topic];
    const branch = W_BRANCHES.find(b => b.key === branchKey), book = TEXTBOOK_BOOKS[group.book];
    if (!branch) throw Error('Unknown vocabulary branch: ' + branchKey);
    branch.extra ||= {}; branch.extra[book.level] ||= [];
    const chunks = [];
    for (const entry of group.entries) {
      let chunk = chunks.at(-1);
      // Same spelling with different meanings must have separate progress keys.
      if (!chunk || chunk.entries.length >= 24 || chunk.keys.has(entry.wordKey)) {
        chunk = {entries:[], keys:new Set()}; chunks.push(chunk);
      }
      chunk.entries.push(entry); chunk.keys.add(entry.wordKey);
    }
    chunks.forEach((chunk, i) => {
      const id = 'efx-' + group.book.toLowerCase() + '-' + group.topic + '-' + (i + 1);
      const codes = new Set(), rows = [];
      for (const entry of chunk.entries) {
        const oldKey = entry.topicId + '|' + entry.wordKey;
        const row = newCards.get(entry.topicId).rows.find(r => slug(r.split('|')[0]) === entry.wordKey);
        if (!row) throw Error('Missing supplementary row: ' + entry.id);
        rows.push(row);
        entry.lesson_ids.filter(l => l.startsWith(group.book + '-')).forEach(l => codes.add(l.slice(group.book.length + 1)));
        mergeAliases(id + '|' + entry.wordKey, [oldKey]);
        delete WORD_ENTRY_METADATA[oldKey];
        entry.topicId = id;
        WORD_ENTRY_METADATA[id + '|' + entry.wordKey] = entry;
      }
      const suffix = chunks.length > 1 ? ' ' + (i + 1) : '';
      branch.extra[book.level].push([id, title + suffix, ru, rows.join(';'), group.book + ' ' + [...codes].join(', ')]);
      WORD_TOPIC_BOOKS[id] = group.book; WORD_LEGACY_TOPICS.add(id);
    });
  }
  for(const lesson of TEXTBOOK_VOCABULARY.lessons) {
    const book=TEXTBOOK_BOOKS[lesson.book];
    BEGINNER_COURSE.push({id:lesson.id,book:lesson.book,bookTitle:book.title,level:book.level,ruleLevel:book.ruleLevel,
      code:lesson.code,label:lesson.code,title:lesson.title,ru:lesson.subtitle,source:lesson.source.replace(/;\s*WB[^;]*/g,''),
      entryIds:lesson.entry_ids,firstMentions:lesson.first_mentions,repeatMentions:lesson.repeat_mentions,
      topicIds:[...new Set(lesson.entry_ids.map(id=>TEXTBOOK_ENTRIES[id].topicId))]
        .sort((a,b)=>Number(WORD_TOPIC_BOOKS[b]===lesson.book)-Number(WORD_TOPIC_BOOKS[a]===lesson.book)),
      sections:[{title:lesson.subtitle||lesson.title,refs:lesson.entry_ids.map(id=>{
        const e=TEXTBOOK_ENTRIES[id]; return [e.topicId,e.wordKey,e.english,e.translation_ru];
      })}]});
  }
})();

