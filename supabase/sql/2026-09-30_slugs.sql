-- Product and category slugs (URL names) — Odette Confiserie (30 Sep 2026)
--
-- Run once in Supabase → SQL Editor (it is safe to run again). The last query lists the
-- product URLs so you can check them.
--
-- - products.slug: the product page address, /produse/<slug>. Filled from the Romanian
--   name without diacritics. Names that would give the same slug (today the two
--   "Brownie") get their price unit appended, e.g. brownie-pachet. Rename first if you
--   prefer; a slug should not change once the page is published.
-- - New products get a slug automatically (clear the field to regenerate it).
-- - categories.slug plus intro/SEO text columns for the category pages.
-- - products.updated_at is kept current on every edit (used by the sitemap).

begin;

-- Romanian-aware slug: ă/â/î/ș/ț (and ş/ţ) and common accents to ASCII,
-- lowercase, anything else that is not a letter or digit becomes '-'
create or replace function public.slugify(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(
    lower(translate(coalesce(value, ''),
      'ĂÂÎȘŞȚŢăâîșşțţáàäéèëíìïóòöőúùüűçñÁÀÄÉÈËÍÌÏÓÒÖŐÚÙÜŰÇÑ',
      'aaissttaaissttaaaeeeiiioooouuuucnaaaeeeiiioooouuuucn')),
    '[^a-z0-9]+', '-', 'g'))
$$;

-- Fills NEW.slug from NEW.name_ro when empty, adding -2, -3 ... if it is taken
create or replace function public.set_slug_from_name()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidate text;
  taken boolean;
  n int := 2;
begin
  if new.slug is null or new.slug = '' then
    base := coalesce(nullif(public.slugify(new.name_ro), ''), 'pagina');
    candidate := base;
    loop
      execute format('select exists (select 1 from %I.%I where slug = $1 and id <> $2)',
                     tg_table_schema, tg_table_name)
        into taken using candidate, new.id;
      exit when not taken;
      candidate := base || '-' || n;
      n := n + 1;
    end loop;
    new.slug := candidate;
  end if;
  return new;
end $$;

-- Products -------------------------------------------------------------------

alter table public.products add column if not exists slug text;

-- Backfill: active products first, so they get the clean slug
do $$
declare
  r record;
  base text;
  candidate text;
  n int;
begin
  for r in
    select id, name_ro, price_unit from public.products
    where slug is null or slug = ''
    order by "isActive" desc, created_at
  loop
    base := coalesce(nullif(public.slugify(r.name_ro), ''), 'produs');
    candidate := base;
    if exists (select 1 from public.products where slug = candidate)
       and coalesce(public.slugify(r.price_unit), '') <> '' then
      candidate := base || '-' || public.slugify(r.price_unit);
    end if;
    n := 2;
    while exists (select 1 from public.products where slug = candidate) loop
      candidate := base || '-' || n;
      n := n + 1;
    end loop;
    update public.products set slug = candidate where id = r.id;
  end loop;
end $$;

alter table public.products alter column slug set not null;
create unique index if not exists products_slug_key on public.products (slug);

drop trigger if exists products_set_slug on public.products;
create trigger products_set_slug
  before insert or update of slug on public.products
  for each row execute function public.set_slug_from_name();

create extension if not exists moddatetime with schema extensions;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function extensions.moddatetime(updated_at);

-- Categories -----------------------------------------------------------------

alter table public.categories
  add column if not exists slug text,
  add column if not exists intro_ro text,
  add column if not exists intro_en text,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

do $$
declare
  r record;
  base text;
  candidate text;
  n int;
begin
  for r in select id, name_ro from public.categories where slug is null or slug = '' order by order_index nulls last, name_ro loop
    base := coalesce(nullif(public.slugify(r.name_ro), ''), 'categorie');
    candidate := base;
    n := 2;
    while exists (select 1 from public.categories where slug = candidate) loop
      candidate := base || '-' || n;
      n := n + 1;
    end loop;
    update public.categories set slug = candidate where id = r.id;
  end loop;
end $$;

create unique index if not exists categories_slug_key on public.categories (slug);

drop trigger if exists categories_set_slug on public.categories;
create trigger categories_set_slug
  before insert or update of slug on public.categories
  for each row execute function public.set_slug_from_name();

commit;

-- Check: the product page addresses of everything on sale
select name_ro, '/produse/' || slug as page
from public.products
where "isActive"
order by name_ro;
