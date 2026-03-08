import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return errorResponse("กรุณากรอกอีเมล", 400);
        }

        // 1. Find User
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // For security, don't reveal if user exists, just say email sent if valid format
        if (!user) {
            return successResponse(null, { message: "หากอีเมลนี้อยู่ในระบบ เราได้ส่งขั้นตอนการรีเซ็ตรหัสผ่านให้คุณแล้ว" });
        }

        // 2. Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

        // 3. Save to VerificationToken table
        // We use email as identifier
        await prisma.verificationToken.upsert({
            where: {
                identifier_token: {
                    identifier: email,
                    token: token
                }
            },
            update: {
                token: token,
                expires: expires
            },
            create: {
                identifier: email,
                token: token,
                expires: expires
            }
        });

        // 4. Send Email
        await sendPasswordResetEmail(email, token);

        return successResponse(null, { message: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว" });
    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return errorResponse("เกิดข้อผิดพลาดในการดำเนินการ", 500);
    }
}
