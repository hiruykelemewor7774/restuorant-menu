import { NextRequest, NextResponse } from "next/server";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { verifyKitchenToken, KITCHEN_COOKIE_NAME } from "@/lib/kitchen-auth";
import {verifyReceptionistToken,RECEPTIONIST_COOKIE_NAME,} from "@/lib/receptionist-auth";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function withNoCache(response: NextResponse) {
  Object.entries(noCacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---------------- WAITER ROUTES ----------------
  if (pathname.startsWith("/waiter")) {
    const isLoginPage = pathname === "/waiter/login";
    const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
    const payload = token ? await verifyWaiterToken(token) : null;

    if (isLoginPage) {
      if (payload) return NextResponse.redirect(new URL("/waiter", req.url));
      return NextResponse.next();
    }

    if (!payload) {
      return withNoCache(NextResponse.redirect(new URL("/waiter/login", req.url)));
    }

    return withNoCache(NextResponse.next());
  }

  // ---------------- ADMIN ROUTES ----------------
  if (pathname.startsWith("/admin")) {
    const isAdminLoginPage = pathname === "/admin/login";
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminPayload = adminToken ? await verifyAdminToken(adminToken) : null;

    if (isAdminLoginPage) {
      if (adminPayload) return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.next();
    }

    if (!adminPayload) {
      return withNoCache(NextResponse.redirect(new URL("/admin/login", req.url)));
    }

    return withNoCache(NextResponse.next());
  }

  // ---------------- KITCHEN ROUTES ----------------
  if (pathname.startsWith("/kitchen")) {
    const isKitchenLoginPage = pathname === "/kitchen/login";
    const kitchenToken = req.cookies.get(KITCHEN_COOKIE_NAME)?.value;
    const kitchenPayload = kitchenToken ? await verifyKitchenToken(kitchenToken) : null;

    if (isKitchenLoginPage) {
      if (kitchenPayload) return NextResponse.redirect(new URL("/kitchen", req.url));
      return NextResponse.next();
    }

    if (!kitchenPayload) {
      return withNoCache(NextResponse.redirect(new URL("/kitchen/login", req.url)));
    }

    return withNoCache(NextResponse.next());
  }

  if (pathname.startsWith("/receptionist")) {
    const isLoginPage = pathname === "/receptionist/login";
    const token = req.cookies.get(RECEPTIONIST_COOKIE_NAME)?.value;
    const payload = token ? await verifyReceptionistToken(token) : null;

    if (isLoginPage) {
      if (payload)
        return NextResponse.redirect(new URL("/receptionist", req.url));
      return NextResponse.next();
    }

    if (!payload) {
      return withNoCache(
        NextResponse.redirect(new URL("/receptionist/login", req.url)),
      );
    }

    return withNoCache(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/waiter/:path*", 
    "/admin/:path*", 
    "/kitchen/:path*",
    "/receptionist/:path*"],
};