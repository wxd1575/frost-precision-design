import { afterEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ insert: vi.fn() }) },
}));

import Index from "@/pages/Index";

// jsdom has no IntersectionObserver; framer-motion's whileInView needs one.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", NoopIntersectionObserver);

const renderHome = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Index />
      </MemoryRouter>
    </HelmetProvider>,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe("home page", () => {
  it("renders the hero image with fetchpriority and no unknown-prop warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    renderHome();
    const hero = document.querySelector('img[alt="HVAC systems"]');
    expect(hero?.getAttribute("fetchpriority")).toBe("high");
    const warned = error.mock.calls.some((args) => args.join(" ").includes("fetchPriority"));
    expect(warned).toBe(false);
  });

  it("publishes the Google rating and Germiston address in JSON-LD", async () => {
    renderHome();
    await waitFor(() => {
      expect(document.querySelector('script[type="application/ld+json"]')).not.toBeNull();
    });
    const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(schema.aggregateRating).toMatchObject({ ratingValue: 5, reviewCount: 3 });
    expect(schema.address).toMatchObject({
      streetAddress: "22 Selkirk St",
      addressLocality: "Germiston",
      postalCode: "1401",
      addressCountry: "ZA",
    });
  });
});
