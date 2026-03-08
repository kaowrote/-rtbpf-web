import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Events & Activities | RTBPF",
    description: "รวมกิจกรรม งานประกาศรางวัล สัมมนา และการประชุมที่จัดโดยสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
    openGraph: {
        title: "Events & Activities | RTBPF",
        description: "รวมกิจกรรม งานประกาศรางวัล สัมมนา และการประชุมที่จัดโดยสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
        type: "website",
    },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
    ALL: "ทั้งหมด",
    AWARD_CEREMONY: "งานประกาศรางวัล",
    SEMINAR: "สัมมนา",
    WORKSHOP: "เวิร์คช็อป",
    SCREENING: "ฉายผลงาน",
    PRESS_CONFERENCE: "งานแถลงข่าว",
    OTHER: "อื่นๆ"
};

const STATUS_CONFIG: Record<string, { label: string; color: string; sortOrder: number }> = {
    UPCOMING: { label: "เร็วๆ นี้", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", sortOrder: 2 },
    OPEN_FOR_REGISTRATION: { label: "เปิดรับลงทะเบียน", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", sortOrder: 1 },
    COMPLETED: { label: "จบแล้ว", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", sortOrder: 4 },
    SOLD_OUT: { label: "เต็มแล้ว", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", sortOrder: 3 },
};

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const params = await searchParams;
    const filterType = params.type || "ALL";

    // Fetch Events & Settings
    const [rawEvents, defaultImageSetting] = await Promise.all([
        prisma.event.findMany({
            orderBy: {
                startDate: "asc"
            }
        }),
        prisma.systemSetting.findUnique({
            where: { key: "defaultEventImageUrl" }
        })
    ]);

    const defaultImageUrl = defaultImageSetting?.value || "/rtbpf-default-event.png";

    const mappedEvents = rawEvents.map(event => {
        const dateObj = event.startDate;
        const formattedDate = new Intl.DateTimeFormat('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(dateObj);

        const timeString = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateObj) + " น.";

        return {
            id: event.id,
            slug: event.slug,
            title: event.title,
            excerpt: event.description || "รายละเอียดเพิ่มเติม...",
            type: event.eventType,
            status: event.status,
            startDate: formattedDate,
            time: timeString,
            venue: event.location || "สมาพันธ์สมาคมวิชาชีพฯ",
            capacity: Number(event.capacity) || 0,
            imageUrl: event.imageUrl || defaultImageUrl,
        };
    }).sort((a, b) => {
        // Sort by status
        const aOrder = STATUS_CONFIG[a.status]?.sortOrder || 99;
        const bOrder = STATUS_CONFIG[b.status]?.sortOrder || 99;
        return aOrder - bOrder;
    });

    const filteredEvents = filterType === "ALL"
        ? mappedEvents
        : mappedEvents.filter((e) => e.type === filterType);

    const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : null;
    const regularEvents = filteredEvents.length > 1 ? filteredEvents.slice(1) : [];

    const types = ["ALL", "AWARD_CEREMONY", "SEMINAR", "WORKSHOP"];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* ===== HERO: Featured Event ===== */}
            {featuredEvent && filterType === "ALL" && (
                <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end overflow-hidden">
                    <Image
                        src={featuredEvent.imageUrl}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    <div className="container relative z-10 px-6 mx-auto pb-12 md:pb-20">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className={`rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest border ${STATUS_CONFIG[featuredEvent.status]?.color || STATUS_CONFIG['UPCOMING'].color}`}>
                                    {STATUS_CONFIG[featuredEvent.status]?.label || "ประกาศ"}
                                </Badge>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest">
                                    {EVENT_TYPE_LABELS[featuredEvent.type] || "กิจกรรม"}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-thai text-white leading-tight mb-4">
                                {featuredEvent.title}
                            </h1>
                            <div
                                className="text-white/80 font-thai text-base md:text-lg leading-relaxed mb-8 max-w-2xl line-clamp-2 prose prose-invert"
                                dangerouslySetInnerHTML={{ __html: featuredEvent.excerpt }}
                            />

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/70 text-sm font-sans mb-8">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#C9A84C]" />
                                    {featuredEvent.startDate}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#C9A84C]" />
                                    {featuredEvent.time}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#C9A84C]" />
                                    {featuredEvent.venue}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <Link href={`/events/${featuredEvent.slug}`}>
                                    <Button className="bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none h-12 px-8 font-bold uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-[#C9A84C]/20 border border-[#C9A84C]">
                                        ลงทะเบียน
                                    </Button>
                                </Link>
                                <Link href={`/events/${featuredEvent.slug}`}>
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none h-12 px-8 font-bold uppercase tracking-widest text-sm bg-transparent transition-all duration-300">
                                        ข้อมูลกิจกรรม
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== HEADER LINE IF NO HERO ===== */}
            {(!featuredEvent || filterType !== "ALL") && (
                <section className="w-full bg-gray-50 dark:bg-[#050505] py-16 md:py-24 border-b border-gray-200 dark:border-white/10">
                    <div className="container px-6 mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold font-thai text-black dark:text-white uppercase tracking-wider mb-4">
                            Events <span className="text-[#C9A84C]">&</span> Activities
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-thai max-w-2xl mx-auto">
                            กิจกรรม งานประกาศรางวัล และการสัมมนาจากสมาพันธ์และภาคีเครือข่าย
                        </p>
                    </div>
                </section>
            )}

            {/* ===== FILTER ===== */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 overflow-x-auto scroolbar-hide">
                    <div className="flex space-x-6 py-4 min-w-max">
                        {types.map((typeLabel) => (
                            <Link key={typeLabel} href={`/events?type=${typeLabel}`}>
                                <button
                                    className={`relative text-xs uppercase tracking-widest font-bold pb-1 transition-colors hover:text-[#C9A84C]
                                        ${filterType === typeLabel ? 'text-[#C9A84C]' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    {EVENT_TYPE_LABELS[typeLabel] || typeLabel}
                                    {filterType === typeLabel && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A84C]"></span>
                                    )}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== REGULAR EVENTS GRID ===== */}
            <section className="container mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularEvents.map((event) => (
                        <div key={event.id} className="group relative bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full rounded-sm overflow-hidden transform hover:-translate-y-1">
                            {/* Card Image */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />

                                {/* Overlays on Image */}
                                <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                                    <Badge className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 uppercase tracking-widest text-[10px] px-3 py-1 rounded-sm font-bold border-none shadow-none">
                                        {EVENT_TYPE_LABELS[event.type] || event.type}
                                    </Badge>
                                    <Badge className={`${STATUS_CONFIG[event.status]?.color || STATUS_CONFIG['UPCOMING'].color} backdrop-blur-sm bg-white/90 dark:bg-black/80 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-sm shadow-none`}>
                                        {STATUS_CONFIG[event.status]?.label || "สถานะไม่ระบุ"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex flex-col flex-grow p-6 md:p-8 relative">
                                {/* Title & Text */}
                                <div className="mb-8 relative z-10 flex-grow">
                                    <h3 className="text-2xl font-bold font-thai text-black dark:text-white leading-[1.3] mb-4 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <div
                                        className="text-gray-600 dark:text-gray-400 font-thai text-base leading-relaxed line-clamp-2 mb-6 font-light prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: event.excerpt }}
                                    />
                                </div>

                                {/* Event Details Footer */}
                                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800/50 flex flex-col gap-3 z-10">
                                    <div className="flex items-center text-sm font-sans tracking-wide text-gray-500 font-semibold">
                                        <Calendar className="w-4 h-4 mr-3 text-black dark:text-white" />
                                        {event.startDate} • {event.time}
                                    </div>
                                    <div className="flex items-center text-sm font-thai tracking-wide text-gray-500 font-medium line-clamp-1">
                                        <MapPin className="w-4 h-4 mr-3 text-black dark:text-white flex-shrink-0" />
                                        <span className="truncate">{event.venue}</span>
                                    </div>
                                    {event.capacity > 0 && (
                                        <div className="flex items-center justify-between text-sm font-sans font-medium mt-3">
                                            <div className="flex items-center text-gray-500">
                                                <Users className="w-4 h-4 mr-3 text-emerald-500" />
                                                <span className="uppercase text-xs tracking-wider">Capacity: {event.capacity}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Interactive Hover Layer */}
                            <Link href={`/events/${event.slug}`} className="absolute inset-0 z-20" aria-label={`View details for ${event.title}`}>
                            </Link>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="py-24 text-center text-gray-500 min-h-[50vh] flex flex-col items-center justify-center">
                        <div className="w-24 h-24 mb-6 text-gray-200 dark:text-zinc-800">
                            <Calendar className="w-full h-full" />
                        </div>
                        <p className="text-xl font-thai font-semibold text-black dark:text-white mb-2">ยังไม่มีกิจกรรมในหมวดหมู่นี้</p>
                        <p className="text-gray-500">กรุณาติดตามอัปเดตกิจกรรมใหม่ๆ ในเร็วๆ นี้</p>
                    </div>
                )}
            </section>
        </div>
    );
}
