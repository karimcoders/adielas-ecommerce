import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/** PATCH /api/admin/products/[id] — update any field. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  try {
    const b = await req.json();
    const data: Record<string, unknown> = {};

    const strFields = [
      "name",
      "nameLine1",
      "nameLine2",
      "stageLabel",
      "ageLabel",
      "weight",
      "tagline",
      "ingredients",
      "howTo",
      "image",
      "accent",
    ];
    for (const f of strFields) if (b?.[f] !== undefined) data[f] = String(b[f]);
    for (const f of ["cut", "wash"]) if (b?.[f] !== undefined) data[f] = b[f] ? String(b[f]) : null;

    for (const f of ["price", "mrp", "stock", "reviews", "sortOrder"]) {
      if (b?.[f] !== undefined) data[f] = Math.round(Number(b[f]));
      if (f === "mrp" && b?.[f] === null) data[f] = null;
    }
    if (b?.rating !== undefined) data.rating = Math.min(5, Math.max(0, Number(b.rating)));
    if (b?.active !== undefined) data.active = Boolean(b.active);
    if (b?.slug !== undefined && String(b.slug).trim()) data.slug = String(b.slug).trim();
    if (b?.description !== undefined)
      data.description = JSON.stringify(
        Array.isArray(b.description) ? b.description : [String(b.description)],
      );
    if (b?.highlights !== undefined)
      data.highlights = JSON.stringify(Array.isArray(b.highlights) ? b.highlights : []);
    if (b?.nutrition !== undefined)
      data.nutrition = JSON.stringify(Array.isArray(b.nutrition) ? b.nutrition : []);

    const product = await db.product.update({ where: { id }, data });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[admin/products:PATCH]", err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}

/** DELETE /api/admin/products/[id] — soft: prefer deactivating; hard delete if ?hard=1. */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const hard = new URL(req.url).searchParams.get("hard") === "1";

  if (hard) {
    const orderItems = await db.orderItem.count({ where: { productId: id } });
    if (orderItems > 0) {
      return NextResponse.json(
        { error: "Product has orders. Deactivate it instead of deleting." },
        { status: 409 },
      );
    }
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const product = await db.product.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ product });
}
