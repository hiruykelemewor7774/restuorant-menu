import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["pending", "sent_to_kitchen", "ready"] },
      OR: [
        { source: "waiter" },
        { paymentStatus: "paid" },
      ],
    },
    include: { items: true, waiter: { select: { username: true, fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ success: true, orders });
}