import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  return payload;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { type, category, name, price, image, features } = await req.json();

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        type,
        category: category || "",
        name,
        price,
        image,
        features: features ? JSON.stringify(features) : null,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Update menu item error:", error);
    return NextResponse.json(
      { success: false, message: "እቃ ማስተካከል አልተቻለም" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return NextResponse.json(
      { success: false, message: "እቃ ማጥፋት አልተቻለም" },
      { status: 500 }
    );
  }
}