import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  const id = user?.id;

  try {
    const orders = await prisma.commands.findMany({
      where: { client_id: id },
      include: { posts: true },
    });

    const ordersWithPost = orders.map(({ posts, ...order }) => ({
      ...order,
      post: posts,
    }));

    return NextResponse.json({ data: ordersWithPost }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
