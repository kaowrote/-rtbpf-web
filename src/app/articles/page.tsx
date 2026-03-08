import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate cache every 60 seconds

export const metadata: Metadata = {
    title: "News & Articles | RTBPF",
    description: "ติดตามทุกความเคลื่อนไหว บทความพิเศษ และข่าวสารสำคัญของวงการสื่อสารมวลชนไทย โดยสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
    openGraph: {
        title: "News & Articles | RTBPF",
        description: "ติดตามทุกความเคลื่อนไหว บทความพิเศษ และข่าวสารสำคัญของวงการสื่อสารมวลชนไทย",
        type: "website",
    },
};

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const tag = params.tag;
    const pageSize = 9; // Show 9 items per page (1 featured + 8 list on pg 1, 9 list on pg > 1)
    const skip = (page - 1) * pageSize;

    // Fetch published articles
    const [articlesData, totalCount, defaultImageSetting] = await Promise.all([
        prisma.article.findMany({
            where: {
                status: "PUBLISHED",
                ...(tag ? { tags: { has: tag } } : {})
            },
            orderBy: {
                publishedAt: "desc"
            },
            include: {
                category: true,
            },
            skip,
            take: pageSize
        }),
        prisma.article.count({
            where: {
                status: "PUBLISHED",
                ...(tag ? { tags: { has: tag } } : {})
            }
        }),
        prisma.systemSetting.findUnique({
            where: { key: "defaultNewsImageUrl" }
        })
    ]);

    const defaultImageUrl = defaultImageSetting?.value || "/rtbpf-default-news.png";

    const articles = articlesData.map(article => {
        // Handle generic fallback formatting
        const dateObj = article.publishedAt || article.createdAt;
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(dateObj);

        return {
            id: article.id,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt || "อ่านรายละเอียดเพิ่มเติม...",
            category: article.category?.name || "News",
            date: formattedDate,
            imageUrl: article.featuredImage || defaultImageUrl,
        };
    });

    // Make the first article the featured one ONLY on the first page
    const isFirstPage = page === 1;
    const featuredArticle = (isFirstPage && articles.length > 0) ? articles[0] : null;
    const remainingArticles = (isFirstPage && articles.length > 1)
        ? articles.slice(1)
        : (!isFirstPage ? articles : []);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* 1. PAGE HEADER */}
            <section className="w-full bg-gray-50 dark:bg-[#050505] py-16 md:py-24 border-b border-gray-200 dark:border-white/10">
                <div className="container px-6 mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-thai text-black dark:text-white uppercase tracking-wider mb-4">
                        News <span className="text-[#C9A84C]">&</span> Articles
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-thai max-w-2xl mx-auto">
                        {tag ? `แสดงบทความที่มีข้อความกำกับ: #${tag}` : "ติดตามทุกความเคลื่อนไหว บทความพิเศษ และข่าวสารสำคัญของวงการสื่อสารมวลชนไทย"}
                    </p>
                    {tag && (
                        <Link href="/articles" className="inline-block mt-6 text-[#C9A84C] hover:underline font-sans text-sm font-bold uppercase tracking-widest">
                            &times; Clear Filter
                        </Link>
                    )}
                </div>
            </section>

            {/* 2. FEATURED ARTICLE (Page 1 only) */}
            {featuredArticle && (
                <section className="container px-6 mx-auto py-12 md:py-16">
                    <Link href={`/articles/${featuredArticle.slug}`} className="group block">
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                            <Image
                                src={featuredArticle.imageUrl}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                priority
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12 lg:p-16">
                                <Badge className="bg-[#C9A84C] text-black hover:bg-white uppercase tracking-widest text-xs px-3 py-1 mb-4 w-fit rounded-none font-bold border-none">
                                    {featuredArticle.category}
                                </Badge>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-thai text-white leading-tight mb-4 group-hover:text-gray-200 transition-colors line-clamp-2">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-300 font-thai max-w-3xl line-clamp-2 md:line-clamp-3 mb-6 font-light">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center text-white/80 text-sm font-sans uppercase tracking-widest font-semibold">
                                    <Clock className="w-4 h-4 mr-2 text-[#C9A84C]" />
                                    {featuredArticle.date}
                                    <span className="mx-4 text-white/30">|</span>
                                    <span className="flex items-center text-[#C9A84C] group-hover:text-white transition-colors">
                                        Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* 3. ARTICLES GRID */}
            <section className={`container px-6 mx-auto ${featuredArticle ? 'pb-24' : 'py-24'}`}>
                {remainingArticles.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-white/10">
                            <h3 className="text-2xl font-bold font-thai text-black dark:text-white uppercase tracking-wider">
                                {tag ? `Results for #${tag}` : (isFirstPage ? "Latest Updates" : `All News - Page ${page}`)}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-y-10">
                            {remainingArticles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col md:flex-row gap-6 md:gap-10 border-b border-gray-200 dark:border-white/10 pb-10">
                                    {/* Image Left */}
                                    <div className="relative w-full md:w-5/12 lg:w-1/3 aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 shrink-0 border border-gray-200 dark:border-zinc-800">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans border border-white/10">
                                            {article.category}
                                        </div>
                                    </div>

                                    {/* Content Right */}
                                    <div className="flex flex-col flex-1 py-2 justify-center">
                                        <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-xs uppercase font-sans font-bold mb-3 tracking-wider">
                                            <span>{article.date}</span>
                                        </div>
                                        <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold font-thai text-black dark:text-white group-hover:text-[#C9A84C] transition-colors leading-snug mb-4">
                                            {article.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 font-thai text-base md:text-lg leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center text-sm font-bold uppercase tracking-widest text-[#1B2A4A] dark:text-white group-hover:text-[#C9A84C] dark:group-hover:text-[#C9A84C] transition-colors mt-auto">
                                            Read Article <ArrowRight className="ml-2 w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-8">
                                <div className="text-sm text-gray-500 font-sans tracking-widest uppercase hidden sm:block">
                                    Page {page} of {totalPages}
                                </div>
                                <div className="flex flex-1 sm:flex-none justify-between gap-4">
                                    <Link href={`/articles?page=${page - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`} className="w-1/2 sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full border-black dark:border-white/20 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-8 bg-transparent transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                                            disabled={page <= 1}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Prev
                                        </Button>
                                    </Link>
                                    <Link href={`/articles?page=${page + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`} className="w-1/2 sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full border-black dark:border-white/20 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-8 bg-transparent transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                                            disabled={page >= totalPages}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center text-gray-500 min-h-[40vh] flex flex-col items-center justify-center">
                        <p className="text-lg font-thai font-semibold">ยังไม่มีบทความในขณะนี้</p>
                        {page > 1 && (
                            <Link href="/articles" className="mt-4 text-[#C9A84C] hover:underline uppercase tracking-widest font-sans text-sm font-bold">
                                กลับหน้าแรก
                            </Link>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
