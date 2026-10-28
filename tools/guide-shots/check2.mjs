import { launch, openPage } from './lib.mjs';
import { seed } from './data.mjs';
const b = await launch();
const { page } = await openPage(b, { size: [390, 844], scene: seed({ role: 'join' }), scale: 1 });
await page.evaluate(() => localStorage.setItem('asdn-guide-part', 'map'));
await page.click('#tabbar button[data-tab="guide"]');
await page.waitForTimeout(600);
await page.evaluate(() => [...document.querySelectorAll('#g-parts button')].find(b => b.textContent.includes('Bản đồ')).click());
await page.waitForTimeout(500);
const figs = await page.$$('.g-mfig');
console.log('figs', figs.length);
for (const [i, n] of [[4, 'map'], [11, 'attack']]) { await figs[i].scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); await figs[i].screenshot({ path: `/tmp/f-${n}-p.png` }); }
await page.evaluate(() => document.querySelectorAll('.g-orient button:last-child')[0].click());
await page.waitForTimeout(800);
const f2 = await page.$$('.g-mfig'); await f2[4].scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); await f2[4].screenshot({ path: '/tmp/f-map-l.png' });
await page.click('.g-mfig:nth-of-type(1) .g-shot, #g-body .g-mfig >> nth=4 >> .g-shot', { force: true }).catch(e => console.log('lb fail', e.message.slice(0, 80)));
await page.waitForTimeout(500); await page.screenshot({ path: '/tmp/f-lb.png' });
await b.close();
