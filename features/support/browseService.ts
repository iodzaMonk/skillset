import { prisma } from "../../lib/prisma.ts";
import type { $Enums } from "@prisma/client";

type ProductInputRow = Record<string, string>;

export type ProductRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
};

import { parseCategory, parsePrice } from "./parsing-helpers.ts";
import { ensureFixtureUser, cleanupEntities } from "./fixture-helpers.ts";

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
    const where: { id: { in: string[] }; category?: $Enums.Category } = {
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
    await cleanupEntities(prisma, {
      productIds: this.productIds,
      userId: this.userId,
    });
    this.productIds = [];
    this.userId = null;
  }

  private async ensureOwner() {
    const { userId } = await ensureFixtureUser(
      this.userId,
      "Browse Fixture",
      "browse",
    );
    this.userId = userId;
    return userId;
  }
}

export const browseService = new BrowseService();
