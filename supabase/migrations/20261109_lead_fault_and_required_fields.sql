-- Repairs landing page: record which fault the visitor picked and which form the lead came from,
-- and enforce the required fields at write time as well as in the browser.
--
-- Run in the Supabase SQL editor for the Frost Ice project BEFORE deploying the site change that
-- writes these columns. Purely additive for existing rows. If the site is deployed first, the form
-- drops the missing columns and retries, so no lead is lost, but the fault and form are not recorded.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS fault text,
  ADD COLUMN IF NOT EXISTS form_location text;

-- Size limits for the new columns (the existing limits constraint stays as it is).
ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_form_fields_length_limits;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_form_fields_length_limits CHECK (
    char_length(fault) <= 100
    AND char_length(form_location) <= 100
  );

-- Same guard as 20261020_contact_spam_guard.sql, plus two checks for anonymous inserts:
--   * first name must not be blank (the phone check below already rejects a blank phone)
--   * suburb must not be blank when the lead comes from a landing page form (form_location 'landing_...').
--     The full contact form keeps suburb optional, so this is keyed on form_location, not on every insert.
-- Admin users and the SQL editor are still trusted and skip every check.
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

  if trim(coalesce(NEW.first_name, '')) = '' then
    raise exception 'contact_guard:missing_first_name' using errcode = 'P0001';
  end if;

  if left(coalesce(NEW.form_location, ''), 8) = 'landing_'
     and trim(coalesce(NEW.suburb, '')) = '' then
    raise exception 'contact_guard:missing_suburb' using errcode = 'P0001';
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
