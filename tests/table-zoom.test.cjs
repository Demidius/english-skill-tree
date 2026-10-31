const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','table-zoom.js'),'utf8');
function harness(saved='1') {
  const rafs=new Map(),timers=new Map(),events={},docEvents={},writes=new Map();
  const observers=[];let seq=0;
  class Element { closest(){return null;} }
  const el=()=>({style:{},dataset:{},hidden:false,setAttribute(){},addEventListener(type,fn){(this.events??={})[type]=fn;},remove(){}});
  const buttons=Object.fromEntries(['in','out','fit','reset'].map(z=>[z,{...el(),dataset:{z},closest(){return this;}}]));
  const val=el(),bar={...el(),querySelector:s=>s==='.tz-val'?val:buttons[s.match(/"(\w+)"/)[1]]};
  const tree={...el(),querySelectorAll:()=>[],querySelector:()=>null,contains:()=>false};
  const scroller={...el(),clientWidth:1000,clientLeft:0,scrollLeft:0,appendChild(){},before(){},
    scrollTo({left}){this.scrollLeft=Math.min(Math.max(0,left),Math.max(0,tree.getBoundingClientRect().width-this.clientWidth));}};
  const mode={...el(),id:'mode-w',querySelector:s=>s==='.tree-scroll'?scroller:null};
  scroller.querySelector=()=>tree;
  const ctx={Element,console,Number,Math,WeakSet,matchMedia:()=>({matches:false}),
    localStorage:{getItem:()=>saved,setItem:(k,v)=>writes.set(k,v)},
    innerWidth:1000,innerHeight:800,scrollX:0,scrollY:300,
    performance:{now:()=>10000},requestAnimationFrame:fn=>(rafs.set(++seq,fn),seq),cancelAnimationFrame:id=>rafs.delete(id),
    setTimeout:(fn,ms)=>(timers.set(++seq,{fn,ms}),seq),clearTimeout:id=>timers.delete(id),
    getComputedStyle:e=>({display:mode.hidden?'none':'grid',position:'static',paddingLeft:'0',marginLeft:'0'}),
    addEventListener:(type,fn)=>(events[type]??=[]).push(fn),
    MutationObserver:class {constructor(fn){observers.push(fn);}observe(){}},
  };
  const zoom=()=>Number(tree.style.zoom)||1;
  tree.getBoundingClientRect=()=>{
    const m=(tree.style.transform||'').match(/translate\(([^,]+)px,([^)]*)px\) scale\(([^)]+)\)/);
    const scale=m?Number(m[3]):1, left=-scroller.scrollLeft+(m?Number(m[1])*zoom():0), top=500-ctx.scrollY+(m?Number(m[2])*zoom():0);
    return {left,top,width:4000*zoom()*scale,height:8000*zoom()*scale,right:left+4000*zoom()*scale,bottom:top+8000*zoom()*scale};
  };
  scroller.getBoundingClientRect=()=>({left:0,right:1000,top:500-ctx.scrollY,bottom:500+8000*zoom()-ctx.scrollY});
  ctx.window={scrollTo({top}){ctx.scrollY=Math.max(0,top);}};
  ctx.document={createElement:()=>bar,querySelectorAll:()=>[mode],elementFromPoint:()=>null,body:{},
    addEventListener:(type,fn)=>(docEvents[type]??=[]).push(fn),documentElement:{get scrollHeight(){return 1000+8000*zoom();}}};
  vm.runInNewContext(source,ctx);
  return {ctx,tree,scroller,mode,val,buttons,rafs,timers,writes,
    click(z){bar.events.click({target:buttons[z]});},
    frame(now){const pending=[...rafs.values()];rafs.clear();pending.forEach(fn=>fn(now));},
    finish(){for(let i=0;i<4&&timers.size;i++){const pending=[...timers.values()];timers.clear();pending.forEach(t=>t.fn());}},
    event(type){(events[type]||[]).forEach(fn=>fn());},
    sync(){observers[0]();},
    wheel(delta,x=500,y=600){(docEvents.wheel||[]).forEach(fn=>fn({ctrlKey:true,target:new Element(),deltaMode:0,deltaY:delta,clientX:x,clientY:y,preventDefault(){}}));},
    ratio(){const m=(tree.style.transform||'').match(/scale\(([^)]+)\)/);return zoom()*(m?Number(m[1]):1);},
  };
}
test('animation uses frame timestamps and cannot extrapolate before the first frame',()=>{
 const h=harness();h.click('out');
 for(const now of [0,16,-1000,32,100,180,500]){
   h.frame(now);
   assert.ok(h.ratio()>=.25&&h.ratio()<=1.5,'invalid scale '+h.ratio()+' at '+now);
   assert.ok(parseInt(h.val.textContent)<=150);
 }
 h.finish();assert.equal(h.tree.style.zoom,'0.9');assert.equal(h.val.textContent,'90%');
});
test('zoom remains bounded during rapid clicks, wheels, limits and interrupted animation',()=>{
 const h=harness();
 for(let i=0;i<40;i++){h.click('in');h.frame(i*2);}
 h.finish();assert.equal(h.tree.style.zoom,'1.5');
 for(let i=0;i<40;i++){h.wheel(150);h.frame(i*2);}
 h.finish();assert.equal(h.tree.style.zoom,'0.25');assert.equal(h.scroller.scrollLeft,0);
 h.click('reset');h.frame(0);h.frame(40);h.click('out');h.frame(50);h.finish();
 assert.equal(h.tree.style.zoom,'0.9');assert.equal(h.tree.style.transform,'');
});
test('fit and reset produce finite zoom and save the final scale',()=>{
 for(const saved of ['Infinity','NaN','-400','5000000','1']){
   const h=harness(saved);h.click('fit');h.frame(0);h.frame(90);h.finish();
   assert.equal(h.tree.style.zoom,'0.25');assert.equal(h.scroller.scrollLeft,0);
   h.click('reset');h.finish();assert.equal(h.tree.style.zoom,'');assert.equal(h.val.textContent,'100%');
   for(const v of h.writes.values()) assert.ok(Number.isFinite(Number(v))&&Number(v)>=.2&&Number(v)<=1.5);
 }
});
test('scrolling during a preview keeps the new page and branch positions',()=>{
 const base=harness(),moved=harness();
 for(const h of [base,moved]){h.click('in');h.frame(0);h.frame(90);}
 moved.ctx.scrollY+=120;moved.scroller.scrollLeft+=80;moved.event('scroll');
 base.finish();moved.finish();
 assert.ok(Math.abs(moved.ctx.scrollY-base.ctx.scrollY-120)<.001);
 assert.ok(Math.abs(moved.scroller.scrollLeft-base.scroller.scrollLeft-80)<.001);
 assert.equal(moved.tree.style.transform,'');
});
test('a mode switch or viewport resize finishes pending animation without leaving stale transforms',()=>{
 const h=harness();h.click('in');h.frame(0);h.mode.hidden=true;h.sync();h.finish();
 assert.equal(h.tree.style.transform,'');assert.equal(h.tree.style.zoom,'');
 h.mode.hidden=false;h.sync();assert.equal(h.tree.style.zoom,'1.1');
 h.click('out');h.frame(0);h.scroller.clientWidth=1400;h.event('resize');h.finish();
 assert.equal(h.tree.style.transform,'');assert.equal(h.tree.style.zoom,'');assert.equal(h.val.textContent,'100%');
});
test('hidden zero-width measurement cannot corrupt the saved scale',()=>{
 const h=harness();h.mode.hidden=true;h.scroller.clientWidth=0;h.sync();
 h.mode.hidden=false;h.scroller.clientWidth=1000;h.sync();h.click('fit');h.finish();
 assert.equal(h.tree.style.zoom,'0.25');assert.equal(h.val.textContent,'25%');
});

test('zoom keeps the same content point at the viewport center after committing',()=>{
 const h=harness();h.click('in');h.frame(0);h.frame(180);h.finish();
 const r=h.tree.getBoundingClientRect(),z=Number(h.tree.style.zoom)||1;
 assert.ok(Math.abs((500-r.left)/z-500)<.001);
 assert.ok(Math.abs((400-r.top)/z-200)<.001);
});
