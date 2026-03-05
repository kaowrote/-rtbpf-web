"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Filter, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock Data for UI presentation
const MOCK_AWARDS = [
    {
        id: "1",
        year: "2024",
        category: "ละครยอดเยี่ยม",
        title: "มาตาลดา",
        recipient: "บริษัท เมกเกอร์ วาย จำกัด",
        network: "ช่อง 3 HD",
        imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop",
        type: "Drama",
    },
    {
        id: "2",
        year: "2024",
        category: "ผู้กำกับยอดเยี่ยม",
        title: "มาตาลดา",
        recipient: "เหมันต์ เชตมี",
        network: "ช่อง 3 HD",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
        type: "Individual",
    },
    {
        id: "3",
        year: "2024",
        category: "นักแสดงนำชายยอดเยี่ยม",
        title: "พรหมลิขิต",
        recipient: "ธนวรรธน์ วรรธนะภูติ",
        network: "ช่อง 3 HD",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
        type: "Individual",
    },
    {
        id: "4",
        year: "2024",
        category: "นักแสดงนำหญิงยอดเยี่ยม",
        title: "เกมรักทรยศ",
        recipient: "แอน ทองประสม",
        network: "ช่อง 3 HD",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
        type: "Individual",
    },
    {
        id: "5",
        year: "2023",
        category: "รายการวาไรตี้ยอดเยี่ยม",
        title: "ร้องข้ามกำแพง",
        recipient: "บริษัท เวิร์คพอยท์ เอ็นเทอร์เทนเมนท์ จำกัด (มหาชน)",
        network: "ช่อง Workpoint 23",
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
        type: "Variety",
    },
    {
        id: "6",
        year: "2023",
        category: "ข่าวและสถานการณ์ปัจจุบันยอดเยี่ยม",
        title: "ข่าว 3 มิติ",
        recipient: "บริษัท บางกอกเอ็นเตอร์เทนเม้นต์ จำกัด",
        network: "ช่อง 3 HD",
        imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2669&auto=format&fit=crop",
        type: "News",
    },
];

const YEARS = ["ทั้งหมด", "2025", "2024", "2023", "2022", "2021", "2020"];
const CATEGORIES = ["ทั้งหมด", "รางวัลเกียรติยศ", "รางวัลประเภทละครโทรทัศน์", "รางวัลประเภทรายการบันเทิง", "รางวัลประเภทรายการข่าว", "รางวัลประเภทรายการวิทยุ"];

export default function AwardsDatabasePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("ทั้งหมด");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 pb-20">

            {/* 1. HERO SECTION */}
            <section className="relative w-full h-[50vh] md:h-[60vh] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2671&auto=format&fit=crop"
                        alt="Nataraja Awards Database"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="container relative z-10 px-6 mx-auto text-center mt-12">
                    <Badge className="bg-accent text-black hover:bg-accent/90 uppercase tracking-[0.3em] font-sans font-bold px-4 py-1.5 rounded-none text-xs mb-6 mx-auto inline-flex">
                        Database
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold font-thai text-white uppercase tracking-wider mb-4">
                        Nataraja <span className="text-accent font-serif">&</span> Nominees
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-thai max-w-2xl mx-auto font-light">
                        ฐานข้อมูลผู้เข้าชิงและผู้ชนะรางวัลนาฏราชทั้งหมด ตั้งแต่อดีตจนถึงปัจจุบัน
                    </p>
                </div>
            </section>

            {/* 2. SEARCH AND FILTER SECTION */}
            <section className="w-full relative z-20 -mt-10 mb-12">
                <div className="container px-4 md:px-8 mx-auto">
                    <div className="bg-white dark:bg-[#111] p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-6 mx-auto max-w-6xl rounded-sm">

                        {/* Search Box */}
                        <div className="flex-1 relative">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="ค้นหาชื่อผู้เข้าชิง, ชื่อเรื่องรายการ, หรือประเภทรางวัล..."
                                    className="pl-12 h-14 bg-gray-50 dark:bg-black border-gray-200 dark:border-white/10 rounded-none font-thai text-lg focus-visible:ring-accent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Year Filter */}
                            <div className="w-full sm:w-48">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Year</label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="h-14 bg-gray-50 dark:bg-black border-gray-200 dark:border-white/10 rounded-none font-sans text-lg focus:ring-accent">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10">
                                        {YEARS.map((year) => (
                                            <SelectItem key={year} value={year} className="font-sans cursor-pointer">
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div className="w-full sm:w-64">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="h-14 bg-gray-50 dark:bg-black border-gray-200 dark:border-white/10 rounded-none font-thai text-base focus:ring-accent">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10">
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="font-thai cursor-pointer">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* 3. RESULTS INFO & OVERVIEW */}
            <section className="container px-6 md:px-8 mx-auto mb-8">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4">
                    <h2 className="text-2xl font-bold font-thai text-black dark:text-white uppercase tracking-wider flex items-center gap-3">
                        <Award className="text-accent h-6 w-6" /> รางวัลนาฏราช ครั้งที่ 15 ประจำปี 2024
                    </h2>
                    <span className="text-gray-500 dark:text-gray-400 font-thai text-sm font-semibold uppercase tracking-wider">
                        Showing {MOCK_AWARDS.length} Nominations
                    </span>
                </div>
            </section>

            {/* 4. RESULTS GRID (Editorial Card Style) */}
            <section className="container px-6 md:px-8 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">

                    {MOCK_AWARDS.map((award) => (
                        <div key={award.id} className="group flex flex-col cursor-pointer">
                            {/* Image Frame */}
                            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 mb-6">
                                <Image
                                    src={award.imageUrl}
                                    alt={award.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />

                                {/* Year tag positioned on image */}
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white font-serif tracking-widest font-bold px-3 py-1.5 text-xs">
                                    {award.year}
                                </div>

                                {/* Hover overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <Button className="w-full bg-accent text-black hover:bg-white rounded-none uppercase font-bold tracking-wider text-xs h-10">
                                        View Winner Details
                                    </Button>
                                </div>
                            </div>

                            {/* Context / Info */}
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-accent uppercase font-bold tracking-widest text-[10px] md:text-xs">
                                        {award.type}
                                    </span>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span className="text-gray-500 dark:text-gray-400 font-sans text-xs uppercase tracking-wider">
                                        {award.network}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-tight mb-2">
                                    {award.recipient}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 font-thai text-lg">
                                    {award.category} <br />
                                    <span className="italic text-black dark:text-white/80">&quot;{award.title}&quot;</span>
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Load More Button */}
                <div className="mt-20 text-center">
                    <Button variant="outline" size="lg" className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-12 bg-transparent transition-all duration-300 border-2">
                        Load More Winners
                    </Button>
                </div>
            </section>

        </div>
    );
}
