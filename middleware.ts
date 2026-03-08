import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/config/locales";
import { verifyAuthToken } from "@/lib/auth";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale
});

function isProtectedPath(pathname: string) {
  if (pathname === "/create-event" || /^\/admin(\/.*)?$/.test(pathname)) {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const firstPath = segments[1];
  const secondPath = segments[2];
  const thirdPath = segments[3];

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    return false;
  }

  return firstPath === "create-event"
    || firstPath === "admin"
    || (firstPath === "events" && secondPath === "create-event")
    || (firstPath === "events" && thirdPath === "edit");
}

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isValidToken = token ? Boolean(verifyAuthToken(token)) : false;

  if (isProtectedPath(request.nextUrl.pathname) && !isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
