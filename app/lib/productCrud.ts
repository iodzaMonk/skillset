import { z } from "zod";
import { prisma } from "../../lib/prisma.ts";

export class ProductNotFoundError extends Error {
  constructor(message = "Product not found") {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

const baseProductSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  date: z.coerce.date().optional(),
  image_location: z
    .union([z.string().trim(), z.null()])
    .optional()
    .transform((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
      return value ?? null;
    }),
});

export const createProductInputSchema = baseProductSchema;

const updateProductInputSchema = baseProductSchema.extend({
  id: z.string().min(1, "Product id is required"),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

async function ensureProductOwnership(userId: string, productId: string) {
  const product = await prisma.posts.findFirst({
    where: { id: productId, user_id: userId },
  });
  if (!product) {
    throw new ProductNotFoundError();
  }
}

export async function createProductRecord(
  userId: string,
  payload: unknown,
) {
  const data = createProductInputSchema.parse(payload);
  return prisma.posts.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      date: data.date,
      image_location: data.image_location,
      user_id: userId,
    },
  });
}

export async function updateProductRecord(
  userId: string,
  payload: unknown,
) {
  const data = updateProductInputSchema.parse(payload);
  await ensureProductOwnership(userId, data.id);
  return prisma.posts.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      date: data.date,
      image_location: data.image_location ?? undefined,
    },
  });
}

export async function listProductsForUser(userId: string) {
  return prisma.posts.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function deleteProductRecord(userId: string, productId: string) {
  await ensureProductOwnership(userId, productId);
  await prisma.posts.delete({
    where: { id: productId },
  });
}
