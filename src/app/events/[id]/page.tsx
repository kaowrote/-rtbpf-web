"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, Share2, Facebook, Twitter, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ===== Mock Event Detail =====
const MOCK_EVENT = {
    id: "evt-1",
    title: "งานประกาศผลรางวัลนาฏราช ครั้งที่ 17",
    excerpt: "ค่ำคืนแห่งเกียรติยศที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย",
    description: `
        <p>สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ ขอเชิญร่วมงานประกาศผลรางวัลนาฏราช ครั้งที่ 17 ประจำปี 2026 ซึ่งจะจัดขึ้น ณ หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย</p>
        <p>งานนี้จะเป็นการรวมตัวของบุคลากรชั้นนำในวงการสื่อไทย ทั้งนักแสดง ผู้กำกับ โปรดิวเซอร์ และผู้สื่อข่าว เพื่อร่วมเฉลิมฉลองผลงานยอดเยี่ยมแห่งปี</p>
        <h3>ไฮไลท์ของงาน</h3>
        <ul>
            <li>พิธีเปิดอลังการด้วยการแสดงพิเศษจากศิลปินชั้นนำ</li>
            <li>ประกาศผลรางวัลกว่า 30 สาขา ครอบคลุมทุกประเภทรายการ</li>
            <li>เดินพรมแดงสุดหรูหราจากเหล่าดาราและเซเลบริตี้</li>
            <li>งานเลี้ยง After Party สำหรับผู้ได้รับเชิญ</li>
        </ul>
        <h3>กำหนดการ</h3>
        <p><strong>16:00 น.</strong> — เปิดลงทะเบียน</p>
        <p><strong>17:00 น.</strong> — เดินพรมแดง</p>
        <p><strong>18:00 น.</strong> — พิธีเปิดงาน</p>
        <p><strong>18:30 น.</strong> — ประกาศผลรางวัลและการแสดง</p>
        <p><strong>22:00 น.</strong> — After Party</p>
    `,
    type: "AWARD_CEREMONY",
    typeLabel: "งานประกาศรางวัล",
    status: "OPEN_FOR_REGISTRATION" as const,
    statusLabel: "เปิดรับลงทะเบียน",
    startDate: "15 มิถุนายน 2026",
    time: "18:00 - 22:00 น.",
    venue: "หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย",
    location: "เลขที่ 14 ถนนเทียมร่วมมิตร แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5731!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzIyLjciTiAxMDDCsDM0JzIzLjIiRQ!5e0!3m2!1sth!2sth!4v1",
    capacity: 2000,
    registered: 1456,
    registrationUrl: "https://example.com/register",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop",
    galleryImages: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516280440503-62f808790089?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
    ],
    organizer: "สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
    contactEmail: "events@rtbpf.org",
    contactPhone: "02-123-4567",
};

const STATUS_COLORS: Record<string, string> = {
    UPCOMING: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    OPEN_FOR_REGISTRATION: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    COMPLETED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    SOLD_OUT: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const event = MOCK_EVENT;

    const registrationPercent = Math.min((event.registered / event.capacity) * 100, 100);

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
                            <Badge className={`rounded-none px-3 py-1 font-sans text-[10px] uppercase tracking-widest border ${STATUS_COLORS[event.status]}`}>
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 p-6 bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
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
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">ที่นั่ง</p>
                                    <p className="font-thai text-black dark:text-white font-semibold">{event.registered}/{event.capacity}</p>
                                    <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full mt-2">
                                        <div
                                            className={`h-full rounded-full ${registrationPercent >= 100 ? "bg-red-500" : registrationPercent >= 80 ? "bg-amber-500" : "bg-[#C9A84C]"} ${[
                                                "w-0", "w-[5%]", "w-[10%]", "w-[15%]", "w-[20%]", "w-[25%]", "w-[30%]", "w-[35%]", "w-[40%]", "w-[45%]", "w-[50%]", "w-[55%]", "w-[60%]", "w-[65%]", "w-[70%]", "w-[75%]", "w-[80%]", "w-[85%]", "w-[90%]", "w-[95%]", "w-full"
                                            ][Math.floor(Math.min(registrationPercent, 100) / 5)] || "w-full"}`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
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

                        {/* Gallery */}
                        {event.galleryImages.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold font-thai text-black dark:text-white mb-6 uppercase tracking-wide">แกลเลอรี่</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {event.galleryImages.map((img, i) => (
                                        <div key={i} className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 group cursor-pointer">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Map */}
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
                    </div>

                    {/* Right: Sidebar */}
                    <aside className="lg:w-1/3 order-1 lg:order-2">
                        <div className="sticky top-28 space-y-6">

                            {/* Registration Card */}
                            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 p-8">
                                <h3 className="text-lg font-bold font-thai text-black dark:text-white mb-2">ลงทะเบียนเข้าร่วมงาน</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-thai mb-6">
                                    ยังเหลือที่นั่งอีก {event.capacity - event.registered} ที่
                                </p>

                                <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                                    <Button className="w-full bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none h-14 font-bold uppercase tracking-widest text-sm transition-all duration-300 mb-3">
                                        ลงทะเบียนเลย
                                    </Button>
                                </a>
                                <p className="text-center text-xs text-gray-400 font-thai">
                                    ฟรี ไม่มีค่าใช้จ่าย
                                </p>
                            </div>

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
