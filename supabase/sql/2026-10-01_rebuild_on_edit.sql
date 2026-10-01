-- Rebuild the website after catalogue edits — Odette Confiserie (1 Oct 2026)
--
-- Every page of the website is built ahead of time from Supabase, so an edit appears on
-- the live site only after a new build. With this, Supabase starts that build itself:
--
-- - Any change to products, nutritional_info, categories, gallery_images or
--   image_settings marks the site as changed.
-- - A scheduled job looks every minute. Once nothing has changed for 2 minutes (so a
--   series of edits gives a single build), it calls the Vercel Deploy Hook. Vercel then
--   builds and publishes in about 2 minutes: an edit is live roughly 5 minutes later.
-- - If Vercel does not accept the call, it is tried again 10 minutes later.
--
-- The Deploy Hook URL is a secret (anyone who has it can start builds) and this
-- repository is public, so the URL lives in Supabase Vault, never in this file.
-- Save it once in the SQL Editor (URL from Vercel → Settings → Git → Deploy Hooks):
--
--   select vault.create_secret('<deploy hook URL>', 'vercel_deploy_hook', 'Vercel Deploy Hook: rebuilds the website');
--
-- Replace it later with:
--   select vault.update_secret(id, '<new URL>') from vault.secrets where name = 'vercel_deploy_hook';
--
-- Run this file once in Supabase → SQL Editor (it is safe to run again).
-- See what it is doing:   select * from private.site_rebuild_status;
-- Pause it:               select cron.unschedule('site-rebuild');
-- Start a build by hand:  update public.categories set name_ro = name_ro where false;
--                         (changes nothing, but counts as an edit)

begin;

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- Not exposed through the website's API
create schema if not exists private;

-- A single row: when the catalogue last changed, and the last call to Vercel
create table if not exists private.site_rebuild (
  id boolean primary key default true check (id),
  changed_at timestamptz,
  requested_at timestamptz,
  request_id bigint
);
insert into private.site_rebuild (id) values (true) on conflict (id) do nothing;

create or replace function private.mark_site_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update private.site_rebuild set changed_at = now();
  return null;
end
$$;

-- Once per statement, so a bulk update counts as one edit
do $$
declare
  t text;
begin
  foreach t in array array['products', 'nutritional_info', 'categories', 'gallery_images', 'image_settings'] loop
    execute format('drop trigger if exists site_changed on public.%I', t);
    execute format(
      'create trigger site_changed after insert or update or delete or truncate on public.%I '
      'for each statement execute function private.mark_site_changed()', t);
  end loop;
end
$$;

-- Runs every minute: calls the Deploy Hook once the edits have settled
create or replace function private.request_site_rebuild()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  state private.site_rebuild%rowtype;
  hook text;
begin
  select * into state from private.site_rebuild for update;

  -- Vercel did not accept the last call (an error, or no answer): try again after 10 minutes
  if state.requested_at < now() - interval '10 minutes' and exists (
    select 1 from net._http_response r
    where r.id = state.request_id
      and (r.status_code is null or r.status_code not between 200 and 299)
  ) then
    state.requested_at := null;
  end if;

  -- Nothing new since the last build, or edits still under way
  if state.changed_at is null
     or state.changed_at <= coalesce(state.requested_at, '-infinity')
     or state.changed_at > now() - interval '2 minutes' then
    return;
  end if;

  select decrypted_secret into hook from vault.decrypted_secrets where name = 'vercel_deploy_hook';
  if hook is null then
    raise warning 'site rebuild: save the Deploy Hook URL in Vault as vercel_deploy_hook';
    return;
  end if;

  update private.site_rebuild
     set requested_at = now(),
         request_id = net.http_post(url := hook);
end
$$;

select cron.schedule('site-rebuild', '* * * * *', 'select private.request_site_rebuild()');

-- pg_cron records every run; keep one week of that history
select cron.schedule(
  'cron-history-cleanup', '17 3 * * *',
  $$delete from cron.job_run_details where end_time < now() - interval '7 days'$$);

create or replace view private.site_rebuild_status as
select
  s.changed_at as last_edit,
  s.requested_at as last_build_requested,
  case
    when not exists (select 1 from vault.secrets where name = 'vercel_deploy_hook')
      then 'waiting for the Deploy Hook URL in Vault (see the top of 2026-10-01_rebuild_on_edit.sql)'
    when s.changed_at is null then 'no edits since this was installed'
    when s.changed_at > coalesce(s.requested_at, '-infinity')
      then 'edits waiting: the build starts within about 3 minutes'
    when r.status_code between 200 and 299 then 'build requested, Vercel accepted it'
    when r.id is not null
      then 'Vercel did not accept the call, tried again after 10 minutes: '
        || coalesce(r.status_code::text, r.error_msg, 'no answer')
    else 'build requested'
  end as status
from private.site_rebuild s
left join net._http_response r on r.id = s.request_id;

commit;

select * from private.site_rebuild_status;
