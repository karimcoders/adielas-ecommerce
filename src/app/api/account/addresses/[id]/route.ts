import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/** PATCH /api/account/addresses/[id] */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const existing = await db.address.findFirst({ where: { id, userId: session.sub } });
  if (!existing) return NextResponse.json({ error: "Address not found." }, { status: 404 });

  const b = await req.json();

  if (b?.isDefault === true) {
    await db.address.updateMany({ where: { userId: session.sub }, data: { isDefault: false } });
  }

  const data: Record<string, unknown> = {};
  for (const f of ["label", "fullName", "phone", "line1", "city", "state", "pincode"]) {
    if (b?.[f] !== undefined) data[f] = String(b[f]);
  }
  if (b?.line2 !== undefined) data.line2 = b.line2 ? String(b.line2) : null;
  if (b?.isDefault !== undefined) data.isDefault = Boolean(b.isDefault);

  const address = await db.address.update({ where: { id }, data });
  return NextResponse.json({ address });
}

/** DELETE /api/account/addresses/[id] */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const existing = await db.address.findFirst({ where: { id, userId: session.sub } });
  if (!existing) return NextResponse.json({ error: "Address not found." }, { status: 404 });

  await db.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
