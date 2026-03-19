import { prisma } from "@/lib/prisma";
import { translateWithAI } from "@/lib/gemini";

export interface TranslationResult {
    langCode: string;
    success: boolean;
    id?: string;
    error?: string;
}

// Get glossary terms for translation context
async function getGlossaryTerms(): Promise<Record<string, string>> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "translationGlossary" },
        });
        if (setting?.value) {
            return JSON.parse(setting.value);
        }
    } catch { }
    return {};
}

// Translate a single entity (article or event)
export async function translateEntity(
    entityType: "ARTICLE" | "EVENT",
    entityId: string,
    targetLanguages: string[]
): Promise<TranslationResult[]> {
    // Fetch source entity
    let sourceData: any;
    if (entityType === "ARTICLE") {
        sourceData = await prisma.article.findUnique({ where: { id: entityId } });
    } else if (entityType === "EVENT") {
        sourceData = await prisma.event.findUnique({ where: { id: entityId } });
    }

    if (!sourceData) throw new Error("Entity not found");

    const sourceFields = {
        title: sourceData.title,
        excerpt: sourceData.excerpt || "",
        content: sourceData.content || sourceData.description,
    };

    const glossary = await getGlossaryTerms();
    const results: TranslationResult[] = [];

    for (const lang of targetLanguages) {
        if (lang === "th") continue;

        try {
            const translated = await translateWithAI(sourceFields, lang);

            const translation = await (prisma as any).translation.upsert({
                where: {
                    entityType_entityId_languageCode: {
                        entityType,
                        entityId,
                        languageCode: lang,
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
                    languageCode: lang,
                    title: translated.title,
                    excerpt: translated.excerpt,
                    content: translated.content,
                    status: "AUTO_GENERATED",
                    confidenceScore: translated.confidenceScore || 0.9,
                    articleId: entityType === "ARTICLE" ? entityId : undefined,
                    eventId: entityType === "EVENT" ? entityId : undefined,
                },
            });

            results.push({ langCode: lang, success: true, id: translation.id });
        } catch (err: any) {
            console.error(`Error translating to ${lang}:`, err);
            results.push({ langCode: lang, success: false, error: err.message });
        }
    }

    return results;
}

// Batch translate all untranslated content
export async function batchTranslateArticles(
    targetLanguages: string[]
): Promise<{ total: number; success: number; failed: number }> {
    const articles = await prisma.article.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true },
    });

    let success = 0;
    let failed = 0;

    for (const article of articles) {
        try {
            // Check which languages are missing
            const existing = await (prisma as any).translation.findMany({
                where: { entityId: article.id, entityType: "ARTICLE" },
                select: { languageCode: true },
            });
            const existingLangs = new Set(existing.map((t: any) => t.languageCode));
            const missing = targetLanguages.filter((l) => l !== "th" && !existingLangs.has(l));

            if (missing.length > 0) {
                const results = await translateEntity("ARTICLE", article.id, missing);
                success += results.filter((r) => r.success).length;
                failed += results.filter((r) => !r.success).length;
            }
        } catch {
            failed++;
        }
    }

    return { total: articles.length, success, failed };
}
