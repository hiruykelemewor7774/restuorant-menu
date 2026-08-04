import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  return payload;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const items = await prisma.menuItem.findMany({
    orderBy: [{ type: "asc" }, { category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ success: true, items });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const { type, category, name, price, image, features } = await req.json();

    if (!type || !name || !price || !image) {
      return NextResponse.json(
        { success: false, message: "type, name, price, image ያስፈልጋሉ" },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
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
    console.error("Create menu item error:", error);
    return NextResponse.json(
      { success: false, message: "እቃ መፍጠር አልተቻለም" },
      { status: 500 }
    );
  }
}