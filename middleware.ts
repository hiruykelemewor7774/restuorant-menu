import { NextRequest, NextResponse } from "next/server";
import { verifyWaiterToken, WAITER_COOKIE_NAME } from "@/lib/waiter-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/waiter/login";
  const isWaiterRoute = pathname.startsWith("/waiter");

  if (!isWaiterRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(WAITER_COOKIE_NAME)?.value;
  const payload = token ? await verifyWaiterToken(token) : null;

  if (isLoginPage) {
    if (payload) {
      return NextResponse.redirect(new URL("/waiter", req.url));
    }
    return NextResponse.next();
  }

  if (!payload) {
    const loginUrl = new URL("/waiter/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: ["/waiter/:path*"],
};