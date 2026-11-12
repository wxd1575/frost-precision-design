-- Click attribution for the Google Ads campaign.
-- Records one lightweight row when a visitor taps call, WhatsApp or email, so the
-- gclid behind that tap survives without depending on advertising cookies.
--
-- Why this is needed: index.html defaults Consent Mode to ad_storage = 'denied',
-- so Google only attributes a conversion for visitors who accept cookies. Taps by
-- everyone else are invisible today. These rows are what later feeds an offline
-- conversion import, which is consent-independent.
--
-- Run in the Supabase SQL editor for the Frost Ice project BEFORE deploying the
-- site change that writes this table. Purely additive: contact_submissions, its
-- policies and guard_contact_submission() are untouched.
--
-- These rows are NOT leads. A lead carries a name, contact details and a message,
-- and lives in contact_submissions — whose anonymous insert policy accepts only
-- contact_method = 'form', and whose name/email/phone/message columns are NOT NULL.
-- A tap carries none of that, so it gets its own table rather than loosening either.

CREATE TABLE IF NOT EXISTS public.click_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT timezone('utc', now()),
  kind         text NOT NULL,
  placement    text,
  page_path    text,
  lead_source  text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  gclid        text,
  landing_page text,
  referrer     text
);

-- Domain integrity: the three link kinds TrackedLink reports.
ALTER TABLE public.click_events
  DROP CONSTRAINT IF EXISTS click_events_kind_check;
ALTER TABLE public.click_events
  ADD CONSTRAINT click_events_kind_check CHECK (kind IN ('call', 'whatsapp', 'email'));

-- Size limits, mirroring contact_submissions_length_limits for the same columns.
ALTER TABLE public.click_events
  DROP CONSTRAINT IF EXISTS click_events_length_limits;
ALTER TABLE public.click_events
  ADD CONSTRAINT click_events_length_limits CHECK (
    char_length(placement) <= 50
    AND char_length(page_path) <= 500
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

CREATE INDEX IF NOT EXISTS click_events_created_at_idx
  ON public.click_events (created_at DESC);
-- Partial: the offline conversion export only ever reads rows that carry a gclid.
CREATE INDEX IF NOT EXISTS click_events_gclid_idx
  ON public.click_events (gclid) WHERE gclid IS NOT NULL;

ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors may only append. They cannot read the table back.
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.click_events;
CREATE POLICY "Enable insert for anonymous users"
  ON public.click_events
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.click_events;
CREATE POLICY "Enable read access for authenticated users"
  ON public.click_events
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.click_events;
CREATE POLICY "Enable delete for authenticated users"
  ON public.click_events
  FOR DELETE TO authenticated
  USING (true);

-- Rate limits for anonymous inserts, mirroring guard_contact_submission().
-- SECURITY DEFINER because anon has no SELECT policy and could not count rows otherwise.
-- Limits are deliberately far looser than the form's: a tap is cheap, is expected on
-- most visits and sends no email. Tune here: 60 per 10 minutes, 2000 per day overall.
CREATE OR REPLACE FUNCTION public.guard_click_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  v_count integer;
begin
  -- Admin users and the SQL editor are trusted; only the public anon role is limited.
  if coalesce(auth.role(), current_user) <> 'anon' then
    return NEW;
  end if;

  select count(*) into v_count from public.click_events
  where created_at > now() - interval '10 minutes';
  if v_count >= 60 then
    raise exception 'click_guard:rate_limited' using errcode = 'P0001';
  end if;

  select count(*) into v_count from public.click_events
  where created_at > now() - interval '24 hours';
  if v_count >= 2000 then
    raise exception 'click_guard:rate_limited' using errcode = 'P0001';
  end if;

  return NEW;
end;
$function$;

DROP TRIGGER IF EXISTS before_click_event_inserted ON public.click_events;
CREATE TRIGGER before_click_event_inserted
  BEFORE INSERT ON public.click_events
  FOR EACH ROW EXECUTE FUNCTION public.guard_click_event();
