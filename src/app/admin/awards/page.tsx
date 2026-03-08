import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Trophy, Medal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RowActions from "@/components/admin/RowActions";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import 'dayjs/locale/th';

dayjs.locale('th');

import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminAwardsPage() {
    const session = await auth();
    const user = session?.user;
    const isJury = user?.role === 'JURY';
    const canManageAll = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'EDITOR';

    const rawAwardYears = await prisma.awardYear.findMany({
        orderBy: { year: 'desc' },
        include: {
            _count: { select: { nominees: true } },
            nominees: {
                where: { isWinner: true },
                select: { id: true }
            }
        }
    });

    const awardYears = rawAwardYears.map((ay) => ({
        ...ay,
        totalNominees: ay._count.nominees,
        totalWinners: ay.nominees.length
    }));

    const recentNominees = await prisma.awardNominee.findMany({
        orderBy: { id: 'desc' },
        take: 50,
        include: {
            category: { select: { name: true } },
            year: { select: { year: true } }
        }
    });



    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-zinc-800">
                <div>
                    <Link href="/admin" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">Nataraja Awards Database</h1>
                    <p className="text-gray-500 mt-2 font-thai">จัดการข้อมูลผู้เข้าชิง ผู้ชนะ และสาขารางวัลนาฏราชทั้งหมด</p>
                </div>
                {!isJury && (
                    <div className="flex gap-3">
                        <Link href="/admin/awards/create">
                            <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                                <Plus className="w-4 h-4 mr-2" /> Add Nominee
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Award Years Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {awardYears.map((ay) => (
                    <div key={ay.year} className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl hover:border-[#C9A84C]/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-3xl font-bold font-sans text-black dark:text-white">{ay.year}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">ครั้งที่ {ay.edition}</p>
                            </div>
                            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/30">
                                <Trophy className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <div>
                                <p className="text-gray-500 font-sans text-xs uppercase tracking-wider">Nominees</p>
                                <p className="text-xl font-bold text-black dark:text-white font-sans">{ay.totalNominees}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-sans text-xs uppercase tracking-wider">Winners</p>
                                <p className="text-xl font-bold text-[#C9A84C] font-sans">{ay.totalWinners}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-xs text-gray-400 font-thai">พิธีมอบรางวัล: {ay.ceremonyDate ? dayjs(ay.ceremonyDate).format('D MMMM YYYY') : "รอประกาศ"}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nominees Table */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-thai uppercase tracking-wide text-black dark:text-white flex items-center gap-2">
                        <Medal className="w-5 h-5 text-[#C9A84C]" /> รายชื่อผู้เข้าชิง / ผู้ชนะ
                    </h2>
                    <Button variant="outline" className="rounded-none border-gray-200 dark:border-zinc-700 text-xs uppercase tracking-widest font-bold bg-transparent">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">Nominee</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Channel</th>
                                    <th className="px-6 py-4 text-center">Year</th>
                                    <th className="px-6 py-4 text-center">Result</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {recentNominees.map((nominee) => (
                                    <tr key={nominee.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {nominee.imageUrl ? (
                                                    <div className="w-10 h-10 overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 rounded-md">
                                                        <Image
                                                            src={nominee.imageUrl}
                                                            alt={nominee.nomineeName}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 shrink-0 rounded-md flex items-center justify-center">
                                                        <Medal className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-thai font-semibold text-black dark:text-white line-clamp-1">{nominee.nomineeName}</p>
                                                    <p className="text-xs text-gray-500 font-thai">{nominee.workTitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-thai text-gray-600 dark:text-gray-400 text-sm max-w-[200px]">
                                            {nominee.category?.name || "ไม่ระบุ"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {nominee.broadcastingChannel}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-sans font-bold text-black dark:text-white">{nominee.year?.year || "-"}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {nominee.isWinner ? (
                                                <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 rounded-none text-[10px] uppercase tracking-widest font-bold">
                                                    🏆 Winner
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-200 dark:border-zinc-700 text-gray-500">
                                                    Nominee
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <RowActions
                                                editUrl={`/admin/awards/edit/${nominee.id}`}
                                                deleteApiUrl={`/api/awards/nominees/${nominee.id}`}
                                                showEdit={!isJury}
                                                showDelete={!isJury}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-center text-gray-500 text-sm font-thai">
                        Showing 1 to {recentNominees.length} of {recentNominees.length} entries
                    </div>
                </div>
            </div>
        </div>
    );
}
