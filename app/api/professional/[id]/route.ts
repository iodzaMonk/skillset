import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createSignedDownloadUrl } from "@/app/lib/storage/s3";

const NO_IMAGE_PLACEHOLDER = "/no-image.svg";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const professional = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        posts: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            rating: true,
            ratingCount: true,
            date: true,
            image_location: true,
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!professional) {
      return NextResponse.json(
        { message: "Professional not found" },
        { status: 404 },
      );
    }

    const postsWithImages = await Promise.all(
      professional.posts.map(async (post) => {
        if (!post.image_location) {
          return {
            ...post,
            image_url: NO_IMAGE_PLACEHOLDER,
          };
        }

        try {
          const url = await createSignedDownloadUrl(post.image_location);
          return {
            ...post,
            image_url: url,
          };
        } catch (error) {
          console.error("Failed to sign product image url", error);
          return {
            ...post,
            image_url: NO_IMAGE_PLACEHOLDER,
          };
        }
      }),
    );

    const totalProducts = postsWithImages.length;
    const aggregatedRating = await prisma.posts.aggregate({
      where: { user_id: id, rating: { not: null } },
      _avg: { rating: true },
      _sum: { ratingCount: true },
    });

    return NextResponse.json({
      id: professional.id,
      name: professional.name,
      email: professional.email,
      country: professional.country,
      stats: {
        totalProducts,
        averageRating: aggregatedRating._avg.rating ?? null,
        totalRatings: aggregatedRating._sum.ratingCount ?? 0,
      },
      posts: postsWithImages,
    });
  } catch (error) {
    console.error("Error fetching professional profile:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Invalid professional ID" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
