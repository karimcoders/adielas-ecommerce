"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracker";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Never track admin panel pages as customer visits
    if (pathname.startsWith("/admin")) return;

    // Avoid duplicate triggers on the same exact path in rapid succession
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // Track pageview
    const title = typeof document !== "undefined" ? document.title : "";
    trackEvent("page_view", { title }, pathname);

    // If viewing a product detail page, trigger product_view
    if (pathname.startsWith("/shop/") && pathname.length > 6) {
      const slug = pathname.replace("/shop/", "").split("/")[0];
      if (slug) {
        trackEvent("product_view", { slug }, pathname);
      }
    }
  }, [pathname]);

  return null;
}
