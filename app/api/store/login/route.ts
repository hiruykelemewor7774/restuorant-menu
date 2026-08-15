import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createStoreToken,
  STORE_COOKIE_NAME,
  INACTIVITY_LIMIT_MINUTES,
} from "@/lib/store-auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const store = await prisma.storeAuth.findFirst({
      where: { username: username.trim(), isActive: true },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, message: "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, store.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል" },
        { status: 401 },
      );
    }

    const token = await createStoreToken({
      storeId: store.id,
      username: store.username,
      fullName: store.fullName || undefined,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(STORE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: INACTIVITY_LIMIT_MINUTES * 60,
    });

    return response;
  } catch (err) {
    console.error("Store login error:", err);
    return NextResponse.json(
      { success: false, message: "ውስጣዊ ስህተት" },
      { status: 500 },
    );
  }
}
