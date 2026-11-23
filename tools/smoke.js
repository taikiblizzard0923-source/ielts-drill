// node smoke.js <url-hash-day>  — quick render/grade smoke test against http://127.0.0.1:8770
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1180,820],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('http://127.0.0.1:8770/#'+(process.argv[2]||'d1123'));await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelectorAll('details.set').forEach(d=>d.open=true));
await p.selectOption('select',{index:2});await p.click('.ch >> nth=0');await p.click('.ch >> nth=3');await p.fill('.fill-wrap input','Kent');
await p.click('.btn.primary >> nth=0');await p.waitForTimeout(300);await p.evaluate(()=>document.querySelectorAll('details.set').forEach(d=>d.open=true));
const r=await p.evaluate(()=>document.querySelector('.result')&&document.querySelector('.result').innerText);
await p.fill('textarea >> nth=0','hello world');
await p.screenshot({path:process.env.SHOT_DIR+'/ielts_'+w+'.png',fullPage:true});
console.log(w,'sw',await p.evaluate(()=>document.documentElement.scrollWidth),'result:',(r||'').replace(/\n/g,' | '),'svgs',await p.$$eval('svg',x=>x.length),e);await p.close();}
await b.close();})();
