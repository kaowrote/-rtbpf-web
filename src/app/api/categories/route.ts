import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

// GET /api/categories — List all categories (public)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { articles: true }
                }
            },
            orderBy: { name: "asc" },
        });

        return successResponse(categories);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch categories", 500);
    }
}

// POST /api/categories — Create a new category
export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        if (!data.name || !data.slug) {
            return errorResponse("Name and slug are required", 400);
        }

        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
            },
        });

        return successResponse(newCategory, { message: "Category created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create category", 500);
    }
}
