import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RowActions from "@/components/admin/RowActions";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import 'dayjs/locale/th';

dayjs.locale('th');

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const getStatusTheme = (status: string) => {
        if (status === 'COMPLETED') return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700';
        if (status === 'UPCOMING') return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        if (status === 'OPEN_FOR_REGISTRATION') return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-zinc-800">
                <div>
                    <Link href="/admin" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">Events & Activities</h1>
                    <p className="text-gray-500 mt-2 font-thai">จัดการกำหนดการกิจกรรม งานสัมมนา และงานประกาศผลรางวัล</p>
                </div>
                <Link href="/admin/events/create">
                    <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] transition-colors rounded-none font-bold uppercase tracking-widest text-xs px-6">
                        <Plus className="w-4 h-4 mr-2" /> New Event
                    </Button>
                </Link>
            </div>

            {/* List Header */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Event Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4 text-center">Registration</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {events.map((event) => {
                                // Default logic for capacity/registration when no relations exist
                                const registeredCount = 0;
                                const capacityNum = event.capacity ? parseInt(event.capacity.replace(/\D/g, '')) || 0 : 0;
                                const registrationPercentage = capacityNum > 0 ? (registeredCount / capacityNum) * 100 : 0;

                                return (
                                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className="font-bold text-[10px] tracking-wider uppercase rounded-sm border mb-2 text-gray-500 border-gray-300 dark:border-zinc-700">
                                                {event.eventType.replace('_', ' ')}
                                            </Badge>
                                            <p className="font-thai font-semibold text-black dark:text-white text-base max-w-sm line-clamp-2 leading-tight mb-2">
                                                {event.title}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-thai">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {event.location || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className={`font-bold text-[10px] tracking-wider uppercase rounded-none border ${getStatusTheme(event.status)}`}>
                                                {event.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 font-thai">
                                            <div className="flex flex-col text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center mb-1 text-black dark:text-white font-medium text-sm">
                                                    <Calendar className="w-4 h-4 mr-2 text-[#C9A84C]" /> {dayjs(event.startDate).format('D MMMM YYYY')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="flex items-center justify-center text-black dark:text-white font-bold font-sans text-xs">
                                                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                    {registeredCount} <span className="text-gray-400 mx-1">/</span> {capacityNum > 0 ? capacityNum : '∞'}
                                                </div>
                                                {capacityNum > 0 && (
                                                    <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 mt-2 max-w-[100px] mx-auto">
                                                        <div
                                                            className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
                                                            style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <RowActions
                                                editUrl={`/admin/events/edit/${event.id}`}
                                                deleteApiUrl={`/api/events/${event.id}`}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-center text-gray-500 text-sm font-thai">
                    Showing {events.length > 0 ? 1 : 0} to {events.length} of {events.length} total entries
                </div>
            </div>
        </div>
    );
}
