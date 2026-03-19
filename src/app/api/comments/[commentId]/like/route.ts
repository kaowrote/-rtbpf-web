import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

// POST /api/comments/[commentId]/like — toggle like on a comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return errorResponse("กรุณาเข้าสู่ระบบเพื่อกดถูกใจ", 401);
        }

        const { commentId } = await params;
        const userId = session.user.id;

        // Check if comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            return errorResponse("ไม่พบความคิดเห็น", 404);
        }

        // Toggle like
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: { commentId, userId },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            const count = await prisma.commentLike.count({
                where: { commentId },
            });
            return successResponse({ liked: false, likeCount: count });
        } else {
            // Like
            await prisma.commentLike.create({
                data: { commentId, userId },
            });
            const count = await prisma.commentLike.count({
                where: { commentId },
            });
            return successResponse({ liked: true, likeCount: count });
        }
    } catch (error) {
        console.error("Like comment error:", error);
        return errorResponse("เกิดข้อผิดพลาด", 500);
    }
}
