import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createSignedDownloadUrl } from "@/app/lib/storage/s3";



export async function GET(
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
    async function getProductWithImage() {

      if (product) {
        if (!product.image_location) {
          return product;
        }

        try {
          const imageUrl = await createSignedDownloadUrl(product.image_location);
          return {
            ...product,
            image_url: imageUrl,
          };
        } catch (error) {
          console.error("Failed to sign image url", error);
          return product;
        }

      }
    }

    const productWithImage = await getProductWithImage();

    return NextResponse.json(productWithImage);
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
