import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";
import { logActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";
// GET /api/awards/nominees/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const nominee = await prisma.awardNominee.findUnique({
            where: { id },
            include: {
                year: true,
                category: true,
            },
        });

        if (!nominee) return errorResponse("Nominee not found", 404);
        return successResponse(nominee);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch nominee", 500);
    }
}

// PUT /api/awards/nominees/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;
        const data = await request.json();

        const updated = await prisma.awardNominee.update({
            where: { id },
            data: {
                nomineeName: data.nomineeName,
                workTitle: data.workTitle,
                broadcastingChannel: data.broadcastingChannel,
                imageUrl: data.imageUrl,
                isWinner: data.isWinner,
                yearId: data.yearId,
                categoryId: data.categoryId,
                videoUrl: data.videoUrl,
                gallery: data.gallery,
            },
            include: {
                year: { select: { year: true } },
                category: { select: { name: true } },
            },
        });

        await logActivity("UPDATE_NOMINEE", "AWARD", id, { nomineeName: updated.nomineeName });

        return successResponse(updated, { message: "Nominee updated successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update nominee", 500);
    }
}

// DELETE /api/awards/nominees/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;
        const deleted = await prisma.awardNominee.delete({ where: { id } });

        await logActivity("DELETE_NOMINEE", "AWARD", id, { nomineeName: deleted.nomineeName });

        return successResponse(null, { message: "Nominee deleted successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to delete nominee", 500);
    }
}
