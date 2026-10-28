
const D = window.__DEMO;
const listeners = new Set();
const auth = { currentUser: D.user || null };
const emit = () => listeners.forEach(fn => fn(auth.currentUser));
export function getAuth(){ return auth; }
export class GoogleAuthProvider {}
export async function signInWithPopup(){ return {}; }
export async function signInAnonymously(a){ if(!a.currentUser){ a.currentUser={uid:D.anonUid||'anon-guest',isAnonymous:true}; } emit(); return {user:a.currentUser}; }
export async function signOut(a){ a.currentUser=null; emit(); }
export function onAuthStateChanged(a, fn){ listeners.add(fn); setTimeout(()=>fn(a.currentUser),0); return ()=>listeners.delete(fn); }
