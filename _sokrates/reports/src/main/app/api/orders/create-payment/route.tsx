"use server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/user";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const referer = headersList.get("referer") ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "x-referer": referer } },
      );
    }

    const { amount, orderData } = await request.json();

    // Validate required order data
    if (!orderData?.prof_id || !orderData?.product_id) {
      return NextResponse.json(
        {
          message:
            "Missing required order data: prof_id and product_id are required",
        },
        { status: 400, headers: { "x-referer": referer } },
      );
    }

    // Ensure the product exists
    const product = await prisma.posts.findUnique({
      where: { id: orderData.product_id },
      select: { id: true, user_id: true, title: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404, headers: { "x-referer": referer } },
      );
    }

    // Verify the professional owns the product
    if (product.user_id !== orderData.prof_id) {
      return NextResponse.json(
        { message: "Professional does not own this product" },
        { status: 400, headers: { "x-referer": referer } },
      );
    }

    // Fetch professional's name from the users table
    let professionalName = "Professional";
    try {
      const professional = await prisma.users.findUnique({
        where: { id: orderData.prof_id },
        select: { name: true },
      });
      professionalName = professional?.name || "Professional";
    } catch (error) {
      console.error("Failed to fetch professional name:", error);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      statement_descriptor_suffix: `To ${professionalName.substring(0, 22)}`, // Stripe has character limits
      description: `Payment to ${professionalName} for ${product.title}`,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        description: orderData?.description || "",
        prof_id: orderData.prof_id,
        product_id: orderData.product_id, // Use product_id consistently
        client_id: user.id, // Use client_id consistently
        professionalName: professionalName,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      professionalName: professionalName,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}
