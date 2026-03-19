import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/admin/translations — List all translations with stats
export async function GET() {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const translations = await (prisma as any).translation.findMany({
            orderBy: { updatedAt: "desc" },
            take: 200,
            include: {
                article: { select: { title: true, slug: true } },
                event: { select: { title: true, slug: true } },
            },
        });

        // Compute stats
        const byStatus: Record<string, number> = {};
        const byLanguage: Record<string, number> = {};

        translations.forEach((t: any) => {
            byStatus[t.status] = (byStatus[t.status] || 0) + 1;
            byLanguage[t.languageCode] = (byLanguage[t.languageCode] || 0) + 1;
        });

        return successResponse({
            translations,
            stats: {
                total: translations.length,
                byStatus,
                byLanguage,
            },
        });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch translations", 500);
    }
}
