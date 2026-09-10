"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Check,
  ExternalLink,
  Eye,
  FileEdit,
  FilePlus2,
  FileText,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type PageItem = {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPublished, setFormPublished] = useState(true);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingPage(null);
    setFormTitle("");
    setFormSlug("");
    setFormContent(`## Overview\n\nWrite your page content here using clean markdown...\n\n### Key Highlights\n- Point 1\n- Point 2\n\nFor questions, contact our support team.`);
    setFormPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (p: PageItem) => {
    setIsCreating(false);
    setEditingPage(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormContent(p.content);
    setFormPublished(p.published);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (isCreating) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormSlug(autoSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim()) {
      alert("Please provide both a title and URL handle");
      return;
    }

    try {
      setSaving(true);
      if (isCreating) {
        const res = await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            slug: formSlug,
            content: formContent,
            published: formPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create page");
        showToast("Page published successfully!");
      } else if (editingPage) {
        const res = await fetch("/api/admin/pages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPage.id,
            title: formTitle,
            slug: formSlug,
            content: formContent,
            published: formPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update page");
        showToast("Page updated successfully!");
      }

      setIsCreating(false);
      setEditingPage(null);
      await loadPages();
    } catch (err: any) {
      alert(err.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete page");
      showToast("Page deleted");
      await loadPages();
    } catch (e: any) {
      alert(e.message || "Delete error");
    }
  };

  const filtered = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout
      title="Store Pages & CMS"
      subtitle="Create and customize static pages like Shopify / WordPress (Policies, About Us, FAQ, Stories)"
      actions={
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-4 py-2 text-xs font-bold text-[var(--cream)] shadow-sm transition hover:bg-[var(--forest)]"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          Add New Page
        </button>
      }
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-4 py-3 text-xs font-bold text-white shadow-xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Editor Modal */}
      {(isCreating || editingPage) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--forest)]" />
                <h3 className="font-display text-lg text-[var(--forest)]">
                  {isCreating ? "Create New Store Page" : `Edit Page: ${editingPage?.title}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPage(null);
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Return & Exchange Policy"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    URL Handle (Slug) *
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
                    <span>/p/</span>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="return-policy"
                      className="ml-1 flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#fbfbfa] p-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--forest)]">
                    Visibility & Publishing
                  </div>
                  <div className="text-xs text-gray-500">
                    {formPublished
                      ? "Page is visible to customers and indexed online"
                      : "Hidden as draft (only visible to admins)"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormPublished(!formPublished)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formPublished ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formPublished ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Markdown Content Editor */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Content (Markdown & Headings Supported)
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Supports ## Headings, - Bullet points, **Bold**
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="## Section Title&#10;&#10;Explain policy or story here..."
                  className="w-full font-mono text-xs rounded-xl border border-gray-300 p-3.5 leading-relaxed text-gray-900 outline-none focus:border-[var(--forest)]"
                />
              </div>

              {/* Quick Format Presets */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFormContent((c) => c + "\n\n## New Heading\nContent goes here...")}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1 text-gray-700 hover:bg-gray-100"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() => setFormContent((c) => c + "\n- First bullet point\n- Second bullet point")}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1 text-gray-700 hover:bg-gray-100"
                >
                  + Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => setFormContent((c) => c + "\n1. Step one\n2. Step two")}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1 text-gray-700 hover:bg-gray-100"
                >
                  + Numbered Steps
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPage(null);
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-6 py-2.5 text-xs font-bold text-[var(--cream)] shadow-sm transition hover:bg-[var(--forest)] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin text-amber-300" />}
                  {isCreating ? "Publish Page" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pages List Section */}
      <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
        {/* Search and Filter bar */}
        <div className="flex flex-col gap-3 border-b border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages by title or slug..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-[var(--forest)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPages}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              onClick={handleStartCreate}
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-[var(--forest-deep)] shadow-sm transition hover:bg-amber-300"
            >
              <Plus className="h-3.5 w-3.5" />
              New Page
            </button>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--forest)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h4 className="mt-3 text-sm font-bold text-gray-800">No pages found</h4>
            <p className="mt-1 text-xs text-gray-500">
              Create standard policies or promotional landing pages.
            </p>
            <button
              onClick={handleStartCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--forest)] px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Page Title</th>
                  <th className="px-6 py-3.5">Slug Handle</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Last Modified</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((page) => (
                  <tr key={page.id} className="transition hover:bg-amber-50/20">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{page.title}</div>
                      <div className="mt-0.5 line-clamp-1 max-w-sm text-[11px] text-gray-400">
                        {page.content.replace(/^[#\-\s]+/gm, "").slice(0, 75)}...
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-gray-700">
                        /p/{page.slug}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {page.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(page.updatedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/p/${page.slug}`}
                          target="_blank"
                          title="View live page"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleStartEdit(page)}
                          title="Edit page"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--forest)]"
                        >
                          <FileEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          title="Delete page"
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
