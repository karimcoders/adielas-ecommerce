import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/** GET /api/admin/customers — list with order aggregates. */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: { where: { status: { not: "CANCELLED" } } } },
    orderBy: { createdAt: "desc" },
  });

  const customers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    createdAt: u.createdAt,
    orderCount: u.orders.length,
    totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
    lastOrderAt: u.orders.length
      ? u.orders.map((o) => o.createdAt).sort((a, b) => b.getTime() - a.getTime())[0]
      : null,
  }));

  // guest orders (no account) — shown separately
  const guestOrders = await db.order.findMany({
    where: { userId: null },
    select: { email: true, customerName: true, total: true },
  });
  const guestMap = new Map<string, { name: string; email: string; orders: number; totalSpent: number }>();
  for (const g of guestOrders) {
    const cur = guestMap.get(g.email) ?? { name: g.customerName, email: g.email, orders: 0, totalSpent: 0 };
    cur.orders += 1;
    cur.totalSpent += g.total;
    guestMap.set(g.email, cur);
  }

  return NextResponse.json({
    customers,
    guests: [...guestMap.values()].sort((a, b) => b.totalSpent - a.totalSpent),
  });
}
