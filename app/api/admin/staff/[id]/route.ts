import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    const { fullName, isActive, newPassword } = await req.json();

    const data: Record<string, unknown> = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (isActive !== undefined) data.isActive = isActive;
    if (newPassword) data.password = await bcrypt.hash(newPassword, 10);

    const waiter = await prisma.waiter.update({
      where: { id },
      data,
      select: { id: true, username: true, fullName: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ success: true, waiter });
  } catch (error) {
    console.error("Update waiter error:", error);
    return NextResponse.json(
      { success: false, message: "ማዘመን አልተቻለም" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.waiter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete waiter error:", error);
    return NextResponse.json(
      { success: false, message: "ማጥፋት አልተቻለም (ትዕዛዞች ካሉት ይሆናል)" },
      { status: 500 }
    );
  }
}