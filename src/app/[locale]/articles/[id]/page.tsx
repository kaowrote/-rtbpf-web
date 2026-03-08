import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Facebook, Twitter, Link2, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
    const { id: slug, locale } = await params;

    const article = await prisma.article.findUnique({
        where: { slug, status: "PUBLISHED" },
        include: {
            translations: {
                where: { languageCode: locale }
            }
        } as any
    });

    const defaultImageSetting = await prisma.systemSetting.findUnique({
        where: { key: "defaultNewsImageUrl" }
    });

    if (!article) {
        return { title: 'Article Not Found | RTBPF' };
    }

    const defaultImage = defaultImageSetting?.value || "/rtbpf-default-news.png";
    const coverImage = article.featuredImage || defaultImage;

    const articleAny = article as any;
    const title = articleAny.translations?.[0]?.title || article.title;
    const description = articleAny.translations?.[0]?.excerpt || article.excerpt || "ข่าวสารและบทความจากสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF)";

    return {
        title: `${title} | RTBPF`,
        description,
        openGraph: {
            title,
            description,
            images: [coverImage],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [coverImage],
        }
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id: slug, locale } = await params;
    const t = await getTranslations("Articles");

    // Fetch and increment view count
    const article = await prisma.article.update({
        where: { slug, status: "PUBLISHED" },
        data: { viewCount: { increment: 1 } },
        include: {
            category: true,
            author: true,
            translations: {
                where: { languageCode: locale }
            }
        } as any
    }).catch(async (e) => {
        // Fallback to just find if update fails (e.g. not published yet but previewing)
        return await prisma.article.findUnique({
            where: { slug },
            include: {
                category: true,
                author: true,
                translations: {
                    where: { languageCode: locale }
                }
            } as any
        });
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

    const defaultImageSetting = await prisma.systemSetting.findUnique({
        where: { key: "defaultNewsImageUrl" }
    });
    const defaultImageUrl = defaultImageSetting?.value || "/rtbpf-default-news.png";

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

    const displayTitle = (article as any).translations?.[0]?.title || article.title;
    const displayExcerpt = (article as any).translations?.[0]?.excerpt || article.excerpt;
    const displayContent = (article as any).translations?.[0]?.content ? ((article as any).translations[0].content as string) : (article.content as string);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* 1. HERO IMAGE */}
            <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end">
                <Image
                    src={article.featuredImage || defaultImageUrl}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-tr from-black/90 via-black/40 to-transparent"></div>

                {/* Title Overlay */}
                <div className="container relative z-10 px-6 mx-auto pb-12 md:pb-24">
                    <Link href="/articles" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                        {t("backToNews")}
                    </Link>

                    <div className="max-w-4xl">
                        {article.category && (
                            <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-xs uppercase tracking-widest mb-4">
                                {(article.category as any).name}
                            </Badge>
                        )}
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-thai text-white leading-[1.15] mb-6">
                            {displayTitle}
                        </h1>

                        {/* Meta details */}
                        <div className="flex flex-wrap items-center gap-6 text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-[#C9A84C]" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center">
                                {t("by")} {(article as any).author?.name || "RTBPF"}
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
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">{t("shareStory")}</h3>
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
                        {displayExcerpt && (
                            <p className="text-xl md:text-2xl lg:text-3xl font-thai font-semibold text-[#C9A84C] leading-snug mb-16 border-l-4 border-[#C9A84C] pl-6 md:pl-8 italic">
                                &quot;{displayExcerpt}&quot;
                            </p>
                        )}

                        <div
                            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-thai text-gray-800 dark:text-gray-200 leading-relaxed font-light tiptap"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />

                        {/* Article Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-zinc-800">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">{t("relatedTags")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <Link 
                                            key={tag} 
                                            href={`/articles?tag=${encodeURIComponent(tag)}`}
                                            className="px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 font-thai text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all rounded-sm uppercase tracking-wider"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile share block */}
                        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 lg:hidden flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">{t("share")}</span>
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
                                {t("related")}
                            </h2>
                            <Link href="/articles" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#1B2A4A] dark:text-white hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors">
                                {t("viewAll")} <ArrowRight className="ml-2 w-4 h-4" />
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
                                                {t("readNow")} &rarr;
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
