import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { amount, orderData } = await request.json();

    // Fetch professional's name from the users table
    let professionalName = "Professional";
    if (orderData?.prof_id) {
      try {
        const professional = await prisma.users.findUnique({
          where: { id: orderData.prof_id },
          select: { name: true },
        });
        professionalName = professional?.name || "Professional";
      } catch (error) {
        console.error("Failed to fetch professional name:", error);
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      statement_descriptor_suffix: `To ${professionalName}`,
      description: `Payment to ${professionalName}`,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        description: orderData?.description || "",
        prof_id: orderData?.prof_id || "",
        productId: orderData?.productId || "",
        userId: orderData?.userId || "",
        professionalName: professionalName,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      professionalName: professionalName, // Optionally return it to the client
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
}
