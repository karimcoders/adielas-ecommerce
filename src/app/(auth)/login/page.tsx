"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldAlert, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
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
  };

  return (
    <div className="min-h-[85vh] bg-[var(--cream-page)] px-4 pb-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[var(--olive)]/35 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--olive)]">
            Welcome Back
          </span>
          <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl">
            SIGN IN TO <span className="text-[var(--sage-deep)]">ADIELAS</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--forest-deep)]/80">
            Access your orders, saved delivery addresses, or admin panel.
          </p>
        </div>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-6 rounded-2xl border border-[var(--sage-deep)]/40 bg-[var(--cloud)]/70 p-4 text-xs font-semibold text-[var(--forest)] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-4 w-4 text-[var(--sage-deep)]" />
              Demo Admin Credentials:
            </span>
            <button
              type="button"
              onClick={fillAdmin}
              className="rounded-full bg-[var(--forest)] px-3 py-1 text-[11px] font-bold text-[var(--cream)] transition hover:opacity-90"
            >
              Fill Admin
            </button>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[var(--forest-deep)]/75">
            admin@adielas.com / admin123
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.10)] sm:p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--forest)]/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill mt-2 w-full justify-center py-3.5 text-base font-bold disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--forest)]/10 pt-5 text-center">
            <p className="text-xs font-medium text-[var(--forest-deep)]/80">
              Don't have an account yet?{" "}
              <Link
                href="/register"
                className="font-bold text-[var(--forest)] underline hover:text-[var(--sage-deep)]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
