// Chụp ảnh hướng dẫn bản đồ (dọc 390x844, ngang 844x390). Chạy: node shots.mjs [key ...]  (cần server tĩnh ở BASE, mặc định http://localhost:8123/)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { launch, openPage, waitTiles, tapMap, screenOf } from './lib.mjs';
import { seed } from './data.mjs';

const OUT = new URL('./out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const SIZES = { p: [390, 844], l: [844, 390] };

async function openMap(page, { share = true, wait = true } = {}) {
  if (share) await page.evaluate(() => localStorage.setItem('asdn-live-share', '1'));
  await page.click('#tabbar button[data-tab="map"]');
  await page.waitForTimeout(1200);
  if (wait) await waitTiles(page);
}
const bar = (page, n) => page.click(`#draw-bar button:nth-child(${n})`);
const closeSheet = async page => { await page.evaluate(() => document.querySelector('#live-sheet [data-close]')?.click()); await page.waitForTimeout(400); };

// Thu rect các phần tử (theo selector, có thể lọc text/nth) thành % khung nhìn
async function collect(page, marks, size) {
  const [W, H] = size;
  return page.evaluate(([marks, W, H]) => {
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !e.closest('[hidden]'); };
    const out = {};
    for (const [name, spec] of Object.entries(marks)) {
      let els = spec.fn ? [] : [...document.querySelectorAll(spec.sel)].filter(e => spec.kids || vis(e));
      if (spec.kids) els = els.filter(e => !spec.text || e.textContent.includes(spec.text)).slice(spec.nth || 0, (spec.nth || 0) + 1).flatMap(e => [...e.children]).filter(vis);
      if (spec.text && !spec.kids) els = els.filter(e => e.textContent.includes(spec.text));
      if (spec.fn === 'cell') { // ô con của lưới, ví dụ "A1 4"
        const lv = [...document.querySelectorAll('.gridlbl.lv2')].map(e => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left + r.width / 2, y: r.top + r.height / 2 }; }).filter(l => l.x > 0 && l.y > 0 && l.x < W && l.y < H);
        const fours = lv.filter(l => l.t === '4').sort((a, b) => (a.x + a.y) - (b.x + b.y));
        const f = fours[0]; if (!f) continue;
        const near = t => lv.filter(l => l.t === t).sort((a, b) => Math.hypot(a.x - f.x, a.y - f.y) - Math.hypot(b.x - f.x, b.y - f.y))[0];
        const five = near('5'), one = near('1'), seven = near('7');
        const sw = Math.abs(five.x - f.x), sh = Math.abs(f.y - seven.y);
        out[name] = [(f.x - sw / 2) / W * 100, (f.y - sh / 2) / H * 100, sw / W * 100, sh / H * 100].map(v => Math.round(v * 100) / 100);
        continue;
      }
      if (spec.all || spec.kids) { /* hợp của mọi phần tử khớp */ } else els = els.slice(spec.nth || 0, (spec.nth || 0) + 1);
      if (!els.length) continue;
      let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
      els.forEach(e => { const q = e.getBoundingClientRect(); l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); });
      const pad = spec.pad ?? 3;
      l = Math.max(0, l - pad); t = Math.max(0, t - pad); r = Math.min(W, r + pad); b = Math.min(H, b + pad);
      if (r - l < 4 || b - t < 4) continue;
      out[name] = [l / W * 100, t / H * 100, (r - l) / W * 100, (b - t) / H * 100].map(v => Math.round(v * 100) / 100);
    }
    return out;
  }, [marks, W, H]);
}

const CAP = { sel: '#draw-bar button:nth-child(' };
const SHOTS = [
  { key: 'join-code', seed: { role: 'join', joined: ['d01', 'd03'] }, run: async p => { await p.click('#tabbar button[data-tab="map"]'); await p.waitForTimeout(800); },
    marks: { code: { sel: '.join-code' }, next: { sel: '.join-next' }, note: { sel: '.join-note' } } },
  { key: 'pick-name', seed: { role: 'join', joined: ['d01', 'd03'] }, run: async p => { await p.click('#tabbar button[data-tab="map"]'); await p.waitForTimeout(600); await p.fill('.join-code', '1K7QMA'); await p.click('.join-next'); await p.waitForSelector('.pick-row'); await p.waitForTimeout(500); },
    marks: { back: { sel: '.pick-head .text-button' }, team: { sel: '.pick-team' }, taken: { sel: '.pick-row[disabled]' }, mine: { sel: '.pick-row:not([disabled])', text: 'Khoa' } } },
  { key: 'pick-chosen', seed: { role: 'join', joined: ['d01', 'd03'] }, run: async (p, o) => { await p.click('#tabbar button[data-tab="map"]'); await p.waitForTimeout(600); await p.fill('.join-code', '1K7QMA'); await p.click('.join-next'); await p.waitForSelector('.pick-row'); await p.click('.pick-row:not([disabled]):has-text("Khoa")'); await p.waitForTimeout(400); },
    marks: { chosen: { sel: '.pick-row.selected' }, confirm: { sel: '.pick-bar button' } } },
  { key: 'share-ask', seed: { role: 'member', share: false }, run: async p => { await openMap(p, { share: false }); await p.waitForSelector('#live-sheet.open'); await p.waitForTimeout(500); },
    marks: { why: { sel: '.ask-share p', all: true }, share: { sel: '.ask-share .primary-button' }, view: { sel: '.ask-share .secondary-button' } } },
  { key: 'map', seed: { role: 'member', orders: 'target', stale: ['d06'] }, run: async p => { await openMap(p); },
    marks: { chip: { sel: '.hud-chip' }, fit: { sel: '#btn-fit' }, grid: { sel: '#btn-grid' }, sat: { sel: '#btn-sat' }, full: { sel: '#btn-full' }, me: { sel: '.pl.me', kids: true, pad: 8 }, mate: { sel: '.pl:not(.me):not(.stale)', kids: true, nth: 1, pad: 8 }, stale: { sel: '.pl.stale', kids: true, pad: 8 }, captain: { sel: '.pl', kids: true, text: '★', pad: 8 }, target: { sel: '.tgt-pin', nth: 0, pad: 2 }, tools: { sel: '#draw-bar', pad: 2 }, share: { sel: '#btn-share' }, area: { sel: '.leaflet-overlay-pane path', nth: 0, pad: 0 } } },
  { key: 'grid', seed: { role: 'member', orders: 'target' }, run: async p => { await openMap(p); await p.click('#btn-grid'); await p.waitForTimeout(700); },
    marks: { grid: { sel: '#btn-grid' }, top: { sel: '#edge-top span', nth: 0, pad: 6 }, left: { sel: '#edge-left span', nth: 0, pad: 6 }, cell: { fn: 'cell', sel: '' } } },
  { key: 'team-sheet', seed: { role: 'member', orders: 'target', joined: ['d01', 'd02', 'd03', 'd04', 'd05'], noPos: ['d03'], stale: ['d04'] }, run: async p => { await openMap(p); await p.click('.hud-chip'); await p.waitForTimeout(700); },
    marks: { on: { sel: '.team-row', nth: 0 }, me: { sel: '.team-row', nth: 1 }, nopos: { sel: '.team-row', nth: 2 }, lost: { sel: '.team-row', nth: 3 }, out: { sel: '.team-row', nth: 5 }, handle: { sel: '.sheet-handle' } } },
  { key: 'target-hint', seed: { role: 'member', orders: 'none' }, run: async p => { await openMap(p); await bar(p, 1); await p.waitForTimeout(500); },
    marks: { hint: { sel: '#map-hint' }, cancel: { sel: '#draw-bar button', nth: 0 } } },
  { key: 'target-placed', seed: { role: 'member', orders: 'none' }, run: async p => { await openMap(p); await bar(p, 1); await tapMap(p, [57, 41]); await p.waitForTimeout(600); },
    marks: { pin: { sel: '.tgt-pin', nth: 0, pad: 4 }, orders: { sel: '#draw-bar button', nth: 2 } } },
  { key: 'orders', seed: { role: 'member', orders: 'all' }, run: async p => { await openMap(p); await p.click('#draw-bar button:nth-child(3)'); await p.waitForTimeout(700); },
    marks: { row: { sel: '.order-main', nth: 0 }, own: { sel: '.order-main', text: 'Khoa' }, del: { sel: '.icon-button[aria-label="Xóa lệnh này"]', nth: 0 }, icon: { sel: '.order-icon', nth: 1 }, sheet: { sel: '.sheet-handle' } } },
  { key: 'captain-bar', seed: { role: 'captain', orders: 'all' }, run: async p => { await openMap(p); },
    marks: { target: { sel: '#draw-bar button', nth: 0 }, dead: { sel: '#draw-bar button', nth: 1 }, atk: { sel: '#draw-bar button', nth: 2 }, def: { sel: '#draw-bar button', nth: 3 }, arrow: { sel: '#draw-bar button', nth: 4 }, zone: { sel: '#draw-bar button', nth: 5 }, orders: { sel: '#draw-bar button', nth: 6 } } },
  { key: 'attack-defend', seed: { role: 'captain', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 3); await tapMap(p, [80, 45]); await bar(p, 3); await tapMap(p, [88, 56]); await bar(p, 4); await tapMap(p, [44, 55]); await bar(p, 4); await tapMap(p, [53, 30]); await p.waitForTimeout(600); },
    marks: { atk1: { sel: '.tgt-pin:has(.svg-ic.attack)', nth: 0, pad: 4 }, atk2: { sel: '.tgt-pin:has(.svg-ic.attack)', nth: 1, pad: 4 }, def1: { sel: '.tgt-pin:has(.svg-ic.defend)', nth: 0, pad: 4 }, def2: { sel: '.tgt-pin:has(.svg-ic.defend)', nth: 1, pad: 4 } } },
  { key: 'draw-arrow', seed: { role: 'captain', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 5); for (const pt of [[6, 31], [24, 34], [42, 37], [56, 38]]) await tapMap(p, pt); await p.waitForTimeout(500); },
    marks: { hint: { sel: '#map-hint' }, cancel: { sel: '#draw-bar button', nth: 0 }, undo: { sel: '#draw-bar button', nth: 1 }, done: { sel: '#draw-bar button', nth: 2 }, start: { sel: '.leaflet-overlay-pane path.leaflet-interactive', nth: 99 } } },
  { key: 'draw-zone', seed: { role: 'captain', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 6); for (const pt of [[73, 6], [96, 5], [100, 24], [75, 25]]) await tapMap(p, pt); await p.waitForTimeout(500); },
    marks: { hint: { sel: '#map-hint' }, undo: { sel: '#draw-bar button', nth: 1 }, done: { sel: '#draw-bar button', nth: 2 } } },
  { key: 'plan', seed: { role: 'captain', orders: 'all' }, run: async p => { await openMap(p); },
    marks: { arrow: { sel: '.leaflet-overlay-pane path[stroke="#ff7a1a"]', nth: 0, pad: 6 }, head: { sel: '.ah', pad: 8 } } },
  { key: 'death-hint', seed: { role: 'member', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 2); await p.waitForTimeout(500); },
    marks: { hint: { sel: '#map-hint' }, cancel: { sel: '#draw-bar button', nth: 0 } } },
  { key: 'death-pin', seed: { role: 'member', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 2); await tapMap(p, [22, 52]); await p.waitForTimeout(4500); },
    marks: { chip: { sel: '.hud-chip' }, badge: { sel: '.hud-dead', pad: 3 }, pin: { sel: '.dead-pin', pad: 5 }, btn: { sel: '#draw-bar button', nth: 1 } } },
  { key: 'death-pick', seed: { role: 'captain', orders: 'target' }, run: async p => { await openMap(p); await bar(p, 2); await tapMap(p, [68, 46]); await p.waitForSelector('.team-row'); await p.waitForTimeout(500); await p.click('.team-row:has-text("Bình")'); await p.waitForTimeout(300); await p.evaluate(() => { const b = document.querySelector('#live-sheet-body'); b.scrollTop = b.scrollHeight; }); await p.waitForTimeout(300); },
    marks: { list: { sel: '.pick-list' }, chosen: { sel: '.team-row.sel' }, confirm: { sel: '.sheet-actions .primary-button' } } },
  { key: 'death-team', seed: { role: 'captain', orders: 'target', deaths: { d05: [68, 46] } }, run: async p => { await openMap(p); await p.click('.hud-chip'); await p.waitForTimeout(700); },
    marks: { dead: { sel: '.dead-row .team-row' }, revive: { sel: '.revive-btn' } } },
  { key: 'org-map', seed: { role: 'org', orders: 'all' }, run: async p => { await openMap(p); },
    marks: { gear: { sel: '#btn-org' }, chip: { sel: '.hud-chip' } } },
  { key: 'org-sheet', seed: { role: 'org', orders: 'all', joined: ['d01', 'd02', 'd03', 'd04', 'd05'] }, run: async p => { await openMap(p); await p.click('#btn-org'); await p.waitForSelector('.org-team'); await p.waitForTimeout(800); },
    marks: { area: { sel: '.org-map' }, code: { sel: '.org-code code' }, qr: { sel: '.org-code-actions button', nth: 0 }, link: { sel: '.org-code-actions button', nth: 1 }, joined: { sel: '.org-team header small', nth: 0 }, star: { sel: '.org-member .icon-button', nth: 0 }, remove: { sel: '.org-member .icon-button', nth: 1 } } },
  { key: 'org-qr', seed: { role: 'org', orders: 'all', joined: ['d01', 'd02', 'd03', 'd04', 'd05'] }, run: async p => { await openMap(p); await p.click('#btn-org'); await p.waitForSelector('.org-team'); await p.waitForTimeout(500); await p.click('.org-code-actions button:has-text("HIỆN QR")'); await p.waitForTimeout(900); },
    marks: { qr: { sel: '.qr-box' }, hide: { sel: '.org-code-actions button', nth: 0 }, link: { sel: '.org-code-actions button', nth: 1 }, newcode: { sel: '.org-team .text-button', text: 'Đổi mã' } } },
  { key: 'org-round', seed: { role: 'org', orders: 'all', joined: ['d01', 'd02', 'd03', 'd04', 'd05'] }, run: async p => { await openMap(p); await p.click('#btn-org'); await p.waitForSelector('.org-team'); await p.waitForTimeout(500); await p.evaluate(() => { const b = document.querySelector('#live-sheet-body'); b.scrollTop = b.scrollHeight; }); await p.waitForTimeout(500); },
    marks: { revive: { sel: '.org-team > .text-button', text: 'Hồi sinh', nth: 0 }, round: { sel: '.org-danger button', nth: 0 }, end: { sel: '.org-danger button', nth: 1 } } },
];

const only = process.argv.slice(2);
const meta = existsSync(OUT + 'meta.json') ? JSON.parse(readFileSync(OUT + 'meta.json', 'utf8')) : {};
const browser = await launch();
for (const shot of SHOTS) {
  if (only.length && !only.includes(shot.key)) continue;
  for (const o of ['p', 'l']) {
    const size = SIZES[o];
    const { page, ctx } = await openPage(browser, { size, scene: seed(shot.seed) });
    try {
      await shot.run(page, { land: o === 'l' });
      await page.waitForTimeout(400);
      const marks = await collect(page, shot.marks, size);
      await page.screenshot({ path: `${OUT}${shot.key}-${o}.png` });
      (meta[shot.key] ||= {})[o] = marks;
      console.log(shot.key, o, Object.keys(marks).join(','), 'missing:', Object.keys(shot.marks).filter(k => !marks[k]).join(','));
    } catch (e) { console.log('FAIL', shot.key, o, e.message.split('\n')[0]); }
    await ctx.close();
  }
}
writeFileSync(OUT + 'meta.json', JSON.stringify(meta, null, 1));
await browser.close();
