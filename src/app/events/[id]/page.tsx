import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, Share2, Facebook, Twitter, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 60; // Cache duration in seconds

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id: slug } = await params;

    const event = await prisma.event.findUnique({
        where: { slug },
        select: { title: true, description: true, imageUrl: true }
    });

    if (!event) {
        return { title: 'Event Not Found | RTBPF' };
    }

    // Since description is HTML, we might string-strip it or just use a generic subtitle here, but let's carefully provide a short version if needed.
    const cleanDescription = (event.description || "").replace(/<[^>]*>?/gm, '').substring(0, 160);

    const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop";
    const coverImage = event.imageUrl || defaultImage;

    return {
        title: `${event.title} | RTBPF Events`,
        description: cleanDescription || "วิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF)",
        openGraph: {
            title: event.title,
            description: cleanDescription || "",
            images: [coverImage],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: cleanDescription || "",
            images: [coverImage],
        }
    };
}

const EVENT_TYPE_LABELS: Record<string, string> = {
    ALL: "ทั้งหมด",
    AWARD_CEREMONY: "งานประกาศรางวัล",
    SEMINAR: "สัมมนา",
    WORKSHOP: "เวิร์คช็อป",
    SCREENING: "ฉายผลงาน",
    PRESS_CONFERENCE: "งานแถลงข่าว",
    OTHER: "อื่นๆ"
};

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    OPEN_FOR_REGISTRATION: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    COMPLETED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    SOLD_OUT: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
    UPCOMING: "เร็วๆ นี้",
    OPEN_FOR_REGISTRATION: "เปิดรับลงทะเบียน",
    COMPLETED: "จบแล้ว",
    SOLD_OUT: "เต็มแล้ว",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params;

    const eventData = await prisma.event.findUnique({
        where: { slug }
    });

    if (!eventData) {
        notFound();
    }

    const dateObj = eventData.startDate;
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(dateObj);

    const timeString = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateObj) + " น.";


    const event = {
        title: eventData.title,
        description: eventData.description || "รายละเอียดเพิ่มเติม...",
        excerpt: "สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
        typeLabel: EVENT_TYPE_LABELS[eventData.eventType] || eventData.eventType,
        status: eventData.status,
        statusLabel: STATUS_LABELS[eventData.status] || "กิจกรรม",
        startDate: formattedDate,
        time: timeString,
        venue: eventData.location || "สำนักงานสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
        location: eventData.location || "กรุงเทพมหานคร",
        mapEmbedUrl: eventData.mapEmbedUrl,
        capacity: eventData.capacity || 0,
        registered: 0, // Not tracked in DB schema currently
        registrationUrl: eventData.registerUrl,
        imageUrl: eventData.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop",
        organizer: "สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
        contactEmail: "info@rtbpf.org",
        contactPhone: "02-123-4567"
    };

    const capacity = Number(event.capacity);
    const registered = Number(event.registered);
    const registrationPercent = capacity > 0 ? Math.min((registered / capacity) * 100, 100) : 0;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* ===== HERO ===== */}
            <section className="relative w-full h-[50vh] md:h-[65vh] flex items-end overflow-hidden">
                <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                <div className="container relative z-10 px-6 mx-auto pb-12 md:pb-16">
                    <Link href="/events" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                        กลับไปหน้ากิจกรรม
                    </Link>

                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className={`rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest border ${STATUS_COLORS[event.status] || STATUS_COLORS['UPCOMING']}`}>
                                {event.statusLabel}
                            </Badge>
                            <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest">
                                {event.typeLabel}
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-thai text-white leading-tight mb-4">
                            {event.title}
                        </h1>
                        <p className="text-white/80 font-thai text-lg">
                            {event.excerpt}
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== MAIN CONTENT ===== */}
            <section className="container mx-auto px-6 py-16 md:py-20">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left: Event Details */}
                    <div className="lg:w-2/3 order-2 lg:order-1">

                        {/* Quick Info Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 p-6 bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">วันที่</p>
                                    <p className="font-thai text-black dark:text-white font-semibold">{event.startDate}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">สถานที่</p>
                                    <p className="font-thai text-black dark:text-white font-semibold">{event.venue}</p>
                                </div>
                            </div>

                            {capacity > 0 && (
                                <div className="flex items-start gap-3 w-full lg:col-span-1 sm:col-span-2">
                                    <Users className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                                    <div className="w-full">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">ความจุผู้เข้าร่วม</p>
                                        <p className="font-thai text-black dark:text-white font-semibold">รับได้ {capacity} ท่าน</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold font-thai text-black dark:text-white mb-6 uppercase tracking-wide">รายละเอียดกิจกรรม</h2>
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none font-thai text-gray-700 dark:text-gray-300 leading-relaxed
                                    prose-h3:text-xl prose-h3:font-bold prose-h3:text-black dark:prose-h3:text-white prose-h3:mt-8 prose-h3:mb-4 prose-h3:uppercase prose-h3:tracking-wide
                                    prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                                    prose-strong:text-[#C9A84C]"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </div>

                        {/* Map */}
                        {event.mapEmbedUrl && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold font-thai text-black dark:text-white mb-6 uppercase tracking-wide">แผนที่</h2>
                                <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
                                    <iframe
                                        src={event.mapEmbedUrl}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Event Location Map"
                                    ></iframe>
                                </div>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-thai flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {event.location}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <aside className="lg:w-1/3 order-1 lg:order-2">
                        <div className="sticky top-28 space-y-6">

                            {/* Registration Card */}
                            {event.status === "OPEN_FOR_REGISTRATION" && event.registrationUrl && (
                                <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 p-8">
                                    <h3 className="text-lg font-bold font-thai text-black dark:text-white mb-2">ลงทะเบียนเข้าร่วมงาน</h3>
                                    {capacity > 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-thai mb-6">
                                            รับจำนวนจำกัด {capacity} ที่นั่ง
                                        </p>
                                    )}

                                    <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                                        <Button className="w-full bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none h-14 font-bold uppercase tracking-widest text-sm transition-all duration-300 mb-3">
                                            ลงทะเบียนเลย
                                        </Button>
                                    </a>
                                </div>
                            )}

                            {/* Organizer Info */}
                            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 p-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">ผู้จัดงาน</h3>
                                <p className="font-thai text-black dark:text-white font-semibold mb-4">{event.organizer}</p>

                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 font-thai">
                                    <p className="flex items-center gap-2">
                                        📧 <a href={`mailto:${event.contactEmail}`} className="hover:text-[#C9A84C] transition-colors">{event.contactEmail}</a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        📞 {event.contactPhone}
                                    </p>
                                </div>
                            </div>

                            {/* Share */}
                            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 p-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">แชร์กิจกรรม</h3>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C] bg-transparent">
                                        <Facebook className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C] bg-transparent">
                                        <Twitter className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C] bg-transparent">
                                        <Link2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
