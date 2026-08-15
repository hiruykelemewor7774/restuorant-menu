import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ አልተገኘም" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    order: {
      id: order.id,
      tableNumber: order.tableNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items,
      createdAt: order.createdAt,
    },
  });
}
