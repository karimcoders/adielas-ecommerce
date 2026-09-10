"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TicketPercent,
  LogOut,
  Store,
  PenSquare,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/cms", label: "Website CMS", Icon: PenSquare },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/coupons", label: "Coupons", Icon: TicketPercent },
  { href: "/admin/analytics", label: "Traffic & Analyzer", Icon: Activity },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // login page renders standalone (no shell)
  if (pathname === "/admin/login") return <>{children}</>;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[var(--cream-page)]">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[var(--forest-deep)] text-[var(--cream)] max-lg:hidden">
        <div className="flex items-center gap-3 px-6 pb-6 pt-7">
          <img
            src="/images/adielas/logo.png"
            alt="ADIELAS"
            className="h-10 w-auto rounded-lg bg-white/95 p-1"
          />
          <div>
            <p className="text-sm font-extrabold tracking-wide">ADIELAS</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Store Admin
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ href, label, Icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-white/12 text-white shadow-inner"
                    : "text-white/65 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--sage-deep)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/8 hover:text-white"
          >
            <Store className="h-4 w-4" />
            View storefront
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/8 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[var(--forest-deep)] px-4 py-2.5 text-[var(--cream)] lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open admin menu"}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition active:scale-95"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/adielas/logo.png" alt="" className="h-7 w-auto rounded bg-white/95 p-0.5" />
            <div>
              <span className="text-xs font-extrabold tracking-wide">ADIELAS</span>
              <span className="ml-1.5 rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--sage-soft)]">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            aria-label="View storefront"
            className="flex h-8 items-center gap-1 rounded-lg bg-white/10 px-2.5 text-xs font-semibold text-white/90 transition hover:bg-white/15"
          >
            <Store className="h-3.5 w-3.5" />
            <span className="hidden min-[380px]:inline">Store</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* mobile nav horizontal rail */}
      <div className="no-scrollbar fixed inset-x-0 top-[49px] z-30 flex gap-1.5 overflow-x-auto border-b border-white/10 bg-[var(--forest-deep)] px-3 py-2 lg:hidden">
        {nav.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                active ? "bg-white/20 text-white shadow-sm ring-1 ring-white/25" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* mobile slide-over drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-[var(--forest-deep)] p-5 text-[var(--cream)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <img src="/images/adielas/logo.png" alt="" className="h-8 w-auto rounded bg-white/95 p-0.5" />
                <div>
                  <p className="text-sm font-extrabold tracking-wide">ADIELAS</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Admin Menu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
              {nav.map(({ href, label, Icon }) => {
                const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                      active ? "bg-white/15 text-white shadow-inner" : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {active && <span className="ml-auto h-2 w-2 rounded-full bg-[var(--sage-deep)]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-1.5 border-t border-white/10 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white"
              >
                <Store className="h-4 w-4" />
                View storefront
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#f87171] hover:bg-white/8"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* content */}
      <div className="min-h-screen min-w-0 flex-1 lg:pl-[248px]">
        <div className="px-3 pb-16 pt-[98px] sm:px-6 sm:pt-[104px] lg:px-8 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}
