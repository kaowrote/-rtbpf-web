import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/logger";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return errorResponse("คุณไม่มีสิทธิ์เข้าถึง", 401);
        }

        const userId = session.user.id;
        const { name, currentPassword, newPassword } = await request.json();

        // 1. Fetch current user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return errorResponse("ไม่พบข้อมูลผู้ใช้งาน", 404);
        }

        const dataToUpdate: any = {};

        // Update name if changed
        if (name && name !== user.name) {
            dataToUpdate.name = name;
        }

        // Handle password change
        if (newPassword) {
            // Verify current password first
            if (!currentPassword) {
                return errorResponse("กรุณากรอกรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่านใหม่", 400);
            }

            if (!user.hashedPassword) {
                 // Should not happen for normal users, but handle anyway
                 return errorResponse("บัญชีนี้ไม่มีรหัสผ่านเดิม กรุณาติดต่อผู้ดูแลระบบ", 400);
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
            if (!isPasswordValid) {
                return errorResponse("รหัสผ่านปัจจุบันไม่ถูกต้อง", 400);
            }

            // Hash new password
            dataToUpdate.hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        // 2. Perform Update
        await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        await logActivity("UPDATE_PROFILE", "USER", userId);

        return successResponse(null, { message: "อัปเดตข้อมูลสำเร็จ" });
    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการอัปเดตข้อมูล", 500);
    }
}
