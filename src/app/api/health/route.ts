import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Lightweight health probe.
 * Returns `db: false` while no database is connected so the
 * admin UI can show a helpful setup banner instead of failing.
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, db: false });
  }
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true });
  } catch {
    return NextResponse.json({ ok: true, db: false });
  }
}
