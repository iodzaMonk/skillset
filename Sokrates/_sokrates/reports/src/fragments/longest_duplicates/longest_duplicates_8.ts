app/api/cart/user/route.ts [12:25]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      include: { posts: true },
    });

    const ordersWithPost = orders.map(({ posts, ...order }) => ({
      ...order,
      post: posts,
    }));
    return NextResponse.json({ data: ordersWithPost }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/orders/user/route.ts [14:27]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      include: { posts: true },
    });

    const ordersWithPost = orders.map(({ posts, ...order }) => ({
      ...order,
      post: posts,
    }));
    return NextResponse.json({ data: ordersWithPost }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



