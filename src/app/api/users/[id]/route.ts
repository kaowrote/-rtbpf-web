import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

// GET /api/users/[id] — Get user detail
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                status: true,
                phone: true,
                bio: true,
                preferredLocale: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        activityLogs: true,
                    }
                }
            },
        });

        if (!user) return errorResponse("User not found", 404);
        return successResponse(user);
    } catch (error: any) {
        return errorResponse(error.message || "Failed to fetch user", 500);
    }
}

// PUT /api/users/[id] — Update user
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;
        const data = await request.json();

        const updated = await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                phone: data.phone,
                bio: data.bio,
                preferredLocale: data.preferredLocale,
                image: data.image,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });

        return successResponse(updated, { message: "User updated successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update user", 500);
    }
}

// DELETE /api/users/[id] — Soft delete user (set status to DELETED)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;

        // Soft delete — set status to DELETED instead of hard delete
        await prisma.user.update({
            where: { id },
            data: { status: "DELETED" },
        });

        return successResponse(null, { message: "User deleted successfully" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to delete user", 500);
    }
}
