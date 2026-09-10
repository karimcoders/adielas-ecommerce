import { requireDb } from "@/lib/api-guard";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/** GET /api/admin/stats — dashboard KPIs, 30-day revenue series, recent orders, low stock. */
export async function GET() {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [orders, customers, products, activeCoupons] = await Promise.all([
    db.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true }, take: 1000 }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.findMany({ select: { id: true, name: true, stock: true, image: true, active: true } }),
    db.coupon.count({ where: { active: true } }),
  ]);

  const notCancelled = orders.filter((o) => o.status !== "CANCELLED");
  const revenue = notCancelled.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "PLACED" || o.status === "CONFIRMED").length;

  // 30-day revenue series
  const series: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = notCancelled.filter(
      (o) => o.createdAt.toISOString().slice(0, 10) === key,
    );
    series.push({
      date: key,
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Top products by qty sold
  const soldMap = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of notCancelled) {
    for (const it of o.items) {
      const cur = soldMap.get(it.slug) ?? { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += it.qty * it.price;
      soldMap.set(it.slug, cur);
    }
  }
  const topProducts = [...soldMap.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const statusCounts = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  return NextResponse.json({
    kpis: {
      revenue,
      orders: orders.length,
      customers,
      pendingCount,
      activeCoupons,
      avgOrder: notCancelled.length ? Math.round(revenue / notCancelled.length) : 0,
    },
    series,
    recentOrders: orders.slice(0, 8).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      itemCount: o.items.reduce((s, i) => s + i.qty, 0),
    })),
    lowStock: products.filter((p) => p.active && p.stock <= 20).sort((a, b) => a.stock - b.stock),
    topProducts,
    statusCounts,
  });
}
