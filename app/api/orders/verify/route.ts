import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyChapaPayment } from "@/lib/chapa";

export async function GET(req: NextRequest) {
  const txRef = req.nextUrl.searchParams.get("tx_ref");

  if (!txRef) {
    return NextResponse.json({ success: false, message: "tx_ref ያስፈልጋል" }, { status: 400 });
  }

  try {
    const result = await verifyChapaPayment(txRef);

    if (result.status === "success" && result.data.status === "success") {
      await prisma.order.update({
        where: { paymentRef: txRef },
        data: { paymentStatus: "paid" },
      });
      return NextResponse.json({ success: true, message: "ክፍያ ተረጋግጧል" });
    } else {
      await prisma.order.update({
        where: { paymentRef: txRef },
        data: { paymentStatus: "failed" },
      });
      return NextResponse.json({ success: false, message: "ክፍያ አልተሳካም" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, message: "ማረጋገጫ ስህተት" }, { status: 500 });
  }
}