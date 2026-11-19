// DKL safety test: "does the new build look and behave exactly like the live site?"
//
// Uses saved copies of real store pages (tests/fixtures/*.html), because Payhip's Cloudflare
// correctly blocks robot visitors to the live site.
// For every saved page, desktop and mobile:
//   A = the page with the code that is published right now (files fetched from GitHub Pages)
//   B = the same page with the NEW build from dist/ (served locally, nothing public yet)
// Then it compares A and B: JavaScript errors, the shared-CSS sentinel, key DKL elements, and a pixel diff.
// Any difference above the limits fails the run, so a broken build is never published.
// With no saved pages yet, the test is skipped (the build checks still run).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const CFG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const SITE = 'https://doodlekidsland.com';
const MODE = 'preflight';
const FIX = 'tests/fixtures';
const PAGES = fs.existsSync(path.join(FIX, 'pages.json')) ? JSON.parse(fs.readFileSync(path.join(FIX, 'pages.json'), 'utf8')).pages : {};
const fixtures = Object.keys(PAGES).filter(f => fs.existsSync(path.join(FIX, f)));
if (!fixtures.length) { console.log('No saved pages in tests/fixtures yet: visual safety test skipped.'); process.exit(0); }
const BASE = CFG.baseUrl.replace(/\/$/, '');
const OUT = 'test-results';
const MAX_DIFF = Number(process.env.MAX_DIFF || 0.01); // 1% of pixels
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const dist = (f) => fs.readFileSync(path.join('dist', f), 'utf8');
const NEW = {
  header: dist('payhip/header.html'), footer: dist('payhip/footer.html'), storeBox: dist('payhip/store-css-box.css'),
};

function cut(html, startMarks, endMark, last) {
  for (const s of startMarks) {
    const a = html.indexOf(s);
    if (a < 0) continue;
    const b = last ? html.lastIndexOf(endMark) : html.indexOf(endMark, a);
    if (b < a) continue;
    return [a, b + (endMark.startsWith('<!--') ? endMark.length : 0)];
  }
  return null;
}

function swap(html) {
  // Store CSS box
  const sm = html.match(/<style[^>]*id=["']store-page-custom-css-style-tag["'][^>]*>/);
  if (!sm) throw new Error('Store CSS tag not found');
  const s = sm.index + sm[0].length;
  const se = html.indexOf('</style>', s);
  html = html.slice(0, s) + '\n' + NEW.storeBox + '\n' + html.slice(se);
  // Header injection: new markers if already switched, otherwise the old first/last lines
  let h = cut(html, ['<!-- DKL:HEADER:START'], '<!-- DKL:HEADER:END -->') || cut(html, ['<!-- Google Tag Manager (DKL'], '</head>');
  if (!h) throw new Error('Header injection not found');
  html = html.slice(0, h[0]) + NEW.header + '\n' + html.slice(h[1]);
  let f = cut(html, ['<!-- DKL:FOOTER:START'], '<!-- DKL:FOOTER:END -->') || cut(html, ['<!-- DKL mobile drawer v2 calm'], '</body>', true);
  if (!f) throw new Error('Footer injection not found');
  html = html.slice(0, f[0]) + NEW.footer + '\n' + html.slice(f[1]);
  return html;
}

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const failures = []; const report = [];

async function run(browser, url, vpName, variant, fixtureFile) {
  const ctx = await browser.newContext({ viewport: { width: VIEWPORTS[vpName].width, height: VIEWPORTS[vpName].height },
    isMobile: !!VIEWPORTS[vpName].isMobile, hasTouch: !!VIEWPORTS[vpName].hasTouch, deviceScaleFactor: VIEWPORTS[vpName].deviceScaleFactor || 1,
    reducedMotion: 'reduce', timezoneId: 'America/New_York', locale: 'en-US' });
  const page = await ctx.newPage();
  const errors = [];
  let swapError = null;
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && /\[DKL/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (r.url().startsWith(BASE)) errors.push('failed to load ' + r.url()); });
  // Keep the comparison fair: same currency, no tracking noise
  await page.route(/googletagmanager|google-analytics|clarity\.ms|facebook|pinimg|pinterest|connect\.facebook/, (r) => r.abort());
  const fixtureHtml = fs.readFileSync(path.join(FIX, fixtureFile), 'utf8');
  if (variant === 'B') {
    await page.route(BASE + '/**', (r) => {
      const f = new URL(r.request().url()).pathname.replace(/^.*?\/dkl-store-assets\//, '');
      const file = path.join('dist', f);
      if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: '' });
      r.fulfill({ status: 200, body: fs.readFileSync(file), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript' });
    });
  }
  await page.route(url, (r) => {
    if (r.request().resourceType() !== 'document') return r.continue();
    let body = fixtureHtml;
    if (variant === 'B') { try { body = swap(fixtureHtml); } catch (e) { swapError = e.message; } }
    r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  const facts = await page.evaluate(() => ({
    sentinel: getComputedStyle(document.documentElement).getPropertyValue('--dkl-store-css').trim(),
    store: document.documentElement.getAttribute('data-dkl-store'),
    h1: document.querySelectorAll('h1').length,
    headerIcons: document.querySelectorAll('.dkhi').length,
    htmlClasses: document.documentElement.className.split(/\s+/).filter(c => /^dk/.test(c)).sort().join(' '),
    bodyHeight: Math.round(document.documentElement.scrollHeight / 50) * 50,
  }));
  const shot = await page.screenshot({ fullPage: false });
  if (swapError) errors.push('could not swap code: ' + swapError);
  await ctx.close();
  return { errors, facts, shot };
}

const browser = await chromium.launch();
for (const fx of fixtures) {
  const url = SITE + PAGES[fx] + '?dklfx=USD';
  for (const vp of Object.keys(VIEWPORTS)) {
    const tag = fx.replace(/\.html$/, '') + '-' + vp;
    try {
      const a = await run(browser, url, vp, 'A', fx);
      const b = await run(browser, url, vp, 'B', fx);
      const ia = PNG.sync.read(a.shot), ib = PNG.sync.read(b.shot);
      const diff = new PNG({ width: ia.width, height: ia.height });
      const n = pixelmatch(ia.data, ib.data, diff.data, ia.width, ia.height, { threshold: 0.15 });
      const ratio = n / (ia.width * ia.height);
      fs.writeFileSync(path.join(OUT, tag + '-A-published.png'), a.shot);
      fs.writeFileSync(path.join(OUT, tag + '-B-new.png'), b.shot);
      fs.writeFileSync(path.join(OUT, tag + '-diff.png'), PNG.sync.write(diff));
      const bad = [];
      const newErrors = b.errors.filter(e => !a.errors.includes(e));
      if (newErrors.length) bad.push('new errors: ' + newErrors.join(' | '));
      if (b.facts.sentinel !== '1') bad.push('store.css sentinel missing');
      for (const k of ['h1', 'headerIcons', 'htmlClasses']) if (a.facts[k] !== b.facts[k]) bad.push(`${k} differs (published ${a.facts[k]} vs new ${b.facts[k]})`);
      if (Math.abs(a.facts.bodyHeight - b.facts.bodyHeight) > 100) bad.push(`page height differs (published ${a.facts.bodyHeight} vs new ${b.facts.bodyHeight})`);
      if (ratio > MAX_DIFF) bad.push(`screen differs by ${(ratio * 100).toFixed(2)}% (limit ${(MAX_DIFF * 100).toFixed(1)}%)`);
      if (bad.length) failures.push(`${tag}: ${bad.join('; ')}`);
      report.push({ page: tag, diffPct: +(ratio * 100).toFixed(3), publishedErrors: a.errors.length, newErrors: newErrors.length, ...b.facts, result: bad.length ? 'FAIL' : 'ok' });
    } catch (e) { failures.push(`${tag}: test crashed: ${e.message}`); }
  }
}
await browser.close();
console.table(report);
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ mode: MODE, report, failures }, null, 2));
if (failures.length) { console.error('\nSAFETY TEST FAILED, nothing was published:\n- ' + failures.join('\n- ')); process.exit(1); }
console.log(`\nSafety test passed (${MODE}).`);
