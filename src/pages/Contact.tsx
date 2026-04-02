import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, Globe, Clock, MessageCircle, CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const clientTypes = ["Residential", "Commercial", "Industrial", "Transport"];
const serviceOptions = [
  "AC Installation", "AC Repair", "AC Service", "Gas Filling", "Cold Room",
  "Industrial Refrigeration", "Domestic Fridge", "Regas", "Transport Refrigeration", "Electrical", "Other",
];
const urgencyOptions = ["Emergency", "This week", "This month", "Just planning"];

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      clientType: "", serviceRequired: "", address: "", urgency: "", message: "",
    },
  });

  const onSubmit = async (values: QuoteForm) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("contact_submissions").insert([
      {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        client_type: values.clientType,
        service_required: values.serviceRequired,
        address: values.address || null,
        urgency: values.urgency || null,
        message: values.message,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem sending your request. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({ title: "Quote Request Sent!", description: "Our team will be in touch shortly." });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            label="Free Consultation"
            heading="Get a Free Quote"
            description="Fill in the form below and our team will get back to you promptly with a tailored solution for your home or business."
            light
          />
        </div>
      </section>

      <section className="py-20 overflow-hidden">
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
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-display uppercase tracking-wider text-sm hover:bg-[hsl(142,70%,40%)] transition-colors shadow-lg shadow-[hsl(142,70%,45%)]/20"
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

            {/* Form & Success State Container */}
            <div className="lg:col-span-2 relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-card border border-border rounded-lg p-12 text-center w-full max-w-lg mx-auto shadow-xl">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-display text-3xl font-800 uppercase text-secondary mb-3">
                        Quote Request Sent!
                      </h3>
                      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                        Thank you — our team will be in touch with you shortly to discuss your
                        requirements and provide a tailored quote.
                      </p>
                      <Button
                        variant="hero"
                        size="lg"
                        onClick={() => {
                          setSubmitted(false);
                          form.reset();
                        }}
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-card border border-border rounded-lg p-8 shadow-xl relative"
                  >
                    <div className="mb-8">
                      <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Free Consultation</span>
                      <h3 className="font-display text-2xl font-800 uppercase text-secondary mt-1">Request a Quote</h3>
                      <p className="text-muted-foreground text-sm mt-2">Fill in your details below and we'll respond within the hour during business hours.</p>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Your Details */}
                        <div>
                          <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Your Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="First Name *" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Last Name *" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="email" placeholder="Email Address *" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Phone Number *" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Service Details */}
                        <div>
                          <h4 className="font-display text-sm uppercase tracking-widest text-secondary mb-4">Service Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="clientType"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Client Type *" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {clientTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="serviceRequired"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Service Required *" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {serviceOptions.map((service) => (
                                        <SelectItem key={service} value={service}>
                                          {service}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Service Address / Area" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="urgency"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="How Urgent Is This?" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {urgencyOptions.map((urgency) => (
                                        <SelectItem key={urgency} value={urgency}>
                                          {urgency}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell Us More * — Describe your issue or requirements"
                                      className="min-h-[120px] resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                          <p className="text-muted-foreground text-xs text-center sm:text-left">
                            Your details are kept private and never shared.
                          </p>
                          <Button 
                            type="submit" 
                            variant="hero" 
                            size="lg" 
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Send Quote Request"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
