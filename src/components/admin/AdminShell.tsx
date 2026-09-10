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
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/cms", label: "Website CMS", Icon: PenSquare },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/coupons", label: "Coupons", Icon: TicketPercent },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-[var(--forest-deep)] px-4 py-3 text-[var(--cream)] lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/images/adielas/logo.png" alt="" className="h-8 w-auto rounded bg-white/95 p-0.5" />
          <span className="text-sm font-extrabold">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="View storefront">
            <Store className="h-4 w-4" />
          </Link>
          <button type="button" onClick={logout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* mobile nav row */}
      <div className="fixed inset-x-0 top-[52px] z-30 flex gap-1 overflow-x-auto bg-[var(--forest-deep)] px-3 pb-3 lg:hidden">
        {nav.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                active ? "bg-white/15 text-white" : "text-white/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* content */}
      <div className="min-h-screen flex-1 lg:pl-[248px]">
        <div className="px-4 pb-16 pt-[104px] sm:px-6 lg:px-8 lg:pt-8">{children}</div>
      </div>
    </div>
  );
}
