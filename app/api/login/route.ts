import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const admin = await prisma.adminAuth.findFirst({ where: { username } });

    if (!admin || String(admin.password) !== String(password)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}