import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, getAuthFromCookies } from "@/lib/jwt";
import { logAudit } from "@/lib/audit";

export async function POST(_req: NextRequest) {
    const auth = await getAuthFromCookies();
    if (auth) await logAudit("LOGOUT", auth.id);
    const response = NextResponse.json({ success: true });
    return clearAuthCookie(response);
}