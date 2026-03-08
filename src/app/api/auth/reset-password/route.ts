import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return errorResponse("กรุณากรอกข้อมูลให้ครบถ้วน", 400);
        }

        // 1. Verify Token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token: token,
                expires: { gt: new Date() }
            }
        });

        if (!verificationToken) {
            return errorResponse("ลิงก์หมดอายุหรือไม่ถูกต้อง", 400);
        }

        // 2. Hash New Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update User
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { hashedPassword: hashedPassword }
        });

        // 4. Delete Token after use
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: token
                }
            }
        });

        return successResponse(null, { message: "รีเซ็ตรหัสผ่านใหม่สำเร็จแล้ว" });
    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน", 500);
    }
}
