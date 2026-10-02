# Odette Confiserie — website

Source of [odette-confiserie.ro](https://www.odette-confiserie.ro): a React app built with React Router 7 (framework mode) on Vite, styled with Tailwind, reading its catalogue from Supabase and hosted on Vercel.

## How pages are built

Every page is **prerendered at build time** into static HTML (`react-router.config.js` lists the paths), so search engines and link previews see the full content without running JavaScript. Route modules live in `src/routes/` (`src/routes.js` maps them to URLs); each has a `meta` export for its `<head>` tags and, where the page shows catalogue data, a `loader` that fetches it from Supabase during the build. In the browser the app hydrates and refreshes that data, so edits in Supabase show immediately; the prerendered HTML updates on the next deploy. If Supabase can't be reached during a build, the build fails and the previous deployment stays live.

Every category with active products gets a page at `/<category slug>` (e.g. `/torturi`). Its heading is the category name; the optional `intro_ro` / `intro_en`, `seo_title` and `seo_description` columns of `categories` in Supabase add an intro under the heading and a custom page title and description. A slug that equals a fixed page (e.g. `contact`) is skipped.

Every active product gets its own page at `/produse/<slug>` (the `slug` column in Supabase, filled automatically for new products). After each build, `scripts/clean-prerender.mjs` removes stray NUL bytes that React 18's server renderer sometimes writes next to a multi-byte character, then `scripts/check-product-pages.mjs` checks that every product page shows its ingredients, allergens and nutrition values exactly as stored in Supabase; a mismatch fails the build. `scripts/finish-build.mjs` then writes `sitemap.xml` (the indexable pages, every category page and every product page, with the latest product edit as `lastmod`) and `404.html`, which Vercel serves with a real 404 status for any unknown address.

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

Catalogue edits in Supabase (products, nutrition, categories, gallery, image framing) rebuild the live site by themselves: a scheduled job in Supabase calls a Vercel Deploy Hook once the edits have settled for 2 minutes, and the change is live about 5 minutes after the last edit. The Deploy Hook URL is a secret kept in Supabase Vault, not in this repository. Setup, status and pause instructions: `supabase/sql/2026-10-01_rebuild_on_edit.sql`.

## Database

Supabase SQL that has been applied by hand lives in `supabase/sql/` (for example the row-level security hardening from September 2026).

The contact form posts to the Supabase Edge Function `supabase/functions/submit-enquiry` (spam checks, phone number required, saves to `contact_submissions`, emails the shop through Resend with the phone and a WhatsApp link; every email subject starts with `[Comanda Site]`). It is deployed by pasting `index.ts` into Supabase → Edge Functions → `submit-enquiry` (or `npx supabase functions deploy submit-enquiry`); its secret `RESEND_API_KEY` is set under Edge Functions → Secrets. Tests: `src/test/submit-enquiry.test.js`.

Order requests: products are added from the product window or page to an order list kept in the browser; `/comanda` sends it to the same function (`type: 'order'`), which checks the day (from tomorrow, or the day after when ordered after 18:00; Monday–Saturday; not on `closed_days`), the quantities (half kilos for products priced per kg, whole pieces otherwise) and takes prices from `products`, then saves `orders` + `order_items` (through `create_order`) and emails the shop. Your orders, soonest first: `private.orders_overview`. The rules live in `src/order/rules.js` for the website and again in the function; `src/test/order-rules.test.js` checks both agree. Setup: `supabase/sql/2026-10-02_orders.sql`.
