import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GOOGLE_REVIEWS, GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_MAPS_URL } from "@/data/reviews";


const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Testimonials = () => {
  return (
    <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {GOOGLE_REVIEWS.map((t, i) => (
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
            <p className="text-xs text-muted-foreground mt-0.5">Google review · {t.when}</p>
          </div>
        </motion.div>
      ))}
    </div>
    <p className="text-center text-sm text-muted-foreground mt-8">
      <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
        {GOOGLE_RATING.toFixed(1)} · {GOOGLE_REVIEW_COUNT} Google reviews
      </a>
    </p>
    </div>
  );
};

export default Testimonials;
