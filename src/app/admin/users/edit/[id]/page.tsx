"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import { toast } from "sonner";

dayjs.locale('th');

type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "TRANSLATOR" | "JURY" | "MEMBER";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "DELETED";

const ROLES: { value: UserRole; label: string }[] = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "EDITOR", label: "Editor" },
    { value: "AUTHOR", label: "Author" },
    { value: "TRANSLATOR", label: "Translator" },
    { value: "JURY", label: "Jury" },
    { value: "MEMBER", label: "Member" },
];

interface ActivityLog {
    action: string;
    entity: string | null;
    createdAt: string;
}

interface User {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    role: UserRole;
    status: UserStatus;
    bio: string | null;
    preferredLocale: string | null;
    createdAt: string;
    updatedAt: string;
    activityLogs?: ActivityLog[];
}

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        role: "MEMBER" as UserRole,
        preferredLocale: "th",
        status: "ACTIVE" as UserStatus
    });

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${id}`);
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
                setFormData({
                    name: data.data.name || "",
                    email: data.data.email || "",
                    phone: data.data.phone || "",
                    bio: data.data.bio || "",
                    role: data.data.role,
                    preferredLocale: data.data.preferredLocale || "th",
                    status: data.data.status
                });
            } else {
                toast.error("User not found");
                router.push("/admin/users");
            }
        } catch (error) {
            toast.error("Failed to load user");
        } finally {
            setIsLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchUser();
    }, [id, fetchUser]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("ข้อมูลบันทึกสำเร็จ");
                fetchUser();
            } else {
                toast.error(data.error || "บันทึกไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusUpdate = async (newStatus: UserStatus) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                toast.success("อัปเดตสถานะสำเร็จ");
                fetchUser();
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C]" />
                <p className="mt-4 font-thai text-sm text-gray-500 uppercase tracking-widest font-bold">Loading User Database...</p>
            </div>
        );
    }

    if (!user) return null;

    const getRoleColor = (r: UserRole) => {
        const colors: Record<UserRole, string> = {
            SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            EDITOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            AUTHOR: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
            TRANSLATOR: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
            JURY: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            MEMBER: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400",
        };
        return colors[r] || colors.MEMBER;
    };

    const getStatusColor = (s: UserStatus) => {
        if (s === "ACTIVE") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        if (s === "PENDING") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        if (s === "SUSPENDED") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        return "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400";
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
                            <Image src={user.image || "/rtbpf-default-profile.png"} alt={user.name || "User"} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-thai text-black dark:text-white">{user.name || "Unnamed Member"}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge className={`rounded-none text-[10px] uppercase tracking-widest font-bold ${getRoleColor(user.role)}`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {ROLES.find(r => r.value === user.role)?.label}
                                </Badge>
                                <Badge className={`${getStatusColor(user.status)} rounded-none text-[10px] uppercase tracking-widest font-bold`}>
                                    ● {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {user.status === "ACTIVE" ? (
                            <Button 
                                onClick={() => handleStatusUpdate("SUSPENDED")}
                                disabled={isSaving}
                                variant="outline" 
                                className="rounded-none text-xs uppercase tracking-widest font-bold border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 bg-transparent"
                            >
                                <UserX className="w-4 h-4 mr-2" /> Suspend
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => handleStatusUpdate("ACTIVE")}
                                disabled={isSaving}
                                variant="outline" 
                                className="rounded-none text-xs uppercase tracking-widest font-bold border-green-200 text-green-600 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30 bg-transparent"
                            >
                                <UserCheck className="w-4 h-4 mr-2" /> Activate User
                            </Button>
                        )}
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
                                    <Input 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
                                    <Input 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">เบอร์โทรศัพท์</label>
                                    <Input 
                                        value={formData.phone} 
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ภาษา</label>
                                    <select 
                                        title="Language" 
                                        value={formData.preferredLocale}
                                        onChange={(e) => setFormData({...formData, preferredLocale: e.target.value})}
                                        className="w-full h-12 px-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white appearance-none"
                                    >
                                        <option value="th">ภาษาไทย (TH)</option>
                                        <option value="en">English (EN)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ประวัติย่อ (Bio)</label>
                                <textarea
                                    title="Bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 font-thai text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none text-black dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12 transition-colors"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
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
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
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
                                    {formData.role === "SUPER_ADMIN" && ["Full Access", "Manage Users", "System Settings", "Content CMS", "Awards DB"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {formData.role === "ADMIN" && ["Manage Users", "Content CMS", "Awards DB", "Events"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {formData.role === "EDITOR" && ["Create Articles", "Publish Articles", "Edit Events", "Edit Awards"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {formData.role === "AUTHOR" && ["Create Articles", "Edit Own Articles"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {formData.role === "JURY" && ["View Awards", "Submit Scores"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                    {(formData.role === "MEMBER" || formData.role === "TRANSLATOR") && ["View Public Content", "Profile Settings"].map((cap) => (
                                        <Badge key={cap} variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600">{cap}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12 transition-colors"
                                >
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
                            {user.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-400 font-sans">{user.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400 font-thai">สมัครเมื่อ {dayjs(user.createdAt).format('D MMM YYYY')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400 font-thai">อัปเดตล่าสุด: {dayjs(user.updatedAt).format('D MMM YYYY HH:mm')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400 uppercase">{user.preferredLocale || "TH"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Activity Log</h3>
                        <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {user.activityLogs && user.activityLogs.length > 0 ? user.activityLogs.map((log, i) => (
                                <div key={i} className="flex gap-3 py-3 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                                    <div className="mt-0.5 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-md shrink-0">
                                        <Activity className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-black dark:text-white">{log.action}</p>
                                        <p className="text-xs text-gray-500 font-thai line-clamp-1">{log.entity || "-"}</p>
                                        <p className="text-[10px] text-gray-400 font-thai mt-1">{dayjs(log.createdAt).format('D MMM YY HH:mm')}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-6 text-center text-gray-400 text-xs font-thai italic">
                                    No activity records found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-red-200 dark:border-red-900/30 shadow-sm rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                        <div className="space-y-3">
                            <Button 
                                onClick={() => handleStatusUpdate("SUSPENDED")}
                                variant="outline" 
                                className="w-full rounded-none text-xs uppercase tracking-widest font-bold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent justify-start"
                            >
                                <UserX className="w-4 h-4 mr-2" /> Suspend Account
                            </Button>
                            <Button 
                                onClick={() => {
                                    if(confirm("Are you sure you want to delete this account? This cannot be undone.")) {
                                        handleStatusUpdate("DELETED");
                                        router.push("/admin/users");
                                    }
                                }}
                                variant="outline" 
                                className="w-full rounded-none text-xs uppercase tracking-widest font-bold border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-950/30 bg-transparent justify-start"
                            >
                                <UserX className="w-4 h-4 mr-2" /> Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
