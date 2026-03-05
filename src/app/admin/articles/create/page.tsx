"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Globe, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TipTapEditor from "@/components/admin/TipTapEditor";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ArticleCreatePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
        if (!title.trim()) {
            alert("กรุณากรอกหัวข้อบทความ");
            return;
        }

        setIsLoading(true);

        try {
            // Generate a simple slug from title
            const baseSlug = title.trim().toLowerCase().replace(/[^a-z0-9ก-๙เแโใไ]/g, '-').replace(/-+/g, '-');
            const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

            let scheduledAt = null;
            if (publishDate) {
                scheduledAt = new Date(`${publishDate}T${publishTime || "00:00"}:00`).toISOString();
            }

            const response = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug,
                    content, // Can parse blocks if needed, saving HTML string for now
                    featuredImage,
                    status,
                    scheduledAt,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || "Failed to save article");
            }

            router.push("/admin/articles");
            router.refresh();
        } catch (error: any) {
            alert(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles">
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 dark:border-zinc-800 rounded-none bg-white dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold font-thai tracking-tight uppercase text-black dark:text-white">New Article</h1>
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
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                        Publish
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
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <TipTapEditor value={content} onChange={setContent} />
                    </div>
                </div>

                {/* Sidebar (Publish Settings) */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl space-y-6">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
                                <div className="flex items-center p-3 border border-gray-200 dark:border-zinc-800 rounded bg-gray-50 dark:bg-zinc-900">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                                    <span className="font-semibold text-sm">Draft</span>
                                </div>
                            </div>

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
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Author & Publisher</h3>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Author (ผู้เขียน)</label>
                                <Input placeholder="Select Author" readOnly value="Admin 1" className="bg-gray-50 dark:bg-zinc-900 h-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
