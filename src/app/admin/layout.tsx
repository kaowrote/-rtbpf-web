"use client";

import "@/app/[locale]/globals.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Calendar as CalendarIcon, Trophy, Settings, Users, LogOut, ChevronRight, Loader2, Menu, X, PanelLeftClose, PanelLeft } from "lucide-react";
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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLoginPage = pathname === "/admin/login";
    const isForgotPasswordPage = pathname === "/admin/forgot-password";
    const isResetPasswordPage = pathname === "/admin/reset-password";
    const isLogoutPage = pathname === "/admin/logout";

    useEffect(() => {
        if (isLoginPage || isForgotPasswordPage || isResetPasswordPage || isLogoutPage) return;
        fetch("/api/auth/session")
            .then((res) => res.json())
            .then((data) => {
                if (data?.user) setUser(data.user);
            })
            .catch(() => {});
    }, [isLoginPage, isForgotPasswordPage, isResetPasswordPage]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

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

    if (isLoginPage || isForgotPasswordPage || isResetPasswordPage || isLogoutPage) {
        return <>{children}</>;
    }

    const displayName = user?.name || user?.email?.split("@")[0] || "Admin User";
    const displayRole = user?.role ? (ROLE_LABELS[user.role] || user.role) : "Admin";

    const SidebarContent = () => (
        <>
            {/* Brand Header */}
            <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#cfb659] flex items-center justify-center shadow-lg shadow-[#cfb659]/20">
                        <span className="text-[#1b294b] font-black text-lg">R</span>
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <h2 className="text-base font-bold text-white tracking-wide">RTBPF CMS</h2>
                            <p className="text-[10px] text-[#cfb659]/70 font-medium uppercase tracking-[0.15em]">Admin Panel</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                {NAV_ITEMS.map((section) => {
                    const filteredItems = section.items.filter(item => {
                        if (!item.allowedRoles) return true;
                        return user?.role && item.allowedRoles.includes(user.role);
                    });
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={section.section}>
                            {!sidebarCollapsed && (
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 px-3 mb-2">
                                    {section.section}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {filteredItems.map((item) => {
                                    const active = isActive(item.href, item.exact);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={sidebarCollapsed ? item.label : undefined}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group relative",
                                                sidebarCollapsed && "justify-center px-2",
                                                active
                                                    ? "bg-[#cfb659] text-[#1b294b] shadow-lg shadow-[#cfb659]/20"
                                                    : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-[18px] h-[18px] shrink-0",
                                                active ? "text-[#1b294b]" : "text-white/50 group-hover:text-[#cfb659]"
                                            )} />
                                            {!sidebarCollapsed && (
                                                <>
                                                    <span className="flex-1 text-[13px]">{item.label}</span>
                                                    {active && <ChevronRight className="w-3.5 h-3.5" />}
                                                </>
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
            <div className="p-3 border-t border-white/10">
                <div className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5",
                    sidebarCollapsed && "flex-col p-2"
                )}>
                    <Link href="/admin/profile" className={cn(
                        "flex items-center gap-2.5 flex-1 min-w-0 transition-opacity hover:opacity-80 group",
                        sidebarCollapsed && "flex-col"
                    )}>
                        <UserAvatar 
                            name={user?.name} 
                            email={user?.email || undefined} 
                            image={user?.image} 
                            size="sm" 
                            className="ring-0 group-hover:ring-2 ring-[#cfb659]/50 transition-all shrink-0" 
                        />
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                                <p className="text-[9px] text-[#cfb659]/70 uppercase tracking-widest truncate">{displayRole}</p>
                            </div>
                        )}
                    </Link>
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-0.5 shrink-0">
                            <Link 
                                href="/admin/profile" 
                                className="p-1.5 text-white/30 hover:text-[#cfb659] transition-colors"
                                title="Profile Settings"
                            >
                                <Settings className="w-3.5 h-3.5" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="p-1.5 text-white/30 hover:text-red-400 transition-colors disabled:opacity-50"
                                title="Logout"
                            >
                                {isLoggingOut ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#cfb659]" />
                                ) : (
                                    <LogOut className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    )}
                    {sidebarCollapsed && (
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="p-1.5 text-white/30 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Logout"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#cfb659]" />
                            ) : (
                                <LogOut className="w-3.5 h-3.5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#1b294b] text-white shadow-lg"
            >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <aside className={cn(
                "hidden lg:flex flex-col h-screen sticky top-0 bg-[#1b294b] transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-[72px]" : "w-[260px]"
            )}>
                <SidebarContent />
                {/* Collapse toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#1b294b] border-2 border-gray-200 dark:border-zinc-700 flex items-center justify-center text-white hover:bg-[#cfb659] hover:text-[#1b294b] transition-colors shadow-md z-10"
                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {sidebarCollapsed ? <PanelLeft className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
                </button>
            </aside>

            {/* Sidebar - Mobile */}
            <aside className={cn(
                "fixed top-0 left-0 h-full w-[260px] bg-[#1b294b] z-50 flex flex-col lg:hidden transition-transform duration-300",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 lg:gap-0">
                            <div className="w-8 lg:hidden" />
                            <nav className="flex items-center text-sm text-gray-400">
                                <Link href="/admin" className="hover:text-[#cfb659] transition-colors font-medium">
                                    CMS
                                </Link>
                                {pathname !== "/admin" && (
                                    <>
                                        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
                                        <span className="text-gray-700 dark:text-gray-200 font-semibold capitalize">
                                            {pathname.split("/admin/")[1]?.split("/")[0] || "Dashboard"}
                                        </span>
                                    </>
                                )}
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link 
                                href="/" 
                                target="_blank"
                                className="text-xs text-gray-400 hover:text-[#cfb659] transition-colors font-medium"
                            >
                                View Site →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-6 lg:p-8 xl:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
