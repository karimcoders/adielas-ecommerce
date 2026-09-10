"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, MapPin, Phone, ShieldAlert, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[var(--cream-page)] px-4 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <span className="inline-block rounded-full border border-[var(--olive)]/35 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--olive)]">
            Join the Family
          </span>
          <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl">
            CREATE AN <span className="text-[var(--sage-deep)]">ACCOUNT</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--forest-deep)]/80">
            Track deliveries, save address for faster checkout &amp; get member updates.
          </p>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.10)] sm:p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Full Name *
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Aarav's Parent"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="98765 43210"
                    className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Password *
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Delivery Address (Optional)
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="text"
                  value={form.address}
                  onChange={update("address")}
                  placeholder="Flat, building, street"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  placeholder="Bengaluru"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white px-4 py-3 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={update("pincode")}
                  placeholder="560038"
                  maxLength={6}
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white px-4 py-3 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill mt-4 w-full justify-center py-3.5 text-base font-bold disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register Now"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--forest)]/10 pt-5 text-center">
            <p className="text-xs font-medium text-[var(--forest-deep)]/80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[var(--forest)] underline hover:text-[var(--sage-deep)]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
