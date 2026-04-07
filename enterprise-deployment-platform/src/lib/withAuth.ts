import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

type AuthUser = { id: number; username: string; role: string };
type RouteContext = { params?: Promise<Record<string, string>> };
type AuthHandler = (req: NextRequest, context: RouteContext & { user: AuthUser }) => Promise<NextResponse>;

const COOKIE_NAME = "auth-token";

export function withAuth(handler: AuthHandler) {
 return async (req: NextRequest, context: RouteContext = {}) => {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
   const user = await verifyToken(token);
   return handler(req, { ...context, user });
  } catch {
   return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
 };
}