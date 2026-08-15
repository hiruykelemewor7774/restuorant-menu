import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const requests = await prisma.kitchenRequest.findMany({
    include: { items: { include: { item: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, requests });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { requestedBy, notes, items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one item required" },
        { status: 400 },
      );
    }

    const request = await prisma.kitchenRequest.create({
      data: {
        requestedBy: requestedBy || null,
        notes: notes || null,
        items: {
          create: items.map((it: { itemId: string; quantity: number }) => ({
            itemId: it.itemId,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: { include: { item: true } } },
    });

    return NextResponse.json({ success: true, request });
  } catch (err) {
    console.error("Kitchen request create error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create request" },
      { status: 500 },
    );
  }
}
