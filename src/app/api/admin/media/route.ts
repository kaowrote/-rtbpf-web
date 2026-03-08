import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/media
 * Fetch media items with pagination, search, and category filtering
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const folder = searchParams.get("folder") || "all";
        const type = searchParams.get("type") || "all";
        const limit = parseInt(searchParams.get("limit") || "24");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        
        if (search) {
            where.OR = [
                { originalName: { contains: search, mode: "insensitive" } },
                { name: { contains: search, mode: "insensitive" } },
            ];
        }

        if (folder !== "all") {
            where.folder = folder;
        }

        if (type !== "all") {
            if (type === "image") {
                where.type = { startsWith: "image/" };
            } else if (type === "video") {
                where.type = { startsWith: "video/" };
            } else {
                where.type = type;
            }
        }

        const [media, total] = await Promise.all([
            prisma.media.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.media.count({ where }),
        ]);

        return successResponse(media, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        console.error("Media fetch error:", error);
        return errorResponse(error.message || "Failed to fetch media library", 500);
    }
}
