global.window=global; const fs=require('fs'),vm=require('vm');
for(const f of process.argv.slice(2)){ vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f}); }
const d=window.TEAP.days; const cnt=[0,0,0,0];
for(const k of Object.keys(d).sort()){ let n=0; for(const s of d[k].sets){ for(const it of s.items){ n++; if(it.choices.length!==4||!(it.a>=0&&it.a<4)) console.log('BAD',k,s.id,it.q); cnt[it.a]++; } }
 console.log(k, d[k].theme, n+'問', 'tasks'+d[k].tasks.reduce((a,t)=>a+t.min,0)+'/'+d[k].minutes, 'vocab'+d[k].vocab.length); }
console.log('answer dist',cnt);
