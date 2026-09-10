import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const defaultPages = [
  {
    slug: "about-us",
    title: "About ADIELAS — Pure Pediatrician-Backed Nutrition",
    content: `## The ADIELAS Story

For over 35 years, **Dr. Vandana** watched thousands of concerned mothers ask the same heartfelt question in her clinic:
*"Doctor, what can I feed my child that is genuinely wholesome, free from synthetic preservatives, and easy on tiny tummies?"*

Commercial baby cereals were loaded with refined sugars, maltodextrin, artificial vitamins, and palm oils. Traditional homemade sprouted porridge (*ragi malt*) took days of soaking, sprouting, sun-drying, roasting, and hand-grinding — time that working modern parents simply didn't have.

### The Science of Sprouting
When whole grains and millets are sprouted:
- **Bio-availability increases by up to 300%**: Phytic acid is broken down, unlocking natural calcium, iron, and zinc.
- **Enzymatic pre-digestion**: Complex starches break down into easily absorbable nutrients, completely avoiding bloating and colic.
- **Zero Added Nasties**: Zero cane sugar, zero preservatives, zero milk powder solids, and zero chemical stabilizers.

Every jar of ADIELAS is crafted in our ISO-certified, hygienic Bangalore kitchen using 100% naturally sun-dried grains and slow stone-ground precision.`,
    published: true,
  },
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery Policy",
    content: `## Quick & Safe Nationwide Delivery

We know your little ones can't wait! Every batch of ADIELAS is freshly packed to ensure maximum nutritional potency.

### Delivery Timelines:
- **Bengaluru & Metros**: 24 to 48 hours.
- **Tier 2 & Tier 3 Cities**: 2 to 4 business days.
- **Rest of India**: 4 to 6 business days.

### Shipping Charges:
- **FREE Express Delivery** on all orders above **₹999**.
- A nominal flat fee of **₹79** applies to orders below ₹999.

### Real-Time Tracking:
As soon as your package is dispatched from our Bangalore facility, you will receive a tracking link via SMS, WhatsApp, and Email. You can also track your live order anytime from your [Customer Account](/account).`,
    published: true,
  },
  {
    slug: "refund-policy",
    title: "Refund & Replacement Policy",
    content: `## Our 100% Little Champion Guarantee

We are committed to delivering the purest nutrition for your child. If you or your baby are not delighted with your order, we are here to make it right.

### Damaged or Tampered Jars:
In the rare event that an item is damaged in transit or the tamper seal is broken:
1. Snap a quick photo of the jar and outer carton.
2. Send it to us via WhatsApp at **+91 98453 79428** or email **Info@adielas.com** within 48 hours of delivery.
3. We will immediately ship an express replacement at zero cost or process a full refund to your original payment method.

### Unopened Jars:
Unopened, sealed jars can be returned within **7 days** of receipt for a replacement or store credit.`,
    published: true,
  },
  {
    slug: "privacy-policy",
    title: "Privacy & Data Protection",
    content: `## Protecting Your Family's Privacy

At ADIELAS, we take your personal data as seriously as we take your child's nutrition.

### Information We Collect:
- Name, delivery address, phone number, and email address solely for fulfilling your orders and providing delivery updates.
- We **never** store credit card numbers, CVVs, or UPI PINs. All payment transactions are encrypted end-to-end through RBI-authorized payment gateways.

### Data Sharing:
We strictly do **not** sell, rent, or trade your personal information to third-party advertisers. Information is only shared with our verified logistics partners (e.g., Delhivery, BlueDart) to execute doorstep delivery.`,
    published: true,
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions (FAQ)",
    content: `## Have Questions? We Have Answers!

### 1. Which stage is right for my baby?
- **Stage 1 (6+ Months)**: Single grain sprouted ragi & green gram. Ultra-smooth texture, highly bioavailable iron, gentle on initial weaning.
- **Stage 2 (8+ Months)**: Multigrain power blend with sprouted wheat, oats, ragi, and sweet almond meal.
- **Stage 3 (12+ Months - 3 Years)**: Dense nutrition booster with dry fruits, cashew, walnut, dates powder, and whole grains.

### 2. How do I prepare ADIELAS porridge?
1. Mix 2 tablespoons (approx 25g) of ADIELAS powder with 150ml of water or warm milk in a clean saucepan.
2. Whisk thoroughly until smooth with no lumps.
3. Cook on a medium flame for 3–5 minutes while stirring continuously until it thickens to a comforting pudding consistency.
4. Cool to lukewarm temperature and serve fresh to your baby.

### 3. What is the shelf life?
ADIELAS porridge mixes stay fresh for **12 months** from manufacture when unopened in our airtight foil-sealed jars. Once opened, keep stored in a cool, dry place and consume within 30 days.`,
    published: true,
  },
];

export async function GET(req: Request) {
  try {
    const count = await db.customPage.count();
    if (count === 0) {
      for (const p of defaultPages) {
        await db.customPage.create({
          data: p,
        });
      }
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const page = await db.customPage.findUnique({
        where: { slug },
      });
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json({ page });
    }

    const pages = await db.customPage.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, content, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const existing = await db.customPage.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "A page with this URL slug already exists" }, { status: 400 });
    }

    const page = await db.customPage.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        content: content || "",
        published: published ?? true,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create page" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, slug, content, published } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: "ID, title, and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const page = await db.customPage.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        content: content || "",
        published: published ?? true,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    await db.customPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete page" }, { status: 500 });
  }
}
