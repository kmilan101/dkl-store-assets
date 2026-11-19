// DKL store assets build
// Turns src/ into the files both Payhip stores load, plus the exact snippets to paste into Payhip.
// Run: node build.mjs   (fails with a clear message if any check fails)
import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';
import * as esbuild from 'esbuild';

const CFG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const OUT = 'dist';
const BASE = CFG.baseUrl.replace(/\/$/, '');
const FALLBACK = CFG.fallbackUrl.replace(/\/$/, '');

const fail = (msg) => { console.error('\nBUILD FAILED: ' + msg + '\n'); process.exit(1); };
const read = (f) => fs.readFileSync(f, 'utf8');
const list = (dir, ext) => fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort().map(f => path.join(dir, f));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'payhip'), { recursive: true });

// ---------- JS: each source block keeps its own try/catch, exactly like separate <script> tags ----------
function bundleJs(dir, name) {
  const files = list(dir, '.js');
  let out = `/* DKL ${name}.js · built ${new Date().toISOString()} · github.com/kmilan101/dkl-store-assets */\n`;
  if (name === 'head') out += read('src/runtime/prelude.js') + '\n';
  for (const f of files) {
    const code = read(f);
    try { acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' }); }
    catch (e) { fail(`${f} has a JavaScript error: ${e.message}`); }
    if (/document\.currentScript|document\.write\(/.test(code)) fail(`${f} uses currentScript or document.write, which behave differently in a shared file`);
    out += `\n/* ${path.basename(f)} */\ntry{\n${code}\n}catch(e){try{console.error('[DKL ${name}] ${path.basename(f)}',e)}catch(_){}}\n`;
  }
  return { out, files };
}

// ---------- CSS ----------
function bundleCss(files) {
  let out = '';
  for (const f of files) out += `\n/* ${path.basename(f)} */\n` + read(f) + '\n';
  return out;
}

async function minify(code, loader) {
  if (!CFG.minify) return code;
  const r = await esbuild.transform(code, { loader, minify: true, legalComments: 'none', charset: 'utf8' });
  return r.code;
}

const results = {};
async function emit(file, code, loader) {
  const min = await minify(code, loader);
  if (loader === 'js') {
    try { acorn.parse(min, { ecmaVersion: 'latest', sourceType: 'script' }); }
    catch (e) { fail(`minified ${file} does not parse: ${e.message}`); }
  }
  fs.writeFileSync(path.join(OUT, file), min);
  results[file] = { source: Buffer.byteLength(code), built: Buffer.byteLength(min) };
}

// store.css = the Payhip "Store CSS" box content, plus a sentinel the head script checks
const storeCss = read('src/store.css') + '\n:root{--dkl-store-css:1}\n';
await emit('store.css', storeCss, 'css');

const head = bundleJs('src/head', 'head');
await emit('head.js', head.out, 'js');
await emit('head.css', bundleCss(list('src/head', '.css')), 'css');

const foot = bundleJs('src/foot', 'foot');
await emit('foot.js', foot.out, 'js');
await emit('foot.css', bundleCss(list('src/foot', '.css')), 'css');

// ---------- Paste-ready Payhip snippets (identical for both stores) ----------
const v = '';
const link = (f) => `<link rel="stylesheet" href="${BASE}/${f}${v}" onerror="this.onerror=null;this.href='${FALLBACK}/${f}'">`;
const script = (f) => `<script src="${BASE}/${f}${v}" onerror="var s=document.createElement('script');s.src='${FALLBACK}/${f}';document.head.appendChild(s)"></script>`;

const header =
`<!-- DKL:HEADER:START · shared code lives in github.com/kmilan101/dkl-store-assets (edit there, not here) -->
<link rel="preconnect" href="${new URL(BASE).origin}">
${read('src/inline/header-meta.html').trim()}
${read('src/inline/header-top.html').trim()}
${link('head.css')}
${script('head.js')}
<!-- DKL:HEADER:END -->`;

const footer =
`<!-- DKL:FOOTER:START · shared code lives in github.com/kmilan101/dkl-store-assets (edit there, not here) -->
${link('foot.css')}
${script('foot.js')}
<!-- DKL:FOOTER:END -->`;

const storeBox =
`/* DKL:STORECSS · shared code lives in github.com/kmilan101/dkl-store-assets (edit there, not here) */
@import url("${BASE}/store.css");`;

fs.writeFileSync(path.join(OUT, 'payhip/header.html'), header + '\n');
fs.writeFileSync(path.join(OUT, 'payhip/footer.html'), footer + '\n');
fs.writeFileSync(path.join(OUT, 'payhip/store-css-box.css'), storeBox + '\n');

// ---------- Checks ----------
const LIMIT = 65535; // Payhip header/footer box limit
for (const [n, s] of [['header', header], ['footer', footer]]) if (s.length > LIMIT) fail(`Payhip ${n} snippet is ${s.length} chars (limit ${LIMIT})`);
for (const [f, r] of Object.entries(results)) if (r.built > CFG.budgets[f]) fail(`${f} is ${r.built} bytes, over its budget of ${CFG.budgets[f]}. Trim it or raise the budget on purpose in config.json`);

const build = { builtAt: new Date().toISOString(), commit: process.env.GITHUB_SHA || 'local', baseUrl: BASE, files: results,
  payhipSnippets: { header: header.length, footer: footer.length, storeCssBox: storeBox.length } };
fs.writeFileSync(path.join(OUT, 'build.json'), JSON.stringify(build, null, 2));
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><title>DKL store assets</title><pre>${JSON.stringify(build, null, 2)}</pre>`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log('Build OK');
console.table(Object.fromEntries(Object.entries(results).map(([k, r]) => [k, { 'source KB': (r.source / 1024).toFixed(1), 'built KB': (r.built / 1024).toFixed(1) }])));
console.log('Payhip snippets (chars):', build.payhipSnippets);
