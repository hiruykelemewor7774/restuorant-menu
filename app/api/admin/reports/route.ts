import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function getDateRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (period) {
    case "day":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const period = req.nextUrl.searchParams.get("period") || "day";
  const { start, end } = getDateRange(period);

  // ---- ትዕዛዝ ማጠቃለያ ----
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end } },
    include: {
      items: true,
      waiter: { select: { id: true, username: true, fullName: true } },
    },
  });

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

  // ---- Waiter Performance ----
  const waiterMap: Record<
    string,
    { name: string; orders: number; revenue: number }
  > = {};
  for (const order of orders) {
    if (!order.waiterId || !order.waiter) continue;
    if (!waiterMap[order.waiterId]) {
      waiterMap[order.waiterId] = {
        name: order.waiter.fullName || order.waiter.username,
        orders: 0,
        revenue: 0,
      };
    }
    waiterMap[order.waiterId].orders += 1;
    if (order.paymentStatus === "paid") {
      waiterMap[order.waiterId].revenue += order.totalAmount;
    }
  }
  const waiterPerformance = Object.values(waiterMap).sort(
    (a, b) => b.revenue - a.revenue,
  );

  // ---- Kitchen Performance ----
  const kitchenOrdersInRange = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end }, kitchenId: { not: null } },
    include: {
      kitchen: { select: { id: true, username: true, fullName: true } },
    },
  });

  const kitchenMap: Record<string, { name: string; readyCount: number }> = {};
  for (const order of kitchenOrdersInRange) {
    if (!order.kitchenId || !order.kitchen) continue;
    if (!kitchenMap[order.kitchenId]) {
      kitchenMap[order.kitchenId] = {
        name: order.kitchen.fullName || order.kitchen.username,
        readyCount: 0,
      };
    }
    kitchenMap[order.kitchenId].readyCount += 1;
  }
  const kitchenPerformance = Object.values(kitchenMap).sort(
    (a, b) => b.readyCount - a.readyCount,
  );

  // ---- Top-Selling Items ----
  const itemMap: Record<
    string,
    { name: string; category: string; quantity: number; revenue: number }
  > = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = `${item.name}-${item.category}`;
      if (!itemMap[key]) {
        itemMap[key] = {
          name: item.name,
          category: item.category,
          quantity: 0,
          revenue: 0,
        };
      }
      itemMap[key].quantity += item.quantity;
      const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      itemMap[key].revenue += price * item.quantity;
    }
  }
  const topItems = Object.values(itemMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return NextResponse.json({
    success: true,
    period,
    range: { start: start.toISOString(), end: end.toISOString() },
    summary: {
      totalOrders,
      totalRevenue,
      deliveredCount,
      pendingCount,
      cancelledCount,
    },
    waiterPerformance,
    kitchenPerformance,
    topItems,
  });
}