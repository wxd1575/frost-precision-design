import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { getAttribution, deriveLeadSource } from "@/lib/tracking/attribution";
import { track } from "@/lib/tracking/events";
import { leadValueZar } from "@/lib/tracking/config";
import { SERVICE_SUBURBS } from "@/data/service-areas";
import type { ServiceKind } from "@/lib/tracking/config";

// Same shape the database guard accepts for anonymous inserts (7 to 15 digits, optional leading +).
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

const baseFields = {
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20)
    .refine((value) => PHONE_PATTERN.test(value.replace(/[^0-9+]/g, "")), "Enter a valid phone number"),
  suburb: z.string().trim().max(100),
  clientType: z.string().min(1, "Select a client type"),
  serviceRequired: z.string().min(1, "Select a service"),
  urgency: z.string().optional(),
  fault: z.string().max(100).optional(),
};

const fullSchema = z.object({
  ...baseFields,
  email: z.string().trim().email("Invalid email address").max(255),
  address: z.string().max(200).optional(),
  message: z.string().trim().min(1, "Tell us about your requirements").max(2000),
});

// Landing pages keep the form short: email and message are optional, suburb is required.
const compactSchema = z.object({
  ...baseFields,
  suburb: z.string().trim().min(1, "Tell us your suburb").max(100),
  email: z.union([z.literal(""), z.string().trim().email("Invalid email address").max(255)]),
  address: z.string().max(200).optional(),
  message: z.string().trim().max(2000),
});

type QuoteFormValues = z.infer<typeof fullSchema>;

const initialValues: QuoteFormValues = {
  firstName: "", lastName: "", email: "", phone: "", suburb: "",
  clientType: "", serviceRequired: "", address: "", urgency: "", fault: "", message: "",
};

const clientTypes = ["Residential", "Commercial", "Industrial", "Transport"];
const serviceOptions = [
  "AC Installation", "AC Repair", "AC Service", "Gas Filling", "Cold Room",
  "Industrial Refrigeration", "Domestic Fridge", "Regas", "Transport Refrigeration", "Electrical", "Other",
];
const urgencyOptions = ["Emergency", "This week", "This month", "Just planning"];

const serviceKind = (service: string): ServiceKind => {
  if (/install/i.test(service)) return "installation";
  if (/repair|regas|gas|service/i.test(service)) return "repair";
  return "other";
};

// Columns added by the attribution migration. If it has not been applied yet
// the insert is retried without them so a lead is never lost.
const isMissingColumnError = (error: { code?: string }) =>
  error.code === "PGRST204" || error.code === "42703";

// PostgREST reports "Could not find the 'x' column", Postgres reports: column "x" of relation ... does not exist.
const missingColumnName = (error: { message?: string }) => {
  const match = /'(\w+)' column|column "(\w+)"/.exec(error.message ?? "");
  return match?.[1] ?? match?.[2];
};

// The database guard raises 'contact_guard:<reason>'. Anything else is shown generically
// so raw database errors never reach visitors.
const submitErrorMessage = (error: { message?: string }) => {
  const reason = /contact_guard:(\w+)/.exec(error.message ?? "")?.[1];
  switch (reason) {
    case "rate_limited":
      return "We've received several requests from you already. Please try again later or call us.";
    case "missing_first_name":
      return "Please enter your first name.";
    case "missing_suburb":
      return "Please tell us your suburb.";
    case "invalid_phone":
      return "Please enter a valid phone number.";
    case "invalid_email":
      return "Please enter a valid email address.";
    case "too_many_links":
      return "Please remove the links from your message and try again.";
    default:
      return "We couldn't send your request. Please try again or call us.";
  }
};

interface QuoteFormProps {
  variant?: "full" | "compact";
  /** Pre-selected service for landing pages, e.g. "AC Repair". */
  defaultService?: string;
  /** Pre-selected client type for landing pages. */
  defaultClientType?: string;
  /** When given, adds an optional "what is the problem" dropdown with these options. */
  faultOptions?: string[];
  /** Short label of where the form sits, sent with the conversion event. */
  formLocation: string;
  submitLabel?: string;
  onSuccess: () => void;
}

const QuoteForm = ({
  variant = "full",
  defaultService = "",
  defaultClientType = "",
  faultOptions,
  formLocation,
  submitLabel = "Send Quote Request",
  onSuccess,
}: QuoteFormProps) => {
  const compact = variant === "compact";
  const [form, setForm] = useState<QuoteFormValues>({
    ...initialValues,
    serviceRequired: defaultService,
    clientType: defaultClientType,
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof QuoteFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bots fill the hidden field; pretend success without storing anything.
    if (honeypot) {
      onSuccess();
      return;
    }

    const result = (compact ? compactSchema : fullSchema).safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof QuoteFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof QuoteFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const attribution = getAttribution();
    const leadSource = deriveLeadSource(attribution);
    const detail = [form.serviceRequired, form.fault].filter(Boolean).join(", ");
    const message = form.message || `Enquiry from ${formLocation} (${detail}) – no message left.`;

    const coreRow = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      client_type: form.clientType,
      service_required: form.serviceRequired,
      address: form.address || null,
      urgency: form.urgency || null,
      message,
      status: "new",
    };
    const attributionRow = {
      lead_source: leadSource,
      utm_source: attribution.utm_source ?? null,
      utm_medium: attribution.utm_medium ?? null,
      utm_campaign: attribution.utm_campaign ?? null,
      utm_term: attribution.utm_term ?? null,
      utm_content: attribution.utm_content ?? null,
      gclid: attribution.gclid ?? attribution.gbraid ?? attribution.wbraid ?? null,
      landing_page: attribution.landing_page,
      referrer: attribution.referrer || null,
      suburb: form.suburb || null,
      contact_method: "form",
    };
    // Columns added by the fault migration.
    const formRow = {
      fault: form.fault || null,
      form_location: formLocation,
    };

    setIsSubmitting(true);
    const row: Record<string, unknown> = { ...coreRow, ...attributionRow, ...formRow };
    let { error } = await supabase.from("contact_submissions").insert(row);
    // A missing column means its migration has not run yet. Drop only the group the database
    // named (every optional group if it did not say which) and retry, so a lead is never lost
    // and keeps its attribution when only the newer columns are missing.
    for (let attempt = 0; attempt < 2 && error && isMissingColumnError(error); attempt++) {
      const column = missingColumnName(error);
      const groups = [formRow, attributionRow].filter((group) => !column || column in group);
      for (const group of groups) for (const key of Object.keys(group)) delete row[key];
      // Without its column the fault would be lost, so keep it in the message.
      if (groups.includes(formRow) && form.fault) row.message = `${message}\nFault: ${form.fault}`;
      ({ error } = await supabase.from("contact_submissions").insert(row));
    }
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Submission Failed",
        description: submitErrorMessage(error),
        variant: "destructive",
      });
      return;
    }

    const kind = serviceKind(form.serviceRequired);
    track("generate_lead", {
      currency: "ZAR",
      value: leadValueZar(kind),
      service_type: form.serviceRequired,
      service_kind: kind,
      suburb: form.suburb,
      form_location: formLocation,
      page_path: window.location.pathname,
    });

    toast({ title: "Quote Request Sent!", description: "Our team will be in touch shortly." });
    onSuccess();
  };

  // The fields the schema above requires, so the markup says so as well as the validation.
  const requiredFields: (keyof QuoteFormValues)[] = compact
    ? ["firstName", "lastName", "phone", "suburb", "clientType"]
    : ["firstName", "lastName", "email", "phone", "clientType", "serviceRequired", "message"];
  const required = (field: keyof QuoteFormValues) => requiredFields.includes(field);

  const inputClass = (field: keyof QuoteFormValues) =>
    `w-full px-4 py-3 rounded-lg border font-body text-base sm:text-sm transition-colors duration-200 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  const fieldError = (field: keyof QuoteFormValues) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div>
        <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Your Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name *" aria-label="First name" autoComplete="given-name" required={required("firstName")} disabled={isSubmitting} className={inputClass("firstName")} />
            {fieldError("firstName")}
          </div>
          <div>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name *" aria-label="Last name" autoComplete="family-name" required={required("lastName")} disabled={isSubmitting} className={inputClass("lastName")} />
            {fieldError("lastName")}
          </div>
          <div>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone Number *" aria-label="Phone number" autoComplete="tel" inputMode="tel" required={required("phone")} disabled={isSubmitting} className={inputClass("phone")} />
            {fieldError("phone")}
          </div>
          <div>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={compact ? "Email Address (optional)" : "Email Address *"} aria-label="Email address" autoComplete="email" required={required("email")} disabled={isSubmitting} className={inputClass("email")} />
            {fieldError("email")}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Service Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faultOptions && faultOptions.length > 0 && (
            <div className="sm:col-span-2">
              <select name="fault" aria-label="What is the problem" value={form.fault} onChange={handleChange} disabled={isSubmitting} className={inputClass("fault")}>
                <option value="">What is the problem? (optional)</option>
                {faultOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}
          {/* Landing pages preset the service, so only ask for it on the full form. */}
          {!compact && (
            <>
              <div>
                <select name="clientType" aria-label="Client type" value={form.clientType} onChange={handleChange} required={required("clientType")} disabled={isSubmitting} className={inputClass("clientType")}>
                  <option value="">Client Type *</option>
                  {clientTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {fieldError("clientType")}
              </div>
              <div>
                <select name="serviceRequired" aria-label="Service required" value={form.serviceRequired} onChange={handleChange} required={required("serviceRequired")} disabled={isSubmitting} className={inputClass("serviceRequired")}>
                  <option value="">Service Required *</option>
                  {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldError("serviceRequired")}
              </div>
            </>
          )}
          {compact && (
            <div>
              <select name="clientType" aria-label="Home or business" value={form.clientType} onChange={handleChange} required={required("clientType")} disabled={isSubmitting} className={inputClass("clientType")}>
                <option value="">Home or Business? *</option>
                {clientTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {fieldError("clientType")}
            </div>
          )}
          <div>
            <input name="suburb" list="service-suburbs" value={form.suburb} onChange={handleChange} placeholder={compact ? "Your Suburb *" : "Suburb"} aria-label="Suburb" autoComplete="off" required={required("suburb")} disabled={isSubmitting} className={inputClass("suburb")} />
            <datalist id="service-suburbs">
              {SERVICE_SUBURBS.map((name) => <option key={name} value={name} />)}
            </datalist>
            {fieldError("suburb")}
          </div>
          <div>
            <select name="urgency" aria-label="How urgent is this" value={form.urgency} onChange={handleChange} disabled={isSubmitting} className={inputClass("urgency")}>
              <option value="">How Urgent Is This?</option>
              {urgencyOptions.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {!compact && (
            <div className="sm:col-span-2">
              <input name="address" value={form.address} onChange={handleChange} placeholder="Service Address / Area" aria-label="Service address" disabled={isSubmitting} className={inputClass("address")} />
            </div>
          )}
        </div>
        <div className="mt-4">
          <textarea
            name="message"
            aria-label="Tell us more"
            value={form.message}
            onChange={handleChange}
            required={required("message")}
            disabled={isSubmitting}
            rows={compact ? 3 : 4}
            placeholder={compact ? "Tell us more (optional)" : "Tell Us More * — Describe your issue or requirements"}
            className={inputClass("message")}
          />
          {fieldError("message")}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-muted-foreground text-xs">Your details are kept private and will not be shared.</p>
        <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting} className={compact ? "w-full sm:w-auto" : undefined}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
