import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyKitchenToken, KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";

async function requireKitchen(req: NextRequest) {
  const token = req.cookies.get(KITCHEN_COOKIE_NAME)?.value;
  return token ? await verifyKitchenToken(token) : null;
}

export async function GET(req: NextRequest) {
  const kitchen = await requireKitchen(req);
  if (!kitchen) return NextResponse.json({ success: false }, { status: 401 });

  const requests = await prisma.kitchenRequest.findMany({
    include: { items: { include: { item: { select: { name: true, unit: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ success: true, requests });
}

export async function POST(req: NextRequest) {
  const kitchen = await requireKitchen(req);
  if (!kitchen) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { items, notes } = await req.json();
    // items: [{ itemId, quantity }]

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "ቢያንስ አንድ እቃ ምረጥ" }, { status: 400 });
    }

    const request = await prisma.kitchenRequest.create({
      data: {
        requestedBy: kitchen.username,
        status: "pending",
        notes: notes || null,
        items: {
          create: items.map((i: { itemId: string; quantity: number }) => ({
            itemId: i.itemId,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("Kitchen request error:", error);
    return NextResponse.json({ success: false, message: "ጥያቄ መላክ አልተቻለም" }, { status: 500 });
  }
}