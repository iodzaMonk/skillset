import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/user";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const body = await request.json();
    const { email, refreshUrl, returnUrl } = body;

    const account = await stripe.accounts.create({
      type: "express",
      country: "CA",
      email: email,
      business_profile: {
        url: "https://skillset-orcin.vercel.app",
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    await prisma.users.update({
      where: { id: user.id },
      data: { vendor_id: account.id },
    });

    return NextResponse.json(
      { url: accountLink.url, accountId: account.id },
      { status: 200, headers: { "x-referer": referer } },
    );
  } catch (error) {
    console.error("Stripe connect error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Stripe connection",
      },
      { status: 500, headers: { "x-referer": referer } },
    );
  }
}
