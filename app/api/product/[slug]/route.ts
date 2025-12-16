import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { signProductWithImage } from "../../../lib/product-helpers";

const NO_IMAGE_PLACEHOLDER = "/no-image.svg";

import { fetchProductDetails } from "../../../lib/product-queries";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
    const product = await fetchProductDetails(slug);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const productWithImage = await signProductWithImage(product);

    return NextResponse.json(
      productWithImage || { ...product, image_url: NO_IMAGE_PLACEHOLDER },
    );
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
