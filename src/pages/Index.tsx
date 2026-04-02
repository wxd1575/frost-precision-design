import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import { Thermometer, Snowflake, Truck, Zap, Clock, Shield, Leaf, Building, ArrowRight, Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import serviceAc from "@/assets/service-ac.jpg";
import serviceRefrig from "@/assets/service-refrig.jpg";
import serviceTransport from "@/assets/service-transport.jpg";
import serviceElectrical from "@/assets/service-electrical.jpg";
import whyChooseUs from "@/assets/why-choose-us.jpg";

const services = [
  { icon: Thermometer, title: "Air Conditioning", desc: "Installation, repairs, gas filling, major & minor services, and full HVAC-R maintenance for homes and offices.", link: "/services", image: serviceAc },
  { icon: Snowflake, title: "Refrigeration", desc: "Cold rooms, industrial refrigeration, bottle coolers, ice machines, domestic fridges, regas, and compressor changes.", link: "/services", image: serviceRefrig },
  { icon: Truck, title: "Transport Refrigeration", desc: "Breakdown response, repairs, maintenance, engine repair, battery replacement and full servicing for refrigerated trucks.", link: "/services", image: serviceTransport },
  { icon: Zap, title: "Electrical", desc: "Wiring upgrades, DB panel upgrades, solar systems, lighting controls, power point installation and general electrical maintenance.", link: "/services", image: serviceElectrical },
];

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "24/7", label: "Emergency Support" },
  { value: "98%", label: "Client Retention" },
  { value: "4+", label: "Service Categories" },
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
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, type: "spring" as const, bounce: 0.3 },
};

const Index = () => {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 350]);
  const opacityHero = useTransform(scrollY, [0, 600], [0.95, 1]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <motion.div style={{ y: yHero }} className="absolute inset-0 top-[-20%] bottom-[-20%] h-[140%] -z-10">
          <img src={heroBg} alt="HVAC systems" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div style={{ opacity: opacityHero }} className="absolute inset-0 bg-hero-gradient backdrop-blur-[2px] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10 pt-32 pb-16">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, type: "spring", bounce: 0.2 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-800 uppercase leading-[1.1] tracking-tight text-frost mb-6 drop-shadow-xl"
            >
              Reliable
              <br />
              <span className="text-gradient-ice inline-block pb-1">Cooling,</span>
              <br />
              Year-Round.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-frost/80 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed font-light tracking-wide"
            >
              Expert air conditioning, refrigeration, transport refrigeration and electrical services — for homes and businesses across South Africa.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
              className="flex flex-wrap gap-5"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact">
                  <Button variant="hero" size="xl" className="shadow-[var(--shadow-glow)] hover:shadow-none transition-all duration-500">
                    Get a Free Quote
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/services">
                  <Button variant="heroOutline" size="xl" className="bg-secondary/40 backdrop-blur-md hover:bg-white/10">
                    Our Services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-16 flex flex-wrap gap-8"
            >
              {["24/7 Support", "Certified Technicians", "500+ Projects Completed"].map((badge) => (
                <div key={badge} className="flex items-center gap-3 text-frost/60 text-sm group">
                  <div className="h-2 w-2 rounded-full bg-ice shadow-[0_0_8px_rgba(195,236,255,0.8)] group-hover:scale-150 transition-transform duration-500" />
                  <span className="font-display uppercase tracking-[0.2em] text-[11px] group-hover:text-frost transition-colors duration-300">{badge}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating 24/7 badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1.4, duration: 1, type: "spring", bounce: 0.5 }}
            className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center justify-center h-36 w-36 rounded-full border border-ice/20 bg-secondary/40 backdrop-blur-xl hover:bg-secondary/60 transition-colors duration-500 animate-float shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <span className="font-display text-5xl font-800 text-ice drop-shadow-[0_0_15px_rgba(195,236,255,0.4)]">24/7</span>
            <span className="font-display text-[11px] uppercase tracking-widest text-frost/80 mt-1">Emergency</span>
            <span className="font-display text-[11px] uppercase tracking-widest text-frost/80">Service</span>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary/95 border-b border-ice/5 backdrop-blur-md py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.7, type: "spring" }}
                className="text-center group"
              >
                <span className="font-display text-4xl md:text-5xl lg:text-6xl font-800 text-ice drop-shadow-[0_0_15px_rgba(195,236,255,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(195,236,255,0.6)] transition-all duration-500">{s.value}</span>
                <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.25em] text-frost/50 mt-3 group-hover:text-frost/80 transition-colors duration-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-frost-gradient relative">
        <div className="container mx-auto px-4 relative z-10">
          <ClientLogos />
        </div>
      </section>

      {/* Services */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="container mx-auto px-4">
          <SectionHeading label="What We Do" heading="Four Core Services" description="From residential split units to industrial cold rooms and transport refrigeration — Frost Ice has you covered." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.7, type: "spring", bounce: 0.3 }}
                className="h-full"
              >
                <Link to={s.link} className="group block h-full bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-2 border border-border hover:border-ice/40">
                  {s.image && (
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500 shadow-[0_8px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_25px_rgba(196,71,45,0.4)]">
                      <s.icon className="h-8 w-8 text-ice group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="font-display text-2xl font-800 uppercase tracking-tight text-secondary mb-4 group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-light">{s.desc}</p>
                    <span className="inline-flex items-center gap-2 text-primary font-display text-sm uppercase tracking-widest group-hover:gap-4 transition-all duration-500 font-700">
                      View Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-secondary diagonal-clip-reverse relative">
        <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-ice/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <SectionHeading label="Simple Process" heading="How It Works" light />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
            {steps.map((step, i) => (
              <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.15, duration: 0.8, type: "spring" }} className="relative group">
                <span className="font-display text-7xl md:text-8xl font-900 text-ice/10 group-hover:text-ice/20 transition-colors duration-500">{step.num}</span>
                <h3 className="font-display text-xl font-800 uppercase text-frost mt-4 group-hover:text-ice transition-colors duration-300">{step.title}</h3>
                <p className="text-frost/60 text-sm leading-relaxed mt-3 font-light">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[2.5rem] right-[-2rem] w-16 h-[1px] bg-ice/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <SectionHeading label="Client Reviews" heading="What Our Clients Say" description="Don't just take our word for it — hear from the businesses and homeowners who trust Frost Ice with their cooling needs." />
          <div className="mt-16">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-32 bg-frost-gradient relative">
        <div className="container mx-auto px-4">
          <SectionHeading label="Why Frost Ice" heading="The Trusted Choice for Cooling" description="Our expert team delivers exceptional service using cutting-edge technology and eco-friendly solutions tailored to your specific needs." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center mt-16">
            <motion.div {...fadeUp} className="rounded-2xl overflow-hidden shadow-[var(--shadow-card-hover)] relative group">
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img src={whyChooseUs} alt="Frost Ice technician servicing rooftop HVAC unit" loading="lazy" width={1024} height={640} className="w-full h-[500px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out" />
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {whyPoints.map((p, i) => (
                <motion.div key={p.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex gap-5 group">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-500 shadow-sm group-hover:shadow-[0_0_15px_rgba(196,71,45,0.3)]">
                    <p.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-800 uppercase tracking-tight text-secondary group-hover:text-primary transition-colors duration-300">{p.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-2 font-light">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-secondary py-32 diagonal-clip relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ice via-secondary to-secondary pointer-events-none" />
        <div className="container mx-auto px-4 text-center pb-20 relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-5xl md:text-7xl font-800 uppercase tracking-tighter text-frost mb-6 drop-shadow-xl">Ready to Stay Cool?</h2>
            <p className="text-frost/70 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">Get a free, no-obligation quote from our expert team today and experience premium cooling solutions.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact">
                  <Button variant="hero" size="xl" className="shadow-[var(--shadow-glow)] hover:shadow-none transition-all duration-500 text-base py-7 px-10">
                    Get a Free Quote
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="tel:+27845893702">
                  <Button variant="heroOutline" size="xl" className="bg-secondary/40 backdrop-blur-md hover:bg-white/10 text-base py-7 px-10">
                    <Phone className="h-5 w-5 mr-3" /> +27 84 589 3702
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
