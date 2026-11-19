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
  out += RUNTIME;
  if (name === 'head') out += read('src/runtime/prelude.js') + '\n';
  if (name === 'foot') out += BLOG_JS;
  for (const f of files) {
    const code = read(f);
    try { acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' }); }
    catch (e) { fail(`${f} has a JavaScript error: ${e.message}`); }
    if (/document\.currentScript|document\.write\(/.test(code)) fail(`${f} uses currentScript or document.write, which behave differently in a shared file`);
    out += `\n/* ${path.basename(f)} */\ntry{\n${code}\n}catch(e){try{console.error('[DKL ${name}] ${path.basename(f)}',e)}catch(_){}}\n`;
  }
  out = out.replace(RUNTIME, RUNTIME + jsIcons(out, name + '.js'));
  return { out, files };
}

// ---------- CSS ----------
function bundleCss(files) {
  let out = '';
  for (const f of files) out += `\n/* ${path.basename(f)} */\n` + cssIcons(read(f), f) + '\n';
  return out;
}

async function minify(code, loader) {
  if (!CFG.minify) return code;
  const r = await esbuild.transform(code, { loader, minify: true, legalComments: 'none', charset: 'utf8' });
  return r.code;
}

// ---------- Site data (src/data): stores, categories, popular searches ----------
const readJson = (f) => { try { return JSON.parse(read(f)); } catch (e) { fail(`${f} is not valid JSON: ${e.message}`); } };
const STORES = readJson('src/data/stores.json');
const CATS = readJson('src/data/categories.json').categories;
const SEARCH = readJson('src/data/search.json').popularSearches;
const BLOG = readJson('src/data/blog.json');
for (const [slug, d] of Object.entries(BLOG.dates || {})) {
  if (!/^[a-z0-9-]+$/.test(slug)) fail(`blog.json: date slug "${slug}" must be lowercase letters, numbers and dashes`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || isNaN(new Date(d))) fail(`blog.json: "${slug}" date "${d}" must be YYYY-MM-DD`);
}
for (const [slug, h] of Object.entries(BLOG.hooks || {})) {
  if (!/^[A-Za-z0-9]{5}$/.test(h.code || '')) fail(`blog.json: hook "${slug}" code must be a Payhip product id`);
  if (!h.over || !h.head || !h.line) fail(`blog.json: hook "${slug}" needs over, head and line`);
  if (/\$\d/.test(h.line)) fail(`blog.json: hook "${slug}" line must not contain a price (it is read live)`);
}
const BLOG_JS = `/* DKL blog data (from src/data/blog.json, foot only) */\nwindow.DKL=window.DKL||{};window.DKL.blog=${JSON.stringify({ dates: BLOG.dates, hooks: BLOG.hooks, categories: BLOG.categories || {}, postCategory: BLOG.postCategory || {} })};\n`;
const storeKeys = Object.keys(STORES).filter(k => !k.startsWith('_'));
const productKeys = Object.keys(STORES.US.products);
for (const k of storeKeys) for (const [name, id] of Object.entries(STORES[k].products)) {
  if (id && !/^[A-Za-z0-9]{5}$/.test(id)) fail(`stores.json: ${k}.${name} "${id}" is not a Payhip product id (5 letters/numbers)`);
  if (!id) console.warn(`NOTE: stores.json ${k}.${name} is empty, so the ${k} store falls back to the US product (fill it before that store launches)`);
}
const slugs = new Set();
for (const c of CATS) {
  if (!/^[a-z0-9-]+$/.test(c.slug)) fail(`categories.json: slug "${c.slug}" must be lowercase letters, numbers and dashes`);
  if (slugs.has(c.slug)) fail(`categories.json: slug "${c.slug}" is listed twice`);
  slugs.add(c.slug);
  if (!['main', 'hidden', 'always'].includes(c.tab)) fail(`categories.json: "${c.slug}" tab must be main, hidden or always`);
  if (c.tab === 'main' && !Number.isInteger(c.tabOrder)) fail(`categories.json: main tab "${c.slug}" needs a whole-number tabOrder`);
  if (c.searchKeywords) { try { new RegExp(c.searchKeywords, 'i'); } catch (e) { fail(`categories.json: "${c.slug}" searchKeywords is not a valid pattern: ${e.message}`); } }
}
for (const p of SEARCH) if (!p.label || !p.query) fail('search.json: every popular search needs a label and a query');

const SITE = {
  stores: Object.fromEntries(storeKeys.map(k => [k, { host: STORES[k].host, currency: STORES[k].currency, products: STORES[k].products }])),
  categories: CATS.map(c => ({ slug: c.slug, name: c.name, searchKeywords: c.searchKeywords || '' })),
  popularSearches: SEARCH,
};
const RUNTIME = `/* DKL site data (from src/data) */
(function(){var D=window.DKL=window.DKL||{};if(D.site)return;D.site=${JSON.stringify(SITE)};
D.store=/^in\\./i.test(location.hostname)?'IN':'US';
D.id=function(k){var s=D.site.stores,m=s[D.store]&&s[D.store].products[k];return m||s.US.products[k]||''};
D.link=function(k){var i=D.id(k);return i?'/b/'+i:''};})();
`;

// ---------- Icons (src/data/icons.json, from Anron Icons 10 via tools/icons.mjs) ----------
// CSS:  {{icon:name}}  {{icon:name:filled}}  {{icon:name:#0B1023}}  {{icon:name:filled:#ffffffb3}}  -> url("data:image/svg+xml,...")
// JS:   DKL.icon('name', {style:'filled', color:'#565D70', size:20, cls:'x', label:'Close'})  -> '<svg ...>' string
//       Names used through a variable must be listed in a comment:  /* icons: award, folder */
// Raw SVG anywhere else in src/ fails the build, so every icon on the site stays the library icon.
const ICONS = readJson('src/data/icons.json').icons;
const ICON_DEFAULT = '#565D70'; // icon/interface
const iconInner = (name, style, where) => {
  const ic = ICONS[name];
  if (!ic) fail(`${where} uses icon "${name}", which is not in src/data/icons.json. Add it: node tools/icons.mjs add <anron>/svg ${name}`);
  if (!ic[style]) fail(`${where}: icon "${name}" has no ${style} style`);
  return ic[style];
};
const iconSvg = (name, style, color, where) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="color:${color}">${iconInner(name, style, where)}</svg>`;
const svgDataUri = (svg) => 'data:image/svg+xml,' + svg.replace(/"/g, "'").replace(/[<>#%{}\n]/g, encodeURIComponent);
function cssIcons(css, where) {
  return css.replace(/\{\{icon:([a-z0-9-]+)((?::(?:line|filled|#[0-9a-fA-F]{3,8}))*)\}\}/g, (all, name, opts) => {
    const parts = opts.split(':').filter(Boolean);
    const style = parts.find(p => p === 'line' || p === 'filled') || 'line';
    const color = parts.find(p => p.startsWith('#')) || ICON_DEFAULT;
    return `url("${svgDataUri(iconSvg(name, style, color, where))}")`;
  });
}
function jsIcons(code, where) {
  const want = {}; // name -> Set(styles)
  const add = (n, st) => { (want[n] = want[n] || new Set()).add(st || 'line'); };
  for (const m of code.matchAll(/DKL\.icon(?:El|Url)?\(\s*['"]([a-z0-9-]+)['"]\s*(?:,\s*\{([^}]*)\})?/g)) add(m[1], (m[2] || '').match(/style:\s*['"](filled|line)['"]/)?.[1]);
  for (const m of code.matchAll(/\/\*\s*icons:\s*([a-z0-9:, -]+)\*\//g)) m[1].split(',').map(s => s.trim()).filter(Boolean).forEach(s => { const [n, st] = s.split(':'); add(n, st); });
  if (!Object.keys(want).length) return '';
  const set = {};
  for (const n of Object.keys(want).sort()) { set[n] = {}; for (const st of want[n]) set[n][st] = iconInner(n, st, where); }
  return `/* DKL icons used in ${where} (src/data/icons.json) */
(function(){var D=window.DKL=window.DKL||{};D.ic=Object.assign(D.ic||{},${JSON.stringify(set)});
D.icon=D.icon||function(n,o){o=o||{};var i=D.ic[n];if(!i)return '';var s=o.size||24,c=o.color?' style="color:'+o.color+'"':'';
return '<svg xmlns="http://www.w3.org/2000/svg" class="dki dki-'+n+(o.cls?' '+o.cls:'')+'" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none"'+c+(o.label?' role="img" aria-label="'+o.label+'"':' aria-hidden="true" focusable="false"')+'>'+(i[o.style||'line']||i.line)+'</svg>'};
D.iconEl=D.iconEl||function(n,o){var t=document.createElement('template');t.innerHTML=D.icon(n,o);return t.content.firstChild};
D.iconUrl=D.iconUrl||function(n,o){o=o||{};var i=D.ic[n];if(!i)return 'none';var s='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="color:'+(o.color||'#565D70')+'">'+(i[o.style||'line']||i.line)+'</svg>';return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'};})();
`;
}
// Guard: only the library. A raw <path> or SVG data URI in src/ means someone pasted an icon by hand.
(function guardRawSvg() {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  for (const f of walk('src')) {
    if (f.startsWith(path.join('src', 'data'))) continue;
    const lines = read(f).split('\n');
    lines.forEach((l, i) => {
      if (/dkl-allow-svg:/.test(l)) return; // a non-icon drawing (logo, illustration) with a stated reason
      if (/data:image\/svg\+xml|<path\b|<circle\b|<polygon\b|\sd=\\?["']M/.test(l)) fail(`${f}:${i + 1} has a hand-pasted SVG. Use {{icon:name}} in CSS or DKL.icon('name') in JS (src/data/icons.json).`);
    });
  }
})();

// ---------- store.css template: generated collection-tab rules + per-store product ids ----------
function storeCssFromTemplate(css) {
  const P = '#page-section-collection .collection-tabs-wrapper li';
  const has = (slug) => `:has(a[href$="/collection/${slug}"])`;
  const hidden = CATS.filter(c => c.tab === 'hidden').reverse(); // order inside a selector list does not matter
  const main = CATS.filter(c => c.tab === 'main').sort((a, b) => a.tabOrder - b.tabOrder);
  const always = CATS.filter(c => c.tab === 'always');
  const hideRule = hidden.map(c => `${P}${has(c.slug)}:not(:has(a.active))`).join(',') + '{display:none !important}';
  const orderRules = main.map(c => `${P}${has(c.slug)}{order:${c.tabOrder}}`).join('') +
    `${P}:has(a.active)` + [...always, ...main].map(c => `:not(${has(c.slug)})`).join('') + `{order:${Math.max(0, ...main.map(c => c.tabOrder)) + 1}}`;
  for (const m of ['/*@@COLLECTION_TABS_HIDE@@*/', '/*@@COLLECTION_TABS_ORDER@@*/']) if (!css.includes(m)) fail(`src/store.css lost the marker ${m}`);
  css = css.replace('/*@@COLLECTION_TABS_HIDE@@*/', hidden.length ? hideRule : '').replace('/*@@COLLECTION_TABS_ORDER@@*/', orderRules);
  // {{id:name}} inside a selector: one copy of that selector per store that has the product
  css = css.replace(/(^|})([^{}]*\{\{id:[a-zA-Z]+\}\}[^{}]*)\{/g, (all, pre, sel) => {
    const parts = []; let depth = 0, cur = '';
    for (const ch of sel) { if (ch === '(' || ch === '[') depth++; if (ch === ')' || ch === ']') depth--; if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch; }
    parts.push(cur);
    const out = [];
    for (const p of parts) {
      const m = p.match(/\{\{id:([a-zA-Z]+)\}\}/);
      if (!m) { out.push(p); continue; }
      if (!productKeys.includes(m[1])) fail(`src/store.css uses unknown product {{id:${m[1]}}}`);
      const ids = [...new Set(storeKeys.map(k => STORES[k].products[m[1]]).filter(Boolean))];
      for (const id of ids) out.push(p.replace(m[0], id));
    }
    return pre + out.join(',') + '{';
  });
  if (/\{\{id:/.test(css)) fail('src/store.css has a {{id:...}} token outside a selector');
  return css;
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
const storeCss = storeCssFromTemplate(cssIcons(read('src/store.css'), 'src/store.css')) + '\n:root{--dkl-store-css:1}\n';
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
