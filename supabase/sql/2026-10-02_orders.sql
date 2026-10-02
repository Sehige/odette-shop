-- Order requests — Odette Confiserie (2 Oct 2026)
--
-- Run once in Supabase → SQL Editor, before deploying the submit-enquiry function with
-- orders (it is safe to run again).
--
-- - orders / order_items: what customers send from the order page (/comanda). Only the
--   submit-enquiry Edge Function writes them (through create_order); the admin reads
--   and manages them. Prices are copied from products when the order arrives.
-- - closed_days: days without pickup or delivery besides Sundays (holidays, leave).
--   Add one with:   insert into public.closed_days (day, reason) values ('2026-12-25', 'Crăciun');
-- - private.orders_overview: one line per order with its products, soonest first.
--   Table Editor → schema "private" → orders_overview, or:
--   select * from private.orders_overview where wanted_date >= current_date;
-- - status: change it in the Table Editor as the order moves on
--   (new → confirmed → ready → completed, or cancelled).

begin;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'ready', 'completed', 'cancelled')),
  customer_name text not null,
  customer_phone text not null,
  fulfilment text not null check (fulfilment in ('pickup', 'delivery')),
  delivery_zone text check (delivery_zone in ('cluj', 'outside')),
  delivery_address text,
  wanted_date date not null,
  notes text,
  subtotal_estimate numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null default 0,
  total_estimate numeric(10, 2) not null,
  language text not null default 'ro',
  emailed_at timestamptz,
  check (fulfilment = 'pickup' or (delivery_zone is not null and delivery_address is not null))
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name_snapshot text not null,
  unit_price_snapshot numeric(10, 2) not null,
  price_unit_snapshot text,
  quantity numeric(10, 2) not null check (quantity > 0),
  line_total_estimate numeric(10, 2) not null
);

create table if not exists public.closed_days (
  day date primary key,
  reason text
);

create index if not exists orders_created_at_idx on public.orders (created_at);
create index if not exists orders_phone_created_at_idx on public.orders (customer_phone, created_at);
create index if not exists orders_wanted_date_idx on public.orders (wanted_date);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Row-level security: no public access to orders; closed days are public (the order
-- page greys them out)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.closed_days enable row level security;

drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists order_items_admin_all on public.order_items;
create policy order_items_admin_all on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists closed_days_public_read on public.closed_days;
create policy closed_days_public_read on public.closed_days
  for select to anon, authenticated using (true);
drop policy if exists closed_days_admin_all on public.closed_days;
create policy closed_days_admin_all on public.closed_days
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- An order and its products in one step: either both are saved or neither
create or replace function public.create_order(p_order jsonb, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  insert into public.orders (
    customer_name, customer_phone, fulfilment, delivery_zone, delivery_address, wanted_date,
    notes, subtotal_estimate, delivery_fee, total_estimate, language
  ) values (
    p_order->>'customer_name', p_order->>'customer_phone', p_order->>'fulfilment',
    p_order->>'delivery_zone', p_order->>'delivery_address', (p_order->>'wanted_date')::date,
    p_order->>'notes', (p_order->>'subtotal_estimate')::numeric, (p_order->>'delivery_fee')::numeric,
    (p_order->>'total_estimate')::numeric, coalesce(p_order->>'language', 'ro')
  )
  returning id into new_id;

  insert into public.order_items (
    order_id, product_id, name_snapshot, unit_price_snapshot, price_unit_snapshot, quantity, line_total_estimate
  )
  select new_id, (item->>'product_id')::uuid, item->>'name_snapshot', (item->>'unit_price_snapshot')::numeric,
         item->>'price_unit_snapshot', (item->>'quantity')::numeric, (item->>'line_total_estimate')::numeric
  from jsonb_array_elements(p_items) as item;

  return new_id;
end
$$;

-- Only the Edge Function (service role) may call it, not the website's public key
revoke execute on function public.create_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_order(jsonb, jsonb) to service_role;

create schema if not exists private;
create or replace view private.orders_overview as
select
  o.wanted_date,
  o.status,
  o.customer_name,
  o.customer_phone,
  case when o.fulfilment = 'pickup' then 'ridicare'
       else 'livrare ' || case when o.delivery_zone = 'cluj' then 'Cluj' else 'în afara Clujului' end
  end as fulfilment,
  o.delivery_address,
  string_agg(rtrim(rtrim(i.quantity::text, '0'), '.') || ' × ' || i.name_snapshot, ', ' order by i.name_snapshot) as products,
  o.total_estimate,
  o.notes,
  o.created_at,
  o.emailed_at,
  o.id
from public.orders o
join public.order_items i on i.order_id = o.id
group by o.id
order by o.wanted_date, o.created_at;

commit;

select 'orders ready' as status,
       (select count(*) from public.orders) as orders,
       (select count(*) from public.closed_days) as closed_days;
