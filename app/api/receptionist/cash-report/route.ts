import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyReceptionistToken,
  RECEPTIONIST_COOKIE_NAME,
} from "@/lib/receptionist-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(RECEPTIONIST_COOKIE_NAME)?.value;
  const payload = token ? await verifyReceptionistToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayPaid = await prisma.order.findMany({
    where: { paymentStatus: "paid", updatedAt: { gte: startOfToday } },
  });

  const byMethod: Record<string, { count: number; total: number }> = {};
  for (const o of todayPaid) {
    const method = o.paymentMethod || "unknown";
    if (!byMethod[method]) byMethod[method] = { count: 0, total: 0 };
    byMethod[method].count += 1;
    byMethod[method].total += o.totalAmount;
  }

  const grandTotal = todayPaid.reduce((sum, o) => sum + o.totalAmount, 0);

  return NextResponse.json({
    success: true,
    byMethod,
    grandTotal,
    totalTransactions: todayPaid.length,
  });
}
