"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/more/Navbar";
import { Footer } from "@/components/more/Footer";
import { CartDrawer } from "@/components/more/CartDrawer";
import { ScrollProgress } from "@/components/more/motion";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

/**
 * Storefront chrome (navbar, footer, cart drawer) — hidden on /admin routes
 * where the app switches to the admin dashboard shell.
 */
export function SiteChrome({
  children,
  cmsFooter,
  cmsSettings,
}: {
  children: ReactNode;
  cmsFooter?: unknown;
  cmsSettings?: unknown;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <AnalyticsTracker />
      <ScrollProgress />
      <Navbar />
      {children}
      <Footer
        className="mt-auto"
        cms={{ footer: cmsFooter as never, settings: cmsSettings as never }}
      />
      <CartDrawer />
    </>
  );
}
