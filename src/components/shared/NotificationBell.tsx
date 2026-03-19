"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, ExternalLink, Info, Award, Newspaper, Calendar, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
    info: Info,
    success: Check,
    warning: AlertTriangle,
    award: Award,
    article: Newspaper,
    event: Calendar,
};

const TYPE_COLORS: Record<string, string> = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    award: "text-[#cfb659]",
    article: "text-indigo-500",
    event: "text-purple-500",
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "เมื่อสักครู่";
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} วันที่แล้ว`;
    return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className = "" }: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Fetch on mount + every 60s
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    async function fetchNotifications() {
        try {
            const res = await fetch("/api/notifications?limit=15");
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (e) {
            // Silently fail
        }
    }

    async function markAllRead() {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error("Failed to mark all read:", e);
        }
    }

    async function markRead(id: string) {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationIds: [id] }),
            });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (e) {
            console.error("Failed to mark read:", e);
        }
    }

    function handleNotificationClick(notification: Notification) {
        if (!notification.isRead) markRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
    }

    return (
        <div className={`relative ${className}`} ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                        <h3 className="font-bold font-thai text-sm">การแจ้งเตือน</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    อ่านทั้งหมด
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="font-thai">ไม่มีการแจ้งเตือน</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const IconComp = TYPE_ICONS[n.type] || Info;
                                const iconColor = TYPE_COLORS[n.type] || "text-blue-500";

                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors ${
                                            !n.isRead ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
                                            <IconComp className="w-4 h-4" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-thai ${!n.isRead ? "font-bold" : ""}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-thai line-clamp-2 mt-0.5">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                                                {n.link && <ExternalLink className="w-3 h-3 text-gray-300" />}
                                            </div>
                                        </div>

                                        {/* Unread dot */}
                                        {!n.isRead && (
                                            <div className="flex-shrink-0 mt-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
