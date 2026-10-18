import { describe, expect, it } from "vitest";
import { SERVICE_REGIONS, SERVICE_SUBURBS } from "@/data/service-areas";

describe("service areas", () => {
  it("lists every suburb only once, even when a region repeats it", () => {
    const lowered = SERVICE_SUBURBS.map((s) => s.toLowerCase());
    expect(new Set(lowered).size).toBe(lowered.length);
    expect(SERVICE_SUBURBS.filter((s) => s === "Thokoza")).toHaveLength(1);
  });

  it("keeps the main service areas and drops the non-suburb notes", () => {
    for (const name of ["Boksburg", "Benoni", "Germiston", "Kempton Park", "Edenvale", "Alberton", "Springs"]) {
      expect(SERVICE_SUBURBS).toContain(name);
    }
    expect(SERVICE_SUBURBS.some((s) => /fringe|Ekurhuleni NU/i.test(s))).toBe(false);
  });

  it("has no empty region and a sorted autocomplete list", () => {
    expect(SERVICE_REGIONS.every((r) => r.suburbs.length > 0)).toBe(true);
    const sorted = [...SERVICE_SUBURBS].sort((a, b) => a.localeCompare(b, "en"));
    expect(SERVICE_SUBURBS).toEqual(sorted);
  });
});
