app/lib/product-queries.ts [5:16]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const product = await prisma.posts.findUnique({
    where: { id: slug },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          country: true,
          email: true,
        },
      },
      reviews: {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [170:181]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      const product = await prisma.posts.findUnique({
        where: { id: slug },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              country: true,
              email: true,
            },
          },
          reviews: {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



