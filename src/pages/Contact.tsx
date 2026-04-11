import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Phone, Mail, Globe, Clock, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

const quoteSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  clientType: z.string().min(1, "Select a client type"),
  serviceRequired: z.string().min(1, "Select a service"),
  address: z.string().max(200).optional(),
  urgency: z.string().optional(),
  message: z.string().trim().min(1, "Tell us about your requirements").max(2000),
});

type QuoteForm = z.infer<typeof quoteSchema>;

const initialForm: QuoteForm = {
  firstName: "", lastName: "", email: "", phone: "",
  clientType: "", serviceRequired: "", address: "", urgency: "", message: "",
};

const clientTypes = ["Residential", "Commercial", "Industrial", "Transport"];
const serviceOptions = [
  "AC Installation", "AC Repair", "AC Service", "Gas Filling", "Cold Room",
  "Industrial Refrigeration", "Domestic Fridge", "Regas", "Transport Refrigeration", "Electrical", "Other",
];
const urgencyOptions = ["Emergency", "This week", "This month", "Just planning"];

const ContactPage = () => {
  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof QuoteForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = quoteSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof QuoteForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof QuoteForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      client_type: form.clientType,
      service_required: form.serviceRequired,
      address: form.address || null,
      urgency: form.urgency || null,
      message: form.message,
      status: "new",
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({ title: "Quote Request Sent!", description: "Our team will be in touch shortly." });
  };

  const inputClass = (field: keyof QuoteForm) =>
    `w-full px-4 py-3 rounded-lg border font-body text-sm transition-colors duration-200 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

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
                <a href="tel:+27845893702" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Phone className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">+27 84 589 3702</span>
                </a>
                <a href="mailto:info@frostyiceaircon.co.za" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">info@frostyiceaircon.co.za</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Globe className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm">www.frostyiceaircon.co.za</span>
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

              <a
                href="https://wa.me/27845893702"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-display uppercase tracking-wider text-sm hover:bg-[hsl(142,70%,40%)] transition-colors"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>

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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Your Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name *" className={inputClass("firstName")} />
                        {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name *" className={inputClass("lastName")} />
                        {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                      </div>
                      <div>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className={inputClass("email")} />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className={inputClass("phone")} />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Service Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <select name="clientType" value={form.clientType} onChange={handleChange} className={inputClass("clientType")}>
                          <option value="">Client Type *</option>
                          {clientTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors.clientType && <p className="text-destructive text-xs mt-1">{errors.clientType}</p>}
                      </div>
                      <div>
                        <select name="serviceRequired" value={form.serviceRequired} onChange={handleChange} className={inputClass("serviceRequired")}>
                          <option value="">Service Required *</option>
                          {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.serviceRequired && <p className="text-destructive text-xs mt-1">{errors.serviceRequired}</p>}
                      </div>
                      <div>
                        <input name="address" value={form.address} onChange={handleChange} placeholder="Service Address / Area" className={inputClass("address")} />
                      </div>
                      <div>
                        <select name="urgency" value={form.urgency} onChange={handleChange} className={inputClass("urgency")}>
                          <option value="">How Urgent Is This?</option>
                          {urgencyOptions.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell Us More * — Describe your issue or requirements"
                        className={inputClass("message")}
                      />
                      {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-muted-foreground text-xs">Your details are kept private and will not be shared.</p>
                    <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        "Send Quote Request"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
