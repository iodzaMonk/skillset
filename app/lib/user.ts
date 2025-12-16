import { cookies } from "next/headers";
import { decrypt } from "./session";
import { prisma } from "../../lib/prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload?.userId) return null;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id:
          typeof payload.userId === "string"
            ? payload.userId
            : String(payload.userId),
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      country: user.country ?? null,
      birthday: user.birthday ? user.birthday.toISOString() : null,
      vendor_id: user.vendor_id ?? null,
    };
  } catch (error) {
    console.error("getCurrentUser error", error);
    return null;
  }
}
