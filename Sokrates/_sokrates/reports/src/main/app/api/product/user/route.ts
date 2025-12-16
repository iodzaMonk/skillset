import { headers } from "next/headers";
import { getCurrentUser } from "@/app/lib/user";
import {
  createProductRecord,
  updateProductRecord,
  listProductsForUser,
  ProductNotFoundError,
} from "@/app/lib/productCrud";
import { ZodError } from "zod";
import { signProductsWithImages } from "@/app/lib/product-helpers";

// Helper to handle authentication and common error wrapping
async function withAuthenticatedUser(
  callback: (user: { id: string }, referer: string) => Promise<Response>,
) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      // Return 200 with empty data for GET, 401 for others?
      // The original GET implementation returned 200 with empty data if not authenticated.
      // The POST/PUT implementations returned 401.
      // We need to handle this distinction.
      // Let's keep it simple: the callback handles the user check result if needed,
      // OR we just strictly enforce auth here and handle the GET exception separately?
      // GET is the outlier. Let's make this strictly for authenticated actions (POST/PUT).
      return Response.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
    }
    return await callback(user, referer);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { message: error.issues.map((i) => i.message).join(", ") },
        { status: 400, headers: { "x-referer": referer } },
      );
    }
    if (error instanceof ProductNotFoundError) {
      return Response.json(
        { message: "Product not found" },
        { status: 404, headers: { "x-referer": referer } },
      );
    }
    console.error("API Error", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function POST(req: Request) {
  return withAuthenticatedUser(async (user, referer) => {
    const product = await createProductRecord(user.id, await req.json());

    return Response.json(
      { data: product },
      { status: 201, headers: { "x-referer": referer } },
    );
  });
}

export async function PUT(req: Request) {
  return withAuthenticatedUser(async (user, referer) => {
    const updatedProduct = await updateProductRecord(user.id, await req.json());
    return Response.json(
      { data: updatedProduct },
      { status: 200, headers: { "x-referer": referer } },
    );
  });
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
    const productsWithImages = await signProductsWithImages(products);

    return Response.json(
      { data: productsWithImages },
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
