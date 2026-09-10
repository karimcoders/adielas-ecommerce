import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { products as initialProducts } from "@/lib/products";

export async function GET() {
  try {
    let dbProducts = await db.product.findMany();

    // Auto seed if empty
    if (dbProducts.length === 0) {
      await Promise.all(
        initialProducts.map((p) =>
          db.product.create({
            data: {
              slug: p.slug,
              name: p.name,
              price: p.price,
              mrp: p.mrp || null,
              stageLabel: p.stageLabel,
              ageLabel: p.ageLabel,
              weight: p.weight,
              inStock: true,
              stockCount: 150,
              rating: p.rating,
              reviews: p.reviews,
            },
          })
        )
      );
      dbProducts = await db.product.findMany();
    }

    return NextResponse.json({ products: dbProducts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, price, inStock, stockCount } = body;

    const updated = await db.product.update({
      where: { id },
      data: {
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(inStock !== undefined ? { inStock: Boolean(inStock) } : {}),
        ...(stockCount !== undefined ? { stockCount: Number(stockCount) } : {}),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}
