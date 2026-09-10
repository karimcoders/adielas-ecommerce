"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Check,
  Edit2,
  ExternalLink,
  Eye,
  Plus,
  RefreshCw,
  Save,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { formatINR } from "@/lib/products";
import { AdminLayout } from "@/components/admin/AdminLayout";

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
  image?: string | null;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.stageLabel.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Products &amp; Inventory"
      subtitle="Manage product catalog, prices, and stock availability"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-[var(--forest)] px-3.5 py-2 text-xs font-bold text-[var(--cream)] shadow-sm hover:bg-[var(--forest-deep)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Product
          </Link>
          <button
            onClick={loadProducts}
            title="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, stage, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none focus:bg-white focus:border-amber-400"
            />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Total Products: <span className="font-bold text-gray-900">{products.length}</span>
          </div>
        </div>

        {/* Products Table (Shopify Style) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Stage / Tag</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">MRP</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--cloud)]/60 p-1">
                          <img
                            src={p.image || `/images/adielas/${p.slug.includes("trio") ? "jar-trio.png" : "jar-stage1.png"}`}
                            alt={p.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/shop/${p.slug}`}
                            target="_blank"
                            className="font-bold text-gray-900 hover:text-amber-700 flex items-center gap-1"
                          >
                            {p.name}
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          </Link>
                          <span className="text-[11px] text-gray-500">
                            {p.weight} · Slug: <code className="font-mono text-[10px]">{p.slug}</code>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-700">
                        {p.stageLabel}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-gray-900">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">₹</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs font-bold text-gray-900"
                          />
                        </div>
                      ) : (
                        formatINR(p.price)
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-gray-500">
                      {p.mrp ? formatINR(p.mrp) : "—"}
                    </td>
                    <td className="py-3.5 pr-4">
                      <button
                        onClick={() => toggleStock(p)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase transition ${
                          p.inStock
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.inStock ? "● In Stock" : "○ Out of Stock"}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      {isEditing ? (
                        <button
                          disabled={saving}
                          onClick={() => savePrice(p.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100"
                        >
                          <Edit2 className="h-3 w-3 text-gray-500" />
                          Quick Edit
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
    </AdminLayout>
  );
}
