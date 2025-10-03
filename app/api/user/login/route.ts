import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
};
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    // get body
    const body = (await req.json()) as LoginBody;
    const { email, password } = body ?? {};

    const missingFields = [
      ["email", email],
      ["password", password],
    ]
      .filter(([, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return Response.json(
        {
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        {
          status: 400,
          headers: { "x-referer": referer },
        },
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 401, headers: { "x-referer": referer } },
      );
    }

    // verify if password corresponds to the hashed one
    const isPasswordValid =
      typeof password === "string" &&
      typeof existingUser.password === "string" &&
      (await bcrypt.compare(password, existingUser.password));

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
    const session = await createSession(existingUser.id.toString());
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
