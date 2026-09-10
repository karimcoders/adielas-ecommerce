import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

/** GET /api/orders/[id] — owner or admin. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await db.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (session.role !== "ADMIN" && order.userId !== session.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ order });
}

/** PATCH /api/orders/[id] — admin updates status / payment status. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data: { status?: string; paymentStatus?: string } = {};

  if (body?.status && STATUSES.includes(body.status)) data.status = body.status;
  if (body?.paymentStatus && ["PENDING", "PAID", "FAILED"].includes(body.paymentStatus)) {
    data.paymentStatus = body.paymentStatus;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  // If cancelling, restore stock
  if (data.status === "CANCELLED") {
    const existing = await db.order.findUnique({ where: { id }, include: { items: true } });
    if (existing && existing.status !== "CANCELLED") {
      await Promise.all(
        existing.items.map((it) =>
          it.productId
            ? db.product.update({ where: { id: it.productId }, data: { stock: { increment: it.qty } } })
            : Promise.resolve(null),
        ),
      );
    }
  }

  const order = await db.order.update({ where: { id }, data, include: { items: true } });
  return NextResponse.json({ order });
}
