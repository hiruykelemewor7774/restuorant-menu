import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    const call = await prisma.waiterCall.update({
      where: { id },
      data: { status: "acknowledged" },
    });
    return NextResponse.json({ success: true, call });
  } catch (error) {
    console.error("Acknowledge call error:", error);
    return NextResponse.json({ success: false, message: "ማዘመን አልተቻለም" }, { status: 500 });
  }
}