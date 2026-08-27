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

  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { restaurantName, logoLight, logoDark, defaultLanguage, serviceCharge, taxRate } = await req.json();

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        ...(restaurantName !== undefined ? { restaurantName } : {}),
        ...(logoLight !== undefined ? { logoLight } : {}),
        ...(logoDark !== undefined ? { logoDark } : {}),
        ...(defaultLanguage !== undefined ? { defaultLanguage } : {}),
        ...(serviceCharge !== undefined ? { serviceCharge: parseFloat(serviceCharge) } : {}),
        ...(taxRate !== undefined ? { taxRate: parseFloat(taxRate) } : {}),
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ success: false, message: "ማዘመን አልተቻለም" }, { status: 500 });
  }
}
