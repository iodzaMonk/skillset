import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "../definition";

const fallbackSecret =
  process.env.NODE_ENV === "production" ? undefined : "session-secret-fallback";
const secretKey = process.env.SESSION_SECRET ?? fallbackSecret;
const encodedKey = secretKey ? new TextEncoder().encode(secretKey) : null;

function ensureKey() {
  if (!encodedKey) {
    throw new Error("SESSION_SECRET is not defined");
  }
  return encodedKey;
}

export async function encrypt(payload: SessionPayload) {
  const key = ensureKey();
  return new SignJWT(payload ?? {})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  const key = ensureKey();
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error);
  }
}
