// Runs after the build (see "build" in package.json). Every prerendered product page
// must show the product's ingredients, allergens and nutrition values exactly as
// they are stored in Supabase — this information is legally required
// (EU Regulation 1169/2011), so a mismatch fails the build and nothing is deployed.
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'REACT_APP_');
const url = env.REACT_APP_SUPABASE_URL;
const key = env.REACT_APP_SUPABASE_ANON_KEY;
const select = 'slug,name_ro,ingredients_ro,allergens_ro,nutritional_info(*),categories:category(name_ro,name_en)';

const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim();
const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// Visible text of a page: no scripts, no tags. React separates adjacent text with
// <!-- --> (e.g. "29.1<!-- -->g"); those are removed without adding a space.
const visibleText = (html) =>
  normalize(decode(html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<!--\s*-->/g, '')
    .replace(/<[^>]+>/g, ' ')));

// Same rule as ProductInfo: the Easter boxes category hides these sections
const hidesDetails = (p) =>
  /easter/i.test(p.categories?.name_en || '') || /paște/i.test(p.categories?.name_ro || '');

const NUTRITION = [
  ['energy_kcal', ' kcal'], ['fat_g', 'g'], ['saturated_fat_g', 'g'], ['carbohydrates_g', 'g'],
  ['sugars_g', 'g'], ['protein_g', 'g'], ['salt_g', 'g'],
];

async function check() {
  const res = await fetch(`${url}/rest/v1/products?select=${select}&isActive=eq.true`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return [`could not read the products from Supabase (HTTP ${res.status})`];
  const products = await res.json();

  const problems = [];
  for (const p of products) {
    const file = path.join('build', 'client', 'produse', p.slug, 'index.html');
    if (!fs.existsSync(file)) {
      problems.push(`${p.slug}: page was not generated`);
      continue;
    }
    const text = visibleText(fs.readFileSync(file, 'utf8'));
    if (!text.includes(normalize(p.name_ro))) problems.push(`${p.slug}: product name missing`);
    if (hidesDetails(p)) continue;
    if (p.ingredients_ro && !text.includes(normalize(p.ingredients_ro))) problems.push(`${p.slug}: ingredients differ from Supabase`);
    if (p.allergens_ro && !text.includes(normalize(p.allergens_ro))) problems.push(`${p.slug}: allergens differ from Supabase`);
    const n = Array.isArray(p.nutritional_info) ? p.nutritional_info[0] : p.nutritional_info;
    if (n) {
      for (const [field, unit] of NUTRITION) {
        if (n[field] != null && !text.includes(`${n[field]}${unit}`)) problems.push(`${p.slug}: nutrition ${field} (${n[field]}${unit}) missing`);
      }
    }
  }
  if (!problems.length) {
    console.log(`check-product-pages: ${products.length} product pages match Supabase (ingredients, allergens, nutrition)`);
  }
  return problems;
}

const problems = await check();
if (problems.length) {
  console.error(`check-product-pages: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  // exitCode rather than exit(): lets open connections close cleanly (Node on Windows)
  process.exitCode = 1;
}
