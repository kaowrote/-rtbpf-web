"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Token ไม่ถูกต้องหรือไม่พบ Token");
            return;
        }

        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (password.length < 8) {
            setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/auth/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                    return;
                }

                setIsSubmitted(true);
                // Success — redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/admin/login");
                }, 3000);
            } catch {
                setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
            }
        });
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                 <h2 className="text-white text-xl font-bold font-thai uppercase tracking-wider">Invalid Link</h2>
                 <p className="text-gray-400 font-thai text-sm">ลิงก์นี้ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์กู้คืนรหัสผ่านใหม่อีกครั้ง</p>
                 <Button onClick={() => router.push("/admin/forgot-password")} className="w-full mt-4 bg-transparent border-[#1B2A4A] text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold font-sans">
                     Request New Link
                 </Button>
            </div>
        );
    }

    return (
        <div className="bg-[#0d1529]/60 backdrop-blur-xl border border-[#1B2A4A]/50 rounded-2xl p-8 shadow-2xl">
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <h2 className="text-lg font-bold text-white uppercase tracking-[0.2em] text-center font-sans mb-8">Set New Password</h2>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isPending}
                                className="h-12 pl-11 pr-12 bg-[#0a0f1e] border-[#1B2A4A] text-white placeholder-gray-600 rounded-lg focus-visible:ring-[#C9A84C]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isPending}
                                className="h-12 pl-11 bg-[#0a0f1e] border-[#1B2A4A] text-white placeholder-gray-600 rounded-lg focus-visible:ring-[#C9A84C]"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 bg-gradient-to-r from-[#C9A84C] to-[#B8973B] text-[#0a0f1e] font-bold uppercase tracking-widest text-xs rounded-lg hover:from-[#D4B45A] hover:to-[#C9A84C] transition-all"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "รีเซ็ตรหัสผ่านใหม่"}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-6 py-4 font-thai">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white">รีเซ็ตรหัสผ่านสำเร็จ!</h3>
                    <p className="text-gray-400 text-sm">
                        คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันทีครับ ระบบกำลังนำท่านไปยังหน้า Login...
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0a0a] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#1B2A4A]/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="text-center mb-10 font-sans">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#0d1529] border border-[#C9A84C]/30 shadow-2xl mb-6">
                        <Shield className="w-10 h-10 text-[#C9A84C]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">
                        RESET <span className="text-[#C9A84C]">PASSWORD</span>
                    </h1>
                </div>

                <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <p className="text-center text-[10px] text-gray-600 mt-8 font-thai uppercase tracking-widest">
                    © 2567 RTBPF — All Rights Reserved
                </p>
            </div>
        </div>
    );
}
