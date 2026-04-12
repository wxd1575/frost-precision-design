import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import { Thermometer, Snowflake, Truck, Zap, Clock, Shield, Leaf, Building, ArrowRight, Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.webp";
import serviceAc from "@/assets/service-ac.webp";
import serviceRefrig from "@/assets/service-refrig.webp";
import serviceTransport from "@/assets/service-transport.webp";
import serviceElectrical from "@/assets/service-electrical.webp";

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
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5 },
};

const Index = () => {
  return (
    <Layout>
      <SEO />
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={heroBg} alt="HVAC systems" fetchpriority="high" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary opacity-60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pt-48 pb-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-frost text-xs font-bold uppercase tracking-widest">South Africa's Cooling Experts</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-800 uppercase leading-[1.1] text-frost mb-6"
            >
              Reliable <span className="text-secondary">Cooling</span>,<br />
              Anywhere. Anytime.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-frost/80 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-body"
            >
              Complete air conditioning, refrigeration, and electrical solutions. Our certified technicians provide precision installations and emergency repairs for homes and businesses.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/contact">
                <Button variant="secondary" size="xl" className="uppercase tracking-widest font-bold">Request a Quote</Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="bg-transparent text-frost border-frost/20 hover:bg-frost/10 uppercase tracking-widest font-bold">Our Services</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary border-y border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-800 text-secondary mb-2">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-frost/50 font-bold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <ClientLogos />
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-frost">
        <div className="container mx-auto px-4">
          <SectionHeading 
            label="Expert Solutions" 
            heading="Our Core Services" 
            description="Professional installations and maintenance across all cooling systems." 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Link to={s.link} className="group bg-white h-full block rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border">
                  {s.image && (
                    <div className="h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <s.icon size={24} />
                    </div>
                    <h3 className="font-display text-xl font-800 uppercase text-primary mb-4 tracking-tight">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-body">{s.desc}</p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <SectionHeading label="The Process" heading="How We Work" light />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, i) => (
              <motion.div 
                key={step.num} 
                {...fadeUp} 
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-7xl font-800 text-white/5 absolute -top-8 -left-4 select-none">{step.num}</div>
                <h3 className="font-display text-xl font-800 uppercase text-frost mb-4 relative z-10">{step.title}</h3>
                <p className="text-frost/60 text-sm leading-relaxed font-body relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <SectionHeading 
                label="Why Frost Ice" 
                heading="The Cooling Authority" 
                description="With years of diagnostic expertise and a commitment to quality, we are the first choice for home and business owners."
                align="left"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                {whyPoints.map((p, i) => (
                  <motion.div key={p.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-secondary/10 rounded flex items-center justify-center text-secondary">
                      <p.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-800 uppercase text-primary text-sm mb-1">{p.title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed font-body">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="aspect-square rounded-2xl overflow-hidden border-8 border-frost">
                <img src={serviceAc} alt="Expert AC Service" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-frost">
        <div className="container mx-auto px-4">
          <SectionHeading label="Testimonials" heading="Trusted by Hundreds" />
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-6xl font-800 uppercase text-frost mb-6">Experience Better Cooling Today</h2>
            <p className="text-frost/60 text-lg mb-10 font-body">Don't settle for less than optimal comfort. Get a professional assessment and quote from our certified team.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="secondary" size="xl" className="uppercase tracking-widest font-bold px-12">Contact Us</Button>
              </Link>
              <a href="tel:+27845893702" className="flex items-center gap-3 px-8 text-frost hover:text-secondary transition-colors font-display font-bold uppercase tracking-widest">
                <Phone size={20} /> +27 84 589 3702
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
