import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, STORAGE_BUCKET, getPublicUrl } from "@/lib/supabase";
import { requireEditor } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for image generation

const KIE_API_BASE = "https://api.kie.ai";

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

// Helper: Get kie.ai API key from DB or env
async function getKieApiKey(): Promise<string> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "apiKeyKieAI" },
        });
        if (setting?.value) return setting.value;
    } catch { /* ignore */ }
    
    // Fallback to env
    if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY;
    throw new Error("NO_KIE_API_KEY");
}

// Helper: Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Poll kie.ai task until success/failure
async function pollTask(taskId: string, apiKey: string, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
        const res = await fetch(`${KIE_API_BASE}/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        const json = await res.json();
        
        if (json.code !== 200) {
            throw new Error(`Poll error: ${json.msg || "Unknown error"}`);
        }
        
        const state = json.data?.state;
        if (state === "success") return json.data;
        if (state === "fail") {
            throw new Error(json.data?.failMsg || "Image generation failed");
        }
        
        // waiting / queuing / generating — wait and retry
        await sleep(2000); // 2 second intervals
    }
    throw new Error("TIMEOUT");
}

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

        // Get kie.ai API key
        let apiKey: string;
        try {
            apiKey = await getKieApiKey();
        } catch {
            return NextResponse.json(
                { success: false, error: { message: "กรุณาใส่ Kie.ai API Key ที่ Settings > API Keys" } },
                { status: 400 }
            );
        }

        // Build the prompt
        const stylePrefix = STYLE_PROMPTS[style] || STYLE_PROMPTS.news;
        const fullPrompt = [
            stylePrefix,
            `Subject/Topic: "${title}"`,
            customPrompt ? `Additional instructions: ${customPrompt}` : "",
            "Important: Do NOT include any text, watermarks, or logos in the image. The image should be clean and ready for use as a news article cover.",
        ].filter(Boolean).join("\n");

        // Map aspect ratio — kie.ai supports these directly
        const kieAspectRatio = aspectRatio || "16:9";

        // Create task via kie.ai Market API (Nano Banana 2)
        const createRes = await fetch(`${KIE_API_BASE}/api/v1/jobs/createTask`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "nano-banana-2",
                input: {
                    prompt: fullPrompt,
                    aspect_ratio: kieAspectRatio,
                    resolution: "2K",
                    output_format: "jpg",
                },
            }),
        });

        const createJson = await createRes.json();

        if (createJson.code !== 200 || !createJson.data?.taskId) {
            console.error("Kie.ai create task error:", createJson);
            
            // Handle specific error codes
            if (createJson.code === 401) {
                return NextResponse.json(
                    { success: false, error: { message: "Kie.ai API Key ไม่ถูกต้อง — ตรวจสอบที่ Settings > API Keys" } },
                    { status: 401 }
                );
            }
            if (createJson.code === 402) {
                return NextResponse.json(
                    { success: false, error: { message: "Kie.ai เครดิตไม่เพียงพอ — เติมเครดิตที่ kie.ai" } },
                    { status: 402 }
                );
            }
            if (createJson.code === 429) {
                return NextResponse.json(
                    { success: false, error: { message: "เกินอัตราการใช้งาน — รอสักครู่แล้วลองใหม่" } },
                    { status: 429 }
                );
            }
            
            return NextResponse.json(
                { success: false, error: { message: `Kie.ai error: ${createJson.msg || "Unknown error"}` } },
                { status: 500 }
            );
        }

        const taskId = createJson.data.taskId;
        console.log(`Kie.ai task created: ${taskId}, polling for result...`);

        // Poll until task completes
        let taskResult: any;
        try {
            taskResult = await pollTask(taskId, apiKey);
        } catch (pollErr: any) {
            if (pollErr.message === "TIMEOUT") {
                return NextResponse.json(
                    { success: false, error: { message: "สร้างภาพใช้เวลานาน — ลองอีกครั้ง" } },
                    { status: 504 }
                );
            }
            return NextResponse.json(
                { success: false, error: { message: `เกิดข้อผิดพลาด: ${pollErr.message}` } },
                { status: 500 }
            );
        }

        // Extract result URLs from task result
        let resultUrls: string[] = [];
        if (taskResult.resultJson) {
            try {
                const parsed = typeof taskResult.resultJson === "string" 
                    ? JSON.parse(taskResult.resultJson) 
                    : taskResult.resultJson;
                resultUrls = parsed.resultUrls || parsed.result_urls || [];
            } catch {
                console.error("Failed to parse resultJson:", taskResult.resultJson);
            }
        }

        if (!resultUrls.length) {
            return NextResponse.json(
                { success: false, error: { message: "AI ไม่สามารถสร้างภาพได้ ลองเปลี่ยน prompt หรือ style แล้วลองใหม่" } },
                { status: 422 }
            );
        }

        // Download the first result image
        const imageUrl = resultUrls[0];
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            return NextResponse.json(
                { success: false, error: { message: "ดาวน์โหลดภาพจาก AI ไม่สำเร็จ" } },
                { status: 500 }
            );
        }

        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        const contentType = imageRes.headers.get("content-type") || "image/jpeg";
        const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const fileName = `ai-${style}-${timestamp}-${random}.${ext}`;
        const filePath = `ai-generated/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, imageBuffer, {
                contentType,
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
                    type: contentType,
                    size: imageBuffer.length,
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
                size: imageBuffer.length,
                style,
                aspectRatio,
                model: "nano-banana-2",
                taskId,
            },
        });
    } catch (error: any) {
        console.error("AI Image Generation error:", error);
        
        const errMsg = error.message || "";
        let userMessage: string;
        
        if (errMsg.includes("NO_KIE_API_KEY")) {
            userMessage = "กรุณาใส่ Kie.ai API Key ที่ Settings > API Keys";
        } else if (errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
            userMessage = "เกินโควต้า — รอสักครู่แล้วลองใหม่";
        } else {
            userMessage = `เกิดข้อผิดพลาดในการสร้างภาพ: ${errMsg.substring(0, 100)}`;
        }

        return NextResponse.json(
            { success: false, error: { message: userMessage } },
            { status: 500 }
        );
    }
}
