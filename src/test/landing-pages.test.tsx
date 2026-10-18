import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const insert = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ insert }) },
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
  insert.mockReset();
  window.sessionStorage.clear();
  window.dataLayer = [];
  window.history.pushState({}, "", "/aircon-repairs?utm_source=google&utm_medium=cpc&gclid=TEST123");
});

describe("landing page content", () => {
  it("repairs page states the R450 callout on top of the repair", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/not cooling/i);
    expect(screen.getByText(/R450 callout fee .* on top of the repair/i)).toBeInTheDocument();
  });

  it("installation page states installations from R1 800", () => {
    renderPage(<AirconInstallation />, "/aircon-installation");
    expect(screen.getByText(/Installations from R1 800/i)).toBeInTheDocument();
  });

  it("offers a tel: link and a WhatsApp link with prefilled text", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const tel = document.querySelectorAll('a[href="tel:+27845893702"]');
    expect(tel.length).toBeGreaterThan(0);
    const wa = document.querySelector('a[href^="https://wa.me/27845893702?text="]');
    expect(wa).not.toBeNull();
  });
});

describe("landing page tracking", () => {
  it("pushes click_call with attribution when the call button is used", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const callLink = document.querySelector('a[href="tel:+27845893702"]') as HTMLAnchorElement;
    fireEvent.click(callLink);
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({ event: "click_call", gclid: "TEST123", lead_source: "Google Ads – repairs" }),
    );
  });
});

const fillAndSubmit = () => {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Thabo" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Mokoena" } });
  fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "0821234567" } });
  fireEvent.change(screen.getByLabelText("Suburb"), { target: { value: "Boksburg" } });
  fireEvent.change(screen.getByLabelText("Home or business"), { target: { value: "Residential" } });
  fireEvent.click(screen.getByRole("button", { name: /request repair/i }));
};

describe("landing page quote form", () => {
  it("saves the lead with its source and fires generate_lead", async () => {
    insert.mockResolvedValue({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert.mock.calls[0][0]).toMatchObject({
      service_required: "AC Repair",
      suburb: "Boksburg",
      gclid: "TEST123",
      utm_source: "google",
      lead_source: "Google Ads – repairs",
      landing_page: "/aircon-repairs",
      contact_method: "form",
    });
    await waitFor(() =>
      expect(window.dataLayer).toContainEqual(
        expect.objectContaining({ event: "generate_lead", currency: "ZAR", value: 320, suburb: "Boksburg" }),
      ),
    );
  });

  it("still saves the lead if the attribution migration has not been applied yet", async () => {
    insert
      .mockResolvedValueOnce({ error: { code: "PGRST204", message: "Could not find the 'gclid' column" } })
      .mockResolvedValueOnce({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(2));
    expect(insert.mock.calls[1][0]).not.toHaveProperty("gclid");
    expect(insert.mock.calls[1][0]).toMatchObject({ first_name: "Thabo", service_required: "AC Repair" });
  });

  it("does not store anything when the honeypot is filled", async () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fireEvent.change(document.querySelector('input[name="website"]') as HTMLInputElement, {
      target: { value: "http://spam.example" },
    });
    fillAndSubmit();
    await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
    expect(insert).not.toHaveBeenCalled();
  });
});
