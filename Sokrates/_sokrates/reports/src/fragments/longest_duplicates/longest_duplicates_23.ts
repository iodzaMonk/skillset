app/api/product/[slug]/reviews/replies/route.ts [166:184]:
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
          },
        },
      },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/reviews/route.ts [58:76]:
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
              },
            },
          },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



