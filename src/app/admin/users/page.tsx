"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    MoreVertical,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    Mail,
    Phone,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import { toast } from "sonner";

dayjs.locale('th');

type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "TRANSLATOR" | "JURY" | "MEMBER";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DELETED";

interface User {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState<string>("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [isActionPending, setIsActionPending] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/users?limit=200");
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("ไม่สามารถดึงข้อมูลสมาชิกได้");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
        setIsActionPending(userId);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(newStatus === "ACTIVE" ? "อนุมัติสมาชิกเรียบร้อยแล้ว" : "อัปเดตสถานะสำเร็จ");
                fetchUsers();
            } else {
                toast.error(data.error || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsActionPending(null);
        }
    };

    const pendingUsers = users.filter((u) => u.status === "PENDING");

    const filteredUsers = users.filter((user) => {
        const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSearch = nameMatch || emailMatch;
        const matchRole = filterRole === "ALL" || user.role === filterRole;
        const matchStatus = filterStatus === "ALL" || user.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const statCounts = {
        total: users.length,
        active: users.filter((u) => u.status === "ACTIVE").length,
        pending: users.filter((u) => u.status === "PENDING").length,
        suspended: users.filter((u) => u.status === "SUSPENDED").length,
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
                <InviteUserDialog onSuccess={fetchUsers} />
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
                        <p className={`text-3xl font-bold font-sans ${stat.color}`}>{isLoading ? "..." : stat.count.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {/* Pending Approval Banner */}
            {!isLoading && pendingUsers.length > 0 && (
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 bg-white dark:bg-[#0a0a0a] p-4 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                <UserAvatar name={user.name} email={user.email} image={user.image} size="default" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-thai font-semibold text-sm text-black dark:text-white truncate">{user.name || user.email.split('@')[0]}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    <button 
                                        disabled={isActionPending === user.id}
                                        onClick={() => handleUpdateStatus(user.id, "ACTIVE")}
                                        className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50" 
                                        title="อนุมัติ"
                                    >
                                        {isActionPending === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                    <button 
                                        disabled={isActionPending === user.id}
                                        onClick={() => handleUpdateStatus(user.id, "SUSPENDED")}
                                        className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50" 
                                        title="ปฏิเสธ"
                                    >
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
                    <div className="relative flex items-center">
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
                        <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative flex items-center">
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
                        <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#C9A84C]" />
                        <p className="font-thai font-bold uppercase tracking-widest text-xs">Loading Users Database...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                                    const roleConf = ROLE_CONFIG[user.role];
                                    const statusConf = STATUS_CONFIG[user.status] || STATUS_CONFIG.ACTIVE;
                                    const StatusIcon = statusConf.icon;

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar name={user.name} email={user.email} image={user.image} size="default" />
                                                    <div>
                                                        <p className="font-thai font-semibold text-black dark:text-white line-clamp-1">{user.name || "Unnamed User"}</p>
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
                                                {dayjs(user.createdAt).format('D MMM YYYY, HH:mm')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {user.status === "PENDING" && (
                                                        <button 
                                                            disabled={isActionPending === user.id}
                                                            onClick={() => handleUpdateStatus(user.id, "ACTIVE")}
                                                            className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50" 
                                                            title="อนุมัติ"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link href={`/admin/users/edit/${user.id}`}>
                                                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-black dark:hover:text-white">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-thai">ไม่พบสมาชิกที่ค้นหา</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center text-gray-500 text-sm font-thai">
                    <span>แสดง {filteredUsers.length} จากทั้งหมด {users.length} รายการ</span>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-none text-xs uppercase tracking-widest font-bold border-gray-200 dark:border-zinc-700 bg-transparent disabled:opacity-30" 
                            disabled
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-none text-xs uppercase tracking-widest font-bold border-gray-200 dark:border-zinc-700 bg-transparent disabled:opacity-30" 
                            disabled
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
