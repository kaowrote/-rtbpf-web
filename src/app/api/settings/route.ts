import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

// GET /api/settings — Retrieve all or specific settings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keys = searchParams.get("keys");

        const whereClause = keys ? { key: { in: keys.split(",") } } : {};

        const settings = await prisma.systemSetting.findMany({
            where: whereClause
        });

        // Convert array of {key, value} to an object map
        const settingsMap = settings.reduce((acc: Record<string, string | null>, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        return successResponse(settingsMap);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch settings", 500);
    }
}

// POST /api/settings — Update multiple settings
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data: Record<string, string | null> = await request.json();

        if (!data || typeof data !== "object") {
            return errorResponse("Invalid settings payload", 400);
        }

        // Upsert each setting
        const promises = Object.entries(data).map(([key, value]) => {
            return prisma.systemSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });

        await Promise.all(promises);

        return successResponse({ success: true }, { message: "Settings updated successfully" }, 200);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to save settings", 500);
    }
}
