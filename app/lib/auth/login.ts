import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.ts";

export type LoginBody = {
  email?: string;
  password?: string;
};

type LoginError = {
  status: 400 | 401;
  body: {
    message: string;
  };
};

type LoginSuccess = {
  status: 200;
  body: {
    userId: string;
  };
};

export type LoginResult = LoginError | LoginSuccess;

export async function loginUser(body: LoginBody = {}): Promise<LoginResult> {
  const { email, password } = body ?? {};

  const missingFields = [
    ["email", email],
    ["password", password],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return {
      status: 400,
      body: {
        message: `Missing required fields: ${missingFields.join(", ")}`,
      },
    };
  }

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return {
      status: 401,
      body: { message: "Invalid credentials" },
    };
  }

  const isPasswordValid =
    typeof password === "string" &&
    typeof existingUser.password === "string" &&
    (await bcrypt.compare(password, existingUser.password));

  if (!isPasswordValid) {
    return {
      status: 401,
      body: { message: "Invalid credentials" },
    };
  }

  return {
    status: 200,
    body: {
      userId: existingUser.id,
    },
  };
}
