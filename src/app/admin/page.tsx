"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Package,
  Palette,
  Percent,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { formatINR } from "@/lib/products";
import { AdminLayout } from "@/components/admin/AdminLayout";

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

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout
      title="Store Overview"
      subtitle="Real-time sales, order metrics, and quick actions"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-[var(--forest)] px-3.5 py-2 text-xs font-bold text-[var(--cream)] shadow-sm hover:bg-[var(--forest-deep)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Link>
          <button
            onClick={loadData}
            title="Refresh Data"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      {/* Quick Launchpad Cards (Shopify Style) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-black/10 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>
            <p className="mt-2 text-2xl font-black text-gray-900">
              {formatINR(stats?.totalRevenue || 0)}
            </p>
            <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              Live store earnings
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:scale-105 transition">
            <DollarSign className="h-6 w-6" />
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-black/10 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Orders
            </span>
            <p className="mt-2 text-2xl font-black text-gray-900">
              {stats?.totalOrders || 0}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-gray-500">
              Lifetime purchases
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 group-hover:scale-105 transition">
            <Package className="h-6 w-6" />
          </div>
        </Link>

        <Link
          href="/admin/orders?status=PENDING"
          className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-black/10 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              To Fulfill
            </span>
            <p className="mt-2 text-2xl font-black text-gray-900">
              {stats?.pendingOrders || 0}
            </p>
            <span className="mt-1 block text-[11px] font-bold text-amber-700">
              Awaiting packing / shipment
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 group-hover:scale-105 transition">
            <Clock className="h-6 w-6" />
          </div>
        </Link>

        <Link
          href="/admin/customers"
          className="group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-black/10 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Customers
            </span>
            <p className="mt-2 text-2xl font-black text-gray-900">
              {stats?.totalCustomers || 0}
            </p>
            <span className="mt-1 block text-[11px] font-medium text-gray-500">
              Registered member parents
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 group-hover:scale-105 transition">
            <Users className="h-6 w-6" />
          </div>
        </Link>
      </div>

      {/* Quick CMS & Store Shortcuts */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/cms"
          className="flex items-center gap-4 rounded-2xl border border-amber-300/60 bg-amber-50/60 p-4 transition hover:bg-amber-100/60"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Website CMS Editor</h3>
            <p className="text-xs text-gray-600">Edit homepage hero, benefits, reviews, and copy</p>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-4 rounded-2xl border border-blue-300/60 bg-blue-50/60 p-4 transition hover:bg-blue-100/60"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Products &amp; Stock</h3>
            <p className="text-xs text-gray-600">Manage jars, update prices, and set stock status</p>
          </div>
        </Link>

        <Link
          href="/admin/discounts"
          className="flex items-center gap-4 rounded-2xl border border-emerald-300/60 bg-emerald-50/60 p-4 transition hover:bg-emerald-100/60"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Coupons &amp; Discounts</h3>
            <p className="text-xs text-gray-600">Create promo codes and checkout offers</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Orders Management
            </h2>
            <p className="text-xs text-gray-500">
              View customer orders, filter by state, and update dispatch status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ID, Name, Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-3 text-xs font-medium text-gray-900 outline-none focus:bg-white focus:border-amber-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-500">
              No orders found matching this filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Items</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-4">Fulfillment</th>
                  <th className="py-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const isDelivered = order.status === "DELIVERED";
                  const isShipped = order.status === "SHIPPED";
                  const isCancelled = order.status === "CANCELLED";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 pr-4 font-mono font-bold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="block font-bold text-gray-900">
                          {order.customerName}
                        </span>
                        <span className="block text-[11px] text-gray-500">
                          {order.customerPhone} · {order.city}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="block font-semibold text-gray-800">
                          {order.items.length} {order.items.length === 1 ? "jar" : "jars"}
                        </span>
                        <span className="block text-[11px] text-gray-500 truncate max-w-[150px]">
                          {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-gray-900">
                        {formatINR(order.total)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
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
                      <td className="py-3.5 text-right">
                        <select
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-800 outline-none hover:border-gray-400"
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
    </AdminLayout>
  );
}
