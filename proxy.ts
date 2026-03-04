import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/admin/login/"];
const ADMIN_PREFIX = "/admin";
const API_PREFIX = "/api";

// If you want some APIs public, add them here
const PUBLIC_API_ROUTES = ["/api/v1/user/login/"];

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authAccess")?.value;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isApiRoute = pathname.startsWith(API_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isPublicApi = PUBLIC_API_ROUTES.includes(pathname);

  console.log("[Middleware] Path:", pathname);

  // ==============================
  // 1️⃣ API ROUTE PROTECTION
  // ==============================
  if (isApiRoute) {
    if (isPublicApi) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or Expired Token" },
        { status: 401 },
      );
    }

    // Optional: attach user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.id || ""));
    requestHeaders.set("x-user-role", String(payload.role || ""));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // ==============================
  // 2️⃣ PUBLIC PAGE (LOGIN)
  // ==============================
  if (isPublicRoute) {
    if (!token) return NextResponse.next();

    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/admin/user/", request.url));
    }

    return clearCookieAndRedirect(request);
  }

  // ==============================
  // 3️⃣ ADMIN PAGE PROTECTION
  // ==============================
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login/", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return clearCookieAndRedirect(request);
    }

    // Optional: Role-based check
    // if (payload.role !== "admin") {
    //   return NextResponse.redirect(new URL("/403", request.url));
    // }

    return NextResponse.next();
  }

  // ==============================
  // 4️⃣ EVERYTHING ELSE
  // ==============================
  return NextResponse.next();
}

function clearCookieAndRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  response.cookies.set("authAccess", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|uploads|favicon.ico).*)"],
};
