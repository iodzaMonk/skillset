app/api/product/user/route.ts [15:24]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/user/route.ts [49:58]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



