import { headers } from "next/headers";
import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { PostBody } from "@/types/PostBody";

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  try {
    const products = await prisma.posts.findMany();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "x-referer": referer || "" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: { "x-referer": referer || "" },
    });
  }
}
export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as PostBody;
    const { id } = body ?? {};
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    await prisma.posts.delete({
      where: { id: id },
    });
    return Response.json({ message: "Product deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
