-- The contact form asks for a phone number instead of an email — Odette Confiserie (2 Oct 2026)
--
-- Run once in Supabase → SQL Editor BEFORE deploying the updated submit-enquiry
-- function (safe to run again). New messages have no email, and the function's
-- "5 messages per hour" limit now looks messages up by phone number.

alter table public.contact_submissions alter column email drop not null;

create index if not exists contact_submissions_phone_created_at_idx
  on public.contact_submissions (phone, created_at);

-- Check: email should say YES (empty allowed)
select column_name, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'contact_submissions' and column_name in ('email', 'phone');
