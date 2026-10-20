-- Spam protection for public contact form inserts.
-- Browsers talk to the table directly with the anon key, so every check has to live in the database.

-- 1. Anonymous visitors may only create plain, new form leads.
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.contact_submissions;
CREATE POLICY "Enable insert for anonymous users"
  ON public.contact_submissions
  FOR INSERT TO anon
  WITH CHECK (
    status = 'new'
    AND contact_method = 'form'
    AND outcome IS NULL
    AND revenue IS NULL
    AND notified_at IS NULL
  );

-- 2. Hard size limits for every role (mirrors the form's zod limits).
ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_length_limits;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_length_limits CHECK (
    char_length(first_name) <= 50
    AND char_length(last_name) <= 50
    AND char_length(email) <= 255
    AND char_length(phone) <= 20
    AND char_length(client_type) <= 50
    AND char_length(service_required) <= 100
    AND char_length(address) <= 200
    AND char_length(suburb) <= 100
    AND char_length(urgency) <= 50
    AND char_length(message) <= 2000
    AND char_length(lead_source) <= 100
    AND char_length(utm_source) <= 200
    AND char_length(utm_medium) <= 200
    AND char_length(utm_campaign) <= 200
    AND char_length(utm_term) <= 200
    AND char_length(utm_content) <= 200
    AND char_length(gclid) <= 300
    AND char_length(landing_page) <= 500
    AND char_length(referrer) <= 500
  );

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_email_lower_idx
  ON public.contact_submissions (lower(email));

-- 3. Format checks and rate limits for anonymous inserts.
-- SECURITY DEFINER because anon has no SELECT policy and could not count rows otherwise.
-- Limits (tune here): 3 per email/phone per hour, 15 per 10 minutes and 100 per day overall.
-- The daily cap keeps a flood from burning the Resend quota (each lead sends two emails).
CREATE OR REPLACE FUNCTION public.guard_contact_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  v_email text := lower(trim(coalesce(NEW.email, '')));
  v_phone text := regexp_replace(coalesce(NEW.phone, ''), '[^0-9+]', '', 'g');
  v_count integer;
begin
  -- Admin users and the SQL editor are trusted; only the public anon role is limited.
  if coalesce(auth.role(), current_user) <> 'anon' then
    return NEW;
  end if;

  if v_phone !~ '^\+?[0-9]{7,15}$' then
    raise exception 'contact_guard:invalid_phone' using errcode = 'P0001';
  end if;

  if v_email <> '' and v_email !~ '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$' then
    raise exception 'contact_guard:invalid_email' using errcode = 'P0001';
  end if;

  select count(*) into v_count
  from regexp_matches(coalesce(NEW.message, ''), '(https?://|www\.)', 'gi');
  if v_count > 2 then
    raise exception 'contact_guard:too_many_links' using errcode = 'P0001';
  end if;

  if v_email <> '' then
    select count(*) into v_count from public.contact_submissions
    where lower(email) = v_email and created_at > now() - interval '1 hour';
    if v_count >= 3 then
      raise exception 'contact_guard:rate_limited' using errcode = 'P0001';
    end if;
  end if;

  select count(*) into v_count from public.contact_submissions
  where created_at > now() - interval '1 hour'
    and regexp_replace(coalesce(phone, ''), '[^0-9+]', '', 'g') = v_phone;
  if v_count >= 3 then
    raise exception 'contact_guard:rate_limited' using errcode = 'P0001';
  end if;

  select count(*) into v_count from public.contact_submissions
  where created_at > now() - interval '10 minutes';
  if v_count >= 15 then
    raise exception 'contact_guard:rate_limited' using errcode = 'P0001';
  end if;

  select count(*) into v_count from public.contact_submissions
  where created_at > now() - interval '24 hours';
  if v_count >= 100 then
    raise exception 'contact_guard:rate_limited' using errcode = 'P0001';
  end if;

  return NEW;
end;
$function$;

DROP TRIGGER IF EXISTS before_contact_inserted ON public.contact_submissions;
CREATE TRIGGER before_contact_inserted
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.guard_contact_submission();
