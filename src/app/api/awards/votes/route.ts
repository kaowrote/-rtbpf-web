import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/awards/votes?yearId=...&categoryId=...
// Returns vote counts per nominee and user's vote (if logged in)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const yearId = searchParams.get("yearId");
        const categoryId = searchParams.get("categoryId");

        if (!yearId || !categoryId) {
            return NextResponse.json({ error: "yearId and categoryId are required" }, { status: 400 });
        }

        const session = await auth();

        // Get all nominees with vote counts
        const nominees = await prisma.awardNominee.findMany({
            where: { yearId, categoryId },
            include: {
                _count: { select: { votes: true } },
            },
            orderBy: { nomineeName: "asc" },
        });

        // Get user's vote if logged in
        let userVoteNomineeId: string | null = null;
        if (session?.user?.id) {
            const userVote = await prisma.awardVote.findUnique({
                where: {
                    userId_categoryId_yearId: {
                        userId: session.user.id,
                        categoryId,
                        yearId,
                    },
                },
            });
            userVoteNomineeId = userVote?.nomineeId || null;
        }

        const result = nominees.map((n) => ({
            id: n.id,
            nomineeName: n.nomineeName,
            workTitle: n.workTitle,
            imageUrl: n.imageUrl,
            broadcastingChannel: n.broadcastingChannel,
            voteCount: n._count.votes,
            isUserVote: n.id === userVoteNomineeId,
        }));

        return NextResponse.json({
            nominees: result,
            userVoteNomineeId,
            totalVotes: result.reduce((sum, n) => sum + n.voteCount, 0),
        });
    } catch (error: any) {
        console.error("GET /api/awards/votes error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/awards/votes
// Cast or change a vote
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await req.json();
        const { nomineeId, yearId, categoryId } = body;

        if (!nomineeId || !yearId || !categoryId) {
            return NextResponse.json(
                { error: "nomineeId, yearId, and categoryId are required" },
                { status: 400 }
            );
        }

        // Verify nominee exists in the given category and year
        const nominee = await prisma.awardNominee.findFirst({
            where: { id: nomineeId, yearId, categoryId },
        });

        if (!nominee) {
            return NextResponse.json({ error: "Nominee not found" }, { status: 404 });
        }

        // Upsert vote (one vote per user per category per year)
        const vote = await prisma.awardVote.upsert({
            where: {
                userId_categoryId_yearId: {
                    userId: session.user.id,
                    categoryId,
                    yearId,
                },
            },
            update: { nomineeId },
            create: {
                userId: session.user.id,
                nomineeId,
                yearId,
                categoryId,
            },
        });

        return NextResponse.json({ vote, message: "Vote cast successfully" });
    } catch (error: any) {
        console.error("POST /api/awards/votes error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/awards/votes
// Remove a vote
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await req.json();
        const { yearId, categoryId } = body;

        if (!yearId || !categoryId) {
            return NextResponse.json(
                { error: "yearId and categoryId are required" },
                { status: 400 }
            );
        }

        await prisma.awardVote.deleteMany({
            where: {
                userId: session.user.id,
                yearId,
                categoryId,
            },
        });

        return NextResponse.json({ message: "Vote removed" });
    } catch (error: any) {
        console.error("DELETE /api/awards/votes error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
