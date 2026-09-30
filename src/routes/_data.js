// Loaders run at build time (prerendering). A failed query throws, which fails
// the build: Vercel then keeps the previous deployment instead of shipping empty pages.
export const must = (result, what) => {
  if (result.error) {
    throw new Error(`Could not load ${what} from Supabase: ${result.error.message || result.error}`);
  }
  return result.data || [];
};
