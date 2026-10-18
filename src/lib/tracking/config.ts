export const SITE_URL = "https://frosticeaircon.co.za";

export const PHONE_E164 = "+27845893702";
export const PHONE_DISPLAY = "+27 84 589 3702";
export const PHONE_HREF = `tel:${PHONE_E164}`;
export const EMAIL = "info@frosticeaircon.co.za";
export const EMAIL_HREF = `mailto:${EMAIL}`;

const WHATSAPP_NUMBER = PHONE_E164.replace("+", "");

export const whatsappUrl = (message?: string) =>
  message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Expected value of one enquiry in ZAR, from the Google Ads strategy:
 * average job revenue x the one-in-five benchmark close rate.
 * Replace the close rate with the real figure after month one.
 */
export const CLOSE_RATE = 0.2;
export const AVG_JOB_REVENUE_ZAR = {
  repair: 1600,
  installation: 2150,
  other: 1600,
} as const;

export type ServiceKind = keyof typeof AVG_JOB_REVENUE_ZAR;

export const leadValueZar = (service: ServiceKind) =>
  Math.round(AVG_JOB_REVENUE_ZAR[service] * CLOSE_RATE);
