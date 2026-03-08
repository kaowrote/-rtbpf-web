import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export async function translateWithAI(sourceFields: { title: string; excerpt?: string; content: any }, targetLanguage: string) {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

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
