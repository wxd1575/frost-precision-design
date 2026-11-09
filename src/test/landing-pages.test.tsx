import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const insert = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ insert }) },
}));

const toast = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast, toasts: [], dismiss: vi.fn() }),
  toast,
}));

// Visitors never see unfilled {{PLACEHOLDER}} text; dev and preview builds do. Tests switch between the two.
const placeholders = vi.hoisted(() => ({ show: false }));
vi.mock("@/components/landing/placeholders", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/landing/placeholders")>();
  return { ...actual, shouldShowPlaceholders: () => placeholders.show };
});

import AirconRepairs from "@/pages/AirconRepairs";
import AirconInstallation from "@/pages/AirconInstallation";
import QuoteForm from "@/components/QuoteForm";

const renderPage = (page: JSX.Element, path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>
    </HelmetProvider>,
  );

const FAULTS = [
  "Aircon not blowing cold air",
  "Aircon leaking water",
  "Noisy aircon unit",
  "Aircon not turning on",
  "Regas and gas refill",
  "Frozen evaporator coil",
  "Blocked drainage",
  "Major and minor services",
];

const PRICING_COPY = "Aircon regas from R850. A R450 call-out applies and is quoted upfront.";

const pageText = () => document.body.textContent ?? "";
const follows = (earlier: Element, later: Element) =>
  Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);

beforeEach(() => {
  insert.mockReset();
  toast.mockReset();
  placeholders.show = false;
  window.sessionStorage.clear();
  window.dataLayer = [];
  window.history.pushState({}, "", "/aircon-repairs?utm_source=google&utm_medium=cpc&gclid=TEST123");
});

describe("landing page content", () => {
  it("repairs page keeps its headline", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Aircon Not Cooling? Get It Fixed.");
  });

  it("repairs page states the advertised price in the ad's own wording", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const pricing = Array.from(document.querySelectorAll("p")).find((p) => p.textContent === PRICING_COPY);
    expect(pricing).toBeDefined();
  });

  it("puts the price and the call buttons right after the headline, before the supporting copy", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const heading = screen.getByRole("heading", { level: 1 });
    const pricing = Array.from(document.querySelectorAll("p")).find((p) => p.textContent === PRICING_COPY)!;
    const call = document.querySelector('main a[href="tel:+27845893702"]')!;
    const subheading = screen.getByText(/Qualified technicians for aircon repairs/);

    expect(follows(heading, pricing)).toBe(true);
    expect(follows(pricing, call)).toBe(true);
    expect(follows(call, subheading)).toBe(true);
  });

  it("explains what the call-out fee buys instead of only stating the cost", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(
      screen.getByText(
        "R450 call-out, which covers a full diagnostic by a qualified technician. We quote the repair before any work starts.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/charged on top of the repair/i)).not.toBeInTheDocument();
  });

  it("installation page is unchanged: from R1 800, and its original hero order", () => {
    renderPage(<AirconInstallation />, "/aircon-installation");
    expect(screen.getByText(/Installations from R1 800/i)).toBeInTheDocument();
    expect(screen.queryByText(/Aircon regas from R850/)).not.toBeInTheDocument();
    const subheading = screen.getByText(/Supply-and-install or installation-only/);
    const call = document.querySelector('main a[href="tel:+27845893702"]')!;
    expect(follows(subheading, call)).toBe(true);
  });

  it("offers a tel: link and a WhatsApp link with prefilled text", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const tel = document.querySelectorAll('a[href="tel:+27845893702"]');
    expect(tel.length).toBeGreaterThan(0);
    const wa = document.querySelector('a[href^="https://wa.me/27845893702?text="]');
    expect(wa).not.toBeNull();
  });

  it("keeps the source tag on every WhatsApp link, including the sticky bar", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]'));
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(decodeURIComponent(link.href)).toContain("(from /aircon-repairs)");
    }
  });

  it("has substantially more copy than the original thin page", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(document.querySelector("main")!.textContent!.length).toBeGreaterThan(3500);
    expect(screen.getByText("What happens on a call-out")).toBeInTheDocument();
    expect(screen.getByText("Quick checks before you call")).toBeInTheDocument();
  });
});

describe("placeholders for content the client has not supplied", () => {
  it("never shows a {{PLACEHOLDER}} or an empty section to visitors", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(pageText()).not.toMatch(/\{\{|\}\}/);
    expect(screen.queryByText("Why Book With Us")).not.toBeInTheDocument();
    expect(screen.queryByText("Our Work")).not.toBeInTheDocument();
    expect(screen.queryByText("How long it takes")).not.toBeInTheDocument();
    expect(screen.queryByText("Brands we service")).not.toBeInTheDocument();
    expect(screen.queryByText("What is not covered")).not.toBeInTheDocument();
  });

  it("shows every placeholder to the client in dev and preview builds", () => {
    placeholders.show = true;
    renderPage(<AirconRepairs />, "/aircon-repairs");
    expect(screen.getByText("Why Book With Us")).toBeInTheDocument();
    for (const token of [
      "{{SAQCC_NUMBER}}",
      "{{TURNAROUND}}",
      "{{BRANDS_SERVICED}}",
      "{{NOT_COVERED}}",
    ]) {
      expect(screen.getByText(token)).toBeInTheDocument();
    }
    expect(screen.getByText("{{GOOGLE_RATING}} from {{GOOGLE_REVIEW_COUNT}} Google reviews")).toBeInTheDocument();
    expect(screen.getByText("{{YEARS_IN_OPERATION}} years in operation")).toBeInTheDocument();
    expect(screen.getByText("{{GUARANTEE_PERIOD}} workmanship guarantee")).toBeInTheDocument();
    expect(screen.getAllByText(/TODO: real photo/)).toHaveLength(3);
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

const fillForm = () => {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Thabo" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Mokoena" } });
  fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "0821234567" } });
  fireEvent.change(screen.getByLabelText("Suburb"), { target: { value: "Boksburg" } });
  fireEvent.change(screen.getByLabelText("Home or business"), { target: { value: "Residential" } });
};
const submit = () => fireEvent.click(screen.getByRole("button", { name: /request repair/i }));
const fillAndSubmit = () => {
  fillForm();
  submit();
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

  it("offers the eight listed faults in a dropdown", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    const select = screen.getByLabelText("What is the problem") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toEqual(["", ...FAULTS]);
  });

  it("saves the selected fault and the form it came from on the lead", async () => {
    insert.mockResolvedValue({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("What is the problem"), { target: { value: "Aircon leaking water" } });
    submit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert.mock.calls[0][0]).toMatchObject({
      fault: "Aircon leaking water",
      form_location: "landing_repairs",
    });
  });

  it("leaves the fault empty when the visitor does not choose one", async () => {
    insert.mockResolvedValue({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert.mock.calls[0][0]).toMatchObject({ fault: null, form_location: "landing_repairs" });
  });

  it("includes the fault in the default message when the visitor writes none", async () => {
    insert.mockResolvedValue({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("What is the problem"), { target: { value: "Noisy aircon unit" } });
    submit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert.mock.calls[0][0].message).toContain("Noisy aircon unit");
  });

  it("marks first name, last name, phone, suburb and client type as required in the markup", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    for (const label of ["First name", "Last name", "Phone number", "Suburb", "Home or business"]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByLabelText("Email address")).not.toBeRequired();
    expect(screen.getByLabelText("What is the problem")).not.toBeRequired();
  });

  it("does not submit a blank form and says what is missing", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    submit();

    expect(insert).not.toHaveBeenCalled();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(screen.getByText("Tell us your suburb")).toBeInTheDocument();
  });

  it("does not submit when only the suburb is missing", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("Suburb"), { target: { value: "   " } });
    submit();

    expect(insert).not.toHaveBeenCalled();
    expect(screen.getByText("Tell us your suburb")).toBeInTheDocument();
  });

  it("rejects a phone number the database would reject", () => {
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "abc" } });
    submit();

    expect(insert).not.toHaveBeenCalled();
    expect(screen.getByText("Enter a valid phone number")).toBeInTheDocument();
  });

  it("accepts a phone number written with spaces and a country code", async () => {
    insert.mockResolvedValue({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "+27 82 123 4567" } });
    submit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
  });

  it("still saves the lead if the attribution migration has not been applied yet", async () => {
    insert
      .mockResolvedValueOnce({ error: { code: "PGRST204", message: "Could not find the 'gclid' column" } })
      .mockResolvedValueOnce({ error: { code: "PGRST204", message: "Could not find the 'fault' column" } })
      .mockResolvedValueOnce({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(3));
    expect(insert.mock.calls[2][0]).not.toHaveProperty("gclid");
    expect(insert.mock.calls[2][0]).not.toHaveProperty("fault");
    expect(insert.mock.calls[2][0]).toMatchObject({ first_name: "Thabo", service_required: "AC Repair" });
  });

  it("keeps attribution and the fault if only the fault migration is missing", async () => {
    insert
      .mockResolvedValueOnce({ error: { code: "PGRST204", message: "Could not find the 'fault' column" } })
      .mockResolvedValueOnce({ error: null });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillForm();
    fireEvent.change(screen.getByLabelText("What is the problem"), { target: { value: "Frozen evaporator coil" } });
    fireEvent.change(screen.getByPlaceholderText("Tell us more (optional)"), { target: { value: "Ice on the unit" } });
    submit();

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(2));
    const retried = insert.mock.calls[1][0];
    expect(retried).not.toHaveProperty("fault");
    expect(retried).not.toHaveProperty("form_location");
    expect(retried).toMatchObject({ gclid: "TEST123", lead_source: "Google Ads – repairs" });
    expect(retried.message).toBe("Ice on the unit\nFault: Frozen evaporator coil");
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

  it("shows a friendly message when the database rate limit rejects the lead", async () => {
    insert.mockResolvedValue({ error: { code: "P0001", message: "contact_guard:rate_limited" } });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    const shown = toast.mock.calls[0][0];
    expect(shown.variant).toBe("destructive");
    expect(shown.description).toMatch(/received several requests/i);
    expect(shown.description).not.toMatch(/contact_guard/);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["contact_guard:missing_suburb", /tell us your suburb/i],
    ["contact_guard:missing_first_name", /enter your first name/i],
  ])("shows a friendly message when the database rejects a missing field (%s)", async (message, expected) => {
    insert.mockResolvedValue({ error: { code: "P0001", message } });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    expect(toast.mock.calls[0][0].description).toMatch(expected);
    expect(toast.mock.calls[0][0].description).not.toMatch(/contact_guard/);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("hides raw database errors and does not retry unrelated failures", async () => {
    insert.mockResolvedValue({ error: { code: "XX000", message: "internal column index corrupted" } });
    renderPage(<AirconRepairs />, "/aircon-repairs");
    fillAndSubmit();

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    const shown = toast.mock.calls[0][0];
    expect(shown.description).toMatch(/couldn't send your request/i);
    expect(shown.description).not.toMatch(/corrupted/);
    expect(insert).toHaveBeenCalledTimes(1);
  });
});

describe("full contact form", () => {
  it("is unchanged: no fault dropdown, suburb stays optional, email and message stay required", () => {
    render(<QuoteForm formLocation="contact_page" onSuccess={vi.fn()} />);
    expect(screen.queryByLabelText("What is the problem")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Suburb")).not.toBeRequired();
    expect(screen.getByLabelText("Email address")).toBeRequired();
    expect(screen.getByLabelText("Tell us more")).toBeRequired();
    expect(screen.getByLabelText("First name")).toBeRequired();
    expect(screen.getByLabelText("Phone number")).toBeRequired();
  });
});
