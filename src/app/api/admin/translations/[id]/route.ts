import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/auth-guard";
import { successResponse, errorResponse } from "@/lib/api-response";

// PATCH /api/admin/translations/[id] — Update a translation (approve, reject, edit)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;
        const body = await request.json();
        const { title, excerpt, content, status } = body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;

        const translation = await (prisma as any).translation.update({
            where: { id },
            data: updateData,
        });

        return successResponse(translation, { message: "Translation updated" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to update translation", 500);
    }
}

// DELETE /api/admin/translations/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireEditor();
        if (!authResult.authorized) return authResult.response;

        const { id } = await params;

        await (prisma as any).translation.delete({ where: { id } });

        return successResponse(null, { message: "Translation deleted" });
    } catch (error: any) {
        return errorResponse(error.message || "Failed to delete translation", 500);
    }
}
