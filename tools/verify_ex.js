const fs=require('fs'),vm=require('vm');
function load(f){const g={};g.window=g;vm.createContext(g);vm.runInContext(fs.readFileSync(f,'utf8'),g);return g.TEAP.days;}
const A=load(process.argv[2]),B=load(process.argv[3]);let err=[],n=0;
for(const k of Object.keys(A)){const a=A[k],b=B[k];if(!b){err.push('missing day '+k);continue;}
 if(a.sets.length!==b.sets.length)err.push(k+' set count');
 a.sets.forEach((s,i)=>{const t=b.sets[i];if(!t)return;
  for(const f of ['id','passage','script','table'])if(JSON.stringify(s[f])!==JSON.stringify(t[f]))err.push(k+' '+s.id+' '+f+' changed');
  if(t.passage&&!t.passageJa)err.push(k+' '+s.id+' no passageJa');
  if(t.script&&(!t.scriptJa||t.scriptJa.length!==t.script.length))err.push(k+' '+s.id+' scriptJa');
  if(s.items.length!==t.items.length)err.push(k+' '+s.id+' item count');
  s.items.forEach((it,j)=>{const u=t.items[j];if(!u)return;n++;
   for(const f of ['q','choices','a','script'])if(JSON.stringify(it[f])!==JSON.stringify(u[f]))err.push(k+' '+s.id+' #'+j+' '+f+' changed');
   if(!/【正解】/.test(u.ex||'')||!/【他の選択肢】/.test(u.ex||''))err.push(k+' '+s.id+' #'+j+' ex format');
   if(u.script&&(!u.scriptJa||u.scriptJa.length!==u.script.length))err.push(k+' '+s.id+' #'+j+' scriptJa');});});}
console.log(err.length?('NG\n'+err.slice(0,40).join('\n')):'OK', 'items',n);
