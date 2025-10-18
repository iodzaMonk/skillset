import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { Order } from "@/types/Order";
import { Status } from "@/types/Status";
import { Prisma } from "@prisma/client";
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

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { ids = [], status } = body ?? {};

    const updatedProduct = await prisma.commands.updateMany({
      where: { client_id: user.id, id: { in: ids } },
      data: { status } as any,
    });

    return Response.json({ data: updatedProduct }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Orer not found" }, { status: 404 });
    }

    console.error("Update product error", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
