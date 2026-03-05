import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah van der Merwe",
    role: "Homeowner, Pretoria",
    text: "Frost Ice installed a new split unit in our home within 24 hours of calling. Professional, clean, and the price was exactly as quoted. Haven't had a single issue since.",
    rating: 5,
  },
  {
    name: "James Mkhize",
    role: "Operations Manager, FreshCo Logistics",
    text: "We rely on Frost Ice for our entire fleet of 12 refrigerated trucks. Their 24/7 response has saved us from losing stock multiple times. Absolutely essential partner.",
    rating: 5,
  },
  {
    name: "Linda Botha",
    role: "Restaurant Owner, Sandton",
    text: "When our cold room went down on a Friday night, Frost Ice had a technician on-site within 2 hours. They saved thousands of rands in stock. Can't recommend them enough.",
    rating: 5,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          {...fadeUp}
          transition={{ delay: i * 0.15 }}
          className="bg-card border border-border rounded-lg p-8 relative hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
        >
          <Quote className="h-8 w-8 text-primary/15 absolute top-6 right-6" />
          <div className="flex gap-1 mb-4">
            {Array.from({ length: t.rating }).map((_, j) => (
              <Star key={j} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
            "{t.text}"
          </p>
          <div className="border-t border-border pt-4">
            <p className="font-display text-sm font-700 uppercase text-secondary">{t.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;
