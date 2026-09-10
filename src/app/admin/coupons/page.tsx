"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Power, Trash2, X } from "lucide-react";
import { formatINR } from "@/lib/products";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  active: boolean;
  expiresAt: string | null;
  usedCount: number;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: 10,
    minOrder: 0,
    maxDiscount: "",
    expiresAt: "",
  });

  const load = useCallback(() => {
    fetch("/api/coupons")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => setCoupons(d.coupons))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const create = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minOrder: Number(form.minOrder),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create coupon.");
        return;
      }
      setDialogOpen(false);
      setForm({ code: "", type: "PERCENT", value: 10, minOrder: 0, maxDiscount: "", expiresAt: "" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Coupon) => {
    await fetch(`/api/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  };

  const remove = async (c: Coupon) => {
    if (!window.confirm(`Delete coupon ${c.code}?`)) return;
    await fetch(`/api/coupons/${c.id}`, { method: "DELETE" });
    load();
  };

  const field =
    "w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)] sm:text-sm";
  const label = "mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">Coupons</h1>
          <p className="mt-1 text-sm font-medium text-[var(--forest-deep)]/70">
            Promo codes customers can apply at checkout
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-[var(--forest)] px-4 py-2.5 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)]"
        >
          <Plus className="h-4 w-4" /> New coupon
        </button>
      </div>

      {/* mobile card list (under 768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-xs">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
            <p className="mt-2 text-xs font-semibold text-[var(--forest-deep)]/60">Loading coupons…</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-[var(--forest-deep)]/60 shadow-xs">
            No coupons yet — create your first promo.
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-[var(--forest)]/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-[var(--forest)] px-3 py-1 font-mono text-xs font-black tracking-widest text-[var(--cream)]">
                  {c.code}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                    c.active ? "bg-[#e8eedd] text-[#5c7a3f]" : "bg-[var(--cloud)] text-[var(--forest-deep)]/60"
                  }`}
                >
                  {c.active ? "Active" : "Paused"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-y border-[var(--forest)]/8 py-2.5 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--olive)]">Discount</span>
                  <span className="font-extrabold text-[var(--forest)] text-sm">
                    {c.type === "PERCENT" ? `${c.value}% off` : `${formatINR(c.value)} off`}
                  </span>
                  {c.maxDiscount ? (
                    <span className="block text-[10px] text-[var(--forest-deep)]/50">cap {formatINR(c.maxDiscount)}</span>
                  ) : null}
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--olive)]">Usage & Min</span>
                  <span className="font-bold text-[var(--forest)]">Used: {c.usedCount}×</span>
                  <span className="block text-[10px] text-[var(--forest-deep)]/60">Min: {c.minOrder > 0 ? formatINR(c.minOrder) : "None"}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggle(c)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--forest)] hover:bg-[var(--cloud)] active:scale-95"
                >
                  <Power className="h-3.5 w-3.5" />
                  {c.active ? "Pause code" : "Activate code"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fbeaea] text-[#b3352f] hover:bg-[#b3352f] hover:text-white active:scale-95 transition"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* desktop table (md+) */}
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)] md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-[var(--forest)]/8 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
              <th className="px-5 py-4">Code</th>
              <th className="px-3 py-4">Discount</th>
              <th className="px-3 py-4">Min order</th>
              <th className="px-3 py-4">Used</th>
              <th className="px-3 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--forest)]/6">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center font-semibold text-[var(--forest-deep)]/60">
                  No coupons yet — create your first promo.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--cream-page)]/60">
                  <td className="px-5 py-3">
                    <span className="rounded-lg bg-[var(--forest)] px-3 py-1.5 font-mono text-xs font-extrabold tracking-wider text-[var(--cream)]">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-[var(--forest)]">
                    {c.type === "PERCENT" ? `${c.value}% off` : `${formatINR(c.value)} off`}
                    {c.maxDiscount ? <span className="ml-1 text-xs font-medium text-[var(--forest-deep)]/50">cap {formatINR(c.maxDiscount)}</span> : null}
                  </td>
                  <td className="px-3 py-3 text-[var(--forest-deep)]/80">{c.minOrder > 0 ? formatINR(c.minOrder) : "—"}</td>
                  <td className="px-3 py-3 font-bold text-[var(--forest-deep)]/80">{c.usedCount}×</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                        c.active ? "bg-[#e8eedd] text-[#5c7a3f]" : "bg-[var(--cloud)] text-[var(--forest-deep)]/60"
                      }`}
                    >
                      {c.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggle(c)}
                        title={c.active ? "Pause" : "Activate"}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--forest)]/55 transition hover:bg-[var(--cloud)] hover:text-[var(--forest)]"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(c)}
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--forest)]/55 transition hover:bg-[#fbeaea] hover:text-[#b3352f]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* create dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[var(--cream)] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-center justify-between border-b border-[var(--forest)]/10 bg-[var(--cream)] px-5 py-4 sm:-mx-8 sm:-mt-8 sm:px-8">
              <h2 className="text-lg font-extrabold text-[var(--forest)] sm:text-xl">New coupon</h2>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow-xs transition hover:bg-[var(--cloud)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className={label}>Code</span>
                <input
                  className={`${field} font-mono font-extrabold uppercase tracking-widest`}
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="WELCOME10"
                />
              </label>
              <label>
                <span className={label}>Type</span>
                <select
                  className={field}
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="PERCENT">Percent off</option>
                  <option value="FLAT">Flat ₹ off</option>
                </select>
              </label>
              <label>
                <span className={label}>{form.type === "PERCENT" ? "Percent (1–100)" : "Amount (₹)"}</span>
                <input
                  type="number"
                  min={1}
                  className={field}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                />
              </label>
              <label>
                <span className={label}>Min order (₹)</span>
                <input
                  type="number"
                  min={0}
                  className={field}
                  value={form.minOrder}
                  onChange={(e) => setForm((f) => ({ ...f, minOrder: Number(e.target.value) }))}
                />
              </label>
              <label>
                <span className={label}>Max discount (₹, optional)</span>
                <input
                  type="number"
                  min={0}
                  className={field}
                  value={form.maxDiscount}
                  onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                  placeholder="No cap"
                />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Expires on (optional)</span>
                <input
                  type="date"
                  className={field}
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                />
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#b3352f]">
                {error}
              </p>
            )}

            <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-6 flex justify-end gap-2.5 border-t border-[var(--forest)]/10 bg-[var(--cream)]/95 px-5 py-3.5 backdrop-blur-sm sm:-mx-8 sm:-mb-8 sm:px-8">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-full border-2 border-[var(--forest)]/20 px-5 py-2.5 text-xs font-bold text-[var(--forest)] transition hover:bg-[var(--cloud)] sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={create}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[var(--forest)] px-6 py-2.5 text-xs font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60 sm:text-sm"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Create coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
