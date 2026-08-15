import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, suppliers });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { name, phone, address, notes } = await req.json();
  if (!name) {
    return NextResponse.json(
      { success: false, message: "Name required" },
      { status: 400 },
    );
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      phone: phone || null,
      address: address || null,
      notes: notes || null,
    },
  });

  return NextResponse.json({ success: true, supplier });
}
