/**
 * Seed the ADIELAS store with: admin + demo customer, the 4-product catalog,
 * coupons, and ~30 days of demo orders so the admin dashboard has real charts.
 *
 * Run: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const products = [
  {
    slug: "stage-1",
    name: "Stage 1 · Sprouted Ragi",
    nameLine1: "STAGE 1",
    nameLine2: "SPROUTED RAGI",
    stageLabel: "FIRST WEANING",
    ageLabel: "5 months +",
    price: 299,
    mrp: 349,
    weight: "400 g",
    tagline: "A gentle first spoon — single-grain sprouted ragi, nothing else.",
    description: [
      "Stage 1 is where the journey begins. A single hero grain — finger millet (ragi) — carefully sprouted to wake up its natural enzymes, then slowly sun-dried and stone-milled into a silky powder that first-timers digest easily.",
      "There is exactly one ingredient in the pack. No milk powder, no sugar, no flavourings, no thickeners. Just honest grain, so your baby's very first tastes stay simple and true.",
    ],
    highlights: [
      "Single ingredient: whole sprouted ragi",
      "Naturally rich in calcium & iron",
      "Smooth texture, easy on tiny tummies",
    ],
    ingredients:
      "100% organically grown ragi (finger millet), sprouted and sun-dried. That's it — one ingredient, nothing added, nothing removed.",
    nutrition: [
      { label: "Energy", value: "384 kcal" },
      { label: "Protein", value: "9.8 g" },
      { label: "Dietary fiber", value: "8.2 g" },
      { label: "Calcium", value: "364 mg" },
      { label: "Iron", value: "6.1 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Mix 2 tbsp with warm water or milk to a smooth paste, then cook on low heat for 2–3 minutes stirring gently. Cool to body temperature before feeding. Always taste before serving.",
    image: "/images/adielas/stage1.png",
    cut: "/images/adielas/stage1-cut.png",
    accent: "#D9A441",
    wash: "#EFDCA4",
    rating: 4.9,
    reviews: 128,
    stock: 120,
    sortOrder: 1,
  },
  {
    slug: "stage-2",
    name: "Stage 2 · Multigrain Medley",
    nameLine1: "STAGE 2",
    nameLine2: "MULTIGRAIN",
    stageLabel: "MULTIGRAIN",
    ageLabel: "6 months +",
    price: 399,
    mrp: 449,
    weight: "400 g",
    tagline: "Ragi now has company — four ancient grains, one happy bowl.",
    description: [
      "Stage 2 widens the plate. Sprouted ragi meets jowar, bajra and roasted rice — a medley of millets and grains that introduces new textures and a fuller amino-acid profile as your little one gets curious about taste.",
      "Every grain is sprouted separately for better digestibility, sun-dried the old way, and blended in proportions worked out with our pediatrician. Zero sugar, zero shortcuts.",
    ],
    highlights: [
      "Four sprouted grains in one bowl",
      "Complete plant protein profile",
      "Keeps them fuller, steadier energy",
    ],
    ingredients:
      "Sprouted ragi (finger millet), jowar (sorghum), bajra (pearl millet), roasted rice. All grains organically sourced, sprouted and naturally sun-dried.",
    nutrition: [
      { label: "Energy", value: "396 kcal" },
      { label: "Protein", value: "11.4 g" },
      { label: "Dietary fiber", value: "7.6 g" },
      { label: "Calcium", value: "289 mg" },
      { label: "Iron", value: "5.4 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Whisk 2–3 tbsp into 120 ml water or milk until lump-free. Cook on low flame for 3–4 minutes until it thickens, stir in a spoon of ghee if you like. Serve warm, not hot.",
    image: "/images/adielas/stage2.png",
    cut: "/images/adielas/stage2-cut.png",
    accent: "#B5793B",
    wash: "#F2CD96",
    rating: 4.8,
    reviews: 96,
    stock: 90,
    sortOrder: 2,
  },
  {
    slug: "stage-3",
    name: "Stage 3 · Dry Fruits Blend",
    nameLine1: "STAGE 3",
    nameLine2: "DRY FRUITS",
    stageLabel: "DRY FRUITS",
    ageLabel: "1 year +",
    price: 475,
    mrp: 525,
    weight: "400 g",
    tagline: "The big-kid bowl — multigrains folded with premium dry fruits.",
    description: [
      "Stage 3 is our richest blend yet. The Stage 2 multigrain base is gently folded with almond, cashew and dates powder — finely milled so it stays smooth while bringing deeper flavour, healthy fats and natural sweetness.",
      "The mild sweetness comes only from the dates and nuts themselves — never from added sugar. It's the porridge toddlers actually finish, and parents feel good about.",
    ],
    highlights: [
      "Almonds, cashews & date powder inside",
      "Healthy fats for brain development",
      "Naturally sweet — zero refined sugar",
    ],
    ingredients:
      "Sprouted multigrain base (ragi, jowar, bajra, rice) with almond, cashew and date powder. Dry fruits are cleaned, slow-roasted and stone-milled in small batches.",
    nutrition: [
      { label: "Energy", value: "421 kcal" },
      { label: "Protein", value: "12.9 g" },
      { label: "Dietary fiber", value: "7.1 g" },
      { label: "Calcium", value: "258 mg" },
      { label: "Iron", value: "4.9 mg" },
      { label: "Added sugar", value: "0 g" },
    ],
    howTo:
      "Stir 3 tbsp into 150 ml milk or water, cook for 3–4 minutes till creamy, and top with mashed banana or stewed apple for older toddlers. Serve lukewarm.",
    image: "/images/adielas/stage3.png",
    cut: "/images/adielas/stage3-cut.png",
    accent: "#5C2B2E",
    wash: "#EBC9BF",
    rating: 5.0,
    reviews: 141,
    stock: 80,
    sortOrder: 3,
  },
  {
    slug: "starter-trio",
    name: "The Starter Trio · Stages 1 + 2 + 3",
    nameLine1: "STARTER",
    nameLine2: "TRIO",
    stageLabel: "BEST VALUE",
    ageLabel: "All stages",
    price: 999,
    mrp: 1173,
    weight: "3 × 400 g",
    tagline: "All three jars in one box — the journey, start to finish.",
    description: [
      "One box, three jars, the whole ADIELAS journey. Start with single-grain Stage 1, graduate to the multigrain medley, and celebrate milestones with the dry-fruits blend.",
      "It also makes gift-giving simple — new parents get the complete stage system in one go, at nearly ₹175 less than buying each jar separately.",
    ],
    highlights: [
      "Save ₹174 vs buying jars separately",
      "Great first-birthday & baby-shower gift",
      "Full 3-stage feeding guide included",
    ],
    ingredients:
      "One jar each of Stage 1 (Sprouted Ragi), Stage 2 (Multigrain) and Stage 3 (Dry Fruits). See individual jars for full ingredient lists.",
    nutrition: [
      { label: "Jars", value: "3 × 400 g" },
      { label: "Servings", value: "~60 bowls total" },
      { label: "Shelf life", value: "6 months from packing" },
      { label: "Added sugar", value: "0 g across all stages" },
    ],
    howTo:
      "Begin with Stage 1 once your pediatrician green-signs solids around 5–6 months. Move to Stage 2 after two comfortable weeks, and Stage 3 around the first birthday.",
    image: "/images/adielas/jar-trio.png",
    cut: null as string | null,
    accent: "#A98139",
    wash: null as string | null,
    rating: 4.9,
    reviews: 57,
    stock: 50,
    sortOrder: 4,
  },
];

const CITIES: [string, string, string][] = [
  ["Bengaluru", "Karnataka", "560078"],
  ["Mumbai", "Maharashtra", "400001"],
  ["Delhi", "Delhi", "110001"],
  ["Hyderabad", "Telangana", "500001"],
  ["Chennai", "Tamil Nadu", "600001"],
  ["Pune", "Maharashtra", "411001"],
];

const NAMES = [
  "Ananya Sharma", "Rohit Verma", "Priya Nair", "Karthik Reddy", "Sneha Iyer",
  "Vikram Singh", "Divya Menon", "Arjun Patel", "Meera Krishnan", "Aditya Rao",
  "Kavya Desai", "Nikhil Joshi", "Pooja Bhatt", "Rahul Mishra", "Shreya Ghosh",
];

function orderNumber(i: number) {
  const t = (Date.now() - i * 3600_000).toString(36).toUpperCase().slice(-6);
  return `ADL-${t}${String(i % 100).padStart(2, "0")}`;
}

async function main() {
  console.log("🌱 Seeding ADIELAS store…");

  // --- Users ---
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@adielas.com" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: "admin@adielas.com",
      name: "Store Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "+919845379428",
    },
  });

  const custHash = await bcrypt.hash("Customer@123", 10);
  const customer = await db.user.upsert({
    where: { email: "priya@example.com" },
    update: { passwordHash: custHash },
    create: {
      email: "priya@example.com",
      name: "Priya Nair",
      passwordHash: custHash,
      role: "CUSTOMER",
      phone: "9876543210",
    },
  });

  await db.address.upsert({
    where: { id: "seed-addr" },
    update: {},
    create: {
      id: "seed-addr",
      userId: customer.id,
      label: "Home",
      fullName: "Priya Nair",
      phone: "9876543210",
      line1: "42, Palm Grove Apartments, 12th Main",
      line2: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true,
    },
  }).catch(() => {});

  // --- Products ---
  const created: Record<string, { id: string; price: number; image: string; name: string }> = {};
  for (const p of products) {
    const row = await db.product.upsert({
      where: { slug: p.slug },
      update: { ...p, description: JSON.stringify(p.description), highlights: JSON.stringify(p.highlights), nutrition: JSON.stringify(p.nutrition) },
      create: { ...p, description: JSON.stringify(p.description), highlights: JSON.stringify(p.highlights), nutrition: JSON.stringify(p.nutrition) },
    });
    created[p.slug] = { id: row.id, price: row.price, image: row.image, name: row.name };
  }
  console.log(`✅ ${Object.keys(created).length} products ready`);

  // --- Coupons ---
  const coupons = [
    { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 0, maxDiscount: 100 },
    { code: "FLAT50", type: "FLAT", value: 50, minOrder: 400, maxDiscount: null },
    { code: "TRIO15", type: "PERCENT", value: 15, minOrder: 900, maxDiscount: 200 },
  ];
  for (const c of coupons) {
    await db.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log(`✅ ${coupons.length} coupons ready`);

  // --- Demo orders: ~26 spread over the last 30 days ---
  const existingOrders = await db.order.count();
  if (existingOrders > 5) {
    console.log(`⏭️  ${existingOrders} orders already exist — skipping demo orders`);
  } else {
    const statuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "DELIVERED", "DELIVERED"];
    const pays = ["UPI", "UPI", "CARD", "COD"];
    let n = 0;
    for (let day = 29; day >= 0; day--) {
      // 0-2 orders per day
      const perDay = [0, 1, 1, 2, 2][Math.floor(Math.random() * 5)];
      for (let k = 0; k < perDay; k++) {
        n++;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - day);
        createdAt.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

        const slugPool = ["stage-1", "stage-2", "stage-3", "starter-trio"];
        const slug = slugPool[Math.floor(Math.random() * slugPool.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        const p = created[slug];

        const [city, state, pincode] = CITIES[Math.floor(Math.random() * CITIES.length)];
        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const status = day === 0 && k === 0 ? "PLACED" : statuses[Math.floor(Math.random() * statuses.length)];
        const paymentMethod = pays[Math.floor(Math.random() * pays.length)];
        const subtotal = p.price * qty;
        const shipping = subtotal >= 499 ? 0 : 49;
        const useCoupon = Math.random() < 0.25;
        const discount = useCoupon ? Math.round(subtotal * 0.1) : 0;
        const total = subtotal - discount + shipping;

        await db.order.create({
          data: {
            orderNumber: orderNumber(n),
            userId: Math.random() < 0.3 ? customer.id : null,
            email: name.toLowerCase().replace(/\s/g, ".") + "@example.com",
            customerName: name,
            phone: "9" + String(800000000 + Math.floor(Math.random() * 99999999)),
            addressLine1: `${10 + Math.floor(Math.random() * 300)}, Green Avenue, ${Math.floor(Math.random() * 12) + 1}th Cross`,
            city,
            state,
            pincode,
            paymentMethod,
            paymentStatus: status === "CANCELLED" ? "FAILED" : paymentMethod === "COD" ? "PENDING" : "PAID",
            status,
            subtotal,
            shipping,
            discount,
            total,
            couponCode: useCoupon ? "WELCOME10" : null,
            createdAt,
            updatedAt: createdAt,
            items: {
              create: [
                {
                  productId: p.id,
                  slug,
                  name: p.name,
                  price: p.price,
                  qty,
                  image: p.image,
                },
              ],
            },
          },
        });
      }
    }
    console.log(`✅ ${n} demo orders created`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("   Admin login    → admin@adielas.com / Admin@123");
  console.log("   Customer login → priya@example.com / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
