import { useState } from "react";
import { CheckCircle, MessageCircle, Phone, ArrowDown } from "lucide-react";
import SEO from "@/components/SEO";
import QuoteForm from "@/components/QuoteForm";
import TrackedLink from "@/components/TrackedLink";
import LandingLayout from "@/components/landing/LandingLayout";
import {
  DetailsSection,
  IllustrationStrip,
  InclusionsSection,
  LeadTimeNote,
  PaymentSection,
  PhotoSection,
  PricingSection,
  PromoBanner,
  PromoBlock,
  TrustSection,
} from "@/components/landing/LandingSections";
import type { DetailBlock, Illustration, PhotoSlot, TrustSlot } from "@/components/landing/LandingSections";
import type { InclusionLine, PricingPath } from "@/data/installation-offer";
import { shouldShowPlaceholders } from "@/components/landing/placeholders";
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
  /** Price statement in the hero, above the call buttons. Two sentences, rendered as one line of copy. */
  pricing?: { lead: string; note: string };
  priceNote: { label: string; text: string };
  /** Separate entry prices for each way of buying. Paths still holding a {{PLACEHOLDER}} price are hidden from visitors. */
  pricingPaths?: { heading: string; paths: PricingPath[] };
  /** What the price covers and what can cost extra. Lines still holding a {{PLACEHOLDER}} are hidden from visitors. */
  inclusions?: { heading: string; included: InclusionLine[]; extras: InclusionLine[] };
  /** Only rendered once `confirmed` is true, so no payment arrangement is implied before the client confirms one. */
  payment?: { heading: string; text: string; confirmed: boolean };
  leadTime?: { label: string; value: string };
  /** Temporary offer shown above the quote form while `isActive()` is true. Checked on every render. */
  promo?: { headline: string; body: string; isActive: () => boolean };
  /** Leads the areas list with the areas the ads target. The full list stays below. */
  areaFocus?: { heading: string; regions: string[]; suburbs: string[]; openCount: number };
  /** Adds room size and "do you already have a unit" questions to the quote form. */
  installationFields?: boolean;
  /** Real credentials and ratings. Slots still holding a {{PLACEHOLDER}} are hidden from visitors. */
  trust?: { heading: string; slots: TrustSlot[] };
  helpHeading: string;
  helpItems: string[];
  /** Adds a "what is the problem" dropdown to the quote form. */
  faultOptions?: string[];
  /** Longer explanatory copy. Paragraphs still holding a {{PLACEHOLDER}} are hidden from visitors. */
  details?: { heading: string; blocks: DetailBlock[] };
  /** Illustrative images, not photos of real jobs. Shown without a heading or caption after "How it works". */
  illustrations?: Illustration[];
  /** Photos of real technicians or completed work. Slots without a `src` are hidden from visitors. */
  photos?: { heading: string; intro: string; items: PhotoSlot[] };
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
  const showPlaceholders = shouldShowPlaceholders();
  const promo = content.promo?.isActive() ? content.promo : undefined;

  // Targeted regions lead, in the order the ads prioritise them. Every other region follows unchanged.
  const focus = content.areaFocus;
  const priorityRank = (region: string) => {
    const rank = focus ? focus.regions.indexOf(region) : -1;
    return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
  };
  const regions = [...SERVICE_REGIONS].sort((a, b) => priorityRank(a.region) - priorityRank(b.region));

  const intro = (
    <div className={content.pricing ? "mt-6" : "mt-4"}>
      <p className="text-frost/80 text-lg font-body">{content.subheading}</p>

      <ul className="mt-6 space-y-2">
        {content.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2 font-body">
            <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const actions = (
    <div className={content.pricing ? "mt-6" : "mt-8"}>
      <div className="flex flex-col sm:flex-row gap-3">
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
  );

  return (
    <LandingLayout whatsappMessage={content.whatsappMessage}>
      <SEO title={content.seoTitle} description={content.seoDescription} />

      {/* Hero. With a price statement, the order is headline, price, call buttons, then the supporting copy,
          so the price and the call-to-action both sit above the fold on a phone. */}
      <section className="bg-hero-gradient text-frost">
        <div className="container mx-auto px-4 py-10 lg:py-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-ice mb-3">{content.eyebrow}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 uppercase leading-tight">
              {content.heading}
            </h1>

            {content.pricing ? (
              <>
                <p className="mt-5 rounded-lg border border-ice/40 bg-white/10 px-4 py-3 text-lg font-body leading-snug">
                  <span className="font-bold text-ice">{content.pricing.lead}</span>{" "}
                  <span>{content.pricing.note}</span>
                </p>
                {actions}
                {intro}
              </>
            ) : (
              <>
                {intro}
                {actions}
              </>
            )}
          </div>

          <img
            src={content.image}
            alt={content.imageAlt}
            width={1200}
            height={800}
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

      {promo && <PromoBanner headline={promo.headline} />}

      {content.pricingPaths && (
        <PricingSection
          heading={content.pricingPaths.heading}
          paths={content.pricingPaths.paths}
          showPlaceholders={showPlaceholders}
        />
      )}

      {content.payment && (
        <PaymentSection
          heading={content.payment.heading}
          text={content.payment.text}
          confirmed={content.payment.confirmed}
          showPlaceholders={showPlaceholders}
        />
      )}

      {content.inclusions && (
        <InclusionsSection
          heading={content.inclusions.heading}
          included={content.inclusions.included}
          extras={content.inclusions.extras}
          showPlaceholders={showPlaceholders}
        />
      )}

      {content.leadTime && (
        <LeadTimeNote
          label={content.leadTime.label}
          value={content.leadTime.value}
          showPlaceholders={showPlaceholders}
        />
      )}

      {content.trust && (
        <TrustSection heading={content.trust.heading} slots={content.trust.slots} showPlaceholders={showPlaceholders} />
      )}

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

      {content.illustrations && content.illustrations.length > 0 && (
        <IllustrationStrip images={content.illustrations} />
      )}

      {content.details && (
        <DetailsSection
          heading={content.details.heading}
          blocks={content.details.blocks}
          showPlaceholders={showPlaceholders}
        />
      )}

      {content.photos && (
        <PhotoSection
          heading={content.photos.heading}
          intro={content.photos.intro}
          photos={content.photos.items}
          showPlaceholders={showPlaceholders}
        />
      )}

      {/* Areas */}
      <section className="py-10 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-2">Areas We Serve Across Gauteng</h2>
          <p className="text-muted-foreground font-body mb-4">
            Homes and businesses in Sandton, Midrand, Centurion, Pretoria East, the East Rand
            and Johannesburg North. Not on the list? Ask us.
          </p>
          {focus && (
            <div className="mb-4">
              <p className="font-display text-sm uppercase tracking-widest text-secondary mb-2">{focus.heading}</p>
              <ul className="flex flex-wrap gap-2">
                {focus.suburbs.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-secondary bg-secondary/10 px-3 py-1 text-sm font-body font-bold text-foreground"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2">
            {regions.map(({ region, suburbs }, index) => (
              <details
                key={region}
                open={focus ? index < focus.openCount : undefined}
                className="group rounded-lg border border-border bg-background"
              >
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
          {promo && !submitted && <PromoBlock headline={promo.headline} body={promo.body} />}
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
                  faultOptions={content.faultOptions}
                  installationFields={content.installationFields}
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
