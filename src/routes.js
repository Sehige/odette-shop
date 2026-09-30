import { index, layout, route } from '@react-router/dev/routes';

// Every page shares the site layout (header + footer). All of these paths are
// prerendered at build time (react-router.config.js), including one product page
// per active product; '*' catches unknown addresses.
export default [
  layout('routes/site-layout.jsx', [
    index('routes/home.jsx'),
    route('shop', 'routes/shop.jsx'),
    route('produse/:slug', 'routes/product.jsx'),
    route('contact', 'routes/contact.jsx'),
    route('terms-and-conditions', 'routes/terms.jsx'),
    route('privacy-policy', 'routes/privacy.jsx'),
    route('cookie-policy', 'routes/cookies.jsx'),
    route('admin', 'routes/admin.jsx'),
    route('*', 'routes/not-found.jsx'),
  ]),
];
