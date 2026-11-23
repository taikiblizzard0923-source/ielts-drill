// node blind_compare.js ans.json file1.js ... : compare blind answers with keys
const fs=require('fs'),vm=require('vm');const g={};g.window=g;vm.createContext(g);
const [ans,...files]=process.argv.slice(2);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),g);
const D=g.DRILL;(D.pending||[]).forEach(x=>{if(D.days[x.day])D.days[x.day].sets=D.days[x.day].sets.concat(x.sets)});
const A=JSON.parse(fs.readFileSync(ans,'utf8'));const NUMW = {zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,hundred:100};
  // answer comparison: case, spacing, trailing dot, quotes, and number spellings (3/three, 9:30/9.30, 4,000/4000, 0794 638/0794638, 25 percent/25%)
  const norm = s => { let t=String(s==null?"":s).toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g," ").trim().replace(/\.$/,"");
    t=t.replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|hundred)\b/g,w=>String(NUMW[w]));
    t=t.replace(/(\d),(?=\d{3}\b)/g,"$1").replace(/(\d):(\d\d)/g,"$1.$2").replace(/(\d) (?=\d)/g,"$1").replace(/ ?per ?cent\b/g,"%").replace(/ %/g,"%");
    return t; };
let n=0,ok=0;const out=[];
for(const [day,d] of Object.entries(D.days))for(const s of d.sets)s.items.forEach((it,i)=>{const t=it.type||'mc';if(t==='write'||t==='speak')return;const k=day+'|'+s.id+'|'+i;n++;const r=A[k];
 if(!r){out.push('MISSING '+k);return;}
 let same; if(t==='fill') same=(it.accept||[]).some(a=>norm(a)===norm(r.ans)); else if(t==='mc2') same=Array.isArray(r.ans)&&r.ans.length===2&&r.ans.every(x=>it.a.includes(x)); else same=r.ans===it.a;
 if(same)ok++; if(!same||r.flag) out.push('### '+k+' ['+t+'] key='+JSON.stringify(t==='fill'?it.accept:it.a)+' blind='+JSON.stringify(r.ans)+'\n Q: '+it.q+(it.choices?'\n '+it.choices.map((c,j)=>j+') '+c).join(' | '):'')+'\n FLAG: '+(r.flag||'-'));});
console.log('total',n,'agree',ok);console.log(out.join('\n'));
