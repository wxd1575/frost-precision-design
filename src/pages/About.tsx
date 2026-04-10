import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import { Link } from "react-router-dom";
import { Award, Users, Leaf, Lightbulb, ShieldCheck, Wrench, Phone, Target, Eye } from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpg";

const values = [
  { icon: Award, num: "01", title: "Quality First", desc: "We use top-quality products and uphold the highest workmanship standards on every job — residential or commercial." },
  { icon: Users, num: "02", title: "Client-Centric", desc: "Your success is our priority. We listen, collaborate, and customise solutions to meet your unique needs, backed by 24/7 support." },
  { icon: Leaf, num: "03", title: "Eco-Responsibility", desc: "We are committed to environmentally responsible practices and offer eco-friendly systems that reduce energy consumption and costs." },
  { icon: Lightbulb, num: "04", title: "Innovation", desc: "We continuously invest in cutting-edge technology and training to stay ahead of industry developments and deliver better outcomes." },
  { icon: ShieldCheck, num: "05", title: "Reliability", desc: "When we say we'll be there, we are. 24/7 emergency response ensures your operations are never left without cooling support." },
  { icon: Wrench, num: "06", title: "Expertise", desc: "Our highly skilled technicians bring deep technical knowledge and hands-on experience to ensure optimal performance of your systems." },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            label="Who We Are"
            heading="About Frost Ice"
            description="A trusted partner for air conditioning and refrigeration — delivering innovative, reliable, and eco-friendly solutions for homes and businesses across South Africa."
            light
          />
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <SectionHeading label="Company Overview" heading="Frost Ice Aircon & Refrigeration" center={false} />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Frost Ice Aircon & Refrigeration (PTY) LTD is a leading provider of comprehensive air conditioning and refrigeration solutions. With a strong commitment to customer satisfaction and environmental sustainability, we have established ourselves as a trusted partner for both residential and commercial clients.</p>
                <p>Our team of highly skilled technicians offers a wide range of services including installation, repair, maintenance, and energy optimisation. We pride ourselves on delivering exceptional service, utilising cutting-edge technology, and providing eco-friendly solutions tailored to your specific needs.</p>
                <p>With a focus on delivering comfort, efficiency, and reliability, Frost Ice is your go-to choice for all your cooling and refrigeration requirements.</p>
              </div>
              <Link to="/contact" className="mt-8 inline-block">
                <Button variant="hero" size="lg">Get a Free Quote</Button>
              </Link>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-4">
              {/* Team Photo */}
              <div className="rounded-lg overflow-hidden">
                <img src={teamPhoto} alt="Frost Ice team of certified technicians" className="w-full h-56 object-cover" />
              </div>
              <div className="bg-secondary rounded-lg p-8">
                <h3 className="font-display text-lg uppercase tracking-wider text-ice mb-3">Our Mission</h3>
                <p className="text-frost/70 text-sm leading-relaxed">Delivering innovative and reliable air conditioning and refrigeration systems to create optimal environments for our clients.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <span className="font-display text-3xl font-800 text-primary">500+</span>
                  <p className="font-display text-xs uppercase tracking-widest text-muted-foreground mt-1">Projects Done</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <span className="font-display text-3xl font-800 text-primary">98%</span>
                  <p className="font-display text-xs uppercase tracking-widest text-muted-foreground mt-1">Client Retention</p>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
                <span className="font-display text-xs uppercase tracking-widest text-primary">Our Tagline</span>
                <p className="font-display text-xl font-700 text-secondary mt-1">"Frost Ice: Reliable Cooling, Year-Round."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ClientLogos />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary diagonal-clip-both">
        <div className="container mx-auto px-4 py-12">
          <SectionHeading label="Our Direction" heading="Mission & Vision" light />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="bg-frost/5 border border-ice/10 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-ice" />
                <div>
                  <span className="font-display text-xs uppercase tracking-widest text-ice/70">Our Mission</span>
                  <h3 className="font-display text-xl font-700 uppercase text-frost">What Drives Us</h3>
                </div>
              </div>
              <p className="text-frost/70 leading-relaxed">Delivering innovative and reliable air conditioning and refrigeration systems to create optimal environments for our clients — every job, every time.</p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-frost/5 border border-ice/10 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-ice" />
                <div>
                  <span className="font-display text-xs uppercase tracking-widest text-ice/70">Our Vision</span>
                  <h3 className="font-display text-xl font-700 uppercase text-frost">Where We're Headed</h3>
                </div>
              </div>
              <p className="text-frost/70 leading-relaxed">To be the most trusted and preferred provider of cooling and refrigeration solutions in South Africa, setting industry standards for quality, service, and innovation.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading label="What We Stand For" heading="Our Core Values" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.num} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-lg p-8 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-display text-3xl font-800 text-muted/40">{v.num}</span>
                </div>
                <h3 className="font-display text-lg font-700 uppercase text-secondary">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-frost-gradient">
        <div className="container mx-auto px-4">
          <SectionHeading label="Client Reviews" heading="What Our Clients Say" />
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 diagonal-clip">
        <div className="container mx-auto px-4 text-center pb-12">
          <SectionHeading label="Ready to Start?" heading="Let's Build Your Perfect Cooling Solution" description="Contact us today for a free, no-obligation quote tailored to your specific needs." light />
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">Get a Free Quote</Button>
            </Link>
            <a href="tel:+27845893702">
              <Button variant="heroOutline" size="xl">
                <Phone className="h-5 w-5 mr-2" /> Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
