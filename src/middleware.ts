import { NextRequest, NextResponse } from "next/server";
import { AccessTokenKey } from "./constants/strings";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(AccessTokenKey);
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
