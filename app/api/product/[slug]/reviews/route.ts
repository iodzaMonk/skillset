import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const reviews = await prisma.reviews.findMany({
      where: { product_id: slug },
      orderBy: { date: "desc" },
      include: {
        users: {
          select: {
            id: true,
            name: true,
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

    if (!text) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    const review = await prisma.reviews.create({
      data: {
        text,
        product_id: slug,
        user_id: user.id,
        date: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

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
        { message: "You can only edit your own comment" },
        { status: 403 },
      );
    }

    const review = await prisma.reviews.update({
      where: { id },
      data: {
        text,
        date: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

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

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete review", error);
    return NextResponse.json(
      { message: "Unable to delete comment" },
      { status: 500 },
    );
  }
}
