import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeChapaPayment } from "@/lib/chapa";


interface OrderItemInput {
  name: string;
  price: string | number;
  quantity: number;
  category: string;
}
export async function POST(req: NextRequest) {
  try {
    const { tableNumber, items, customerEmail, customerPhone } = await req.json();

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "የጠረጴዛ ቁጥር እና ቢያንስ አንድ እቃ ያስፈልጋል" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum: number, item: OrderItemInput) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);

    const txRef = `kerami-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const order = await prisma.order.create({
      data: {
        tableNumber,
        status: "pending",
        source: "customer",
        paymentStatus: "unpaid",
        paymentRef: txRef,
        totalAmount,
        items: {
          create: items.map(
            (item: OrderItemInput) => ({
              name: item.name,
              price: String(item.price),
              quantity: item.quantity,
              category: item.category,
            })
          ),
        },
      },
      include: { items: true },
    });

    const chapaRes = await initializeChapaPayment({
      amount: totalAmount,
      email: customerEmail || "guest@kerami.com",
      firstName: "Table",
      lastName: tableNumber,
      txRef,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/verify?tx_ref=${txRef}`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-status?tx_ref=${txRef}`,
    });

     if (chapaRes.status !== "success") {
      console.error("Chapa initialization failed:", JSON.stringify(chapaRes, null, 2));
         return NextResponse.json(
          { success: false, message: chapaRes.message || "የክፍያ ማስጀመር አልተቻለም" },
          { status: 500 }
     );
}

    return NextResponse.json({
      success: true,
      order,
      checkoutUrl: chapaRes.data.checkout_url,
    });
  } catch (error) {
    console.error("Customer order creation error:", error);
    return NextResponse.json(
      { success: false, message: "ትዕዛዝ መፍጠር አልተቻለም" },
      { status: 500 }
    );
  }
}