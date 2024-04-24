import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("access_token");
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
