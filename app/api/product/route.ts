import { headers } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const product = await supabase.from("posts").select("*");

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
