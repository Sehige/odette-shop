import { loadEnv } from 'vite';

// Reads the published catalogue straight from Supabase's REST API during the build
// (prerender list, product page check, sitemap). Uses the public anon key, so it only
// ever sees what the website itself can see.
async function request(pathAndQuery) {
  const env = loadEnv('production', process.cwd(), 'REACT_APP_');
  const url = env.REACT_APP_SUPABASE_URL;
  const key = env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are needed at build time');
  }
  const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Could not read ${pathAndQuery.split('?')[0]} from Supabase (HTTP ${res.status})`);
  return res.json();
}

/**
 * @param {string} select PostgREST select, e.g. 'slug,updated_at'
 * @returns {Promise<object[]>} active products
 */
export const fetchActiveProducts = (select) => request(`products?select=${select}&isActive=eq.true`);

/**
 * Categories that have at least one active product (the ones that get a page),
 * with the date of the latest edit among those products.
 * @returns {Promise<{slug: string, updated_at: string|null}[]>}
 */
export async function fetchCategoriesWithProducts() {
  const rows = await request('categories?select=slug,products!inner(updated_at)&products.isActive=eq.true');
  return rows.map((c) => ({
    slug: c.slug,
    updated_at: c.products.map((p) => p.updated_at).filter(Boolean).sort().pop() || null,
  }));
}
