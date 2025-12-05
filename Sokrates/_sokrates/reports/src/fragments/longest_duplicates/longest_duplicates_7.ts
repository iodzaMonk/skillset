app/api/product/[slug]/reviews/review-helpers.ts [6:20]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  users: {
    select: {
      id: true,
      name: true,
    },
  },
  replies: {
    orderBy: { date: "asc" },
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/reviews/review-helpers.ts [15:29]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      users: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: {
        orderBy: { date: "asc" },
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



