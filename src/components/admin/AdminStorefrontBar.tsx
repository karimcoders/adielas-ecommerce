"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "CMS", href: "/admin/cms", icon: Sliders },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminStorefrontBar() {
  const { isAdmin } = useCurrentUser();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAdmin) return null;

  return (
    <aside
      aria-label="Admin Navigation"
      className="fixed bottom-3 left-1/2 z-[990] -translate-x-1/2 transition-all duration-300 ease-out"
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-[#1e2a22]/95 px-3.5 py-2 text-xs font-bold text-amber-300 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-[#152019] hover:scale-105 active:scale-95"
          title="Open Admin Navigation"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
          <span>Admin</span>
          <ChevronUp className="h-3 w-3 text-white/70" />
        </button>
      ) : (
        <div className="flex max-w-[95vw] items-center gap-1 rounded-full border border-amber-400/35 bg-[#17241b]/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur sm:gap-2 sm:p-2">
          {/* Badge */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/30 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden min-[380px]:inline">Admin</span>
          </Link>

          {/* Quick links */}
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white/85 transition hover:bg-white/10 hover:text-white sm:px-3 sm:py-1.5"
              >
                <Icon className="h-3.5 w-3.5 text-amber-300/80 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Minimize button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse admin bar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            title="Minimize"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
}
