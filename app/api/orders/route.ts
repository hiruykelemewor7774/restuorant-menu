import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { tableNumber, items } = await req.json();

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "የጠረጴዛ ቁጥር እና ቢያንስ አንድ እቃ ያስፈልጋል" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        tableNumber,
        status: "pending",
        source: "customer",
        items: {
          create: items.map(
            (item: { name: string; price: string; quantity: number; category: string }) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              category: item.category,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Customer order creation error:", error);
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ መፍጠር አልተቻለም" },
      { status: 500 }
    );
  }
}