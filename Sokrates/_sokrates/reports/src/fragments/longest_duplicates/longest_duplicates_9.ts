app/api/cart/route.ts [21:51]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    });

    return NextResponse.json(
      { id: order.id, message: "Order processed successfully" },
      { status: 201, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Failed to process order" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const orders = await prisma.commands.findMany();
    return NextResponse.json(
      { data: orders },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500, headers: { "x-referer": referer } },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/orders/route.ts [34:63]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    });
    return NextResponse.json(
      { id: order.id, message: "Order processed successfully" },
      { status: 201, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Failed to process order" },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}

export async function GET() {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const orders = await prisma.commands.findMany();
    return NextResponse.json(
      { data: orders },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500, headers: { "x-referer": referer } },
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



