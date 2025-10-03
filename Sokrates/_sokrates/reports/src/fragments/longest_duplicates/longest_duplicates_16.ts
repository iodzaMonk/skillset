app/api/product/user/route.ts [5:12]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();

    const product = await supabase
      .from("posts")
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/user/route.ts [36:43]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();

    const product = await supabase
      .from("posts")
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



