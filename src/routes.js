import { index, layout, route } from '@react-router/dev/routes';

// Every page shares the site layout (header + footer). All of these paths are
// prerendered at build time (react-router.config.js); '*' catches unknown ones.
export default [
  layout('routes/site-layout.jsx', [
    index('routes/home.jsx'),
    route('shop', 'routes/shop.jsx'),
    route('contact', 'routes/contact.jsx'),
    route('terms-and-conditions', 'routes/terms.jsx'),
    route('privacy-policy', 'routes/privacy.jsx'),
    route('cookie-policy', 'routes/cookies.jsx'),
    route('admin', 'routes/admin.jsx'),
    route('*', 'routes/not-found.jsx'),
  ]),
];
