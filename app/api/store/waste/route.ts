import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const wasteLogs = await prisma.wasteLog.findMany({
    include: { item: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, wasteLogs });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { itemId, quantity, reason } = await req.json();

    if (!itemId || !quantity) {
      return NextResponse.json(
        { success: false, message: "Item and quantity required" },
        { status: 400 },
      );
    }

    const log = await prisma.$transaction(async (tx) => {
      const w = await tx.wasteLog.create({
        data: { itemId, quantity, reason: reason || null },
      });

      await tx.storeItem.update({
        where: { id: itemId },
        data: { quantity: { decrement: quantity } },
      });

      return w;
    });

    return NextResponse.json({ success: true, log });
  } catch (err) {
    console.error("Waste log create error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to log waste" },
      { status: 500 },
    );
  }
}
