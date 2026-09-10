import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dbStatus } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

/**
 * Lightweight health probe used by the admin UI.
 * Reports exactly why the database is unusable so the setup
 * banner can show a precise fix instead of a vague warning.
 */
export async function GET() {
  const status = dbStatus();
  if (!status.ok) {
    return NextResponse.json({ ok: true, db: false, reason: status.reason });
  }
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true, reason: "ok" });
  } catch {
    return NextResponse.json({ ok: true, db: false, reason: "unreachable" });
  }
}
