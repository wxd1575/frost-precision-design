/**
 * Analytics layer for Frost & Ice Aircon.
 *
 * Everything goes through the dataLayer so that Google Tag Manager
 * (GTM-K58HR5MF) is the single place where tags are configured. Nothing in
 * this file talks to GA4 or Google Ads directly.
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const ATTRIBUTION_KEY = "fia-attribution";

/** Query parameters worth keeping for attribution reporting. */
const ATTRIBUTION_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>> & {
  landing_page?: string;
  initial_referrer?: string;
};

/**
 * Capture click IDs and UTMs on the first page of the session and keep them
 * for the rest of it, so a conversion three pages later still carries the
 * campaign that brought the visitor in.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}");
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const incoming: Attribution = {};

  ATTRIBUTION_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) incoming[key] = value;
  });

  // A fresh click ID or UTM set means a new campaign touch: let it win.
  const hasNewTouch = Object.keys(incoming).length > 0;
  const attribution: Attribution = hasNewTouch
    ? {
        ...incoming,
        landing_page: window.location.pathname + window.location.search,
        initial_referrer: document.referrer || "(direct)",
      }
    : {
        landing_page: window.location.pathname + window.location.search,
        initial_referrer: document.referrer || "(direct)",
        ...stored,
      };

  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Private mode or storage disabled: carry on without persistence.
  }

  return attribution;
}

/** Push an event onto the dataLayer with attribution and page context attached. */
export function push(event: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...captureAttribution(),
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    page_referrer: document.referrer || "(direct)",
    ...event,
  });
}

/** Virtual page view for the single-page app. */
export function trackPageView(): void {
  push({ event: "page_view" });
}

/** Quote form successfully submitted. */
export function trackGenerateLead(details: {
  service_type?: string;
  client_type?: string;
  urgency?: string;
  value?: number;
  currency?: string;
}): void {
  push({
    event: "generate_lead",
    lead_source: "quote_form",
    currency: details.currency ?? "ZAR",
    value: details.value ?? 1,
    service_type: details.service_type,
    client_type: details.client_type,
    urgency: details.urgency,
  });
}

/**
 * One delegated listener covers every call and WhatsApp link on the site,
 * including links added later, so nothing has to be tagged by hand.
 */
export function initClickTracking(): () => void {
  if (typeof document === "undefined") return () => undefined;

  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const link = target?.closest?.("a");
    if (!link) return;

    const href = link.getAttribute("href") ?? "";

    if (href.startsWith("tel:")) {
      push({
        event: "click_call",
        link_url: href,
        phone_number: href.replace("tel:", ""),
        link_text: link.textContent?.trim().slice(0, 100) ?? "",
        link_location: describeLocation(link),
      });
      return;
    }

    if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
      push({
        event: "click_whatsapp",
        link_url: href,
        link_text: link.textContent?.trim().slice(0, 100) ?? "",
        link_location: describeLocation(link),
      });
    }
  };

  document.addEventListener("click", handler, { capture: true });
  return () => document.removeEventListener("click", handler, { capture: true });
}

/** Rough position of the clicked link, for reporting which CTA works. */
function describeLocation(link: HTMLElement): string {
  if (link.closest("nav")) return "navbar";
  if (link.closest("footer")) return "footer";
  if (link.classList.contains("fixed")) return "floating_button";
  return "body";
}
