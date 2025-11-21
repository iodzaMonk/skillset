import { getCurrentUser } from "@/app/lib/user";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null }, { status: 200 });
  }

  return Response.json({ user }, { status: 200 });
}
