"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  Boxes,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  LogOut,
  Package,
  RefreshCw,
  Search,
  Truck,
  Users,
} from "lucide-react";
import { formatINR } from "@/lib/products";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
};

type OrderItem = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "ADMIN") {
        router.push("/login");
        return;
      }

      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/orders"),
      ]);

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s.stats);
      }

      if (ordersRes.ok) {
        const o = await ordersRes.json();
        setOrders(o.orders || []);
      }
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchesFilter && matchesSearch;
  });

  if (loading && !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--cream-page)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--forest)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream-page)] pb-24 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-[var(--forest-deep)] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-red-300">
                ADMIN CONSOLE
              </span>
              <span className="text-xs font-medium text-white/60">
                Adielas Storefront Management
              </span>
            </div>
            <h1 className="font-display mt-2 text-3xl sm:text-4xl text-[var(--cream)]">
              DASHBOARD &amp; OPERATIONS
            </h1>
          </div>

            <Link
              href="/admin/cms"
              className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/20 px-4 py-2 text-xs font-extrabold text-amber-200 transition hover:bg-amber-400/30"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Content CMS (Edit Pages)
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Boxes className="h-3.5 w-3.5" />
              Inventory &amp; Pricing
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Eye className="h-3.5 w-3.5" />
              Live Store
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--forest)] transition hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_10px_30px_rgba(69,31,34,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Total Revenue
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <DollarSign className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display mt-4 text-3xl text-[var(--forest)]">
              {formatINR(stats?.totalRevenue || 0)}
            </p>
            <span className="mt-1 block text-xs font-medium text-[var(--forest-deep)]/70">
              Across all paid and confirmed orders
            </span>
          </div>

          <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_10px_30px_rgba(69,31,34,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Total Orders
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <Package className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display mt-4 text-3xl text-[var(--forest)]">
              {stats?.totalOrders || 0}
            </p>
            <span className="mt-1 block text-xs font-medium text-[var(--forest-deep)]/70">
              Lifetime customer orders placed
            </span>
          </div>

          <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_10px_30px_rgba(69,31,34,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Pending Fulfillment
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                <Clock className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display mt-4 text-3xl text-[var(--forest)]">
              {stats?.pendingOrders || 0}
            </p>
            <span className="mt-1 block text-xs font-medium text-[var(--forest-deep)]/70">
              Awaiting packing / shipment
            </span>
          </div>

          <div className="rounded-[1.6rem] bg-white p-6 shadow-[0_10px_30px_rgba(69,31,34,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Customers
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
                <Users className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display mt-4 text-3xl text-[var(--forest)]">
              {stats?.totalCustomers || 0}
            </p>
            <span className="mt-1 block text-xs font-medium text-[var(--forest-deep)]/70">
              Registered parent profiles
            </span>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.08)] sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--forest)]/10 pb-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl text-[var(--forest)]">
                ORDER MANAGEMENT ({filteredOrders.length})
              </h2>
              <p className="text-xs font-medium text-[var(--forest-deep)]/70">
                Update fulfillment status and view dispatch information.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="text"
                  placeholder="Search ID, Name, Phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-full border border-[var(--forest)]/15 bg-white py-2 pl-9 pr-4 text-xs font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border border-[var(--forest)]/15 bg-white px-4 py-2 text-xs font-bold text-[var(--forest)] outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                onClick={loadData}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cloud)] text-[var(--forest)] transition hover:bg-[var(--sage-soft)]"
                title="Refresh list"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-sm font-semibold text-[var(--forest-deep)]/60">
                No orders match this filter. Place an order in the store to see it appear here!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--forest)]/10 text-[11px] font-extrabold uppercase tracking-wider text-[var(--olive)]">
                    <th className="py-3 pr-4">Order ID</th>
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Items</th>
                    <th className="py-3 pr-4">Total</th>
                    <th className="py-3 pr-4">Payment</th>
                    <th className="py-3 pr-4">Current Status</th>
                    <th className="py-3 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--forest)]/10">
                  {filteredOrders.map((order) => {
                    const isDelivered = order.status === "DELIVERED";
                    const isShipped = order.status === "SHIPPED";
                    const isCancelled = order.status === "CANCELLED";

                    return (
                      <tr key={order.id} className="hover:bg-[var(--cloud)]/30">
                        <td className="py-4 pr-4 font-mono font-bold text-[var(--forest)]">
                          #{order.id}
                        </td>
                        <td className="py-4 pr-4">
                          <span className="block font-bold text-[var(--forest)]">
                            {order.customerName}
                          </span>
                          <span className="block text-[11px] text-[var(--forest-deep)]/70">
                            {order.customerPhone} · {order.city}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="block font-semibold text-[var(--forest)]">
                            {order.items.length} {order.items.length === 1 ? "jar" : "jars"}
                          </span>
                          <span className="block text-[11px] text-[var(--forest-deep)]/70 truncate max-w-[160px]">
                            {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
                          </span>
                        </td>
                        <td className="py-4 pr-4 font-display text-sm font-bold text-[var(--forest)]">
                          {formatINR(order.total)}
                        </td>
                        <td className="py-4 pr-4">
                          <span className="rounded-full bg-[var(--cloud)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--forest)] uppercase">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                              isDelivered
                                ? "bg-emerald-100 text-emerald-800"
                                : isShipped
                                ? "bg-blue-100 text-blue-800"
                                : isCancelled
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            disabled={updatingId === order.id}
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="rounded-xl border border-[var(--forest)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--forest)] outline-none transition hover:border-[var(--sage-deep)] disabled:opacity-50"
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
