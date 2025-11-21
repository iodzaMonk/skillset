import { NextResponse } from "next/server";

import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

const MAX_REPLY_DEPTH = 3;

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
    const parent = await prisma.reviews.findUnique({
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

    const replies = await prisma.reviews.findMany({
      where: { product_id: slug, parent_id: parentId },
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

    const parent = await prisma.reviews.findUnique({
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

    const reply = await prisma.reviews.create({
      data: {
        text,
        product_id: slug,
        user_id: user.id,
        parent_id: parent.id,
        date: new Date(),
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
          },
        },
      },
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
