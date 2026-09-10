# 🚀 ADIELAS Store — Vercel Deployment Guide

Full-stack e-commerce store with Shopify-style admin dashboard. This guide takes you
from zero to a live store on your own domain (free tier is enough).

---

## What's inside

| Area | Details |
|---|---|
| Storefront | Home, Shop, Product pages, Cart, Checkout (UPI/Card/COD) |
| Customer accounts | Register/Login, Order history + tracking, Addresses, Profile |
| Admin panel | `/admin` — Dashboard KPIs + charts, Products CRUD, Orders + status flow, Customers, Coupons |
| Backend | Next.js API routes, JWT auth (httpOnly cookie, bcrypt), Prisma ORM |
| Database | SQLite locally → **PostgreSQL in production** (required on Vercel) |

---

## Step 0 — Free PostgreSQL database banao (5 min)

Vercel pe SQLite nahi chalti (serverless filesystem read-only hoti hai), isliye ek
free **Postgres** database chahiye. Best free options:

### Option A: Neon (recommended — fastest free tier)
1. https://neon.tech → Sign up (GitHub se login karo)
2. **Create project** → naam do (e.g. `adielas-prod`)
3. Connection string copy karo — aisa dikhega:
   ```
   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase
1. https://supabase.com → New project
2. Settings → Database → Connection string → **URI** (Transaction pooler wala)
3. Password set karke string copy karo

### Option C: Vercel Postgres
1. Vercel dashboard → Storage → Create Database → Postgres
2. `.env.local` tab pull karke connection string milegi

> ⚠️ **Pooler connection string** use karo (Neon me `-pooler` wala, Supabase me
> "Transaction" port `6543`) — serverless functions ke liye ye zaroori hai.

---

## Step 1 — Code ko GitHub pe push karo

```bash
# project folder me
cd your-project

git init
git add .
git commit -m "ADIELAS full-stack store"

# GitHub pe naya repo banao (github.com/new) — e.g. adielas-store
git remote add origin https://github.com/YOUR_USERNAME/adielas-store.git
git branch -M main
git push -u origin main
```

> `.gitignore` me `db/`, `.env`, `node_modules/` already hain — secrets push nahi honge.

---

## Step 2 — Vercel pe import karo

1. https://vercel.com/new → **Import Git Repository** → apna `adielas-store` repo select karo
2. Framework automatically **Next.js** detect hoga — build settings default rehne do
3. **Environment Variables** me ye 2 add karo:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | apna Postgres connection string (Step 0 se) |
   | `AUTH_SECRET` | koi lamba random string — banao: `openssl rand -base64 32` |

4. **Deploy** dabao — first build ~2-3 min

---

## Step 3 — Database me tables banao (one-time)

Apne computer se production DB me schema push karo:

```bash
# local terminal me (project folder me)
PROD="postgresql://...apna-neon-url...?sslmode=require"

# tables create karo
DATABASE_URL="$PROD" npx prisma db push --schema prisma/schema.postgres.prisma

# products + admin account + demo orders seed karo (optional but recommended)
DATABASE_URL="$PROD" bun prisma/seed.ts
```

> Seed demo orders bhi deta hai (dashboard charts ke liye). Naye store ke liye
> demo orders nahi chahiye toh seed ke baad admin → Orders se delete kar sakte ho,
> ya seed.ts me orders wala block skip karo.

---

## Step 4 — Live store check karo 🎉

| URL | Kya hai |
|---|---|
| `https://your-app.vercel.app/` | Storefront |
| `https://your-app.vercel.app/shop` | Shop |
| `https://your-app.vercel.app/login` | Customer login |
| `https://your-app.vercel.app/account` | Customer dashboard |
| `https://your-app.vercel.app/admin` | **Admin panel** |

**Default logins (seed ke baad):**
- Admin → `admin@adielas.com` / `Admin@123`
- Demo customer → `priya@example.com` / `Customer@123`

> 🔐 **PRODUCTION ME PEHLA KAAM:** Admin panel → nothing, direct DB update:
> ```bash
> # naya admin banao apne email se, purana delete karo
> DATABASE_URL="$PROD" node -e "
> const { PrismaClient } = require('@prisma/client');
> const bcrypt = require('bcryptjs');
> const db = new PrismaClient();
> db.user.upsert({
>   where: { email: 'YOU@YOURMAIL.com' },
>   update: { role: 'ADMIN' },
>   create: { email: 'YOU@YOURMAIL.com', name: 'Owner', role: 'ADMIN',
>             passwordHash: bcrypt.hashSync('YOUR_STRONG_PASSWORD', 10) },
> }).then(() => db.$disconnect());
> "
> ```

---

## Local development

```bash
bun install
bun run db:push        # SQLite tables (local)
bun run db:seed        # demo data
bun run dev            # http://localhost:3000
```

Local me SQLite use hoti hai (`db/custom.db`) — kuch setup nahi chahiye.

---

## Production commands (cheat-sheet)

```bash
bun run db:push:prod   # Postgres schema push (PROD_DATABASE_URL env ke saath)
bun run db:seed:prod   # seed production DB
bun run lint           # code check
bun run build          # production build test
```

---

## Architecture notes

- **Auth**: JWT (HS256 via `jose`) in httpOnly cookie `adielas_session`, 7-day expiry.
  Passwords hashed with bcrypt. Roles: `ADMIN` / `CUSTOMER`.
- **Middleware** protects `/admin/*` (admin-only) and `/account/*` (logged-in) at the edge.
- **Orders**: server-side price validation from DB (client prices are never trusted),
  coupon engine (percent/flat, min-order, max-cap, expiry), stock decrement,
  free shipping ≥ ₹499 else ₹49.
- **Catalog**: root layout loads active products from DB → CatalogProvider context →
  whole storefront is DB-driven. Fallback to bundled starter catalog if DB is empty.
- **Admin status flow**: PLACED → CONFIRMED → SHIPPED → DELIVERED (CANCELLED restores stock).
- **Coupons**: WELCOME10 (10% off, cap ₹100), FLAT50 (₹50 off ≥ ₹400), TRIO15 (15% off ≥ ₹900, cap ₹200).

## Env vars reference

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | SQLite (local) ya Postgres (prod) connection |
| `AUTH_SECRET` | ✅ prod | JWT signing secret (random 32+ chars) |

---

Koi issue aaye toh — Vercel deploy logs check karo (Deployments → click build),
wahan exact error dikhta hai. Happy selling! 🛒
