import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/app/lib/user";
import { createSignedDownloadUrl } from "@/app/lib/storage/s3";
import { prisma } from "@/lib/prisma";
import { PostBody } from "@/types/PostBody";
import { z } from "zod";

const createProductSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  date: z.coerce.date().optional(),
  image_location: z.string().trim().optional().nullable(),
});

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

    const body = createProductSchema.parse(await req.json());
    const { title, description, price, image_location } = body ?? {};

    const product = await prisma.posts.create({
      data: {
        title: title,
        description: description,
        price: price,
        user_id: user.id,
        image_location: image_location ?? null,
      },
    });

    return Response.json(
      { data: product },
      { status: 201, headers: { "x-referer": referer } },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
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

    const body = (await req.json()) as PostBody;
    const { id, title, description, price, date, image_location } = body ?? {};

    const updatedProduct = await prisma.posts.update({
      where: { id: id },
      data: {
        title: title,
        description: description,
        price: price,
        date: date,
        image_location: image_location ?? undefined,
      },
    });

    return Response.json(
      { data: updatedProduct },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        { message: "Product not found" },
        { status: 404, headers: { "x-referer": referer } },
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

    const products = await prisma.posts.findMany({
      where: { user_id: user.id },
      orderBy: { date: "desc" },
    });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
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
