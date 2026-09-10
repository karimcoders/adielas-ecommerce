import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/** PATCH /api/coupons/[id] — toggle active / edit. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const b = await req.json();
  const data: Record<string, unknown> = {};

  if (b?.active !== undefined) data.active = Boolean(b.active);
  if (b?.value !== undefined) data.value = Math.round(Number(b.value));
  if (b?.minOrder !== undefined) data.minOrder = Math.max(0, Math.round(Number(b.minOrder)));
  if (b?.maxDiscount !== undefined) data.maxDiscount = b.maxDiscount ? Math.round(Number(b.maxDiscount)) : null;
  if (b?.expiresAt !== undefined) data.expiresAt = b.expiresAt ? new Date(b.expiresAt) : null;

  const coupon = await db.coupon.update({ where: { id }, data });
  return NextResponse.json({ coupon });
}

/** DELETE /api/coupons/[id] */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  await db.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
