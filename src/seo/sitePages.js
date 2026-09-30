// The site's fixed pages. All of them are prerendered (react-router.config.js); only the
// indexable ones go into the sitemap (scripts/finish-build.mjs). Product pages are added
// from the catalogue. Keep in sync with the `noindex` flags in the route modules.
// Unknown addresses get 404.html (the single-page fallback, see finish-build.mjs).

export const INDEXABLE_PAGES = ['/', '/shop', '/contact'];

export const NOINDEX_PAGES = [
  '/terms-and-conditions',
  '/privacy-policy',
  '/cookie-policy',
  '/admin',
];
