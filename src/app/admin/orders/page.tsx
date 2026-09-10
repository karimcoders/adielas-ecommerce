"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/products";
import { AdminLayout } from "@/components/admin/AdminLayout";

type OrderItem = {
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  pincode: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
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
        if (selectedOrder?.id === id) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout
      title="Orders &amp; Fulfillment"
      subtitle="Track purchases, manage shipments, and view customer manifests"
      actions={
        <button
          onClick={loadOrders}
          title="Refresh"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        {/* Status Filter Tabs (Shopify Style) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap gap-1">
            {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    statusFilter === st
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {st === "ALL" ? "All Orders" : st}
                  <span className="ml-1 text-[10px] opacity-70">
                    (
                    {st === "ALL"
                      ? orders.length
                      : orders.filter((o) => o.status === st).length}
                    )
                  </span>
                </button>
              )
            )}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-3 text-xs font-medium text-gray-900 outline-none focus:bg-white focus:border-amber-400"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-500">
              No orders found for this status.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-4">Fulfillment</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const isDelivered = order.status === "DELIVERED";
                  const isShipped = order.status === "SHIPPED";
                  const isCancelled = order.status === "CANCELLED";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="font-mono font-bold text-gray-900 hover:text-amber-700 underline"
                        >
                          #{order.id}
                        </button>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="block font-bold text-gray-900">
                          {order.customerName}
                        </span>
                        <span className="block text-[11px] text-gray-500">
                          {order.customerPhone} · {order.city}
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
                        <div className="flex items-center justify-end gap-2">
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
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Slide-Over / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-gray-500">
                  Order Details
                </span>
                <h2 className="text-xl font-black text-gray-900">
                  #{selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Customer & Delivery Box */}
              <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="font-bold text-gray-500 uppercase">Customer</span>
                  <p className="mt-1 font-bold text-gray-900 text-sm">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-gray-600">+91 {selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase">Delivery Address</span>
                  <p className="mt-1 text-gray-800 font-medium">
                    {selectedOrder.address}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedOrder.city} - {selectedOrder.pincode}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                  Items Ordered
                </h3>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="h-10 w-10 rounded-lg object-contain bg-gray-50 p-1"
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <span className="text-gray-500">
                            Qty: {item.quantity} × {formatINR(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatINR(item.quantity * item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="rounded-xl border border-gray-100 p-4 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatINR(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>
                    {selectedOrder.shippingFee === 0 ? "FREE" : formatINR(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-sm text-gray-900">
                  <span>Total Amount</span>
                  <span>{formatINR(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs font-bold text-gray-700">Fulfillment Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-900 outline-none"
                >
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
