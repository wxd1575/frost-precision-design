import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      // If they already accepted previously, ensure Google Analytics knows about it on load
      applyConsent(consent === "granted" ? "granted" : "denied");
    }
  }, []);

  const applyConsent = (status: "granted" | "denied") => {
    // Only apply if gtag function is available globally
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
        analytics_storage: status,
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "granted");
    applyConsent("granted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "denied");
    applyConsent("denied");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
          className="fixed bottom-0 sm:bottom-6 left-0 sm:left-6 z-[100] w-full sm:w-auto"
        >
          <div className="bg-card border-t sm:border border-border/50 sm:rounded-2xl p-5 sm:max-w-[400px] shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display uppercase tracking-widest text-sm font-800 text-secondary mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4 font-body">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReject} 
                    className="flex-1 text-xs"
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAccept} 
                    className="flex-1 text-xs"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
