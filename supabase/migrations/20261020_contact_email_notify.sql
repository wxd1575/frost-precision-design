-- Track whether the lead notification email has been sent so replays are no-ops.
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

-- The edge function re-reads the row by id, so the trigger only needs to send the id.
-- Failures in the HTTP call must never block the lead insert.
CREATE OR REPLACE FUNCTION public.handle_new_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $function$
begin
  begin
    perform net.http_post(
      url := 'https://jzrilwwukedenswuxezp.supabase.co/functions/v1/send-contact-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object('id', NEW.id)
    );
  exception when others then
    raise warning 'send-contact-email dispatch failed: %', sqlerrm;
  end;
  return NEW;
end;
$function$;

DROP TRIGGER IF EXISTS on_contact_inserted ON public.contact_submissions;
CREATE TRIGGER on_contact_inserted
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_contact();
