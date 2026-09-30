// React Router framework mode: every page is rendered to static HTML at build
// time (no server at runtime). Vercel serves the files from build/client.
export default {
  appDirectory: 'src',
  ssr: false,
  // '/404' renders the catch-all route, giving a static not-found page
  prerender: [
    '/',
    '/shop',
    '/contact',
    '/terms-and-conditions',
    '/privacy-policy',
    '/cookie-policy',
    '/admin',
    '/404',
  ],
};
