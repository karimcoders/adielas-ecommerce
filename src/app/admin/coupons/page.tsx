"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Power, Trash2 } from "lucide-react";
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
    "w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]";
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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)]">
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
          <div className="w-full max-w-lg rounded-t-[2rem] bg-[var(--cream)] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--forest)]">New coupon</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-full border-2 border-[var(--forest)]/20 px-6 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--cloud)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={create}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[var(--forest)] px-7 py-3 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60"
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
