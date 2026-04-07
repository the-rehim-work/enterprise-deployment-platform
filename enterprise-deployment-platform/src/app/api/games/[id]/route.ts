import { NextRequest, NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbReady;
    const { id } = await params;
    const game = await prisma.game.findUnique({ where: { id: Number(id) } });
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(game);
}