import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import { Thermometer, Snowflake, Truck, Zap, Phone, Mail, ArrowRight, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import serviceAc from "@/assets/service-ac.webp";
import serviceRefrig from "@/assets/service-refrig.webp";
import serviceTransport from "@/assets/service-transport.webp";
import serviceElectrical from "@/assets/service-electrical.webp";

const tabs = [
  { id: "ac", label: "Air Conditioning", icon: Thermometer },
  { id: "refrig", label: "Refrigeration", icon: Snowflake },
  { id: "transport", label: "Transport Refrig.", icon: Truck },
  { id: "electrical", label: "Electrical", icon: Zap },
];

const serviceData: Record<string, { badge: string; title: string; desc: string; services: string[]; benefits?: string[]; cardLabel: string; cardSub: string; image?: string; testimonial?: { text: string; name: string; role: string } }> = {
  ac: {
    badge: "Service 01",
    title: "Air Conditioning",
    desc: "Complete air conditioning services for homes, offices, and commercial spaces. Our certified technicians handle everything from new installations to emergency repairs.",
    services: ["AC Installation", "AC Repairs", "Major & Minor Services", "Gas Filling Services", "General HVAC-R Maintenance", "AC Not Blowing Cold/Warm Air", "AC Not Turning On", "Noisy AC Units", "Frozen Evaporator Coil", "Blocked Drainage"],
    benefits: ["Increases efficiency and performance of your AC", "Extends lifespan of your unit", "Decreases your electricity bill", "Improves air quality by removing harmful bacteria"],
    cardLabel: "Air Conditioning",
    cardSub: "Residential & Commercial",
    image: serviceAc,
    testimonial: { text: "Frost Ice installed a new split unit in our home within 24 hours. Professional and the price was exactly as quoted.", name: "Sarah van der Merwe", role: "Homeowner, Pretoria" },
  },
  refrig: {
    badge: "Service 02",
    title: "Refrigeration",
    desc: "From industrial cold rooms to domestic fridges, our refrigeration experts keep your stock safe and your temperatures optimal at all times.",
    services: ["Freezer & Cold Room Installation", "Industrial Refrigeration", "Cabinet & Plant Room Maintenance", "Bottle Coolers", "Drinking Water Chillers", "Ice Machines", "Buy & Sell Old Fridges", "Domestic Fridge Repairs", "Regas Services", "Compressor Changes"],
    cardLabel: "Refrigeration",
    cardSub: "Industrial & Domestic",
    image: serviceRefrig,
    testimonial: { text: "When our cold room went down on a Friday night, Frost Ice had a technician on-site within 2 hours.", name: "Linda Botha", role: "Restaurant Owner, Sandton" },
  },
  transport: {
    badge: "Service 03",
    title: "Transport Refrigeration",
    desc: "Keep your fleet cold and your deliveries on time. We specialise in the full range of transport refrigeration services — including emergency roadside response.",
    services: ["Breakdown Response", "Repairs", "Services & Maintenance", "Troubleshooting", "Engine Repair", "Bleed & Start", "Jumpstart", "Battery Replacement", "General Maintenance"],
    cardLabel: "Transport Refrig.",
    cardSub: "Fleet & Logistics",
    image: serviceTransport,
    testimonial: { text: "We rely on Frost Ice for our entire fleet of 12 refrigerated trucks. Their 24/7 response has saved us from losing stock multiple times.", name: "James Mkhize", role: "Operations Manager, FreshCo" },
  },
  electrical: {
    badge: "Service 04",
    title: "Electrical Services",
    desc: "From solar installations to DB board upgrades, our licensed electricians handle all your electrical needs with safety and precision.",
    services: ["Lighting Controls", "Wiring Upgrades", "Electrical Installations", "Solar Systems", "Panel DB Upgrades", "Test & Tag", "Power Point Installation", "General Electrical Maintenance"],
    cardLabel: "Electrical Services",
    cardSub: "Residential & Commercial",
    image: serviceElectrical,
    testimonial: { text: "Outstanding solar installation and DB board upgrade. The team was efficient, clean, and explained everything clearly.", name: "David Ndlovu", role: "Business Owner, Centurion" },
  },
};

const ServicesPage = () => {
  const [active, setActive] = useState("ac");
  const data = serviceData[active];

  return (
    <Layout>
      <SEO 
        title="Our Services"
        description="Explore our specialized services: Air Conditioning, Commercial Refrigeration, Transport Refrigeration, and Advanced Electrical Solutions."
      />
      {/* Hero */}
      <section className="bg-primary pt-32 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            label="What We Offer"
            heading="Our Services"
            description="Expert cooling, refrigeration, and electrical solutions for residential, commercial, and transport applications — all backed by our 24/7 support team."
            light
          />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <ClientLogos variant="light" />
        </div>
      </section>

      {/* Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm uppercase tracking-wider transition-all duration-300 ${
                  active === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Service Content */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Service Image */}
              {data.image && (
                <div className="rounded-lg overflow-hidden">
                  <img src={data.image} alt={data.title} loading="lazy" decoding="async" className="w-full h-64 object-cover" />
                </div>
              )}

              <div>
                <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">{data.badge}</span>
                <h3 className="font-display text-4xl font-800 uppercase text-secondary mt-2">{data.title}</h3>
                <p className="text-muted-foreground mt-4 leading-relaxed">{data.desc}</p>
              </div>

              <div>
                <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Services We Offer</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.services.map((s) => (
                    <div key={s} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {data.benefits && (
                <div>
                  <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Benefits of Regular Servicing</h4>
                  <div className="space-y-3">
                    {data.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-gold mt-2 shrink-0" />
                        <span className="text-sm text-muted-foreground">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline testimonial */}
              {data.testimonial && (
                <div className="bg-muted border border-border rounded-lg p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm italic leading-relaxed">"{data.testimonial.text}"</p>
                  <p className="font-display text-xs font-700 uppercase text-secondary mt-3">{data.testimonial.name} — <span className="text-muted-foreground font-normal normal-case">{data.testimonial.role}</span></p>
                </div>
              )}
            </div>

            {/* Side Card */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg p-8 sticky top-28">
                <span className="font-display text-3xl font-800 uppercase text-frost">{data.cardLabel}</span>
                <p className="font-display text-xs uppercase tracking-widest text-ice/70 mt-1">{data.cardSub}</p>
                <div className="mt-8 space-y-4">
                  <Link to="/contact">
                    <Button variant="secondary" size="lg" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" /> Request Service
                    </Button>
                  </Link>
                  <a href="tel:+27845893702" className="flex items-center gap-2 text-frost/60 text-sm justify-center hover:text-ice transition-colors">
                    <Phone className="h-4 w-4" /> +27 84 589 3702
                  </a>
                  <a href="mailto:info@frosticeaircon.com" className="flex items-center gap-2 text-frost/60 text-sm justify-center hover:text-ice transition-colors">
                    <Mail className="h-4 w-4" /> info@frosticeaircon.com
                  </a>
                </div>

                {/* Trust mini-stats */}
                <div className="mt-8 pt-6 border-t border-ice/10 space-y-3">
                  <div className="flex justify-between text-frost/60 text-xs">
                    <span className="font-display uppercase tracking-wider">Projects</span>
                    <span className="font-display font-700 text-ice">500+</span>
                  </div>
                  <div className="flex justify-between text-frost/60 text-xs">
                    <span className="font-display uppercase tracking-wider">Client Retention</span>
                    <span className="font-display font-700 text-ice">98%</span>
                  </div>
                  <div className="flex justify-between text-frost/60 text-xs">
                    <span className="font-display uppercase tracking-wider">Response Time</span>
                    <span className="font-display font-700 text-ice">&lt; 1 Hour</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading label="Client Reviews" heading="Trusted by Businesses & Homeowners" />
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-800 uppercase text-frost mb-4">Need a Service?</h2>
          <p className="text-frost/60 text-lg mb-8">Get a free, no-obligation quote from our expert team today.</p>
          <Link to="/contact">
            <Button variant="secondary" size="xl" className="uppercase tracking-widest font-bold px-12">Get a Free Quote</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
