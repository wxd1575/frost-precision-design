import { Link } from "react-router-dom";
import { Phone, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-frost">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="block mb-6 transition-opacity hover:opacity-80">
              <img 
                src="/frostice-logo-white.png" 
                alt="Frost & Ice Aircon" 
                className="w-56 md:w-64 lg:w-80 h-auto object-contain" 
              />
            </Link>
            <p className="text-frost/60 text-sm leading-relaxed">
              Delivering innovative and reliable air conditioning and refrigeration systems to create optimal environments for our clients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ice mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "About Us", to: "/about" },
                { label: "Get a Quote", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-frost/60 hover:text-ice text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ice mb-4">Services</h4>
            <ul className="space-y-2">
              {["Air Conditioning", "Refrigeration", "Transport Refrigeration", "Electrical"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-frost/60 hover:text-ice text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-ice mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-frost/60 text-sm">
                <Phone className="h-4 w-4 text-ice" />
                <a href="tel:+27845893702" className="hover:text-ice transition-colors">+27 84 589 3702</a>
              </li>
              <li className="flex items-center gap-3 text-frost/60 text-sm">
                <Mail className="h-4 w-4 text-ice" />
                <a href="mailto:info@frosticeaircon.com" className="hover:text-ice transition-colors">info@frosticeaircon.com</a>
              </li>
              <li className="flex items-center gap-3 text-frost/60 text-sm">
                <Globe className="h-4 w-4 text-ice" />
                <span>www.frosticeaircon.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ice/10 mt-12 pt-8 text-center">
          <p className="text-frost/40 text-xs font-body">
            © 2024 Frost Ice Aircon & Refrigeration (PTY) LTD. All rights reserved. | Reliable Cooling, Year-Round.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
