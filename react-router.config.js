import { fetchActiveProducts, fetchCategoriesWithProducts } from './scripts/catalog.mjs';
import { INDEXABLE_PAGES, NOINDEX_PAGES, isReservedSlug } from './src/seo/sitePages.js';

// React Router framework mode: every page is rendered to static HTML at build
// time (no server at runtime). Vercel serves the files from build/client.
export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    const [products, categories] = await Promise.all([fetchActiveProducts('slug'), fetchCategoriesWithProducts()]);
    // One page per category with active products; a slug that equals a fixed page
    // (e.g. "contact") would be hidden by it, so it is skipped with a warning
    const categoryPages = categories
      .filter((c) => {
        if (!isReservedSlug(c.slug)) return true;
        console.warn(`Category slug "${c.slug}" clashes with a site page; change it in Supabase to give the category a page`);
        return false;
      })
      .map((c) => `/${c.slug}`);
    return [...INDEXABLE_PAGES, ...NOINDEX_PAGES, ...categoryPages, ...products.map((p) => `/produse/${p.slug}`)];
  },
};
