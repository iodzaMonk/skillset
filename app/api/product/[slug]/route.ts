import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  console.log("Fetching product with ID:", params.slug);
  try {
    const product = await prisma.posts.findUnique({
      where: { id: params.slug },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
