// Runs right after `react-router build` (see "build" in package.json).
//
// React 18's server renderer (also 18.3) sometimes writes a stray NUL byte into a page:
// when a multi-byte character (ă, ș, „) does not fit at the end of its 2 KB buffer, it
// sends the whole buffer, unused zero bytes included, and writes the character again
// in the next one. The text is otherwise complete, so removing the NUL bytes gives
// exactly the intended page. Without this, the page text would differ from what React
// renders in the browser (hydration errors) and from Supabase (check-product-pages).
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join('build', 'client');
const pages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) pages.push(file);
  }
};
walk(OUT);

const fixed = [];
for (const file of pages) {
  const bytes = fs.readFileSync(file);
  if (!bytes.includes(0)) continue;
  const clean = bytes.filter((b) => b !== 0);
  fs.writeFileSync(file, clean);
  fixed.push(`${path.relative(OUT, file)} (${bytes.length - clean.length})`);
  if (fs.readFileSync(file).includes(0)) {
    console.error(`clean-prerender: ${file} still contains NUL bytes`);
    process.exitCode = 1;
  }
}

console.log(`clean-prerender: ${pages.length} pages, stray NUL bytes removed from ${fixed.length}${fixed.length ? `: ${fixed.join(', ')}` : ''}`);
