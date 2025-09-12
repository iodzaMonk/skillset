import { headers } from "next/headers";
import sql from "../../../db";
import { createSession } from "@/app/lib/session";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  try {
    const body = await req.json();

    const user =
      await sql`insert into users (name, email,password,country,birthday) values (${body.name}, ${body.email}, ${body.password}, ${body.country}, ${body.birthday});
    `;
    await createSession(user[0].id);
    return new Response(JSON.stringify(user), {
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
