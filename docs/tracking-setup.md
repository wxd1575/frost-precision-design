# Tracking setup: Google Ads, GTM and GA4

How the site reports clicks and lead sources, and the console steps that cannot be done in code.
Landing pages: `/aircon-repairs/` (repairs) and `/aircon-installation/` (installation).

## What the site sends

Everything goes to the GTM `dataLayer` (container `GTM-K58HR5MF`). The old direct GA4 tag was removed from `index.html`, so GTM is the only thing that fires GA4 and Google Ads tags.

| Event | When it fires | Key parameters |
|---|---|---|
| `page_view` | Every page load and client-side route change | `page_path`, `page_location`, `page_title` |
| `click_call` | Any `tel:` link is clicked | `placement` (e.g. `landing_hero`, `landing_sticky_bar`, `navbar_desktop`) |
| `click_whatsapp` | Any WhatsApp link is clicked | `placement` |
| `click_email` | Any `mailto:` link is clicked | `placement` |
| `generate_lead` | A quote form is saved | `currency` (ZAR), `value`, `service_type`, `service_kind`, `suburb`, `form_location` |

Every event also carries: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `landing_page`, `referrer` and `lead_source` (for example `Google Ads – repairs`).

`generate_lead.value` is the expected value of an enquiry: average job revenue × the one-in-five close rate (R320 repairs, R430 installation). Change `CLOSE_RATE` in `src/lib/tracking/config.ts` once Month 1 gives the real close rate.

Test any page with a fake ad click: `/aircon-repairs/?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=TEST123`.

## 1. Run the database migration first

Run `supabase/migrations/20261016_lead_attribution.sql` in the Supabase SQL editor for the live project **before** relying on source reporting. The form still saves leads without it (it retries without the new columns), but no source data is stored until the columns exist.

## 2. GTM container (GTM-K58HR5MF)

Open the container and check for an existing GA4 tag first, so GA4 is not counted twice.

**Variables** (Data Layer Variable, version 2): `lead_source`, `gclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `landing_page`, `placement`, `value`, `currency`, `service_type`, `suburb`.

**Triggers** (Custom Event): `page_view`, `click_call`, `click_whatsapp`, `click_email`, `generate_lead`.

**Tags**
1. **GA4 Configuration** (`G-61633SMHZE`), firing on All Pages / Initialization. Turn off "Send a page view event when this configuration loads" (the site sends `page_view` itself on every route, including the first load).
2. **GA4 Event: page_view**, trigger `page_view`, with `page_location` and `page_title` set from the dataLayer.
3. **GA4 Event: click_call**, **click_whatsapp**, **click_email**, one tag per trigger, passing `placement` and `lead_source`.
4. **GA4 Event: generate_lead**, passing `value`, `currency`, `service_type`, `suburb`, `lead_source`.
5. **Google Ads Conversion Linker**, All Pages.
6. **Google Ads Conversion tags** (see step 3), one per conversion action.

All tags must respect Consent Mode: leave the built-in consent checks on (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`). The site's cookie banner already sends the consent update.

## 3. Google Ads conversion actions

Create these in Google Ads → Goals → Conversions → New conversion action → Website, then copy each Conversion ID / Label into its GTM tag.

| Conversion | GTM trigger | Setting | Notes |
|---|---|---|---|
| Quote form | `generate_lead` | **Primary** | Use the dataLayer `value` and `currency` |
| Call click (website) | `click_call` | **Primary** | Count: one |
| WhatsApp click | `click_whatsapp` | **Secondary** | Not used for bidding; confirm real chats manually |
| Calls from ads | Call asset | **Primary** | Set up under the call asset, with call reporting on |

Then:
- Link Google Ads to GA4 (already done) and mark `generate_lead` and `click_call` as **key events** in GA4.
- Set the final URLs to `https://frosticeaircon.co.za/aircon-repairs/` and `https://frosticeaircon.co.za/aircon-installation/`.
- Turn on **auto-tagging** (adds `gclid`, which the site stores with each lead). Optionally add a tracking template such as `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}`.
- Verify the Google Business Profile (the strategy's first action; verification can take days).

## 4. Test before spending

1. Open GTM → Preview and enter the landing page URL with the fake `gclid`.
2. Confirm each event fires **once** and `gclid` / `lead_source` are populated.
3. In GA4 → Admin → DebugView, confirm the events arrive.
4. Submit one real trial enquiry, then check:
   - the lead appears in `/admin` with source `Google Ads – repairs` (or installation);
   - `generate_lead` shows as a conversion in Google Ads (it can take a few hours to show).
5. Tap Call and WhatsApp on a phone and confirm `click_call` / `click_whatsapp`.
6. Consent: with cookies rejected, tags should not set cookies. Conversions from those visitors are modelled or missing; this is expected.

## 5. Weekly CRM routine

- `/admin` → each lead shows its source. Open a lead and record **Job outcome** (won / lost / no answer) and **Revenue**.
- Phone calls do not reach the CRM on their own: use the phone icon in `/admin` to log each call (default source `Google Ads – call`).
- Export the CSV (includes source, UTM, click ID, outcome and revenue) to work out spend, qualified leads, cost per lead, jobs won and revenue.
