import { CheckCircle, Info } from "lucide-react";
import { isPlaceholder } from "@/components/landing/placeholders";
import type { InclusionLine, PricingPath } from "@/data/installation-offer";

// Dashed amber outline so an unfilled placeholder is obvious in dev and preview builds.
const todoClass = "rounded border border-dashed border-amber-500 bg-amber-50 text-amber-900 px-2 py-1";

export interface TrustSlot {
  label: string;
  value: string;
}

export const TrustSection = ({
  heading,
  slots,
  showPlaceholders,
}: {
  heading: string;
  slots: TrustSlot[];
  showPlaceholders: boolean;
}) => {
  const shown = slots.filter((slot) => showPlaceholders || !isPlaceholder(slot.value));
  if (shown.length === 0) return null;

  return (
    <section aria-labelledby="trust-heading" className="py-8 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <h2 id="trust-heading" className="font-display text-2xl font-800 uppercase text-secondary mb-4">
          {heading}
        </h2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {shown.map((slot) => (
            <div
              key={slot.label}
              className={`rounded-lg border border-border bg-card p-4 ${isPlaceholder(slot.value) ? todoClass : ""}`}
            >
              <dt className="text-xs font-display uppercase tracking-widest text-muted-foreground">{slot.label}</dt>
              <dd className="mt-1 font-display text-lg font-bold text-foreground">{slot.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export interface DetailBlock {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

const visibleText = (list: string[] | undefined, showPlaceholders: boolean) =>
  (list ?? []).filter((text) => showPlaceholders || !isPlaceholder(text));

export const DetailsSection = ({
  heading,
  blocks,
  showPlaceholders,
}: {
  heading: string;
  blocks: DetailBlock[];
  showPlaceholders: boolean;
}) => {
  const shown = blocks
    .map((block) => ({
      title: block.title,
      paragraphs: visibleText(block.paragraphs, showPlaceholders),
      items: visibleText(block.items, showPlaceholders),
    }))
    .filter((block) => block.paragraphs.length + block.items.length > 0);
  if (shown.length === 0) return null;

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-6">{heading}</h2>
        <div className="space-y-8">
          {shown.map((block) => (
            <div key={block.title}>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground mb-2">
                {block.title}
              </h3>
              {block.paragraphs.map((text) => (
                <p key={text} className={`mb-2 font-body text-foreground ${isPlaceholder(text) ? todoClass : ""}`}>
                  {text}
                </p>
              ))}
              {block.items.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 font-body text-foreground">
                  {block.items.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export interface PhotoSlot {
  /** Imported image file. Leave undefined until a real photo is supplied. */
  src?: string;
  alt: string;
  caption: string;
}

export const PhotoSection = ({
  heading,
  intro,
  photos,
  showPlaceholders,
}: {
  heading: string;
  intro: string;
  photos: PhotoSlot[];
  showPlaceholders: boolean;
}) => {
  const shown = photos.filter((photo) => photo.src || showPlaceholders);
  if (shown.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-2">{heading}</h2>
        <p className="text-muted-foreground font-body mb-4">{intro}</p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {shown.map((photo) => (
            <li key={photo.caption}>
              {photo.src ? (
                <figure>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                  />
                  <figcaption className="mt-1 text-sm text-muted-foreground font-body">{photo.caption}</figcaption>
                </figure>
              ) : (
                <div className={`flex aspect-[4/3] items-center justify-center text-center text-sm ${todoClass}`}>
                  TODO: real photo – {photo.caption}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const PricingSection = ({
  heading,
  paths,
  showPlaceholders,
}: {
  heading: string;
  paths: PricingPath[];
  showPlaceholders: boolean;
}) => {
  const shown = paths.filter((path) => showPlaceholders || !isPlaceholder(path.from));
  if (shown.length === 0) return null;

  return (
    <section aria-labelledby="pricing-heading" className="py-10 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <h2 id="pricing-heading" className="font-display text-2xl font-800 uppercase text-secondary mb-4">
          {heading}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {shown.map((path) => (
            <li key={path.title} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">{path.title}</h3>
              <p
                className={`mt-2 font-display text-2xl font-bold text-secondary ${
                  isPlaceholder(path.from) ? todoClass : ""
                }`}
              >
                {path.from}
              </p>
              <p className="mt-2 font-body text-muted-foreground">{path.blurb}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const visibleLines = (lines: InclusionLine[], showPlaceholders: boolean) =>
  lines.filter((line) => showPlaceholders || !isPlaceholder(line.detail));

const InclusionList = ({ lines, icon }: { lines: InclusionLine[]; icon: "included" | "extra" }) => {
  const Icon = icon === "included" ? CheckCircle : Info;
  return (
    <ul className="space-y-3">
      {lines.map((line) => (
        <li key={line.label} className="flex items-start gap-2 font-body text-foreground">
          <Icon
            className={`h-5 w-5 mt-0.5 shrink-0 ${icon === "included" ? "text-primary" : "text-secondary"}`}
            aria-hidden="true"
          />
          <span>
            <span className="font-bold">{line.label}.</span>{" "}
            <span className={isPlaceholder(line.detail) ? todoClass : ""}>{line.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export const InclusionsSection = ({
  heading,
  included,
  extras,
  showPlaceholders,
}: {
  heading: string;
  included: InclusionLine[];
  extras: InclusionLine[];
  showPlaceholders: boolean;
}) => {
  const shownIncluded = visibleLines(included, showPlaceholders);
  const shownExtras = visibleLines(extras, showPlaceholders);
  if (shownIncluded.length + shownExtras.length === 0) return null;

  return (
    <section aria-labelledby="inclusions-heading" className="py-10 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <h2 id="inclusions-heading" className="font-display text-2xl font-800 uppercase text-secondary mb-6">
          {heading}
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {shownIncluded.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground mb-3">
                What is included
              </h3>
              <InclusionList lines={shownIncluded} icon="included" />
            </div>
          )}
          {shownExtras.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground mb-3">
                What can cost extra
              </h3>
              <InclusionList lines={shownExtras} icon="extra" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const PaymentSection = ({
  heading,
  text,
  confirmed,
  showPlaceholders,
}: {
  heading: string;
  text: string;
  confirmed: boolean;
  showPlaceholders: boolean;
}) => {
  // Never imply a payment arrangement until the client has confirmed one exists.
  if (!confirmed || (isPlaceholder(text) && !showPlaceholders)) return null;

  return (
    <section className="py-8 bg-background border-b border-border">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-display text-2xl font-800 uppercase text-secondary mb-2">{heading}</h2>
        <p className={`font-body text-foreground ${isPlaceholder(text) ? todoClass : ""}`}>{text}</p>
      </div>
    </section>
  );
};

export const LeadTimeNote = ({
  label,
  value,
  showPlaceholders,
}: {
  label: string;
  value: string;
  showPlaceholders: boolean;
}) => {
  if (isPlaceholder(value) && !showPlaceholders) return null;

  return (
    <section className="py-4 bg-frost-gradient border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="font-body text-foreground">
          <span className="font-display uppercase tracking-widest text-secondary text-sm">{label}: </span>
          <span className={isPlaceholder(value) ? todoClass : "font-bold"}>{value}</span>
        </p>
      </div>
    </section>
  );
};

/** Slim line under the price strip that jumps to the quote form while the holding offer runs. */
export const PromoBanner = ({ headline }: { headline: string }) => (
  <a
    href="#quote"
    className="block bg-secondary text-secondary-foreground text-center px-4 py-3 font-display font-bold uppercase tracking-wide text-sm min-h-[44px]"
  >
    {headline}
  </a>
);

/** The holding offer, shown directly above the quote form so early deal traffic is captured as leads. */
export const PromoBlock = ({ headline, body }: { headline: string; body: string }) => (
  <div role="note" className="mb-6 rounded-lg border border-secondary/40 bg-secondary/10 p-4 text-center">
    <p className="font-display text-lg font-bold uppercase tracking-wide text-secondary">{headline}</p>
    <p className="mt-1 font-body text-foreground">{body}</p>
  </div>
);
