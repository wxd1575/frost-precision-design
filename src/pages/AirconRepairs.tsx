import LandingPage from "@/components/landing/LandingPage";
import type { LandingContent } from "@/components/landing/LandingPage";
import repairsHero from "@/assets/aircon-repairs-hero.webp";

// TODO(client): supply these before the Google Ads campaign leans on them. Nothing below may be guessed.
// Anything still written as {{PLACEHOLDER}} is hidden from visitors in production builds. It shows with a
// dashed outline in dev, or in a preview build with VITE_SHOW_PLACEHOLDERS=true. To fill one in, replace
// the whole {{...}} text (and the words around it) with the real wording.
//
//   Trust section
//     {{GOOGLE_RATING}}, {{GOOGLE_REVIEW_COUNT}}  current figures from the Google Business profile
//     {{YEARS_IN_OPERATION}}                      years the business has operated
//     {{GUARANTEE_PERIOD}}                        workmanship guarantee period, as the client will honour it
//     {{SAQCC_NUMBER}}                            registration number, with the registering body's name
//   Body copy (not on the page yet)
//     Turnaround, brands serviced and what is not covered were removed until the client supplies them.
//     Add a block for each to details.blocks below once the real wording is known.
//   Photos
//     photos.items[].src and .alt                 real photos of technicians or completed work. Add the
//                                                 files to src/assets, import them, and set src and alt.
//     The hero image (repairsHero) should also be swapped for a real photo of the team.

const faults = [
  "Aircon not blowing cold air",
  "Aircon leaking water",
  "Noisy aircon unit",
  "Aircon not turning on",
  "Regas and gas refill",
  "Frozen evaporator coil",
  "Blocked drainage",
  "Major and minor services",
];

const content: LandingContent = {
  seoTitle: "Aircon Repairs in Gauteng",
  seoDescription:
    "Aircon not cooling, leaking or noisy? Frosty Ice repairs, regas and services aircons in Sandton, Midrand, Centurion, Pretoria East and the East Rand.",
  eyebrow: "Aircon repairs · Gauteng",
  heading: "Aircon Not Cooling? Get It Fixed.",
  subheading:
    "Qualified technicians for aircon repairs, regas and servicing for homes and businesses in Sandton, Midrand, Centurion, Pretoria East, the East Rand and Johannesburg North.",
  highlights: [
    "Repairs, regas and gas refills",
    "Homes, offices and shops",
    "Call, WhatsApp or request a quote online",
  ],
  pricing: {
    lead: "Aircon regas from R850.",
    note: "A R450 call-out applies and is quoted upfront.",
  },
  priceNote: {
    label: "Call-out fee",
    text: "R450 call-out, which covers a full diagnostic by a qualified technician. We quote the repair before any work starts.",
  },
  trust: {
    heading: "Why Book With Us",
    slots: [
      { label: "Google rating", value: "{{GOOGLE_RATING}} from {{GOOGLE_REVIEW_COUNT}} Google reviews" },
      { label: "Years in operation", value: "{{YEARS_IN_OPERATION}} years in operation" },
      { label: "Workmanship guarantee", value: "{{GUARANTEE_PERIOD}} workmanship guarantee" },
      { label: "Registration", value: "{{SAQCC_NUMBER}}" },
    ],
  },
  helpHeading: "Common Faults We Fix",
  helpItems: faults,
  faultOptions: faults,
  stepsHeading: "How It Works",
  steps: [
    { title: "Tell us the problem", text: "Call, WhatsApp or send the short form with your suburb." },
    { title: "We book a call-out", text: "A technician inspects the unit and finds the fault." },
    { title: "Repair done properly", text: "We explain the repair and cost before work continues." },
  ],
  details: {
    heading: "What to Expect When You Book a Repair",
    blocks: [
      {
        title: "What happens on a call-out",
        paragraphs: [
          "A qualified technician visits, inspects the unit and finds the fault. The R450 call-out covers that full diagnostic.",
          "We explain what is wrong and what the repair will cost before any work continues.",
        ],
      },
      {
        title: "What usually causes common faults",
        items: [
          "Not cooling: low refrigerant gas, a dirty filter or coil, or a fan or compressor that is failing.",
          "Leaking water: a blocked drain line or tray, or a frozen coil that is melting.",
          "Noisy unit: loose panels or fan parts, worn fan bearings or a failing compressor.",
          "Not turning on: a tripped breaker or power fault, a remote problem or a failed control board.",
          "Regas: an aircon does not use up its gas. Low gas usually means a leak, so a regas on its own may not be a lasting fix.",
          "Frozen evaporator coil: restricted airflow from a dirty filter, or low refrigerant gas.",
          "Blocked drainage: dust and algae build up in the drain line, the water backs up and drips inside.",
          "Services: regular cleaning and checks keep filters and coils clear, which helps prevent several of the faults above.",
        ],
      },
      {
        title: "Quick checks before you call",
        items: [
          "Check the remote batteries and that the unit is set to cool.",
          "Check that the breaker or plug has not tripped.",
          "Rinse or replace the filter if you can reach it safely.",
          "If the unit is leaking water or smells burnt, switch it off at the wall and call us.",
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
    intro: "Photos of our technicians and completed jobs.",
    items: [
      { alt: "{{PHOTO_1_ALT}}", caption: "A Frostice technician working on a customer's unit" },
      { alt: "{{PHOTO_2_ALT}}", caption: "A completed repair" },
      { alt: "{{PHOTO_3_ALT}}", caption: "The Frostice team" },
    ],
  },
  image: repairsHero,
  imageAlt: "Frostice technician repairing a wall-mounted air conditioner indoors",
  service: "AC Repair",
  whatsappMessage: "Hi Frosty Ice, my aircon needs a repair. (from /aircon-repairs)",
  formHeading: "Request an Aircon Repair",
  formIntro: "Tell us what is wrong and where you are. We will get back to you.",
  submitLabel: "Request Repair",
  formLocation: "landing_repairs",
};

const AirconRepairs = () => <LandingPage content={content} />;

export default AirconRepairs;
