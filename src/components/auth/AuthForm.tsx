"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adminBlock, setAdminBlock] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAdminBlock(false);
    try {
      const res = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password, portal: "customer" } : { name, email, phone, password },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setAdminBlock(Boolean(data.adminPortal));
        return;
      }
      router.push(params.get("next") || data.redirect || "/account");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border-2 border-[var(--forest)]/15 bg-white px-4 py-3 text-base font-medium text-[var(--forest)] outline-none transition placeholder:text-[var(--forest)]/35 focus:border-[var(--sage-deep)]";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--olive)]";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        <img
          src="/images/adielas/logo.png"
          alt="ADIELAS"
          className="mx-auto h-14 w-auto rounded-xl bg-white p-1.5 shadow-md"
        />
        <h1 className="font-display mt-5 text-[clamp(2.2rem,6vw,3.2rem)] leading-[0.95] text-[var(--forest)]">
          {isLogin ? (
            <>
              WELCOME
              <br />
              <span className="text-[var(--sage-deep)]">BACK</span>
            </>
          ) : (
            <>
              JOIN THE
              <br />
              <span className="text-[var(--sage-deep)]">FAMILY</span>
            </>
          )}
        </h1>
        <p className="mt-3 text-sm font-medium text-[var(--forest-deep)]/80">
          {isLogin
            ? "Log in to track orders, manage addresses and reorder in a tap."
            : "Create an account for faster checkout, order tracking and offers."}
        </p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-4 rounded-[1.8rem] bg-white/80 p-6 shadow-[0_18px_44px_rgba(69,31,34,0.10)] sm:p-8">
        {!isLogin && (
          <>
            <label className="block">
              <span className={labelCls}>Full name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Nair"
                autoComplete="name"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Mobile (optional)</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                inputMode="tel"
                autoComplete="tel"
                className={inputCls}
              />
            </label>
          </>
        )}
        <label className="block">
          <span className={labelCls}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Your password" : "At least 6 characters"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputCls}
          />
        </label>

        {error && (
          <div role="alert" className="space-y-2 rounded-xl bg-[#fbeaea] px-4 py-3 text-sm font-semibold text-[#b3352f]">
            <p>{error}</p>
            {adminBlock && (
              <a
                href="/admin/login"
                className="inline-flex items-center gap-1 rounded-full bg-[var(--forest)] px-4 py-2 text-xs font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)]"
              >
                Go to Admin Login →
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-pill flex w-full items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLogin ? "Log in" : "Create my account"}
        </button>

        <p className="text-center text-sm font-semibold text-[var(--forest-deep)]/80">
          {isLogin ? (
            <>
              New here?{" "}
              <Link href="/register" className="text-[var(--sage-deep)] underline underline-offset-4">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--sage-deep)] underline underline-offset-4">
                Log in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
