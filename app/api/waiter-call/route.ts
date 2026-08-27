import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { tableNumber } = await req.json();

    if (!tableNumber) {
      return NextResponse.json({ success: false, message: "የጠረጴዛ ቁጥር ያስፈልጋል" }, { status: 400 });
    }

    const call = await prisma.waiterCall.create({
      data: { tableNumber, status: "pending" },
    });

    return NextResponse.json({ success: true, call });
  } catch (error) {
    console.error("Waiter call error:", error);
    return NextResponse.json({ success: false, message: "መጥራት አልተቻለም" }, { status: 500 });
  }
}