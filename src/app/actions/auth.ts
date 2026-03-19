"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/mail";

const loginSchema = z.object({
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

const registerSchema = z.object({
    name: z.string().min(1, "กรุณากรอกชื่อ"),
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export async function loginAction(
    prevState: any,
    formData: FormData
) {
    try {
        const rawData = Object.fromEntries(formData);
        const validatedData = loginSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "ข้อมูลไม่ถูกต้อง",
                details: validatedData.error.flatten().fieldErrors
            };
        }

        await signIn("credentials", {
            email: validatedData.data.email,
            password: validatedData.data.password,
            redirectTo: "/profile",
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
                default:
                    return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
            }
        }
        throw error; // Let Next.js handle redirects thrown by signIn
    }
}

export async function registerAction(
    prevState: any,
    formData: FormData
) {
    try {
        const rawData = Object.fromEntries(formData);
        const validatedData = registerSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "ข้อมูลไม่ถูกต้อง",
                details: validatedData.error.flatten().fieldErrors
            };
        }

        const { email, password, name } = validatedData.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "อีเมลนี้มีผู้ใช้งานแล้ว" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (email not verified yet)
        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send verification email
        await sendVerificationEmail(email, token);

        return {
            success: true,
            message: "ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
        };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "ลงทะเบียนสำเร็จแต่เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ" };
        }
        throw error;
    }
}

