import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL && typeof process.loadEnvFile === "function") {
  for (const envFile of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(envFile);
    } catch {}
    if (process.env.DATABASE_URL) break;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
