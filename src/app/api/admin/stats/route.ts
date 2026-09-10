import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const [orders, customersCount] = await Promise.all([
      db.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({
        where: { role: "CUSTOMER" },
      }),
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(
      (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING"
    ).length;
    const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

    const recentOrders = orders.slice(0, 5);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalCustomers: customersCount,
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch stats" }, { status: 500 });
  }
}
