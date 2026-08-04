import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    const { waiterId, status } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(waiterId ? { waiterId } : {}),
        ...(status ? { status } : {}),
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ ማዘመን አልተቻለም" },
      { status: 500 }
    );
  }
}