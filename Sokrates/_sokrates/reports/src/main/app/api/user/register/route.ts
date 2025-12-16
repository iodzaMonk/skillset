import { headers } from "next/headers";
import bcrypt from "bcryptjs";

import { createSession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";
import type { UserBody } from "@/types/UserBody";
import { handleApiError } from "@/app/lib/api-response";

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
    return handleApiError(error, referer);
  }
}
