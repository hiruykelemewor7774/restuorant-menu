import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const waiters = await prisma.waiter.findMany({
    where: { isActive: true },
    select: { id: true, username: true, fullName: true },
  });

  return NextResponse.json({ success: true, waiters });
}