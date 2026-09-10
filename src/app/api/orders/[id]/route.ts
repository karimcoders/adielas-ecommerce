import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

/** GET /api/orders/[id] — owner or admin. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireDb();
  if (denied) return denied;

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

/** PATCH /api/orders/[id] — admin updates status / payment status, or customer cancels order. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireDb();
  if (denied) return denied;

  const { id } = await ctx.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const isAdmin = session.role === "ADMIN";
  const isOwner = session.sub === existing.userId;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const data: { status?: string; paymentStatus?: string } = {};

  if (!isAdmin) {
    // Customer action: only cancellation is allowed, and only if not already shipped/delivered/cancelled
    if (body?.status !== "CANCELLED") {
      return NextResponse.json({ error: "Customers can only cancel orders." }, { status: 403 });
    }
    if (existing.status === "CANCELLED") {
      return NextResponse.json({ error: "This order is already cancelled." }, { status: 400 });
    }
    if (existing.status === "SHIPPED" || existing.status === "DELIVERED") {
      return NextResponse.json(
        { error: `Cannot cancel an order that is already ${existing.status.toLowerCase()}.` },
        { status: 400 }
      );
    }
    data.status = "CANCELLED";
  } else {
    // Admin action: can set status or paymentStatus
    if (body?.status && STATUSES.includes(body.status)) data.status = body.status;
    if (body?.paymentStatus && ["PENDING", "PAID", "FAILED"].includes(body.paymentStatus)) {
      data.paymentStatus = body.paymentStatus;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  // If cancelling, restore product stock
  if (data.status === "CANCELLED" && existing.status !== "CANCELLED") {
    await Promise.all(
      existing.items.map((it) =>
        it.productId
          ? db.product
              .update({
                where: { id: it.productId },
                data: { stock: { increment: it.qty } },
              })
              .catch(() => null)
          : Promise.resolve(null),
      ),
    );
  }

  const order = await db.order.update({
    where: { id: existing.id },
    data,
    include: { items: true },
  });

  return NextResponse.json({ order });
}

/** DELETE /api/orders/[id] — admin only. */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireDb();
  if (denied) return denied;

  const { id } = await ctx.params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await db.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
  });
  if (!existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await db.order.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true, id: existing.id, orderNumber: existing.orderNumber });
}

