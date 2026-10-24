// ペアマネ smoke test: runs index.html against an in-memory fake of Firebase (no network, no real data).
// usage: node tests/smoke.mjs   (env PLAYWRIGHT=<path to playwright index.mjs>, CHROMIUM=<browser path> are optional)
import http from 'http';import fs from 'fs';import path from 'path';
const {chromium}=await import(process.env.PLAYWRIGHT||'playwright');
const HERE=path.dirname(new URL(import.meta.url).pathname),REPO=path.resolve(HERE,'..');
const srv=http.createServer((q,r)=>{const f=path.join(REPO,q.url==='/'?'index.html':q.url.split('?')[0]);if(!fs.existsSync(f)){r.statusCode=404;return r.end();}r.setHeader('content-type',f.endsWith('.html')?'text/html':f.endsWith('.js')?'text/javascript':'application/octet-stream');r.end(fs.readFileSync(f));}).listen(8123);
const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
const pg=await (await b.newContext({viewport:{width:390,height:844},locale:'ja-JP'})).newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const stubs={'firebase-app.js':'stub-app.js','firebase-auth.js':'stub-auth.js','firebase-firestore.js':'stub-fs.js'};
await pg.route('**/*',async rt=>{const u=rt.request().url();
  for(const k in stubs) if(u.includes('gstatic.com/firebasejs')&&u.endsWith(k)) return rt.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(path.join(HERE,stubs[k]),'utf8')});
  if(u.startsWith('http://localhost'))return rt.continue();return rt.abort();});
const ok=(c,m)=>{if(!c){console.error('FAIL: '+m);process.exitCode=1;}else console.log('ok: '+m);};
await pg.goto('http://localhost:8123/');
await pg.click('[data-act=g-create]');await pg.fill('#w-me','わたし');await pg.fill('#w-pt','パートナー');await pg.click('[data-act=g-create-ok]');
await pg.waitForSelector('text=精算残高');ok(true,'create couple');
await pg.click('[data-act=add]');await pg.fill('#f-amount','1001');
ok((await pg.textContent('#f-result')).includes('¥300'),'1,001円 70:30 → 相手の負担 ¥300 (切り捨て)');
await pg.click('[data-act=save]');await pg.waitForSelector('.bal >> text=¥300');ok(true,'balance ¥300');
await pg.click('[data-act=settle]');await pg.click('[data-act=settle-ok]');await pg.waitForSelector('.done-ov');await pg.waitForTimeout(1700);
ok((await pg.textContent('.bal')).includes('¥0'),'settled → ¥0');
await pg.click('[data-act=tab][data-v=settings]');await pg.click('[data-act=fx-add]');await pg.fill('#fx-amount','80000');await pg.fill('#fx-day','1');await pg.click('[data-act=fx-save]');
await pg.waitForSelector('text=毎月1日');ok(true,'fixed cost saved');
await pg.click('[data-act=cats-open]');await pg.fill('#bd-food','500');await pg.press('#bd-food','Tab');await pg.click('.sheet [data-act=close]');
await pg.click('[data-act=tab][data-v=home]');await pg.waitForSelector('text=今月の予算チェック');ok(true,'budget warning');
ok(errs.length===0,'no page errors '+JSON.stringify(errs));
await b.close();srv.close();
