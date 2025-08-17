// Ghost Ops – selector + file ops for HTML/CSS/JS
// Usage:
//   node tools/ghost-ops/index.js apply tools/ghost-ops/ops.json
//   node tools/ghost-ops/index.js watch tools/ghost-ops/ops.json

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { load as cheerioLoad } from 'cheerio';
import postcss from 'postcss';
import safe from 'postcss-safe-parser';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// project root is two levels up from this file (…/testghost/)
const REPO      = path.resolve(__dirname, '../../');
const HTML      = path.join(REPO, 'docs/index.html');
const CSS       = path.join(REPO, 'docs/assets/css/style.css');
const JS        = path.join(REPO, 'docs/assets/js/main.js');
const GHOST_CSS = path.join(REPO, 'docs/assets/css/_ghost.css');
const GHOST_JS  = path.join(REPO, 'docs/assets/js/_ghost.js');

function rel(p){ return path.relative(REPO, p); }
function read(p){ return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; }
function ensureFile(p, init=''){ fs.mkdirSync(path.dirname(p), { recursive:true }); if (!fs.existsSync(p)) fs.writeFileSync(p, init, 'utf8'); }
function write(p, c){ fs.mkdirSync(path.dirname(p), { recursive:true }); fs.writeFileSync(p, c, 'utf8'); }

function upsertHeadStylesheet($, href){
  const exists = $(`head link[rel="stylesheet"][href="${href}"]`).length > 0;
  if (!exists) $('head').append(`\n<link rel="stylesheet" href="${href}">`);
}
function upsertBodyScript($, src, {defer=true} = {}){
  const exists = $(`script[src="${src}"]`).length > 0;
  if (!exists) $('body').append(`\n<script src="${src}"${defer?' defer':''}></script>`);
}

function asRegex(m){
  if (!m) return null;
  if (typeof m === 'string') return new RegExp(m, 'g');
  if (m.pattern) return new RegExp(m.pattern, m.flags || 'g');
  return null;
}

/* ================= HTML OPS ================= */
function applyHtmlOps(ops){
  let html = read(HTML);
  const $ = cheerioLoad(html, { decodeEntities:false });

  // Always ensure ghost overrides are referenced
  upsertHeadStylesheet($, 'assets/css/_ghost.css');
  upsertBodyScript($, 'assets/js/_ghost.js', {defer:true});

  for (const op of ops){
    if (op.remove?.selector) $(op.remove.selector).remove();

    if (op.addHtmlBefore){
      const { selector, html } = op.addHtmlBefore;
      $(selector).first().before(html);
    }
    if (op.addHtmlAfter){
      const { selector, html } = op.addHtmlAfter;
      $(selector).first().after(html);
    }
    if (op.upsertHeadLink){
      const { rel, href, type, sizes } = op.upsertHeadLink;
      let link = $(`head link[rel="${rel}"][href="${href}"]`);
      if (!link.length){
        $('head').append(`<link rel="${rel}" href="${href}"${type?` type="${type}"`:''}${sizes?` sizes="${sizes}"`:''}>`);
      }else{
        if (type) link.attr('type', type);
        if (sizes) link.attr('sizes', sizes);
      }
    }
    if (op.replaceHtml){
      const { match, with: rep } = op.replaceHtml;
      const rx = asRegex(match);
      if (rx) {
        let root = $.root().html();
        root = root.replace(rx, rep ?? '');
        // reload after regex replacement to keep DOM consistent
        html = root;
        // reparse
        const $$ = cheerioLoad(html, { decodeEntities:false });
        // carry over references we may have added
        upsertHeadStylesheet($$, 'assets/css/_ghost.css');
        upsertBodyScript($$, 'assets/js/_ghost.js', {defer:true});
        // assign back
        $._root = $$._root;
      }
    }
  }
  html = $.root().html();
  write(HTML, html);
  console.log('html →', rel(HTML));
}

/* ================= CSS OPS ================= */
async function applyCssOps(ops){
  ensureFile(CSS, '');
  ensureFile(GHOST_CSS, '/* ghost-ops overrides */\n');
  let css = read(CSS);

  // simple appends or regex replacements go into the main CSS
  for (const op of ops){
    if (op.append) css += `\n${op.append}\n`;
    if (op.replace){
      const rx = asRegex(op.replace.match);
      if (rx) css = css.replace(rx, op.replace.with ?? '');
    }
  }
  const out = await postcss().process(css, { from: undefined, parser: safe });
  write(CSS, out.css);
  console.log('css  →', rel(CSS));

  // ghost-only overrides (optional)
  if (ops.some(o => o.ghostAppend)){
    let ghost = read(GHOST_CSS);
    for (const op of ops){
      if (op.ghostAppend) ghost += `\n${op.ghostAppend}\n`;
    }
    write(GHOST_CSS, ghost);
    console.log('css  →', rel(GHOST_CSS));
  }
}

/* ================= JS OPS ================= */
function applyJsOps(ops){
  ensureFile(JS, '');
  ensureFile(GHOST_JS, '// ghost-ops js (reserved)\n');

  let js = read(JS);
  let ghost = read(GHOST_JS);

  for (const op of ops){
    if (op.append) js += `\n${op.append}\n`;
    if (op.replace){
      const rx = asRegex(op.replace.match);
      if (rx) js = js.replace(rx, op.replace.with ?? '');
    }
    if (op.ghostAppend) ghost += `\n${op.ghostAppend}\n`;
  }

  write(JS, js);
  if (ghost !== read(GHOST_JS)) write(GHOST_JS, ghost);
  console.log('js   →', rel(JS));
  if (ops.some(o => o.ghostAppend)) console.log('js   →', rel(GHOST_JS));
}

/* ================= DRIVER ================= */
async function runOnce(configPath){
  const cfg = JSON.parse(read(configPath));

  // ensure ghost files exist so the HTML references work
  ensureFile(GHOST_CSS, '/* ghost-ops overrides */\n');
  ensureFile(GHOST_JS,  '// ghost-ops js (reserved)\n');

  if (cfg.html) applyHtmlOps(cfg.html);
  if (cfg.css)  await applyCssOps(cfg.css);
  if (cfg.js)   applyJsOps(cfg.js);

  console.log('✨ ghost-ops applied.');
}

function watch(configPath){
  console.log('👀 ghost-ops watching…');
  chokidar.watch([
    configPath, HTML, CSS, JS, GHOST_CSS, GHOST_JS
  ], { ignoreInitial:true }).on('all', async () => {
    try { await runOnce(configPath); } catch (e) { console.error(e); }
  });
}

const [,, cmd, cfgPath] = process.argv;
if (!cmd || !cfgPath){
  console.log('Usage:\n  node tools/ghost-ops/index.js apply tools/ghost-ops/ops.json\n  node tools/ghost-ops/index.js watch tools/ghost-ops/ops.json');
  process.exit(1);
}

const cfgAbs = path.resolve(REPO, cfgPath);
if (cmd === 'apply') await runOnce(cfgAbs);
if (cmd === 'watch') watch(cfgAbs);