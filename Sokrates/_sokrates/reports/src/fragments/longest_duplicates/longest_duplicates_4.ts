app/api/product/[slug]/route.ts [13:30]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  try {
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
          include: {
            users: {
              select: {
                id: true,
                name: true,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [172:189]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    try {
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
            include: {
          users: {
            select: {
              id: true,
              name: true,
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



