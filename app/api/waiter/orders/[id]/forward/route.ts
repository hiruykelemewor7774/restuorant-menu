import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ አልተገኘም" },
      { status: 404 },
    );
  }

  if (order.paymentStatus !== "paid") {
    return NextResponse.json(
      { success: false, message: "ክፍያ ገና አልተከፈለም" },
      { status: 400 },
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "sent_to_kitchen", waiterId: payload.waiterId },
  });

  return NextResponse.json({ success: true, order: updated });
}
