import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      pincode,
      items,
      subtotal,
      shippingFee = 0,
      paymentMethod = "UPI",
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !pincode) {
      return NextResponse.json(
        { error: "Missing required delivery fields" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const orderId = `ADL-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = subtotal + shippingFee;

    let targetUserId = user?.id || null;
    if (!targetUserId) {
      const existingUser = await db.user.findUnique({
        where: { email: customerEmail.toLowerCase().trim() },
      });
      if (existingUser) {
        targetUserId = existingUser.id;
      } else {
        try {
          const newCust = await db.user.create({
            data: {
              email: customerEmail.toLowerCase().trim(),
              name: customerName.trim(),
              password: "", // guest customer
              phone: customerPhone.trim(),
              address: address.trim(),
              city: city.trim(),
              pincode: pincode.trim(),
              role: "CUSTOMER",
            },
          });
          targetUserId = newCust.id;
        } catch (e) {
          // continue if duplicate email
        }
      }
    }

    const order = await db.order.create({
      data: {
        id: orderId,
        userId: targetUserId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        subtotal: Number(subtotal),
        shippingFee: Number(shippingFee),
        total: Number(total),
        status: "CONFIRMED",
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        items: {
          create: items.map((it: any) => ({
            productSlug: it.slug,
            productName: it.name || it.slug,
            quantity: Number(it.qty) || 1,
            price: Number(it.price) || 0,
            image: it.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    // If customer (not admin), only fetch their orders
    if (!user || user.role !== "ADMIN") {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      where.userId = user.id;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } },
      ];
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
