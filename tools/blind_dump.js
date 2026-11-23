// node blind_dump.js out.txt file1.js ... : answer-hidden dump for blind verification
const fs=require('fs'),vm=require('vm');const g={};g.window=g;vm.createContext(g);
const [out,...files]=process.argv.slice(2);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),g);
const D=g.DRILL;(D.pending||[]).forEach(x=>{if(D.days[x.day])D.days[x.day].sets=D.days[x.day].sets.concat(x.sets)});
let s='';for(const [day,d] of Object.entries(D.days))for(const st of d.sets){ if(!st.items.some(it=>!['write','speak'].includes(it.type)))continue;
 s+='\n=== SET '+day+'|'+st.id+' ('+st.title+') ===\nINSTRUCTIONS: '+st.instructions+'\n';
 if(st.table)s+='TABLE: '+JSON.stringify(st.table)+'\n'; if(st.plan)s+='PLAN (map): '+JSON.stringify(st.plan)+'\n';
 if(st.options)s+='OPTIONS:\n'+st.options.map((o,i)=>'  '+i+') '+o).join('\n')+'\n';
 if(st.passage)s+='PASSAGE:\n'+st.passage+'\n'; if(st.script)s+='AUDIO SCRIPT:\n'+st.script.filter(l=>l.sp!=='PAUSE').map(l=>l.sp+': '+l.t).join('\n')+'\n';
 st.items.forEach((it,i)=>{const t=it.type||'mc'; if(t==='write'||t==='speak')return; s+='\n['+day+'|'+st.id+'|'+i+'] type='+t+(it.limit?' limit='+it.limit:'')+'\nQ: '+it.q+'\n'; if(it.choices)s+=it.choices.map((c,j)=>'  '+j+') '+c).join('\n')+'\n';});}
fs.writeFileSync(out,s);console.log(out,s.length);
