// fake Firebase Auth: starts signed out (like a first visit); signInAnonymously signs in as window.__uid||'u1'
let cbs=[];let user=window.__preSignedIn?{uid:window.__uid||'u1'}:null;
export const getAuth=()=>({get currentUser(){return user?{uid:user.uid,isAnonymous:!window.__linked,email:window.__linked}:null;}});
export const onAuthStateChanged=(a,cb)=>{cbs.push(cb);setTimeout(()=>cb(user),20);return ()=>{}};
export const signInAnonymously=async()=>{user={uid:window.__uid||'u1'};setTimeout(()=>cbs.forEach(f=>f(user)),0);return {user};};
export const EmailAuthProvider={credential:(e,p)=>({e,p})};
export const linkWithCredential=async(u,c)=>{window.__linked=c.e;};
export const signInWithEmailAndPassword=async()=>({});
export const sendPasswordResetEmail=async()=>{};
export const signOut=async()=>{user=null;cbs.forEach(f=>f(null));};
