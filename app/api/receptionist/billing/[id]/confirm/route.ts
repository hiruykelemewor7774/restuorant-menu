import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyReceptionistToken,
  RECEPTIONIST_COOKIE_NAME,
} from "@/lib/receptionist-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(RECEPTIONIST_COOKIE_NAME)?.value;
  const payload = token ? await verifyReceptionistToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { paymentMethod } = await req.json();

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: "paid",
        paymentMethod: paymentMethod || "cash",
        receptionistId: payload.receptionistId,
      },
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { success: false, message: "ማዘመን አልተቻለም" },
      { status: 500 },
    );
  }
}
