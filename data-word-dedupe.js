// Consolidate exact bilingual duplicates at the earliest CEFR level.
// Old progress documents remain readable through these aliases.
const WORD_PROGRESS_ALIASES={};
const WORD_LEGACY_TOPICS=new Set();
(function(){
  const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'w';
  const groups=new Map(),rank={A1:0,A2:1,B1:2,B2:3};
  W_BRANCHES.forEach(b=>['cells','extra'].forEach(part=>Object.entries(b[part]||{}).forEach(([level,cards])=>cards.forEach(card=>{
    WORD_LEGACY_TOPICS.add(card[0]);
    card[3].split(';').forEach(row=>{
      const f=row.split('|').map(s=>s.trim());if(!f[0])return;
      const key=f[0].toLowerCase()+'|'+f[1];
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push({card,en:f[0],rank:rank[level]*2+(part==='extra'?1:0)});
    });
  }))));
  const removed=new Set();
  groups.forEach(rows=>{
    if(rows.length<2)return;
    rows.sort((a,b)=>a.rank-b.rank);
    const target=rows[0].card[0]+'|'+slug(rows[0].en),sources=[];
    rows.slice(1).forEach(row=>{
      const id=row.card[0],k=slug(row.en),old=id+'|'+k;
      removed.add(old);sources.push([id,k]);
      if(typeof A1_PHRASE_PROGRESS!=='undefined')sources.push(...(A1_PHRASE_PROGRESS[old]||[]));
    });
    WORD_PROGRESS_ALIASES[target]=sources;
  });
  W_BRANCHES.forEach(b=>['cells','extra'].forEach(part=>Object.keys(b[part]||{}).forEach(level=>{
    b[part][level].forEach(card=>{card[3]=card[3].split(';').filter(row=>{const en=row.split('|')[0].trim();return en&&!removed.has(card[0]+'|'+slug(en));}).join(';');});
    b[part][level]=b[part][level].filter(card=>card[3].trim());
  })));
})();
