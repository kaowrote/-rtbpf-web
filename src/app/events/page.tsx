"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ===== Mock Data =====
const EVENT_TYPES = ["ALL", "AWARD_CEREMONY", "SEMINAR", "WORKSHOP", "SCREENING"] as const;
type EventType = typeof EVENT_TYPES[number];

const EVENT_TYPE_LABELS: Record<EventType, string> = {
    ALL: "ทั้งหมด",
    AWARD_CEREMONY: "งานประกาศรางวัล",
    SEMINAR: "สัมมนา",
    WORKSHOP: "เวิร์คช็อป",
    SCREENING: "ฉายผลงาน",
};

interface MockEvent {
    id: string;
    title: string;
    excerpt: string;
    type: Exclude<EventType, "ALL">;
    status: "UPCOMING" | "OPEN_FOR_REGISTRATION" | "COMPLETED" | "SOLD_OUT";
    startDate: string;
    endDate?: string;
    time: string;
    venue: string;
    location: string;
    capacity: number;
    registered: number;
    imageUrl: string;
    isFeatured?: boolean;
}

const MOCK_EVENTS: MockEvent[] = [
    {
        id: "evt-1",
        title: "งานประกาศผลรางวัลนาฏราช ครั้งที่ 17",
        excerpt: "ค่ำคืนแห่งเกียรติยศที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย ร่วมเป็นสักขีพยานในงานประกาศผลรางวัลนาฏราช ครั้งที่ 17 พร้อมการแสดงพิเศษจากศิลปินชั้นนำ",
        type: "AWARD_CEREMONY",
        status: "OPEN_FOR_REGISTRATION",
        startDate: "15 มิถุนายน 2026",
        time: "18:00 - 22:00 น.",
        venue: "หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย",
        location: "กรุงเทพมหานคร",
        capacity: 2000,
        registered: 1456,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop",
        isFeatured: true,
    },
    {
        id: "evt-2",
        title: "สัมมนา: อนาคตของสื่อไทยในยุค AI",
        excerpt: "เจาะลึกผลกระทบของเทคโนโลยี AI ต่อวงการสื่อสารมวลชน การปรับตัวของคนทำสื่อ และทิศทางอุตสาหกรรมในอีก 5 ปีข้างหน้า",
        type: "SEMINAR",
        status: "OPEN_FOR_REGISTRATION",
        startDate: "28 มีนาคม 2026",
        time: "09:00 - 16:00 น.",
        venue: "โรงแรมเซ็นทารา แกรนด์ แอท เซ็นทรัลเวิลด์",
        location: "กรุงเทพมหานคร",
        capacity: 300,
        registered: 187,
        imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "evt-3",
        title: "Workshop: การผลิตคอนเทนต์ข้ามแพลตฟอร์ม",
        excerpt: "เรียนรู้เทคนิคการผลิตเนื้อหาที่ใช้ได้ทั้งโทรทัศน์ ออนไลน์ และโซเชียลมีเดีย จากผู้เชี่ยวชาญระดับประเทศ พร้อมลงมือปฏิบัติจริง",
        type: "WORKSHOP",
        status: "UPCOMING",
        startDate: "10 เมษายน 2026",
        endDate: "12 เมษายน 2026",
        time: "10:00 - 17:00 น.",
        venue: "สมาคมวิชาชีพฯ สำนักงานใหญ่",
        location: "กรุงเทพมหานคร",
        capacity: 50,
        registered: 50,
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "evt-4",
        title: "ฉายผลงาน: สารคดีไทยร่วมสมัย",
        excerpt: "รวมสารคดีคุณภาพจากผู้กำกับรุ่นใหม่ที่ได้รับการคัดเลือกมาฉายพิเศษ พร้อมเสวนาหลังฉายร่วมกับทีมผู้สร้าง",
        type: "SCREENING",
        status: "OPEN_FOR_REGISTRATION",
        startDate: "5 พฤษภาคม 2026",
        time: "13:00 - 20:00 น.",
        venue: "โรงภาพยนตร์ IMAX, Paragon Cineplex",
        location: "กรุงเทพมหานคร",
        capacity: 500,
        registered: 342,
        imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "evt-5",
        title: "สัมมนาเชิงปฏิบัติการ: จริยธรรมสื่อในยุคดิจิทัล",
        excerpt: "ร่วมถกปัญหาจริยธรรมในการทำงานสื่อ ตั้งแต่การตรวจสอบข้อมูล Deepfake ไปจนถึงความรับผิดชอบต่อสังคมของสื่อมวลชน",
        type: "SEMINAR",
        status: "COMPLETED",
        startDate: "15 มกราคม 2026",
        time: "09:00 - 15:00 น.",
        venue: "ห้องประชุมสีดา จุฬาลงกรณ์มหาวิทยาลัย",
        location: "กรุงเทพมหานคร",
        capacity: 200,
        registered: 200,
        imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "evt-6",
        title: "Workshop: เทคนิคการถ่ายภาพยนตร์สั้น",
        excerpt: "อบรมเชิงปฏิบัติการสำหรับผู้สนใจงานถ่ายภาพยนตร์ เรียนรู้เทคนิคเฉพาะทางจากผู้กำกับภาพมืออาชีพ",
        type: "WORKSHOP",
        status: "COMPLETED",
        startDate: "20 กุมภาพันธ์ 2026",
        time: "10:00 - 18:00 น.",
        venue: "Studio M, Malee Tower",
        location: "กรุงเทพมหานคร",
        capacity: 30,
        registered: 30,
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    },
];

const STATUS_CONFIG: Record<MockEvent["status"], { label: string; color: string }> = {
    UPCOMING: { label: "เร็วๆ นี้", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    OPEN_FOR_REGISTRATION: { label: "เปิดรับลงทะเบียน", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    COMPLETED: { label: "จบแล้ว", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    SOLD_OUT: { label: "เต็มแล้ว", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
};

export default function EventsPage() {
    const [activeFilter, setActiveFilter] = useState<EventType>("ALL");

    const filteredEvents = activeFilter === "ALL"
        ? MOCK_EVENTS
        : MOCK_EVENTS.filter((e) => e.type === activeFilter);

    const featuredEvent = MOCK_EVENTS.find((e) => e.isFeatured);
    const regularEvents = filteredEvents.filter((e) => !e.isFeatured || activeFilter !== "ALL");

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* ===== HERO: Featured Event ===== */}
            {featuredEvent && activeFilter === "ALL" && (
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
                                <Badge className={`rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest border ${STATUS_CONFIG[featuredEvent.status].color}`}>
                                    {STATUS_CONFIG[featuredEvent.status].label}
                                </Badge>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest">
                                    {EVENT_TYPE_LABELS[featuredEvent.type]}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-thai text-white leading-tight mb-4">
                                {featuredEvent.title}
                            </h1>
                            <p className="text-white/80 font-thai text-base md:text-lg leading-relaxed mb-8 max-w-2xl line-clamp-2">
                                {featuredEvent.excerpt}
                            </p>

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
                                <Link href={`/events/${featuredEvent.id}`}>
                                    <Button className="bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none h-12 px-8 font-bold uppercase tracking-widest text-sm transition-all duration-300">
                                        ลงทะเบียน
                                    </Button>
                                </Link>
                                <Link href={`/events/${featuredEvent.id}`}>
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none h-12 px-8 font-bold uppercase tracking-widest text-sm bg-transparent transition-all duration-300">
                                        รายละเอียด
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== FILTER TABS + EVENT LISTING ===== */}
            <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-[#050505] transition-colors">
                <div className="container mx-auto px-6">

                    {/* Section header */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-gray-200 dark:border-zinc-800 pb-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold font-thai text-black dark:text-white uppercase tracking-wide">
                                กิจกรรม
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-thai mt-2 text-base">
                                งานสัมมนา เวิร์คช็อป งานประกาศรางวัล และกิจกรรมต่างๆ ของสมาพันธ์ฯ
                            </p>
                        </div>

                        {/* Filter tabs */}
                        <div className="flex flex-wrap gap-2">
                            {EVENT_TYPES.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 border ${activeFilter === type
                                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                                        : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                                        }`}
                                >
                                    {EVENT_TYPE_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 gap-y-12">
                        {(activeFilter === "ALL" ? regularEvents.filter(e => !e.isFeatured) : regularEvents).map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.id}`}
                                className={`group flex flex-col md:flex-row gap-6 md:gap-10 border-b border-gray-200 dark:border-white/10 pb-12 ${event.status === "COMPLETED" ? "opacity-60 hover:opacity-100" : ""
                                    } transition-opacity`}
                            >
                                {/* Image Left */}
                                <div className="relative w-full md:w-5/12 lg:w-1/3 aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 shrink-0">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                    />
                                    <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans border ${STATUS_CONFIG[event.status].color}`}>
                                        {STATUS_CONFIG[event.status].label}
                                    </div>
                                </div>

                                {/* Content Right */}
                                <div className="flex flex-col flex-1 py-2 justify-center">
                                    {/* Type badge */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] font-sans flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            {EVENT_TYPE_LABELS[event.type]}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold font-thai text-black dark:text-white group-hover:text-[#C9A84C] transition-colors leading-snug mb-3">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-thai text-base leading-relaxed line-clamp-2 mb-5">
                                        {event.excerpt}
                                    </p>

                                    {/* Event meta info */}
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400 font-sans mb-5">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                                            {event.startDate}{event.endDate && ` — ${event.endDate}`}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                                            {event.venue}
                                        </span>
                                    </div>

                                    {/* Capacity bar */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{event.registered}/{event.capacity} ที่นั่ง</span>
                                        </div>
                                        <div className="w-32 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${event.registered >= event.capacity
                                                    ? "bg-red-500"
                                                    : event.registered >= event.capacity * 0.8
                                                        ? "bg-amber-500"
                                                        : "bg-[#C9A84C]"
                                                    } ${[
                                                        "w-0", "w-[5%]", "w-[10%]", "w-[15%]", "w-[20%]", "w-[25%]", "w-[30%]", "w-[35%]", "w-[40%]", "w-[45%]", "w-[50%]", "w-[55%]", "w-[60%]", "w-[65%]", "w-[70%]", "w-[75%]", "w-[80%]", "w-[85%]", "w-[90%]", "w-[95%]", "w-full"
                                                    ][Math.floor(Math.min((event.registered / event.capacity) * 100, 100) / 5)] || "w-full"}`}
                                            ></div>
                                        </div>
                                        {event.status !== "COMPLETED" && (
                                            <span className="text-sm font-bold uppercase tracking-widest text-[#1B2A4A] dark:text-white group-hover:text-[#C9A84C] transition-colors flex items-center ml-auto">
                                                ดูรายละเอียด <ArrowRight className="ml-2 w-4 h-4" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {(activeFilter === "ALL" ? regularEvents.filter(e => !e.isFeatured) : regularEvents).length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-thai text-lg">ยังไม่มีกิจกรรมในหมวดนี้</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="w-full py-20 bg-[#1B2A4A] text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-thai mb-4">
                        ไม่อยากพลาดกิจกรรม?
                    </h2>
                    <p className="text-white/70 font-thai text-lg mb-8">
                        ลงทะเบียนรับข่าวสารเพื่อรับการแจ้งเตือนเมื่อมีกิจกรรมใหม่เปิดรับสมัคร
                    </p>
                    <form className="flex flex-col sm:flex-row gap-0 justify-center w-full max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="อีเมลของคุณ"
                            className="h-14 px-6 w-full sm:w-2/3 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 rounded-none font-sans border border-white/20 transition-colors"
                        />
                        <Button className="h-14 w-full sm:w-1/3 bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none font-bold uppercase tracking-wider">
                            แจ้งเตือน
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
}
