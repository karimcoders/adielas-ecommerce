"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  IndianRupee,
  Package,
  PenSquare,
  ShoppingCart,
  TicketPercent,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatINR } from "@/lib/products";

type Stats = {
  kpis: {
    revenue: number;
    orders: number;
    customers: number;
    pendingCount: number;
    activeCoupons: number;
    avgOrder: number;
  };
  series: { date: string; revenue: number; orders: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    itemCount: number;
  }[];
  lowStock: { id: string; name: string; stock: number; image: string }[];
  topProducts: { slug: string; name: string; qty: number; revenue: number }[];
  statusCounts: { status: string; count: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  PLACED: "#c99a4e",
  CONFIRMED: "#a98139",
  SHIPPED: "#8a6a2f",
  DELIVERED: "#5c7a3f",
  CANCELLED: "#b3352f",
};

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function statusBadge(status: string) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide"
      style={{ backgroundColor: `${STATUS_COLORS[status]}22`, color: STATUS_COLORS[status] }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-sm font-semibold text-[#b3352f] shadow">
        Could not load dashboard. Refresh the page or log in again.
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/70" />
        ))}
      </div>
    );
  }

  const k = stats.kpis;
  const cards = [
    { label: "Total revenue", value: formatINR(k.revenue), sub: `${formatINR(k.avgOrder)} avg order`, Icon: IndianRupee },
    { label: "Orders", value: String(k.orders), sub: `${k.pendingCount} need action`, Icon: ShoppingCart },
    { label: "Customers", value: String(k.customers), sub: "registered accounts", Icon: Users },
    { label: "Active coupons", value: String(k.activeCoupons), sub: "live promotions", Icon: TicketPercent },
  ];

  return (
    <div className="space-y-6">
      {/* heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--forest-deep)]/70">
            Last 30 days at the ADIELAS kitchen
          </p>
        </div>
        <Link
          href="/admin/cms"
          className="flex items-center gap-1.5 rounded-full border border-[var(--forest)]/25 bg-white px-4 py-2 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--sage-soft)]"
        >
          <PenSquare className="h-3.5 w-3.5" /> Edit website (CMS)
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)]"
        >
          Manage orders <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, sub, Icon }) => (
          <div key={label} className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--olive)]">
                {label}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sage-soft)]">
                <Icon className="h-4 w-4 text-[var(--forest)]" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">
              {value}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--forest-deep)]/60">{sub}</p>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* revenue area */}
        <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[var(--forest)]">Revenue — last 30 days</h2>
            <span className="flex items-center gap-1 rounded-full bg-[var(--sage-soft)] px-3 py-1 text-xs font-bold text-[var(--forest)]">
              <TrendingUp className="h-3.5 w-3.5" /> live
            </span>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c99a4e" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#c99a4e" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#451f2214" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => d.slice(5)}
                  tick={{ fontSize: 11, fill: "#8a6a6c" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tickFormatter={(v: number) => `₹${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  tick={{ fontSize: 11, fill: "#8a6a6c" }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip
                  formatter={(v) => [formatINR(Number(v)), "Revenue"]}
                  labelFormatter={(l) => `Date: ${l}`}
                  contentStyle={{ borderRadius: 14, border: "1px solid #451f2222", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a98139" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* status donut */}
        <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
          <h2 className="text-base font-extrabold text-[var(--forest)]">Orders by status</h2>
          <div className="mt-2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusCounts.filter((s) => s.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {stats.statusCounts
                    .filter((s) => s.count > 0)
                    .map((s) => (
                      <Cell key={s.status} fill={STATUS_COLORS[s.status]} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [`${v} orders`, STATUS_LABELS[String(name)] ?? String(name)]}
                  contentStyle={{ borderRadius: 14, border: "1px solid #451f2222", fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5">
            {stats.statusCounts.map((s) => (
              <li key={s.status} className="flex items-center gap-1.5 text-xs font-bold text-[var(--forest-deep)]/80">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] }} />
                {STATUS_LABELS[s.status]} · {s.count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* row 3: recent orders + low stock + top products */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* recent orders */}
        <div className="min-w-0 rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)] xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[var(--forest)]">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-[var(--olive)] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                  <th className="pb-2 pr-3">Order</th>
                  <th className="pb-2 pr-3">Customer</th>
                  <th className="pb-2 pr-3">Items</th>
                  <th className="pb-2 pr-3">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--forest)]/8">
                {stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 pr-3 font-extrabold text-[var(--forest)]">{o.orderNumber}</td>
                    <td className="py-2.5 pr-3 font-semibold text-[var(--forest-deep)]/85">{o.customerName}</td>
                    <td className="py-2.5 pr-3 text-[var(--forest-deep)]/70">{o.itemCount}</td>
                    <td className="py-2.5 pr-3 font-bold text-[var(--forest)]">{formatINR(o.total)}</td>
                    <td className="py-2.5">{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {/* low stock */}
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-[var(--forest)]">
              <AlertTriangle className="h-4 w-4 text-[#b3352f]" /> Low stock
            </h2>
            {stats.lowStock.length === 0 ? (
              <p className="mt-3 text-sm font-medium text-[var(--forest-deep)]/60">
                All products are well stocked. 🎉
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {stats.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--forest)]">{p.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        p.stock === 0 ? "bg-[#fbeaea] text-[#b3352f]" : "bg-[var(--sage-soft)] text-[var(--forest)]"
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* top products */}
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-[var(--forest)]">
              <Package className="h-4 w-4 text-[var(--olive)]" /> Top sellers
            </h2>
            {stats.topProducts.length === 0 ? (
              <p className="mt-3 text-sm font-medium text-[var(--forest-deep)]/60">No sales yet.</p>
            ) : (
              <div className="mt-3 h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 0, right: 12 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 10.5, fill: "#451f22" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v, _n, item) => [`${v} sold · ${formatINR(item?.payload?.revenue ?? 0)}`, "Sales"]}
                      contentStyle={{ borderRadius: 14, border: "1px solid #451f2222", fontSize: 12.5 }}
                    />
                    <Bar dataKey="qty" fill="#c99a4e" radius={[0, 8, 8, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
