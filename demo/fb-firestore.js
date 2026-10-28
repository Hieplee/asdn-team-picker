
const D = window.__DEMO;
const ts = ms => ({ toMillis: () => ms });
const revive = d => d && d.ts && typeof d.ts.__ago === 'number' ? { ...d, ts: ts(Date.now() - d.ts.__ago) } : d;
const store = new Map(Object.entries(D.docs || {}).map(([k, v]) => [k, revive(v)]));
const watchers = new Set();
export const serverTimestamp = () => ({ __ts: true });
const resolve = v => v && v.__ts ? ts(Date.now()) : v;
const clean = data => Object.fromEntries(Object.entries(data).map(([k, v]) => [k, resolve(v)]));
export const initializeFirestore = () => ({});
export const doc = (_db, ...p) => ({ kind: 'doc', path: p.join('/'), id: p[p.length - 1] });
export const collection = (_db, ...p) => ({ kind: 'col', path: p.join('/') });
export const query = r => r; export const orderBy = () => null; export const limit = () => null;
const docSnap = path => ({ id: path.split('/').pop(), exists: () => store.has(path), data: () => store.get(path) });
const colDocs = path => [...store.keys()].filter(k => k.startsWith(path + '/') && !k.slice(path.length + 1).includes('/')).sort().map(docSnap);
const colSnap = path => { const docs = colDocs(path); return { docs, size: docs.length, empty: !docs.length, forEach: fn => docs.forEach(fn), docChanges: () => [] }; };
const snapOf = r => r.kind === 'doc' ? docSnap(r.path) : colSnap(r.path);
export function onSnapshot(r, next){ const w = { r, next, last: null }; watchers.add(w); setTimeout(() => { w.last = sig(r); next(snapOf(r)); }, 0); return () => watchers.delete(w); }
const rep = (k, v) => v && typeof v.toMillis === 'function' ? v.toMillis() : v;
const sig = r => r.kind === 'doc' ? JSON.stringify(store.get(r.path) ?? null, rep) : JSON.stringify(colDocs(r.path).map(s => [s.id, s.data()]), rep);
function notify(){ watchers.forEach(w => { const s = sig(w.r); if (s !== w.last) { w.last = s; w.next(snapOf(w.r)); } }); }
export async function getDoc(r){ return docSnap(r.path); }
export async function getDocs(r){ return colSnap(r.path); }
export async function setDoc(r, data, opts){ store.set(r.path, opts && opts.merge ? { ...(store.get(r.path) || {}), ...clean(data) } : clean(data)); notify(); }
export async function deleteDoc(r){ store.delete(r.path); notify(); }
export function writeBatch(){ const ops = []; const b = { set: (r, d) => { ops.push(() => store.set(r.path, clean(d))); return b; }, delete: r => { ops.push(() => store.delete(r.path)); return b; }, commit: async () => { ops.forEach(fn => fn()); notify(); } }; return b; }
// Giữ chấm GPS của đồng đội luôn "tươi" (app mờ sau 60 giây) trong lúc chụp.
setInterval(() => { (D.fresh || []).forEach(path => { const d = store.get(path); if (d) d.ts = ts(Date.now() - (D.freshAge?.[path] || 4000)); }); notify(); }, 2500);
window.__store = store; window.__notify = notify;
