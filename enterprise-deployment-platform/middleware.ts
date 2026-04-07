import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/lib/jwt";
import { rateLimit, getRateLimitHeaders } from "./src/lib/rate-limit";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register"];

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:;",
};

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth/")) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(ip);
    if (!allowed) {
      const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
      const headers = getRateLimitHeaders(ip);
      Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
      return applySecurityHeaders(res);
    }
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api/")) {
    return applySecurityHeaders(NextResponse.next());
  }

  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await verifyToken(token);
    return applySecurityHeaders(NextResponse.next());
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};