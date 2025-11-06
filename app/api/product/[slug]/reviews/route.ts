import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

const MAX_REPLY_DEPTH = 3;
const MAX_RATING = 5;

const parseRating = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "number") return NaN;
  if (!Number.isFinite(value)) return NaN;
  return Math.round(value);
};

const ratingIsValid = (rating: number | null) =>
  rating !== null && rating >= 1 && rating <= MAX_RATING;

async function recomputeProductRating(productId: string) {
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

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const reviews = await prisma.reviews.findMany({
      where: { product_id: slug, parent_id: null },
      orderBy: { date: "desc" },
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
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return NextResponse.json(
      { message: "Unable to load comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "You need to be signed in to comment" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const rawRating = body?.rating;
    const parentId =
      typeof body?.parentId === "string" ? body.parentId.trim() : "";

    if (!text) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    const parsedRating = parseRating(rawRating);

    if (!parentId && !ratingIsValid(parsedRating)) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    let parent: {
      id: string;
      product_id: string;
      parent_id: string | null;
    } | null = null;
    if (parentId) {
      parent = await prisma.reviews.findUnique({
        where: { id: parentId },
        select: { id: true, product_id: true, parent_id: true },
      });

      if (!parent || parent.product_id !== slug) {
        return NextResponse.json(
          { message: "Parent comment not found" },
          { status: 404 },
        );
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
          return NextResponse.json(
            { message: "Maximum reply depth reached" },
            { status: 400 },
          );
        }

        ancestorId = ancestor?.parent_id ?? null;
      }

      if (parsedRating !== null) {
        return NextResponse.json(
          { message: "Replies cannot include a rating" },
          { status: 400 },
        );
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
      },
    });

    await recomputeProductRating(slug);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review", error);
    return NextResponse.json(
      { message: "Unable to submit comment" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "You need to be signed in to edit a comment" },
      { status: 401 },
    );
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
      return NextResponse.json(
        { message: "Comment id is required" },
        { status: 400 },
      );
    }

    if (!text) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    const existing = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true, product_id: true, parent_id: true },
    });

    if (!existing || existing.product_id !== slug) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (hasRatingUpdate) {
      if (existing.parent_id) {
        return NextResponse.json(
          { message: "Replies cannot include a rating" },
          { status: 400 },
        );
      }

      if (parsedRating !== null && !ratingIsValid(parsedRating)) {
        return NextResponse.json(
          { message: "Rating must be between 1 and 5" },
          { status: 400 },
        );
      }
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { message: "You can only edit your own comment" },
        { status: 403 },
      );
    }

    const review = await prisma.reviews.update({
      where: { id },
      data: {
        text,
        date: new Date(),
        ...(hasRatingUpdate ? { rating: parsedRating } : {}),
      },
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
      },
    });

    await recomputeProductRating(slug);

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Failed to update review", error);
    return NextResponse.json(
      { message: "Unable to update comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "You need to be signed in to delete a comment" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json(
        { message: "Comment id is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true, product_id: true },
    });

    if (!existing || existing.product_id !== slug) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { message: "You can only delete your own comment" },
        { status: 403 },
      );
    }

    await prisma.reviews.delete({
      where: { id },
    });

    await recomputeProductRating(slug);

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete review", error);
    return NextResponse.json(
      { message: "Unable to delete comment" },
      { status: 500 },
    );
  }
}
