import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Shield, Users, Award, Newspaper, Calendar, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Membership | RTBPF",
    description: "สมัครสมาชิกสหภาพแรงงานวิชาชีพวิทยุและโทรทัศน์ — เข้าถึงสิทธิพิเศษ, ข่าวสาร, และกิจกรรมเฉพาะสมาชิก",
};

const TIERS = [
    {
        name: "สมาชิกสามัญ",
        nameEn: "Regular Member",
        price: "ฟรี",
        priceEn: "Free",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800",
        features: [
            "เข้าถึงข่าวสารทั่วไป",
            "แสดงความคิดเห็นบทความ",
            "รับจดหมายข่าวรายสัปดาห์",
            "ดูฐานข้อมูลรางวัลนาฏราช",
        ],
    },
    {
        name: "สมาชิกวิชาชีพ",
        nameEn: "Professional Member",
        price: "1,200 ฿/ปี",
        priceEn: "1,200 ฿/year",
        icon: Shield,
        color: "text-[#cfb659]",
        bg: "bg-amber-50 dark:bg-amber-950/20",
        border: "border-[#cfb659] dark:border-[#cfb659]/50",
        popular: true,
        features: [
            "สิทธิ์สมาชิกสามัญทั้งหมด",
            "เข้าถึงบทความ Premium",
            "ส่วนลดกิจกรรม & สัมมนา 20%",
            "สิทธิ์เสนอชื่อรางวัลนาฏราช",
            "ใบรับรองสมาชิกดิจิทัล",
            "เข้าร่วมประชุมใหญ่ประจำปี",
        ],
    },
    {
        name: "สมาชิกกิตติมศักดิ์",
        nameEn: "Honorary Member",
        price: "ได้รับเชิญ",
        priceEn: "By Invitation",
        icon: Crown,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-950/20",
        border: "border-purple-200 dark:border-purple-800",
        features: [
            "สิทธิ์วิชาชีพทั้งหมด",
            "เข้าร่วมเป็นกรรมการตัดสิน",
            "เชิญเข้างาน VIP ทุกงาน",
            "ลงภาพในหอเกียรติยศ",
            "พื้นที่โปรไฟล์พิเศษ",
            "ช่องทางติดต่อตรง RTBPF",
        ],
    },
];

const BENEFITS = [
    { icon: Newspaper, title: "ข่าวสาร Premium", desc: "บทความวิเคราะห์เชิงลึก ข่าววงการสื่อ และรายงานพิเศษ" },
    { icon: Award, title: "นาฏราช Awards", desc: "สิทธิ์เสนอชื่อ เข้าร่วมพิธี และเข้าถึงกองบรรณาธิการรางวัล" },
    { icon: Calendar, title: "กิจกรรม & สัมมนา", desc: "ส่วนลดพิเศษ และที่นั่งสำรองสำหรับงาน Workshop, Seminar" },
    { icon: Users, title: "เครือข่ายวิชาชีพ", desc: "เชื่อมต่อกับผู้เชี่ยวชาญวิทยุ-โทรทัศน์ทั่วประเทศ" },
    { icon: Shield, title: "การคุ้มครองสิทธิ์", desc: "สิทธิ์ในการได้รับคำปรึกษา และความช่วยเหลือด้านแรงงาน" },
    { icon: Star, title: "หอเกียรติยศ", desc: "รับการยกย่อง ลงภาพ และโปรไฟล์ในฐานข้อมูลสมาชิก" },
];

export default async function MembershipPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 pb-20">

            {/* HERO */}
            <section className="relative w-full h-[50vh] md:h-[55vh] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2632&auto=format&fit=crop"
                        alt="RTBPF Membership"
                        fill
                        className="object-cover opacity-25"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>
                <div className="container relative z-10 px-6 mx-auto text-center mt-8">
                    <Badge className="bg-accent text-black hover:bg-accent/90 uppercase tracking-[0.3em] font-sans font-bold px-4 py-1.5 rounded-none text-xs mb-6 mx-auto inline-flex">
                        Membership
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold font-thai text-white uppercase tracking-wider mb-4">
                        สมัครสมาชิก
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-thai max-w-2xl mx-auto font-light">
                        ร่วมเป็นส่วนหนึ่งของสหภาพแรงงานวิชาชีพวิทยุและโทรทัศน์
                    </p>
                </div>
            </section>

            {/* BENEFITS GRID */}
            <section className="container px-6 mx-auto py-16 md:py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-thai uppercase tracking-wider mb-4">
                        สิทธิประโยชน์<span className="text-accent">สมาชิก</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-thai max-w-lg mx-auto">
                        เข้าถึงเนื้อหา กิจกรรม และเครือข่ายวิชาชีพระดับประเทศ
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {BENEFITS.map((b) => (
                        <div key={b.title} className="flex gap-4 p-6 border border-gray-100 dark:border-zinc-800 rounded-xl hover:border-[#cfb659]/30 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center group-hover:bg-[#cfb659]/20 transition-colors">
                                <b.icon className="w-6 h-6 text-[#cfb659]" />
                            </div>
                            <div>
                                <h3 className="font-bold font-thai text-lg mb-1">{b.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-thai">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TIERS */}
            <section className="bg-gray-50 dark:bg-zinc-950 py-16 md:py-24">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-thai uppercase tracking-wider mb-4">
                            ระดับ<span className="text-accent">สมาชิก</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-thai max-w-lg mx-auto">
                            เลือกระดับที่เหมาะกับคุณ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {TIERS.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative bg-white dark:bg-[#0a0a0a] border ${tier.border} rounded-xl p-8 flex flex-col ${tier.popular ? "ring-2 ring-[#cfb659] shadow-xl scale-[1.03]" : "shadow-sm"} transition-all duration-300 hover:shadow-lg`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-[#cfb659] text-black uppercase tracking-widest text-[10px] font-bold px-4 py-1 rounded-full">
                                            แนะนำ
                                        </Badge>
                                    </div>
                                )}

                                <div className={`w-14 h-14 ${tier.bg} rounded-lg flex items-center justify-center mb-6`}>
                                    <tier.icon className={`w-7 h-7 ${tier.color}`} />
                                </div>

                                <h3 className="text-xl font-bold font-thai mb-1">{tier.name}</h3>
                                <p className="text-xs text-gray-400 font-sans uppercase tracking-wider mb-4">{tier.nameEn}</p>

                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-[#cfb659]">{tier.price}</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm font-thai">
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full rounded-none uppercase tracking-widest text-xs font-bold h-12 transition-all ${tier.popular ? "bg-[#cfb659] text-black hover:bg-[#b8a44e]" : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200"}`}
                                >
                                    {tier.price === "ได้รับเชิญ" ? "ติดต่อสอบถาม" : "สมัครเลย"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container px-6 mx-auto py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-thai uppercase tracking-wider mb-6">
                    มีคำถาม?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-thai max-w-lg mx-auto mb-8">
                    ทีมงาน RTBPF ยินดีให้คำปรึกษาเรื่องสมาชิกภาพ สิทธิประโยชน์ และกิจกรรมต่างๆ
                </p>
                <Link href="/contact">
                    <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold px-10 h-12 border-2">
                        ติดต่อเรา <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </section>
        </div>
    );
}
