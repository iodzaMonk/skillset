import { headers } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();

    const product = await supabase
      .from("products")
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        date: Date.now().toString(),
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
