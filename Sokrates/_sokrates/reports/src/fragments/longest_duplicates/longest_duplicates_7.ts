features/support/browseService.ts [48:59]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      const category = parseCategory(row.category);
      const price = parsePrice(row.price);
      const description = row.description?.trim() || `${title} description`;

      const product = await prisma.posts.create({
        data: {
          user_id: ownerId,
          title,
          description,
          price,
          category,
        },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [67:78]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      const category = parseCategory(row.category);
      const price = parsePrice(row.price);
      const description = row.description?.trim() || `${title} description`;

      const product = await prisma.posts.create({
        data: {
          user_id: ownerId,
          title,
          description,
          price,
          category,
        },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



