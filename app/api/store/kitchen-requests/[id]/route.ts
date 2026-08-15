import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json(); // "approved" | "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { success: false, message: "Invalid status" },
      { status: 400 },
    );
  }

  try {
    const request = await prisma.kitchenRequest.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 },
      );
    }

    if (status === "approved" && request.status === "pending") {
      // stock ን ቀንስ
      await prisma.$transaction(async (tx) => {
        for (const it of request.items) {
          await tx.storeItem.update({
            where: { id: it.itemId },
            data: { quantity: { decrement: it.quantity } },
          });
        }
        await tx.kitchenRequest.update({
          where: { id },
          data: { status: "approved" },
        });
      });
    } else {
      await prisma.kitchenRequest.update({
        where: { id },
        data: { status },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Kitchen request update error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update" },
      { status: 500 },
    );
  }
}
