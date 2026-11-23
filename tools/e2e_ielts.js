// Full check: every day, every set opened, answered, graded/finished; iPad landscape/portrait + phone
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const days=[];for(let d=new Date('2026-11-23');d<=new Date('2026-12-06');d.setDate(d.getDate()+1))days.push(String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));
for(const [w,h] of [[1180,820],[820,1180],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 let sets=0,exs=0,models=0,wide=[],noCheer=[],bandShown=0;
 for(const d of days){await p.goto(process.argv[2]+'#d'+d);await p.waitForTimeout(150);
  const n=await p.$$eval('details.set',x=>x.length);
  for(let i=0;i<n;i++){await p.evaluate(i=>{const s=document.querySelectorAll('details.set')[i];s.open=true;
    s.querySelectorAll('.choices').forEach(c=>c.querySelector('.ch').click());
    s.querySelectorAll('.sel-wrap select').forEach(x=>{x.selectedIndex=1;x.dispatchEvent(new Event('change'))});
    s.querySelectorAll('.fill-wrap input').forEach(x=>{x.value='test';x.dispatchEvent(new Event('input'))});
    const g=[...s.querySelectorAll('.btn.primary')]; g.forEach(b=>{b.click();b.click();});},i);sets++;}
  await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
  exs+=await p.$$eval('.ex',x=>x.length); models+=await p.$$eval('.model',x=>x.length); bandShown+=await p.$$eval('.band',x=>x.length);
  if(await p.evaluate(()=>document.documentElement.scrollWidth)>w) wide.push(d);
  if(d!=='1206'&&!(await p.$('.cheer'))) noCheer.push(d);
 }
 console.log(w+'x'+h,'sets',sets,'graded-ex',exs,'models',models,'band',bandShown,'overflow',wide,'nocheer',noCheer,'errors',errs.slice(0,3));await p.close();}
await b.close();})();
