"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ChevronRight,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Palette,
  Percent,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Products & Stock", href: "/admin/products", icon: Boxes },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Discounts & Coupons", href: "/admin/discounts", icon: Percent },
  { name: "Website CMS", href: "/admin/cms", icon: Palette },
  { name: "Store Pages", href: "/admin/pages", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== "ADMIN") {
          router.push("/admin/login");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--forest)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f3ef] text-[#202223]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[var(--forest-deep)] text-[var(--cream)] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="/images/adielas/logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="font-display block text-lg leading-tight tracking-wider text-[var(--cream)]">
                ADIELAS
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Shopify / WP CMS
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
            Store Management
          </div>
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-amber-400 text-[var(--forest-deep)] shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[var(--forest-deep)]" : "text-white/70"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Live Store Footer */}
        <div className="border-t border-white/10 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-3 flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-amber-300" />
              View Online Store
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-white/50" />
          </a>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-[var(--forest-deep)]">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="text-left">
                <span className="block truncate text-xs font-bold text-white max-w-[100px]">
                  {user?.name || "Admin"}
                </span>
                <span className="block text-[10px] text-white/60">Administrator</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top bar for mobile trigger and actions */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
