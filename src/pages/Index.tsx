import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Thermometer, Snowflake, Truck, Zap, Clock, Shield, Leaf, Building, ArrowRight, Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const services = [
  { icon: Thermometer, title: "Air Conditioning", desc: "Installation, repairs, gas filling, major & minor services, and full HVAC-R maintenance for homes and offices.", link: "/services" },
  { icon: Snowflake, title: "Refrigeration", desc: "Cold rooms, industrial refrigeration, bottle coolers, ice machines, domestic fridges, regas, and compressor changes.", link: "/services" },
  { icon: Truck, title: "Transport Refrigeration", desc: "Breakdown response, repairs, maintenance, engine repair, battery replacement and full servicing for refrigerated trucks.", link: "/services" },
  { icon: Zap, title: "Electrical", desc: "Wiring upgrades, DB panel upgrades, solar systems, lighting controls, power point installation and general electrical maintenance.", link: "/services" },
];

const stats = [
  { value: "24/7", label: "Support Available" },
  { value: "4+", label: "Service Categories" },
  { value: "100%", label: "Client Satisfaction Focus" },
  { value: "ECO", label: "Eco-Friendly Solutions" },
];

const steps = [
  { num: "01", title: "Request a Quote", desc: "Fill in our quick quote form or give us a call — we respond within the hour." },
  { num: "02", title: "We Assess", desc: "Our technician visits your site, assesses the problem and provides a detailed quote." },
  { num: "03", title: "We Work", desc: "Skilled technicians carry out the work to the highest standard, on schedule." },
  { num: "04", title: "Enjoy Comfort", desc: "Your environment is comfortable, efficient and backed by our ongoing support." },
];

const whyPoints = [
  { icon: Shield, title: "Expert Technicians", desc: "Years of hands-on experience across all cooling and refrigeration systems." },
  { icon: Clock, title: "24/7 Emergency Response", desc: "We're available around the clock so your operations are never interrupted." },
  { icon: Leaf, title: "Eco-Friendly Solutions", desc: "Environmentally responsible systems that reduce your carbon footprint and energy bill." },
  { icon: Building, title: "Residential & Commercial", desc: "Customised solutions for homes, offices, retail, industrial and transport applications." },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="HVAC systems" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block font-display text-xs uppercase tracking-[0.3em] text-ice mb-4 border border-ice/30 px-4 py-1.5 rounded-full"
            >
              South Africa's Cooling Experts
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-800 uppercase leading-[0.9] text-frost mb-6"
            >
              Reliable<br />
              <span className="text-gradient-ice">Cooling,</span><br />
              Year-Round.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-frost/70 text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
            >
              Expert air conditioning, refrigeration, transport refrigeration and electrical services — for homes and businesses across South Africa.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/contact">
                <Button variant="hero" size="xl">Get a Free Quote</Button>
              </Link>
              <Link to="/services">
                <Button variant="heroOutline" size="xl">Our Services</Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {["24/7 Support", "Certified Technicians", "Residential & Commercial"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-frost/50 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-ice" />
                  <span className="font-display uppercase tracking-wider text-xs">{badge}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating 24/7 badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center justify-center h-28 w-28 rounded-full border-2 border-ice/30 bg-secondary/50 backdrop-blur-sm animate-float"
          >
            <span className="font-display text-3xl font-800 text-ice">24/7</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-frost/70">Emergency</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-frost/70">Service</span>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="font-display text-3xl md:text-4xl font-800 text-ice">{s.value}</span>
                <p className="font-display text-xs uppercase tracking-widest text-frost/50 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-frost-gradient">
        <div className="container mx-auto px-4">
          <SectionHeading label="What We Do" heading="Four Core Services" description="From residential split units to industrial cold rooms and transport refrigeration — Frost Ice has you covered." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={s.link} className="group block h-full bg-card rounded-lg p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 border border-border">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-700 uppercase text-secondary mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-display text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary diagonal-clip-reverse">
        <div className="container mx-auto px-4 pt-16">
          <SectionHeading label="Simple Process" heading="How It Works" light />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.15 }} className="relative">
                <span className="font-display text-6xl font-800 text-ice/10">{step.num}</span>
                <h3 className="font-display text-lg font-700 uppercase text-frost mt-2">{step.title}</h3>
                <p className="text-frost/60 text-sm leading-relaxed mt-2">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-12 h-0.5 bg-ice/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading label="Why Frost Ice" heading="The Trusted Choice for Cooling" description="Our expert team delivers exceptional service using cutting-edge technology and eco-friendly solutions tailored to your specific needs." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyPoints.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex gap-5">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-700 uppercase text-secondary">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-secondary py-20 diagonal-clip">
        <div className="container mx-auto px-4 text-center pb-12">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-4xl md:text-5xl font-800 uppercase text-frost mb-4">Ready to Stay Cool?</h2>
            <p className="text-frost/60 text-lg mb-8">Get a free, no-obligation quote from our expert team today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="xl">Get a Free Quote</Button>
              </Link>
              <a href="tel:+27845893702">
                <Button variant="heroOutline" size="xl">
                  <Phone className="h-5 w-5 mr-2" /> +27 84 589 3702
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
