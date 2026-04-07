import { NextRequest, NextResponse } from "next/server";
import { prisma, dbReady } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ gameId: string }> }) {
    await dbReady;
    const { gameId } = await params;
    const rows = await prisma.leaderboardEntry.findMany({
        where: { gameId: Number(gameId) },
        orderBy: { score: "desc" },
        select: {
            score: true,
            updatedAt: true,
            user: {
                select: {
                    username: true,
                    displayName: true,
                    avatar: true,
                },
            },
        },
    });

    const flat = rows.map((r) => ({
        score: r.score,
        updatedAt: r.updatedAt,
        username: r.user.username,
        displayName: r.user.displayName,
        avatar: r.user.avatar,
    }));

    return NextResponse.json(flat);
}