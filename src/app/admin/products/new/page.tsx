"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Save, Sparkles, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    mrp: "",
    stageLabel: "STAGE 1",
    ageLabel: "5 months +",
    weight: "400 g",
    description: "",
    ingredients: "",
    howTo: "",
    image: "/images/adielas/stage1.png",
    inStock: true,
  });

  const update = (key: string) => (e: any) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    if (key === "name" && !form.slug) {
      setForm((f) => ({
        ...f,
        slug: e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          mrp: form.mrp ? Number(form.mrp) : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Add New Product"
      subtitle="Create a new nutrition jar or bundle"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--forest)] px-4 py-2 text-xs font-extrabold text-[var(--cream)] shadow-sm hover:bg-[var(--forest-deep)] disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
        {/* Title & Description Card */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">
            Product Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stage 1 · Sprouted Ragi"
                value={form.name}
                onChange={update("name")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  URL Handle (Slug) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. stage-1-sprouted-ragi"
                  value={form.slug}
                  onChange={update("slug")}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono text-gray-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Net Weight *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 400 g"
                  value={form.weight}
                  onChange={update("weight")}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Product Story &amp; Description
              </label>
              <textarea
                rows={4}
                placeholder="Detailed description of the product benefits, sprouting method, and ancient grains..."
                value={form.description}
                onChange={update("description")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stage Card */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 mb-2">
              Pricing
            </h2>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="299"
                value={form.price}
                onChange={update("price")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-bold text-gray-900 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Compare-at MRP (₹)
              </label>
              <input
                type="number"
                placeholder="349"
                value={form.mrp}
                onChange={update("mrp")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 mb-2">
              Organization &amp; Category
            </h2>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Stage Label
              </label>
              <input
                type="text"
                placeholder="e.g. STAGE 1 or MULTIGRAIN"
                value={form.stageLabel}
                onChange={update("stageLabel")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Recommended Age
              </label>
              <input
                type="text"
                placeholder="e.g. 5 months +"
                value={form.ageLabel}
                onChange={update("ageLabel")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Ingredients & How to Prepare */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-2">
            Nutrition &amp; Preparation
          </h2>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Ingredients List
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 100% sprouted ragi (finger millet)..."
              value={form.ingredients}
              onChange={update("ingredients")}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              How to Prepare
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mix 2 tbsp with warm milk or water and cook for 3 minutes..."
              value={form.howTo}
              onChange={update("howTo")}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm font-medium text-gray-900 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Image URL & Status */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900 mb-2">
            Media &amp; Stock Status
          </h2>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Product Image URL / Path
            </label>
            <input
              type="text"
              value={form.image}
              onChange={update("image")}
              placeholder="/images/adielas/stage1.png"
              className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono text-gray-900 outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="inStock"
              checked={form.inStock}
              onChange={update("inStock")}
              className="h-4 w-4 rounded text-amber-500"
            />
            <label htmlFor="inStock" className="text-xs font-bold text-gray-800">
              Product is In Stock &amp; Available for Purchase
            </label>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
