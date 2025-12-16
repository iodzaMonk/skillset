app/api/product/[slug]/reviews/route.ts [308:323]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      include: {
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



app/api/product/[slug]/reviews/route.ts [317:332]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          include: {
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



