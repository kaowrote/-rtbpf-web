import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RowActions from "@/components/admin/RowActions";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import 'dayjs/locale/th';

dayjs.locale('th');

import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
    const session = await auth();
    const user = session?.user;
    const isAuthor = user?.role === 'AUTHOR';
    const canManageAll = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'EDITOR';

    const articles = await prisma.article.findMany({
        where: isAuthor ? { authorId: user?.id } : {},
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { id: true, name: true } },
            publisher: { select: { name: true } }
        }
    });

    const canDelete = (article: any) => {
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') return true;
        if (article.authorId === user?.id) return true;
        return false;
    };

    const canEdit = (article: any) => {
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'EDITOR') return true;
        if (article.authorId === user?.id) return true;
        return false;
    };

    const getStatusTheme = (status: string) => {
        if (status === 'PUBLISHED') return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
        if (status === 'SCHEDULED') return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        if (status === 'DRAFT') return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-zinc-800">
                <div>
                    <Link href="/admin" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase uppercase">Articles & News Center</h1>
                    <p className="text-gray-500 mt-2 font-thai">จัดการข้อมูล ข่าวสาร บทความ และตั้งเวลาเผยแพร่</p>
                </div>
                <Link href="/admin/articles/create">
                    <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                        <Plus className="w-4 h-4 mr-2" /> New Article
                    </Button>
                </Link>
            </div>

            {/* List Header */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Article Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Publish/Schedule Date</th>
                                <th className="px-6 py-4">Publisher</th>
                                <th className="px-6 py-4 text-right">Views</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="font-thai font-semibold text-black dark:text-white text-base line-clamp-1">{article.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">Author: {article.author.name || "Unknown"}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className={`font-bold text-[10px] tracking-wider uppercase rounded-none border ${getStatusTheme(article.status)}`}>
                                            {article.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 font-thai text-sm text-gray-600 dark:text-gray-400">
                                        {article.status === 'SCHEDULED' && article.scheduledAt ? (
                                            <div className="flex items-center text-blue-600 dark:text-blue-400">
                                                <Clock className="w-4 h-4 mr-2" /> {dayjs(article.scheduledAt).format('D MMMM YYYY, HH:mm')}
                                            </div>
                                        ) : article.status === 'PUBLISHED' && article.publishedAt ? (
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-2" /> {dayjs(article.publishedAt).format('D MMMM YYYY')}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 font-thai text-sm text-gray-600 dark:text-gray-400">
                                        {article.publisher?.name || '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end text-gray-600 dark:text-gray-400 space-x-2">
                                            <span>{article.viewCount.toLocaleString()}</span>
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <RowActions
                                            editUrl={`/admin/articles/edit/${article.id}`}
                                            deleteApiUrl={`/api/articles/${article.id}`}
                                            showEdit={canEdit(article)}
                                            showDelete={canDelete(article)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-center text-gray-500 text-sm font-thai">
                    Showing {articles.length > 0 ? 1 : 0} to {articles.length} of {articles.length} total entries
                </div>
            </div>
        </div>
    );
}
