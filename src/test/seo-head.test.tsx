import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ insert: vi.fn() }) },
}));

import AirconRepairs from "@/pages/AirconRepairs";
import AirconInstallation from "@/pages/AirconInstallation";

const renderPage = (page: JSX.Element, path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>
    </HelmetProvider>,
  );

beforeEach(() => {
  document.title = "";
  document.head.querySelectorAll("[data-rh]").forEach((el) => el.remove());
});

/**
 * Helmet writes the head as a side effect, so a broken provider, a dead
 * dispatcher or a deferred commit that never runs all show up as a head left
 * on the index.html defaults. These assert the commit happened by the time
 * render() returns, which is what defer={false} buys us.
 */
describe("landing page head tags", () => {
  it("gives the repairs page its own title, canonical and schema", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");

    expect(document.title).toBe(
      "Aircon Repairs in Gauteng | Frosty Ice Aircon and Refrigeration",
    );
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://frosticeaircon.co.za/aircon-repairs");
    expect(
      document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ).toBe("Aircon Repairs in Gauteng | Frosty Ice Aircon and Refrigeration");

    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    expect(JSON.parse(schema!.textContent ?? "{}")["@type"]).toBe("HVACBusiness");
  });

  it("gives the installation page a different title and canonical", () => {
    renderPage(<AirconInstallation />, "/aircon-installation");

    expect(document.title).toBe(
      "Aircon Installation in Gauteng | Frosty Ice Aircon and Refrigeration",
    );
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://frosticeaircon.co.za/aircon-installation");
  });

  it("leaves one description and one canonical, not a duplicate of each", () => {
    renderPage(<AirconInstallation />, "/aircon-installation");

    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });
});
