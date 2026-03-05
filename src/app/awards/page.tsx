"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Filter, Medal, Award, Loader2 } from "lucide-react";
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

export default function AwardsDatabasePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("ทั้งหมด");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const [nominees, setNominees] = useState<any[]>([]);
    const [years, setYears] = useState<{ id: string; year: number }[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch years and categories to populate filters
                const [yearsRes, catRes, nomineesRes] = await Promise.all([
                    fetch("/api/awards/years").then(res => res.json()),
                    fetch("/api/awards/categories").then(res => res.json()),
                    fetch("/api/awards/nominees?limit=500").then(res => res.json()) // Fetch a large batch for client-side filtering
                ]);

                if (yearsRes.success) {
                    setYears(yearsRes.data || []);
                }
                if (catRes.success) {
                    setCategories(catRes.data || []);
                }
                if (nomineesRes.success) {
                    setNominees(nomineesRes.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch awards data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived unique years and categories from the raw fetched data to build select options
    const yearOptions = ["ทั้งหมด", ...years.map(y => y.year.toString()).sort((a, b) => parseInt(b) - parseInt(a))];
    const categoryOptions = ["ทั้งหมด", ...categories.map(c => c.name)];

    // Filtering logic
    const filteredNominees = nominees.filter((nominee) => {
        const searchMatch = nominee.nomineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (nominee.workTitle && nominee.workTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (nominee.category?.name && nominee.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const yearMatch = selectedYear === "ทั้งหมด" || nominee.year?.year?.toString() === selectedYear;
        const categoryMatch = selectedCategory === "ทั้งหมด" || nominee.category?.name === selectedCategory;

        return searchMatch && yearMatch && categoryMatch;
    });

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
                                    <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10 max-h-60">
                                        {yearOptions.map((year) => (
                                            <SelectItem key={year} value={year} className="font-sans cursor-pointer">
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div className="w-full sm:w-72">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="h-14 bg-gray-50 dark:bg-black border-gray-200 dark:border-white/10 rounded-none font-thai text-sm md:text-base focus:ring-accent">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10 max-h-60">
                                        {categoryOptions.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="font-thai cursor-pointer break-words max-w-[300px] sm:max-w-none">
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

            {/* 3. RESULTS STATISTICS */}
            <section className="container px-6 mx-auto mb-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                    <h3 className="text-lg font-bold font-thai text-black dark:text-white uppercase tracking-wider flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-accent" />
                        ผลการค้นหา {isLoading ? "..." : filteredNominees.length} รายการ
                    </h3>
                    <div className="text-sm text-gray-500 font-sans tracking-widest uppercase">
                        Sorted by: <span className="font-bold text-black dark:text-white ml-2">Year (Newest)</span>
                    </div>
                </div>
            </section>

            {/* 4. RESULTS GRID */}
            <section className="container px-6 mx-auto">
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[30vh]">
                            <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                            <p className="text-gray-500 font-thai">กำลังโหลดฐานข้อมูล...</p>
                        </div>
                    ) : filteredNominees.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNominees.map((nominee) => (
                                <div key={nominee.id} className="group flex flex-col bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden">

                                    {/* Image Container */}
                                    <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 overflow-hidden">
                                        {nominee.imageUrl ? (
                                            <Image
                                                src={nominee.imageUrl}
                                                alt={nominee.nomineeName}
                                                fill
                                                className={`object-cover transition-transform duration-700 ${nominee.isWinner ? 'group-hover:scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                        )}

                                        {/* Status OVERLAYS */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {nominee.isWinner && (
                                                <Badge className="bg-accent text-black font-sans uppercase tracking-[0.2em] font-bold text-xs px-3 py-1 border-none shadow-md flex items-center shadow-accent/20">
                                                    <Medal className="w-3 h-3 mr-1" />
                                                    Winner
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-6 md:p-8 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-widest font-sans font-bold">
                                            <span className="text-gray-400">{nominee.year?.year}</span>
                                            <span className="text-accent">{nominee.category?.type || "General"}</span>
                                        </div>

                                        <h4 className="text-2xl font-bold font-thai text-black dark:text-white leading-[1.3] group-hover:text-accent transition-colors mb-2">
                                            {nominee.nomineeName}
                                        </h4>

                                        {nominee.workTitle && (
                                            <p className="text-gray-600 dark:text-gray-400 font-thai font-medium mb-4 text-base">
                                                {nominee.workTitle}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800/50">
                                            <p className="text-sm font-bold font-thai text-black dark:text-white mb-1">{nominee.category?.name || "ไม่ระบุสาขา"}</p>
                                            <p className="text-xs font-thai text-gray-500 uppercase">{nominee.broadcastingChannel || "ไม่ระบุสังกัด"}</p>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border border-dashed border-gray-200 dark:border-zinc-800 rounded-sm">
                            <Award className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold font-thai text-black dark:text-white mb-2">ไม่พบผลการค้นหา</h3>
                            <p className="text-gray-500 font-thai">กรุณาลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นๆ</p>
                        </div>
                    )}
                </div>

                {/* Load More Pagination Placeholder */}
                {filteredNominees.length >= 50 && (
                    <div className="mt-16 text-center pt-8">
                        <Button variant="outline" size="lg" className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold uppercase tracking-widest text-sm rounded-none h-14 px-12 bg-transparent transition-all duration-300">
                            Load More Results
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
