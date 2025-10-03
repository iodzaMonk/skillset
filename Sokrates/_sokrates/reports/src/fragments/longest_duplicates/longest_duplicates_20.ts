app/api/product/user/route.ts [4:9]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();
  try {
    const body = await req.json();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/register/route.ts [6:12]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(req: Request) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const supabase = await createClient();

  try {
    const body = await req.json();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



