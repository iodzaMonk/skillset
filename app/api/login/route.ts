import { headers } from "next/headers";
import sql from "../../../db";
import { createSession } from "@/app/lib/session";
import { createClient } from "@/app/utils/supabase/server";
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();

    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", body.email)
      .eq("password", body.password)
      .limit(1);
    if (user.data?.length === 0) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: { "x-referer": referer || "" },
      });
    } else {
      const log = await createSession(user.data?.[0].id); //Remove .data!
      return new Response(JSON.stringify(log), {
        status: 200,
        headers: { "x-referer": referer || "" },
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Error", {
      status: 500,
      headers: { "x-referer": referer || "" },
    });
  }
}
