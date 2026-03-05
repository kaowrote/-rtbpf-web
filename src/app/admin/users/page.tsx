"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    MoreVertical,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Shield,
    UserPlus,
    ChevronDown,
    Mail,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "TRANSLATOR" | "JURY" | "MEMBER";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DELETED";

interface MockUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLogin: string | null;
}

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
    ADMIN: { label: "Admin", color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
    EDITOR: { label: "Editor", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
    AUTHOR: { label: "Author", color: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800" },
    TRANSLATOR: { label: "Translator", color: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800" },
    JURY: { label: "Jury", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
    MEMBER: { label: "Member", color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700" },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; icon: React.ElementType; color: string }> = {
    ACTIVE: { label: "Active", icon: CheckCircle2, color: "text-green-600 dark:text-green-400" },
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-600 dark:text-amber-400" },
    SUSPENDED: { label: "Suspended", icon: XCircle, color: "text-red-600 dark:text-red-400" },
    DELETED: { label: "Deleted", icon: XCircle, color: "text-gray-400" },
};

const mockUsers: MockUser[] = [
    {
        id: "usr_001",
        name: "รัชดา สมบูรณ์สิน",
        email: "rachada@rtbpf.org",
        phone: "081-234-5678",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        createdAt: "1 มกราคม 2566",
        lastLogin: "วันนี้ 09:15",
    },
    {
        id: "usr_002",
        name: "ธนากร วิทยาภิรักษ์",
        email: "thanakorn@rtbpf.org",
        phone: "082-345-6789",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "15 กุมภาพันธ์ 2566",
        lastLogin: "เมื่อวาน 14:30",
    },
    {
        id: "usr_003",
        name: "สุภาพร แก้วมณี",
        email: "supaporn@rtbpf.org",
        phone: "083-456-7890",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        role: "EDITOR",
        status: "ACTIVE",
        createdAt: "20 มีนาคม 2566",
        lastLogin: "วันนี้ 08:42",
    },
    {
        id: "usr_004",
        name: "ปรีชา เลิศวิทยาการ",
        email: "preecha@channel3.com",
        phone: "084-567-8901",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        role: "JURY",
        status: "ACTIVE",
        createdAt: "5 เมษายน 2566",
        lastLogin: "3 วันที่แล้ว",
    },
    {
        id: "usr_005",
        name: "อัญชลี ประเสริฐศักดิ์",
        email: "anchalee@one31.net",
        phone: null,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        role: "AUTHOR",
        status: "ACTIVE",
        createdAt: "12 พฤษภาคม 2566",
        lastLogin: "5 วันที่แล้ว",
    },
    // Pending Users
    {
        id: "usr_006",
        name: "วิชัย ศรีสุวรรณ",
        email: "wichai.s@gmail.com",
        phone: "085-678-9012",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        role: "MEMBER",
        status: "PENDING",
        createdAt: "28 กุมภาพันธ์ 2567",
        lastLogin: null,
    },
    {
        id: "usr_007",
        name: "ณัฐนันท์ กิตติพัฒน์",
        email: "nattanan.k@hotmail.com",
        phone: "086-789-0123",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        role: "MEMBER",
        status: "PENDING",
        createdAt: "1 มีนาคม 2567",
        lastLogin: null,
    },
    {
        id: "usr_008",
        name: "สมชาย เจริญทรัพย์",
        email: "somchai.j@thaimail.com",
        phone: null,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        role: "MEMBER",
        status: "PENDING",
        createdAt: "2 มีนาคม 2567",
        lastLogin: null,
    },
    // Suspended
    {
        id: "usr_009",
        name: "พิพัฒน์ ธรรมชาติ",
        email: "pipat.t@yahoo.com",
        phone: "087-890-1234",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&auto=format&fit=crop",
        role: "MEMBER",
        status: "SUSPENDED",
        createdAt: "10 มิถุนายน 2566",
        lastLogin: "1 เดือนที่แล้ว",
    },
];

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState<string>("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const pendingUsers = mockUsers.filter((u) => u.status === "PENDING");

    const filteredUsers = mockUsers.filter((user) => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = filterRole === "ALL" || user.role === filterRole;
        const matchStatus = filterStatus === "ALL" || user.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const statCounts = {
        total: mockUsers.length,
        active: mockUsers.filter((u) => u.status === "ACTIVE").length,
        pending: mockUsers.filter((u) => u.status === "PENDING").length,
        suspended: mockUsers.filter((u) => u.status === "SUSPENDED").length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-zinc-800">
                <div>
                    <Link href="/admin" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">User Management</h1>
                    <p className="text-gray-500 mt-2 font-thai">จัดการสมาชิก อนุมัติผู้สมัครใหม่ และกำหนดสิทธิ์การใช้งาน</p>
                </div>
                <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                    <UserPlus className="w-4 h-4 mr-2" /> Invite User
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", count: statCounts.total, color: "text-black dark:text-white" },
                    { label: "Active", count: statCounts.active, color: "text-green-600 dark:text-green-400" },
                    { label: "Pending Approval", count: statCounts.pending, color: "text-amber-600 dark:text-amber-400" },
                    { label: "Suspended", count: statCounts.suspended, color: "text-red-600 dark:text-red-400" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-[#0a0a0a] p-5 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold font-sans ${stat.color}`}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Pending Approval Banner */}
            {pendingUsers.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm uppercase tracking-widest">
                                    รอการอนุมัติ — {pendingUsers.length} คน
                                </h3>
                                <p className="text-xs text-amber-600 dark:text-amber-500 font-thai mt-0.5">
                                    กรุณาตรวจสอบและอนุมัติสมาชิกใหม่ด้านล่าง
                                </p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-none text-xs uppercase tracking-widest font-bold">
                            Approve All
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 bg-white dark:bg-[#0a0a0a] p-4 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800 shrink-0">
                                    <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-thai font-semibold text-sm text-black dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <button className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="อนุมัติ">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="ปฏิเสธ">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="ค้นหาชื่อหรืออีเมล..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-11 bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-zinc-700 rounded-lg font-thai focus-visible:ring-[#C9A84C]"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            title="Filter by Role"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="h-12 px-4 pr-10 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white"
                        >
                            <option value="ALL">All Roles</option>
                            {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            title="Filter by Status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-12 px-4 pr-10 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {filteredUsers.map((user) => {
                                const roleConf = ROLE_CONFIG[user.role];
                                const statusConf = STATUS_CONFIG[user.status];
                                const StatusIcon = statusConf.icon;

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800 shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a] ring-gray-200 dark:ring-zinc-700">
                                                    <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover w-full h-full" />
                                                </div>
                                                <div>
                                                    <p className="font-thai font-semibold text-black dark:text-white line-clamp-1">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`font-bold text-[10px] tracking-wider uppercase rounded-none border ${roleConf.color}`}>
                                                {roleConf.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider ${statusConf.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {statusConf.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate max-w-[160px]">{user.email}</span>
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-thai text-sm text-gray-500">
                                            {user.createdAt}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-thai">
                                            {user.lastLogin || (
                                                <span className="text-amber-500 text-xs uppercase font-bold tracking-wider">Never</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {user.status === "PENDING" && (
                                                    <button className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="อนุมัติ">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black dark:hover:text-white">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center text-gray-500 text-sm font-thai">
                    <span>แสดง {filteredUsers.length} จากทั้งหมด {mockUsers.length} รายการ</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-none text-xs uppercase tracking-widest font-bold border-gray-200 dark:border-zinc-700 bg-transparent" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-none text-xs uppercase tracking-widest font-bold border-gray-200 dark:border-zinc-700 bg-transparent" disabled>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
