/* =============================================================================
   build.mjs — bundle the modular source into a single self-contained page.

       node build.mjs        ->  index.html

   The repository keeps two entry points on purpose:

     dev.html    the modular shell. Loads src/*.js as ES modules and fetches
                 the state geometry, so it needs a local HTTP server. This is
                 the one to read and edit.

     index.html  generated. Everything inlined — styles, all eleven modules,
                 Three.js, and the TopoJSON. No fetch, no module loader, no
                 network. It runs from file:// and serves as-is from GitHub
                 Pages.

   Both run the same code. The only difference is how the state geometry
   arrives, and src/main.js handles that itself in loadTopology().

   HOW THE BUNDLING WORKS

   Concatenating the modules would not work: `at()` is defined independently in
   four of them, so the names collide. Instead each module is wrapped in an
   IIFE and assigned into a registry, and its imports are rewritten as
   destructuring from that registry. Module scope is preserved exactly, so
   nothing has to be renamed and the bundled source stays diffable against the
   originals.

   `export let` is returned through a getter rather than by value, so a live
   binding stays live. Nothing currently depends on that, but a bundler that
   silently converts one into a snapshot is a trap worth not leaving behind.
   ========================================================================== */

import { readFileSync, writeFileSync, statSync } from 'node:fs';

const root = new URL('./', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

/* Dependency order. Hand-written rather than resolved, because the graph is
   eleven files and an explicit list is easier to audit than a topological
   sort nobody reads. */
const MODULES = [
  'geo', 'topo', 'projection', 'military', 'critic', 'calls',
  'data', 'conflicts', 'analysis', 'reachability', 'steelman', 'glossary', 'links', 'tour',
  'map3d', 'main',
];

const RX = {
  // import { a, b } from './x.js';   (single or multi-line)
  named: /^import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"];?\s*$/gm,
  // import * as NS from '...';
  star: /^import\s*\*\s*as\s+(\w+)\s*from\s*['"]([^'"]+)['"];?\s*$/gm,
  // export { a, b } from './x.js';   (re-export, single or multi-line)
  reExport: /^export\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"];?\s*$/gm,
  // export const/let/var/function/class NAME
  decl: /^export\s+(const|let|var|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm,
};

const modName = (spec) => spec.replace(/^.*\//, '').replace(/\.js$/, '');

/* Registry keys can contain dots — 'three.module' — so every reference into
   the registry is subscripted. `__m.three.module` reads `__m.three`, which is
   undefined, and the failure only surfaces at runtime in the browser. */
const slot = (key) => `__m[${JSON.stringify(key)}]`;
const names = (block) => block.split(',').map((s) => s.trim()).filter(Boolean)
  .map((s) => s.split(/\s+as\s+/).pop().trim());

function transform(id, src) {
  const imports = new Map();   // registry key -> Set of names
  const reExports = [];        // { from, names[] }
  const exported = [];         // { name, kind }

  const add = (from, list) => {
    const k = modName(from);
    if (!imports.has(k)) imports.set(k, new Set());
    for (const n of list) imports.get(k).add(n);
  };

  let body = src;

  body = body.replace(RX.reExport, (_, block, from) => {
    const list = names(block);
    add(from, list);
    reExports.push({ from: modName(from), names: list });
    return '';
  });

  body = body.replace(RX.named, (_, block, from) => {
    add(from, names(block));
    return '';
  });

  body = body.replace(RX.star, (_, ns, from) => `const ${ns} = ${slot(modName(from))};`);

  body = body.replace(RX.decl, (_, kind, name) => {
    exported.push({ name, kind });
    return `${kind} ${name}`;
  });

  /* Aliased imports would destructure by the LOCAL name, which the source
     module does not export — producing `undefined` at runtime with no build
     error. Rather than implement renaming, refuse them. */
  for (const [, block] of src.matchAll(RX.named)) {
    if (/as/.test(block)) {
      throw new Error(`${id}: aliased import ("x as y") is not supported by this bundler.
` +
        `Import the name directly:  ${block.trim()}`);
    }
  }

  if (/^export\s/m.test(body)) {
    throw new Error(`${id}: unhandled export form:\n` +
      body.split('\n').filter((l) => /^export\s/.test(l)).join('\n'));
  }

  const destructure = [...imports.entries()]
    .map(([k, set]) => `  const { ${[...set].join(', ')} } = ${slot(k)};`)
    .join('\n');

  // `let` exports go through a getter so the binding stays live.
  const members = exported.map(({ name, kind }) =>
    kind === 'let' ? `    get ${name}() { return ${name}; }` : `    ${name}`);
  for (const r of reExports) for (const n of r.names) members.push(`    ${n}`);

  return `${slot(id)} = (function () {\n${destructure}\n${body}\n  return {\n${
    members.join(',\n')}\n  };\n})();`;
}

/* Three.js is one module with a single trailing `export { ... };` list. */
function transformThree(src) {
  const m = src.match(/^export\s*\{([\s\S]*?)\};?\s*$/m);
  if (!m) throw new Error('three.module.js: could not find its export list');
  const list = names(m[1]);
  const body = src.replace(m[0], '');
  return `${slot('three.module')} = (function () {\n${body}\n  return { ${list.join(', ')} };\n})();`;
}

// --- assemble ---------------------------------------------------------------

const css = read('styles.css');
const topo = read('data/states-10m.json');
const three = transformThree(read('vendor/three.module.js'));
const mods = MODULES.map((id) => transform(id, read(`src/${id}.js`)));

/* Hand-maintained order is easy to get wrong, and getting it wrong produces a
   runtime "cannot destructure X of undefined" in the browser rather than
   anything useful at build time. So assert it: every module a file imports
   from must already have been defined. */
(function checkOrder() {
  const seen = new Set(['three.module']);
  for (const id of MODULES) {
    const src = read(`src/${id}.js`);
    const deps = new Set();
    for (const rx of [RX.named, RX.star, RX.reExport]) {
      rx.lastIndex = 0;
      for (const m of src.matchAll(rx)) deps.add(modName(m[m.length - 1]));
    }
    for (const d of deps) {
      if (!seen.has(d)) {
        throw new Error(
          `MODULES order: '${id}' imports '${d}', which is bundled later.
` +
          `Move '${d}' before '${id}'.`);
      }
    }
    seen.add(id);
  }
})();

const bundle = [
  '/* Generated by build.mjs — do not edit. Edit src/ and rebuild. */',
  'const __m = {};',
  three,
  ...mods,
].join('\n\n');

let html = read('dev.html');

/* Every insertion below uses a REPLACER FUNCTION, never a replacement string.
   In a replacement string `$'`, `$&`, `` $` `` and `$1` are special — and
   three.js genuinely contains `+ '$'` while building a RegExp source. As a
   replacement string that expands to "everything after the match", splicing
   the tail of the document into the middle of the bundle. Functions disable
   the whole mechanism. */
html = html.replace(
  /<link rel="stylesheet" href="styles\.css"\s*\/?>/,
  () => `<style>\n${css}\n</style>`,
);

// JSON is embedded rather than assigned, so no escaping of quotes or newlines
// is needed. `<` is escaped anyway so the parser can never see a stray tag.
html = html.replace(
  /<script type="module" src="src\/main\.js"><\/script>/,
  () => `<script type="application/json" id="topo-data">${
    topo.replace(/</g, '\\u003c')}</script>\n<script>\n${bundle}\n</script>`,
);

// Check that the TAGS are gone, not that the filenames are absent — both
// files name themselves in their own header comments, which are now inlined.
if (/<link[^>]+styles\.css/.test(html) || /<script[^>]+src=/.test(html)) {
  throw new Error('dev.html changed shape — the inlining patterns no longer match');
}

const banner = `<!--
  September 11, 2001 — CRITIC
  Single-file build. Generated from the modular source by build.mjs.
  Nothing is fetched and nothing is loaded from a network; this file is the
  whole application. To read or change it, use the source, not this file.
-->
`;
html = html.replace(/^<!DOCTYPE html>/, () => `<!DOCTYPE html>\n${banner}`);

writeFileSync(new URL('./index.html', root), html);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log('index.html written');
console.log(`  three.js   ${kb(three.length)}`);
console.log(`  modules    ${kb(mods.join('').length)}  (${MODULES.length} files)`);
console.log(`  topojson   ${kb(topo.length)}`);
console.log(`  css        ${kb(css.length)}`);
console.log(`  total      ${kb(statSync(new URL('./index.html', root)).size)}`);
