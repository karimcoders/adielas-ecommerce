/**
 * Backfill demo analytics for the ADIELAS store (AnalyticsEvent model).
 *
 * Self-guarding: runs ONLY when the AnalyticsEvent table is empty — fresh DBs
 * and stores that just enabled tracking. Creates ~30 days of realistic
 * browsing sessions (Indian + international cities, devices, sources) and one
 * `order_placed` event for every order already in the database, attached to a
 * session from the same day so conversion numbers stay coherent.
 *
 * Run: npx tsx prisma/backfill-analytics.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CITIES: [string, string, string][] = [
  // [city, region, country]
  ["Mumbai", "Maharashtra", "IN"],
  ["Delhi", "Delhi", "IN"],
  ["Bengaluru", "Karnataka", "IN"],
  ["Hyderabad", "Telangana", "IN"],
  ["Chennai", "Tamil Nadu", "IN"],
  ["Pune", "Maharashtra", "IN"],
  ["Kolkata", "West Bengal", "IN"],
  ["Ahmedabad", "Gujarat", "IN"],
  ["Jaipur", "Rajasthan", "IN"],
  ["Lucknow", "Uttar Pradesh", "IN"],
  ["Indore", "Madhya Pradesh", "IN"],
  ["Kochi", "Kerala", "IN"],
  ["Chandigarh", "Chandigarh", "IN"],
  ["Dubai", "Dubai", "AE"],
  ["London", "England", "GB"],
  ["Singapore", "Singapore", "SG"],
];

const SOURCES: (string | null)[] = [
  null, // direct
  null,
  "https://www.google.com/",
  "https://www.google.com/",
  "https://www.instagram.com/",
  "https://www.facebook.com/",
  "https://wa.me/",
  "https://www.youtube.com/",
];

const DEVICES: [string, number][] = [
  ["Mobile", 68],
  ["Desktop", 24],
  ["Tablet", 8],
];
const BROWSERS = ["Chrome", "Chrome", "Chrome", "Safari", "Safari", "Firefox", "Samsung Internet", "Edge"];
const OS_BY_DEVICE: Record<string, string[]> = {
  Mobile: ["Android", "Android", "Android", "iOS", "iOS"],
  Desktop: ["Windows", "Windows", "macOS"],
  Tablet: ["iOS", "Android"],
};

const PAGES = ["/", "/shop", "/shop/stage-1", "/shop/stage-2", "/shop/stage-3", "/shop/starter-trio", "/checkout", "/login", "/register"];
const PRODUCTS = ["stage-1", "stage-2", "stage-3", "starter-trio"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedDevice(): string {
  const r = Math.random() * 100;
  let acc = 0;
  for (const [d, w] of DEVICES) {
    acc += w;
    if (r < acc) return d;
  }
  return "Mobile";
}

async function main() {
  const existing = await db.analyticsEvent.count();
  if (existing > 0) {
    console.log(`⏭️  ${existing} analytics events already exist — backfill skipped`);
    return;
  }

  const products = await db.product.findMany({ select: { slug: true, name: true, price: true } });
  if (products.length === 0) {
    console.log("⏭️  No products yet — analytics backfill skipped");
    return;
  }

  const demoCustomer = await db.user.findUnique({
    where: { email: "priya@example.com" },
    select: { id: true, email: true, name: true },
  });

  const DAYS = 30;
  const now = Date.now();
  type Row = {
    visitorId: string;
    sessionId: string;
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    event: string;
    path: string;
    referrer: string | null;
    city: string;
    region: string;
    country: string;
    device: string;
    browser: string;
    os: string;
    metadata: string | null;
    createdAt: Date;
  };
  const rows: Row[] = [];
  const sessionIdsByDay: Record<number, { sid: string; vid: string }[]> = {};

  for (let d = DAYS - 1; d >= 0; d--) {
    const dayStart = now - d * 24 * 3600 * 1000;
    const dayIdx = DAYS - 1 - d;
    const sessions = 3 + Math.floor(Math.random() * 6); // 3-8 sessions/day
    for (let s = 0; s < sessions; s++) {
      const vid = `demo-visitor-${dayIdx.toString().padStart(2, "0")}${s}-${Math.random().toString(36).slice(2, 8)}`;
      const sid = `demo-session-${dayIdx.toString().padStart(2, "0")}${s}-${Math.random().toString(36).slice(2, 8)}`;
      sessionIdsByDay[dayIdx] = sessionIdsByDay[dayIdx] ?? [];
      sessionIdsByDay[dayIdx].push({ sid, vid });

      const [city, region, country] = pick(CITIES);
      const device = weightedDevice();
      const browser = pick(BROWSERS);
      const os = pick(OS_BY_DEVICE[device] ?? ["Other"]);
      const referrer = pick(SOURCES);
      const isKnown = demoCustomer && Math.random() < 0.18;
      const userId = isKnown ? demoCustomer!.id : null;
      const email = isKnown ? demoCustomer!.email : null;
      const name = isKnown ? demoCustomer!.name : null;

      // session start within the day
      const start = dayStart - Math.floor(Math.random() * 20 * 3600 * 1000);
      if (start > now) continue;

      const pages = 1 + Math.floor(Math.random() * 4);
      let t = start;
      let carted: (typeof products)[number] | null = null;
      for (let p = 0; p < pages; p++) {
        const path = pick(PAGES);
        t += Math.floor(Math.random() * 90 * 1000);
        rows.push({
          visitorId: vid,
          sessionId: sid,
          userId,
          userEmail: email,
          userName: name,
          event: "page_view",
          path,
          referrer: p === 0 ? referrer : null,
          city,
          region,
          country,
          device,
          browser,
          os,
          metadata: null,
          createdAt: new Date(Math.min(t, now - 60_000)),
        });

        const slug = PRODUCTS.find((x) => path === `/shop/${x}`);
        if (slug) {
          const prod = products.find((x) => x.slug === slug);
          if (prod) {
            rows.push({
              visitorId: vid, sessionId: sid, userId, userEmail: email, userName: name,
              event: "product_view",
              path, referrer: null, city, region, country, device, browser, os,
              metadata: JSON.stringify({ slug: prod.slug, name: prod.name, price: prod.price }),
              createdAt: new Date(Math.min(t + 500, now - 60_000)),
            });
            // ~35% add to cart
            if (Math.random() < 0.35) {
              carted = prod;
              rows.push({
                visitorId: vid, sessionId: sid, userId, userEmail: email, userName: name,
                event: "add_to_cart",
                path, referrer: null, city, region, country, device, browser, os,
                metadata: JSON.stringify({ slug: prod.slug, name: prod.name, qty: 1, price: prod.price }),
                createdAt: new Date(Math.min(t + 8000, now - 60_000)),
              });
            }
          }
        }
      }

      if (carted && Math.random() < 0.3) {
        t += 25000;
        rows.push({
          visitorId: vid, sessionId: sid, userId, userEmail: email, userName: name,
          event: "begin_checkout",
          path: "/checkout", referrer: null, city, region, country, device, browser, os,
          metadata: JSON.stringify({ itemCount: 1, subtotal: carted.price }),
          createdAt: new Date(Math.min(t, now - 60_000)),
        });
      }
    }
  }

  // --- order_placed events for every order already in the DB ---
  const orders = await db.order.findMany({
    select: {
      orderNumber: true, total: true, discount: true, subtotal: true, email: true,
      customerName: true, userId: true, city: true, state: true, paymentMethod: true, createdAt: true,
    },
  });
  for (const o of orders) {
    const dayIdx = Math.min(
      DAYS - 1,
      Math.max(0, Math.floor((now - o.createdAt.getTime()) / (24 * 3600 * 1000))),
    );
    const pool = sessionIdsByDay[dayIdx] ?? [];
    const session = pool.length ? pick(pool) : { sid: `order-${o.orderNumber}`, vid: `order-${o.orderNumber}` };
    rows.push({
      visitorId: session.vid,
      sessionId: session.sid,
      userId: o.userId,
      userEmail: o.email,
      userName: o.customerName,
      event: "order_placed",
      path: "/checkout",
      referrer: null,
      city: o.city,
      region: o.state,
      country: "IN",
      device: pick(["Mobile", "Mobile", "Desktop"]),
      browser: pick(BROWSERS),
      os: pick(["Android", "iOS", "Windows", "macOS"]),
      metadata: JSON.stringify({
        orderNumber: o.orderNumber,
        total: o.total,
        discount: o.discount,
        subtotal: o.subtotal,
        itemCount: 1,
        customerName: o.customerName,
        customerEmail: o.email,
        city: o.city,
        paymentMethod: o.paymentMethod,
      }),
      createdAt: o.createdAt,
    });
  }

  // chunked insert (Neon payload limits)
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await db.analyticsEvent.createMany({ data: rows.slice(i, i + CHUNK) });
  }

  console.log(`✅ Analytics backfill: ${rows.length} events (${orders.length} linked to real orders) over ${DAYS} days`);
}

main()
  .catch((e) => {
    console.error("⚠ analytics backfill failed (non-fatal):", e.message);
  })
  .finally(() => db.$disconnect());
