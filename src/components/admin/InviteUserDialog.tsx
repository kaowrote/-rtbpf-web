"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Mail, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface InviteUserDialogProps {
    onSuccess?: () => void;
}

const ROLES = [
    { value: "MEMBER", label: "Member (สมาชิกทั่วไป)" },
    { value: "AUTHOR", label: "Author (ผู้เขียนบทความ)" },
    { value: "EDITOR", label: "Editor (บรรณาธิการ)" },
    { value: "ADMIN", label: "Admin (ผู้ดูแลระบบ)" },
    { value: "JURY", label: "Jury (กรรมการ)" },
    { value: "TRANSLATOR", label: "Translator (ผู้แปล)" },
];

export function InviteUserDialog({ onSuccess }: InviteUserDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "MEMBER",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email) {
            toast.error("กรุณากรอกอีเมล");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    status: "ACTIVE", // Automatically active when invited by admin
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("เชิญผู้ใช้งานเรียบร้อยแล้ว");
                setFormData({ name: "", email: "", role: "MEMBER" });
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.error || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] dark:bg-white dark:text-black dark:hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                    <UserPlus className="w-4 h-4 mr-2" /> Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white dark:bg-[#0a0a0a]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 pb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <DialogTitle className="text-xl font-bold font-thai tracking-tight">
                                เชิญผู้ใช้งานใหม่
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-gray-500 font-thai">
                            เพิ่มสมาชิกใหม่เข้าสู่ระบบ และกำหนดสิทธิ์การเข้าถึงทันที
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">Full Name (ชื่อ-นามสกุล)</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    placeholder="ชื่อผู้ใช้งาน..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10 h-11 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 font-thai focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">Email Address (อีเมล)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10 h-11 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 focus-visible:ring-blue-500"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 font-thai mt-1">* รหัสผ่านชั่วคราวคือ rtbpf2024</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans">System Role (บทความ/สิทธิ์)</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-md text-sm font-thai focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                    title="เลือกสิทธิ์การใช้งาน"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end">
                        <div className="flex gap-2">
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-zinc-800"
                            >
                                ยกเลิก
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "เชิญสมาชิก"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
