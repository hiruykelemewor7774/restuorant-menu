import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createKitchenToken,
  KITCHEN_COOKIE_NAME,
  KITCHEN_SESSION_MINUTES,
} from "@/lib/kitchen-auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const kitchen = await prisma.kitchen.findUnique({ where: { username } });

    if (!kitchen || !kitchen.isActive) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, kitchen.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Username ወይም Password ትክክል አይደለም" },
        { status: 401 }
      );
    }

    const token = await createKitchenToken({
      kitchenId: kitchen.id,
      username: kitchen.username,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(KITCHEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/kitchen",
      maxAge: KITCHEN_SESSION_MINUTES * 60,
    });

    return response;
  } catch (error) {
    console.error("Kitchen login error:", error);
    return NextResponse.json(
      { success: false, message: "የሰርቨር ችግር ተፈጥሯል" },
      { status: 500 }
    );
  }
}