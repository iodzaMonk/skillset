import { headers } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "@/app/lib/helper";

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
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("posts").delete().eq("id", body.id);

    if (error) {
      return Response.json({ message: error.message }, { status: 400 });
    }
    return Response.json({ message: "Product deleted" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
