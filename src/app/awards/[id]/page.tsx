"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Facebook, Twitter, Link2, Trophy, Award, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data for a singular Award Detail Page
const MOCK_AWARDS_DETAILS = {
    id: "1",
    year: "2024",
    edition: "15",
    category: "ละครโทรทัศน์ยอดเยี่ยม",
    title: "มาตาลดา (To The Moon and Back)",
    recipient: "บริษัท เมกเกอร์ วาย จำกัด",
    network: "สถานีวิทยุโทรทัศน์ไทยทีวีสีช่อง 3",
    producer: "ยศสินี ณ นคร",
    director: "เหมันต์ เชตมี",
    cast: ["จิรายุ ตั้งศรีสุข", "จรินทร์พร จุนเกียรติ", "วชิรวิชญ์ วัฒนภักดีไพศาล", "อแมนด้า ออบดัม", "ชาตโยดม หิรัณยัษฐิติ"],
    synopsis: "เรื่องราวของมาตาลดา หญิงสาวผู้มีจิตใจงดงามและเติบโตมาจากการโอบอุ้มของพ่อที่เป็นเกย์และครอบครัว LGBTQ+ ความอบอุ่นของเธอได้เข้าไปเยียวยาบาดแผลในใจของปุริม ศัลยแพทย์หนุ่มผู้เพียบพร้อมที่ดูเหมือนครอบครัวจะสมบูรณ์แบบ แต่กลับเก็บซ่อนความเจ็บปวดจากการถูกครอบครัวตีกรอบ",
    coverImage: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop",
    ceremonyDate: "12 พฤษภาคม 2567",
    otherNominees: [
        { name: "พรหมลิขิต", network: "ช่อง 3" },
        { name: "เกมรักทรยศ", network: "ช่อง 3" },
        { name: "รักร้าย", network: "ช่อง One31" },
        { name: "บุษบาลุยไฟ", network: "Thai PBS" }
    ],
    videoClip: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop"
};

export default function AwardDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // React 19 unwrapping params
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    // In a real app we'd fetch data based on the 'id'.
    const award = MOCK_AWARDS_DETAILS;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors duration-300">

            {/* 1. HERO BANNER - Split Layout Style */}
            <section className="relative w-full min-h-[60vh] md:h-[75vh] flex flex-col md:flex-row bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10">
                {/* Image Half */}
                <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full overflow-hidden order-2 md:order-1">
                    <Image
                        src={award.coverImage}
                        alt={award.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>

                {/* Content Half */}
                <div className="w-full md:w-1/2 flex items-center p-8 md:p-16 lg:p-24 order-1 md:order-2">
                    <div className="max-w-xl w-full">
                        <Link href="/awards" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#C9A84C] hover:text-black dark:hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Database
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <Badge className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 dark:bg-[#1f2b46] rounded-none px-3 py-1 font-sans text-xs uppercase tracking-widest">
                                {award.year}
                            </Badge>
                            <Badge className="bg-transparent border border-black dark:border-white text-black dark:text-white rounded-none px-3 py-1 font-thai font-semibold text-xs tracking-wide">
                                รางวัลนาฏราช ครั้งที่ {award.edition}
                            </Badge>
                        </div>

                        <h2 className="text-[#C9A84C] text-lg md:text-xl font-thai font-bold tracking-wide mb-2 uppercase">
                            {award.category}
                        </h2>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-thai text-black dark:text-white leading-[1.1] tracking-tight mb-8">
                            {award.title}
                        </h1>

                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Recipient / Produced By</h3>
                                <p className="text-xl font-thai font-semibold text-black dark:text-white">{award.recipient}</p>
                            </div>
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Broadcaster / Network</h3>
                                <p className="text-lg font-thai text-black/80 dark:text-white/80">{award.network}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MAIN CONTENT BODY */}
            <section className="container mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left Column: Details & Story */}
                    <div className="lg:w-2/3">
                        {/* Synposis */}
                        <div className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <Crown className="text-[#C9A84C] h-6 w-6" />
                                <h3 className="text-2xl font-bold uppercase tracking-wider text-black dark:text-white">Synopsis & Overview</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-thai text-lg md:text-xl leading-relaxed">
                                {award.synopsis}
                            </p>
                        </div>

                        {/* Credits Block */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-sm mb-16">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-black dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">Key Credits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Director</h4>
                                    <p className="text-lg font-thai font-semibold text-black dark:text-white">{award.director}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Producer</h4>
                                    <p className="text-lg font-thai font-semibold text-black dark:text-white">{award.producer}</p>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Main Cast</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {award.cast.map(name => (
                                            <span key={name} className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white px-3 py-1.5 text-sm font-thai rounded-sm">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:w-1/3">
                        {/* Share Widget */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm mb-10 text-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-6">Share this Award</h3>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C]">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C]">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-700 hover:text-[#C9A84C] hover:border-[#C9A84C]">
                                    <Link2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Nominees List */}
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <div className="bg-[#1B2A4A] dark:bg-[#111827] text-white p-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold font-thai tracking-wide">รายชื่อผู้เข้าชิง (Nominees)</h3>
                                <Trophy className="text-[#C9A84C] h-5 w-5" />
                            </div>
                            <div className="p-6">
                                <div className="mb-4 pb-4 border-b border-[#C9A84C]/30 flex items-start gap-3">
                                    <Award className="text-[#C9A84C] shrink-0 mt-0.5 h-4 w-4" />
                                    <div>
                                        <p className="font-thai font-semibold text-black dark:text-white">{award.title}</p>
                                        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">{award.network} (ผู้ชนะ)</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {award.otherNominees.map(nom => (
                                        <li key={nom.name} className="flex flex-col gap-1 px-7">
                                            <p className="font-thai text-black/80 dark:text-white/80">{nom.name}</p>
                                            <p className="text-xs uppercase tracking-wider text-gray-400">{nom.network}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </aside>

                </div>
            </section>
        </div>
    );
}
