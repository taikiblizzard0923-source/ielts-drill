// node check_model.js file.js : validates enriched model answers on write/speak items
const fs=require('fs'),vm=require('vm');const g={};g.window=g;vm.createContext(g);
for(const f of process.argv.slice(2)) vm.runInContext(fs.readFileSync(f,'utf8'),g);
const D=g.DRILL;(D.pending||[]).forEach(x=>{if(D.days[x.day])D.days[x.day].sets=D.days[x.day].sets.concat(x.sets)});
const squash=s=>String(s||'').replace(/\s+/g,' ').trim();
const wc=s=>squash(s).split(' ').filter(Boolean).length;
const err=[];let n=0;
for(const [day,d] of Object.entries(D.days||{}))for(const s of d.sets)s.items.forEach((it,i)=>{
  if(it.type!=='write'&&it.type!=='speak')return; n++; const k=day+'|'+s.id+'|'+i, E=m=>err.push(k+' '+m);
  if(!Array.isArray(it.modelParts)||it.modelParts.length<2) return E('no modelParts');
  it.modelParts.forEach((p,j)=>{ if(!p.label||!p.en||!p.ja||!p.point) E('part '+j+' missing field'); });
  if(squash(it.modelParts.map(p=>p.en).join(' '))!==squash(it.model)) E('modelParts en != model');
  if(!Array.isArray(it.keyLanguage)||it.keyLanguage.length<6||it.keyLanguage.some(x=>!Array.isArray(x)||x.length<3)) E('keyLanguage');
  if(!Array.isArray(it.tips)||it.tips.length<3) E('tips');
  if(!Array.isArray(it.pitfalls)||it.pitfalls.length<3||it.pitfalls.some(x=>!Array.isArray(x)||x.length<2)) E('pitfalls');
  if(!it.modelJa) E('modelJa');
  if(it.type==='write'){ const w=wc(it.model); if(it.task===1&&(w<155||w>190)) E('task1 words '+w); if(it.task===2&&(w<255||w>300)) E('task2 words '+w); }
});
console.log('items',n);console.log(err.length?'NG\n'+err.join('\n'):'OK');
