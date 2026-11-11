-- Installation landing page: record the room size and whether the visitor already owns a unit,
-- so a quote can be given without a site visit.
--
-- Run in the Supabase SQL editor for the Frost Ice project BEFORE deploying the site change that
-- writes these columns. Purely additive for existing rows. If the site is deployed first, the form
-- drops the missing columns, keeps the answers in the lead's message and retries, so no lead is lost.
-- The anonymous insert policy and guard_contact_submission() need no change: they do not look at these columns.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS room_size text,
  ADD COLUMN IF NOT EXISTS has_unit boolean;

-- Size limit for the new text column (the existing limit constraints stay as they are).
ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_installation_fields_length_limits;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_installation_fields_length_limits CHECK (
    char_length(room_size) <= 50
  );
