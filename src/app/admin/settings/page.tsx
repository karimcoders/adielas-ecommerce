"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Banknote,
  Check,
  CreditCard,
  Globe,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    storeName: "ADIELAS",
    tagline: "Premium Nutrition for Growing Children",
    phone: "+91 98453 79428",
    email: "care@adielas.com",
    address: "649, 6th C Main, 14th Cross, JP Nagar 3rd Phase, Bangalore 560078",
    gstNumber: "29ADFPV3524L3ZZ",
    freeShippingThreshold: 999,
    shippingFee: 79,
    currencySymbol: "₹",
    enableCod: true,
    enableUpi: true,
    enableCard: true,
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
    tiktokUrl: "https://tiktok.com",
    whatsappNumber: "+91 98453 79428",
    metaTitle: "ADIELAS — Premium Nutrition for Growing Children",
    metaDescription: "Pediatrician-backed nutrition made from 100% sprouted millets and grains.",
  });

  useEffect(() => {
    fetch("/api/cms?section=settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSettings((prev) => ({
            ...prev,
            ...data.data,
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/cms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "settings",
          data: settings,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      showToast("Store settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Save error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings" subtitle="Store configuration">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--forest)]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Store Settings"
      subtitle="Shopify & WordPress style configuration for store profile, checkout rules, shipping, and payment options"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-4 py-2 text-xs font-bold text-[var(--cream)] shadow-sm transition hover:bg-[var(--forest)] disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
          ) : (
            <Save className="h-4 w-4 text-amber-300" />
          )}
          Save Settings
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile Section */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-[var(--forest)]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base text-gray-900">
                Store Profile & Branding
              </h3>
              <p className="text-xs text-gray-500">
                General information displayed in headers, footers, invoices, and customer communications
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Store Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Customer Support Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Support Phone / Helpdesk
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Tax / GSTIN Number
              </label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-mono font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Registered Kitchen / Head Office Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-3.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Pricing */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base text-gray-900">
                Shipping & Checkout Delivery Fees
              </h3>
              <p className="text-xs text-gray-500">
                Control the free shipping threshold and base delivery fee applied at checkout
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol || "₹"}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Orders equal or above this value get 100% Free Express Delivery
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, shippingFee: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Charged when cart total is below the free shipping threshold
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base text-gray-900">
                Payment Gateways & Options
              </h3>
              <p className="text-xs text-gray-500">
                Enable or disable customer payment methods supported at checkout
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* UPI Option */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="text-xs font-bold text-gray-900">UPI Instant</div>
                  <div className="text-[11px] text-gray-500">GPay, PhonePe, Paytm</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableUpi: !settings.enableUpi })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableUpi ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableUpi ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Cards Option */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-gray-900">Cards & NetBanking</div>
                  <div className="text-[11px] text-gray-500">Visa, RuPay, Mastercard</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableCard: !settings.enableCard })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableCard ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableCard ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* COD Option */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-gray-900">Cash on Delivery</div>
                  <div className="text-[11px] text-gray-500">Pay on doorstep delivery</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableCod: !settings.enableCod })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableCod ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableCod ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base text-gray-900">
                Social Channels & Direct Chat
              </h3>
              <p className="text-xs text-gray-500">
                Links rendered in the website footer and contact channels
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                WhatsApp Support Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+91 98453 79428"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-[var(--forest)]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[var(--forest-deep)] px-6 py-2.5 text-xs font-bold text-[var(--cream)] shadow-sm transition hover:bg-[var(--forest)] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
            ) : (
              <Save className="h-4 w-4 text-amber-300" />
            )}
            Save All Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
