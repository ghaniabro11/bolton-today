import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const token = request.cookies.get("authAccess")?.value;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  console.log("[Middleware] Path:", pathname);
  console.log("[Middleware] Token exists:", !!token);
  console.log("[Middleware] isLoginRoute:", isLoginRoute);
  console.log("[Middleware] isAdminRoute:", isAdminRoute);

  if (!token && isAdminRoute && !isLoginRoute) {
    console.log("[Middleware] No token. Redirecting to /admin/login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (token && isAdminRoute) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      console.log("[Middleware] Token is valid");

      if (isLoginRoute) {
        console.log("[Middleware] User is logged in and trying to access login. Redirecting to /admin/user");
        return NextResponse.redirect(new URL("/admin/user/", request.url));
      }
    } catch (error) {
      console.warn("[Middleware] Invalid token. Clearing cookies and redirecting to /admin/login", error);

      const response = NextResponse.redirect(new URL("/admin/login", request.url));

      // Clear server-side cookie
      response.cookies.set("authAccess", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });

      // Clear client-side cookie
      response.cookies.set("authAccess", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });

      return response;
    }
  }

  console.log("[Middleware] Proceeding with request");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|uploads).*)"],
};
