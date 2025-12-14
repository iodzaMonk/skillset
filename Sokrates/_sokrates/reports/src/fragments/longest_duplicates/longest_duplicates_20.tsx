app/api/orders/create-payment/route.tsx [9:17]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(request: NextRequest) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse(referer);
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/user/create-stripe-account/route.ts [8:15]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function POST(request: NextRequest) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse(referer);
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



