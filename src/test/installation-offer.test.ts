import { describe, expect, it } from "vitest";
import {
  EXTRA_CHARGE_TRIGGERS,
  INCLUDED,
  PAYMENT_OPTIONS,
  PRICING_PATHS,
  PRIORITY_REGIONS,
  PRIORITY_SUBURBS,
  PROMO,
  isPromoActive,
} from "@/data/installation-offer";
import { SERVICE_REGIONS, SERVICE_SUBURBS } from "@/data/service-areas";

describe("installation offer config", () => {
  it("holds the Black Friday end date as an ISO day", () => {
    expect(PROMO.endsOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("is active before the end date and gone on and after it, in South African time", () => {
    expect(isPromoActive(new Date("2026-11-12T10:00:00+02:00"))).toBe(true);
    // 22:30 UTC on 27 November is already 28 November in Johannesburg.
    expect(isPromoActive(new Date("2026-11-27T22:30:00Z"))).toBe(false);
    expect(isPromoActive(new Date("2026-12-01T10:00:00+02:00"))).toBe(false);
  });

  it("prices the two paths separately: the confirmed fitting fee, with a supplied unit on top", () => {
    expect(PRICING_PATHS.map((path) => path.title)).toEqual(["Supply and install", "Installation only"]);
    const [supply, installOnly] = PRICING_PATHS;
    expect(installOnly.from).toBe("R1 800 to R2 500");
    expect(supply.from).toContain("Unit price");
    expect(supply.from).toContain("R1 800 to R2 500");
    for (const path of PRICING_PATHS) expect(path.from).not.toMatch(/\{\{/);
  });

  it("covers every inclusion and extra-charge trigger the brief names, none with invented wording", () => {
    expect(INCLUDED.map((line) => line.label)).toEqual([
      "Brackets and mounting", "Piping", "Electrical connection", "Drainage", "Compliance certificate",
    ]);
    expect(EXTRA_CHARGE_TRIGGERS.map((line) => line.label)).toEqual([
      "Long pipe runs", "Difficult access", "Electrical work beyond the isolator", "Scaffolding",
    ]);
    for (const line of [...INCLUDED, ...EXTRA_CHARGE_TRIGGERS]) expect(line.detail).toMatch(/^\{\{[A-Z0-9_]+\}\}$/);
  });

  it("does not claim a payment arrangement until the client confirms one", () => {
    expect(PAYMENT_OPTIONS.confirmed).toBe(false);
  });

  it("names regions and suburbs that exist in the service area data", () => {
    const regions = SERVICE_REGIONS.map((entry) => entry.region);
    for (const region of PRIORITY_REGIONS) expect(regions).toContain(region);
    // "Pretoria East" is a region in the data rather than a suburb; every other chip is a suburb.
    for (const area of PRIORITY_SUBURBS) expect([...SERVICE_SUBURBS, ...regions]).toContain(area);
  });
});
