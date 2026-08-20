import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyReceptionistToken,
  RECEPTIONIST_COOKIE_NAME,
} from "@/lib/receptionist-auth";

async function requireReceptionist(req: NextRequest) {
  const token = req.cookies.get(RECEPTIONIST_COOKIE_NAME)?.value;
  return token ? await verifyReceptionistToken(token) : null;
}

export async function GET(req: NextRequest) {
  const payload = await requireReceptionist(req);
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const reservations = await prisma.reservation.findMany({
    where: { status: "confirmed" },
    orderBy: { reservedDate: "asc" },
  });

  return NextResponse.json({ success: true, reservations });
}

export async function POST(req: NextRequest) {
  const payload = await requireReceptionist(req);
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const {
      guestName,
      guestPhone,
      tableNumber,
      reservedDate,
      reservedTime,
      guestCount,
      notes,
    } = await req.json();

    if (
      !guestName ||
      !guestPhone ||
      !tableNumber ||
      !reservedDate ||
      !reservedTime
    ) {
      return NextResponse.json(
        { success: false, message: "ሁሉንም መስክ ይሙሉ" },
        { status: 400 },
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        guestPhone,
        tableNumber,
        reservedDate: new Date(reservedDate),
        reservedTime,
        guestCount: guestCount ? parseInt(guestCount) : 1,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json(
      { success: false, message: "ማስያዝ አልተቻለም" },
      { status: 500 },
    );
  }
}
