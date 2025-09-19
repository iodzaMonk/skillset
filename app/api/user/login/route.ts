import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    // get body
    const body = await req.json();

    // verify that both fields contain data
    if (!body?.email || !body?.password) {
      return Response.json(
        { message: "Email and password are required" },
        {
          status: 400,
          headers: { "x-referer": referer || "" },
        },
      );
    }
    // verify if the email is already taken
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", body.email)
      .single();

    // throw error
    if (error || !existingUser) {
      return Response.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: { "x-referer": referer || "" },
        },
      );
    }
    // verify if password corresponds to the hashed one
    const isPasswordValid = await bcrypt.compare(
      body.password,
      existingUser.password,
    );
    // throw error
    if (!isPasswordValid) {
      return Response.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: { "x-referer": referer || "" },
        },
      );
    }
    // if no errors then create session
    const session = await createSession(existingUser.id);
    return Response.json(
      { token: session },
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
