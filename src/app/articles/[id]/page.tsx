import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Facebook, Twitter, Link2, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id: slug } = await params;

    const article = await prisma.article.findUnique({
        where: { slug, status: "PUBLISHED" },
        select: { title: true, excerpt: true, featuredImage: true }
    });

    if (!article) {
        return { title: 'Article Not Found | RTBPF' };
    }

    const defaultImage = "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop";
    const coverImage = article.featuredImage || defaultImage;

    return {
        title: `${article.title} | RTBPF`,
        description: article.excerpt || "ข่าวสารและบทความจากสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF)",
        openGraph: {
            title: article.title,
            description: article.excerpt || "",
            images: [coverImage],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt || "",
            images: [coverImage],
        }
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params;

    const article = await prisma.article.findUnique({
        where: { slug, status: "PUBLISHED" },
        include: {
            category: true,
            author: true
        }
    });

    if (!article) {
        notFound();
    }

    const dateObj = article.publishedAt || article.createdAt;
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(dateObj);

    // Fetch related articles
    const relatedArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            id: { not: article.id },
            ...(article.categoryId ? { categoryId: article.categoryId } : {})
        },
        orderBy: { publishedAt: "desc" },
        take: 2,
        include: { category: true }
    });

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* 1. HERO IMAGE */}
            <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end">
                {article.featuredImage ? (
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-900 border-b border-gray-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-tr from-black/90 via-black/40 to-transparent"></div>

                {/* Title Overlay */}
                <div className="container relative z-10 px-6 mx-auto pb-12 md:pb-24">
                    <Link href="/articles" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                        Back to News
                    </Link>

                    <div className="max-w-4xl">
                        {article.category && (
                            <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-xs uppercase tracking-widest mb-4">
                                {article.category.name}
                            </Badge>
                        )}
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-thai text-white leading-[1.15] mb-6">
                            {article.title}
                        </h1>

                        {/* Meta details */}
                        <div className="flex flex-wrap items-center gap-6 text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-[#C9A84C]" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center">
                                By {article.author?.name || "RTBPF"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ARTICLE CONTENT */}
            <section className="container mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left Column: Social Share & Side Elements */}
                    <aside className="lg:w-1/4 pt-2 order-2 lg:order-1 hidden lg:block">
                        <div className="sticky top-32">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Share Story</h3>
                            <div className="flex lg:flex-col gap-4">
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-800 hover:text-[#C9A84C] hover:border-[#C9A84C] dark:hover:border-[#C9A84C] text-black dark:text-white bg-transparent">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-800 hover:text-[#C9A84C] hover:border-[#C9A84C] dark:hover:border-[#C9A84C] text-black dark:text-white bg-transparent">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-zinc-800 hover:text-[#C9A84C] hover:border-[#C9A84C] dark:hover:border-[#C9A84C] text-black dark:text-white bg-transparent">
                                    <Link2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Right/Center Column: Main Text */}
                    <article className="lg:w-3/4 order-1 lg:order-2">
                        {article.excerpt && (
                            <p className="text-xl md:text-2xl lg:text-3xl font-thai font-semibold text-[#C9A84C] leading-snug mb-16 border-l-4 border-[#C9A84C] pl-6 md:pl-8 italic">
                                &quot;{article.excerpt}&quot;
                            </p>
                        )}

                        <div
                            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-thai text-gray-800 dark:text-gray-200 leading-relaxed font-light tiptap"
                            dangerouslySetInnerHTML={{ __html: article.content as string }}
                        />

                        {/* Mobile share block */}
                        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 lg:hidden flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Share:</span>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon" className="rounded-full hover:text-[#C9A84C]"><Facebook className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:text-[#C9A84C]"><Twitter className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:text-[#C9A84C]"><Link2 className="h-5 w-5" /></Button>
                            </div>
                        </div>
                    </article>

                </div>
            </section>

            {/* 3. RELATED ARTICLES */}
            {relatedArticles.length > 0 && (
                <section className="bg-gray-50 dark:bg-[#050505] py-16 md:py-24 border-t border-gray-200 dark:border-zinc-800">
                    <div className="container mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12 border-b border-gray-200 dark:border-zinc-800 pb-6">
                            <h2 className="text-2xl md:text-4xl font-bold font-thai text-black dark:text-white uppercase tracking-wide">
                                Related Stories
                            </h2>
                            <Link href="/articles" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#1B2A4A] dark:text-white hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors">
                                View All <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {relatedArticles.map((related) => {
                                const relatedDateObj = related.publishedAt || related.createdAt;
                                const relatedFormattedDate = new Intl.DateTimeFormat('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).format(relatedDateObj);

                                return (
                                    <Link key={related.id} href={`/articles/${related.slug}`} className="group flex flex-col md:flex-row gap-6 items-center bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all pr-6 rounded-sm overflow-hidden">
                                        <div className="relative w-full md:w-5/12 aspect-[4/3] bg-gray-100 dark:bg-zinc-900 shrink-0">
                                            {related.featuredImage ? (
                                                <Image
                                                    src={related.featuredImage}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800" />
                                            )}
                                        </div>
                                        <div className="w-full md:w-7/12 py-6 flex flex-col justify-center">
                                            {related.category && (
                                                <Badge className="bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 rounded-sm px-2 py-1 font-sans text-[10px] uppercase tracking-widest mb-3 w-fit border-none shadow-none">
                                                    {related.category.name}
                                                </Badge>
                                            )}
                                            <h3 className="text-xl font-bold font-thai text-black dark:text-white group-hover:text-[#C9A84C] transition-colors leading-snug mb-4">
                                                {related.title}
                                            </h3>
                                            <span className="text-xs uppercase tracking-widest font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                                Read Now &rarr;
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}
