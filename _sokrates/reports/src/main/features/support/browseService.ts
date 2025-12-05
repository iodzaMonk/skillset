import { Category, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma.ts";

type ProductInputRow = Record<string, string>;

export type ProductRecord = Prisma.postsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    category: true;
    price: true;
  };
}>;

function parseCategory(value: string | undefined): Category {
  if (!value) {
    throw new Error("Category is required for each product row");
  }
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}

function parsePrice(value: string | undefined): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid price "${value}"`);
  }
  return parsed;
}

class BrowseService {
  private userId: string | null = null;
  private productIds: string[] = [];

  async seedProducts(rows: ProductInputRow[]) {
    const ownerId = await this.ensureOwner();
    for (const row of rows) {
      const title = row.title?.trim();
      if (!title) {
        throw new Error("Each product requires a title");
      }
      const category = parseCategory(row.category);
      const price = parsePrice(row.price);
      const description = row.description?.trim() || `${title} description`;

      const product = await prisma.posts.create({
        data: {
          user_id: ownerId,
          title,
          description,
          price,
          category,
        },
        select: {
          id: true,
        },
      });

      this.productIds.push(product.id);
    }
  }

  async listProducts(category?: string | null) {
    if (this.productIds.length === 0) {
      return [];
    }
    const where: Prisma.postsWhereInput = {
      id: { in: this.productIds },
    };
    if (category) {
      where.category = parseCategory(category);
    }
    const products = await prisma.posts.findMany({
      where,
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        price: true,
      },
    });
    return products;
  }

  async cleanup() {
    if (this.productIds.length > 0) {
      await prisma.posts.deleteMany({
        where: { id: { in: this.productIds } },
      });
      this.productIds = [];
    }
    if (this.userId) {
      await prisma.users
        .delete({
          where: { id: this.userId },
        })
        .catch(() => null);
      this.userId = null;
    }
  }

  private async ensureOwner() {
    if (this.userId) return this.userId;
    const hashed = await bcrypt.hash("BrowsePass123!", 10);
    const user = await prisma.users.create({
      data: {
        name: "Browse Fixture",
        email: `browse-${randomUUID()}@example.com`,
        password: hashed,
        country: "US",
      },
      select: {
        id: true,
      },
    });
    this.userId = user.id;
    return user.id;
  }
}

export const browseService = new BrowseService();
