"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Clock, Loader2, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TipTapEditor from "@/components/admin/TipTapEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import TranslationManager from "@/components/admin/TranslationManager";

export default function ArticleEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [viewCount, setViewCount] = useState(0);
    const [tags, setTags] = useState("");
    const [authorName, setAuthorName] = useState("Unknown");

    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`);
                const resData = await response.json();

                if (!response.ok || !resData.success) {
                    throw new Error(resData?.error?.message || "Failed to fetch article");
                }

                const article = resData.data;
                setTitle(article.title || "");
                setSlug(article.slug || "");

                // Convert content back to string if it was saved as HTML string previously.
                // Assuming content is either an array of blocks or a string wrapper.
                // For this project, TipTap stores HTML strings directly unless custom block logic is used.
                let contentStr = "";
                if (typeof article.content === 'string') {
                    contentStr = article.content;
                } else if (Array.isArray(article.content) && article.content.length > 0) {
                    // Temporary fallback if content is array format 
                    contentStr = JSON.stringify(article.content);
                }
                setContent(contentStr);

                setFeaturedImage(article.featuredImage || null);

                if (article.author?.name) {
                    setAuthorName(article.author.name);
                }

                setViewCount(article.viewCount || 0);
                if (article.tags && Array.isArray(article.tags)) {
                    setTags(article.tags.join(", "));
                }

                if (article.scheduledAt) {
                    const dateObj = new Date(article.scheduledAt);
                    setPublishDate(dateObj.toISOString().split("T")[0]);
                    setPublishTime(dateObj.toISOString().split("T")[1].slice(0, 5));
                } else if (article.publishedAt) {
                    const dateObj = new Date(article.publishedAt);
                    setPublishDate(dateObj.toISOString().split("T")[0]);
                    setPublishTime(dateObj.toISOString().split("T")[1].slice(0, 5));
                }

            } catch (error) {
                console.error("Error fetching article:", error);
                alert("Could not load article data. It may have been deleted.");
                router.push("/admin/articles");
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchArticle();
    }, [id, router]);

    const handleSave = async (status: "DRAFT" | "PUBLISHED" | "SCHEDULED") => {
        if (!title.trim()) {
            alert("กรุณากรอกหัวข้อบทความ");
            return;
        }

        setIsLoading(true);

        try {
            // Re-generate slug if needed or keep existing. Here we keep existing if not empty
            const articleSlug = slug || title.trim().toLowerCase().replace(/[^a-z0-9ก-๙เแโใไ]/g, '-').replace(/-+/g, '-');

            let scheduledAt = null;
            if (publishDate) {
                scheduledAt = new Date(`${publishDate}T${publishTime || "00:00"}:00`).toISOString();
            }

            const response = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug: articleSlug,
                    content, // Can parse blocks if needed, saving HTML string for now
                    featuredImage,
                    status,
                    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                    scheduledAt: status === "SCHEDULED" ? scheduledAt : null,
                    publishedAt: status === "PUBLISHED" ? scheduledAt : undefined, // Using the same date/time logic for published vs scheduled
                    viewCount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || "Failed to update article");
            }

            router.push("/admin/articles");
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles">
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 dark:border-zinc-800 rounded-none bg-white dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold font-thai tracking-tight uppercase text-black dark:text-white">Edit Article</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => handleSave("DRAFT")}
                        disabled={isLoading}
                        variant="outline"
                        className="h-10 rounded-none border-gray-200 dark:border-zinc-800 font-bold uppercase tracking-widest text-xs bg-white dark:bg-[#0a0a0a] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => handleSave("PUBLISHED")}
                        disabled={isLoading}
                        className="h-10 rounded-none font-bold uppercase tracking-widest text-xs bg-[#1B2A4A] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-[#C9A84C] transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Update
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {/* Title & SEO Slug */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-sans">Article Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="พิมพ์หัวข้อข่าวหรือบทความที่นี่..."
                            className="text-lg font-thai font-semibold h-14 border-gray-200 dark:border-zinc-800 focus-visible:ring-[#C9A84C]"
                        />
                        <div className="mt-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-sans">URL Slug</label>
                            <Input
                                value={slug!}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="article-slug-url"
                                className="font-mono text-xs border-gray-200 dark:border-zinc-800 focus-visible:ring-[#C9A84C]"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <TipTapEditor value={content} onChange={setContent} />
                    </div>
                </div>

                {/* Sidebar (Publish Settings) */}
                <div className="col-span-1 space-y-6">
                    {/* NEW: AI Translation Module */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <TranslationManager entityId={id} entityType="ARTICLE" />
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl space-y-6">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Publish Date</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <Input
                                        type="date"
                                        value={publishDate}
                                        onChange={(e) => setPublishDate(e.target.value)}
                                        className="border-0 shadow-none font-sans text-sm h-10 bg-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Schedule Time (Optional)</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <Input
                                        type="time"
                                        value={publishTime}
                                        onChange={(e) => setPublishTime(e.target.value)}
                                        className="border-0 shadow-none font-sans text-sm h-10 bg-transparent"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 font-thai">เพื่อตั้งเวลาเผยแพร่ข่าวล่วงหน้า</p>
                            </div>

                            <Button
                                onClick={() => handleSave("SCHEDULED")}
                                disabled={isLoading || !publishDate || !publishTime}
                                variant="outline"
                                className="w-full h-10 rounded-none border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors uppercase tracking-widest text-[10px] font-bold"
                            >
                                <Clock className="w-3.5 h-3.5 mr-2" />
                                Schedule Post
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Tags (แท็กข่าว)</h3>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">ใส่แท็กคั่นด้วยเครื่องหมายจุลภาค (,)</label>
                                <Input 
                                    placeholder="เช่น รางวัลนาฏราช, ละครดี, 2024" 
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="border-gray-200 dark:border-zinc-800 focus-visible:ring-[#C9A84C] font-thai text-sm" 
                                />
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {tags.split(",").map((tag, i) => tag.trim() && (
                                        <div key={i} className="px-2 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold rounded uppercase">
                                            #{tag.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Featured Image</h3>

                        <div className="mt-4">
                            <ImageUpload
                                value={featuredImage || undefined}
                                onChange={(url) => setFeaturedImage(url)}
                                folder="articles"
                                label=""
                                aspectRatio="aspect-[4/3]"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Statistics</h3>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Manual View Count</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                     <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                         <Eye className="w-4 h-4 text-gray-500" />
                                     </div>
                                     <Input 
                                         type="number" 
                                         value={viewCount} 
                                         onChange={(e) => setViewCount(parseInt(e.target.value) || 0)} 
                                         className="border-0 shadow-none font-sans text-sm h-10 bg-transparent" 
                                         title="View Count"
                                     />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 font-thai">ปรับเปลี่ยนยอดผู้ชมบทความได้ที่นี่</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Author Information</h3>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Original Author</label>
                                <Input readOnly value={authorName} className="bg-gray-50 dark:bg-zinc-900 h-10 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
