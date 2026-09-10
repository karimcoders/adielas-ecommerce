const { execSync } = require("child_process");

const fs = require("fs");
const path = require("path");

console.log("==> ADIELAS Production Build Script");

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres")) {
    console.log("==> PostgreSQL detected. Copying postgres schema to schema.prisma...");
    fs.copyFileSync(
      path.join(__dirname, "../prisma/schema.postgres.prisma"),
      path.join(__dirname, "../prisma/schema.prisma")
    );
    console.log("==> Running Prisma generate & push...");
    execSync("npx prisma generate && npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit" });
    if (fs.existsSync(path.join(__dirname, "seed-neon.js"))) {
      try {
        console.log("==> Ensuring Neon seed data...");
        execSync("node scripts/seed-neon.js", { stdio: "inherit" });
      } catch (seedErr) {
        console.warn("==> Seed note (non-fatal):", seedErr.message);
      }
    }
  } else {
    console.log("==> Running standard Prisma generate...");
    execSync("npx prisma generate", { stdio: "inherit" });
  }
} catch (err) {
  console.warn("==> Warning during Prisma setup:", err.message);
}

console.log("==> Compiling Next.js application...");
execSync("npx next build", { stdio: "inherit" });
console.log("==> Build finished successfully!");
