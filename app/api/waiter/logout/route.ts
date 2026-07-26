import { NextResponse } from "next/server";
import { WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(WAITER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}