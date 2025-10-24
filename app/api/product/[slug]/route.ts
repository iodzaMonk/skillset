import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createSignedDownloadUrl } from "@/app/lib/storage/s3";

const NO_IMAGE_PLACEHOLDER = "/no-image.svg";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    const product = await prisma.posts.findUnique({
      where: { id: slug },
      include: {
        reviews: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (!product.image_location) {
      return NextResponse.json({
        ...product,
        image_url: NO_IMAGE_PLACEHOLDER,
      });
    }

    try {
      const imageUrl = await createSignedDownloadUrl(product.image_location);
      return NextResponse.json({
        ...product,
        image_url: imageUrl,
      });
    } catch (error) {
      console.error("Failed to sign image url", error);
      return NextResponse.json({
        ...product,
        image_url: NO_IMAGE_PLACEHOLDER,
      });
    }
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
