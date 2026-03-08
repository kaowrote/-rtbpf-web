"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Calendar as CalendarIcon, Trophy, Settings, Users, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/admin/UserAvatar";

interface NavItem {
    label: string;
    href: string;
    icon: any;
    exact?: boolean;
    allowedRoles?: string[];
}

interface NavSection {
    section: string;
    items: NavItem[];
}

const NAV_ITEMS: NavSection[] = [
    {
        section: "Content",
        items: [
            { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true, allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR", "JURY"] },
            { label: "Articles & News", href: "/admin/articles", icon: FileText, allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR"] },
            { label: "Events", href: "/admin/events", icon: CalendarIcon, allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
            { label: "Awards", href: "/admin/awards", icon: Trophy, allowedRoles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "JURY"] },
        ],
    },
    {
        section: "System",
        items: [
            { label: "Users", href: "/admin/users", icon: Users, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
            { label: "Settings", href: "/admin/settings", icon: Settings, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
        ],
    },
];

interface SessionUser {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
}

const ROLE_LABELS: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
    AUTHOR: "Author",
    TRANSLATOR: "Translator",
    JURY: "Jury",
    MEMBER: "Member",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Don't render sidebar for the login page
    const isLoginPage = pathname === "/admin/login";

    // Fetch session
    useEffect(() => {
        if (isLoginPage) return;

        fetch("/api/auth/session")
            .then((res) => res.json())
            .then((data) => {
                if (data?.user) {
                    setUser(data.user);
                }
            })
            .catch(() => {
                // Silent fail — middleware handles unauthenticated users
            });
    }, [isLoginPage]);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/signout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch {
            setIsLoggingOut(false);
        }
    };

    // For login page, render children only (no sidebar)
    if (isLoginPage) {
        return <>{children}</>;
    }

    const initials = user?.name
        ? user.name.charAt(0).toUpperCase()
        : user?.email
            ? user.email.charAt(0).toUpperCase()
            : "A";

    const displayName = user?.name || user?.email?.split("@")[0] || "Admin User";
    const displayRole = user?.role ? (ROLE_LABELS[user.role] || user.role) : "Admin";

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#050505]">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-zinc-800 flex flex-col h-[calc(100vh-73px)] sticky top-[73px]">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold font-thai tracking-wider uppercase text-black dark:text-white">CMS Panel</h2>
                    <p className="text-xs text-gray-400 mt-1 font-sans uppercase tracking-widest">Content Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {NAV_ITEMS.map((section) => {
                        const filteredItems = section.items.filter(item => {
                            if (!item.allowedRoles) return true;
                            return user?.role && item.allowedRoles.includes(user.role);
                        });

                        if (filteredItems.length === 0) return null;

                        return (
                            <div key={section.section}>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 px-4 mb-2">
                                    {section.section}
                                </p>
                                <div className="space-y-1">
                                    {filteredItems.map((item) => {
                                        const active = isActive(item.href, item.exact);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 group relative",
                                                    active
                                                        ? "bg-[#1B2A4A] text-white shadow-md"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                {active && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A84C] rounded-r-full" />
                                                )}
                                                <item.icon className={cn("w-5 h-5", active ? "text-[#C9A84C]" : "")} />
                                                <span className="flex-1 text-sm">{item.label}</span>
                                                {active && (
                                                    <ChevronRight className="w-4 h-4 text-white/50" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom User Area */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-zinc-900">
                        <UserAvatar 
                            name={user?.name} 
                            email={user?.email || undefined} 
                            image={user?.image} 
                            size="sm" 
                            className="ring-0" 
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black dark:text-white truncate">{displayName}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{displayRole}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Logout"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
