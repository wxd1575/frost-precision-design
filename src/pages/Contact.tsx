import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Phone, Mail, Globe, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import QuoteForm from "@/components/QuoteForm";
import TrackedLink from "@/components/TrackedLink";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, whatsappUrl } from "@/lib/tracking/config";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Layout>
        <SEO 
          title="Contact Us"
          description="Get a free quote for your air conditioning and refrigeration projects. Contact Frost & Ice Aircon today."
        />
        <section className="bg-hero-gradient pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-16 rounded-3xl shadow-2xl text-center">
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-12 w-12 text-secondary" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-full border border-secondary/20 animate-ping" />
                </div>
                
                <h2 className="font-display text-4xl md:text-5xl font-800 uppercase text-frost mb-6 tracking-tight">
                  Quote Request <span className="text-secondary">Received</span>
                </h2>
                
                <p className="text-frost/70 text-lg mb-10 leading-relaxed font-body">
                  Thank you for choosing Frost & Ice. Your request has been prioritised. Our technical team will review your requirements and contact you within the hour.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/" className="w-full sm:w-auto">
                    <Button variant="secondary" size="xl" className="w-full sm:w-auto uppercase tracking-widest font-bold px-12">
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/services" className="w-full sm:w-auto">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto bg-transparent text-frost border-frost/20 hover:bg-frost/10 uppercase tracking-widest font-bold">
                      Explore Services
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-frost/40 mb-1">Average Response</p>
                    <p className="font-display text-sm font-bold text-frost">45 Minutes</p>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-frost/40 mb-1">Status</p>
                    <p className="font-display text-sm font-bold text-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Prioritised
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get a free quote for your air conditioning and refrigeration projects. Contact Frost & Ice Aircon today."
      />
      {/* Hero */}
      <section className="bg-primary pt-32 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            label="Free Consultation"
            heading="Get a Free Quote"
            description="Fill in the form below and our team will get back to you promptly with a tailored solution for your home or business."
            light
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-800 uppercase text-secondary mb-2">Get in Touch</h3>
                <p className="text-muted-foreground text-sm">Prefer to call or email? Reach us directly below.</p>
              </div>
              <div className="space-y-4">
                <TrackedLink kind="call" placement="contact_page" href={PHONE_HREF} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Phone className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">{PHONE_DISPLAY}</span>
                </TrackedLink>
                <TrackedLink kind="email" placement="contact_page" href={EMAIL_HREF} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">{EMAIL}</span>
                </TrackedLink>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Globe className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">www.frosticeaircon.co.za</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Operating Hours
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="font-semibold">07:00 – 17:00</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-semibold">08:00 – 14:00</span></div>
                  <div className="flex justify-between"><span>Emergency Support</span><span className="font-semibold text-primary">24/7</span></div>
                </div>
              </div>

              <TrackedLink
                kind="whatsapp"
                placement="contact_page"
                href={whatsappUrl("Hi Frostice, I'd like a quote. (from /contact)")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-display uppercase tracking-wider text-sm hover:bg-[hsl(142,70%,40%)] transition-colors"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </TrackedLink>

              {/* Trust indicator */}
              <div className="bg-frost-gradient border border-border rounded-lg p-5 mt-2">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="h-3.5 w-3.5 fill-accent text-accent" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs italic leading-relaxed">"Professional, clean, and the price was exactly as quoted."</p>
                <p className="font-display text-[10px] uppercase tracking-widest text-secondary mt-2">— Sarah V., Pretoria</p>
              </div>

              <div className="flex items-center justify-center gap-4 mt-2 text-muted-foreground">
                <div className="text-center">
                  <span className="font-display text-lg font-800 text-primary">500+</span>
                  <p className="font-display text-[9px] uppercase tracking-widest">Projects</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <span className="font-display text-lg font-800 text-primary">98%</span>
                  <p className="font-display text-[9px] uppercase tracking-widest">Retention</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <span className="font-display text-lg font-800 text-primary">24/7</span>
                  <p className="font-display text-[9px] uppercase tracking-widest">Support</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="mb-8">
                  <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Free Consultation</span>
                  <h3 className="font-display text-2xl font-800 uppercase text-secondary mt-1">Request a Quote</h3>
                  <p className="text-muted-foreground text-sm mt-2">Fill in your details below and we'll respond within the hour during business hours.</p>
                </div>

                <QuoteForm formLocation="contact_page" onSuccess={() => setSubmitted(true)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
