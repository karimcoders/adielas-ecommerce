"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Edit2, Eye, LogOut, RefreshCw, Save } from "lucide-react";
import { formatINR } from "@/lib/products";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp?: number | null;
  stageLabel: string;
  weight: string;
  inStock: boolean;
  stockCount: number;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "ADMIN") {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleStock = async (product: Product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, inStock: !p.inStock } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(p.price);
  };

  const savePrice = async (id: string) => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: editPrice }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, price: editPrice } : p))
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream-page)] pb-24 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-[var(--forest-deep)] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cream)]/80 hover:text-white mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Operations Dashboard
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--cream)]">
              PRODUCT INVENTORY &amp; PRICING
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.08)] sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--forest)]/10 text-[11px] font-extrabold uppercase tracking-wider text-[var(--olive)]">
                  <th className="py-3 pr-4">Product Name</th>
                  <th className="py-3 pr-4">Stage / Tag</th>
                  <th className="py-3 pr-4">Selling Price</th>
                  <th className="py-3 pr-4">MRP</th>
                  <th className="py-3 pr-4">Availability</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--forest)]/10">
                {products.map((p) => {
                  const isEditing = editingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-[var(--cloud)]/30">
                      <td className="py-4 pr-4">
                        <span className="block font-bold text-sm text-[var(--forest)]">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[var(--forest-deep)]/70">
                          {p.weight} · Slug: {p.slug}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-[var(--cloud)] px-3 py-1 text-[10px] font-extrabold text-[var(--forest)]">
                          {p.stageLabel}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[var(--forest)]">₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 rounded-lg border border-[var(--forest)]/20 px-2 py-1 text-xs font-bold text-[var(--forest)] outline-none"
                            />
                          </div>
                        ) : (
                          <span className="font-display text-base text-[var(--forest)]">
                            {formatINR(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4 text-xs font-medium text-[var(--forest-deep)]/60">
                        {p.mrp ? formatINR(p.mrp) : "—"}
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          onClick={() => toggleStock(p)}
                          className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase transition ${
                            p.inStock
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {p.inStock ? "● In Stock" : "○ Out of Stock"}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        {isEditing ? (
                          <button
                            disabled={saving}
                            onClick={() => savePrice(p.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[var(--forest)]/20 px-3 py-1 text-xs font-bold text-[var(--forest)] hover:bg-[var(--forest)] hover:text-[var(--cream)]"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit Price
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
