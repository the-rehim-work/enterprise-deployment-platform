import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");
const COOKIE_NAME = "auth-token";

export async function signToken(payload: { id: number; username: string; role: string }) {
 return new SignJWT(payload)
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("7d")
  .setIssuedAt()
  .sign(secret);
}

export async function verifyToken(token: string) {
 const { payload } = await jwtVerify(token, secret);
 return payload as { id: number; username: string; role: string };
}

export function setAuthCookie(response: NextResponse, token: string) {
 response.cookies.set(COOKIE_NAME, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
 });
 return response;
}

export function clearAuthCookie(response: NextResponse) {
 response.cookies.set(COOKIE_NAME, "", {
  httpOnly: true,
  path: "/",
  maxAge: 0,
 });
 return response;
}

export async function getAuthFromCookies() {
 const cookieStore = await cookies();
 const token = cookieStore.get(COOKIE_NAME)?.value;
 if (!token) return null;
 try {
  return await verifyToken(token);
 } catch {
  return null;
 }
}