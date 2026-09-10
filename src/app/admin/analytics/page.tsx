"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Laptop,
  Loader2,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tablet,
  Tag,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "@/lib/products";

type KPI = {
  activeVisitors: number;
  uniqueVisitors: number;
  pageviews: number;
  addToCart: number;
  ordersPlaced: number;
  conversionRate: string;
  totalEvents: number;
};

type LocationStat = {
  city: string;
  country: string;
  count: number;
};

type PageStat = {
  path: string;
  views: number;
};

type EventCount = {
  name: string;
  count: number;
};

type Step = {
  id: string;
  event: string;
  path: string;
  metadata: Record<string, unknown> | null;
  time: string;
};

type VisitorJourney = {
  visitorId: string;
  customerName: string | null;
  customerEmail: string | null;
  city: string | null;
  country: string | null;
  region: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  firstSeen: string;
  lastSeen: string;
  steps: Step[];
};

type RawEvent = {
  id: string;
  visitorId: string;
  customerName: string | null;
  customerEmail: string | null;
  event: string;
  path: string;
  city: string | null;
  country: string | null;
  region: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  metadata: Record<string, unknown> | null;
  time: string;
};

type AnalyticsData = {
  kpis: KPI;
  topLocations: LocationStat[];
  topPages: PageStat[];
  eventCounts: EventCount[];
  visitorJourneys: VisitorJourney[];
  recentEvents: RawEvent[];
  series: { date: string; views: number; visitors: number }[];
};

const EVENT_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  page_view: { label: "Page View", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  product_view: { label: "Product View", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  add_to_cart: { label: "Add to Cart", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  remove_from_cart: { label: "Remove Cart", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  open_cart: { label: "View Cart", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  begin_checkout: { label: "Checkout Started", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  apply_coupon: { label: "Coupon Applied", bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  order_placed: { label: "Order Placed 🎉", bg: "bg-green-100", text: "text-green-800", dot: "bg-green-600" },
};

function formatTimeAgo(isoString: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(isoString).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("7d");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"journeys" | "locations" | "pages" | "stream">("journeys");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}&event=${eventFilter}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  }, [range, eventFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval every 12 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchData();
    }, 12000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchData]);

  return (
    <div className="space-y-6">
      {/* top banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">
              Traffic & Visitor Analyzer
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 shadow-xs ring-1 ring-emerald-600/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-[var(--forest-deep)]/70 sm:text-sm">
            Track customer locations, page-to-page journeys, devices, and e-commerce conversions in real time.
          </p>
        </div>

        {/* range selectors & refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-white p-1 shadow-xs ring-1 ring-[var(--forest)]/10">
            {(
              [
                { id: "today", label: "Today" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  range === r.id
                    ? "bg-[var(--forest)] text-[var(--cream)] shadow-xs"
                    : "text-[var(--forest)]/70 hover:text-[var(--forest)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="flex h-8 items-center gap-1.5 rounded-xl border border-[var(--forest)]/15 bg-white px-3 text-xs font-bold text-[var(--forest)] shadow-xs transition hover:bg-[var(--cloud)] active:scale-95 sm:h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden min-[420px]:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh((v) => !v)}
            title={autoRefresh ? "Auto-refresh is ON" : "Auto-refresh is OFF"}
            className={`flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition sm:h-9 ${
              autoRefresh
                ? "bg-emerald-100 text-emerald-800"
                : "bg-stone-200 text-stone-600"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px]">{autoRefresh ? "Live Feed ON" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* KPI stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Active Now */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Active Now</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-black text-emerald-600 sm:text-3xl">
            {data?.kpis.activeVisitors ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Last 15 minutes</p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Visitors</span>
            <Users className="h-3.5 w-3.5 text-[var(--forest)]/50" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-[var(--forest)] sm:text-3xl">
            {data?.kpis.uniqueVisitors ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Unique devices</p>
        </div>

        {/* Pageviews */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Pageviews</span>
            <Eye className="h-3.5 w-3.5 text-[var(--forest)]/50" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-[var(--forest)] sm:text-3xl">
            {data?.kpis.pageviews ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Total views</p>
        </div>

        {/* Add to Carts */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Cart Adds</span>
            <ShoppingCart className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-emerald-700 sm:text-3xl">
            {data?.kpis.addToCart ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Intent to buy</p>
        </div>

        {/* Orders Placed */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Orders</span>
            <ShoppingBag className="h-3.5 w-3.5 text-[var(--forest)]" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-[var(--forest)] sm:text-3xl">
            {data?.kpis.ordersPlaced ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Purchases</p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--olive)]">
            <span>Conversion</span>
            <TrendingUp className="h-3.5 w-3.5 text-[var(--sage-deep)]" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-[var(--sage-deep)] sm:text-3xl">
            {data?.kpis.conversionRate ?? "0"}%
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--forest-deep)]/50">Visitor to buyer</p>
        </div>
      </div>

      {/* Traffic over time chart */}
      {data && data.series.length > 0 && (
        <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] sm:p-6">
          <div className="flex items-center justify-between border-b border-[var(--forest)]/10 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">Traffic Trends</h2>
              <p className="text-xs font-medium text-[var(--forest-deep)]/60">Page views and unique visitor volume</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Page Views
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Visitors
              </span>
            </div>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ece3" />
                <XAxis dataKey="date" stroke="#8c857b" fontSize={11} />
                <YAxis stroke="#8c857b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#223326",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#viewGrad)" />
                <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#visGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Interactive Tabs */}
      <div className="space-y-4">
        {/* tab navigation bar */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[var(--forest)]/10 pb-2">
          {(
            [
              { id: "journeys", label: "Customer Journeys (Page-to-Page)", icon: Activity, count: data?.visitorJourneys.length },
              { id: "locations", label: "Visitor Locations", icon: MapPin, count: data?.topLocations.length },
              { id: "pages", label: "Top Pages", icon: Eye, count: data?.topPages.length },
              { id: "stream", label: "Live Event Stream", icon: Zap, count: data?.recentEvents.length },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                  active
                    ? "bg-[var(--forest)] text-[var(--cream)] shadow-sm"
                    : "bg-white text-[var(--forest)]/70 hover:bg-[var(--cloud)] hover:text-[var(--forest)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      active ? "bg-white/20 text-white" : "bg-[var(--cloud)] text-[var(--forest)]"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Customer Journeys */}
        {activeTab === "journeys" && (
          <div className="space-y-3">
            {loading && !data ? (
              <div className="rounded-3xl bg-white p-12 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--forest)]" />
                <p className="mt-2 text-xs font-semibold text-[var(--forest-deep)]/60">Loading customer journeys...</p>
              </div>
            ) : !data?.visitorJourneys.length ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-xs">
                <Activity className="mx-auto h-8 w-8 text-[var(--olive)]" />
                <h3 className="mt-2 text-base font-extrabold text-[var(--forest)]">No visitor journeys recorded yet</h3>
                <p className="mt-1 text-xs text-[var(--forest-deep)]/60">
                  As visitors browse the store, their page-by-page paths will appear here in real time.
                </p>
              </div>
            ) : (
              data.visitorJourneys.map((j) => {
                const isCustomer = Boolean(j.customerEmail || j.customerName);
                const hasOrder = j.steps.some((s) => s.event === "order_placed");
                const hasCart = j.steps.some((s) => s.event === "add_to_cart");

                return (
                  <div
                    key={j.visitorId}
                    className={`rounded-2xl border bg-white p-4 shadow-xs transition hover:shadow-md sm:p-5 ${
                      hasOrder
                        ? "border-green-300 ring-2 ring-green-100"
                        : hasCart
                          ? "border-emerald-200"
                          : "border-[var(--forest)]/10"
                    }`}
                  >
                    {/* customer / visitor header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--forest)]/8 pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                            hasOrder
                              ? "bg-green-100 text-green-800"
                              : isCustomer
                                ? "bg-[var(--sage-soft)] text-[var(--forest)]"
                                : "bg-[var(--cloud)] text-[var(--forest-deep)]/70"
                          }`}
                        >
                          {isCustomer ? (
                            j.customerName ? j.customerName[0].toUpperCase() : "C"
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-[var(--forest)]">
                              {j.customerName || (j.customerEmail ? j.customerEmail : `Guest Visitor #${j.visitorId.slice(0, 8)}`)}
                            </h3>
                            {isCustomer && (
                              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-800">
                                Verified Customer
                              </span>
                            )}
                            {hasOrder && (
                              <span className="rounded-md bg-green-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                                Purchased 🏆
                              </span>
                            )}
                          </div>
                          {j.customerEmail && (
                            <p className="text-xs font-medium text-[var(--forest-deep)]/65">{j.customerEmail}</p>
                          )}
                        </div>
                      </div>

                      {/* metadata chips */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                        {/* location */}
                        <span className="flex items-center gap-1 rounded-lg bg-[var(--cloud)] px-2.5 py-1 text-[var(--forest)]">
                          <MapPin className="h-3 w-3 text-[var(--olive)]" />
                          {j.city ? `${j.city}${j.region ? `, ${j.region}` : ""}${j.country ? `, ${j.country}` : ""}` : j.country || "Unknown Location"}
                        </span>

                        {/* device */}
                        <span className="flex items-center gap-1 rounded-lg bg-[var(--cloud)] px-2.5 py-1 text-[var(--forest)]/80">
                          {j.device === "Mobile" ? (
                            <Smartphone className="h-3 w-3 text-[var(--sage-deep)]" />
                          ) : j.device === "Tablet" ? (
                            <Tablet className="h-3 w-3 text-[var(--sage-deep)]" />
                          ) : (
                            <Laptop className="h-3 w-3 text-[var(--sage-deep)]" />
                          )}
                          {j.device || "Desktop"} · {j.browser || "Web"}
                        </span>

                        {/* time ago */}
                        <span className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-[11px] text-stone-600">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(j.lastSeen)}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step page path flow */}
                    <div className="mt-3.5">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                        Browsing Journey ({j.steps.length} actions)
                      </p>
                      <div className="no-scrollbar flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                        {j.steps.map((step, idx) => {
                          const cfg = EVENT_CONFIG[step.event] ?? {
                            label: step.event,
                            bg: "bg-gray-100",
                            text: "text-gray-700",
                            dot: "bg-gray-500",
                          };

                          return (
                            <div key={step.id || idx} className="flex items-center gap-1.5">
                              <div
                                className={`flex items-center gap-1.5 rounded-xl border border-[var(--forest)]/10 px-2.5 py-1.5 shadow-2xs ${cfg.bg}`}
                                title={`${step.event} at ${new Date(step.time).toLocaleTimeString()}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                <span className={`font-bold ${cfg.text}`}>{cfg.label}</span>
                                <span className="font-mono text-[11px] text-[var(--forest)]/70">
                                  {step.path}
                                </span>
                                {step.metadata && typeof step.metadata === "object" && (
                                  <>
                                    {"slug" in step.metadata && (
                                      <span className="rounded bg-white/70 px-1 py-0.2 text-[10px] font-bold text-[var(--forest)]">
                                        {String(step.metadata.slug)}
                                      </span>
                                    )}
                                    {"total" in step.metadata && (
                                      <span className="rounded bg-green-200 px-1 py-0.2 text-[10px] font-extrabold text-green-900">
                                        {formatINR(Number(step.metadata.total))}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>

                              {idx < j.steps.length - 1 && (
                                <ChevronRight className="h-3 w-3 shrink-0 text-[var(--forest)]/30" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Locations & Geolocation */}
        {activeTab === "locations" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Cities */}
            <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--forest)]/10 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">Top Visitor Cities</h2>
                  <p className="text-xs font-medium text-[var(--forest-deep)]/60">Where your visitors are located</p>
                </div>
                <Globe className="h-4 w-4 text-[var(--olive)]" />
              </div>

              <div className="mt-4 space-y-3">
                {!data?.topLocations.length ? (
                  <p className="py-8 text-center text-xs text-[var(--forest-deep)]/50">No location data captured yet.</p>
                ) : (
                  data.topLocations.map((loc, idx) => {
                    const totalLocEvents = data.topLocations.reduce((s, l) => s + l.count, 0) || 1;
                    const pct = Math.round((loc.count / totalLocEvents) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--forest)]">
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--cloud)] text-[10px] font-extrabold text-[var(--forest)]">
                              {idx + 1}
                            </span>
                            <span>{loc.city}</span>
                            <span className="text-[11px] font-semibold text-[var(--forest-deep)]/50">
                              ({loc.country})
                            </span>
                          </span>
                          <span>
                            {loc.count} visits <span className="font-medium text-[var(--forest-deep)]/50">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--cloud)]">
                          <div
                            className="h-full rounded-full bg-[var(--forest)] transition-all duration-500"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Event Distribution */}
            <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--forest)]/10 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">Event Breakdown</h2>
                  <p className="text-xs font-medium text-[var(--forest-deep)]/60">Distribution of customer actions</p>
                </div>
                <Tag className="h-4 w-4 text-[var(--olive)]" />
              </div>

              <div className="mt-4 space-y-2.5">
                {data?.eventCounts.map((ev) => {
                  const cfg = EVENT_CONFIG[ev.name] ?? {
                    label: ev.name,
                    bg: "bg-stone-50",
                    text: "text-stone-700",
                    dot: "bg-stone-400",
                  };
                  return (
                    <div
                      key={ev.name}
                      className="flex items-center justify-between rounded-xl border border-[var(--forest)]/8 p-3 text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <span>{cfg.label}</span>
                      </span>
                      <span className="rounded-lg bg-[var(--cloud)] px-2.5 py-1 text-[var(--forest)]">
                        {ev.count} events
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Top Pages */}
        {activeTab === "pages" && (
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--forest)]/10 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">Top Visited Pages</h2>
                <p className="text-xs font-medium text-[var(--forest-deep)]/60">Most popular routes browsed by visitors</p>
              </div>
              <Eye className="h-4 w-4 text-[var(--olive)]" />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--forest)]/8 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">Page Path</th>
                    <th className="pb-3 text-right">Views</th>
                    <th className="pb-3 text-right">Quick Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--forest)]/6">
                  {data?.topPages.map((p, idx) => (
                    <tr key={p.path} className="hover:bg-[var(--cream-page)]/50">
                      <td className="py-3 text-xs font-extrabold text-[var(--forest-deep)]/60">#{idx + 1}</td>
                      <td className="py-3 font-mono text-xs font-bold text-[var(--forest)]">{p.path}</td>
                      <td className="py-3 text-right text-xs font-extrabold text-[var(--forest)]">{p.views}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={p.path}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--sage-deep)] hover:underline"
                        >
                          Visit <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Live Event Stream */}
        {activeTab === "stream" && (
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[var(--forest)]/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[var(--forest)] sm:text-lg">Live Telemetry Feed</h2>
                <p className="text-xs font-medium text-[var(--forest-deep)]/60">Every individual hit and trigger in real time</p>
              </div>

              {/* event filter selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--olive)]">Filter:</span>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="rounded-xl border border-[var(--forest)]/15 bg-[var(--cream-page)] px-3 py-1.5 text-xs font-bold text-[var(--forest)] outline-none"
                >
                  <option value="all">All Events</option>
                  <option value="page_view">Page Views</option>
                  <option value="product_view">Product Views</option>
                  <option value="add_to_cart">Add to Cart</option>
                  <option value="begin_checkout">Checkout Started</option>
                  <option value="order_placed">Orders Placed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 divide-y divide-[var(--forest)]/6">
              {!data?.recentEvents.length ? (
                <p className="py-8 text-center text-xs text-[var(--forest-deep)]/50">No events found for this filter.</p>
              ) : (
                data.recentEvents.map((e) => {
                  const cfg = EVENT_CONFIG[e.event] ?? {
                    label: e.event,
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    dot: "bg-gray-500",
                  };

                  return (
                    <div key={e.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>

                        <span className="font-mono text-xs font-bold text-[var(--forest)]">{e.path}</span>

                        {e.customerName && (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            {e.customerName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[var(--forest-deep)]/60">
                        {e.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[var(--olive)]" />
                            {e.city}, {e.country}
                          </span>
                        )}
                        <span>·</span>
                        <span>{e.device || "Desktop"}</span>
                        <span>·</span>
                        <span>{formatTimeAgo(e.time)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
