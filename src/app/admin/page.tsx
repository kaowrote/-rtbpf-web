import React from "react";
import { ArrowRight, FileText, Calendar, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import 'dayjs/locale/th';

dayjs.locale('th');

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    // 1. Fetch Stats
    const [
        totalArticles,
        upcomingEvents,
        totalNominees,
        totalUsers,
        pendingUsersCount,
        recentArticles
    ] = await Promise.all([
        prisma.article.count(),
        prisma.event.count({
            where: {
                startDate: { gte: new Date() }
            }
        }),
        prisma.awardNominee.count(),
        prisma.user.count(),
        prisma.user.count({
            where: { status: 'PENDING' }
        }),
        prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            take: 4,
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                featuredImage: true,
            }
        })
    ]);

    const stats = [
        { label: "Total Articles", count: totalArticles.toLocaleString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
        { label: "Upcoming Events", count: upcomingEvents.toLocaleString(), icon: Calendar, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
        { label: "Nataraja Nominees", count: totalNominees.toLocaleString(), icon: Trophy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
        { label: "Registered Users", count: totalUsers.toLocaleString(), icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-thai tracking-tight uppercase text-black dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 font-thai">ยินดีต้อนรับเข้าสู่ระบบจัดการเนื้อหา RTBPF (Content Management System)</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/articles/create">
                        <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                            + New Article
                        </Button>
                    </Link>
                    <Link href="/admin/events/create">
                        <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-[#C9A84C] dark:hover:bg-[#C9A84C] dark:hover:text-white transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                            + New Event
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-bold font-sans text-black dark:text-white">{stat.count}</h3>
                            </div>
                            <div className={`p-4 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold font-thai tracking-wide uppercase">Recent Content Additions</h2>
                        <Link href="/admin/articles" className="text-sm font-bold text-[#C9A84C] hover:text-black dark:hover:text-white flex items-center uppercase tracking-widest transition-colors">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentArticles.length > 0 ? (
                            recentArticles.map((article) => (
                                <div key={article.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                            {article.featuredImage ? (
                                                <img src={article.featuredImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-100 dark:from-zinc-800 dark:to-zinc-700" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-thai font-semibold text-black dark:text-white line-clamp-1 text-base">{article.title}</h4>
                                            <p className="text-sm text-gray-500 font-thai flex gap-2">
                                                <span>{dayjs(article.createdAt).format('D MMMM YYYY')}</span> • 
                                                <span className={article.status === 'PUBLISHED' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                                                    {article.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/articles/edit/${article.id}`}>
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black dark:hover:text-white">Edit</Button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-8 text-gray-500 font-thai">ยังไม่มีบทความใหม่</p>
                        )}
                    </div>
                </div>

                <div className="col-span-1 bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold font-thai tracking-wide uppercase mb-6">System Status</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-wider">
                                <span className="text-gray-600 dark:text-gray-400">Database (Prisma)</span>
                                <span className="text-green-500">Connected</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-wider">
                                <span className="text-gray-600 dark:text-gray-400">Storage (Assets)</span>
                                <span className="text-blue-500">Stable</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-full rounded-full" />
                            </div>
                        </div>
                        {pendingUsersCount > 0 && (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg mt-6">
                                <h4 className="font-bold text-yellow-800 dark:text-yellow-500 mb-1 text-sm uppercase tracking-widest">Notice</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-600 font-thai">
                                    มีสมาชิกใหม่ที่รอการอนุมัติเข้าระบบจำนวน {pendingUsersCount} ท่าน กรุณาตรวจสอบที่เมนู Users
                                </p>
                                <Link href="/admin/users" className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mt-2 block hover:underline">
                                    Go to User Management →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
