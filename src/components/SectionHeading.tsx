import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  heading: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}

const SectionHeading = ({ label, heading, description, light, center = true }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      <span className={`font-display text-xs uppercase tracking-[0.3em] ${light ? "text-ice" : "text-primary"} mb-2 block`}>
        {label}
      </span>
      <h2 className={`font-display text-4xl md:text-5xl font-800 uppercase leading-tight ${light ? "text-frost" : "text-secondary"}`}>
        {heading}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl ${center ? "mx-auto" : ""} text-lg ${light ? "text-frost/70" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
