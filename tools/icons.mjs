// DKL icons: copy icons from the licensed Anron Icons 10 source into src/data/icons.json.
//
// The Foundation (Figma, page 06 Iconography) is the design source; Anron Icons 10 is the only icon set.
// Only icons the site actually uses go into this repo (the repo is public; the full licensed set is not).
//
// Use:
//   node tools/icons.mjs add <path-to-anron>/svg chevron-down search star ...
//   node tools/icons.mjs list
//
// <path-to-anron> = the unzipped "Anron Icons 10 (commercial licence).zip" from the SSD:
//   MILAN DISK/Work/Doodle Kids Land/01 - Brand/07 - Licensed Assets/
// Each name gets its Line and Filled style. Colours become currentColor and strokes become 2 px (Foundation rule).
// Then use it with {{icon:name}} in CSS or DKL.icon('name') in scripts. See README "Icons".
import fs from 'node:fs';
import path from 'node:path';

const FILE = 'src/data/icons.json';
const data = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : { icons: {} };
const [cmd, root, ...names] = process.argv.slice(2);

function norm(svg, name, style) {
  let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  inner = inner.replace(/#2F384C/gi, 'currentColor').replace(/stroke-width="1\.5"/g, 'stroke-width="2"');
  // clipPath ids must be unique on a page that shows many icons
  inner = inner.replace(/id="([^"]+)"/g, (m, id) => `id="dk-${name}-${style}-${id}"`).replace(/url\(#([^)]+)\)/g, (m, id) => `url(#dk-${name}-${style}-${id})`);
  return inner.replace(/\s*\n\s*/g, '');
}

if (cmd === 'add') {
  if (!root || !names.length) { console.error('Usage: node tools/icons.mjs add <anron>/svg name ...'); process.exit(1); }
  for (const spec of names) {
    const [name, alias] = spec.split('='); // "sliders=sliders-horiz" keeps the Foundation name, reads the Anron file
    const file = alias || name;
    const found = {};
    for (const style of ['line', 'filled']) {
      const dir = path.join(root, style);
      const hit = fs.readdirSync(dir).map(c => path.join(dir, c, file + '.svg')).find(f => fs.existsSync(f));
      if (!hit) { console.error(`Not in Anron ${style}: ${file}`); process.exit(1); }
      found[style] = norm(fs.readFileSync(hit, 'utf8'), name, style);
    }
    const old = data.icons[name] || {};
    data.icons[name] = { ...old, line: found.line, filled: old.custom ? old.filled : found.filled };
    console.log('added', name);
  }
} else if (cmd !== 'list') { console.error('Commands: add, list'); process.exit(1); }

data._help = 'Icons the site uses, from Anron Icons 10 (licensed). Add with: node tools/icons.mjs add <anron>/svg <name>. Use {{icon:name}} / {{icon:name:filled:#hex}} in CSS, DKL.icon("name",{style,color,size}) in JS. Raw SVG paths anywhere else fail the build. "custom" entries are Foundation edits (do not overwrite).';
data.icons = Object.fromEntries(Object.entries(data.icons).sort(([a], [b]) => a.localeCompare(b)));
const out = { _help: data._help, icons: data.icons };
fs.writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');
console.log(Object.keys(data.icons).length, 'icons:', Object.keys(data.icons).join(', '));
