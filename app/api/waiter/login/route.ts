import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createWaiterToken, WAITER_COOKIE_NAME, INACTIVITY_LIMIT_MINUTES } from "@/lib/waiter-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username እና Password ያስፈልጋል" },
        { status: 400 }
      );
    }

    const waiter = await prisma.waiter.findUnique({
      where: { username },
    });

    if (!waiter || !waiter.isActive) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, waiter.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 }
      );
    }

    const token = await createWaiterToken({
      waiterId: waiter.id,
      username: waiter.username,
      fullName: waiter.fullName ?? undefined,
    });

    const response = NextResponse.json({
      success: true,
      waiter: { id: waiter.id, username: waiter.username, fullName: waiter.fullName },
    });

    response.cookies.set(WAITER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: INACTIVITY_LIMIT_MINUTES * 60,
    });

    return response;
  } catch (error) {
    console.error("Waiter login error:", error);
    return NextResponse.json(
      { success: false, message: "የሰርቨር ችግር ተፈጥሯል" },
      { status: 500 }
    );
  }
}