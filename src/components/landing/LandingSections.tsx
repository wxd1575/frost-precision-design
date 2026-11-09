import { isPlaceholder } from "@/components/landing/placeholders";

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
