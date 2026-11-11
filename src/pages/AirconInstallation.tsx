import LandingPage from "@/components/landing/LandingPage";
import type { LandingContent } from "@/components/landing/LandingPage";
import installationHero from "@/assets/aircon-installation-hero.webp";
import {
  EXTRA_CHARGE_TRIGGERS,
  INCLUDED,
  LEAD_TIME,
  OPEN_REGION_COUNT,
  PAYMENT_OPTIONS,
  PRICING_PATHS,
  PRIORITY_REGIONS,
  PRIORITY_SUBURBS,
  PROMO,
  isPromoActive,
} from "@/data/installation-offer";

// TODO(client): supply these before the Google Ads campaign leans on them. Nothing below may be guessed.
// Anything still written as {{PLACEHOLDER}} is hidden from visitors in production builds. It shows with a
// dashed outline in dev, or in a preview build with VITE_SHOW_PLACEHOLDERS=true. To fill one in, replace
// the whole {{...}} text (and the words around it) with the real wording.
//
//   src/data/installation-offer.ts  (prices, inclusions, payment, lead time and the Black Friday block)
//     {{SUPPLY_INSTALL_FROM}}, {{INSTALL_ONLY_FROM}}  entry price for each path, e.g. "From R2 400".
//                                                     First answer: does the R1 800 headline include a unit?
//     {{INCLUDED_*}}                                  what is covered: brackets, piping and its length,
//                                                     electrical connection, drainage, compliance certificate
//     {{EXTRA_*}}                                     what triggers an extra charge: long pipe runs, difficult
//                                                     access, electrical beyond the isolator, scaffolding
//     {{PAYMENT_TERMS}} and PAYMENT_OPTIONS.confirmed  only set confirmed to true if terms or layby really exist
//     {{CURRENT_LEAD_TIME}}                           current wait for a date (November to January is peak)
//     PROMO                                           edit headline and body once the Black Friday terms are
//                                                     set on 20 November; it hides itself on PROMO.endsOn
//   This file
//     Trust section
//       {{SAQCC_NUMBER}}                              SAQCC Gas registration number
//       {{GOOGLE_RATING}}, {{GOOGLE_REVIEW_COUNT}}   current figures from the Google Business profile
//       {{YEARS_IN_OPERATION}}                        years the business has operated
//       {{GUARANTEE_PERIOD}}                          installation guarantee period, as the client will honour it
//       {{BRANDS_INSTALLED}}                          brands installed
//       {{WARRANTY_PRESERVED}}                        whether a Frostice installation preserves the manufacturer warranty
//     Body copy
//       {{INSTALL_DURATION}}                          how long a typical installation takes
//       The sizing, day-of-installation and preparation wording is general and must be confirmed by the client.
//     Photos
//       photos.items[].src and .alt                   real photos of completed installations. Add the files to
//                                                     src/assets, import them, and set src and alt.

const content: LandingContent = {
  seoTitle: "Aircon Installation in Gauteng",
  seoDescription:
    "Frosty Ice supplies and installs air conditioners, or installs the unit you bought, in Sandton, Midrand, Centurion, Pretoria East and the East Rand.",
  eyebrow: "Aircon installation · Gauteng",
  heading: "Need a New Aircon Installed?",
  subheading:
    "Supply-and-install or installation-only for homes and businesses in Sandton, Midrand, Centurion, Pretoria East, the East Rand and Johannesburg North. Tell us your location and get a quote.",
  highlights: [
    "Supply and installation, or install your own unit",
    "Split units for homes, offices and shops",
    "Quote by call, WhatsApp or online form",
  ],
  priceNote: {
    label: "Installations from R1 800",
    text: "The final price depends on the unit, the site and the installation. We quote before we start.",
  },
  pricingPaths: { heading: "What It Costs", paths: PRICING_PATHS },
  payment: PAYMENT_OPTIONS,
  inclusions: {
    heading: "What Is Included, and What Costs Extra",
    included: INCLUDED,
    extras: EXTRA_CHARGE_TRIGGERS,
  },
  leadTime: LEAD_TIME,
  promo: { headline: PROMO.headline, body: PROMO.body, isActive: () => isPromoActive() },
  trust: {
    heading: "Why Book With Us",
    slots: [
      { label: "SAQCC Gas registration", value: "{{SAQCC_NUMBER}}" },
      { label: "Google rating", value: "{{GOOGLE_RATING}} from {{GOOGLE_REVIEW_COUNT}} Google reviews" },
      { label: "Years in operation", value: "{{YEARS_IN_OPERATION}} years in operation" },
      { label: "Installation guarantee", value: "{{GUARANTEE_PERIOD}} installation guarantee" },
      { label: "Brands we install", value: "{{BRANDS_INSTALLED}}" },
      { label: "Manufacturer warranty", value: "{{WARRANTY_PRESERVED}}" },
    ],
  },
  helpHeading: "Installation Options",
  helpItems: [
    "Supply and install a new unit",
    "Install a unit you already bought",
    "Split unit installation",
    "Homes and apartments",
    "Offices and shops",
    "Advice on the right size unit",
  ],
  stepsHeading: "How It Works",
  steps: [
    { title: "Request a quote", text: "Tell us your suburb, the room size and whether you have a unit." },
    { title: "We confirm the details", text: "We discuss the unit and installation options, then quote." },
    { title: "Installed and tested", text: "We install the unit and check it is working before we leave." },
  ],
  details: {
    heading: "What to Expect When You Book an Installation",
    blocks: [
      {
        title: "How the right unit size is decided",
        paragraphs: [
          "The right unit depends on the room, not only its floor area. What matters is the floor area, the ceiling height, how much sun the room gets, how many people use it and what gives off heat in it, such as ovens, servers or shop lighting.",
          "A unit that is too small runs flat out and still struggles on a hot day. A unit that is too large costs more to buy and switches off before it has dried the air properly, which leaves the room cool but damp. That is why we ask for the room size before we quote.",
        ],
      },
      {
        title: "What happens on the day",
        paragraphs: [
          "A split unit has an indoor unit, an outdoor unit and the pipes and cables that connect them. An installation works through these stages.",
        ],
        items: [
          "Agree where the indoor and outdoor units will go before anything is drilled.",
          "Fix the brackets and mount both units.",
          "Run the refrigerant piping, the drain line and the electrical connection between the units.",
          "Test the pipework for leaks and remove the air and moisture from it before the system is started.",
          "Start the unit and check that it is cooling and that the drain runs.",
        ],
      },
      {
        title: "How long it takes",
        paragraphs: [
          "{{INSTALL_DURATION}}",
          "The time depends mainly on the length of the pipe run, what the wall is built from and how easy it is to reach the outdoor position.",
        ],
      },
      {
        title: "How to prepare",
        items: [
          "Clear the wall and the floor around where the indoor unit will go.",
          "Move furniture and valuables away from the work area.",
          "Know where the distribution board is and whether it has a spare breaker for the unit.",
          "If you rent or live in a complex, check with the landlord or body corporate before the day, as some restrict where outdoor units may go.",
        ],
      },
      {
        title: "What we need to quote without a visit",
        paragraphs: [
          "The more we know, the closer the quote is to the final price. Tell us:",
        ],
        items: [
          "Your suburb, and whether the site is a home or a business.",
          "The size of the room.",
          "Whether you already have a unit and, if you do, its make and size.",
          "A photo of the wall for the indoor unit and of the outdoor position, sent on WhatsApp if you can.",
        ],
      },
      {
        title: "Our hours",
        paragraphs: [
          "Our hours are Monday to Friday 07:00–17:00 and Saturday 08:00–14:00. You can send an enquiry through the form at any time.",
        ],
      },
    ],
  },
  photos: {
    heading: "Our Work",
    intro: "Photos of completed installations.",
    items: [
      { alt: "{{PHOTO_1_ALT}}", caption: "A completed split unit installation" },
      { alt: "{{PHOTO_2_ALT}}", caption: "A neat outdoor unit and pipe run" },
      { alt: "{{PHOTO_3_ALT}}", caption: "The Frostice team on site" },
    ],
  },
  areaFocus: {
    heading: "Where we install most",
    regions: PRIORITY_REGIONS,
    suburbs: PRIORITY_SUBURBS,
    openCount: OPEN_REGION_COUNT,
  },
  installationFields: true,
  image: installationHero,
  imageAlt: "Frostice technician installing an outdoor air conditioning unit",
  service: "AC Installation",
  whatsappMessage: "Hi Frosty Ice, I'd like a quote to install an aircon. (from /aircon-installation)",
  formHeading: "Request an Installation Quote",
  formIntro: "Tell us your suburb and what you need. We will get back to you with a quote.",
  submitLabel: "Request Quote",
  formLocation: "landing_installation",
};

const AirconInstallation = () => <LandingPage content={content} />;

export default AirconInstallation;
