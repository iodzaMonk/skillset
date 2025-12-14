import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

import {
  reviewThreadInclude,
  validateParentForProduct,
  errorResponse,
  parseRating,
  ratingIsValid,
  recomputeProductRating,
} from "./review-helpers";

// ... existing code ...

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const reviews = await prisma.reviews.findMany({
      where: { product_id: slug, parent_id: null },
      orderBy: { date: "desc" },
      include: reviewThreadInclude,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return errorResponse("Unable to load comments", 500);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to comment", 401);
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const rawRating = body?.rating;
    const parentId =
      typeof body?.parentId === "string" ? body.parentId.trim() : "";

    if (!text) {
      return errorResponse("Comment cannot be empty", 400);
    }

    const parsedRating = parseRating(rawRating);

    if (!parentId && !ratingIsValid(parsedRating)) {
      return errorResponse("Rating must be between 1 and 5", 400);
    }

    let parent: {
      id: string;
      product_id: string;
      parent_id: string | null;
    } | null = null;
    if (parentId) {
      const parentValidation = await validateParentForProduct(slug, parentId);

      if ("status" in parentValidation) {
        return errorResponse(parentValidation.message, parentValidation.status);
      }

      parent = parentValidation;

      if (parsedRating !== null) {
        return errorResponse("Replies cannot include a rating", 400);
      }
    }

    const review = await prisma.reviews.create({
      data: {
        text,
        rating: parent ? null : parsedRating,
        product_id: slug,
        user_id: user.id,
        date: new Date(),
        parent_id: parent?.id ?? null,
      },
      include: reviewThreadInclude,
    });

    await recomputeProductRating(slug);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review", error);
    return errorResponse("Unable to submit comment", 500);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to edit a comment", 401);
  }

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const hasRatingUpdate = Object.prototype.hasOwnProperty.call(
      body,
      "rating",
    );
    const parsedRating = hasRatingUpdate ? parseRating(body.rating) : null;

    if (!id) {
      return errorResponse("Comment id is required", 400);
    }

    if (!text) {
      return errorResponse("Comment cannot be empty", 400);
    }

    const existing = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true, product_id: true, parent_id: true },
    });

    if (!existing || existing.product_id !== slug) {
      return errorResponse("Comment not found", 404);
    }

    if (hasRatingUpdate) {
      if (existing.parent_id) {
        return errorResponse("Replies cannot include a rating", 400);
      }

      if (parsedRating !== null && !ratingIsValid(parsedRating)) {
        return errorResponse("Rating must be between 1 and 5", 400);
      }
    }

    if (existing.user_id !== user.id) {
      return errorResponse("You can only edit your own comment", 403);
    }

    const review = await prisma.reviews.update({
      where: { id },
      data: {
        text,
        date: new Date(),
        ...(hasRatingUpdate ? { rating: parsedRating } : {}),
      },
      include: reviewThreadInclude,
    });

    await recomputeProductRating(slug);

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Failed to update review", error);
    return errorResponse("Unable to update comment", 500);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to delete a comment", 401);
  }

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id) {
      return errorResponse("Comment id is required", 400);
    }

    const existing = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true, product_id: true },
    });

    if (!existing || existing.product_id !== slug) {
      return errorResponse("Comment not found", 404);
    }

    if (existing.user_id !== user.id) {
      return errorResponse("You can only delete your own comment", 403);
    }

    await prisma.reviews.delete({
      where: { id },
    });

    await recomputeProductRating(slug);

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete review", error);
    return errorResponse("Unable to delete comment", 500);
  }
}
