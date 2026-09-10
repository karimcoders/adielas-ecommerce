"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/products";

type OrderItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  email: string;
  customerName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLE: Record<string, string> = {
  PLACED: "bg-[#fdf3d7] text-[#8a6a2f]",
  CONFIRMED: "bg-[#f3e6c8] text-[#a98139]",
  SHIPPED: "bg-[#efe4cf] text-[#6b5320]",
  DELIVERED: "bg-[#e8eedd] text-[#5c7a3f]",
  CANCELLED: "bg-[#fbeaea] text-[#b3352f]",
};

const PAY_STYLE: Record<string, string> = {
  PAID: "bg-[#e8eedd] text-[#5c7a3f]",
  PENDING: "bg-[#fdf3d7] text-[#8a6a2f]",
  FAILED: "bg-[#fbeaea] text-[#b3352f]",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const updateStatus = async (order: Order, status: string) => {
    setUpdating(order.id);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
    setDetail((d) => (d && d.id === order.id ? { ...d, status } : d));
  };

  const filtered = useMemo(
    () =>
      orders
        .filter((o) => (filter === "ALL" ? true : o.status === filter))
        .filter((o) => {
          const q = query.toLowerCase();
          return (
            !q ||
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            o.phone.includes(q)
          );
        }),
    [orders, filter, query],
  );

  const revenue = filtered
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm font-medium text-[var(--forest-deep)]/70">
            {filtered.length} orders · {formatINR(revenue)} revenue (excl. cancelled)
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order / name / phone…"
          className="w-full rounded-full border-2 border-[var(--forest)]/12 bg-white px-5 py-2.5 text-base font-medium outline-none focus:border-[var(--sage-deep)] sm:w-72 sm:text-sm"
        />
      </div>

      {/* status filter pills */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide transition ${
              filter === s
                ? "bg-[var(--forest)] text-[var(--cream)]"
                : "bg-white text-[var(--forest)]/60 hover:bg-[var(--cloud)]"
            }`}
          >
            {s === "ALL" ? "All" : s}
          </button>
        ))}
      </div>

      {/* mobile card list (under 768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-xs">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
            <p className="mt-2 text-xs font-semibold text-[var(--forest-deep)]/60">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-[var(--forest-deep)]/60 shadow-xs">
            No orders here yet.
          </div>
        ) : (
          filtered.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold text-[var(--forest)]">{o.orderNumber}</p>
                  <p className="text-xs font-semibold text-[var(--forest-deep)]/55">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${STATUS_STYLE[o.status]}`}>
                  {o.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-y border-[var(--forest)]/8 py-2.5 text-xs">
                <div>
                  <span className="block font-bold text-[var(--olive)] uppercase tracking-wider text-[10px]">Customer</span>
                  <span className="font-bold text-[var(--forest)] truncate block">{o.customerName}</span>
                  <span className="text-[var(--forest-deep)]/60 truncate block">{o.phone}</span>
                </div>
                <div>
                  <span className="block font-bold text-[var(--olive)] uppercase tracking-wider text-[10px]">Total</span>
                  <span className="text-base font-black text-[var(--forest)]">{formatINR(o.total)}</span>
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${PAY_STYLE[o.paymentStatus] ?? ""}`}>
                    {o.paymentMethod} · {o.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[var(--forest-deep)]/70">Change status:</span>
                  {updating === o.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--olive)]" />
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o, e.target.value)}
                      aria-label={`Status for ${o.orderNumber}`}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide outline-none ${STATUS_STYLE[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDetail(o)}
                  className="flex items-center gap-1 rounded-full bg-[var(--forest)] px-3.5 py-1.5 text-xs font-bold text-[var(--cream)] transition active:scale-95"
                >
                  <Eye className="h-3.5 w-3.5" /> Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* desktop table (md+) */}
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)] md:block">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-[var(--forest)]/8 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
              <th className="px-5 py-4">Order</th>
              <th className="px-3 py-4">Customer</th>
              <th className="px-3 py-4">Payment</th>
              <th className="px-3 py-4">Total</th>
              <th className="px-3 py-4">Status</th>
              <th className="px-5 py-4 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--forest)]/6">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center font-semibold text-[var(--forest-deep)]/60">
                  No orders here yet.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="hover:bg-[var(--cream-page)]/60">
                  <td className="px-5 py-3">
                    <p className="font-extrabold text-[var(--forest)]">{o.orderNumber}</p>
                    <p className="text-xs font-semibold text-[var(--forest-deep)]/55">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" · "}
                      {o.items.reduce((s, i) => s + i.qty, 0)} items
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-bold text-[var(--forest)]">{o.customerName}</p>
                    <p className="text-xs font-semibold text-[var(--forest-deep)]/55">{o.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${PAY_STYLE[o.paymentStatus] ?? ""}`}>
                      {o.paymentMethod} · {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-[var(--forest)]">{formatINR(o.total)}</td>
                  <td className="px-3 py-3">
                    {updating === o.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--olive)]" />
                    ) : (
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o, e.target.value)}
                        aria-label={`Status for ${o.orderNumber}`}
                        className={`cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide outline-none ${STATUS_STYLE[o.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDetail(o)}
                      title="View order"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--forest)]/55 transition hover:bg-[var(--cloud)] hover:text-[var(--forest)]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* detail dialog */}
      {detail && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[var(--cream)] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--forest)]">{detail.orderNumber}</h2>
                <p className="mt-0.5 text-xs font-semibold text-[var(--forest-deep)]/60">
                  {new Date(detail.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase text-[var(--forest)] shadow transition hover:bg-[var(--cloud)]"
              >
                Close
              </button>
            </div>

            {/* items */}
            <ul className="mt-5 space-y-2.5">
              {detail.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                  {it.image && <img src={it.image} alt="" className="h-12 w-12 rounded-xl object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[var(--forest)]">{it.name}</p>
                    <p className="text-xs font-semibold text-[var(--forest-deep)]/60">
                      {formatINR(it.price)} × {it.qty}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-[var(--forest)]">
                    {formatINR(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* totals */}
            <dl className="mt-4 space-y-1.5 rounded-2xl bg-white p-4 text-sm font-semibold">
              <div className="flex justify-between text-[var(--forest-deep)]/80">
                <dt>Subtotal</dt>
                <dd>{formatINR(detail.subtotal)}</dd>
              </div>
              {detail.discount > 0 && (
                <div className="flex justify-between text-[#5c7a3f]">
                  <dt>Discount {detail.couponCode ? `(${detail.couponCode})` : ""}</dt>
                  <dd>−{formatINR(detail.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[var(--forest-deep)]/80">
                <dt>Shipping</dt>
                <dd>{detail.shipping === 0 ? "FREE" : formatINR(detail.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-[var(--forest)]/10 pt-2 text-base font-extrabold text-[var(--forest)]">
                <dt>Total</dt>
                <dd>{formatINR(detail.total)}</dd>
              </div>
            </dl>

            {/* address + customer */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">Customer</p>
                <p className="mt-1.5 text-sm font-bold text-[var(--forest)]">{detail.customerName}</p>
                <p className="text-xs font-semibold text-[var(--forest-deep)]/70">{detail.phone}</p>
                <p className="text-xs font-semibold text-[var(--forest-deep)]/70">{detail.email}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">Ship to</p>
                <p className="mt-1.5 text-xs font-semibold leading-relaxed text-[var(--forest-deep)]/80">
                  {detail.addressLine1}
                  {detail.addressLine2 ? `, ${detail.addressLine2}` : ""}
                  <br />
                  {detail.city}, {detail.state} — {detail.pincode}
                </p>
              </div>
            </div>

            {/* status control */}
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                Update status
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(detail, s)}
                    disabled={updating === detail.id || detail.status === s}
                    className={`rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wide transition disabled:opacity-100 ${STATUS_STYLE[s]} ${
                      detail.status === s ? "ring-2 ring-[var(--forest)]/40" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
