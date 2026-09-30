import { fetchActiveProducts } from './scripts/catalog.mjs';
import { INDEXABLE_PAGES, NOINDEX_PAGES } from './src/seo/sitePages.js';

// React Router framework mode: every page is rendered to static HTML at build
// time (no server at runtime). Vercel serves the files from build/client.
export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    // One product page per active product
    const products = await fetchActiveProducts('slug');
    return [...INDEXABLE_PAGES, ...NOINDEX_PAGES, ...products.map((p) => `/produse/${p.slug}`)];
  },
};
