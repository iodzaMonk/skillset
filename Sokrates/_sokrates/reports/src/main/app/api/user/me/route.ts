import { getCurrentUser } from "@/app/lib/helper";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null }, { status: 200 });
  }

  return Response.json(
    {
      user: {
        id: user.id,
        name: user.name ?? null,
        email: user.email,
        country: user.country ?? null,
        birthday: user.birthday ?? null,
      },
    },
    { status: 200 },
  );
}
