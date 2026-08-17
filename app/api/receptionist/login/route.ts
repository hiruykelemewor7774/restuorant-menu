import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createReceptionistToken,
  RECEPTIONIST_COOKIE_NAME,
  RECEPTIONIST_SESSION_MINUTES,
} from "@/lib/receptionist-auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const receptionist = await prisma.receptionist.findUnique({
      where: { username },
    });

    if (!receptionist || !receptionist.isActive) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, receptionist.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 },
      );
    }

    const token = await createReceptionistToken({
      receptionistId: receptionist.id,
      username: receptionist.username,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(RECEPTIONIST_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: RECEPTIONIST_SESSION_MINUTES * 60,
    });

    return response;
  } catch (error) {
    console.error("Receptionist login error:", error);
    return NextResponse.json(
      { success: false, message: "የሰርቨር ችግር ተፈጥሯል" },
      { status: 500 },
    );
  }
}
