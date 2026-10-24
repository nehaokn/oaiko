const store=window.__store=window.__store||{};const subs=[];
const P=(...x)=>({path:x.slice(1).join('/'),id:x[x.length-1]});
export const initializeFirestore=()=>({});export const persistentLocalCache=()=>({});export const persistentMultipleTabManager=()=>({});
export const doc=(a,...x)=>{ if(a&&a.path&&a.coll){return {path:a.path+'/'+x[0],id:x[0]};} return P(a,...x);};
export const collection=(a,...x)=>({path:x.join('/'),coll:true,id:x[x.length-1]});
export const query=(c)=>c;export const where=()=>({});
const notify=()=>subs.forEach(s=>s());
const get=(p)=>store[p];
function snapDoc(path){return {exists:()=>path in store,data:()=>store[path]};}
function snapColl(path){const pre=path+'/';const ids=Object.keys(store).filter(k=>k.startsWith(pre)&&!k.slice(pre.length).includes('/'));return {docs:ids.map(k=>({id:k.slice(pre.length),data:()=>store[k],metadata:{hasPendingWrites:false}})),empty:!ids.length,docChanges:()=>[]};}
export const onSnapshot=(ref,cb)=>{const f=()=>cb(ref.coll?snapColl(ref.path):snapDoc(ref.path));subs.push(f);setTimeout(f,5);return()=>{}};
export const getDoc=async(ref)=>snapDoc(ref.path);
export const getDocs=async(q)=>({empty:true,docs:[]});
function merge(path,o){const cur=store[path]=store[path]||{};for(const k in o){if(k.includes('.')){const parts=k.split('.');let t=cur;for(let i=0;i<parts.length-1;i++){t[parts[i]]=t[parts[i]]||{};t=t[parts[i]];}const v=o[k];if(v&&v.__del)delete t[parts[parts.length-1]];else t[parts[parts.length-1]]=v;}else if(o[k]&&o[k].__union){cur[k]=[...(cur[k]||[]),o[k].__union];}else if(o[k]&&o[k].__del){delete cur[k];}else cur[k]=o[k];}}
export const setDoc=async(ref,o)=>{store[ref.path]=JSON.parse(JSON.stringify(o));notify();};
export const updateDoc=async(ref,o)=>{merge(ref.path,o);notify();};
export const deleteDoc=async(ref)=>{delete store[ref.path];notify();};
export const deleteField=()=>({__del:1});export const arrayUnion=(v)=>({__union:v});export const serverTimestamp=()=>1;
export const writeBatch=()=>{const ops=[];return {set:(r,o)=>ops.push(()=>{store[r.path]=JSON.parse(JSON.stringify(o))}),update:(r,o)=>ops.push(()=>merge(r.path,o)),delete:(r)=>ops.push(()=>delete store[r.path]),commit:async()=>{ops.forEach(f=>f());notify();}};};
