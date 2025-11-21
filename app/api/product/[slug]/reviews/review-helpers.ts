import { prisma } from "@/lib/prisma";

export const MAX_REPLY_DEPTH = 3;

export const reviewThreadInclude = {
  users: {
    select: {
      id: true,
      name: true,
    },
  },
  replies: {
    orderBy: { date: "asc" },
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: {
        orderBy: { date: "asc" },
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
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
