import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";

type CreateOrderOptions = {
  sendEmail?: boolean;
};

async function getRefererHeader() {
  const headersList = await headers();
  return headersList.get("referer") ?? "";
}

export async function listOrdersResponse() {
  const referer = await getRefererHeader();

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
  }
}

export async function createOrderResponse(
  request: Request,
  { sendEmail = false }: CreateOrderOptions = {},
) {
  const referer = await getRefererHeader();

  try {
    const body = await request.json();
    const { description, prof_id, productId, userId } = body;

    const order = await prisma.commands.create({
      data: {
        client_id: userId,
        prof_id: prof_id,
        product_id: productId,
        description: description,
        date: new Date(),
      },
    });

    if (sendEmail) {
      try {
        const resend = new Resend(process.env.EMAIL_API ?? "");
        const professional = await prisma.users.findUnique({
          where: { id: prof_id },
        });
        const clientName = await prisma.users.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        const mailContent = `Hello, you have a new order with the following details:\n\nDescription: ${description}\nProduct ID: ${productId}\nFrom client: ${clientName?.name || "Unknown"}`;
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: professional?.email || "bramomoh06@gmail.com",
          subject: "New Order Received",
          html: `<p>${mailContent}</p>`,
        });
      } catch (emailError) {
        console.error("Failed to send order notification email", emailError);
      }
    }

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
