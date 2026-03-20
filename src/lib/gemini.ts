import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

/** Get the Gemini API key — reads from DB first, then falls back to env var */
export async function getGeminiApiKey(): Promise<string> {
    // 1. Try DB setting (set via Settings > API Keys tab)
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "apiKeyGoogleAI" },
        });
        if (setting?.value) return setting.value;
    } catch {
        // DB not available, fall through
    }
    // 2. Fall back to env var
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    throw new Error("Gemini API Key ยังไม่ได้ตั้งค่า — ไปที่ Settings > API Keys เพื่อใส่ key");
}

export async function translateWithAI(sourceFields: { title: string; excerpt?: string; content: any }, targetLanguage: string) {
    const apiKey = await getGeminiApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
        You are a high-fidelity translator for a news platform. 
        Your task is to translate the provided Thai content into ${targetLanguage}.
        
        Important Rules:
        1. Translate 'title' (string) and 'excerpt' (string) accurately.
        2. The 'content' is in TipTap JSON format. Translate ONLY the "text" values within the "content" array.
        3. DO NOT change the JSON structure, "type", "attrs", or "marks".
        4. Keep any technical terms, URLs, or special markdown inside tags as they are if they look like code.
        5. Return the result in a JSON container like this: { "title": "...", "excerpt": "...", "content": { ... } }
        6. Return ONLY the JSON object. Do not include markdown code block markers.

        Content to translate:
        TITLE: ${sourceFields.title}
        EXCERPT: ${sourceFields.excerpt || ""}
        CONTENT_JSON: ${JSON.stringify(sourceFields.content)}
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Sometimes AI returns ```json ... ```, so we strip it.
        const cleanedJsonText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const translatedData = JSON.parse(cleanedJsonText);
        
        return {
            title: translatedData.title,
            excerpt: translatedData.excerpt,
            content: translatedData.content,
            confidenceScore: 0.95, // Approximate
        };
    } catch (error) {
        console.error("AI Translation Error:", error);
        throw error;
    }
}
