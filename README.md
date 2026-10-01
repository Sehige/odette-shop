# Odette Confiserie — website

Source of [odette-confiserie.ro](https://www.odette-confiserie.ro): a React app built with React Router 7 (framework mode) on Vite, styled with Tailwind, reading its catalogue from Supabase and hosted on Vercel.

## How pages are built

Every page is **prerendered at build time** into static HTML (`react-router.config.js` lists the paths), so search engines and link previews see the full content without running JavaScript. Route modules live in `src/routes/` (`src/routes.js` maps them to URLs); each has a `meta` export for its `<head>` tags and, where the page shows catalogue data, a `loader` that fetches it from Supabase during the build. In the browser the app hydrates and refreshes that data, so edits in Supabase show immediately; the prerendered HTML updates on the next deploy. If Supabase can't be reached during a build, the build fails and the previous deployment stays live.

Every category with active products gets a page at `/<category slug>` (e.g. `/torturi`). Its heading is the category name; the optional `intro_ro` / `intro_en`, `seo_title` and `seo_description` columns of `categories` in Supabase add an intro under the heading and a custom page title and description. A slug that equals a fixed page (e.g. `contact`) is skipped.

Every active product gets its own page at `/produse/<slug>` (the `slug` column in Supabase, filled automatically for new products). After each build, `scripts/check-product-pages.mjs` checks that every product page shows its ingredients, allergens and nutrition values exactly as stored in Supabase; a mismatch fails the build. `scripts/finish-build.mjs` then writes `sitemap.xml` (the indexable pages, every category page and every product page, with the latest product edit as `lastmod`) and `404.html`, which Vercel serves with a real 404 status for any unknown address.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` (or `npm start`) | Development server on http://localhost:3000 |
| `npm run build` | Production build and prerender into `build/client` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the tests (Vitest + Testing Library) once |
| `npm run test:e2e` | Checks the built site in headless Chrome: page HTML, 404s, cookie consent, quick view, history, keyboard and screen-reader basics. Run `npm run build` first; `BASE=https://www.odette-confiserie.ro npm run test:e2e` checks the live site. Needs Chrome or Edge installed (or `CHROME_PATH`) |

Node 22 is expected (see `engines` in `package.json`).

## Configuration

Create a `.env` file (not committed) with the Supabase project values:

```
REACT_APP_SUPABASE_URL=https://<project>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon key>
```

The same two variables are set in the Vercel project. The `REACT_APP_` prefix is kept from the Create React App days; `vite.config.mjs` exposes it through `envPrefix`. The build needs them too, because it reads the catalogue.

## Deploying

Work happens on the `local` branch. Merging `local` into `production` and pushing deploys the site on Vercel.

## Database

Supabase SQL that has been applied by hand lives in `supabase/sql/` (for example the row-level security hardening from September 2026).
