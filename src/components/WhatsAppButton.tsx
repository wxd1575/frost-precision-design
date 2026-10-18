import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import TrackedLink from "@/components/TrackedLink";
import { whatsappUrl } from "@/lib/tracking/config";

const WhatsAppButton = () => {
  const { pathname } = useLocation();

  return (
    <TrackedLink
      kind="whatsapp"
      placement="floating_button"
      href={whatsappUrl(`Hi Frosty Ice, I'd like some help with aircon. (from ${pathname})`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[hsl(142,70%,45%)] text-primary-foreground shadow-lg hover:bg-[hsl(142,70%,40%)] transition-all duration-300 hover:scale-110 animate-pulse-glow"
    >
      <MessageCircle className="h-6 w-6" />
    </TrackedLink>
  );
};

export default WhatsAppButton;
