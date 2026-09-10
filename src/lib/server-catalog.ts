import { db } from "@/lib/db";
import { products as fallbackProducts, type Product } from "@/lib/products";

/** Map a Prisma product row into the storefront `Product` shape. */
export function mapRow(row: {
  slug: string;
  name: string;
  nameLine1: string;
  nameLine2: string;
  stageLabel: string;
  ageLabel: string;
  price: number;
  mrp: number | null;
  weight: string;
  tagline: string;
  description: string;
  highlights: string;
  ingredients: string;
  nutrition: string;
  howTo: string;
  image: string;
  cut: string | null;
  accent: string;
  wash: string | null;
  rating: number;
  reviews: number;
  stock: number;
}): Product {
  const parseArr = (s: string, fb: unknown[]) => {
    try {
      const v = JSON.parse(s);
      return Array.isArray(v) ? v : fb;
    } catch {
      return fb;
    }
  };
  return {
    slug: row.slug,
    nameLines: [row.nameLine1, row.nameLine2],
    name: row.name,
    stageLabel: row.stageLabel,
    ageLabel: row.ageLabel,
    price: row.price,
    mrp: row.mrp ?? undefined,
    weight: row.weight,
    tagline: row.tagline,
    description: parseArr(row.description, []),
    highlights: parseArr(row.highlights, []),
    ingredients: row.ingredients,
    nutrition: parseArr(row.nutrition, []),
    howTo: row.howTo,
    image: row.image,
    cut: row.cut ?? undefined,
    accent: row.accent,
    wash: row.wash ?? undefined,
    rating: row.rating,
    reviews: row.reviews,
    stock: row.stock,
  } as Product;
}

/**
 * Fetch the active catalog from the DB (ordered), falling back to the
 * static starter catalog if the DB is empty or unreachable.
 */
export async function getCatalog(): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return fallbackProducts;
    return rows.map(mapRow);
  } catch (err) {
    console.error("[getCatalog] falling back to static catalog:", err);
    return fallbackProducts;
  }
}
