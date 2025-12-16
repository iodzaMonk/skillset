app/api/product/[slug]/reviews/route.ts [17:23]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/route.ts [9:14]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  try {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



