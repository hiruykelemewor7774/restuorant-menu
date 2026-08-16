import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/store-admin-guard";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 403 },
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const item = await prisma.storeItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.quantity !== undefined && { quantity: body.quantity }),
        ...(body.minThreshold !== undefined && {
          minThreshold: body.minThreshold,
        }),
        ...(body.costPerUnit !== undefined && {
          costPerUnit: body.costPerUnit,
        }),
        ...(body.expiryDate !== undefined && {
          expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
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
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 403 },
    );
  }

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
