import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Thermometer, Snowflake, Truck, Zap, Phone, Mail, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "ac", label: "Air Conditioning", icon: Thermometer },
  { id: "refrig", label: "Refrigeration", icon: Snowflake },
  { id: "transport", label: "Transport Refrig.", icon: Truck },
  { id: "electrical", label: "Electrical", icon: Zap },
];

const serviceData: Record<string, { badge: string; title: string; desc: string; services: string[]; benefits?: string[]; cardLabel: string; cardSub: string }> = {
  ac: {
    badge: "Service 01",
    title: "Air Conditioning",
    desc: "Complete air conditioning services for homes, offices, and commercial spaces. Our certified technicians handle everything from new installations to emergency repairs.",
    services: ["AC Installation", "AC Repairs", "Major & Minor Services", "Gas Filling Services", "General HVAC-R Maintenance", "AC Not Blowing Cold/Warm Air", "AC Not Turning On", "Noisy AC Units", "Frozen Evaporator Coil", "Blocked Drainage"],
    benefits: ["Increases efficiency and performance of your AC", "Extends lifespan of your unit", "Decreases your electricity bill", "Improves air quality by removing harmful bacteria"],
    cardLabel: "Air Conditioning",
    cardSub: "Residential & Commercial",
  },
  refrig: {
    badge: "Service 02",
    title: "Refrigeration",
    desc: "From industrial cold rooms to domestic fridges, our refrigeration experts keep your stock safe and your temperatures optimal at all times.",
    services: ["Freezer & Cold Room Installation", "Industrial Refrigeration", "Cabinet & Plant Room Maintenance", "Bottle Coolers", "Drinking Water Chillers", "Ice Machines", "Buy & Sell Old Fridges", "Domestic Fridge Repairs", "Regas Services", "Compressor Changes"],
    cardLabel: "Refrigeration",
    cardSub: "Industrial & Domestic",
  },
  transport: {
    badge: "Service 03",
    title: "Transport Refrigeration",
    desc: "Keep your fleet cold and your deliveries on time. We specialise in the full range of transport refrigeration services — including emergency roadside response.",
    services: ["Breakdown Response", "Repairs", "Services & Maintenance", "Troubleshooting", "Engine Repair", "Bleed & Start", "Jumpstart", "Battery Replacement", "General Maintenance"],
    cardLabel: "Transport Refrig.",
    cardSub: "Fleet & Logistics",
  },
  electrical: {
    badge: "Service 04",
    title: "Electrical Services",
    desc: "From solar installations to DB board upgrades, our licensed electricians handle all your electrical needs with safety and precision.",
    services: ["Lighting Controls", "Wiring Upgrades", "Electrical Installations", "Solar Systems", "Panel DB Upgrades", "Test & Tag", "Power Point Installation", "General Electrical Maintenance"],
    cardLabel: "Electrical Services",
    cardSub: "Residential & Commercial",
  },
};

const ServicesPage = () => {
  const [active, setActive] = useState("ac");
  const data = serviceData[active];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            label="What We Offer"
            heading="Our Services"
            description="Expert cooling, refrigeration, and electrical solutions for residential, commercial, and transport applications — all backed by our 24/7 support team."
            light
          />
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
            </div>

            {/* Side Card */}
            <div className="lg:col-span-1">
              <div className="bg-secondary rounded-lg p-8 sticky top-28">
                <span className="font-display text-3xl font-800 uppercase text-frost">{data.cardLabel}</span>
                <p className="font-display text-xs uppercase tracking-widest text-ice/70 mt-1">{data.cardSub}</p>
                <div className="mt-8 space-y-4">
                  <Link to="/contact">
                    <Button variant="hero" size="lg" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" /> Request Service
                    </Button>
                  </Link>
                  <a href="tel:+27845893702" className="flex items-center gap-2 text-frost/60 text-sm justify-center hover:text-ice transition-colors">
                    <Phone className="h-4 w-4" /> +27 84 589 3702
                  </a>
                  <a href="mailto:info@frostyiceaircon.co.za" className="flex items-center gap-2 text-frost/60 text-sm justify-center hover:text-ice transition-colors">
                    <Mail className="h-4 w-4" /> info@frostyiceaircon.co.za
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 diagonal-clip">
        <div className="container mx-auto px-4 text-center pb-12">
          <h2 className="font-display text-4xl md:text-5xl font-800 uppercase text-frost mb-4">Need a Service?</h2>
          <p className="text-frost/60 text-lg mb-8">Get a free, no-obligation quote from our expert team today.</p>
          <Link to="/contact">
            <Button variant="hero" size="xl">Get a Free Quote</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
