-- Logged-in admins (e.g. the dashboard's "log a call" action) need to insert lead rows.
-- Until now only the anon role had an INSERT policy, so those inserts were rejected by RLS.
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contact_submissions;
CREATE POLICY "Enable insert for authenticated users"
  ON public.contact_submissions
  FOR INSERT TO authenticated
  WITH CHECK (true);
