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
