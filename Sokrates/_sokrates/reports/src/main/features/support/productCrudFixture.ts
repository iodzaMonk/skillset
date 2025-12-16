import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { ZodError } from "zod";
import {
  createProductRecord,
  updateProductRecord,
  listProductsForUser,
  deleteProductRecord,
  ProductNotFoundError,
} from "../../app/lib/productCrud.ts";
import { prisma } from "../../lib/prisma.ts";

type ProductResponse = {
  status: number;
  body: Record<string, unknown>;
};

type ProductRow = Record<string, string>;

export class ProductCrudFixture {
  private userId: string | null = null;
  private otherUserIds: Set<string> = new Set();
  private productTitles = new Map<string, string>();
  private trackedProductIds = new Set<string>();
  response: ProductResponse | null = null;

  async authenticate() {
    if (this.userId) return this.userId;
    this.userId = await this.createUser("crud-owner");
    return this.userId;
  }

  signOut() {
    this.userId = null;
  }

  async seedMyProducts(rows: ProductRow[]) {
    await this.authenticate();
    for (const row of rows) {
      const record = await createProductRecord(
        this.userId as string,
        this.toPayload(row),
      );
      this.trackProduct(record.title ?? record.id, record.id);
    }
  }

  async seedForeignProducts(rows: ProductRow[]) {
    const ownerId = await this.createUser(`crud-foreign-${randomUUID()}`);
    this.otherUserIds.add(ownerId);
    for (const row of rows) {
      const record = await createProductRecord(ownerId, this.toPayload(row));
      this.trackedProductIds.add(record.id);
    }
  }

  private requireAuth(): boolean {
    if (!this.userId) {
      this.response = {
        status: 401,
        body: { message: "Not authenticated" },
      };
      return false;
    }
    return true;
  }

  private getProductIdOr404(title: string): string | null {
    const productId = this.productTitles.get(title);
    if (!productId) {
      this.response = {
        status: 404,
        body: { message: "Product not found" },
      };
      return null;
    }
    return productId;
  }

  async createProduct(row: ProductRow) {
    if (!this.requireAuth()) return;

    try {
      const product = await createProductRecord(
        this.userId as string,
        this.toPayload(row),
      );
      this.trackProduct(product.title ?? product.id, product.id);
      this.response = { status: 201, body: { data: product } };
    } catch (error) {
      this.response = this.normalizeError(error);
    }
  }

  async updateProduct(title: string, row: ProductRow) {
    if (!this.requireAuth()) return;
    const productId = this.getProductIdOr404(title);
    if (!productId) return;

    try {
      const payload = { ...this.toPayload(row), id: productId };
      const product = await updateProductRecord(this.userId as string, payload);
      const newTitle = product.title ?? title;
      if (newTitle !== title) {
        this.productTitles.delete(title);
        this.productTitles.set(newTitle, product.id);
      }
      this.response = { status: 200, body: { data: product } };
    } catch (error) {
      this.response = this.normalizeError(error);
    }
  }

  async listMyProducts() {
    if (!this.userId) {
      this.response = { status: 200, body: { data: [] } };
      return;
    }
    const products = await listProductsForUser(this.userId);
    this.response = { status: 200, body: { data: products } };
  }

  async deleteProduct(title: string) {
    if (!this.requireAuth()) return;
    const productId = this.getProductIdOr404(title);
    if (!productId) return;

    try {
      await deleteProductRecord(this.userId as string, productId);
      this.trackedProductIds.delete(productId);
      this.productTitles.delete(title);
      this.response = {
        status: 200,
        body: { message: "Product deleted" },
      };
    } catch (error) {
      this.response = this.normalizeError(error);
    }
  }

  async cleanup() {
    if (this.trackedProductIds.size > 0) {
      await prisma.posts.deleteMany({
        where: { id: { in: Array.from(this.trackedProductIds) } },
      });
    }
    this.trackedProductIds.clear();
    if (this.userId) {
      await prisma.users
        .delete({ where: { id: this.userId } })
        .catch(() => null);
      this.userId = null;
    }
    if (this.otherUserIds.size > 0) {
      await prisma.users.deleteMany({
        where: { id: { in: Array.from(this.otherUserIds) } },
      });
      this.otherUserIds.clear();
    }
    this.productTitles.clear();
    this.response = null;
  }

  private trackProduct(title: string, id: string) {
    this.trackedProductIds.add(id);
    this.productTitles.set(title, id);
  }

  private toPayload(row: ProductRow) {
    const payload: Record<string, unknown> = {};
    for (const [key, rawValue] of Object.entries(row)) {
      if (rawValue === undefined) continue;
      payload[key] = rawValue;
    }
    return payload;
  }

  private normalizeError(error: unknown): ProductResponse {
    if (error instanceof ZodError) {
      return {
        status: 400,
        body: { message: error.issues.map((i) => i.message).join(", ") },
      };
    }
    if (error instanceof ProductNotFoundError) {
      return {
        status: 404,
        body: { message: error.message },
      };
    }
    throw error;
  }

  private async createUser(prefix: string) {
    const hashed = await bcrypt.hash("CrudPass123!", 10);
    const user = await prisma.users.create({
      data: {
        name: prefix,
        email: `${prefix}-${randomUUID()}@example.com`,
        password: hashed,
        country: "US",
      },
      select: { id: true },
    });
    return user.id;
  }
}
