import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { Prisma, Category } from "@prisma/client";
import { prisma } from "../../lib/prisma.ts";

type ProductRow = Record<string, string>;

export type ProductResponse = {
  status: number;
  body: Record<string, unknown>;
};

function parseCategory(value: string | undefined): Category {
  if (!value) {
    throw new Error("Category is required for product rows");
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

type ReviewerOptions = {
  email?: string;
  country?: string;
};

type OwnerOptions = {
  name?: string;
  email?: string;
  country?: string;
};

class ProductService {
  private ownerId: string | null = null;
  private products = new Map<string, string>();
  private reviewers = new Map<string, string>();
  private reviewIds: string[] = [];
  private extraOwnerIds: string[] = [];

  async seed(rows: ProductRow[]) {
    for (const row of rows) {
      const ownerOverrides: OwnerOptions = {
        name: row["owner name"]?.trim(),
        email: row["owner email"]?.trim(),
        country: row["owner country"]?.trim(),
      };
      const ownerId =
        ownerOverrides.name || ownerOverrides.email || ownerOverrides.country
          ? await this.createOwner(ownerOverrides)
          : await this.ensureOwner();

      const title = row.title?.trim();
      if (!title) {
        throw new Error("Each product row must include a title");
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
        select: { id: true },
      });

      this.products.set(title, product.id);
    }
  }

  async seedReviews(rows: ProductRow[]) {
    const ratingRollups = new Map<string, { total: number; count: number }>();

    for (const row of rows) {
      const productTitle = row.product?.trim() || row.title?.trim();
      if (!productTitle) {
        throw new Error("Each review row must include a product title");
      }
      const productId = this.products.get(productTitle);
      if (!productId) {
        throw new Error(
          `No product found for review with title "${productTitle}"`,
        );
      }

      const reviewerName = row.reviewer?.trim();
      if (!reviewerName) {
        throw new Error("Each review row must include a reviewer column");
      }
      const reviewerEmail =
        row["reviewer email"]?.trim() || row.email?.trim() || undefined;
      const reviewerCountry =
        row["reviewer country"]?.trim() || row.country?.trim() || undefined;
      const reviewerId = await this.ensureReviewer(reviewerName, {
        email: reviewerEmail,
        country: reviewerCountry,
      });

      const text = row.text?.trim() || "Great work!";
      const rating = row.rating ? Number(row.rating) : null;
      if (row.rating && Number.isNaN(rating)) {
        throw new Error(`Invalid rating "${row.rating}" for ${productTitle}`);
      }

      const review = await prisma.reviews.create({
        data: {
          user_id: reviewerId,
          product_id: productId,
          text,
          rating: rating ?? undefined,
          date: new Date(),
        },
        select: { id: true },
      });

      this.reviewIds.push(review.id);

      if (rating !== null) {
        const current = ratingRollups.get(productId) ?? { total: 0, count: 0 };
        ratingRollups.set(productId, {
          total: current.total + rating,
          count: current.count + 1,
        });
      }
    }

    for (const [productId, { total, count }] of ratingRollups.entries()) {
      await prisma.posts.update({
        where: { id: productId },
        data: {
          rating: total / count,
          ratingCount: count,
        },
      });
    }
  }

  async fetchByTitle(title: string): Promise<ProductResponse> {
    const productId = this.products.get(title);
    if (!productId) {
      throw new Error(`No product seeded with title "${title}"`);
    }
    return this.fetchBySlug(productId);
  }

  async fetchBySlug(slug: string): Promise<ProductResponse> {
    if (!slug) {
      return {
        status: 400,
        body: { message: "Invalid product ID" },
      };
    }

    try {
      const product = await prisma.posts.findUnique({
        where: { id: slug },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              country: true,
              email: true,
            },
          },
          reviews: {
            include: {
              users: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  email: true,
                },
              },
              replies: {
                select: {
                  id: true,
                  date: true,
                  text: true,
                },
              },
            },
            orderBy: { date: "desc" },
          },
        },
      });

      if (!product) {
        return {
          status: 404,
          body: { message: "Product not found" },
        };
      }

      return {
        status: 200,
        body: {
          ...product,
          image_url: "/no-image.svg",
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          status: 400,
          body: { message: "Invalid product ID" },
        };
      }
      throw error;
    }
  }

  async cleanup() {
    if (this.reviewIds.length > 0) {
      await prisma.reviews.deleteMany({
        where: { id: { in: this.reviewIds } },
      });
      this.reviewIds = [];
    }

    const productIds = Array.from(this.products.values());
    if (productIds.length > 0) {
      await prisma.posts.deleteMany({
        where: { id: { in: productIds } },
      });
      this.products.clear();
    }

    if (this.ownerId) {
      await prisma.users
        .delete({ where: { id: this.ownerId } })
        .catch(() => null);
      this.ownerId = null;
    }
    if (this.extraOwnerIds.length > 0) {
      await prisma.users.deleteMany({
        where: { id: { in: this.extraOwnerIds } },
      });
      this.extraOwnerIds = [];
    }
    if (this.reviewers.size > 0) {
      await prisma.users.deleteMany({
        where: { id: { in: Array.from(this.reviewers.values()) } },
      });
      this.reviewers.clear();
    }
  }

  private async ensureOwner() {
    if (this.ownerId) return this.ownerId;
    const hashed = await bcrypt.hash("ProductPass123!", 10);
    const user = await prisma.users.create({
      data: {
        name: "Product Fixture",
        email: `product-${randomUUID()}@example.com`,
        password: hashed,
        country: "US",
      },
      select: { id: true },
    });
    this.ownerId = user.id;
    return user.id;
  }

  private async createOwner(options: OwnerOptions) {
    const hashed = await bcrypt.hash("ProductOwnerPass123!", 10);
    const user = await prisma.users.create({
      data: {
        name: options.name ?? "Product Fixture",
        email: options.email ?? `owner-${randomUUID()}@example.com`,
        password: hashed,
        country: options.country ?? "US",
      },
      select: { id: true },
    });
    this.extraOwnerIds.push(user.id);
    return user.id;
  }

  private async ensureReviewer(name: string, options: ReviewerOptions = {}) {
    const existing = this.reviewers.get(name);
    if (existing) return existing;
    const hashed = await bcrypt.hash("ReviewerPass123!", 10);
    const safeEmail =
      options.email ?? `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const user = await prisma.users.create({
      data: {
        name,
        email: safeEmail,
        password: hashed,
        country: options.country ?? "US",
      },
      select: { id: true },
    });
    this.reviewers.set(name, user.id);
    return user.id;
  }
}

export const productService = new ProductService();
