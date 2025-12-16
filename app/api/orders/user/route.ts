import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Status } from "@/types/Status";
import { createGetOrdersHandler } from "@/app/lib/order-service";

export const GET = createGetOrdersHandler("prof");

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { ids = [], status } = (await req.json()) as {
      ids?: string[];
      status?: Status;
    };

    if (!status) {
      return Response.json({ message: "Status is required" }, { status: 400 });
    }

    const updatedOrder = await prisma.commands.updateMany({
      where: { client_id: user.id, id: { in: ids } },
      data: { status },
    });

    return Response.json({ data: updatedOrder }, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
