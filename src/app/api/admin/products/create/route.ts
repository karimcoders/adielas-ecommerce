import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      price,
      mrp,
      stageLabel,
      ageLabel,
      weight,
      description,
      ingredients,
      howTo,
      image,
      inStock,
    } = body;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");

    const existing = await db.product.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A product with this URL handle (slug) already exists" },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        stageLabel: stageLabel || "NEW",
        ageLabel: ageLabel || "All ages",
        weight: weight || "400 g",
        description: description ? description.trim() : null,
        ingredients: ingredients ? ingredients.trim() : null,
        howTo: howTo ? howTo.trim() : null,
        image: image || "/images/adielas/stage1.png",
        inStock: inStock !== undefined ? Boolean(inStock) : true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
