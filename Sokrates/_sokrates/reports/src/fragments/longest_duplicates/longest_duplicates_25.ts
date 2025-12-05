app/api/product/[slug]/route.ts [16:24]:
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



features/support/productService.ts [185:193]:
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



