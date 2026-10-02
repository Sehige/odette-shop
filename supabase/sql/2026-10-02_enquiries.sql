-- Enquiries: contact messages, custom cakes and events — Odette Confiserie (2 Oct 2026)
--
-- Run once in Supabase → SQL Editor, before deploying the submit-enquiry Edge Function
-- (it is safe to run again). Adds what the function stores alongside each message:
--
--   kind        'contact', 'custom_cake' or 'event' (the form's "Despre ce ne scrii?")
--   event_date  the date wanted for the cake or the event, if given
--   guests      number of portions (cake) or guests (event), if given
--   details     extra information, e.g. the language the visitor used
--   spam        true for messages that look like spam: kept, but not emailed
--   emailed_at  when the shop was emailed about it (empty: the email failed)
--
-- After the website uses the function, run 2026-10-02_close_direct_contact_inserts.sql.

begin;

alter table public.contact_submissions
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists kind text not null default 'contact',
  add column if not exists event_date date,
  add column if not exists guests integer,
  add column if not exists details jsonb,
  add column if not exists spam boolean not null default false,
  add column if not exists emailed_at timestamptz;

alter table public.contact_submissions drop constraint if exists contact_submissions_kind_check;
alter table public.contact_submissions
  add constraint contact_submissions_kind_check check (kind in ('contact', 'custom_cake', 'event'));

-- The function's rate limits look up recent messages by time and by address
create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at);
create index if not exists contact_submissions_email_created_at_idx on public.contact_submissions (email, created_at);

commit;

-- The newest messages, to check
select created_at, kind, name, email, event_date, guests, spam, emailed_at
from public.contact_submissions
order by created_at desc
limit 5;
