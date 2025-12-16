import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

import {
  reviewThreadInclude,
  validateParentForProduct,
  errorResponse,
} from "../review-helpers";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const parentId = url.searchParams.get("parentId");

  if (!parentId) {
    return errorResponse("parentId query parameter is required", 400);
  }

  try {
    const parent = await validateParentForProduct(slug, parentId);
    if ("status" in parent) {
      return errorResponse(parent.message, parent.status);
    }

    const replies = await prisma.reviews.findMany({
      where: { product_id: slug, parent_id: parentId },
      orderBy: { date: "asc" },
      include: reviewThreadInclude,
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Failed to fetch replies", error);
    return errorResponse("Unable to load replies", 500);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("You need to be signed in to reply", 401);
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const parentId =
      typeof body?.parentId === "string" ? body.parentId.trim() : "";

    if (!text) {
      return errorResponse("Reply cannot be empty", 400);
    }

    if (!parentId) {
      return errorResponse("parentId is required", 400);
    }

    const parent = await validateParentForProduct(slug, parentId);
    if ("status" in parent) {
      return errorResponse(parent.message, parent.status);
    }

    const reply = await prisma.reviews.create({
      data: {
        text,
        product_id: slug,
        user_id: user.id,
        parent_id: parent.id,
        date: new Date(),
      },
      include: reviewThreadInclude,
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Failed to create reply", error);
    return errorResponse("Unable to submit reply", 500);
  }
}
