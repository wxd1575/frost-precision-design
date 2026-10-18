import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF, whatsappUrl } from "@/lib/tracking/config";

interface LandingLayoutProps {
  children: ReactNode;
  whatsappMessage: string;
}

/**
 * A deliberately small shell for ad landing pages: no site navigation to leak
 * visitors, call and WhatsApp always within reach, and a sticky action bar on phones.
 */
const LandingLayout = ({ children, whatsappMessage }: LandingLayoutProps) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-primary border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="Frost & Ice Aircon home">
          <img
            src="/frostice-logo-white.png"
            alt="Frost & Ice Aircon"
            width={192}
            height={48}
            className="w-36 sm:w-44 h-auto object-contain"
          />
        </Link>
        <TrackedLink
          kind="call"
          placement="landing_header"
          href={PHONE_HREF}
          className="flex items-center gap-2 text-frost font-display font-bold tracking-widest min-h-[44px] px-2 hover:text-secondary transition-colors"
        >
          <Phone size={18} aria-hidden="true" />
          <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          <span className="sm:hidden">Call</span>
        </TrackedLink>
      </div>
    </header>

    <main className="flex-1 pb-24 lg:pb-0">{children}</main>

    <footer className="bg-secondary text-frost">
      <div className="container mx-auto px-4 py-8 text-sm text-center space-y-2">
        <p className="font-display uppercase tracking-widest">Frost &amp; Ice Aircon &amp; Refrigeration (PTY) LTD</p>
        <p className="text-frost/80">Mon–Fri 07:00–17:00 · Sat 08:00–14:00</p>
        <p>
          <Link to="/" className="underline underline-offset-4 hover:text-ice">
            Visit our full website
          </Link>
        </p>
      </div>
    </footer>

    {/* Sticky action bar, phones only */}
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 gap-2 bg-primary p-2 border-t border-white/10">
      <TrackedLink
        kind="call"
        placement="landing_sticky_bar"
        href={PHONE_HREF}
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        <Phone aria-hidden="true" /> Call Now
      </TrackedLink>
      <TrackedLink
        kind="whatsapp"
        placement="landing_sticky_bar"
        href={whatsappUrl(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "whatsapp", size: "lg" })}
      >
        <MessageCircle aria-hidden="true" /> WhatsApp
      </TrackedLink>
    </div>
  </div>
);

export default LandingLayout;
