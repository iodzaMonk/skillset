app/api/product/[slug]/reviews/route.ts [38:44]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/reviews/route.ts [106:112]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const user = await getCurrentUser();

  if (!user) {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



