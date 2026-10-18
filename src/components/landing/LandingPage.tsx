import { useState } from "react";
import { CheckCircle, MessageCircle, Phone, ArrowDown } from "lucide-react";
import SEO from "@/components/SEO";
import QuoteForm from "@/components/QuoteForm";
import TrackedLink from "@/components/TrackedLink";
import LandingLayout from "@/components/landing/LandingLayout";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF, whatsappUrl } from "@/lib/tracking/config";
import { SERVICE_REGIONS } from "@/data/service-areas";

export interface LandingContent {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  highlights: string[];
  priceNote: { label: string; text: string };
  helpHeading: string;
  helpItems: string[];
  stepsHeading: string;
  steps: { title: string; text: string }[];
  image: string;
  imageAlt: string;
  /** Pre-selected service saved with the lead, e.g. "AC Repair". */
  service: string;
  whatsappMessage: string;
  formHeading: string;
  formIntro: string;
  submitLabel: string;
  /** Identifies this page in conversion events. */
  formLocation: string;
}

const LandingPage = ({ content }: { content: LandingContent }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <LandingLayout whatsappMessage={content.whatsappMessage}>
      <SEO title={content.seoTitle} description={content.seoDescription} />

      {/* Hero */}
      <section className="bg-hero-gradient text-frost">
        <div className="container mx-auto px-4 py-10 lg:py-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-ice mb-3">{content.eyebrow}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 uppercase leading-tight">
              {content.heading}
            </h1>
            <p className="mt-4 text-frost/80 text-lg font-body">{content.subheading}</p>

            <ul className="mt-6 space-y-2">
              {content.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 font-body">
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <TrackedLink
                kind="call"
                placement="landing_hero"
                href={PHONE_HREF}
                className={buttonVariants({ variant: "secondary", size: "xl" })}
              >
                <Phone aria-hidden="true" /> Call {PHONE_DISPLAY}
              </TrackedLink>
              <TrackedLink
                kind="whatsapp"
                placement="landing_hero"
                href={whatsappUrl(content.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "whatsapp", size: "xl" })}
              >
                <MessageCircle aria-hidden="true" /> WhatsApp Us
              </TrackedLink>
            </div>
            <a href="#quote" className="mt-4 inline-flex items-center gap-2 text-ice underline underline-offset-4 min-h-[44px]">
              <ArrowDown className="h-4 w-4" aria-hidden="true" /> Or request a quote online
            </a>
          </div>

          <img
            src={content.image}
            alt={content.imageAlt}
            width={1024}
            height={576}
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="w-full h-auto rounded-lg border border-white/10 shadow-xl"
          />
        </div>
      </section>

      {/* Price expectation */}
      <section className="bg-frost-gradient border-y border-border">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="font-display uppercase tracking-widest text-secondary text-sm">{content.priceNote.label}</p>
          <p className="mt-1 text-lg text-foreground font-body">{content.priceNote.text}</p>
        </div>
      </section>

      {/* What we help with + how it works */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-4">{content.helpHeading}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {content.helpItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground font-body">
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-4">{content.stepsHeading}</h2>
            <ol className="space-y-4">
              {content.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display font-bold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display font-bold uppercase tracking-wide text-foreground">{step.title}</p>
                    <p className="text-muted-foreground font-body">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-2">Areas We Serve in Ekurhuleni</h2>
          <p className="text-muted-foreground font-body mb-4">
            Homes and businesses across Ekurhuleni, Gauteng. Not on the list? Ask us.
          </p>
          <div className="space-y-2">
            {SERVICE_REGIONS.map(({ region, suburbs }) => (
              <details key={region} className="group rounded-lg border border-border bg-background">
                <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-display font-bold uppercase tracking-wide text-foreground min-h-[48px]">
                  <span>{region}</span>
                  <span className="text-xs font-body font-normal normal-case text-muted-foreground">
                    {suburbs.length} areas
                  </span>
                </summary>
                <ul className="flex flex-wrap gap-2 px-4 pb-4">
                  {suburbs.map((area) => (
                    <li key={area} className="rounded-full border border-border bg-card px-3 py-1 text-sm font-body">
                      {area}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" className="py-12 scroll-mt-4">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="relative bg-card border border-border rounded-lg p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-6" role="status">
                <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-display text-2xl font-800 uppercase text-secondary">Request Received</h2>
                <p className="mt-2 text-muted-foreground font-body">
                  Thank you. Our team will contact you shortly. If it is urgent, call us now.
                </p>
                <TrackedLink
                  kind="call"
                  placement="landing_thank_you"
                  href={PHONE_HREF}
                  className={`${buttonVariants({ variant: "secondary", size: "lg" })} mt-6`}
                >
                  <Phone aria-hidden="true" /> {PHONE_DISPLAY}
                </TrackedLink>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-800 uppercase text-secondary">{content.formHeading}</h2>
                <p className="text-muted-foreground text-sm mt-2 mb-6 font-body">{content.formIntro}</p>
                <QuoteForm
                  variant="compact"
                  defaultService={content.service}
                  formLocation={content.formLocation}
                  submitLabel={content.submitLabel}
                  onSuccess={() => setSubmitted(true)}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;
