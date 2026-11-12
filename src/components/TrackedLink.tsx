import type { AnchorHTMLAttributes } from "react";
import { recordClick } from "@/lib/tracking/clicks";
import type { ClickKind } from "@/lib/tracking/clicks";
import { track } from "@/lib/tracking/events";
import type { TrackedEvent } from "@/lib/tracking/events";

const EVENT_BY_KIND: Record<ClickKind, TrackedEvent> = {
  call: "click_call",
  whatsapp: "click_whatsapp",
  email: "click_email",
};

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  kind: ClickKind;
  /** Where on the page the link sits, e.g. "navbar" or "sticky_bar". */
  placement: string;
}

/**
 * An anchor that reports tel:, WhatsApp and mailto: clicks to the dataLayer, and
 * stores the click's gclid so the conversion survives without advertising cookies.
 */
const TrackedLink = ({ kind, placement, onClick, children, ...props }: TrackedLinkProps) => (
  <a
    {...props}
    onClick={(e) => {
      track(EVENT_BY_KIND[kind], {
        placement,
        page_path: window.location.pathname,
      });
      recordClick(kind, placement);
      onClick?.(e);
    }}
  >
    {children}
  </a>
);

export default TrackedLink;
