export function makeStore(opts={}){
  const cid='democouple0123456789';
  const t=new Date();const pad=n=>String(n).padStart(2,'0');
  const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const ym0=t.getFullYear()+'-'+pad(t.getMonth()+1);
  const day=(back)=>ds(new Date(t.getFullYear(),t.getMonth(),t.getDate()-back));
  const mon=(back,d)=>ds(new Date(t.getFullYear(),t.getMonth()-back,d));
  const next1=ds(new Date(t.getFullYear(),t.getMonth()+1,1));
  let n=0;const S={};
  const ex=(date,amount,payer,cat,memo,o={})=>{const id='e'+(++n)+'x'+Math.random().toString(36).slice(2,6);S[`couples/${cid}/expenses/${id}`]={id,date,amount,payer,cat,memo,method:'ratio',ratioA:70,amtA:0,kA:0,kB:0,pending:false,reflect:'',settled:false,by:payer,at:Date.now()-n*1000,...o};};
  ex(day(0),2480,'a','food','スーパーで買い物');
  ex(day(1),1580,'b','daily','洗剤とティッシュ');
  ex(day(2),6200,'b','eat','ふたりで焼肉',{method:'ratio',ratioA:50});
  ex(day(3),7340,'b','util','電気・ガス代');
  ex(day(5),3480,'a','food','週末のまとめ買い');
  ex(day(7),3200,'a','fun','映画とポップコーン',{ratioA:50});
  ex(day(9),5120,'b','food','コストコ');
  ex(day(1),3980,'a','daily','Amazon(カード払い)',{pending:true,reflect:next1});
  // past months (settled) for the chart
  [[1,[22000,14800,12950]],[2,[26500,18200,12600]],[3,[31000,19800,10200]],[4,[24800,21300,11200]],[5,[20300,16100,11800]]].forEach(([b,arr])=>{
    ['food','eat','daily'].forEach((c,i)=>ex(mon(b,8+i*6),arr[i],i%2?'b':'a',c,'',{settled:true}));
  });
  S[`couples/${cid}/settlements/s1`]={id:'s1',date:mon(1,28),from:'b',to:'a',amount:18420};
  S[`couples/${cid}/fixedCosts/f1`]={id:'f1',cat:'rent',memo:'家賃',amount:78000,day:25,payer:'a',lastYm:ym0};
  S[`couples/${cid}/fixedCosts/f2`]={id:'f2',cat:'phone',memo:'スマホ・ネット',amount:9800,day:5,payer:'b',lastYm:ym0};
  S[`couples/${cid}`]={memberUids:opts.waiting?['u1']:['u1','u2'],members:{a:{name:'わたし',photo:null},b:{name:'パートナー',photo:null}},ratioA:70,
    budgets:{food:40000,eat:15000,daily:10000},cats:[{id:'cphone',name:'通信費',icon:'phone',color:'#228be6'}],
    ...(opts.waiting?{inviteCode:'K7Q4M2XD'}:{})};
  if(opts.fixedCat){}
  return {cid,store:S};
}
