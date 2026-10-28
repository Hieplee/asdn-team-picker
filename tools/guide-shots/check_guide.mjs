import { launch, openPage } from './lib.mjs';
import { seed } from './data.mjs';
const b = await launch();
for (const [name, size] of [['m', [390, 844]], ['d', [1280, 900]]]) {
  const { page } = await openPage(b, { size, scene: seed({ role: 'captain' }), scale: 1 });
  await page.evaluate(() => { localStorage.setItem('asdn-guide-part', 'map'); });
  await page.click('#tabbar button[data-tab="guide"]').catch(async () => { await page.click('a[data-target="guide-heading"]').catch(() => {}); });
  await page.waitForTimeout(800);
  await page.evaluate(() => { document.querySelectorAll('#g-parts button').forEach(b => { if (b.textContent.includes('Bản đồ')) b.click(); }); });
  await page.waitForTimeout(500);
  const sec = await page.$('#g-body');
  await sec.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll('#g-body img').forEach(i => i.loading = 'eager'));
  await page.waitForTimeout(2500);
  const el = await page.$('#g-body');
  const box = await el.boundingBox();
  console.log(name, 'height', box.height, 'imgs', await page.evaluate(() => [...document.querySelectorAll('#g-body img')].filter(i => i.complete && i.naturalWidth).length + '/' + document.querySelectorAll('#g-body img').length));
  await page.screenshot({ path: `/tmp/g-${name}.png`, fullPage: true, clip: undefined });
  if (name === 'm') { await page.evaluate(() => document.querySelector('.g-orient button:last-child').click()); await page.waitForTimeout(1500); await page.screenshot({ path: '/tmp/g-m-land.png', fullPage: true }); }
}
await b.close();
