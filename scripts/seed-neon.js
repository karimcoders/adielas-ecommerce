const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return salt + ":" + hash;
}

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_kvBIRS3M8FmJ@ep-calm-term-auorzkhk-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require",
    },
  },
});

async function main() {
  console.log("==> Seeding Neon PostgreSQL Database...");

  // 1. Admin User
  const admin = await db.user.upsert({
    where: { email: "admin@adielas.com" },
    update: { role: "ADMIN", password: hashPassword("admin123") },
    create: {
      name: "Adielas Admin",
      email: "admin@adielas.com",
      password: hashPassword("admin123"),
      role: "ADMIN",
      phone: "9845379428",
      address: "Adielas HQ, Indiranagar",
      city: "Bengaluru",
      pincode: "560038",
    },
  });
  console.log("Admin user ready:", admin.email);

  // 2. Demo Customer
  const cust = await db.user.upsert({
    where: { email: "pooja.sharma@example.com" },
    update: {},
    create: {
      name: "Pooja Sharma",
      email: "pooja.sharma@example.com",
      password: hashPassword("customer123"),
      role: "CUSTOMER",
      phone: "9876543210",
      address: "Flat 402, Sunshine Heights",
      city: "Bangalore",
      pincode: "560034",
    },
  });
  console.log("Customer user ready:", cust.email);

  // 3. Products
  const prods = [
    {
      slug: "stage-1",
      name: "Stage 1 · Sprouted Ragi",
      price: 299,
      mrp: 349,
      stageLabel: "STAGE 1",
      ageLabel: "5 months +",
      weight: "400 g",
      inStock: true,
      stockCount: 150,
      rating: 4.9,
      reviews: 128,
      description:
        "100% sprouted ragi flour sun-dried in sterile chambers. Gentle on tiny tummies with zero added sugar.",
      image: "/images/adielas/jar-stage1-cut.png",
    },
    {
      slug: "stage-2",
      name: "Stage 2 · Multigrain Medley",
      price: 399,
      mrp: 449,
      stageLabel: "STAGE 2",
      ageLabel: "8 months +",
      weight: "400 g",
      inStock: true,
      stockCount: 120,
      rating: 5.0,
      reviews: 94,
      description:
        "Powerhouse blend of sprouted wheat, oats, ragi and sweet almond powder.",
      image: "/images/adielas/jar-stage2-cut.png",
    },
    {
      slug: "stage-3",
      name: "Stage 3 · Sprouted Millets & Nuts",
      price: 449,
      mrp: 499,
      stageLabel: "STAGE 3",
      ageLabel: "12 months +",
      weight: "400 g",
      inStock: true,
      stockCount: 95,
      rating: 4.9,
      reviews: 156,
      description:
        "Dense nutrition booster with dates, cashew, walnut, and roasted sprouted millets.",
      image: "/images/adielas/jar-stage3-cut.png",
    },
    {
      slug: "starter-trio",
      name: "Starter Trio · Complete Bundle",
      price: 999,
      mrp: 1199,
      stageLabel: "VALUE PACK",
      ageLabel: "All Stages",
      weight: "1200 g (3 x 400g)",
      inStock: true,
      stockCount: 80,
      rating: 5.0,
      reviews: 210,
      description:
        "All 3 stages in one convenient bundle with 15% bundled savings.",
      image: "/images/adielas/trio-jars.png",
    },
  ];

  for (const p of prods) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Products seeded:", prods.length);

  // 4. Coupons
  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discount: 10,
      type: "PERCENTAGE",
      minOrder: 499,
      active: true,
    },
  });
  await db.coupon.upsert({
    where: { code: "CHAMPION100" },
    update: {},
    create: {
      code: "CHAMPION100",
      discount: 100,
      type: "FLAT",
      minOrder: 999,
      active: true,
    },
  });
  console.log("Coupons seeded");

  console.log("==> ALL NEON DATA SEEDED SUCCESSFULLY!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
