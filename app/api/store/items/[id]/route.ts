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

  try {
    const body = await req.json();
    const item = await prisma.storeItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.quantity !== undefined && { quantity: body.quantity }),
        ...(body.minThreshold !== undefined && {
          minThreshold: body.minThreshold,
        }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("Store item update error:", err);
    return NextResponse.json(
      { success: false, message: "ማስተካከል አልተቻለም" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.storeItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Store item delete error:", err);
    return NextResponse.json(
      { success: false, message: "ማጥፋት አልተቻለም" },
      { status: 500 },
    );
  }
}
