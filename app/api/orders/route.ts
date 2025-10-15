import { headers } from "next/headers";
import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { PostBody } from "@/types/PostBody";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const body = await request.json();
    const { description, prof_id, productId, userId } = body;

    const order = await prisma.commands.create({
      data: {
        user_id: userId,
        product_id: productId,
        prof_id: prof_id,
        description: description,
        date: new Date(),
      },
    });

    return NextResponse.json(
      { id: order.id, message: "Order processed successfully" },
      { status: 201, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Failed to process order" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const orders = await prisma.commands.findMany();
    return NextResponse.json(
      { data: orders },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}
