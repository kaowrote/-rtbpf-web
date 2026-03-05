"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const res = await fetch("/api/auth/admin-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
                    return;
                }

                // Successful login — redirect to admin dashboard
                router.push("/admin");
                router.refresh();
            } catch {
                setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0a0a] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#1B2A4A]/20 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px]"
            />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo & Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#0d1529] border border-[#C9A84C]/30 shadow-2xl shadow-[#C9A84C]/10 mb-6">
                        <Shield className="w-10 h-10 text-[#C9A84C]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight font-sans">
                        RTBPF <span className="text-[#C9A84C]">CMS</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm font-thai">ระบบจัดการเนื้อหาเว็บไซต์สมาพันธ์ฯ</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0d1529]/60 backdrop-blur-xl border border-[#1B2A4A]/50 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest text-center">Admin Login</h2>
                        <div className="w-12 h-0.5 bg-[#C9A84C] mx-auto mt-3" />
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    type="email"
                                    placeholder="admin@rtbpf.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isPending}
                                    className="h-12 pl-11 bg-[#0a0f1e] border-[#1B2A4A] text-white placeholder-gray-600 rounded-lg focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isPending}
                                    className="h-12 pl-11 pr-12 bg-[#0a0f1e] border-[#1B2A4A] text-white placeholder-gray-600 rounded-lg focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 bg-gradient-to-r from-[#C9A84C] to-[#B8973B] text-[#0a0f1e] font-bold uppercase tracking-widest text-xs rounded-lg hover:from-[#D4B45A] hover:to-[#C9A84C] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Shield className="w-4 h-4 mr-2" />
                            )}
                            {isPending ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Demo credentials hint */}
                    <div className="mt-6 pt-6 border-t border-[#1B2A4A]/50">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center mb-3">Demo Credentials</p>
                        <div className="bg-[#0a0f1e] rounded-lg p-3 text-xs text-gray-400 font-mono space-y-1">
                            <p>Email: <span className="text-[#C9A84C]">admin@rtbpf.org</span></p>
                            <p>Pass:  <span className="text-[#C9A84C]">admin123</span></p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-gray-600 mt-8 font-thai uppercase tracking-widest">
                    © 2567 RTBPF — All Rights Reserved
                </p>
            </div>
        </div>
    );
}
