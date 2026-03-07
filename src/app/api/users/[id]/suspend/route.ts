import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
// POST /api/users/[id]/suspend — Suspend a user
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return errorResponse("User not found", 404);

        // Prevent suspending super admins
        if (user.role === "SUPER_ADMIN") {
            return errorResponse("Cannot suspend a Super Admin", 400);
        }

        const newStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

        const updated = await prisma.user.update({
            where: { id },
            data: { status: newStatus },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        const action = newStatus === "SUSPENDED" ? "suspended" : "reactivated";
        return successResponse(updated, { message: `User ${action} successfully` });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update user status", 500);
    }
}
