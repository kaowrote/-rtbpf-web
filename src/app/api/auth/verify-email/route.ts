import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return errorResponse("Token is required", 400);
        }

        // 1. Find valid token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token: token,
                expires: { gt: new Date() }
            }
        });

        if (!verificationToken) {
            return errorResponse("ลิงก์หมดอายุหรือไม่ถูกต้อง", 400);
        }

        // 2. Update user's emailVerified
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() }
        });

        // 3. Delete used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: token
                }
            }
        });

        return successResponse(null, { message: "ยืนยันอีเมลเรียบร้อยแล้ว" });
    } catch (error: any) {
        console.error("Verify Email Error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการยืนยันอีเมล", 500);
    }
}
