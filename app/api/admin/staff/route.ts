import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token ? await verifyAdminToken(token) : null;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  const waiters = await prisma.waiter.findMany({
    select: {
      id: true,
      username: true,
      fullName: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, waiters });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { username, password, fullName } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username እና Password ያስፈልጋሉ" },
        { status: 400 }
      );
    }

    const existing = await prisma.waiter.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "ይህ username ቀድሞ ጥቅም ላይ ውሏል" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const waiter = await prisma.waiter.create({
      data: { username, password: hashed, fullName: fullName || null },
      select: { id: true, username: true, fullName: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ success: true, waiter });
  } catch (error) {
    console.error("Create waiter error:", error);
    return NextResponse.json(
      { success: false, message: "Waiter መፍጠር አልተቻለም" },
      { status: 500 }
    );
  }
}