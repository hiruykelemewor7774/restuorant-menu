import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
    const payload = token ? await verifyWaiterToken(token) : null;

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Session አልተገኘም፣ እንደገና ግባ" },
        { status: 401 },
      );
    }

    const { tableNumber, items, notes } = await req.json();

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "የጠረጴዛ ቁጥር እና ቢያንስ አንድ እቃ ያስፈልጋል" },
        { status: 400 },
      );
    }

    const tableExists = await prisma.table.findFirst({
      where: {
        OR: [
          { tableNumber: tableNumber },
          { tableNumber: `Table-${tableNumber}` },
        ],
      },
    });

    if (!tableExists) {
      return NextResponse.json(
        { success: false, message: "ይህ ጠረጴዛ የለም (Table not found)" },
        { status: 404 },
      );
    }

    const order = await prisma.order.create({
      data: {
        tableNumber,
        waiterId: payload.waiterId,
        status: "pending",
        notes: notes || null,
        items: {
          create: items.map(
            (item: {
              name: string;
              price: string;
              quantity: number;
              category: string;
            }) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              category: item.category,
            }),
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ መፍጠር አልተቻለም" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;

  if (!payload) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const statusParam = req.nextUrl.searchParams.get("status");

const orders = await prisma.order.findMany({
  where: {
    waiterId: payload.waiterId,
    ...(statusParam
      ? { status: statusParam }
      : { status: { not: "delivered" } }), // status filter ከሌለ delivered ትዕዛዞችን አታምጣ
  },
  include: { items: true },
  orderBy: { createdAt: "desc" },
  take: 50,
});

  return NextResponse.json({ success: true, orders });
}