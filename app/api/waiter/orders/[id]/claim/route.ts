import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ አልተገኘም" },
      { status: 404 },
    );
  }

  // ---- ጉዳይ 1: ትዕዛዙ ካንተ ራስህ ጋር ቀድሞውኑ የተመደበ ከሆነ (waiter ራሱ የፈጠረው/ቀደም የያዘው) ----
  // ክፍያ አትጠይቅ - በቀጥታ ወደ ኩሽና ላክ
  if (order.waiterId === payload.waiterId) {
    const updated = await prisma.order.update({
      where: { id },
      data: { status: "sent_to_kitchen" },
    });
    return NextResponse.json({ success: true, order: updated });
  }

  // ---- ጉዳይ 2: በሌላ waiter የተያዘ ከሆነ ----
  if (order.waiterId) {
    return NextResponse.json(
      { success: false, message: "ይህ ትዕዛዝ ቀድሞውኑ በሌላ waiter ተይዟል" },
      { status: 409 },
    );
  }

  // ---- ጉዳይ 3: ገና ያልተያዘ (unclaimed) - ደንበኛ ፈጠረው ከሆነ ብቻ ክፍያ ያስፈልገዋል ----
  if (order.source === "customer" && order.paymentStatus !== "paid") {
    return NextResponse.json(
      { success: false, message: "ይህ ትዕዛዝ ገና አልተከፈለም" },
      { status: 400 },
    );
  }

  // ---- ውሰድ + ወደ ኩሽና ላክ ----
  const updated = await prisma.order.update({
    where: { id },
    data: {
      waiterId: payload.waiterId,
      status: "sent_to_kitchen",
    },
  });

  return NextResponse.json({ success: true, order: updated });
}
