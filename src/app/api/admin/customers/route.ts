import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const customers = await db.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          select: { id: true, total: true, status: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "—",
      city: c.city || "—",
      ordersCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ customers: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch customers" }, { status: 500 });
  }
}
