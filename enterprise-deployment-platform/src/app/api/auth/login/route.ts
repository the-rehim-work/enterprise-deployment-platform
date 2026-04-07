import { NextRequest, NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { compareSync } from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        await dbReady;
        const body = await req.json();
        const data = loginSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { username: data.username } });
        if (!user || !compareSync(data.password, user.passwordHash)) {
            await logAudit("LOGIN_FAILED", null, { username: data.username });
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await logAudit("LOGIN", user.id);
        const token = await signToken({ id: user.id, username: user.username, role: user.role });
        const response = NextResponse.json({ success: true });
        return setAuthCookie(response, token);
    } catch (e) {
        console.error("Login error:", e);
        if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}