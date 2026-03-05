import { motion } from "framer-motion";
import { ShieldCheck, Award, Leaf, Zap } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Award, label: "Certified Technicians" },
  { icon: Leaf, label: "Eco-Friendly Systems" },
  { icon: Zap, label: "Emergency Response" },
];

interface ClientLogosProps {
  variant?: "light" | "dark";
}

const ClientLogos = ({ variant = "dark" }: ClientLogosProps) => {
  const isLight = variant === "light";
  
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {badges.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className={`h-14 w-14 rounded-full flex items-center justify-center ${
            isLight ? "bg-frost/10 border border-ice/20" : "bg-primary/10 border border-primary/20"
          }`}>
            <b.icon className={`h-6 w-6 ${isLight ? "text-ice" : "text-primary"}`} />
          </div>
          <span className={`font-display text-[10px] uppercase tracking-widest ${
            isLight ? "text-frost/60" : "text-muted-foreground"
          }`}>
            {b.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default ClientLogos;
