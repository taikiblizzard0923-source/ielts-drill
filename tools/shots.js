// Screenshot every set before and after answering (iPad landscape) for a visual audit
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out=process.argv[3];
const p=await b.newPage({viewport:{width:1180,height:820},deviceScaleFactor:1});
const days=[];for(let d=new Date('2026-11-29');d<=new Date('2026-12-13');d.setDate(d.getDate()+1))days.push(String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));
for(const d of days){await p.goto(process.argv[2]+'#d'+d);await p.waitForTimeout(300);
 await p.screenshot({path:out+'/'+d+'_00_day.png'});
 const n=await p.$$eval('details.set',x=>x.length);
 for(let i=0;i<n;i++){
  await p.evaluate(i=>{document.querySelectorAll('details.set').forEach((s,j)=>s.open=(j===i));},i);await p.waitForTimeout(200);
  let el=(await p.$$('details.set'))[i]; await el.screenshot({path:out+'/'+d+'_'+String(i+1).padStart(2,'0')+'_a_before.png'});
  await p.evaluate(i=>{const s=document.querySelectorAll('details.set')[i];
    s.querySelectorAll('.choices').forEach(c=>c.querySelector('.ch').click());
    s.querySelectorAll('.sel-wrap select').forEach(x=>{x.selectedIndex=1;x.dispatchEvent(new Event('change'))});
    s.querySelectorAll('.fill-wrap input').forEach(x=>{x.value='sample';x.dispatchEvent(new Event('input'))});
    s.querySelectorAll('textarea').forEach(x=>{x.value='My answer.';x.dispatchEvent(new Event('input'))});
    [...s.querySelectorAll('.btn.primary')].forEach(b=>{b.click();});},i);
  await p.waitForTimeout(150);
  await p.evaluate(i=>{const s=document.querySelectorAll('details.set')[i]; const b=s.querySelector('.btn.primary'); if(b) b.click();},i);
  await p.waitForTimeout(300);
  await p.evaluate(i=>{document.querySelectorAll('details.set').forEach((s,j)=>s.open=(j===i)); document.querySelectorAll('details.set')[i].querySelectorAll('details').forEach(x=>x.open=true);},i);
  await p.waitForTimeout(200);
  el=(await p.$$('details.set'))[i]; await el.screenshot({path:out+'/'+d+'_'+String(i+1).padStart(2,'0')+'_b_after.png'});
 }}
await b.close();})();
