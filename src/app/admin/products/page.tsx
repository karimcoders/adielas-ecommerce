"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Power, Search, Trash2, X } from "lucide-react";
import { formatINR } from "@/lib/products";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  nameLine1: string;
  nameLine2: string;
  stageLabel: string;
  ageLabel: string;
  price: number;
  mrp: number | null;
  weight: string;
  tagline: string;
  ingredients: string;
  howTo: string;
  image: string;
  accent: string;
  wash: string | null;
  rating: number;
  reviews: number;
  stock: number;
  active: boolean;
  sortOrder: number;
};

const emptyForm: Partial<AdminProduct> = {
  name: "",
  slug: "",
  nameLine1: "",
  nameLine2: "",
  stageLabel: "NEW",
  ageLabel: "All ages",
  price: 299,
  mrp: 399,
  weight: "400 g",
  tagline: "",
  ingredients: "",
  howTo: "",
  image: "/images/adielas/jar-trio.png",
  accent: "#5C2B2E",
  wash: "#EFDCA4",
  rating: 4.8,
  reviews: 0,
  stock: 100,
  active: true,
  sortOrder: 10,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<Partial<AdminProduct>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("load failed"))))
      .then((d) => setProducts(d.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm(p);
    setFormError(null);
    setDialogOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Could not save.");
        return;
      }
      setDialogOpen(false);
      load();
    } catch {
      setFormError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: AdminProduct) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    load();
  };

  const remove = async (p: AdminProduct) => {
    if (!window.confirm(`Delete "${p.name}" permanently? If it has orders it will be deactivated instead.`))
      return;
    await fetch(`/api/admin/products/${p.id}?hard=1`, { method: "DELETE" });
    load();
  };

  const set = (key: keyof AdminProduct) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.toLowerCase().includes(query.toLowerCase()),
  );

  const field =
    "w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)] sm:text-sm";
  const label = "mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--forest)] sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm font-medium text-[var(--forest-deep)]/70">
            {products.length} items · changes go live on the storefront instantly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-initial">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--forest)]/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border-2 border-[var(--forest)]/12 bg-white py-2 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-[var(--sage-deep)]"
            />
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)]"
          >
            <Plus className="h-4 w-4" /> <span className="hidden min-[400px]:inline">New product</span><span className="min-[400px]:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* mobile card list (under 768px) */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-xs">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
            <p className="mt-2 text-xs font-semibold text-[var(--forest-deep)]/60">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-[var(--forest-deep)]/60 shadow-xs">
            No products found.
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-[var(--forest)]/10 bg-white p-3.5 shadow-sm transition"
            >
              <div className="flex items-start gap-3">
                <img
                  src={p.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover bg-[var(--cloud)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="truncate text-sm font-extrabold text-[var(--forest)]">{p.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        p.active ? "bg-[#e8eedd] text-[#5c7a3f]" : "bg-[var(--cloud)] text-[var(--forest-deep)]/60"
                      }`}
                    >
                      {p.active ? "Live" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--forest-deep)]/55">
                    /{p.slug} · {p.weight}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-[var(--forest)]">{formatINR(p.price)}</span>
                    {p.mrp ? (
                      <span className="text-xs font-medium text-[var(--forest-deep)]/45 line-through">
                        {formatINR(p.mrp)}
                      </span>
                    ) : null}
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        p.stock === 0
                          ? "bg-[#fbeaea] text-[#b3352f]"
                          : p.stock <= 20
                            ? "bg-[#fdf3d7] text-[#8a6a2f]"
                            : "bg-[var(--sage-soft)] text-[var(--forest)]"
                      }`}
                    >
                      {p.stock} in stock
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[var(--forest)]/8 pt-2.5">
                <button
                  type="button"
                  onClick={() => toggleActive(p)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[var(--forest)]/80 hover:bg-[var(--cloud)] active:scale-95"
                >
                  <Power className="h-3.5 w-3.5" />
                  {p.active ? "Hide from store" : "Make live"}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1 rounded-lg bg-[var(--cloud)] px-3 py-1.5 text-xs font-bold text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white active:scale-95 transition"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fbeaea] text-[#b3352f] hover:bg-[#b3352f] hover:text-white active:scale-95 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* desktop table (md+) */}
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-[0_10px_30px_rgba(69,31,34,0.07)] md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-[var(--forest)]/8 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
              <th className="px-5 py-4">Product</th>
              <th className="px-3 py-4">Price</th>
              <th className="px-3 py-4">Stock</th>
              <th className="px-3 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--forest)]/6">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--olive)]" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center font-semibold text-[var(--forest-deep)]/60">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--cream-page)]/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-[var(--cloud)]" />
                      <div>
                        <p className="font-extrabold text-[var(--forest)]">{p.name}</p>
                        <p className="text-xs font-semibold text-[var(--forest-deep)]/55">
                          /{p.slug} · {p.weight}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-bold text-[var(--forest)]">
                    {formatINR(p.price)}
                    {p.mrp ? <span className="ml-1 text-xs font-medium text-[var(--forest-deep)]/45 line-through">{formatINR(p.mrp)}</span> : null}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        p.stock === 0
                          ? "bg-[#fbeaea] text-[#b3352f]"
                          : p.stock <= 20
                            ? "bg-[#fdf3d7] text-[#8a6a2f]"
                            : "bg-[var(--sage-soft)] text-[var(--forest)]"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                        p.active ? "bg-[#e8eedd] text-[#5c7a3f]" : "bg-[var(--cloud)] text-[var(--forest-deep)]/60"
                      }`}
                    >
                      {p.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        title={p.active ? "Hide from store" : "Show in store"}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--forest)]/55 transition hover:bg-[var(--cloud)] hover:text-[var(--forest)]"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--forest)]/55 transition hover:bg-[var(--cloud)] hover:text-[var(--forest)]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p)}
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

      {/* create/edit dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-[var(--cream)] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-center justify-between border-b border-[var(--forest)]/10 bg-[var(--cream)] px-5 py-4 sm:-mx-8 sm:-mt-8 sm:px-8">
              <h2 className="text-lg font-extrabold text-[var(--forest)] sm:text-xl">
                {editing ? `Edit — ${editing.name}` : "New product"}
              </h2>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow-xs transition hover:bg-[var(--cloud)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
              <label>
                <span className={label}>Name</span>
                <input className={field} value={form.name ?? ""} onChange={set("name")} placeholder="Stage 1 · Sprouted Ragi" />
              </label>
              <label>
                <span className={label}>Slug (URL)</span>
                <input className={field} value={form.slug ?? ""} onChange={set("slug")} placeholder="stage-1" />
              </label>
              <label>
                <span className={label}>Heading line 1</span>
                <input className={field} value={form.nameLine1 ?? ""} onChange={set("nameLine1")} placeholder="STAGE 1" />
              </label>
              <label>
                <span className={label}>Heading line 2</span>
                <input className={field} value={form.nameLine2 ?? ""} onChange={set("nameLine2")} placeholder="SPROUTED RAGI" />
              </label>
              <label>
                <span className={label}>Stage chip</span>
                <input className={field} value={form.stageLabel ?? ""} onChange={set("stageLabel")} placeholder="FIRST WEANING" />
              </label>
              <label>
                <span className={label}>Age label</span>
                <input className={field} value={form.ageLabel ?? ""} onChange={set("ageLabel")} placeholder="5 months +" />
              </label>
              <label>
                <span className={label}>Price (₹)</span>
                <input type="number" min={1} className={field} value={form.price ?? 0} onChange={set("price")} />
              </label>
              <label>
                <span className={label}>MRP (₹)</span>
                <input type="number" min={0} className={field} value={form.mrp ?? ""} onChange={set("mrp")} />
              </label>
              <label>
                <span className={label}>Weight</span>
                <input className={field} value={form.weight ?? ""} onChange={set("weight")} placeholder="400 g" />
              </label>
              <label>
                <span className={label}>Stock</span>
                <input type="number" min={0} className={field} value={form.stock ?? 0} onChange={set("stock")} />
              </label>
              <label>
                <span className={label}>Accent colour</span>
                <input type="color" className={`${field} h-[42px] p-1`} value={form.accent ?? "#5C2B2E"} onChange={set("accent")} />
              </label>
              <label>
                <span className={label}>Section wash</span>
                <input type="color" className={`${field} h-[42px] p-1`} value={form.wash ?? "#EFDCA4"} onChange={set("wash")} />
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Product image (Cloudinary)"
                  value={form.image ?? ""}
                  onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                  placeholder="/images/adielas/stage1.png or https://res.cloudinary.com/…"
                />
              </div>
              <label className="sm:col-span-2">
                <span className={label}>Tagline</span>
                <input className={field} value={form.tagline ?? ""} onChange={set("tagline")} />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Ingredients</span>
                <textarea rows={2} className={field} value={form.ingredients ?? ""} onChange={set("ingredients")} />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>How to prepare</span>
                <textarea rows={2} className={field} value={form.howTo ?? ""} onChange={set("howTo")} />
              </label>
              <label>
                <span className={label}>Rating (0–5)</span>
                <input type="number" step="0.1" min={0} max={5} className={field} value={form.rating ?? 4.8} onChange={set("rating")} />
              </label>
              <label>
                <span className={label}>Review count</span>
                <input type="number" min={0} className={field} value={form.reviews ?? 0} onChange={set("reviews")} />
              </label>
            </div>

            {formError && (
              <p role="alert" className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#b3352f]">
                {formError}
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
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[var(--forest)] px-6 py-2.5 text-xs font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60 sm:text-sm"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save changes" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
