import React from "react";
import Image from "next/image";
import { Target, Eye, Users, Award, Landmark, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TIMELINE = [
    { year: "2549", title: "ก่อตั้งสมาพันธ์ฯ", description: "สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ ก่อตั้งขึ้นอย่างเป็นทางการ" },
    { year: "2552", title: "จัดงานนาฏราชครั้งแรก", description: "เปิดตัวงานประกาศผลรางวัลนาฏราช ครั้งที่ 1 อย่างยิ่งใหญ่" },
    { year: "2558", title: "ขยายสาขารางวัล", description: "เพิ่มสาขารางวัลครอบคลุมครบทุกประเภทรายการ ทั้งละคร ข่าว สารคดี วาไรตี้ และวิทยุ" },
    { year: "2563", title: "ปรับตัวสู่ดิจิทัล", description: "จัดงานในรูปแบบ Hybrid ผสมผสานออนไลน์และออฟไลน์เป็นครั้งแรก" },
    { year: "2567", title: "ก้าวสู่มาตรฐานสากล", description: "ยกระดับเกณฑ์การตัดสินสู่มาตรฐานเทียบเท่ารางวัลระดับโลก" },
];

const PILLARS = [
    {
        icon: Award,
        title: "ยกย่องผลงาน",
        description: "มอบรางวัลนาฏราชแก่ผลงานคุณภาพ เพื่อเป็นกำลังใจและสร้างแรงบันดาลใจให้คนทำงานในวงการ",
    },
    {
        icon: Users,
        title: "พัฒนาวิชาชีพ",
        description: "จัดอบรม สัมมนา และเวิร์คช็อปเพื่อยกระดับทักษะของบุคลากรในอุตสาหกรรมสื่อ",
    },
    {
        icon: Landmark,
        title: "ส่งเสริมจริยธรรม",
        description: "กำหนดมาตรฐานจริยธรรมสื่อ และส่งเสริมการทำสื่ออย่างมีความรับผิดชอบต่อสังคม",
    },
];

const COMMITTEE = [
    { name: "ดร.สมชาย ชาญวิทยากุล", role: "ประธานสมาพันธ์ฯ", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
    { name: "คุณวราภรณ์ สุขสมบูรณ์", role: "รองประธาน", imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop" },
    { name: "คุณพงศ์พันธ์ เจริญศิลป์", role: "เลขาธิการ", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
    { name: "คุณนันทวรรณ ศรีสุข", role: "เหรัญญิก", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* ===== HERO ===== */}
            <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                    alt="About RTBPF"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>

                <div className="container relative z-10 px-6 mx-auto text-center">
                    <Badge className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90 uppercase tracking-[0.3em] font-sans font-bold px-4 py-1.5 rounded-none text-xs mb-6">
                        About Us
                    </Badge>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-thai text-white uppercase tracking-wide mb-4">
                        เกี่ยวกับสมาพันธ์ฯ
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-thai max-w-2xl mx-auto">
                        สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์
                    </p>
                </div>
            </section>

            {/* ===== INTRO ===== */}
            <section className="w-full py-20 md:py-28 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-thai text-black dark:text-white leading-tight mb-6">
                                องค์กรศูนย์กลางวิชาชีพสื่อ<br />วิทยุและโทรทัศน์ไทย
                            </h2>
                            <div className="w-16 h-1 bg-[#C9A84C] mb-8"></div>
                            <p className="text-gray-600 dark:text-gray-400 font-thai text-lg leading-relaxed mb-6">
                                สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF) ก่อตั้งขึ้นโดยการรวมตัวของสมาคมวิชาชีพในอุตสาหกรรมสื่อวิทยุและโทรทัศน์
                                เพื่อเป็นศูนย์กลางในการพัฒนา ยกระดับ และสร้างมาตรฐานให้แก่วงการสื่อไทย
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 font-thai text-lg leading-relaxed">
                                ด้วยความมุ่งมั่นในการส่งเสริมคุณภาพรายการ สนับสนุนบุคลากรในวิชาชีพ
                                และรักษาจริยธรรมสื่อ องค์กรได้ดำเนินภารกิจสำคัญหลายประการ
                                รวมถึงการจัดงานประกาศผลรางวัลนาฏราช ซึ่งเป็นรางวัลที่ทรงเกียรติที่สุดในวงการ
                            </p>
                        </div>
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-zinc-900">
                            <Image
                                src="https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop"
                                alt="RTBPF Event"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VISION & MISSION ===== */}
            <section className="w-full py-20 md:py-28 bg-[#1B2A4A] text-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="w-6 h-6 text-[#C9A84C]" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Vision / วิสัยทัศน์</h3>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-thai leading-tight mb-6">
                                เป็นองค์กรชั้นนำในการยกระดับมาตรฐานอุตสาหกรรมสื่อไทยสู่สากล
                            </h2>
                            <p className="text-white/70 font-thai text-lg leading-relaxed">
                                มุ่งสู่การเป็นองค์กรต้นแบบที่ได้รับการยอมรับในระดับภูมิภาคและระดับโลก
                                ในฐานะผู้นำด้านการพัฒนาวิชาชีพสื่อวิทยุกระจายเสียงและวิทยุโทรทัศน์
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-6 h-6 text-[#C9A84C]" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Mission / พันธกิจ</h3>
                            </div>
                            <ul className="space-y-4 text-white/80 font-thai text-lg">
                                <li className="flex items-start gap-3">
                                    <ChevronRight className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                                    ส่งเสริมและพัฒนาวิชาชีพสื่อให้มีคุณภาพและมาตรฐาน
                                </li>
                                <li className="flex items-start gap-3">
                                    <ChevronRight className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                                    จัดรางวัลนาฏราชเพื่อยกย่องผลงานดีเด่นในวงการ
                                </li>
                                <li className="flex items-start gap-3">
                                    <ChevronRight className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                                    ส่งเสริมจริยธรรมและความรับผิดชอบต่อสังคมของสื่อ
                                </li>
                                <li className="flex items-start gap-3">
                                    <ChevronRight className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                                    สร้างเครือข่ายความร่วมมือกับองค์กรสื่อในระดับสากล
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== THREE PILLARS ===== */}
            <section className="w-full py-20 md:py-28 bg-gray-50 dark:bg-[#050505]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-thai text-black dark:text-white uppercase tracking-wide mb-4">
                            ภารกิจหลัก
                        </h2>
                        <div className="w-16 h-1 bg-[#C9A84C] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {PILLARS.map((pillar) => (
                            <div key={pillar.title} className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 p-8 text-center group hover:border-[#C9A84C] transition-colors duration-300">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 transition-colors">
                                    <pillar.icon className="w-7 h-7 text-[#C9A84C]" />
                                </div>
                                <h3 className="text-xl font-bold font-thai text-black dark:text-white mb-3">
                                    {pillar.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 font-thai leading-relaxed">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMMITTEE ===== */}
            <section className="w-full py-20 md:py-28 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-thai text-black dark:text-white uppercase tracking-wide mb-4">
                            คณะกรรมการ
                        </h2>
                        <div className="w-16 h-1 bg-[#C9A84C] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {COMMITTEE.map((person) => (
                            <div key={person.name} className="text-center group">
                                <div className="relative w-28 h-28 mx-auto mb-4 overflow-hidden bg-gray-100 dark:bg-zinc-900 rounded-full border-2 border-transparent group-hover:border-[#C9A84C] transition-colors">
                                    <Image
                                        src={person.imageUrl}
                                        alt={person.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h4 className="font-bold font-thai text-black dark:text-white text-sm mb-1">{person.name}</h4>
                                <p className="text-xs text-[#C9A84C] font-thai">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TIMELINE ===== */}
            <section className="w-full py-20 md:py-28 bg-[#111] text-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-thai uppercase tracking-wide mb-4">
                            เส้นทางของเรา
                        </h2>
                        <div className="w-16 h-1 bg-[#C9A84C] mx-auto"></div>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/20 transform md:-translate-x-px"></div>

                        {TIMELINE.map((item, index) => (
                            <div key={item.year} className={`relative flex items-start mb-12 last:mb-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                {/* Dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#C9A84C] rounded-full transform -translate-x-1/2 mt-2 z-10 ring-4 ring-[#111]"></div>

                                {/* Content */}
                                <div className={`ml-16 md:ml-0 md:w-[45%] ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                    <span className="text-[#C9A84C] font-bold text-2xl font-sans">{item.year}</span>
                                    <h3 className="text-xl font-bold font-thai mt-1 mb-2">{item.title}</h3>
                                    <p className="text-white/60 font-thai leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="w-full py-20 bg-gray-50 dark:bg-[#050505] text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-thai text-black dark:text-white mb-4">
                        สนใจร่วมงานกับเรา?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-thai text-lg mb-8">
                        ติดต่อสมาพันธ์ฯ เพื่อสอบถามข้อมูลเพิ่มเติม หรือร่วมเป็นส่วนหนึ่งของเครือข่าย
                    </p>
                    <Link href="/contact">
                        <button className="bg-[#C9A84C] text-black hover:bg-[#b8963d] h-14 px-10 font-bold uppercase tracking-widest text-sm transition-all duration-300">
                            ติดต่อเรา
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
