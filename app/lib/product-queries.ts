import { prisma } from "../../lib/prisma";
import { reviewThreadInclude } from "../api/product/[slug]/reviews/review-shared";

export async function fetchProductDetails(slug: string) {
  const product = await prisma.posts.findUnique({
    where: { id: slug },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          country: true,
          email: true,
        },
      },
      reviews: {
        include: reviewThreadInclude,
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  return product;
}
