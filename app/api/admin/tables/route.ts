import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  const tables = await prisma.table.findMany({
    orderBy: { tableNumber: "asc" },
  });
  return NextResponse.json({ success: true, tables });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { tableNumber } = await req.json();

    if (!tableNumber) {
      return NextResponse.json(
        { success: false, message: "የጠረጴዛ ቁጥር ያስፈልጋል" },
        { status: 400 },
      );
    }

    const existing = await prisma.table.findUnique({ where: { tableNumber } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "ይህ ጠረጴዛ ቀድሞውኑ አለ" },
        { status: 400 },
      );
    }

    const table = await prisma.table.create({
      data: { tableNumber, qrCode: "" },
    });

    return NextResponse.json({ success: true, table });
  } catch (error) {
    console.error("Create table error:", error);
    return NextResponse.json(
      { success: false, message: "መፍጠር አልተቻለም" },
      { status: 500 },
    );
  }
}
