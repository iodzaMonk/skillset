import { headers } from "next/headers";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import type { UserBody } from "@/types/UserBody";
import { getCurrentUser } from "@/app/lib/user";
import { handleApiError } from "@/app/lib/api-response";

export async function PATCH(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const body = (await req.json()) as UserBody;
    const { id, email, password, country, name, birthday } = body ?? {};

    const authenticatedUser = await getCurrentUser();
    if (authenticatedUser?.id != id) {
      return Response.json(
        { message: "Unauthorized: You can only update your own record." },
        { status: 400 },
      );
    }

    const updateData: UserBody = {
      email: email,
      country: country,
      name: name,
      birthday: birthday,
    };

    const hashedPassword = await bcrypt.hash(password as string, 10);
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: updateData,
    });

    return Response.json(
      {
        data: updatedUser,
      },
      {
        status: 200,
        headers: { "x-referer": referer },
      },
    );
  } catch (error) {
    return handleApiError(error, referer);
  }
}
