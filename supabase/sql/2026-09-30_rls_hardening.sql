-- RLS hardening — Odette Confiserie (30 Sep 2026)
--
-- STATUS: applied to production on 30 Sep 2026 and verified from outside with the anon key:
-- the site's reads are unchanged, and inactive products, newsletter subscribers and contact
-- messages are no longer readable. Sign-ups are disabled. Kept for the record; safe to re-run.
--
-- Run in Supabase → SQL Editor, in this order:
--   1. Run 2026-09-30_rls_audit.sql and keep its output.
--   2. Deploy the contact-form change first (insert without .select(),
--      src/services/utilityServices.js). The old code asks for the row back,
--      which this script (correctly) no longer allows.
--   3. Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".
--   4. Run this script. It is one transaction (all or nothing) and can be re-run safely.
--
-- Result:
--   products                → anyone reads ACTIVE rows only; only the admin writes
--   categories, nutritional_info, gallery_images (active), image_settings
--                           → anyone reads; only the admin writes
--   contact_submissions     → anyone can insert a message; only the admin reads or changes
--   newsletter_subscribers  → no public access (unused by the site); only the admin
-- The dashboard and SQL editor use the service role, which bypasses RLS, so editing
-- products there works exactly as before.

begin;

-- Single definition of "admin" (the same account the existing image_settings and
-- gallery_images policies pin). Change it here only.
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'odette.confiserie@gmail.com'
$$;

-- Remove every existing policy on these tables so no forgotten permissive one survives
-- (policies are OR-ed: one "allow all" cancels everything else).
do $$
declare r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('products', 'categories', 'nutritional_info', 'gallery_images',
                        'image_settings', 'contact_submissions', 'newsletter_subscribers')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Catalogue ------------------------------------------------------------------

alter table public.products enable row level security;
create policy products_public_read on public.products
  for select using ("isActive" = true);
create policy products_admin_all on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.categories enable row level security;
create policy categories_public_read on public.categories
  for select using (true);
create policy categories_admin_all on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.nutritional_info enable row level security;
create policy nutritional_info_public_read on public.nutritional_info
  for select using (true);
create policy nutritional_info_admin_all on public.nutritional_info
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.gallery_images enable row level security;
create policy gallery_images_public_read on public.gallery_images
  for select using ("isActive" = true);
create policy gallery_images_admin_write on public.gallery_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.image_settings enable row level security;
create policy image_settings_public_read on public.image_settings
  for select using (true);
create policy image_settings_admin_write on public.image_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Forms ----------------------------------------------------------------------

alter table public.contact_submissions enable row level security;
create policy contact_submissions_public_insert on public.contact_submissions
  for insert to anon, authenticated
  with check (
    char_length(coalesce(name, '')) between 1 and 200
    and char_length(coalesce(email, '')) between 3 and 320
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(message, '')) between 1 and 5000
  );
create policy contact_submissions_admin_all on public.contact_submissions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.newsletter_subscribers enable row level security;
create policy newsletter_subscribers_admin_all on public.newsletter_subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

commit;

-- Storage — no change needed. The audit (30 Sep) shows no policies on storage.objects, so
-- with RLS on only the service role (the dashboard) can upload, replace or delete files.
-- Both buckets (product-images, category-images) are public, so the site reads images
-- without any policy. Only if the site itself ever uploads files, add admin-only policies:
--
-- create policy product_images_admin_insert on storage.objects
--   for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
-- create policy product_images_admin_update on storage.objects
--   for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
-- create policy product_images_admin_delete on storage.objects
--   for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- Check afterwards: re-run audit query 2. Each table above should list only the policies
-- created here, and the shop, homepage, gallery and admin image tool should work unchanged.
