#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Vercel build script — DB-optional by design.
# - Always: prisma generate (postgres schema) + next build
# - Only when DATABASE_URL is set: schema push + seed
# - Never hard-fails the deploy because a database is missing
#   or unreachable; the storefront runs on built-in defaults
#   and activates admin/orders/accounts as soon as the DB is
#   connected and the app is redeployed.
# ─────────────────────────────────────────────────────────────
set -e

echo "── Step 1/3: prisma generate (postgres schema)"
npx prisma generate --schema prisma/schema.postgres.prisma

if [ -n "$DATABASE_URL" ]; then
  echo "── Step 2/3: DATABASE_URL found → schema push + guarded seed"
  if npx prisma db push --schema prisma/schema.postgres.prisma --skip-generate --accept-data-loss; then
    echo "── Schema push OK → seeding demo data (failures are non-fatal)"
    npx tsx prisma/seed.ts || echo "⚠ Seed skipped/failed (non-fatal — store runs with built-in defaults)"
  elif [ "$DB_FORCE_RESET" = "1" ]; then
    echo "── Normal push failed (schema drift) → DB_FORCE_RESET=1 → one-time force reset of a fresh database"
    if npx prisma db push --schema prisma/schema.postgres.prisma --skip-generate --accept-data-loss --force-reset; then
      echo "── Force reset + push OK → seeding demo data"
      npx tsx prisma/seed.ts || echo "⚠ Seed skipped/failed (non-fatal — store runs with built-in defaults)"
    else
      echo "⚠ Force reset also failed → skipping seed (site still deploys)"
    fi
  else
    echo "⚠ DATABASE_URL is set but schema push failed (drift?) → skipping seed (site still deploys)"
    echo "  → Tip: set env DB_FORCE_RESET=1 once to allow a one-time force reset of a FRESH/EMPTY database."
  fi
else
  echo "⚠ Step 2/3 skipped: DATABASE_URL is NOT set yet."
  echo "  → Site will deploy and serve the storefront with built-in content."
  echo "  → Connect a Postgres DB (Vercel → Storage → Neon) then redeploy to activate admin CMS, orders & accounts."
fi

echo "── Step 3/3: next build"
npx next build
