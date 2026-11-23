const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const days=[];for(let d=3;d<=22;d++)days.push('11'+String(d).padStart(2,'0'));
for(const [w,h] of [[1180,820],[820,1180],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 let wide=0,sets=0,exs=0,ja=0,miss=[];
 for(const d of days){await p.goto('file://'+process.cwd()+'/teap.html#d'+d);await p.waitForTimeout(150);
  const n=await p.$$eval('details.set',x=>x.length);
  for(let i=0;i<n;i++){await p.evaluate(i=>{const s=document.querySelectorAll('details.set')[i];s.open=true;s.querySelectorAll('.choices').forEach(c=>c.querySelector('.ch').click());const g=s.querySelector('.btn.primary');g.click();g.click&&g.click();},i);sets++;}
  await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
  exs+=await p.$$eval('.ex',x=>x.length); ja+=await p.$$eval('.passage-ja, .script .ja',x=>x.length);
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth); if(sw>w)wide++;
  if(!(await p.$('.cheer'))&&d!=='1122')miss.push(d);
 }
 console.log(w+'x'+h,'sets',sets,'graded ex',exs,'ja blocks',ja,'overflow days',wide,'no cheer',miss,'errors',errs.slice(0,3));await p.close();}
await b.close();})();
