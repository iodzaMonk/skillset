import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UserBody } from "@/types/UserBody";
import { getCurrentUser } from "@/app/lib/user";

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
          headers: { "x-referer": referer },
        },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { message: "Email already in use" },
        {
          status: 409,
          headers: { "x-referer": referer },
        },
      );
    }

    console.error("Update user error", error);

    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: { "x-referer": referer },
      },
    );
  }
}
