import { NextRequest, NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";
import { createAchievementSchema } from "@/lib/validators";
import { withRole } from "@/lib/withRole";
import { z } from "zod";

export async function GET(req: NextRequest) {
    await dbReady;
    const gameId = req.nextUrl.searchParams.get("gameId");
    if (!gameId) return NextResponse.json({ error: "gameId required" }, { status: 400 });
    const all = await prisma.achievement.findMany({ where: { gameId: Number(gameId) } });
    return NextResponse.json(all);
}

export const POST = withRole("admin", async (req) => {
    await dbReady;
    try {
        const body = await req.json();
        const data = createAchievementSchema.parse(body);
        const achievement = await prisma.achievement.create({ data });
        return NextResponse.json(achievement, { status: 201 });
    } catch (e) {
        if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
});