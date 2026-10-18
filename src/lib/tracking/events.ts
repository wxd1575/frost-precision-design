import { getAttribution, deriveLeadSource } from "@/lib/tracking/attribution";

export type TrackedEvent =
  | "page_view"
  | "click_call"
  | "click_whatsapp"
  | "click_email"
  | "generate_lead";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes an event to the GTM dataLayer. GTM decides which tags (GA4, Google Ads)
 * receive it, and Consent Mode governs what those tags may store.
 */
export const track = (event: TrackedEvent, params: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  const attribution = getAttribution();
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
    ...attribution,
    lead_source: deriveLeadSource(attribution),
  });
};
