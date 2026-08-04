import { NextResponse } from "next/server";
import { KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(KITCHEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}