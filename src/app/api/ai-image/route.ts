import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin, STORAGE_BUCKET, getPublicUrl } from "@/lib/supabase";
import { requireEditor } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { getGeminiApiKey } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for image generation

// Style presets with optimized prompt prefixes
const STYLE_PROMPTS: Record<string, string> = {
    news: "Photorealistic high-quality editorial news photograph, professional lighting, detailed, sharp focus, suitable for a news website cover image.",
    infographic: "Clean professional infographic layout with modern design, data visualization, clear typography, organized sections, white background.",
    illustration: "Modern editorial illustration, vibrant colors, bold shapes, contemporary art style, professional quality.",
    anime: "Japanese anime style illustration, vibrant colors, detailed character design, dynamic composition, manga-inspired.",
    digital: "High quality digital art, cinematic lighting, dramatic atmosphere, ultra detailed, trending on ArtStation.",
    sketch: "Hand-drawn pencil sketch illustration, detailed line work, artistic crosshatching, elegant, black and white.",
    cinematic: "Cinematic movie scene, dramatic lighting, widescreen composition, film grain, depth of field, photorealistic.",
    minimal: "Minimalist flat design illustration, clean geometric shapes, limited color palette, modern graphic design, vector-like.",
};

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { title, style = "news", aspectRatio = "16:9", customPrompt = "" } = await request.json();

        if (!title?.trim()) {
            return NextResponse.json(
                { success: false, error: { message: "กรุณาใส่หัวข้อบทความ" } },
                { status: 400 }
            );
        }

        // Get API key from DB or env
        const apiKey = await getGeminiApiKey();
        const ai = new GoogleGenAI({ apiKey });

        // Build the prompt
        const stylePrefix = STYLE_PROMPTS[style] || STYLE_PROMPTS.news;
        const fullPrompt = [
            stylePrefix,
            `Subject/Topic: "${title}"`,
            customPrompt ? `Additional instructions: ${customPrompt}` : "",
            "Important: Do NOT include any text, watermarks, or logos in the image. The image should be clean and ready for use as a news article cover.",
        ].filter(Boolean).join("\n");

        // Generate image with Gemini — try models in order of preference
        const IMAGE_MODELS = [
            "gemini-2.5-flash-image",
            "gemini-3.1-flash-image-preview",
            "gemini-3-pro-image-preview",
        ];

        let response: any = null;
        let lastError: any = null;

        for (const model of IMAGE_MODELS) {
            try {
                response = await ai.models.generateContent({
                    model,
                    contents: fullPrompt,
                    config: {
                        responseModalities: ["Text", "Image"],
                    },
                });
                break; // Success, exit loop
            } catch (err: any) {
                lastError = err;
                console.warn(`Model ${model} failed, trying next...`, err.message);
                continue;
            }
        }

        if (!response) {
            throw lastError || new Error("All image generation models failed");
        }

        // Extract image data from response
        let imageData: string | null = null;
        let mimeType = "image/png";

        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageData = part.inlineData.data || null;
                    mimeType = part.inlineData.mimeType || "image/png";
                    break;
                }
            }
        }

        if (!imageData) {
            return NextResponse.json(
                { success: false, error: { message: "AI ไม่สามารถสร้างภาพได้ ลองเปลี่ยน prompt หรือ style แล้วลองใหม่" } },
                { status: 422 }
            );
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, "base64");
        const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const fileName = `ai-${style}-${timestamp}-${random}.${ext}`;
        const filePath = `ai-generated/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Upload AI image error:", error);
            return NextResponse.json(
                { success: false, error: { message: `อัปโหลดภาพไม่สำเร็จ: ${error.message}` } },
                { status: 500 }
            );
        }

        const publicUrl = getPublicUrl(data.path);

        // Save to Media Library
        const userId = authResult.user?.id;
        if (userId) {
            await prisma.media.create({
                data: {
                    url: publicUrl,
                    path: data.path,
                    name: fileName,
                    originalName: `AI Generated (${style}) - ${title.substring(0, 50)}`,
                    type: mimeType,
                    size: buffer.length,
                    folder: "ai-generated",
                    userId,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                url: publicUrl,
                path: data.path,
                fileName,
                size: buffer.length,
                style,
                aspectRatio,
            },
        });
    } catch (error: any) {
        console.error("AI Image Generation error:", error);
        
        // Parse specific error types for better UX messages
        const errMsg = error.message || "";
        const errStatus = error.status || 0;
        
        let userMessage: string;
        if (errStatus === 429 || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
            userMessage = "เกินโควต้าการใช้งาน AI Image — รอสักครู่แล้วลองใหม่ หรืออัปเกรดแผน Google AI Studio";
        } else if (errStatus === 403 || errMsg.includes("PERMISSION_DENIED")) {
            userMessage = "API Key ไม่มีสิทธิ์ใช้ Image Generation — ตรวจสอบ API Key Restrictions ที่ Google AI Studio";
        } else if (errStatus === 404 || errMsg.includes("NOT_FOUND")) {
            userMessage = "โมเดลสร้างภาพไม่พร้อมใช้งาน — ลองอีกครั้งในภายหลัง";
        } else if (errMsg.includes("API_KEY") || errMsg.includes("invalid")) {
            userMessage = "API Key ไม่ถูกต้องหรือหมดอายุ — ตรวจสอบที่ Settings > API Keys";
        } else {
            userMessage = `เกิดข้อผิดพลาดในการสร้างภาพ: ${errMsg.substring(0, 100)}`;
        }

        return NextResponse.json(
            { success: false, error: { message: userMessage } },
            { status: errStatus === 429 ? 429 : 500 }
        );
    }
}
