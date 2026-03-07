import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");

        const articles = await prisma.article.findMany({
            where: {
                ...(status ? { status: status as any } : {}),
            },
            include: {
                category: true,
                author: {
                    select: { name: true, image: true }
                },
                publisher: {
                    select: { name: true, image: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit
        });

        return successResponse(articles);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch articles", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();

        // Basic validation
        if (!data.title || !data.slug) {
            return errorResponse("Title and slug are required", 400);
        }

        const newArticle = await prisma.article.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content || [],
                featuredImage: data.featuredImage,
                status: data.status || "DRAFT",
                authorId: data.authorId || authResult.user.id,
                publisherId: data.status === "PUBLISHED" ? (data.publisherId || authResult.user.id) : null,
                categoryId: data.categoryId,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
                publishedAt: data.status === "PUBLISHED" ? new Date() : null,
            }
        });

        return successResponse(newArticle, { message: "Article created successfully" }, 201);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to create article", 500);
    }
}
