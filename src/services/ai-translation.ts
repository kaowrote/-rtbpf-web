import { prisma } from "@/lib/prisma";

export async function translateContent(entityType: string, entityId: string, targetLanguages: string[]) {
    // 1. Fetch the source entity
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
        content: sourceData.content, // TipTap JSON
    };

    const results = [];

    for (const lang of targetLanguages) {
        if (lang === "th") continue; // Skip default language

        // 2. Perform AI Translation (Gemini or GPT)
        // placeholder for actual AI call
        console.log(`Translating ${entityType} ${entityId} to ${lang}...`);
        
        // await callGemini(sourceFields, lang);
        
        // 3. Save to Translation table
        const translation = await prisma.translation.upsert({
            where: {
                entityType_entityId_languageCode: {
                    entityType,
                    entityId,
                    languageCode: lang,
                },
            },
            update: {
                status: "AUTO_GENERATED",
                // title, excerpt, content
            },
            create: {
                entityType,
                entityId,
                languageCode: lang,
                status: "AUTO_GENERATED",
                // title, excerpt, content
            },
        });
        results.push(translation);
    }

    return results;
}
