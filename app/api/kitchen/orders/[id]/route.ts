import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyKitchenToken, KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(KITCHEN_COOKIE_NAME)?.value;
  const payload = token ? await verifyKitchenToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: "ready",
        kitchenId: payload.kitchenId,
      },
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Kitchen ready error:", error);
    return NextResponse.json(
      { success: false, message: "ማዘመን አልተቻለም" },
      { status: 500 },
    );
  }
}
