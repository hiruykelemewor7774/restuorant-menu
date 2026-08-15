import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const rangeParam = req.nextUrl.searchParams.get("range") || "30"; // days
  const days = parseInt(rangeParam) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const purchases = await prisma.purchase.findMany({
    where: { purchasedAt: { gte: since } },
    include: { item: true },
  });

  const wasteLogs = await prisma.wasteLog.findMany({
    where: { createdAt: { gte: since } },
    include: { item: true },
  });

  const totalPurchaseCost = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalPurchaseQty = purchases.reduce((s, p) => s + p.quantity, 0);
  const totalWasteQty = wasteLogs.reduce((s, w) => s + w.quantity, 0);

  // Estimated waste cost using item cost per unit
  const totalWasteCost = wasteLogs.reduce(
    (s, w) => s + w.quantity * (w.item.costPerUnit || 0),
    0,
  );

  // Top purchased items
  const purchaseByItem: Record<
    string,
    { name: string; qty: number; cost: number }
  > = {};
  for (const p of purchases) {
    if (!purchaseByItem[p.itemId]) {
      purchaseByItem[p.itemId] = { name: p.item.name, qty: 0, cost: 0 };
    }
    purchaseByItem[p.itemId].qty += p.quantity;
    purchaseByItem[p.itemId].cost += p.totalCost;
  }
  const topPurchased = Object.values(purchaseByItem)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  // Top wasted items
  const wasteByItem: Record<string, { name: string; qty: number }> = {};
  for (const w of wasteLogs) {
    if (!wasteByItem[w.itemId]) {
      wasteByItem[w.itemId] = { name: w.item.name, qty: 0 };
    }
    wasteByItem[w.itemId].qty += w.quantity;
  }
  const topWasted = Object.values(wasteByItem)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const requestsCount = await prisma.kitchenRequest.count({
    where: { createdAt: { gte: since } },
  });

  return NextResponse.json({
    success: true,
    days,
    totalPurchaseCost,
    totalPurchaseQty,
    totalWasteQty,
    totalWasteCost,
    topPurchased,
    topWasted,
    requestsCount,
  });
}
