import LandingPage from "@/components/landing/LandingPage";
import type { LandingContent } from "@/components/landing/LandingPage";
import whyChooseUs from "@/assets/why-choose-us.webp";

const content: LandingContent = {
  seoTitle: "Aircon Installation in Ekurhuleni",
  seoDescription:
    "Need a new aircon installed? Frost & Ice supplies and installs air conditioners, or installs your own unit, for homes and businesses in Ekurhuleni. Request a quote.",
  eyebrow: "Aircon installation · Ekurhuleni",
  heading: "Need a New Aircon Installed?",
  subheading:
    "Supply-and-install or installation-only for homes and businesses across Ekurhuleni. Tell us your location and get a quote.",
  highlights: [
    "Supply and installation, or install your own unit",
    "Split units for homes, offices and shops",
    "Quote by call, WhatsApp or online form",
  ],
  priceNote: {
    label: "Installations from R1 800",
    text: "The final price depends on the unit, the site and the installation. We quote before we start.",
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
  image: whyChooseUs,
  imageAlt: "Newly installed split air conditioning unit",
  service: "AC Installation",
  whatsappMessage: "Hi Frostice, I'd like a quote to install an aircon. (from /aircon-installation)",
  formHeading: "Request an Installation Quote",
  formIntro: "Tell us your suburb and what you need. We will get back to you with a quote.",
  submitLabel: "Request Quote",
  formLocation: "landing_installation",
};

const AirconInstallation = () => <LandingPage content={content} />;

export default AirconInstallation;
