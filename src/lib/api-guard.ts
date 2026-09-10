import { NextResponse } from "next/server";

/**
 * Deterministic DB status check (runs inside route handlers, not edge
 * middleware — always sees the real runtime env).
 */
export function dbStatus(): { ok: boolean; reason: "ok" | "missing" | "malformed" } {
  const url = (process.env.DATABASE_URL ?? "").trim();
  if (url === "") return { ok: false, reason: "missing" };
  // Production: Prisma postgres datasource needs postgres:// or postgresql://.
  // Local development: file: URLs (SQLite) are perfectly fine.
  if (!/^(postgres(ql)?:\/\/|file:)/i.test(url)) return { ok: false, reason: "malformed" };
  return { ok: true, reason: "ok" };
}

const MESSAGES: Record<string, { error: string; hint: string }> = {
  missing: {
    error: "Database is not connected yet.",
    hint: "Store owner: connect a Postgres database (Vercel → Storage → Neon), then redeploy. Admin CMS, orders and accounts activate automatically.",
  },
  malformed: {
    error: "DATABASE_URL format is invalid.",
    hint: "Store owner: the DATABASE_URL must start with postgresql:// — paste your Neon/Supabase connection string (starts with postgresql://) into Vercel env vars, then redeploy.",
  },
};

/**
 * Returns a 503 response when the database is not usable, or null when
 * the request may proceed.
 */
export function requireDb(): NextResponse | null {
  const status = dbStatus();
  if (status.ok) return null;
  const msg = MESSAGES[status.reason];
  return NextResponse.json({ error: msg.error, hint: msg.hint, reason: status.reason }, { status: 503 });
}
