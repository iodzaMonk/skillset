import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UserBody } from "@/types/UserBody";

export async function PATCH(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const body = (await req.json()) as UserBody;
    const { id, email, password, country, name, birthday } = body ?? {};

    // Example: Get authenticated user ID from headers/session (adjust as needed)
    const authenticatedUserId = headersList.get("x-user-id");
    if (!authenticatedUserId || authenticatedUserId !== id) {
      return Response.json(
        { message: "Unauthorized: You can only update your own record." },
    const updateData: any = {
      email: email,
      country: country,
      name: name,
      birthday: birthday,
    };
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: updateData,
    });
    }

    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: {
        email: email,
        password: hashedPassword,
        country: country,
        name: name,
        birthday: birthday,
      },
    });

    return Response.json(
      {
        email: updatedUser.email,
        name: updatedUser.name,
        country: updatedUser.country,
        birthday: updatedUser.birthday
          ? updatedUser.birthday.toISOString()
          : null,
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
