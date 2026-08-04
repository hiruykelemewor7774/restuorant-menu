import { NextRequest, NextResponse } from "next/server";
import { verifyKitchenToken, KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(KITCHEN_COOKIE_NAME)?.value;
  const payload = token ? await verifyKitchenToken(token) : null;

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, kitchen: payload });
}