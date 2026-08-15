import { NextResponse } from "next/server";
import { STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(STORE_COOKIE_NAME);
  return response;
}
