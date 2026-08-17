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

  const statusParam = req.nextUrl.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { category: "Room" } },
      ...(statusParam
        ? { status: statusParam }
        : { status: { not: "delivered" } }),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ success: true, orders });
}
