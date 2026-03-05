"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Facebook, Twitter, Link2, Calendar, ArrowRight, PlayCircle, Instagram, MessageCircle, Heart, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ===== TYPES สำหรับ โครงสร้างเนื้อหา =====
type ContentBlock =
    | { type: "paragraph"; value: string }
    | { type: "quote"; value: string; author?: string }
    | { type: "image"; url: string; caption?: string; source?: string }
    | { type: "gallery"; images: { url: string; caption?: string }[]; source?: string }
    | { type: "youtube"; videoId: string; title?: string }
    | { type: "youtube_short"; videoId: string; title?: string }
    | { type: "tiktok_embed"; videoId: string; author?: string }
    | { type: "facebook_reel"; url: string }
    | { type: "social"; platform: "instagram" | "twitter" | "facebook" | "tiktok"; author: string; handle: string; content: string; date: string; imageUrl?: string; likes?: string; comments?: string };

// ===== ข้อมูลจำลองอิงตามโครงสร้างเนื้อหาแบบ Rich Content =====
const MOCK_ARTICLE_DETAIL = {
    id: "feat-1",
    title: "เก็บตกบรรยากาศ งานประกาศผลรางวัลนาฏราช ครั้งที่ 16: รางวัลแห่งความภาคภูมิใจ",
    excerpt: "ประมวลภาพความประทับใจ คลิปไฮไลท์ และกระแสในโซเชียลมีเดียจากค่ำคืนที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย",
    category: "Feature Story",
    date: "26 May 2024",
    author: "กองบรรณาธิการ RTBPF",
    imageUrl: "https://images.unsplash.com/photo-1516280440503-62f808790089?q=80&w=2670&auto=format&fit=crop",
    contentBlocks: [
        {
            type: "paragraph",
            value: "ค่ำคืนแห่งเกียรติยศที่ทุกคนรอคอยได้ผ่านพ้นไปแล้วอย่างยิ่งใหญ่ สำหรับงานประกาศผลรางวัลนาฏราช ครั้งที่ 16 ประจำปี 2024 ซึ่งจัดขึ้น ณ หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย ท่ามกลางบรรยากาศสุดเอ็กซ์คลูซีฟ ที่รวบรวมเหล่าคนบันเทิง ผู้จัด ผู้กำกับ และสื่อมวลชนชั้นนำของประเทศไว้ในงานเดียว"
        },
        {
            type: "youtube",
            videoId: "dQw4w9WgXcQ", // ใช้ ID วิดีโอจริง หรือ Mock ก็ได้
            title: "บรรยากาศเดินพรมแดง งานนาฏราช ครั้งที่ 16"
        },
        {
            type: "paragraph",
            value: "บรรยากาศการเดินพรมแดง (Red Carpet) ในปีนี้เต็มไปด้วยสีสันและความอลังการ เหล่านักแสดงและผู้เข้าชิงต่างจัดเต็มในชุดราตรีและสูทสุดหรู เรียกเสียงแฟลชจากกองทัพนักข่าวได้อย่างล้นหลาม เราได้รวบรวมภาพเดี่ยวของนักแสดงนำที่คุณชื่นชอบมาไว้ที่นี่"
        },
        {
            type: "image",
            url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
            caption: "ผู้กำกับและนักแสดงนำจากละครฟอร์มยักษ์แห่งปี ร่วมเดินพรมแดง",
            source: "RTBPF Official Photographer"
        },
        {
            type: "paragraph",
            value: "นอกจากภาพเดี่ยวแล้ว บรรยากาศการรวมตัวของทีมนักแสดงแต่ละเรื่องก็เป็นโมเมนต์ที่น่าประทับใจไม่แพ้กัน ด้านล่างนี้คือแกลเลอรี่ภาพบรรยากาศรวมๆ ที่แสดงให้เห็นถึงความอบอุ่นและความผูกพันของคนทำงานเบื้องหน้าและเบื้องหลัง"
        },
        {
            type: "gallery",
            source: "เครดิตภาพนำมาจาก: สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
            images: [
                { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop", caption: "ทีมนักแสดงชายยอดเยี่ยม" },
                { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop", caption: "ผู้เข้าชิงนักแสดงนำหญิง" },
                { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop", caption: "บรรยากาศบนเวทีรับรางวัล" },
            ]
        },
        {
            type: "quote",
            value: "รางวัลนี้ไม่ใช่แค่ของผมคนเดียว แต่เป็นของทีมงานทุกคนที่เหน็ดเหนื่อยมาด้วยกันตลอดหนึ่งปีเต็ม ขอชื่นชมเวทีนาฏราชที่ยังคงรักษามาตรฐานความศักดิ์สิทธิ์ของรางวัลไว้",
            author: "ตัวแทนผู้ได้รับรางวัลสาขาละครยอดเยี่ยม"
        },
        {
            type: "paragraph",
            value: "กระแสในโลกออนไลน์ก็คึกคักไม่แพ้กัน แฮชแท็ก #นาฏราช16 ติดเทรนด์อันดับ 1 ใน X (ทวิตเตอร์) ตลอดทั้งคืนที่มีการประกาศผล แฟนคลับต่างร่วมส่งกำลังใจและแสดงความยินดีกับเมนของตัวเอง รวมไปถึงการแชร์ภาพและความรู้สึกผ่านช่องทางต่างๆ อย่างล้นหลาม"
        },
        {
            type: "social",
            platform: "twitter",
            author: "Thai Drama Update",
            handle: "@thaidramaupdate",
            content: "ยินดีด้วยกับทุกรางวัลในค่ำคืนนี้! ปีนี้การแข่งขันดุเดือดมาก คณะกรรมการทำงานหนักแน่นอน และผลที่ออกมาก็เหมาะสม สมมงทุกประการ 👏✨ #นาฏราช16 #NatarajaAwards",
            date: "10:45 PM · May 25, 2024",
            likes: "12.5K",
            comments: "842"
        },
        {
            type: "social",
            platform: "instagram",
            author: "นักแสดงนำหญิงยอดเยี่ยม",
            handle: "@bestactress_official",
            content: "ขอบคุณสมาพันธ์ฯ และคณะกรรมการทุกท่าน ค่ำคืนนี้เหมือนความฝันเลยค่ะ 🏆 🤍 #NatarajaAwards2024",
            date: "May 25, 2024",
            imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop",
            likes: "154K",
            comments: "2,130"
        },
        {
            type: "youtube_short",
            videoId: "bWMkY1wWc1Y", // ตัวอย่าง YouTube Short 
            title: "บรรยากาศหลังเวที"
        },
        {
            type: "tiktok_embed",
            videoId: "7236577889393849999", // จำลอง ID ของ TikTok
            author: "@rtbpfofficial"
        },
        {
            type: "facebook_reel",
            url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F123456789&show_text=false&width=340&height=600"
        },
        {
            type: "paragraph",
            value: "สำหรับท่านที่พลาดการถ่ายทอดสด สามารถรับชมเทปบันทึกภาพย้อนหลังแบบเต็มๆ และเจาะลึกบทสัมภาษณ์สุดพิเศษของผู้ชนะทุกสาขาได้ผ่านทางช่อง YouTube หลักของสมาพันธ์ฯ และเตรียมพบกับความยิ่งใหญ่ในครั้งต่อไปปีหน้า"
        }
    ],
    relatedArticles: [
        {
            id: "1",
            title: "สรุปผลรางวัลนาฏราช ครั้งที่ 16 ใครคว้ารางวัลใหญ่บ้าง?",
            category: "News",
            imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop",
        },
        {
            id: "2",
            title: "เจาะลึกเกณฑ์การตัดสิน 'สารคดียอดเยี่ยม' ที่ได้รับการยกย่อง",
            category: "Editorial",
            imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
        }
    ]
} as const;

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const article = MOCK_ARTICLE_DETAIL;

    // Component สำหรับ Render Block แต่ละประเภท
    const renderBlock = (block: ContentBlock, index: number) => {
        switch (block.type) {
            case "paragraph":
                return (
                    <p key={index} className={`mb-8 ${index === 0 ? 'font-bold text-black dark:text-white' : ''}`}>
                        {block.value}
                    </p>
                );

            case "quote":
                return (
                    <blockquote key={index} className="my-16 border-t border-b border-gray-200 dark:border-zinc-800 py-10 text-center px-4 md:px-12 bg-gray-50/50 dark:bg-zinc-900/30">
                        <span className="block text-2xl md:text-3xl font-thai font-bold text-black dark:text-white mb-6 leading-relaxed">
                            &quot;{block.value}&quot;
                        </span>
                        {block.author && (
                            <cite className="text-sm font-sans uppercase tracking-widest text-accent font-bold not-italic">
                                ผู้กล่าว: {block.author}
                            </cite>
                        )}
                    </blockquote>
                );

            case "image":
                return (
                    <figure key={index} className="my-12">
                        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-gray-100 dark:bg-zinc-900 overflow-hidden group">
                            <Image src={block.url} alt={block.caption || "Article image"} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        {(block.caption || block.source) && (
                            <figcaption className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-sm font-thai text-gray-500 dark:text-gray-400">
                                <span>{block.caption}</span>
                                {block.source && <span className="font-sans uppercase text-xs tracking-widest mt-1 sm:mt-0">Source: {block.source}</span>}
                            </figcaption>
                        )}
                    </figure>
                );

            case "gallery":
                return (
                    <div key={index} className="my-12">
                        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(block.images.length, 3)} gap-4`}>
                            {block.images.map((img, i) => (
                                <div key={i} className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-zinc-900 group">
                                    <Image src={img.url} alt={`Gallery image ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                        {block.source && (
                            <p className="mt-4 text-xs font-sans uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">
                                {block.source}
                            </p>
                        )}
                    </div>
                );

            case "youtube":
                return (
                    <div key={index} className="my-12 bg-black w-full rounded-sm overflow-hidden shadow-xl aspect-video relative group border border-gray-200 dark:border-zinc-800">
                        {/* Using a placeholder cover with a play button to avoid slow loading iframes in demo, 
                  but providing the actual iframe code structure. */}
                        <iframe
                            className="w-full h-full absolute top-0 left-0"
                            src={`https://www.youtube.com/embed/${block.videoId}?controls=1&rel=0`}
                            title={block.title || "YouTube video player"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );

            case "youtube_short":
                return (
                    <div key={index} className="my-12 flex justify-center">
                        <div className="bg-black w-full max-w-[320px] sm:max-w-[350px] rounded-xl overflow-hidden shadow-xl aspect-[9/16] relative group border border-gray-200 dark:border-zinc-800">
                            <iframe
                                className="w-full h-full absolute top-0 left-0"
                                src={`https://www.youtube.com/embed/${block.videoId}?controls=1&rel=0`}
                                title={block.title || "YouTube Short player"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                );

            case "tiktok_embed":
                return (
                    <div key={index} className="my-12 flex justify-center">
                        {/* TikTok Embed usually requires their script. Here we mock visually with iframe for layout demo */}
                        <div className="bg-white dark:bg-[#111] w-full max-w-[325px] rounded-xl overflow-hidden shadow-md aspect-[9/16] relative border border-gray-200 dark:border-zinc-800">
                            <iframe
                                className="w-full h-full absolute top-0 left-0"
                                src={`https://www.tiktok.com/embed/v2/${block.videoId}?lang=th-TH`}
                                title="TikTok video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                        </div>
                    </div>
                );

            case "facebook_reel":
                return (
                    <div key={index} className="my-12 flex justify-center">
                        <div className="bg-white dark:bg-[#111] w-full max-w-[340px] rounded-xl overflow-hidden shadow-md aspect-[9/16] relative border border-gray-200 dark:border-zinc-800">
                            <iframe
                                className="w-full h-full absolute top-0 left-0 border-none overflow-hidden"
                                src={block.url}
                                title="Facebook Reel player"
                                scrolling="no"
                                frameBorder="0"
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                    </div>
                );

            case "social":
                return (
                    <div key={index} className="my-12 flex justify-center">
                        <div className="w-full max-w-md bg-white dark:bg-[#111] border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                            {/* Social Header */}
                            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-lg overflow-hidden relative">
                                        {block.imageUrl ? <Image src={block.imageUrl} alt="Avatar" fill className="object-cover" /> : block.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-black dark:text-white leading-tight">{block.author}</p>
                                        <p className="text-xs text-gray-500">{block.handle}</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {block.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                                    {block.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                                    {block.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                                    {block.platform === 'tiktok' && <div className="font-bold font-sans italic">TikTok</div>}
                                </div>
                            </div>

                            {/* Optional Social Post Image */}
                            {block.platform === 'instagram' && block.imageUrl && (
                                <div className="w-full aspect-square relative bg-zinc-100 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800/50">
                                    <Image src={block.imageUrl} alt="Post Image" fill className="object-cover" />
                                </div>
                            )}

                            {/* Social Content */}
                            <div className="p-4">
                                <p className="text-sm font-thai text-black dark:text-white leading-relaxed mb-3">
                                    {block.content}
                                </p>
                                <p className="text-xs text-gray-500 mb-4">{block.date}</p>

                                {/* Social Actions (Mock) */}
                                <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-zinc-800/50 text-gray-500">
                                    <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors">
                                        <Heart className="w-5 h-5" /> <span className="text-xs font-semibold">{block.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                                        <MessageCircle className="w-5 h-5" /> <span className="text-xs font-semibold">{block.comments}</span>
                                    </div>
                                    {block.platform === 'twitter' && (
                                        <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors">
                                            <Repeat2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* 1. HERO IMAGE */}
            <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end">
                <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-tr from-black/90 via-black/40 to-transparent"></div>

                {/* Title Overlay */}
                <div className="container relative z-10 px-6 mx-auto pb-12 md:pb-24">
                    <Link href="/articles" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                        Back to News
                    </Link>

                    <div className="max-w-4xl">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 rounded-none px-3 py-1 font-sans text-xs uppercase tracking-widest mb-4">
                            {article.category}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-thai text-white leading-[1.15] mb-6">
                            {article.title}
                        </h1>

                        {/* Meta details */}
                        <div className="flex flex-wrap items-center gap-6 text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-[#C9A84C]" />
                                {article.date}
                            </span>
                            <span className="flex items-center">
                                By {article.author}
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
                        <p className="text-xl md:text-2xl lg:text-3xl font-thai font-semibold text-[#C9A84C] leading-snug mb-16 border-l-4 border-[#C9A84C] pl-6 md:pl-8 italic">
                            &quot;{article.excerpt}&quot;
                        </p>

                        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-thai text-gray-800 dark:text-gray-200 leading-relaxed font-light">
                            {/* Render blocks dynamically */}
                            {(article.contentBlocks as any).map((block: any, index: number) => renderBlock(block, index))}
                        </div>

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
                        {article.relatedArticles.map((related) => (
                            <Link key={related.id} href={`/articles/${related.id}`} className="group flex flex-col md:flex-row gap-6 items-center bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all pr-6 rounded-sm overflow-hidden">
                                <div className="relative w-full md:w-5/12 aspect-[4/3] bg-gray-100 dark:bg-zinc-900 shrink-0">
                                    <Image
                                        src={related.imageUrl}
                                        alt={related.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="w-full md:w-7/12 py-6 flex flex-col justify-center">
                                    <Badge className="bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 rounded-sm px-2 py-1 font-sans text-[10px] uppercase tracking-widest mb-3 w-fit border-none shadow-none">
                                        {related.category}
                                    </Badge>
                                    <h3 className="text-xl font-bold font-thai text-black dark:text-white group-hover:text-[#C9A84C] transition-colors leading-snug mb-4">
                                        {related.title}
                                    </h3>
                                    <span className="text-xs uppercase tracking-widest font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Read Now &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
