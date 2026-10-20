import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  buildConfirmation,
  buildNotification,
  shouldNotifyBusiness,
  type ContactRecord,
  type OutgoingEmail,
} from "./email.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "sales@frosticeaircon.co.za";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Frost Ice Aircon <noreply@send.frosticeaircon.co.za>";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

async function send(email: OutgoingEmail, idempotencyKey: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: FROM_EMAIL, ...email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error("Resend error", res.status, JSON.stringify(data));
  return { ok: res.ok, data };
}

// The caller only supplies a submission id. Content is always re-read from the
// database, so a forged request cannot choose recipients or message text, and
// notified_at stops a replay from emailing twice.
Deno.serve(async (req) => {
  try {
    if (!RESEND_API_KEY) return json({ error: "RESEND_API_KEY is not configured" }, 500);

    const payload = await req.json().catch(() => null);
    const id = payload?.id;
    if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
      return json({ error: "Missing or invalid submission id" }, 400);
    }

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return json({ error: "Submission not found" }, 404);

    const record = data as ContactRecord;
    if (record.notified_at) return json({ skipped: "already notified" });

    let failed = false;
    if (shouldNotifyBusiness(record)) {
      const result = await send(buildNotification(record, NOTIFY_TO), `lead-${id}`);
      failed = failed || !result.ok;
    }

    const confirmation = buildConfirmation(record, NOTIFY_TO);
    if (confirmation) {
      // A failed confirmation must not hide that the business was notified.
      await send(confirmation, `confirm-${id}`);
    }

    if (failed) return json({ error: "Notification email failed" }, 502);

    await supabase
      .from("contact_submissions")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", id);

    return json({ ok: true });
  } catch (error) {
    console.error("send-contact-email failed", error);
    return json({ error: "Internal error" }, 500);
  }
});
