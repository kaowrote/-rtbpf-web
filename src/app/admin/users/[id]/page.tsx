"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Shield,
    Mail,
    Phone,
    Calendar,
    Clock,
    Globe,
    Save,
    UserX,
    UserCheck,
    FileText,
    CalendarIcon,
    Trophy,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ROLES = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "EDITOR", label: "Editor" },
    { value: "AUTHOR", label: "Author" },
    { value: "TRANSLATOR", label: "Translator" },
    { value: "JURY", label: "Jury" },
    { value: "MEMBER", label: "Member" },
];

// Mock user (would be fetched from API)
const user = {
    id: "usr_003",
    name: "สุภาพร แก้วมณี",
    email: "supaporn@rtbpf.org",
    phone: "083-456-7890",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    role: "EDITOR",
    status: "ACTIVE",
    bio: "บรรณาธิการข่าวโทรทัศน์ประสบการณ์กว่า 15 ปี ปัจจุบันดูแลเนื้อหาข่าวสารและบทความของ RTBPF",
    preferredLocale: "th",
    createdAt: "20 มีนาคม 2566",
    lastLogin: "วันนี้ 08:42",
};

const activityLogs = [
    { action: "เผยแพร่บทความ", entity: "การเสวนาผู้ทรงคุณวุฒิอุตสาหกรรมโทรทัศน์ไทย", date: "4 มีนาคม 2567 09:15", icon: FileText },
    { action: "สร้าง Draft ใหม่", entity: "สรุปผลรางวัลนาฏราช ครั้งที่ 16", date: "3 มีนาคม 2567 16:30", icon: FileText },
    { action: "แก้ไขกิจกรรม", entity: "สัมมนาทิศทางอุตสาหกรรมโทรทัศน์ไทย 2024", date: "1 มีนาคม 2567 14:20", icon: CalendarIcon },
    { action: "เพิ่มรายชื่อผู้เข้าชิง", entity: "มาตาลดา — ละครโทรทัศน์ยอดเยี่ยม 2024", date: "28 กุมภาพันธ์ 2567 11:00", icon: Trophy },
    { action: "เข้าสู่ระบบ", entity: "IP: 203.xxx.xxx.xxx", date: "28 กุมภาพันธ์ 2567 09:00", icon: Activity },
];

export default function AdminUserDetailPage() {
    const [role, setRole] = useState(user.role);

    const getRoleColor = (r: string) => {
        const colors: Record<string, string> = {
            SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            EDITOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            AUTHOR: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
            JURY: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            MEMBER: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400",
        };
        return colors[r] || colors.MEMBER;
    };

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="pb-6 border-b border-gray-200 dark:border-zinc-800">
                <Link href="/admin/users" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
                </Link>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800 ring-4 ring-offset-2 ring-offset-white dark:ring-offset-[#050505] ring-[#C9A84C]/30">
                            <Image src={user.image} alt={user.name} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-thai text-black dark:text-white">{user.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge className={`rounded-none text-[10px] uppercase tracking-widest font-bold ${getRoleColor(user.role)}`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {ROLES.find(r => r.value === user.role)?.label}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-none text-[10px] uppercase tracking-widest font-bold">
                                    ● Active
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-none text-xs uppercase tracking-widest font-bold border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 bg-transparent">
                            <UserX className="w-4 h-4 mr-2" /> Suspend
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column — Profile Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Details */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Profile Information</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ชื่อ-นามสกุล</label>
                                    <Input defaultValue={user.name} className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
                                    <Input defaultValue={user.email} className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">เบอร์โทรศัพท์</label>
                                    <Input defaultValue={user.phone} className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ภาษา</label>
                                    <select title="Language" className="w-full h-12 px-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white">
                                        <option value="th">ภาษาไทย</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ประวัติย่อ (Bio)</label>
                                <textarea
                                    title="Bio"
                                    defaultValue={user.bio}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 font-thai text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none text-black dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12 transition-colors">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Role & Permissions */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#C9A84C]" /> Role & Permissions
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Current Role</label>
                                <select
                                    title="Role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Capabilities preview */}
                            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Capabilities</p>
                                <div className="flex flex-wrap gap-2">
                                    {role === "SUPER_ADMIN" && ["Full Access", "Manage Users", "System Settings", "Content CMS", "Awards DB"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {role === "ADMIN" && ["Manage Users", "Content CMS", "Awards DB", "Events"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {role === "EDITOR" && ["Create Articles", "Publish Articles", "Edit Events", "Edit Awards"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {role === "AUTHOR" && ["Create Articles", "Edit Own Articles"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {role === "JURY" && ["View Awards", "Submit Scores"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {(role === "MEMBER" || role === "TRANSLATOR") && ["View Public Content", "Profile Settings"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12 transition-colors">
                                    <Save className="w-4 h-4 mr-2" /> Update Role
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column — Meta & Activity Log */}
                <div className="space-y-8">
                    {/* Quick Info */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Account Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400 truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">สมัครเมื่อ {user.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">เข้าสู่ระบบล่าสุด: {user.lastLogin}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">ภาษาไทย (th)</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Activity Log</h3>
                        <div className="space-y-0">
                            {activityLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 py-3 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                                    <div className="mt-0.5 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-md shrink-0">
                                        <log.icon className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-black dark:text-white">{log.action}</p>
                                        <p className="text-xs text-gray-500 font-thai line-clamp-1">{log.entity}</p>
                                        <p className="text-[10px] text-gray-400 font-thai mt-1">{log.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-red-200 dark:border-red-900/30 shadow-sm rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full rounded-none text-xs uppercase tracking-widest font-bold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent justify-start">
                                <UserX className="w-4 h-4 mr-2" /> Suspend Account
                            </Button>
                            <Button variant="outline" className="w-full rounded-none text-xs uppercase tracking-widest font-bold border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-950/30 bg-transparent justify-start">
                                <UserX className="w-4 h-4 mr-2" /> Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
