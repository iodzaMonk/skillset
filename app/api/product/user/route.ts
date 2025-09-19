import { getCurrentUser } from "@/app/lib/helper";
import { createClient } from "@/app/utils/supabase/client";
import { headers } from "next/headers";
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();

    const product = await supabase
      .from("posts")
      .insert({
        user_id: body.user_id,
        //userId: body.userId,
        title: body.title,
        description: body.description,
        price: body.price,
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .limit(1);

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
