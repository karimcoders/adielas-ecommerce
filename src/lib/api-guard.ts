import { NextResponse } from "next/server";

/**
 * Deterministic DB guard for API routes (runs inside the route handler,
 * not in edge middleware — so it always sees the real runtime env).
 *
 * Returns a 503 response when no database is connected, or null when
 * the request may proceed.
 */
export function requireDb(): NextResponse | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    return NextResponse.json(
      {
        error: "Database is not connected yet.",
        hint: "Store owner: connect a Postgres database (Vercel → Storage → Neon), then redeploy. Admin CMS, orders and accounts activate automatically.",
      },
      { status: 503 },
    );
  }
  return null;
}
