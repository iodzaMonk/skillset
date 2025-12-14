import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const MAX_REPLY_DEPTH = 3;
const MAX_RATING = 5;

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export const parseRating = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "number") return NaN;
  if (!Number.isFinite(value)) return NaN;
  return Math.round(value);
};

export const ratingIsValid = (rating: number | null) =>
  rating !== null && rating >= 1 && rating <= MAX_RATING;

export async function recomputeProductRating(productId: string) {
  const aggregate = await prisma.reviews.aggregate({
    where: {
      product_id: productId,
      parent_id: null,
      rating: { not: null },
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.posts.update({
    where: { id: productId },
    data: {
      rating: aggregate._count.rating ? aggregate._avg.rating : null,
      ratingCount: aggregate._count.rating ?? 0,
    },
  });
}

export const userSelect = {
  select: {
    id: true,
    name: true,
  },
} as const;

export const reviewThreadInclude = {
  users: userSelect,
  replies: {
    orderBy: { date: "asc" },
    include: {
      users: userSelect,
      replies: {
        orderBy: { date: "asc" },
        include: {
          users: userSelect,
        },
      },
    },
  },
} as const;

type ParentReview =
  | {
      id: string;
      product_id: string;
      parent_id: string | null;
    }
  | { message: string; status: number };

/**
 * Verifies that the provided parent review belongs to the product and does
 * not exceed the configured reply depth. Returns either the parent record
 * or a lightweight error descriptor that can be turned into a response.
 */
export async function validateParentForProduct(
  productId: string,
  parentId: string,
): Promise<ParentReview> {
  const parent = await prisma.reviews.findUnique({
    where: { id: parentId },
    select: { id: true, product_id: true, parent_id: true },
  });

  if (!parent || parent.product_id !== productId) {
    return { message: "Parent comment not found", status: 404 };
  }

  let depth = 1;
  let ancestorId = parent.parent_id;

  while (ancestorId) {
    const ancestor = await prisma.reviews.findUnique({
      where: { id: ancestorId },
      select: { parent_id: true },
    });

    depth += 1;

    if (depth >= MAX_REPLY_DEPTH) {
      return { message: "Maximum reply depth reached", status: 400 };
    }

    ancestorId = ancestor?.parent_id ?? null;
  }

  return parent;
}
