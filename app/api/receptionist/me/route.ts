import { NextRequest, NextResponse } from "next/server";
import {
  verifyReceptionistToken,
  RECEPTIONIST_COOKIE_NAME,
} from "@/lib/receptionist-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(RECEPTIONIST_COOKIE_NAME)?.value;
  const payload = token ? await verifyReceptionistToken(token) : null;

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, receptionist: payload });
}
