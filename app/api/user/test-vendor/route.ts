import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/user";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Only allow in development/test environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 },
    );
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vendor_id } = await req.json();
    const fakeVendorId = vendor_id || `acct_test_${Date.now()}`;

    // Update user with fake vendor_id using Prisma
    await prisma.users.update({
      where: { id: user.id },
      data: { vendor_id: fakeVendorId },
    });

    return NextResponse.json({
      success: true,
      vendor_id: fakeVendorId,
    });
  } catch (error) {
    console.error("Error setting test vendor:", error);
    return NextResponse.json(
      { error: "Failed to set test vendor" },
      { status: 500 },
    );
  }
}
