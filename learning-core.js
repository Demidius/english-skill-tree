// Shared browser helpers with a CommonJS export for the regression tests.
const SkillCore = (() => {
  function createWriteQueue(options) {
    const topics = new Map();
    let serial = 0, stopped = false;
    const later = options.setTimer || setTimeout, cancel = options.clearTimer || clearTimeout;
    const copy = value => value == null ? null : value.slice();
    function topic(id) {
      if (!topics.has(id)) topics.set(id, { values: new Map(), flight: null, timer: null, failures: 0 });
      return topics.get(id);
    }
    function persist() {
      const out = {};
      topics.forEach((t,id) => { if (t.values.size) out[id] = Object.fromEntries([...t.values].map(([k,v]) => [k,copy(v.value)])); });
      try { options.save?.(out); } catch (e) { options.onError?.(e); }
    }
    function schedule(id,delay) {
      const t=topic(id); cancel(t.timer);
      if (!stopped) t.timer=later(() => { t.timer=null; flush(id); },delay);
    }
    function put(id,patch) {
      const t=topic(id);
      Object.entries(patch).forEach(([k,value]) => t.values.set(k,{value:copy(value),serial:++serial}));
      persist(); schedule(id,options.delay ?? 700);
    }
    function flush(id) {
      const t=topic(id); cancel(t.timer); t.timer=null;
      if (stopped || !t.values.size) return t.flight || Promise.resolve();
      if (t.flight) return t.flight;
      const sent=new Map(t.values), patch=Object.fromEntries([...sent].map(([k,v]) => [k,copy(v.value)]));
      let succeeded=false;
      t.flight=Promise.resolve().then(() => options.send(id,patch)).then(() => {
        succeeded=true; t.failures=0;
        sent.forEach((v,k) => { if(t.values.get(k)?.serial===v.serial) t.values.delete(k); });
        persist(); options.onSaved?.();
      },e => { t.failures++; options.onError?.(e); }).finally(() => {
        t.flight=null;
        if(t.values.size) schedule(id,succeeded?0:Math.min(30000,1000*2**Math.min(t.failures-1,5)));
      });
      return t.flight;
    }
    function overlay(id,remote) {
      const out={...remote};
      topic(id).values.forEach(({value},k) => { if(value===null) delete out[k]; else out[k]=copy(value); });
      return out;
    }
    return {
      put,flush,overlay,
      restore(data){Object.entries(data||{}).forEach(([id,patch]) => put(id,patch));},
      flushAll(){return Promise.all([...topics.keys()].map(flush));},
      pending(id){return id==null?[...topics.values()].some(t=>t.values.size):!!topics.get(id)?.values.size;},
      resume(){stopped=false;return this.flushAll();},
      stop(){stopped=true;topics.forEach(t=>cancel(t.timer));},
    };
  }
  function parseRuleCode(text) {
    const found=String(text||'').match(/EFST1\s*\|[^\r\n\x60]+/i);
    if(!found) return null;
    const parts=found[0].trim().split('|').map(s=>s.trim());
    if(!/^[a-z0-9]{3,32}$/i.test(parts[1]) || parts.length<3) return null;
    const items=[];
    for(const token of parts.slice(2)) {
      const m=token.match(/^([a-z0-9-]+)\s*:\s*(\d{1,2})\s*:\s*(\+2|\+1|\+|[-−–—]|0|=)$/i);
      if(!m || +m[2]>10) return null;
      items.push({id:m[1].toLowerCase(),from:+m[2],sign:m[3]==='+2'?2:m[3][0]==='+'?1:/[0=]/.test(m[3])?0:-1});
    }
    return {tag:parts[1].toUpperCase(),items};
  }
  function contractionVariants(text) {
    const norm=s=>String(s).toLowerCase().replace(/[’\x60ʼ]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim().replace(/^(to|a|an|the) /,'');
    let s=norm(text);
    // Noun possessives (chemist's, someone's) are not contractions.
    s=s.replace(/\b(it|he|she|that|there|what|where|who|how)'s\b(?=\s|$)/g,(m,p,offset,whole)=>p+(/^\s+(been|got)\b/.test(whole.slice(offset+m.length))?' has':' is'));
    s=s.replace(/\b(\w+)'d\b/g,(m,p,offset,whole)=>p+(/^\s+(better|been|got|had|done|seen|eaten|gone)\b/.test(whole.slice(offset+m.length))?' had':' would'));
    const rules=[[/\bcan't\b/g,'cannot'],[/\bcan not\b/g,'cannot'],[/\bwon't\b/g,'will not'],[/\bshan't\b/g,'shall not'],[/\blet's\b/g,'let us'],[/\b(\w+)n't\b/g,'$1 not'],[/\b(\w+)'m\b/g,'$1 am'],[/\b(\w+)'re\b/g,'$1 are'],[/\b(\w+)'ve\b/g,'$1 have'],[/\b(\w+)'ll\b/g,'$1 will']];
    rules.forEach(([re,replacement])=>{s=s.replace(re,replacement);});
    return new Set([s.replace(/'/g,'')]);
  }
  function articleEquivalent(expected,typed) {
    const a=expected.split(' '),b=typed.split(' ');
    if(a.length!==b.length) return false;
    return a.every((word,i)=>{
      if(word===b[i]) return true;
      if(!/^(a|an|the)$/.test(word)||!/^(a|an|the)$/.test(b[i])) return false;
      if(word!=='the') return b[i]==='the';
      const next=a[i+1]||'';
      const vowel=/^(honest|honour|honor|hour|heir)/.test(next)||(/^[aeiou]/.test(next)&&!/^(uni|use|user|usual|euro|one)/.test(next));
      return b[i]===(vowel?'an':'a');
    });
  }
  return {createWriteQueue,parseRuleCode,contractionVariants,articleEquivalent};
})();
if(typeof module!=='undefined'&&module.exports) module.exports=SkillCore;
