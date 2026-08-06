import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalMenuItems,
    totalWaiters,
    activeWaiters,
    pendingOrders,
    inKitchenOrders,
    readyOrders,
    todayOrders,
    todayDelivered,
    allMenuItems,
  ] = await Promise.all([
    prisma.menuItem.count(),
    prisma.waiter.count(),
    prisma.waiter.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "sent_to_kitchen" } }),
    prisma.order.count({ where: { status: "ready" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({
      where: { status: "delivered", createdAt: { gte: startOfToday } },
    }),
    prisma.menuItem.findMany({ select: { type: true, category: true } }),
    prisma.order.groupBy({
      by: ["waiterId"],
      where: { paymentStatus: "paid", waiterId: { not: null } },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
  ]);

  // በ type እና category የተከፋፈለ ብዛት ማስላት
  const breakdown: Record<string, Record<string, number>> = {};
  for (const item of allMenuItems) {
    const type = item.type;
    const category = item.category || "General";
    if (!breakdown[type]) breakdown[type] = {};
    breakdown[type][category] = (breakdown[type][category] || 0) + 1;
  }

  const waiterSalesRaw = await prisma.order.groupBy({
    by: ["waiterId"],
    where: { paymentStatus: "paid", waiterId: { not: null } },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  const waiterIds = waiterSalesRaw.map((w) => w.waiterId).filter(Boolean) as string[];
  const waiterDetails = await prisma.waiter.findMany({
    where: { id: { in: waiterIds } },
    select: { id: true, username: true, fullName: true },
  });

  const waiterSales = waiterSalesRaw.map((w) => {
    const detail = waiterDetails.find((d) => d.id === w.waiterId);
    return {
      waiterId: w.waiterId,
      name: detail?.fullName || detail?.username || "Unknown",
      totalSales: w._sum.totalAmount || 0,
      orderCount: w._count.id,
    };
  });

  return NextResponse.json({
    success: true,
    stats: {
      totalMenuItems,
      totalWaiters,
      activeWaiters,
      pendingOrders,
      inKitchenOrders,
      readyOrders,
      todayOrders,
      todayDelivered,
    },
    menuBreakdown: breakdown,
    waiterSales,
  });
}