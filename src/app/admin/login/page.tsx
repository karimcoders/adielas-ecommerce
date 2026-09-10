"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Loader2, Lock, ShieldCheck } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbMissing, setDbMissing] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setDbMissing(d?.db === false))
      .catch(() => setDbMissing(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      if (data.user.role !== "ADMIN") {
        setError("This account is not an admin. Use the customer login.");
        return;
      }
      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--forest-deep)] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] bg-[var(--cream)] p-8 shadow-[0_40px_90px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="flex flex-col items-center text-center">
            <img
              src="/images/adielas/logo.png"
              alt="ADIELAS"
              className="h-14 w-auto rounded-xl bg-white p-1.5 shadow"
            />
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--forest)]">
              Store Admin
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure sign-in
            </p>
          </div>

          {dbMissing && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-left">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs font-semibold leading-relaxed text-amber-800">
                Database is not connected yet — sign-in and editing are disabled until then.
                Connect a free Neon Postgres under <b>Vercel → Storage</b>, then redeploy.
                The whole store (CMS, orders, accounts) activates automatically.
              </p>
            </div>
          )}

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adielas.com"
                autoComplete="email"
                className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white px-4 py-3 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white px-4 py-3 text-base font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#b3352f]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--forest)] py-4 text-base font-extrabold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <p className="mt-6 rounded-xl bg-[var(--cloud)] px-4 py-3 text-center text-xs font-semibold leading-relaxed text-[var(--forest-deep)]/80">
            Store-owner area — customers please use the login at the top menu.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--forest-deep)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--cream)]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
