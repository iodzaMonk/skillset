app/api/product/user/route.ts [4:9]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/login/route.ts [6:13]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    // get body
    const body = await req.json();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



