import http from 'http';import fs from 'fs';import path from 'path';
import {makeStore} from './seed.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT||'playwright');
const LAUNCH=process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{};
const HERE=path.dirname(new URL(import.meta.url).pathname);const REPO=path.resolve(HERE,'../..');
const APP=REPO;
const NM=path.join(HERE,'node_modules');
const OUT=path.join(HERE,'shots');fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png'};
const srv=http.createServer((q,r)=>{const u=q.url.split('?')[0];let f=u.startsWith('/nm/')?path.join(NM,u.slice(4)):path.join(APP,u==='/'?'index.html':u);if(!fs.existsSync(f)){r.statusCode=404;return r.end();}r.setHeader('content-type',mime[path.extname(f)]||'application/octet-stream');r.end(fs.readFileSync(f));}).listen(8124);
const stubs={'firebase-app.js':'stub-app.js','firebase-auth.js':'stub-auth.js','firebase-firestore.js':'stub-fs.js'};
const FONT=['400','500','700'].map(w=>`<link rel="stylesheet" href="http://localhost:8124/nm/@fontsource/zen-maru-gothic/${w}.css">`).join('');
const CSS=`#toast{display:none!important}:root{padding-top:44px!important}.sheet{padding-top:60px!important}.tabs{padding-bottom:30px!important}.fab{bottom:118px!important}.app{padding-top:14px!important}`;
export async function session(opts={}){
  const b=await chromium.launch(LAUNCH);
  const ctx=await b.newContext({viewport:opts.zoom?{width:860,height:1864}:{width:430,height:932},locale:'ja-JP',deviceScaleFactor:opts.zoom?1:(opts.dsf||3),...(opts.video?{recordVideo:{dir:opts.video,size:{width:860,height:1864}}}:{})});
  const pg=await ctx.newPage();
  const {cid,store}=makeStore(opts.seed||{});
  await pg.addInitScript(([cid,store])=>{window.__store=store;window.__uid='u1';window.__preSignedIn=true;try{localStorage.setItem('pairmane.cid',cid);localStorage.setItem('pairmane.seen',String(Date.now()));}catch(e){}},[cid,store]);
  await pg.route('**/*',async rt=>{const u=rt.request().url();
    for(const k in stubs) if(u.includes('gstatic.com/firebasejs')&&u.endsWith(k)) return rt.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(path.join(REPO,'tests',stubs[k]),'utf8')});
    if(u.startsWith('http://localhost'))return rt.continue(); return rt.abort();});
  await pg.goto('http://localhost:8124/');
  await pg.addStyleTag({content:CSS+(opts.zoom?'html{zoom:2}':'')});
  await pg.evaluate((f)=>{document.head.insertAdjacentHTML('beforeend',f);},FONT);
  await pg.waitForSelector('.tab');await pg.waitForTimeout(700);
  return {b,pg,ctx,srv};
}
export {OUT,srv};
