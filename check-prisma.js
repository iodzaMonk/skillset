import { PrismaClient } from "@prisma/client";
import * as PrismaModule from "@prisma/client";
import { spawnSync } from "node:child_process";

const prisma = new PrismaClient();
console.log("Keys on prisma instance:", Object.keys(prisma));

// ESM import replaces require()
console.log("Keys on Prisma Module:", Object.keys(PrismaModule));

const result = spawnSync("node", ["--version"], { encoding: "utf-8" });
if (result.error) {
  console.error("Failed to check Node version:", result.error);
  process.exit(1);
}
console.log("Node version:", result.stdout.trim());
