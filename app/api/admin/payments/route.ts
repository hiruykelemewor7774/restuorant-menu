import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const payments = await prisma.order.findMany({
    where: { source: "customer" },
    select: {
      id: true,
      tableNumber: true,
      paymentMethod: true,
      paymentStatus: true,
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, payments });
}
