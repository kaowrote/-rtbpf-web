import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/articles/[id]/comments — fetch comments for an article
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: articleId } = await params;
        const session = await auth();
        const currentUserId = session?.user?.id;

        const comments = await prisma.comment.findMany({
            where: { articleId, parentId: null },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, image: true } },
                likes: currentUserId
                    ? { where: { userId: currentUserId }, select: { id: true } }
                    : false,
                _count: { select: { likes: true } },
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        user: { select: { id: true, name: true, image: true } },
                        likes: currentUserId
                            ? { where: { userId: currentUserId }, select: { id: true } }
                            : false,
                        _count: { select: { likes: true } },
                    },
                },
            },
        });

        // Transform to a cleaner shape
        const transformed = comments.map((c: any) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            user: c.user,
            likeCount: c._count.likes,
            isLiked: currentUserId ? (c.likes?.length ?? 0) > 0 : false,
            replies: c.replies.map((r: any) => ({
                id: r.id,
                content: r.content,
                createdAt: r.createdAt,
                user: r.user,
                likeCount: r._count.likes,
                isLiked: currentUserId ? (r.likes?.length ?? 0) > 0 : false,
            })),
        }));

        return successResponse(transformed);
    } catch (error) {
        console.error("Fetch comments error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการโหลดความคิดเห็น", 500);
    }
}

// POST /api/articles/[id]/comments — create a new comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return errorResponse("กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น", 401);
        }

        const { id: articleId } = await params;
        const { content, parentId } = await request.json();

        if (!content || content.trim().length === 0) {
            return errorResponse("กรุณากรอกความคิดเห็น", 400);
        }

        if (content.length > 2000) {
            return errorResponse("ความคิดเห็นต้องไม่เกิน 2,000 ตัวอักษร", 400);
        }

        // Verify article exists
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });
        if (!article) {
            return errorResponse("ไม่พบบทความ", 404);
        }

        // If replying, verify parent comment exists and belongs to same article
        if (parentId) {
            const parent = await prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parent || parent.articleId !== articleId) {
                return errorResponse("ไม่พบความคิดเห็นที่ต้องการตอบกลับ", 404);
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                articleId,
                userId: session.user.id,
                parentId: parentId || null,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });

        return successResponse(
            {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: comment.user,
                likeCount: 0,
                isLiked: false,
                replies: [],
            },
            undefined,
            201
        );
    } catch (error) {
        console.error("Create comment error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการสร้างความคิดเห็น", 500);
    }
}
