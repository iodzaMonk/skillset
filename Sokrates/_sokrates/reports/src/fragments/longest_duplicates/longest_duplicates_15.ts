app/lib/product-queries.ts [7:15]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    include: {
      users: {
        select: {
          id: true,
          name: true,
          country: true,
          email: true,
        },
      },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [182:190]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            include: {
              users: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  email: true,
                },
              },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



