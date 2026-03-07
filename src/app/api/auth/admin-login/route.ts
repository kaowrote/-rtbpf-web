import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "กรุณากรอกอีเมลและรหัสผ่าน" },
                { status: 400 }
            );
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return NextResponse.json(
                        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                        { status: 401 }
                    );
                default:
                    return NextResponse.json(
                        { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
                        { status: 500 }
                    );
            }
        }

        // NextAuth v5 throws a NEXT_REDIRECT error for successful signIn with redirect:false
        // We treat this as success
        return NextResponse.json({ success: true });
    }
}
