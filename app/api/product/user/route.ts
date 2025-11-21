import { headers } from "next/headers";
import { getCurrentUser } from "@/app/lib/user";
import { createSignedDownloadUrl } from "@/app/lib/storage/s3";
import { prisma } from "@/lib/prisma";
import { PostBody } from "@/types/PostBody";
import {
  createProductRecord,
  updateProductRecord,
  listProductsForUser,
  ProductNotFoundError,
} from "@/app/lib/productCrud";
import { ZodError } from "zod";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
    }

    const product = await createProductRecord(user.id, await req.json());

    return Response.json(
      { data: product },
      { status: 201, headers: { "x-referer": referer } },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "Internal server error" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function PUT(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
    }

    const updatedProduct = await updateProductRecord(user.id, await req.json());

    return Response.json(
      { data: updatedProduct },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return Response.json(
        { message: "Product not found" },
        { status: 404, headers: { "x-referer": referer } },
      );
    }
    if (error instanceof ZodError) {
      return Response.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400, headers: { "x-referer": referer } },
      );
    }

    console.error("Update product error", error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { data: [] },
        { status: 200, headers: { "x-referer": referer } },
      );
    }

    const products = await listProductsForUser(user.id);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        if (!product.image_location) {
          return product;
        }

        try {
          const imageUrl = await createSignedDownloadUrl(
            product.image_location,
          );
          return {
            ...product,
            image_url: imageUrl,
          };
        } catch (error) {
          console.error("Failed to sign image url", error);
          return product;
        }
      }),
    );

    return Response.json(
      {
        data: productsWithImages,
      },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Get products error", error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}
