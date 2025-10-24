import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // Create order in database after successful payment
      const order = await prisma.commands.create({
        data: {
          client_id: paymentIntent.metadata.userId,
          prof_id: paymentIntent.metadata.prof_id,
          product_id: paymentIntent.metadata.productId,
          description: paymentIntent.metadata.description,
          date: new Date(),
        },
      });

      console.log("Order created after successful payment:", order.id);
    } catch (error) {
      console.error("Error creating order after payment:", error);
    }
  }

  return NextResponse.json({ received: true });
}
