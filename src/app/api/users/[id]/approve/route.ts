import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

// POST /api/users/[id]/approve — Approve a pending user
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return errorResponse("User not found", 404);
        if (user.status !== "PENDING") {
            return errorResponse("User is not in pending status", 400);
        }

        const approved = await prisma.user.update({
            where: { id },
            data: { status: "ACTIVE" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        return successResponse(approved, { message: "User approved successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to approve user", 500);
    }
}
