import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const purchases = await prisma.purchase.findMany({
    include: { item: true, supplier: true },
    orderBy: { purchasedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, purchases });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { itemId, supplierId, quantity, totalCost, notes } = await req.json();

    if (!itemId || !quantity) {
      return NextResponse.json(
        { success: false, message: "Item and quantity required" },
        { status: 400 },
      );
    }

    const purchase = await prisma.$transaction(async (tx) => {
      const p = await tx.purchase.create({
        data: {
          itemId,
          supplierId: supplierId || null,
          quantity,
          totalCost: totalCost ?? 0,
          notes: notes || null,
        },
      });

      await tx.storeItem.update({
        where: { id: itemId },
        data: { quantity: { increment: quantity } },
      });

      return p;
    });

    return NextResponse.json({ success: true, purchase });
  } catch (err) {
    console.error("Purchase create error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save purchase" },
      { status: 500 },
    );
  }
}
