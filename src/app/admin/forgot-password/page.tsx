"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Shield, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const res = await fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
                    return;
                }

                setIsSubmitted(true);
            } catch {
                setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณลาลองใหม่");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0a0a] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#1B2A4A]/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#0d1529] border border-[#C9A84C]/30 shadow-2xl mb-6">
                        <Shield className="w-10 h-10 text-[#C9A84C]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight font-sans">
                        FORGOT <span className="text-[#C9A84C]">PASSWORD</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm font-thai">กรอกอีเมลเพื่อกู้คืนรหัสผ่านของคุณ</p>
                </div>

                <div className="bg-[#0d1529]/60 backdrop-blur-xl border border-[#1B2A4A]/50 rounded-2xl p-8 shadow-2xl">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isPending}
                                        className="h-12 pl-11 bg-[#0a0f1e] border-[#1B2A4A] text-white placeholder-gray-600 rounded-lg focus-visible:ring-[#C9A84C]"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-gradient-to-r from-[#C9A84C] to-[#B8973B] text-[#0a0f1e] font-bold uppercase tracking-widest text-xs rounded-lg hover:from-[#D4B45A] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "ส่งลิงก์กู้คืนรหัสผ่าน"}
                            </Button>

                            <Link href="/admin/login" className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-bold">
                                <ArrowLeft className="w-3 h-3" /> Back to Login
                            </Link>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white font-thai">ส่งอีเมลเรียบร้อยแล้ว</h3>
                            <p className="text-gray-400 text-sm font-thai leading-relaxed">
                                เราได้ส่งลิงก์สำหรับกู้คืนรหัสผ่านไปยัง <strong>{email}</strong> แล้ว กรุณาตรวจสอบใน Inbox ของคุณ (รวมถึงใน Junk/Spam)
                            </p>
                            <Link href="/admin/login" className="block mt-6">
                                <Button variant="outline" className="w-full h-12 border-[#1B2A4A] text-gray-400 hover:text-white hover:bg-[#1B2A4A]/50 rounded-lg uppercase tracking-widest text-xs font-bold transition-all">
                                    กลับไปหน้าเข้าสู่ระบบ
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-[10px] text-gray-600 mt-8 font-thai uppercase tracking-widest">
                    © 2567 RTBPF — All Rights Reserved
                </p>
            </div>
        </div>
    );
}
