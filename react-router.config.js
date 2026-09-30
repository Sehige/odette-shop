import { loadEnv } from 'vite';

// React Router framework mode: every page is rendered to static HTML at build
// time (no server at runtime). Vercel serves the files from build/client.

const PAGES = [
  '/',
  '/shop',
  '/contact',
  '/terms-and-conditions',
  '/privacy-policy',
  '/cookie-policy',
  '/admin',
  '/404', // renders the catch-all route, giving a static not-found page
];

// One product page per active product, listed from Supabase at build time
async function productPages() {
  const env = loadEnv('production', process.cwd(), 'REACT_APP_');
  const url = env.REACT_APP_SUPABASE_URL;
  const key = env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are needed to prerender the product pages');
  }
  const res = await fetch(`${url}/rest/v1/products?select=slug&isActive=eq.true`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Could not list the products to prerender (HTTP ${res.status})`);
  const products = await res.json();
  return products.map((product) => `/produse/${product.slug}`);
}

export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    return [...PAGES, ...(await productPages())];
  },
};
