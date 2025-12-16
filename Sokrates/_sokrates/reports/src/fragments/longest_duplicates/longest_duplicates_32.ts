app/api/product/[slug]/reviews/replies/route.ts [44:50]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/reviews/route.ts [177:183]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



