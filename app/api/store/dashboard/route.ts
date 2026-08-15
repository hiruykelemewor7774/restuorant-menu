import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const items = await prisma.storeItem.findMany();
  const totalItems = items.length;
  const lowStock = items.filter((i) => i.quantity <= i.minThreshold).length;

  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 3);

  const expiringSoon = items.filter(
    (i) => i.expiryDate && i.expiryDate > now && i.expiryDate <= soon,
  ).length;
  const expired = items.filter(
    (i) => i.expiryDate && i.expiryDate <= now,
  ).length;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayPurchases = await prisma.purchase.findMany({
    where: { purchasedAt: { gte: todayStart } },
  });
  const todayPurchasesTotal = todayPurchases.reduce(
    (sum, p) => sum + p.totalCost,
    0,
  );

  const pendingRequests = await prisma.kitchenRequest.count({
    where: { status: "pending" },
  });

  const todayWaste = await prisma.wasteLog.count({
    where: { createdAt: { gte: todayStart } },
  });

  // Recent activity: last 8 purchases + waste logs combined
  const recentPurchases = await prisma.purchase.findMany({
    take: 5,
    orderBy: { purchasedAt: "desc" },
    include: { item: true },
  });
  const recentWaste = await prisma.wasteLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { item: true },
  });

  const activity = [
    ...recentPurchases.map((p) => ({
      name: p.item.name,
      type: "PURCHASE",
      amount: `+${p.quantity} ${p.item.unit}`,
      date: p.purchasedAt,
    })),
    ...recentWaste.map((w) => ({
      name: w.item.name,
      type: "WASTE",
      amount: `-${w.quantity} ${w.item.unit}`,
      date: w.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return NextResponse.json({
    success: true,
    stats: {
      totalItems,
      lowStock,
      expiringSoon,
      expired,
      todayPurchasesTotal,
      issuedToKitchen: 0,
      returned: 0,
      todayWaste,
      pendingRequests,
    },
    activity,
  });
}
