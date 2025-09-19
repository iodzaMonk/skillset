import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    const body = await req.json();
    if (!body?.email || !body?.password) {
      return Response.json(
        { message: "Email and password are required" },
        {
          status: 400,
          headers: { "x-referer": referer || "" },
        },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { data: createdUser, error } = await supabase
      .from("users")
      .insert({
        email: body.email,
        password: hashedPassword,
        country: body.country,
        name: body.name,
        birthday: body.birthday,
      })
      .select()
      .single();

    if (error || !createdUser) {
      const statusCode = error?.code === "23505" ? 409 : 400;
      const message = error?.code === "23505"
        ? "Email already registered"
        : error?.message || "Registration failed";

      return Response.json(
        { message },
        {
          status: statusCode,
          headers: { "x-referer": referer || "" },
        },
      );
    }

    await createSession(createdUser.id);
    return Response.json(
      { id: createdUser.id, email: createdUser.email },
      {
        status: 200,
        headers: { "x-referer": referer || "" },
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: { "x-referer": referer || "" },
      },
    );
  }
}
