global.window=global;const fs=require('fs'),vm=require('vm');
for(const f of process.argv.slice(2)) vm.runInThisContext(fs.readFileSync(f,'utf8'));
const seen={};const d=window.TEAP.days;let tot=0,grammar=0,noSit=0;
for(const k of Object.keys(d).sort()){for(const [w] of d[k].vocab){(seen[w.toLowerCase()]=seen[w.toLowerCase()]||[]).push(k.slice(5));}
 for(const s of d[k].sets){tot+=s.items.length; if(/Part ?2[AB]/.test(s.title)&&s.skill==='L'&&!(JSON.stringify(s.script||'')).includes('Situation'))noSit++;}}
console.log('total',tot,'L2 sets w/o Situation',noSit);
console.log('dup vocab',Object.entries(seen).filter(([w,a])=>a.length>1).map(([w,a])=>w+':'+a.join(',')).join(' | '));
