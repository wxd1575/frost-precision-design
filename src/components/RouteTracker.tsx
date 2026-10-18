import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureAttribution } from "@/lib/tracking/attribution";
import { track } from "@/lib/tracking/events";

/** Sends a page_view on every client-side route change (the SPA never reloads). */
const RouteTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    captureAttribution();
    // Lazy routes and react-helmet-async set the page title after the route
    // changes. Wait for the <title> to change (or give up after 1.5s) so
    // page_title is not the previous page's or the site default.
    let sent = false;
    let timer = 0;
    const observer = new MutationObserver(() => send());
    const send = () => {
      if (sent) return;
      sent = true;
      observer.disconnect();
      window.clearTimeout(timer);
      track("page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    };
    // Watch the whole head: react-helmet-async swaps the <title> element out
    // rather than editing it, so an observer bound to the old element never fires.
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
    timer = window.setTimeout(send, 1500);
    return () => {
      sent = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
};

export default RouteTracker;
