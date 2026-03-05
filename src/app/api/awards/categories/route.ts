import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

// GET /api/awards/categories — List all award categories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // TELEVISION, RADIO, DIGITAL, SPECIAL

        const categories = await prisma.awardCategory.findMany({
            where: {
                ...(type ? { type: type as any } : {}),
            },
            orderBy: { order: "asc" },
        });

        return successResponse(categories);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch award categories", 500);
    }
}

// POST /api/awards/categories — Create a new category
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.name) {
            return errorResponse("Category name is required", 400);
        }

        const newCategory = await prisma.awardCategory.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type || "TELEVISION",
                order: data.order || 0,
            },
        });

        return successResponse(newCategory, { message: "Award category created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create award category", 500);
    }
}
