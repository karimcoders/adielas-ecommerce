"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, KeyRound, Loader2, Lock, ShieldAlert, Sparkles, Store } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user?.role !== "ADMIN") {
        throw new Error("Access Denied: This account is not an Administrator. Customers please use standard login.");
      }

      // Success - navigate to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail("admin@adielas.com");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#151f18] px-4 py-12 text-[#e3ded2] selection:bg-amber-400 selection:text-[#151f18]">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block transition hover:scale-105">
            <img
              src="/images/adielas/logo.png"
              alt="ADIELAS"
              className="mx-auto h-14 w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-300">
            <Lock className="h-3 w-3" />
            Admin CMS Portal
          </div>
          <h1 className="font-display mt-3 text-2xl text-white sm:text-3xl">
            Store Management Sign In
          </h1>
          <p className="mt-1 text-xs text-white/60">
            Restricted access for store owners, admins &amp; staff
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#1c2a21]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-200/80 mb-1.5">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adielas.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 outline-none transition focus:border-amber-400 focus:bg-white/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200/80">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 outline-none transition focus:border-amber-400 focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-xs font-black uppercase tracking-wider text-[#151f18] shadow-[0_10px_25px_rgba(251,191,36,0.3)] transition hover:bg-amber-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#151f18]" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </button>
          </form>

          {/* 1-Click Quick Fill */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={fillAdmin}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              1-Click Fill Admin Credentials
            </button>
            <p className="mt-2 text-center text-[10px] text-white/50">
              Default: <code className="text-amber-300 font-mono">admin@adielas.com</code> / <code className="text-amber-300 font-mono">admin123</code>
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex items-center justify-between text-xs font-semibold text-white/60">
          <Link
            href="/"
            className="flex items-center gap-1.5 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Store
          </Link>
          <Link
            href="/login"
            className="text-amber-300/80 transition hover:text-amber-300"
          >
            Customer Login Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
