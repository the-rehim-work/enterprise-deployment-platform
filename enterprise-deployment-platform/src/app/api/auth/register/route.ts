import { NextRequest, NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { hashSync } from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        await dbReady;
        const body = await req.json();
        const data = registerSchema.parse(body);

        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return NextResponse.json({ error: "Email already taken" }, { status: 409 });
        }

        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash: hashSync(data.password, 10),
                displayName: data.displayName || data.username,
            },
        });

        await logAudit("REGISTER", user.id, { username: user.username, email: user.email });
        const token = await signToken({ id: user.id, username: user.username, role: user.role });
        const response = NextResponse.json({ success: true }, { status: 201 });
        return setAuthCookie(response, token);
    } catch (e) {
        console.error("Register error:", e);
        if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}