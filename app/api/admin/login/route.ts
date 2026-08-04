import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAdminToken, ADMIN_COOKIE_NAME, ADMIN_SESSION_MINUTES } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const admin = await prisma.adminAuth.findFirst({
      where: { username: username.trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    let isPasswordValid = password === admin.password;

    if (!isPasswordValid) {
      try {
        isPasswordValid = await bcrypt.compare(password, admin.password);
      } catch {
        // pass error to fallback
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // JWT token መፍጠር
    const token = await createAdminToken({
      adminId: admin.id,
      username: admin.username,
    });

    const response = NextResponse.json({ message: "Admin login successful", success: true });

    // httpOnly cookie ውስጥ ማስቀመጥ
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MINUTES * 60,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}