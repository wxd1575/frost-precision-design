-- Export view for Google Ads offline conversion import.
--
-- Consent Mode defaults ad_storage to 'denied', so Google only attributes a
-- conversion for visitors who accept cookies. Uploading these rows instead makes
-- attribution independent of cookies, consent, ad blockers and ITP.
--
-- Column names and the timestamp format match Google's import template exactly, so
-- the result can be exported to CSV or a Google Sheet and imported without editing.
-- "Conversion Name" must keep matching the conversion action names in the Ads
-- account: "Quote form submitted", "Call click (website)" and "WhatsApp click".
--
-- Email taps are excluded on purpose: there is no corresponding conversion action
-- in the Ads account, and an import naming one that does not exist is rejected.
--
-- security_invoker so the caller's RLS applies: anon has no SELECT policy on either
-- underlying table and therefore cannot read this view.
--
-- Values mirror leadValueZar() in src/lib/tracking/config.ts (close rate x average
-- job): R430 for an installation, R320 otherwise. South Africa has no daylight
-- saving, so the +02:00 offset is constant.

CREATE OR REPLACE VIEW public.google_ads_offline_conversions
WITH (security_invoker = true) AS
SELECT
  gclid AS "Google Click ID",
  conversion_name AS "Conversion Name",
  to_char(occurred_at AT TIME ZONE 'Africa/Johannesburg', 'YYYY-MM-DD HH24:MI:SS') || '+02:00'
    AS "Conversion Time",
  conversion_value AS "Conversion Value",
  'ZAR' AS "Conversion Currency"
FROM (
  SELECT
    gclid,
    created_at AS occurred_at,
    'Quote form submitted'::text AS conversion_name,
    CASE WHEN service_required ILIKE '%install%' THEN 430 ELSE 320 END AS conversion_value
  FROM public.contact_submissions
  WHERE contact_method = 'form'
    AND gclid IS NOT NULL
    AND gclid <> ''

  UNION ALL

  SELECT
    gclid,
    created_at,
    CASE kind WHEN 'call' THEN 'Call click (website)' ELSE 'WhatsApp click' END,
    320
  FROM public.click_events
  WHERE kind IN ('call', 'whatsapp')
    AND gclid IS NOT NULL
    AND gclid <> ''
) source
ORDER BY occurred_at;
