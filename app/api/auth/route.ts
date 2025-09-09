import { headers } from "next/headers";
import sql from "../../../db";
import { createSession } from "@/app/lib/session";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  try {
    const body = await req.json();

    const user =
      await sql`select id from users where email = ${body.email} and password = ${body.password};`;
    if (user.length === 0) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: { "x-referer": referer || "" },
      });
    } else {
      const log = await createSession(user[0].id);
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
