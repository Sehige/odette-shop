-- RLS audit — READ-ONLY. Nothing here changes data or settings.
-- One query, one result table: run it in Supabase → SQL Editor, then copy the result
-- (Copy → Markdown) and paste it back. It decides the storage part of
-- 2026-09-30_rls_hardening.sql and shows any table left open.

select section, item, detail
from (
  -- a. Public tables and whether row-level security is on (OFF = open to the anon key)
  select 'a · table rls' as section,
         tablename::text as item,
         case when rowsecurity then 'on' else 'OFF' end as detail
  from pg_tables
  where schemaname = 'public'

  union all

  -- b. Every policy on public tables and on storage. Policies are OR-ed, so one
  --    permissive "true" policy opens the table for that command.
  select 'b · policy',
         schemaname::text || '.' || tablename::text || ' · ' || policyname::text,
         cmd || ' to ' || array_to_string(roles, ',')
           || coalesce(' using (' || qual || ')', '')
           || coalesce(' check (' || with_check || ')', '')
  from pg_policies
  where schemaname in ('public', 'storage')

  union all

  -- c. Storage buckets
  select 'c · bucket', id::text, case when public then 'public' else 'private' end
  from storage.buckets

  union all

  -- d. Triggers on public tables (database webhooks show up here)
  select 'd · trigger',
         event_object_table::text || ' · ' || trigger_name::text,
         action_timing::text || ' ' || event_manipulation::text
  from information_schema.triggers
  where event_object_schema = 'public'
) audit
order by section, item;
