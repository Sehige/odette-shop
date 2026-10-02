-- Contact messages only through the submit-enquiry Edge Function — Odette Confiserie (2 Oct 2026)
--
-- Run in Supabase → SQL Editor once the website sends its contact form to the
-- submit-enquiry function (not before: the old form writes to the table directly).
--
-- Until now anyone holding the website's public key could write messages straight into
-- contact_submissions, skipping the spam checks. After this only the function (which
-- uses the service role) can add messages; the admin can still read and manage them.
--
-- Undo (reopens direct inserts, as before):
--   create policy contact_submissions_public_insert on public.contact_submissions
--     for insert to anon, authenticated with check (true);

drop policy if exists contact_submissions_public_insert on public.contact_submissions;

-- Remaining policies on the table: only contact_submissions_admin_all should be listed
select policyname, cmd, roles from pg_policies
where schemaname = 'public' and tablename = 'contact_submissions';
