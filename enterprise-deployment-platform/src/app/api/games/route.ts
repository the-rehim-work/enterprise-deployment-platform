import { NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";
import { createGameSchema } from "@/lib/validators";
import { withRole } from "@/lib/withRole";
import { z } from "zod";

export async function GET() {
    await dbReady;
    const all = await prisma.game.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json(all);
}

export const POST = withRole("admin", async (req) => {
    await dbReady;
    try {
        const body = await req.json();
        const data = createGameSchema.parse(body);
        const game = await prisma.game.create({ data });
        return NextResponse.json(game, { status: 201 });
    } catch (e) {
        if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
});