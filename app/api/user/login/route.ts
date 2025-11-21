import { headers } from "next/headers";
import { createSession } from "@/app/lib/session";
import { loginUser, type LoginBody } from "@/app/lib/auth/login";

export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    // get body
    const body = (await req.json()) as LoginBody;
    const result = await loginUser(body);

    if (result.status !== 200) {
      return Response.json(result.body, {
        status: result.status,
        headers: { "x-referer": referer },
      });
    }

    const session = await createSession(result.body.userId);
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
