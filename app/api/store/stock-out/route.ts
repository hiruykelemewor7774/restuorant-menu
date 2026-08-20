import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

async function requireStore(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  return token ? await verifyStoreToken(token) : null;
}

export async function POST(req: NextRequest) {
  const store = await requireStore(req);
  if (!store) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { itemId, quantity, reason } = await req.json();

    if (!itemId || !quantity) {
      return NextResponse.json({ success: false, message: "እቃ እና ብዛት ያስፈልጋሉ" }, { status: 400 });
    }

    const qty = parseFloat(quantity);

    const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
    if (!item || item.quantity < qty) {
      return NextResponse.json({ success: false, message: "በቂ ክምችት የለም" }, { status: 400 });
    }

    const [log] = await prisma.$transaction([
      prisma.wasteLog.create({
        data: { itemId, quantity: qty, reason: reason || "Issued to Kitchen" },
      }),
      prisma.storeItem.update({
        where: { id: itemId },
        data: { quantity: { decrement: qty } },
      }),
    ]);

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Stock out error:", error);
    return NextResponse.json({ success: false, message: "ማስመዝገብ አልተቻለም" }, { status: 500 });
  }
}