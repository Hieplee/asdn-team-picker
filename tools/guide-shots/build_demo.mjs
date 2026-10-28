// Dựng trang demo tự chạy (demo.html + demo/): app thật, Firebase giả trong bộ nhớ, dữ liệu giả, nền vệ tinh thật. Chạy: node build_demo.mjs
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from './stubs.mjs';
import { MEMBERS_JSON, seed } from './data.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
mkdirSync(ROOT + 'demo', { recursive: true });
writeFileSync(ROOT + 'demo/fb-app.js', FIREBASE_APP);
writeFileSync(ROOT + 'demo/fb-auth.js', FIREBASE_AUTH);
writeFileSync(ROOT + 'demo/fb-firestore.js', FIREBASE_FIRESTORE);
const roles = { member: { role: 'member', orders: 'all' }, captain: { role: 'captain', orders: 'all' }, org: { role: 'org', orders: 'all' }, join: { role: 'join', orders: 'none' } };
writeFileSync(ROOT + 'demo/members.json', JSON.stringify(MEMBERS_JSON));
writeFileSync(ROOT + 'demo/seeds.json', JSON.stringify({ members: MEMBERS_JSON, seeds: Object.fromEntries(Object.entries(roles).map(([k, o]) => [k, seed(o)])) }));

const V = 'https://www.gstatic.com/firebasejs/13.0.0/';
let html = readFileSync(ROOT + 'index.html', 'utf8');
const boot = `<title>ASDN · Demo bản đồ trực tiếp</title>
  <script type="importmap">{"imports":{"./members.json":"./demo/members.json","${V}firebase-app.js":"./demo/fb-app.js","${V}firebase-auth.js":"./demo/fb-auth.js","${V}firebase-firestore.js":"./demo/fb-firestore.js"}}</script>
  <script>
    // Demo: dữ liệu giả hoàn toàn, không chạm Firebase thật. ?role=member|captain|org|join
    (function () {
      var role = new URLSearchParams(location.search).get('role') || 'captain';
      var x = new XMLHttpRequest(); x.open('GET', 'demo/seeds.json', false); x.send();
      var d = JSON.parse(x.responseText); window.__DEMO = d.seeds[role] || d.seeds.captain;
      var rf = window.fetch.bind(window);
      window.fetch = function (u, o) {
        var s = String(u);
        if (/members\\.json/.test(s)) return Promise.resolve(new Response(JSON.stringify(d.members), { headers: { 'Content-Type': 'application/json' } }));
        if (/skills\\.json/.test(s)) return Promise.resolve(new Response('{}', { headers: { 'Content-Type': 'application/json' } }));
        return rf(u, o);
      };
      try { localStorage.setItem('asdn-live-share', '1'); } catch (e) {}
      document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { var b = document.querySelector('#tabbar button[data-tab="map"]'); if (b) b.click(); }, 1500); });
    })();
  </script>`;
html = html.replace(/<title>[^<]*<\/title>/, boot);
writeFileSync(ROOT + 'demo.html', html);
console.log('ok demo.html + demo/');
