export interface ContactRecord {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  client_type: string | null;
  service_required: string | null;
  address: string | null;
  suburb: string | null;
  urgency: string | null;
  message: string | null;
  contact_method: string | null;
  lead_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  landing_page: string | null;
  notified_at: string | null;
}

export interface OutgoingEmail {
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isValidEmail(value: string | null | undefined): value is string {
  return !!value && value.length <= 254 && EMAIL_PATTERN.test(value.trim());
}

// Strip CR/LF so customer-supplied text can never inject mail headers.
function headerSafe(value: string | null | undefined): string {
  return (value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function row(label: string, value: string | null | undefined): string {
  const text = (value ?? "").trim();
  return `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0">${escapeHtml(text || "N/A")}</td></tr>`;
}

export function buildNotification(record: ContactRecord, notifyTo: string): OutgoingEmail {
  const name = headerSafe(`${record.first_name ?? ""} ${record.last_name ?? ""}`) || "Unknown";
  const service = headerSafe(record.service_required) || "Enquiry";
  const customerEmail = record.email?.trim();

  const html = `
    <h2>New Contact Submission</h2>
    <table style="border-collapse:collapse">
      ${row("Name", name)}
      ${row("Email", record.email)}
      ${row("Phone", record.phone)}
      ${row("Client type", record.client_type)}
      ${row("Service required", record.service_required)}
      ${row("Address", record.address)}
      ${row("Suburb", record.suburb)}
      ${row("Urgency", record.urgency)}
      ${row("Contact method", record.contact_method)}
    </table>
    <p><strong>Message:</strong><br/>${escapeHtml(record.message || "N/A").replace(/\n/g, "<br/>")}</p>
    <h3>Attribution</h3>
    <table style="border-collapse:collapse">
      ${row("Lead source", record.lead_source)}
      ${row("UTM source", record.utm_source)}
      ${row("UTM medium", record.utm_medium)}
      ${row("UTM campaign", record.utm_campaign)}
      ${row("UTM term", record.utm_term)}
      ${row("UTM content", record.utm_content)}
      ${row("GCLID", record.gclid)}
      ${row("Landing page", record.landing_page)}
    </table>`;

  return {
    to: [notifyTo],
    subject: `New Lead: ${name} - ${service}`,
    html,
    ...(isValidEmail(customerEmail) ? { reply_to: customerEmail } : {}),
  };
}

export function buildConfirmation(record: ContactRecord, replyTo: string): OutgoingEmail | null {
  const customerEmail = record.email?.trim();
  if (record.contact_method === "call" || !isValidEmail(customerEmail)) return null;

  const firstName = headerSafe(record.first_name) || "there";
  const html = `
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>Thank you for contacting Frost Ice Aircon. We have received your request and one of our team will be in touch shortly.</p>
    <p>If your matter is urgent, please call us or reply to this email.</p>
    <p>Kind regards,<br/>Frost Ice Aircon</p>`;

  return {
    to: [customerEmail],
    subject: "We received your request - Frost Ice Aircon",
    html,
    reply_to: replyTo,
  };
}

// Admin-logged phone calls insert rows too; those should not email the business.
export function shouldNotifyBusiness(record: ContactRecord): boolean {
  return record.contact_method !== "call";
}
