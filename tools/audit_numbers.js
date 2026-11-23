// Compare "Questions x–y" in instructions with the numbers the page will display
const fs=require('fs'),vm=require('vm');const g={};g.window=g;vm.createContext(g);
for(const f of ['d1','d2','mockL','mockR','d3','d4'])vm.runInContext(fs.readFileSync('data/'+f+'.js','utf8'),g);
const D=g.DRILL;(D.pending||[]).forEach(x=>{D.days[x.day].sets=D.days[x.day].sets.concat(x.sets)});
const pts=it=>it.type==='mc2'?2:(it.type==='write'||it.type==='speak'?0:1);
const out=[];
for(const [day,d] of Object.entries(D.days)){const nums={L:1,R:1};
 for(const s of d.sets){ if(!(s.skill in nums))continue; const start=nums[s.skill]; const total=s.items.reduce((a,it)=>a+pts(it),0); const end=start+total-1; nums[s.skill]+=total;
  const rs=[...(s.instructions||'').matchAll(/Questions?\s+(\d+)\s*(?:[–-]\s*(\d+))?/g)].map(m=>[+m[1],+(m[2]||m[1])]);
  const lo=rs.length?Math.min(...rs.map(r=>r[0])):null, hi=rs.length?Math.max(...rs.map(r=>r[1])):null;
  const qnums=s.items.map(it=>{const m=String(it.q).match(/^\s*(\d{1,2})\b/);return m?+m[1]:null}).filter(x=>x!==null);
  const flag=(lo!==null&&(lo!==start||hi!==end))||(qnums.length&&qnums[0]!==start);
  if(flag) out.push(day+' '+s.id+' '+s.skill+' display '+start+'-'+end+' | instructions '+(lo!==null?lo+'-'+hi:'none')+' | q-leading '+(qnums.length?qnums[0]+'..'+qnums[qnums.length-1]:'none')+' | '+s.title);
 }}
console.log(out.join('\n')||'all consistent');
