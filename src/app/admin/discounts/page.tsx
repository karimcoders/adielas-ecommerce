"use client";

import { useEffect, useState } from "react";
import { Check, Percent, Plus, RefreshCw, Tag, Trash2, X } from "lucide-react";
import { formatINR } from "@/lib/products";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Coupon = {
  id: string;
  code: string;
  discount: number;
  type: string;
  minOrder: number;
  active: boolean;
  createdAt: string;
};

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "PERCENTAGE",
    minOrder: "",
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const toggleActive = async (c: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, active: !c.active }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((it) => (it.id === c.id ? { ...it, active: !c.active } : it))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((it) => it.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discount: Number(form.discount),
          minOrder: form.minOrder ? Number(form.minOrder) : 0,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ code: "", discount: "", type: "PERCENTAGE", minOrder: "" });
        loadCoupons();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create coupon");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Discounts &amp; Promo Codes"
      subtitle="Create promotional coupon codes for checkout savings"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--forest)] px-3.5 py-2 text-xs font-bold text-[var(--cream)] shadow-sm hover:bg-[var(--forest-deep)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Discount Code
          </button>
          <button
            onClick={loadCoupons}
            title="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          {coupons.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-500">
              No active discount codes yet. Click "Create Discount Code" to add promo codes like GROW10 or ADIELAS50.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Discount</th>
                  <th className="py-3 pr-4">Minimum Order</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                        <Tag className="h-3.5 w-3.5 text-amber-600" />
                        {c.code}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-gray-900">
                      {c.type === "PERCENTAGE" ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
                    </td>
                    <td className="py-3.5 pr-4 text-gray-600">
                      {c.minOrder > 0 ? `Orders over ${formatINR(c.minOrder)}` : "No minimum"}
                    </td>
                    <td className="py-3.5 pr-4">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase transition ${
                          c.active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {c.active ? "● Active" : "○ Disabled"}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Creating Coupon */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900">Create Discount Code</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Discount Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GROW10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono font-bold uppercase text-gray-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm font-bold text-gray-900 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0 for any amount"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--forest)] px-4 py-2 text-xs font-extrabold text-[var(--cream)] shadow hover:bg-[var(--forest-deep)] disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Save Discount"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
