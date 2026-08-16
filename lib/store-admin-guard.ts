import { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  return payload;
}
