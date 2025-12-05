import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

import {
  reviewThreadInclude,
  validateParentForProduct,
} from "../review-helpers";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const parentId = url.searchParams.get("parentId");

  if (!parentId) {
    return NextResponse.json(
      { message: "parentId query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const parent = await validateParentForProduct(slug, parentId);
    if ("status" in parent) {
      return NextResponse.json(
        { message: parent.message },
        { status: parent.status },
      );
    }

    const replies = await prisma.reviews.findMany({
      where: { product_id: slug, parent_id: parentId },
      orderBy: { date: "asc" },
      include: reviewThreadInclude,
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Failed to fetch replies", error);
    return NextResponse.json(
      { message: "Unable to load replies" },
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
      { message: "You need to be signed in to reply" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const parentId =
      typeof body?.parentId === "string" ? body.parentId.trim() : "";

    if (!text) {
      return NextResponse.json(
        { message: "Reply cannot be empty" },
        { status: 400 },
      );
    }

    if (!parentId) {
      return NextResponse.json(
        { message: "parentId is required" },
        { status: 400 },
      );
    }

    const parent = await validateParentForProduct(slug, parentId);
    if ("status" in parent) {
      return NextResponse.json(
        { message: parent.message },
        { status: parent.status },
      );
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
    return NextResponse.json(
      { message: "Unable to submit reply" },
      { status: 500 },
    );
  }
}
