# Odette Confiserie — website

Source of [odette-confiserie.ro](https://www.odette-confiserie.ro): a React single-page app built with Vite, styled with Tailwind, reading its catalogue from Supabase and hosted on Vercel.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` (or `npm start`) | Development server on http://localhost:3000 |
| `npm run build` | Production build into `build/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the tests (Vitest + Testing Library) once |

Node 22 is expected (see `engines` in `package.json`).

## Configuration

Create a `.env` file (not committed) with the Supabase project values:

```
REACT_APP_SUPABASE_URL=https://<project>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon key>
```

The same two variables are set in the Vercel project. The `REACT_APP_` prefix is kept from the Create React App days; `vite.config.mjs` exposes it through `envPrefix`.

## Deploying

Work happens on the `local` branch. Merging `local` into `production` and pushing deploys the site on Vercel.

## Database

Supabase SQL that has been applied by hand lives in `supabase/sql/` (for example the row-level security hardening from September 2026).
