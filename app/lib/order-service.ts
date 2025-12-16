import { prisma } from "@/lib/prisma";

export async function fetchOrdersForUser(
  userId: string,
  type: "client" | "prof",
) {
  const where = type === "client" ? { client_id: userId } : { prof_id: userId };

  const orders = await prisma.commands.findMany({
    where,
    include: { posts: true },
  });

  return orders.map(({ posts, ...order }) => ({
    ...order,
    post: posts,
  }));
}

import { getCurrentUser } from "./user";
import { NextResponse } from "next/server";

export function createGetOrdersHandler(type: "client" | "prof") {
  return async function GET() {
    const user = await getCurrentUser();
    const id = user?.id;

    if (!id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    try {
      const ordersWithPost = await fetchOrdersForUser(id, type);
      return NextResponse.json({ data: ordersWithPost }, { status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { message: "Failed to fetch orders" },
        { status: 500 },
      );
    }
  };
}
