import LandingPage from "@/components/landing/LandingPage";
import type { LandingContent } from "@/components/landing/LandingPage";
import serviceAc from "@/assets/service-ac.webp";

const content: LandingContent = {
  seoTitle: "Aircon Repairs in Gauteng",
  seoDescription:
    "Aircon not cooling, leaking or noisy? Frosty Ice repairs, regas and services air conditioners in Sandton, Midrand, Centurion and the East Rand. Call or WhatsApp.",
  eyebrow: "Aircon repairs · Gauteng",
  heading: "Aircon Not Cooling? Get It Fixed.",
  subheading:
    "Qualified technicians for aircon repairs, regas and servicing for homes and businesses in Sandton, Midrand, Centurion and across the East Rand.",
  highlights: [
    "Repairs, regas and gas refills",
    "Homes, offices and shops",
    "Call, WhatsApp or request a quote online",
  ],
  priceNote: {
    label: "Callout fee",
    text: "A R450 callout fee applies and is charged on top of the repair.",
  },
  helpHeading: "Common Faults We Fix",
  helpItems: [
    "Aircon not blowing cold air",
    "Aircon leaking water",
    "Noisy aircon unit",
    "Aircon not turning on",
    "Regas and gas refill",
    "Frozen evaporator coil",
    "Blocked drainage",
    "Major and minor services",
  ],
  stepsHeading: "How It Works",
  steps: [
    { title: "Tell us the problem", text: "Call, WhatsApp or send the short form with your suburb." },
    { title: "We book a callout", text: "A technician inspects the unit and finds the fault." },
    { title: "Repair done properly", text: "We explain the repair and cost before work continues." },
  ],
  image: serviceAc,
  imageAlt: "Frosty Ice technician working on an air conditioning unit",
  service: "AC Repair",
  whatsappMessage: "Hi Frosty Ice, my aircon needs a repair. (from /aircon-repairs)",
  formHeading: "Request an Aircon Repair",
  formIntro: "Tell us what is wrong and where you are. We will get back to you.",
  submitLabel: "Request Repair",
  formLocation: "landing_repairs",
};

const AirconRepairs = () => <LandingPage content={content} />;

export default AirconRepairs;
