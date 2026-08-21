import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyKitchenToken, KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(KITCHEN_COOKIE_NAME)?.value;
  const payload = token ? await verifyKitchenToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const items = await prisma.storeItem.findMany({
    select: { id: true, name: true, unit: true, quantity: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, items });
}
