const { execSync } = require("child_process");

console.log("==> ADIELAS Production Build Script");

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres")) {
    console.log("==> PostgreSQL detected. Running Prisma generate & push...");
    execSync("npx prisma generate --schema prisma/schema.postgres.prisma && npx prisma db push --schema prisma/schema.postgres.prisma --skip-generate", { stdio: "inherit" });
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
