"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Mail, Lock, Shield, Save, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        // Fetch current user data from session
        fetch("/api/auth/session")
            .then(res => res.json())
            .then(data => {
                if (data?.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || "",
                        email: data.user.email || "",
                        role: data.user.role || ""
                    }));
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to load profile");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation for password change
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
                return;
            }
            if (formData.newPassword.length < 8) {
                toast.error("รหัสผ่านใหม่ควรมีความยาวอย่างน้อย 8 ตัวอักษร");
                return;
            }
            if (!formData.currentPassword) {
                toast.error("กรุณากรอกรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่านใหม่");
                return;
            }
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/users/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.error || "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
                    return;
                }

                toast.success("อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว");
                // Clear password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
            } catch (error) {
                toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C]" />
                <p className="mt-4 font-thai text-sm text-gray-500 uppercase tracking-widest font-bold font-sans">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="pb-6 border-b border-gray-200 dark:border-zinc-800">
                <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">Your Profile</h1>
                <p className="text-gray-500 mt-2 font-thai uppercase tracking-widest text-xs font-bold">จัดการข้อมูลส่วนตัวและเปลี่ยนรหัสผ่าน</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 text-center shadow-sm">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#1B2A4A] to-[#0d1529] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#C9A84C]/20 text-4xl font-bold text-[#C9A84C]">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : formData.email.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-black dark:text-white">{formData.name || "User"}</h2>
                        <p className="text-sm text-gray-500 font-thai mt-1">{formData.email}</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20">
                            <Shield className="w-3 h-3" />
                            {formData.role}
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                             <CheckCircle2 className="w-4 h-4" />
                             <h3 className="text-xs font-bold uppercase tracking-widest">Security Tips</h3>
                        </div>
                        <ul className="text-xs text-blue-600 dark:text-blue-500 space-y-2 font-thai">
                             <li>• รหัสผ่านควรมีอย่างน้อย 8 ตัวอักษร</li>
                             <li>• หลีกเลี่ยงการใช้รหัสผ่านเดียวกับเว็บอื่น</li>
                             <li>• เปลี่ยนรหัสผ่านทุกๆ 3-6 เดือน</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-lg focus-visible:ring-[#C9A84C]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email Address (Read-only)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            value={formData.email}
                                            disabled
                                            className="h-12 pl-11 bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Password Change */}
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Security & Password
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Current Password</label>
                                    <div className="relative max-w-md">
                                        <Input 
                                            type={showPassword ? "text" : "password"}
                                            placeholder="รหัสผ่านปัจจุบัน"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                            className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-lg focus-visible:ring-[#C9A84C]"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">New Password</label>
                                        <Input 
                                            type="password"
                                            placeholder="รหัสผ่านใหม่"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                            className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-lg focus-visible:ring-[#C9A84C]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Confirm New Password</label>
                                        <Input 
                                            type="password"
                                            placeholder="ยืนยันรหัสผ่านใหม่"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-lg focus-visible:ring-[#C9A84C]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-14 px-10 bg-[#1B2A4A] hover:bg-[#C9A84C] text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isPending ? "Saving..." : "Update Profile"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
