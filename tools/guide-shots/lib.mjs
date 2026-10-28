
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from './stubs.mjs';
import { MEMBERS_JSON, ll, seed } from './data.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const HERE = new URL('.', import.meta.url).pathname;
export const BASE = process.env.BASE || 'http://localhost:8123/';
const js = body => ({ status: 200, contentType: 'text/javascript; charset=utf-8', body });
const fontCss = () => {
  const out = [];
  for (const w of [400, 500, 600, 700]) out.push(`@font-face{font-family:'DM Sans';font-weight:${w};font-style:normal;src:url(/__fonts/dm-sans-latin-${w}-normal.woff2) format('woff2')}`);
  for (const w of [500, 600, 700, 800]) out.push(`@font-face{font-family:'Barlow Condensed';font-weight:${w};font-style:normal;src:url(/__fonts/barlow-condensed-latin-${w}-normal.woff2) format('woff2')}`);
  return out.join('\n');
};

export async function launch() { return chromium.launch({ args: ['--no-sandbox'] }); }

/** Mở một trang mới với dữ liệu giả. size: [w,h]. */
export async function openPage(browser, { size, scene, scale = 2, geo = true }) {
  const [w, h] = size;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale, isMobile: true, hasTouch: true, locale: 'vi-VN', permissions: geo ? ['geolocation'] : [], geolocation: geo ? { latitude: ll(...scene.myPos)[0], longitude: ll(...scene.myPos)[1], accuracy: 6 } : undefined });
  await ctx.addInitScript(s => { window.__DEMO = s; }, scene);
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'wakeLock', { value: { request: async () => ({ addEventListener() {}, release: async () => {} }) } }); } catch {} });
  await ctx.addInitScript(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} });
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    const host = url.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      if (url.pathname.endsWith('/members.json')) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS_JSON) });
      if (url.pathname.endsWith('/skills.json')) return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      if (url.pathname.startsWith('/__fonts/')) return route.fulfill({ status: 200, contentType: 'font/woff2', body: readFileSync(HERE + 'node_modules/@fontsource/' + (url.pathname.includes('barlow') ? 'barlow-condensed' : 'dm-sans') + '/files/' + url.pathname.split('/').pop()) });
      return route.continue();
    }
    if (host === 'fonts.googleapis.com') return route.fulfill({ status: 200, contentType: 'text/css', body: fontCss().replaceAll('url(/', 'url(' + BASE) });
    if (host === 'unpkg.com' && url.pathname.endsWith('leaflet.js')) return route.fulfill(js(readFileSync(HERE + 'node_modules/leaflet/dist/leaflet.js', 'utf8') + '\n;L.Map.addInitHook(function(){window.__map=this});'));
    if (host === 'unpkg.com' && url.pathname.endsWith('leaflet.css')) return route.fulfill({ status: 200, contentType: 'text/css', body: readFileSync(HERE + 'node_modules/leaflet/dist/leaflet.css', 'utf8') });
    if (host === 'cdn.jsdelivr.net') return route.fulfill(js(readFileSync(HERE + 'node_modules/qrcode-generator/qrcode.js', 'utf8')));
    if (host === 'www.gstatic.com' && url.pathname.includes('firebase-app')) return route.fulfill(js(FIREBASE_APP));
    if (host === 'www.gstatic.com' && url.pathname.includes('firebase-auth')) return route.fulfill(js(FIREBASE_AUTH));
    if (host === 'www.gstatic.com' && url.pathname.includes('firebase-firestore')) return route.fulfill(js(FIREBASE_FIRESTORE));
    const tile = /\/tile\/(\d+)\/(\d+)\/(\d+)/.exec(url.pathname);
    if (tile) {
      const f = `${HERE}tiles/${tile[1]}/${tile[2]}/${tile[3]}.jpg`;
      return existsSync(f) ? route.fulfill({ status: 200, contentType: 'image/jpeg', body: readFileSync(f) }) : route.fulfill({ status: 404, body: '' });
    }
    return route.abort();
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto(BASE + 'index.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  return { page, ctx };
}

export async function waitTiles(page) {
  await page.waitForFunction(() => document.querySelectorAll('.leaflet-tile-loaded').length > 0 && !document.querySelector('.leaflet-tile-loading'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(700);
}

/** Toạ độ màn hình (px CSS) của điểm (x, y) mét trong khu chơi, dùng để chạm lên bản đồ. */
export async function screenOf(page, xy) {
  const [lat, lng] = ll(...xy);
  return page.evaluate(([lat, lng]) => { const p = window.__map.latLngToContainerPoint([lat, lng]); const r = document.querySelector('#map-canvas').getBoundingClientRect(); return { x: r.left + p.x, y: r.top + p.y }; }, [lat, lng]);
}
export async function tapMap(page, xy) { const p = await screenOf(page, xy); await page.mouse.click(p.x, p.y); await page.waitForTimeout(350); }
