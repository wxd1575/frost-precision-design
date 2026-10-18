import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureAttribution } from "@/lib/tracking/attribution";
import { track } from "@/lib/tracking/events";

/** Sends a page_view on every client-side route change (the SPA never reloads). */
const RouteTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    captureAttribution();
    track("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
};

export default RouteTracker;
