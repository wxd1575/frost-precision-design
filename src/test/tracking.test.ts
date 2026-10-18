import { beforeEach, describe, expect, it } from "vitest";
import { captureAttribution, deriveLeadSource, getAttribution } from "@/lib/tracking/attribution";
import { track } from "@/lib/tracking/events";
import { leadValueZar, whatsappUrl } from "@/lib/tracking/config";

const visit = (path: string) => window.history.pushState({}, "", path);

beforeEach(() => {
  window.sessionStorage.clear();
  window.dataLayer = [];
  visit("/");
});

describe("captureAttribution", () => {
  it("reads UTM parameters and the click id from the landing URL", () => {
    visit("/aircon-repairs?utm_source=google&utm_medium=cpc&utm_campaign=frostice&utm_term=aircon%20repair&gclid=TEST123");
    const a = captureAttribution();
    expect(a).toMatchObject({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "frostice",
      utm_term: "aircon repair",
      gclid: "TEST123",
      landing_page: "/aircon-repairs",
    });
  });

  it("keeps the first touch when later pages carry no campaign parameters", () => {
    visit("/aircon-repairs?gclid=FIRST");
    captureAttribution();
    visit("/contact");
    expect(captureAttribution().gclid).toBe("FIRST");
    expect(getAttribution().landing_page).toBe("/aircon-repairs");
  });

  it("replaces the stored touch when a new ad click arrives", () => {
    visit("/aircon-repairs?gclid=FIRST");
    captureAttribution();
    visit("/aircon-installation?gclid=SECOND");
    const a = captureAttribution();
    expect(a.gclid).toBe("SECOND");
    expect(a.landing_page).toBe("/aircon-installation");
  });
});

describe("deriveLeadSource", () => {
  it("labels paid clicks by the service page", () => {
    expect(deriveLeadSource({ gclid: "x", landing_page: "/aircon-repairs", referrer: "" })).toBe("Google Ads – repairs");
    expect(deriveLeadSource({ utm_medium: "cpc", landing_page: "/aircon-installation", referrer: "" })).toBe(
      "Google Ads – installation",
    );
  });

  it("falls back to UTM, referrer, then direct", () => {
    expect(deriveLeadSource({ utm_source: "facebook", utm_medium: "social", landing_page: "/", referrer: "" })).toBe(
      "facebook / social",
    );
    expect(deriveLeadSource({ landing_page: "/", referrer: "https://www.google.com/" })).toBe(
      "Referral – www.google.com",
    );
    expect(deriveLeadSource({ landing_page: "/", referrer: "" })).toBe("Direct");
  });
});

describe("track", () => {
  it("pushes the event with attribution and lead source merged in", () => {
    visit("/aircon-repairs?utm_source=google&utm_medium=cpc&gclid=TEST123");
    captureAttribution();
    track("click_call", { placement: "landing_hero" });
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer![0]).toMatchObject({
      event: "click_call",
      placement: "landing_hero",
      gclid: "TEST123",
      lead_source: "Google Ads – repairs",
    });
  });
});

describe("config helpers", () => {
  it("prefills and encodes the WhatsApp message", () => {
    const url = whatsappUrl("Hi Frostice, quote please (from /aircon-repairs)");
    expect(url.startsWith("https://wa.me/27845893702?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toBe("Hi Frostice, quote please (from /aircon-repairs)");
  });

  it("values a lead at average job revenue times the close rate", () => {
    expect(leadValueZar("repair")).toBe(320);
    expect(leadValueZar("installation")).toBe(430);
  });
});
