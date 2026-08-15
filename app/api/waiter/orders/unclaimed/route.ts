import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: {
      source: "customer",
      paymentStatus: "paid",
      waiterId: null,
      status: "pending",
    },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ success: true, orders });
}
