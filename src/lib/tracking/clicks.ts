import { supabase } from "@/lib/supabase";
import { deriveLeadSource, getAttribution } from "@/lib/tracking/attribution";

export type ClickKind = "call" | "whatsapp" | "email";

/**
 * Stores the gclid behind a call, WhatsApp or email tap so the conversion can be
 * imported into Google Ads later.
 *
 * Consent Mode defaults ad_storage to 'denied', so Google only attributes a tap
 * for visitors who accept cookies. Without this row the rest are invisible, and
 * Smart Bidding optimises against a signal that is missing most of the response.
 *
 * Deliberately not awaited: tel: and wa.me links must open immediately. Both keep
 * the page alive — WhatsApp links carry target="_blank" and tel: hands off to the
 * dialer — so the request completes after the handler returns. Failure is silent,
 * because a lost attribution row must never cost the visitor a click.
 */
export const recordClick = (kind: ClickKind, placement: string): void => {
  try {
    const attribution = getAttribution();
    const pending = supabase.from("click_events").insert({
      kind,
      placement,
      page_path: window.location.pathname,
      lead_source: deriveLeadSource(attribution),
      utm_source: attribution.utm_source ?? null,
      utm_medium: attribution.utm_medium ?? null,
      utm_campaign: attribution.utm_campaign ?? null,
      utm_term: attribution.utm_term ?? null,
      utm_content: attribution.utm_content ?? null,
      gclid: attribution.gclid ?? attribution.gbraid ?? attribution.wbraid ?? null,
      landing_page: attribution.landing_page,
      referrer: attribution.referrer || null,
    });
    // Promise.resolve adopts the query builder's thenable and swallows the outcome.
    void Promise.resolve(pending).catch(() => {});
  } catch {
    // Attribution is best effort; storage or network trouble must not block the click.
  }
};
