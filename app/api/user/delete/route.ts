import { getCurrentUser } from "@/app/lib/helper";
import { deleteSession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    await prisma.users.delete({
      where: { id: user.id },
    });

    await deleteSession();
    return Response.json({ message: "Account deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
