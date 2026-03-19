"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("ไม่พบ token สำหรับยืนยันอีเมล");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("ยืนยันอีเมลเรียบร้อยแล้ว! คุณสามารถเข้าสู่ระบบได้แล้ว");
                } else {
                    setStatus("error");
                    setMessage(data?.error?.message || "ลิงก์หมดอายุหรือไม่ถูกต้อง");
                }
            } catch {
                setStatus("error");
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="relative z-10 w-full max-w-md px-6">
            {/* Logo */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#000000] to-[#0d1529] border border-[#cfb659]/30 shadow-2xl shadow-[#cfb659]/10 mb-6">
                    <Shield className="w-10 h-10 text-[#cfb659]" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-sans">
                    RTBPF <span className="text-[#cfb659]">CMS</span>
                </h1>
            </div>

            {/* Status Card */}
            <div className="bg-[#0d1529]/60 backdrop-blur-xl border border-[#000000]/50 rounded-2xl p-8 shadow-2xl text-center">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-16 h-16 text-[#cfb659] animate-spin mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-white mb-2">กำลังยืนยันอีเมล...</h2>
                        <p className="text-gray-400 text-sm font-thai">กรุณารอสักครู่</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-white mb-2">ยืนยันสำเร็จ!</h2>
                        <p className="text-gray-400 text-sm font-thai mb-8">{message}</p>
                        <Link href="/admin/login">
                            <Button className="w-full h-12 bg-gradient-to-r from-[#cfb659] to-[#bda348] text-[#0a0f1e] font-bold uppercase tracking-widest text-xs rounded-lg hover:from-[#d9c26a] hover:to-[#cfb659] transition-all duration-300 shadow-lg shadow-[#cfb659]/20">
                                เข้าสู่ระบบ
                            </Button>
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-white mb-2">ไม่สามารถยืนยันได้</h2>
                        <p className="text-gray-400 text-sm font-thai mb-8">{message}</p>
                        <Link href="/admin/login">
                            <Button variant="outline" className="w-full h-12 border-[#cfb659]/50 text-[#cfb659] hover:bg-[#cfb659]/10 font-bold uppercase tracking-widest text-xs rounded-lg transition-all duration-300">
                                กลับหน้าเข้าสู่ระบบ
                            </Button>
                        </Link>
                    </>
                )}
            </div>

            <p className="text-center text-[10px] text-gray-600 mt-8 font-thai uppercase tracking-widest">
                © 2567 RTBPF — All Rights Reserved
            </p>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0a0a] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cfb659]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#000000]/20 rounded-full blur-3xl" />
            </div>

            <Suspense fallback={
                <div className="relative z-10 text-center">
                    <Loader2 className="w-12 h-12 text-[#cfb659] animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
