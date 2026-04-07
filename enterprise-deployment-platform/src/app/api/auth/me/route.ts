import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { prisma, dbReady } from "@/lib/db";

export const GET = withAuth(async (_req, { user }) => {
    await dbReady;
    const data = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            displayName: true,
            avatar: true,
            bio: true,
            createdAt: true,
        },
    });

    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(data);
});