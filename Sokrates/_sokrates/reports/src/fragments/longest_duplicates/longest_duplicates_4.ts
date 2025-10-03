app/api/user/login/route.ts [6:23]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    // get body
    const body = await req.json();

    // verify that both fields contain data
    if (!body?.email || !body?.password) {
      return Response.json(
        { message: "Email and password are required" },
        {
          status: 400,
          headers: { "x-referer": referer || "" },
        },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/register/route.ts [6:20]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    const body = await req.json();
    if (!body?.email || !body?.password) {
      return Response.json(
        { message: "Email and password are required" },
        {
          status: 400,
          headers: { "x-referer": referer || "" },
        },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



