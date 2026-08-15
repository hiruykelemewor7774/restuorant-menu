import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const items = await prisma.storeItem.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, items });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { name, unit, quantity, minThreshold, notes } = await req.json();

    if (!name || !unit) {
      return NextResponse.json(
        { success: false, message: "ስም እና መለኪያ ያስፈልጋል" },
        { status: 400 },
      );
    }

    const item = await prisma.storeItem.create({
      data: {
        name,
        unit,
        quantity: quantity ?? 0,
        minThreshold: minThreshold ?? 0,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("Store item create error:", err);
    return NextResponse.json(
      { success: false, message: "መጨመር አልተቻለም" },
      { status: 500 },
    );
  }
}
