const STORAGE_KEY = "frost_attribution";

const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

type CampaignParam = (typeof CAMPAIGN_PARAMS)[number];

export type Attribution = Partial<Record<CampaignParam, string>> & {
  landing_page: string;
  referrer: string;
};

const readStored = (): Attribution | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
};

const writeStored = (value: Attribution) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); attribution is best effort.
  }
};

const externalReferrer = (): string => {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).host === window.location.host ? "" : document.referrer;
  } catch {
    return "";
  }
};

/**
 * Records where the visitor came from. The first touch of a session is kept,
 * unless a later page load carries new campaign parameters (a fresh ad click).
 */
export const captureAttribution = (): Attribution => {
  const params = new URLSearchParams(window.location.search);
  const campaign: Partial<Record<CampaignParam, string>> = {};
  for (const key of CAMPAIGN_PARAMS) {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 200);
  }

  const stored = readStored();
  if (stored && Object.keys(campaign).length === 0) return stored;

  const attribution: Attribution = {
    ...campaign,
    landing_page: window.location.pathname,
    referrer: externalReferrer() || stored?.referrer || "",
  };
  writeStored(attribution);
  return attribution;
};

export const getAttribution = (): Attribution => readStored() ?? captureAttribution();

const serviceFromPath = (path: string) => {
  if (path.includes("repair")) return "repairs";
  if (path.includes("installation")) return "installation";
  return null;
};

/** Human-readable source label stored on each lead, e.g. "Google Ads – repairs". */
export const deriveLeadSource = (a: Attribution): string => {
  const medium = a.utm_medium?.toLowerCase();
  const isPaid = Boolean(a.gclid || a.gbraid || a.wbraid) || medium === "cpc" || medium === "ppc";
  if (isPaid) {
    const service = serviceFromPath(a.landing_page);
    return service ? `Google Ads – ${service}` : "Google Ads";
  }
  if (a.utm_source) return a.utm_medium ? `${a.utm_source} / ${a.utm_medium}` : a.utm_source;
  if (a.referrer) {
    try {
      return `Referral – ${new URL(a.referrer).host}`;
    } catch {
      return "Referral";
    }
  }
  return "Direct";
};
