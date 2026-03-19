import { NextRequest } from "next/server";
import { requireEditor } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { batchTranslateArticles } from "@/services/ai-translation";

// POST /api/admin/translations/batch — Batch translate all untranslated articles
export async function POST() {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const targetLanguages = ["en", "ko", "ja", "zh", "fr", "de", "es"];
        const result = await batchTranslateArticles(targetLanguages);

        return successResponse(result, {
            message: `Batch translation complete: ${result.success} succeeded, ${result.failed} failed`,
        });
    } catch (error: any) {
        return errorResponse(error.message || "Batch translation failed", 500);
    }
}
