import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary shadow-xl py-3 border-b border-white/5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/frostice-logo-white.png" 
            alt="Frost & Ice Aircon" 
            className="w-40 sm:w-48 lg:w-56 h-auto object-contain" 
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-display text-base uppercase tracking-widest transition-colors ${
                location.pathname === link.to
                  ? "text-secondary font-bold"
                  : "text-frost/90 hover:text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+27845893702" className="flex items-center gap-2 text-frost group hover:text-secondary transition-colors font-display text-base tracking-widest">
            <Phone size={14} className="group-hover:scale-110 transition-transform" />
            <span>+27 84 589 3702</span>
          </a>
          <Link to="/contact">
            <Button variant="secondary" size="sm" className="font-bold uppercase tracking-widest px-6">
              Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-frost min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md active:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-display text-xl uppercase tracking-widest ${
                    location.pathname === link.to ? "text-secondary font-bold" : "text-frost/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+27845893702" className="flex items-center gap-2 text-frost/80 text-lg font-display tracking-widest">
                <Phone size={18} />
                <span>+27 84 589 3702</span>
              </a>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="w-full font-bold uppercase tracking-widest">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
