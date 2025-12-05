app/api/product/[slug]/reviews/review-helpers.ts [14:21]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/route.ts [26:33]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          include: {
            users: {
              select: {
                id: true,
                name: true,
              },
            },
            replies: {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



