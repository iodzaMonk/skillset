import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma.ts";

export async function ensureFixtureUser(
  userId: string | null,
  name: string,
  emailPrefix: string,
): Promise<{ userId: string; isNew: boolean }> {
  if (userId) return { userId, isNew: false };
  const hashed = await bcrypt.hash("FixturePass123!", 10);
  const user = await prisma.users.create({
    data: {
      name,
      email: `${emailPrefix}-${randomUUID()}@example.com`,
      password: hashed,
      country: "US",
    },
    select: {
      id: true,
    },
  });
  return { userId: user.id, isNew: true };
}

export async function cleanupEntities(
  prismaClient: Prisma.TransactionClient,
  options: {
    userId?: string | null;
    productIds?: string[];
    reviewIds?: string[];
    userIds?: string[];
  },
) {
  if (options.reviewIds?.length) {
    await prismaClient.reviews.deleteMany({
      where: { id: { in: options.reviewIds } },
    });
  }

  if (options.productIds?.length) {
    await prismaClient.posts.deleteMany({
      where: { id: { in: options.productIds } },
    });
  }

  const userIds = options.userIds ?? [];
  if (options.userId) userIds.push(options.userId);

  if (userIds.length > 0) {
    // Delete individually to handle potential constraints or failures gracefully if needed,
    // though deleteMany is usually fine. Using deleteMany for efficiency.
    await prismaClient.users.deleteMany({
      where: { id: { in: userIds } },
    });
  }
}
