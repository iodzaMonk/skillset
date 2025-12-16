app/api/product/[slug]/reviews/replies/route.ts [25:54]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      where: { id: parentId },
      select: { id: true, product_id: true, parent_id: true },
    });

    if (!parent || parent.product_id !== slug) {
      return NextResponse.json(
        { message: "Parent comment not found" },
        { status: 404 },
      );
    }

    let depth = 1;
    let ancestorId = parent.parent_id;

    while (ancestorId) {
      const ancestor = await prisma.reviews.findUnique({
        where: { id: ancestorId },
        select: { parent_id: true },
      });

      depth += 1;

      if (depth >= MAX_REPLY_DEPTH) {
        return NextResponse.json(
          { message: "Maximum reply depth reached" },
          { status: 400 },
        );
      }

      ancestorId = ancestor?.parent_id ?? null;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/[slug]/reviews/route.ts [135:164]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        where: { id: parentId },
        select: { id: true, product_id: true, parent_id: true },
      });

      if (!parent || parent.product_id !== slug) {
        return NextResponse.json(
          { message: "Parent comment not found" },
          { status: 404 },
        );
      }

      let depth = 1;
      let ancestorId = parent.parent_id;

      while (ancestorId) {
        const ancestor = await prisma.reviews.findUnique({
          where: { id: ancestorId },
          select: { parent_id: true },
        });

        depth += 1;

        if (depth >= MAX_REPLY_DEPTH) {
          return NextResponse.json(
            { message: "Maximum reply depth reached" },
            { status: 400 },
          );
        }

        ancestorId = ancestor?.parent_id ?? null;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



