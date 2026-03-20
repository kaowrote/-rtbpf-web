import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

// Helper: strip HTML/TipTap JSON to plain text
function extractTextFromContent(content: any): string {
    if (typeof content === "string") {
        return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
    if (!content) return "";

    // TipTap JSON format
    const texts: string[] = [];
    function walk(node: any) {
        if (node.text) texts.push(node.text);
        if (node.content && Array.isArray(node.content)) {
            node.content.forEach(walk);
        }
    }
    walk(content);
    return texts.join(" ").replace(/\s+/g, " ").trim();
}

// POST /api/tts — Generate TTS audio for an article
export async function POST(request: NextRequest) {
    try {
        const { articleId, languageCode = "th" } = await request.json();

        if (!articleId) {
            return errorResponse("Missing articleId", 400);
        }

        // Check if audio already exists
        const existing = await (prisma as any).audioArticle.findUnique({
            where: { articleId_languageCode: { articleId, languageCode } },
        });

        if (existing && existing.status === "READY") {
            return successResponse(existing, { message: "Audio already exists" });
        }

        // Get article content
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });

        if (!article) return errorResponse("Article not found", 404);

        // Extract plain text
        const textContent = `${article.title}. ${article.excerpt || ""}. ${extractTextFromContent(article.content)}`;
        
        // Limit text length (Google TTS has limits)
        const truncatedText = textContent.substring(0, 4000);

        // Get API key from system settings or env
        const apiKeySetting = await prisma.systemSetting.findUnique({
            where: { key: "apiKeyGoogleAI" },
        });
        const apiKey = apiKeySetting?.value || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return errorResponse("Google AI Studio API key ยังไม่ได้ตั้งค่า — ไปที่ Settings > API Keys", 500);
        }

        // Use Google Cloud TTS via REST API (or fallback to browser TTS)
        // For now, we'll use a simulated approach that generates the audio URL
        // In production, this would call Google Cloud TTS API
        
        const ttsApiKeySetting = await prisma.systemSetting.findUnique({
            where: { key: "apiKeyGoogleTTS" },
        });
        const ttsKey = ttsApiKeySetting?.value || apiKey;

        // Map language codes to Google TTS voice names
        const voiceMap: Record<string, { languageCode: string; name: string }> = {
            th: { languageCode: "th-TH", name: "th-TH-Standard-A" },
            en: { languageCode: "en-US", name: "en-US-Standard-C" },
            ko: { languageCode: "ko-KR", name: "ko-KR-Standard-A" },
            ja: { languageCode: "ja-JP", name: "ja-JP-Standard-A" },
            zh: { languageCode: "cmn-CN", name: "cmn-CN-Standard-A" },
            fr: { languageCode: "fr-FR", name: "fr-FR-Standard-A" },
            de: { languageCode: "de-DE", name: "de-DE-Standard-A" },
            es: { languageCode: "es-ES", name: "es-ES-Standard-A" },
        };

        const voice = voiceMap[languageCode] || voiceMap.th;

        try {
            // Call Google Cloud TTS API
            const ttsResponse = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        input: { text: truncatedText },
                        voice: { languageCode: voice.languageCode, name: voice.name },
                        audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
                    }),
                }
            );

            if (!ttsResponse.ok) {
                const errData = await ttsResponse.json().catch(() => ({}));
                console.error("TTS API Error:", errData);
                
                // Fallback: save with browser TTS flag
                const audioRecord = await (prisma as any).audioArticle.upsert({
                    where: { articleId_languageCode: { articleId, languageCode } },
                    update: { 
                        audioUrl: `browser-tts://${languageCode}`,
                        status: "READY",
                        voiceName: "browser",
                    },
                    create: {
                        articleId,
                        languageCode,
                        audioUrl: `browser-tts://${languageCode}`,
                        status: "READY",
                        voiceName: "browser",
                    },
                });
                
                return successResponse(audioRecord, { message: "Using browser TTS (Cloud API unavailable)" });
            }

            const ttsData = await ttsResponse.json();
            const audioContent = ttsData.audioContent; // Base64 encoded

            // Store as data URL (for demo) — in production, upload to cloud storage
            const audioUrl = `data:audio/mp3;base64,${audioContent}`;
            const fileSize = Math.ceil((audioContent.length * 3) / 4); // Approximate

            const audioRecord = await (prisma as any).audioArticle.upsert({
                where: { articleId_languageCode: { articleId, languageCode } },
                update: {
                    audioUrl,
                    status: "READY",
                    voiceName: voice.name,
                    fileSize,
                },
                create: {
                    articleId,
                    languageCode,
                    audioUrl,
                    status: "READY",
                    voiceName: voice.name,
                    fileSize,
                },
            });

            return successResponse(audioRecord, { message: "TTS audio generated successfully" });
        } catch (ttsError: any) {
            console.error("TTS generation error:", ttsError);
            
            // Fallback to browser TTS
            const audioRecord = await (prisma as any).audioArticle.upsert({
                where: { articleId_languageCode: { articleId, languageCode } },
                update: { audioUrl: `browser-tts://${languageCode}`, status: "READY", voiceName: "browser" },
                create: { articleId, languageCode, audioUrl: `browser-tts://${languageCode}`, status: "READY", voiceName: "browser" },
            });

            return successResponse(audioRecord, { message: "Using browser TTS (fallback)" });
        }
    } catch (error: any) {
        console.error("TTS API Error:", error);
        return errorResponse(error.message || "Failed to generate TTS", 500);
    }
}

// GET /api/tts?articleId=xxx — Get TTS audio for an article
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get("articleId");
        const languageCode = searchParams.get("lang") || "th";

        if (!articleId) return errorResponse("Missing articleId", 400);

        const audio = await (prisma as any).audioArticle.findUnique({
            where: { articleId_languageCode: { articleId, languageCode } },
        });

        if (!audio) {
            return successResponse(null, { message: "No audio available" });
        }

        return successResponse(audio);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch TTS data", 500);
    }
}
