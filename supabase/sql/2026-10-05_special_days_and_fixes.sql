-- Special opening days, and product fixes — Odette Confiserie (5 Oct 2026)
--
-- Run once in Supabase → SQL Editor (it is safe to run again).
--
-- 1. special_days: holidays and days with special hours. The website's opening hours
--    ("Deschis acum / Închis · deschide …", footer, contact page, homepage) use them, and
--    the next 30 days of them are listed under the weekly hours. A day without opens/closes
--    is closed all day. Examples:
--      insert into public.special_days (day, note) values ('2026-12-25', 'Crăciun'), ('2026-12-26', 'Crăciun');
--      insert into public.special_days (day, opens, closes, note) values ('2026-12-24', '08:00', '14:00', 'Ajun');
--    Edit or delete rows in Table Editor → special_days.
--
-- 2. Product fixes:
--    - "Tort cu fistic și zmeură": "Mousselinul de istic" → "Mousselinul de fistic"
--    - the two products both called "Brownie":
--        brownie2 (150 lei/kg) → "Brownie la kg", address /produse/brownie-la-kg
--          (the website sends the old address there with a permanent redirect)
--        brownie-pachet (15 lei/pachet) → "Brownie – pachet 100 g", same address
--    Saving them rebuilds the website by itself (2026-10-01_rebuild_on_edit.sql).

begin;

create table if not exists public.special_days (
  day date primary key,
  opens time,
  closes time,
  note text,
  check ((opens is null) = (closes is null)),
  check (opens is null or opens < closes)
);

alter table public.special_days enable row level security;
drop policy if exists special_days_public_read on public.special_days;
create policy special_days_public_read on public.special_days
  for select to anon, authenticated using (true);
drop policy if exists special_days_admin_all on public.special_days;
create policy special_days_admin_all on public.special_days
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

update public.products
   set description_ro = replace(description_ro, 'Mousselinul de istic', 'Mousselinul de fistic')
 where slug = 'tort-cu-fistic-si-zmeura' and description_ro like '%Mousselinul de istic%';

update public.products
   set name_ro = 'Brownie la kg', name_en = 'Brownie by the kg', slug = 'brownie-la-kg'
 where slug = 'brownie2';

update public.products
   set name_ro = 'Brownie – pachet 100 g', name_en = 'Brownie – 100 g pack'
 where slug = 'brownie-pachet';

commit;

-- Check: two distinct Brownies and the corrected description
select slug, name_ro, name_en from public.products where slug in ('brownie-la-kg', 'brownie-pachet', 'brownie2')
union all
select slug, 'fistic fixed: ' || (description_ro like '%Mousselinul de fistic%')::text, null
from public.products where slug = 'tort-cu-fistic-si-zmeura';
