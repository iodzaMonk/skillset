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
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: { "x-referer": referer || "" },
    });
  }
}

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  const user = await getCurrentUser();
  try {
    const product = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user?.id); // Fetch products for the current user

    return new Response(JSON.stringify(product), {
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
