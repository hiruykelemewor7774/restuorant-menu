import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { waiterId: payload.waiterId, status: "delivered" },
  });

  const todayOrders = orders.filter((o) => o.createdAt >= startOfToday);

  return NextResponse.json({
    success: true,
    totalDelivered: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    todayDelivered: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  });
}
