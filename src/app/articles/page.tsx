"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_FEATURED_ARTICLE = {
    id: "feat-1",
    title: "ประกาศผลรางวัลนาฏราช ครั้งที่ 16: รางวัลแห่งความภาคภูมิใจ",
    excerpt: "ร่วมชื่นชมและแสดงความยินดีกับผลงานยอดเยี่ยมแห่งปี ในงานประกาศผลรางวัลที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย...",
    category: "Feature Story",
    date: "25 May 2024",
    imageUrl: "https://images.unsplash.com/photo-1516280440503-62f808790089?q=80&w=2670&auto=format&fit=crop",
};

const MOCK_ARTICLES = [
    {
        id: "1",
        title: "สมาพันธ์สมาคมวิชาชีพฯ จัดเสวนาทิศทางสื่อไทยในยุคดิจิทัล",
        excerpt: "ร่วมกันค้นหาทางออกและปรับตัวกับความเปลี่ยนแปลงของเทคโนโลยีที่มีต่ออุตสาหกรรม...",
        category: "News",
        date: "14 May 2024",
        imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "ก้าวต่อไปของ 'นาฏราช' สู่มาตรฐานสากล",
        excerpt: "เปิดวิสัยทัศน์คณะกรรมการจัดงาน กับการตั้งเป้าหมายยกระดับรางวัลเทียบชั้นเอ็มมีอวอร์ดส์...",
        category: "Interview",
        date: "02 May 2024",
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "อบรมเชิงปฏิบัติการ ผู้ผลิตรายการโทรทัศน์ยุคใหม่",
        excerpt: "เปิดรับสมัครผู้ที่สนใจเข้าร่วมอบรมฟรี จำนวนจำกัด 50 ท่านเท่านั้น...",
        category: "Events",
        date: "28 Apr 2024",
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "รวมผลงานเข้าชิง 'สารคดียอดเยี่ยม' ที่น่าจับตามอง",
        excerpt: "เจาะลึกเบื้องหลังการถ่ายทำและประเด็นสังคมที่ผลงานสารคดีแต่ละเรื่องต้องการสื่อสาร...",
        category: "Editorial",
        date: "20 Apr 2024",
        imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "5",
        title: "อัพเดทตารางกิจกรรมสมาพันธ์ฯ ประจำปี 2024",
        excerpt: "เช็คปฏิทินขององค์กรตลอดปี เพื่อไม่ให้พลาดทุกนัดหมายสำคัญของคนในวงการ...",
        category: "Announcements",
        date: "15 Apr 2024",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "6",
        title: "สัมภาษณ์พิเศษ 5 ผู้กำกับหน้าใหม่มาแรงแห่งปี",
        excerpt: "แง้มไอเดียร้อยประสบการณ์ของผู้กำกับเจเนอเรชันใหม่ที่กำลังเปลี่ยนโฉมวงการ...",
        category: "Interview",
        date: "10 Apr 2024",
        imageUrl: "https://images.unsplash.com/photo-1523995462485-3d171b5c4fac?q=80&w=2670&auto=format&fit=crop",
    },
];

export default function ArticlesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* 1. PAGE HEADER */}
            <section className="w-full bg-gray-50 dark:bg-[#050505] py-16 md:py-24 border-b border-gray-200 dark:border-white/10">
                <div className="container px-6 mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-thai text-black dark:text-white uppercase tracking-wider mb-4">
                        News <span className="text-accent">&</span> Articles
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-thai max-w-2xl mx-auto">
                        ติดตามทุกความเคลื่อนไหว บทความพิเศษ และข่าวสารสำคัญของวงการสื่อสารมวลชนไทย
                    </p>
                </div>
            </section>

            {/* 2. FEATURED ARTICLE */}
            <section className="container px-6 mx-auto py-12 md:py-16">
                <Link href={`/articles/${MOCK_FEATURED_ARTICLE.id}`} className="group block">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100 dark:bg-zinc-900">
                        <Image
                            src={MOCK_FEATURED_ARTICLE.imageUrl}
                            alt={MOCK_FEATURED_ARTICLE.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            priority
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12 lg:p-16">
                            <Badge className="bg-accent text-black hover:bg-white uppercase tracking-widest text-xs px-3 py-1 mb-4 w-fit rounded-none font-bold">
                                {MOCK_FEATURED_ARTICLE.category}
                            </Badge>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-thai text-white leading-tight mb-4 group-hover:text-gray-200 transition-colors">
                                {MOCK_FEATURED_ARTICLE.title}
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 font-thai max-w-3xl line-clamp-2 md:line-clamp-3 mb-6 font-light">
                                {MOCK_FEATURED_ARTICLE.excerpt}
                            </p>
                            <div className="flex items-center text-white/80 text-sm font-sans uppercase tracking-widest font-semibold">
                                <Clock className="w-4 h-4 mr-2" />
                                {MOCK_FEATURED_ARTICLE.date}
                                <span className="mx-4 text-white/30">|</span>
                                <span className="flex items-center text-accent group-hover:text-white transition-colors">
                                    Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* 3. ARTICLES GRID */}
            <section className="container px-6 mx-auto pb-24">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-2xl font-bold font-thai text-black dark:text-white uppercase tracking-wider">
                        Latest Updates
                    </h3>
                    <div className="hidden sm:flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-none border-gray-200 dark:border-white/10 text-xs uppercase tracking-widest bg-transparent">All</Button>
                        <Button variant="ghost" size="sm" className="rounded-none text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10">News</Button>
                        <Button variant="ghost" size="sm" className="rounded-none text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10">Interview</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-10">
                    {MOCK_ARTICLES.map((article) => (
                        <Link key={article.id} href={`/articles/${article.id}`} className="group flex flex-col md:flex-row gap-6 md:gap-10 border-b border-gray-200 dark:border-white/10 pb-10">
                            {/* Image Left */}
                            <div className="relative w-full md:w-5/12 lg:w-1/3 aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 shrink-0">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                />
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans">
                                    {article.category}
                                </div>
                            </div>

                            {/* Content Right */}
                            <div className="flex flex-col flex-1 py-2 justify-center">
                                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-xs uppercase font-sans font-bold mb-3 tracking-wider">
                                    <span>{article.date}</span>
                                </div>
                                <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug mb-4">
                                    {article.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 font-thai text-base md:text-lg leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center text-sm font-bold uppercase tracking-widest text-[#1B2A4A] dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors mt-auto">
                                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Pagination */}
                <div className="mt-16 text-center border-t border-gray-200 dark:border-white/10 pt-16">
                    <Button variant="outline" size="lg" className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-12 bg-transparent transition-all duration-300 border-2">
                        Load More News
                    </Button>
                </div>
            </section>

        </div>
    );
}
