import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireEditor } from "@/lib/auth-guard";
import { logActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const article = await prisma.article.findUnique({
            where: {
                id: resolvedParams.id
            },
            include: {
                category: true,
                author: {
                    select: { name: true, image: true }
                }
            }
        });

        if (!article) return errorResponse("Article not found", 404);
        return successResponse(article);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch article", 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const data = await request.json();
        const resolvedParams = await params;

        const updatedArticle = await prisma.article.update({
            where: {
                id: resolvedParams.id
            },
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                featuredImage: data.featuredImage,
                status: data.status,
                categoryId: data.categoryId,
                tags: data.tags || [],
                viewCount: data.viewCount !== undefined ? parseInt(data.viewCount) : undefined,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : (data.status === 'PUBLISHED' ? null : undefined),
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.status === 'PUBLISHED' ? new Date() : undefined),
            }
        });

        await logActivity("UPDATE_ARTICLE", "ARTICLE", resolvedParams.id, { title: updatedArticle.title });

        return successResponse(updatedArticle, { message: "Article updated successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update article", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const resolvedParams = await params;
        await prisma.article.delete({
            where: {
                id: resolvedParams.id
            }
        });

        await logActivity("DELETE_ARTICLE", "ARTICLE", resolvedParams.id);

        return successResponse(null, { message: "Article deleted successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to delete article", 500);
    }
}
