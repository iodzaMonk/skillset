import { headers } from "next/headers";
import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";
import { PostBody } from "@/types/PostBody";
import { Category } from "@/types/Category";
import { signProductsWithImages } from "@/app/lib/product-helpers";

export async function GET(request: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const products = await prisma.posts.findMany({
      where: category ? { category: category as Category } : undefined,
    });

    const productsWithImages = await signProductsWithImages(products);

    return new Response(JSON.stringify(productsWithImages), {
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
