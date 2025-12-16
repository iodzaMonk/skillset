import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "./session/tokens";

export { encrypt, decrypt } from "./session/tokens";
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt: expiresAt.toISOString() });
  await setSessionCookie(session, expiresAt);
  return session;
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);
  if (!payload || !session) {
    return null;
  }
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await setSessionCookie(session, expiresAt);
  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

async function setSessionCookie(session: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}
