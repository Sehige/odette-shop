// Runs after the build (see "build" in package.json):
// - build/client/sitemap.xml: the indexable pages plus every product page, with the
//   product's last edit (updated_at) as lastmod;
// - build/client/404.html: React Router's single-page fallback, which Vercel serves with a
//   404 status for any address that has no file. It hydrates cleanly at any address and
//   then shows the not-found page (a prerendered page would only match its own route).
import fs from 'node:fs';
import path from 'node:path';
import { fetchActiveProducts } from './catalog.mjs';
import { INDEXABLE_PAGES } from '../src/seo/sitePages.js';

const SITE = 'https://www.odette-confiserie.ro';
const OUT = path.join('build', 'client');

const products = await fetchActiveProducts('slug,updated_at');
const day = (timestamp) => (timestamp ? timestamp.slice(0, 10) : null);

// The home page and the product list show the catalogue, so they change with it
const catalogueDate = products.map((p) => day(p.updated_at)).filter(Boolean).sort().pop() || null;
const pageDates = { '/': catalogueDate, '/shop': catalogueDate };

const entries = [
  ...INDEXABLE_PAGES.map((page) => ({ loc: `${SITE}${page}`, lastmod: pageDates[page] || null })),
  ...products.map((p) => ({ loc: `${SITE}/produse/${p.slug}`, lastmod: day(p.updated_at) })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(({ loc, lastmod }) =>
    `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);

fs.renameSync(path.join(OUT, '__spa-fallback.html'), path.join(OUT, '404.html'));

console.log(`finish-build: sitemap.xml with ${entries.length} URLs (${products.length} products); 404.html written`);
