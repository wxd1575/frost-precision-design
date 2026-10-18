-- Lead attribution and CRM outcome fields for the Google Ads campaign.
-- Run in the Supabase SQL editor for the Frost Ice project BEFORE deploying
-- the site changes that write these columns. Purely additive: existing rows,
-- policies and the current insert/select/update/delete flows are unaffected.

alter table public.contact_submissions
  add column if not exists lead_source    text,
  add column if not exists utm_source     text,
  add column if not exists utm_medium     text,
  add column if not exists utm_campaign   text,
  add column if not exists utm_term       text,
  add column if not exists utm_content    text,
  add column if not exists gclid          text,
  add column if not exists landing_page   text,
  add column if not exists referrer       text,
  add column if not exists suburb         text,
  add column if not exists contact_method text not null default 'form',
  add column if not exists outcome        text,
  add column if not exists revenue        numeric(12, 2);

alter table public.contact_submissions
  drop constraint if exists contact_submissions_contact_method_check,
  add constraint contact_submissions_contact_method_check
    check (contact_method in ('form', 'call', 'whatsapp'));

alter table public.contact_submissions
  drop constraint if exists contact_submissions_outcome_check,
  add constraint contact_submissions_outcome_check
    check (outcome is null or outcome in ('won', 'lost', 'no_answer'));

create index if not exists contact_submissions_lead_source_idx
  on public.contact_submissions (lead_source);
