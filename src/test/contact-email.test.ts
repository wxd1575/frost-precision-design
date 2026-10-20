import { describe, expect, it } from "vitest";
import {
  buildConfirmation,
  buildNotification,
  escapeHtml,
  isValidEmail,
  shouldNotifyBusiness,
  type ContactRecord,
} from "../../supabase/functions/send-contact-email/email";

const base: ContactRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  first_name: "Jo",
  last_name: "Smith",
  email: "jo@example.com",
  phone: "0821234567",
  client_type: "Residential",
  service_required: "Installation",
  address: "1 Main Rd",
  suburb: "Germiston",
  urgency: "Standard",
  message: "Need a quote",
  contact_method: "form",
  lead_source: "google_ads",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "install",
  utm_term: null,
  utm_content: null,
  gclid: "abc123",
  landing_page: "/aircon-installation",
  notified_at: null,
};

describe("contact email builders", () => {
  it("sends the business notification to the supplied recipient with customer reply-to", () => {
    const mail = buildNotification(base, "sales@frosticeaircon.co.za");
    expect(mail.to).toEqual(["sales@frosticeaircon.co.za"]);
    expect(mail.reply_to).toBe("jo@example.com");
    expect(mail.subject).toBe("New Lead: Jo Smith - Installation");
    expect(mail.html).toContain("Germiston");
    expect(mail.html).toContain("abc123");
  });

  it("omits reply-to when the customer email is blank or invalid", () => {
    expect(buildNotification({ ...base, email: "" }, "s@x.co").reply_to).toBeUndefined();
    expect(buildNotification({ ...base, email: "not-an-email" }, "s@x.co").reply_to).toBeUndefined();
  });

  it("escapes HTML and strips header injection from customer text", () => {
    const evil = {
      ...base,
      first_name: "<img src=x onerror=1>",
      message: "<script>alert(1)</script>",
      service_required: "A\r\nBcc: x@y.com",
    };
    const mail = buildNotification(evil, "s@x.co");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<img");
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(escapeHtml(`"'&<>`)).toBe("&quot;&#39;&amp;&lt;&gt;");
  });

  it("builds a confirmation to the customer with sales as reply-to", () => {
    const mail = buildConfirmation(base, "sales@frosticeaircon.co.za");
    expect(mail?.to).toEqual(["jo@example.com"]);
    expect(mail?.reply_to).toBe("sales@frosticeaircon.co.za");
    expect(mail?.html).toContain("Hi Jo");
  });

  it("skips the confirmation without a valid email or for logged calls", () => {
    expect(buildConfirmation({ ...base, email: "" }, "s@x.co")).toBeNull();
    expect(buildConfirmation({ ...base, email: "bad" }, "s@x.co")).toBeNull();
    expect(buildConfirmation({ ...base, contact_method: "call" }, "s@x.co")).toBeNull();
  });

  it("does not notify the business for admin-logged calls", () => {
    expect(shouldNotifyBusiness(base)).toBe(true);
    expect(shouldNotifyBusiness({ ...base, contact_method: "call" })).toBe(false);
  });

  it("validates email addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("a b@c.co")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});
