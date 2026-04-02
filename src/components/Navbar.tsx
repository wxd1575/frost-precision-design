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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-secondary/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] py-3 border-b border-white/5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/frostice-logo-white.png" 
            alt="Frost & Ice Aircon" 
            className="w-48 sm:w-56 lg:w-72 h-auto object-contain" 
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative font-display text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 ${
                location.pathname === link.to
                  ? "text-ice drop-shadow-[0_0_8px_rgba(195,236,255,0.6)]"
                  : "text-frost/80 hover:text-ice"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+27845893702" className="group flex items-center gap-2 text-frost/80 hover:text-ice transition-all duration-300 hover:-translate-y-0.5">
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display text-base lg:text-lg tracking-widest">+27 84 589 3702</span>
          </a>
          <Link to="/contact">
            <Button variant="hero" size="default">
              Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-frost p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-secondary/98 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-display text-lg uppercase tracking-widest py-2 border-b border-ice/10 ${
                    location.pathname === link.to ? "text-ice" : "text-frost/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+27845893702" className="flex items-center gap-2 text-frost/80 py-2">
                <Phone className="h-4 w-4" />
                <span className="font-display tracking-wider">+27 84 589 3702</span>
              </a>
              <Link to="/contact">
                <Button variant="hero" size="lg" className="w-full">
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
