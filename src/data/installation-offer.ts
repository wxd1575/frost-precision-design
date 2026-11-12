// Everything on /aircon-installation that the client sets or changes lives here: prices, inclusions,
// payment terms, lead time and the Black Friday holding block. The page layout never needs editing for these.
//
// Anything still written as {{PLACEHOLDER}} is hidden from visitors in production builds. It shows with a
// dashed outline in dev, or in a preview build with VITE_SHOW_PLACEHOLDERS=true. To fill one in, replace the
// whole {{...}} text with the real wording. Nothing here may be guessed.

export interface PricingPath {
  title: string;
  /** Entry price for this path, written out in full, e.g. "From R2 400". */
  from: string;
  blurb: string;
}

/**
 * The two paths the page offers, priced separately. Confirmed by the client: installations quote between
 * R1 800 and R2 500, and that is the fitting fee only. A supplied unit is priced on top.
 */
export const PRICING_PATHS: PricingPath[] = [
  {
    title: "Supply and install",
    from: "Unit price + R1 800 to R2 500 fitting",
    blurb: "We supply the unit and install it. The unit is quoted on top of the fitting fee.",
  },
  {
    title: "Installation only",
    from: "R1 800 to R2 500",
    blurb: "The fitting fee for a unit you already have.",
  },
];

export interface InclusionLine {
  label: string;
  /** What exactly is covered. Replace the placeholder with the client's real wording. */
  detail: string;
}

export const INCLUDED: InclusionLine[] = [
  { label: "Brackets and mounting", detail: "{{INCLUDED_BRACKETS}}" },
  { label: "Piping", detail: "{{INCLUDED_PIPING_AND_LENGTH}}" },
  { label: "Electrical connection", detail: "{{INCLUDED_ELECTRICAL}}" },
  { label: "Drainage", detail: "{{INCLUDED_DRAINAGE}}" },
  { label: "Compliance certificate", detail: "{{INCLUDED_COMPLIANCE_CERTIFICATE}}" },
];

/** What triggers an extra charge, so no quote is a surprise on site. */
export const EXTRA_CHARGE_TRIGGERS: InclusionLine[] = [
  { label: "Long pipe runs", detail: "{{EXTRA_LONG_PIPE_RUNS}}" },
  { label: "Difficult access", detail: "{{EXTRA_DIFFICULT_ACCESS}}" },
  { label: "Electrical work beyond the isolator", detail: "{{EXTRA_ELECTRICAL}}" },
  { label: "Scaffolding", detail: "{{EXTRA_SCAFFOLDING}}" },
];

/**
 * Payment arrangements. Leave `confirmed` false until the client confirms that terms or layby exist.
 * No credit, finance or instalment wording may appear on the page while it is false.
 */
export const PAYMENT_OPTIONS = {
  confirmed: false,
  heading: "Payment options",
  text: "{{PAYMENT_TERMS}}",
};

/** Current wait for an installation date. November to January is peak season. */
export const LEAD_TIME = {
  label: "Current installation lead time",
  value: "{{CURRENT_LEAD_TIME}}",
};

/**
 * Black Friday holding block, shown above the quote form. Deal terms are set on 20 November and the
 * offer runs to roughly 27 November. To go live with the real offer, edit headline and body. To remove
 * it, set enabled to false (it also hides itself on endsOn).
 */
export const PROMO = {
  enabled: true,
  headline: "Black Friday installation deal lands 20 November",
  body: "The offer runs to around 27 November. Leave your details below and we will send you the deal when it is released.",
  /** First day the block is no longer shown, as YYYY-MM-DD in South African time. */
  endsOn: "2026-11-28",
};

const johannesburgToday = (now: Date) => now.toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });

export const isPromoActive = (now: Date = new Date()) => PROMO.enabled && johannesburgToday(now) < PROMO.endsOn;

/** Regions the ads target, in the order they should lead the areas list. */
export const PRIORITY_REGIONS = [
  "Centurion & Irene",
  "Midrand & Kyalami",
  "Kempton Park & Edenvale",
  "Pretoria East",
  "Johannesburg North",
  "Sandton & Bryanston",
];

/** Suburbs named in the ads. Shown as quick-read chips above the full list. */
export const PRIORITY_SUBURBS = ["Centurion", "Midrand", "Kempton Park", "Pretoria East", "Randburg", "Fourways", "Sandton"];

/** How many leading regions start expanded. One keeps the form and the rest of the page close on a phone. */
export const OPEN_REGION_COUNT = 1;
