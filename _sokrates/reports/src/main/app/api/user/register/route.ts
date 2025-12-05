import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createSession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";
import type { UserBody } from "@/types/UserBody";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const body = (await req.json()) as UserBody;
    const { email, password, country, name, birthday } = body ?? {};

    const missingFields = [
      ["email", email],
      ["password", password],
      ["country", country],
      ["name", name],
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

    const birthdayDate = birthday ? new Date(birthday) : null;
    if (birthday && Number.isNaN(birthdayDate?.getTime())) {
      return Response.json(
        { message: "Invalid birthday format" },
        {
          status: 400,
          headers: { "x-referer": referer },
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = await prisma.users.create({
      data: {
        email: email as string,
        password: hashedPassword,
        country: country as string,
        name: name as string,
        birthday: birthdayDate,
      },
      select: {
        id: true,
        email: true,
      },
    });

    await createSession(user.id.toString());

    return Response.json(
      { id: user.id.toString(), email: user.email },
      {
        status: 200,
        headers: { "x-referer": referer },
      },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { message: "Email already registered" },
        {
          status: 409,
          headers: { "x-referer": referer },
        },
      );
    }

    console.error("Registration error", error);

    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: { "x-referer": referer },
      },
    );
  }
}
