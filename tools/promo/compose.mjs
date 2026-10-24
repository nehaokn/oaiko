import http from 'http';import fs from 'fs';import path from 'path';
const {chromium}=await import(process.env.PLAYWRIGHT||'playwright');
const LAUNCH=process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{};
const ROOT=path.dirname(new URL(import.meta.url).pathname);fs.mkdirSync(path.join(ROOT,'out'),{recursive:true});
const mime={'.html':'text/html','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.js':'text/javascript'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.statusCode=404;return r.end();}r.setHeader('content-type',mime[path.extname(f)]||'application/octet-stream');r.end(fs.readFileSync(f));}).listen(8125);
const slides=[
 {img:'home',bg:'#3b5bdb',fg:'#ffffff',ac:'#ffc2d6',l1:'ふたりの立て替え、',l2:'ぜんぶ見える。',sub:'誰が誰にいくら渡せばいいか、自動で計算'},
 {img:'add',bg:'#e4eaff',fg:'#151b2e',ac:'#3b5bdb',l1:'入力は、',l2:'金額を打つだけ。',sub:'払った人とカテゴリを選んで、保存するだけ'},
 {img:'add_method',bg:'#151b2e',fg:'#ffffff',ac:'#8fa4ff',l1:'負担割合は、',l2:'自由自在。',sub:'70:30も、5:5も、全額どちらかの負担も'},
 {img:'settle',bg:'#ffe3ec',fg:'#151b2e',ac:'#c2255c',l1:'精算は、',l2:'ワンタップ。',sub:'渡す人・もらう人・金額をひと目で'},
 {img:'report2',bg:'#3b5bdb',fg:'#ffffff',ac:'#ffc2d6',l1:'予算もグラフも、',l2:'ふたりで管理。',sub:'カテゴリごとの月の予算と、使った金額'},
 {img:'settings',bg:'#e4eaff',fg:'#151b2e',ac:'#3b5bdb',l1:'固定費は、',l2:'自動で記録。',sub:'家賃や通信費を、毎月の指定日に自動で登録'},
 {img:'invite',bg:'#151b2e',fg:'#ffffff',ac:'#ffc2d6',l1:'招待コードで、',l2:'すぐ始められる。',sub:'8文字のコードを送るだけ。ふたり専用・無料'}
];
const MARK=(fs.readFileSync(path.join(ROOT,'../../index.html'),'utf8').match(/var LOGO_MARK='([^']*)'/)||[,''])[1];
const FONT=['500','700'].map(w=>`<link rel="stylesheet" href="http://localhost:8125/node_modules/@fontsource/zen-maru-gothic/${w}.css">`).join('');
const phone=(img)=>`
<div class="phone"><div class="screen"><img src="http://localhost:8125/shots/${img}.png"><div class="sb"><b>9:41</b><span class="ic"><svg width="34" height="22" viewBox="0 0 34 22"><rect x="0" y="14" width="5" height="8" rx="1.5" fill="currentColor"/><rect x="8" y="10" width="5" height="12" rx="1.5" fill="currentColor"/><rect x="16" y="5" width="5" height="17" rx="1.5" fill="currentColor"/><rect x="24" y="0" width="5" height="22" rx="1.5" fill="currentColor"/></svg><svg width="52" height="24" viewBox="0 0 52 24"><rect x="1" y="2" width="44" height="20" rx="6" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/><rect x="4" y="5" width="34" height="14" rx="3.5" fill="currentColor"/><rect x="47" y="8" width="3" height="8" rx="1.5" fill="currentColor" opacity=".5"/></svg></span></div><div class="isl"></div></div></div>`;
const html=(s)=>`<!doctype html><meta charset="utf-8">${FONT}<style>
*{box-sizing:border-box;margin:0}body{width:1290px;height:2796px;overflow:hidden;background:${s.bg};color:${s.fg};font-family:'Zen Maru Gothic',sans-serif;position:relative}
.head{position:absolute;left:96px;right:96px;top:210px}
h1{font-size:114px;line-height:1.22;font-weight:700;letter-spacing:.01em}h1 span{color:${s.ac}}
p{text-wrap:balance;margin-top:40px;font-size:46px;font-weight:500;opacity:.88;line-height:1.5}
.brand{position:absolute;left:96px;top:78px;display:flex;align-items:center;font-size:44px;font-weight:700;letter-spacing:.14em;opacity:.9}
.phone{position:absolute;left:150px;top:880px;width:990px;height:2400px;border-radius:130px;background:#0c0f1a;padding:26px;box-shadow:0 60px 120px rgba(0,0,0,.35),0 0 0 4px rgba(255,255,255,.14) inset}
.screen{position:relative;width:100%;height:100%;border-radius:106px;overflow:hidden;background:#f3f6fc}
.screen img{width:100%;display:block}
.sb{background:#f3f6fc;position:absolute;left:0;right:0;top:0;height:112px;display:flex;justify-content:space-between;align-items:center;padding:8px 84px 0 96px;color:#151b2e;font-size:42px}
.sb b{font-weight:700;font-family:system-ui,sans-serif}.ic{display:flex;gap:16px;align-items:center}
.isl{position:absolute;left:50%;top:26px;width:260px;height:76px;margin-left:-130px;border-radius:40px;background:#0c0f1a}
</style><div class="brand"><span style="width:120px;display:inline-block;vertical-align:middle;margin-right:14px">${MARK}</span>ペアマネ</div><div class="head"><h1>${s.l1}<br><span>${s.l2}</span></h1><p>${s.sub}</p></div>${phone(s.img)}`;
const b=await chromium.launch(LAUNCH);
const pg=await (await b.newContext({viewport:{width:1290,height:2796},deviceScaleFactor:1})).newPage();
for(let i=0;i<slides.length;i++){
  await pg.setContent(html(slides[i]),{waitUntil:'networkidle'});
  await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);
  await pg.screenshot({path:`${ROOT}/out/screen-${i+1}.png`});
}
await b.close();srv.close();
