import { NextResponse } from "next/server";
import { withAuth } from "./withAuth";
import type { NextRequest } from "next/server";

type AuthUser = { id: number; username: string; role: string };
type RouteContext = { params?: Promise<Record<string, string>> };
type RoleHandler = (req: NextRequest, context: RouteContext & { user: AuthUser }) => Promise<NextResponse>;

export function withRole(role: string, handler: RoleHandler) {
 return withAuth(async (req, context) => {
  if (context.user.role !== role) {
   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return handler(req, context);
 });
}