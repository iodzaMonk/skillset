import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { defineConfig } from "prisma/config";

const envFiles = [".env", ".env.local"];

if (typeof process.loadEnvFile === "function") {
  // Prisma loads this config before hydrating process.env, so pull env files in manually.
  for (const envFile of envFiles) {
    const fullPath = path.resolve(process.cwd(), envFile);
    if (existsSync(fullPath)) {
      process.loadEnvFile(fullPath);
    }
  }
}

export default defineConfig({
  migrations: {
    seed: `tsx prisma/seed.ts`,
  },
});
