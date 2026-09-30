import { loadEnv } from 'vite';

/**
 * Reads the published catalogue straight from Supabase's REST API during the build
 * (prerender list, product page check, sitemap). Uses the public anon key, so it only
 * ever sees what the website itself can see.
 *
 * @param {string} select PostgREST select, e.g. 'slug,updated_at'
 * @returns {Promise<object[]>} active products
 */
export async function fetchActiveProducts(select) {
  const env = loadEnv('production', process.cwd(), 'REACT_APP_');
  const url = env.REACT_APP_SUPABASE_URL;
  const key = env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are needed at build time');
  }
  const res = await fetch(`${url}/rest/v1/products?select=${select}&isActive=eq.true`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Could not read the products from Supabase (HTTP ${res.status})`);
  return res.json();
}
