import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/auth-guard";
import { translateWithAI } from "@/lib/gemini";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logActivity } from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { entityId, entityType, targetLanguages } = await request.json();

        if (!entityId || !entityType || !targetLanguages || !Array.isArray(targetLanguages)) {
            return errorResponse("Missing required fields: entityId, entityType, targetLanguages", 400);
        }

        // Get Article and any existing translations
        const article = await prisma.article.findUnique({
            where: { id: entityId },
            include: { author: { select: { name: true } } }
        });

        if (!article) return errorResponse("Article not found", 404);

        const sourceFields = {
            title: article.title,
            excerpt: article.excerpt || "",
            content: article.content, // TipTap JSON
        };

        const results = [];

        for (const langCode of targetLanguages) {
            if (langCode === "th") continue;

            try {
                // Perform AI Translation
                const translated = await translateWithAI(sourceFields, langCode);

                // Save or Update Translation table
                const translation = await (prisma as any).translation.upsert({
                    where: {
                        entityType_entityId_languageCode: {
                            entityType,
                            entityId,
                            languageCode: langCode,
                        },
                    },
                    update: {
                        title: translated.title,
                        excerpt: translated.excerpt,
                        content: translated.content,
                        status: "AUTO_GENERATED",
                        confidenceScore: translated.confidenceScore || 0.9,
                        articleId: entityType === "ARTICLE" ? entityId : undefined,
                        eventId: entityType === "EVENT" ? entityId : undefined,
                    },
                    create: {
                        entityType,
                        entityId,
                        languageCode: langCode,
                        title: translated.title,
                        excerpt: translated.excerpt,
                        content: translated.content,
                        status: "AUTO_GENERATED",
                        confidenceScore: translated.confidenceScore || 0.9,
                        articleId: entityType === "ARTICLE" ? entityId : undefined,
                        eventId: entityType === "EVENT" ? entityId : undefined,
                    },
                });

                results.push({ langCode, success: true, id: translation.id });
                
                await logActivity("AUTO_TRANSLATE", "ARTICLE", entityId, { langCode, success: true });

            } catch (err: any) {
                console.error(`Error translating to ${langCode}:`, err);
                results.push({ langCode, success: false, error: err.message });
                
                await logActivity("AUTO_TRANSLATE", "ARTICLE", entityId, { langCode, success: false, error: err.message });
            }
        }

        return successResponse(results, { message: `AI Translation completed for ${results.filter(r => r.success).length} languages.` });

    } catch (error: any) {
        console.error("Translation API Error:", error);
        return errorResponse(error.message || "Failed to process translation", 500);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const entityId = searchParams.get("entityId");
        const entityType = searchParams.get("entityType");

        if (!entityId || !entityType) {
            return errorResponse("Missing entityId or entityType", 400);
        }

        const translations = await (prisma as any).translation.findMany({
            where: { entityId, entityType },
            orderBy: { languageCode: "asc" }
        });

        return successResponse(translations);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch translations", 500);
    }
}
