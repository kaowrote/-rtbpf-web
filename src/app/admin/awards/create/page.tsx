"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminAwardsCreatePage() {
    const router = useRouter();

    const [isWinner, setIsWinner] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [yearId, setYearId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [nomineeName, setNomineeName] = useState("");
    const [workTitle, setWorkTitle] = useState("");
    const [broadcastingChannel, setBroadcastingChannel] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [gallery, setGallery] = useState<string[]>([]);

    const [years, setYears] = useState<{ id: string; year: number }[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [yearsRes, catRes] = await Promise.all([
                    fetch("/api/awards/years").then(res => res.json()),
                    fetch("/api/awards/categories").then(res => res.json())
                ]);

                if (yearsRes.success) setYears(yearsRes.data || []);
                if (catRes.success) setCategories(catRes.data || []);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!yearId || !categoryId || !nomineeName) {
            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ปี, สาขา, ชื่อผู้เข้าชิง)");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/awards/nominees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    yearId,
                    categoryId,
                    nomineeName,
                    workTitle,
                    broadcastingChannel,
                    imageUrl,
                    isWinner,
                    videoUrl,
                    gallery,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Failed to save nominee");
            }

            // Success
            router.push("/admin/awards");
            router.refresh();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="pb-6 border-b border-gray-200 dark:border-zinc-800">
                <Link href="/admin/awards" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Awards
                </Link>
                <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">Add Nominee</h1>
                <p className="text-gray-500 mt-2 font-thai">เพิ่มรายชื่อผู้เข้าชิงหรือผู้ชนะรางวัลนาฏราช</p>
            </div>

            <form className="space-y-8" onSubmit={handleSave}>
                {/* Award Info */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#C9A84C]" />
                        Award Info
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ปีรางวัล *</label>
                            <Select value={yearId} onValueChange={setYearId} disabled={isFetchingData}>
                                <SelectTrigger className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus:ring-[#C9A84C]">
                                    <SelectValue placeholder={isFetchingData ? "กำลังโหลด..." : "เลือกปี"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10">
                                    {years.map((y) => (
                                        <SelectItem key={y.id} value={y.id} className="font-sans cursor-pointer" title={y.year.toString()}>
                                            {y.year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">สาขารางวัล *</label>
                            <Select value={categoryId} onValueChange={setCategoryId} disabled={isFetchingData}>
                                <SelectTrigger aria-label="Select Award Category" title="Select Award Category" className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus:ring-[#C9A84C]">
                                    <SelectValue placeholder={isFetchingData ? "กำลังโหลด..." : "เลือกสาขา"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-none dark:bg-[#111] dark:border-white/10">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id} className="font-thai cursor-pointer" title={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Nominee Details */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Nominee Details</h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ชื่อผู้เข้าชิง / ชื่อรายการ *</label>
                                <Input
                                    value={nomineeName}
                                    onChange={(e) => setNomineeName(e.target.value)}
                                    placeholder="เช่น ธนวรรธน์ วรรธนะภูติ หรือ มาตาลดา"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ชื่อผลงาน</label>
                                <Input
                                    value={workTitle}
                                    onChange={(e) => setWorkTitle(e.target.value)}
                                    placeholder="เช่น พรหมลิขิต, เกมรักทรยศ"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ช่อง / สถานี</label>
                            <Input
                                value={broadcastingChannel}
                                onChange={(e) => setBroadcastingChannel(e.target.value)}
                                placeholder="เช่น ช่อง 3 HD, One31, Thai PBS"
                                className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">รูปภาพ</label>
                            <div className="max-w-xs">
                                <ImageUpload
                                    value={imageUrl || undefined}
                                    onChange={(url) => setImageUrl(url)}
                                    folder="awards"
                                    label=""
                                    aspectRatio="aspect-square"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP (สูงสุด 5MB) แนะนำอัตราส่วน 1:1</p>
                        </div>
                    </div>
                </div>

                {/* Multimedia Support */}
                <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Multimedia & Highlights</h2>
                    
                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Link วิดีโอ (YouTube / Vimeo)</label>
                            <Input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="เช่น https://www.youtube.com/watch?v=..."
                                className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                            />
                            <p className="text-xs text-gray-400 mt-2">ลิงก์วิดีโอแนะนำผลงาน หรือคลิปประกาศรางวัล</p>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">คลังภาพผลงาน (Gallery)</label>
                            <MultiImageUpload
                                value={gallery}
                                onChange={(urls) => setGallery(urls)}
                                folder="awards/gallery"
                            />
                            <p className="text-xs text-gray-400 mt-2">เพิ่มรูปภาพบรรยากาศหรือเบื้องหลังผลงาน (สูงสุด 10 รูป)</p>
                        </div>

                        {/* Winner Toggle */}
                        <div className="flex items-center justify-between p-6 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl">
                            <div>
                                <h3 className="font-bold text-black dark:text-white font-thai text-lg">🏆 ผู้ชนะรางวัล (Winner)?</h3>
                                <p className="text-sm text-gray-500 font-thai">ทำเครื่องหมายหากผลงานนี้ได้รับรางวัลนาฏราช</p>
                            </div>
                            <button
                                type="button"
                                title="Toggle Winner"
                                aria-label="Toggle Winner"
                                onClick={() => setIsWinner(!isWinner)}
                                className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${isWinner ? "bg-[#C9A84C]" : "bg-gray-300 dark:bg-zinc-600"}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${isWinner ? "translate-x-9" : "translate-x-1"}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-4">
                    <Link href="/admin/awards">
                        <Button type="button" variant="outline" className="rounded-none border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 uppercase tracking-widest text-xs font-bold px-8 h-12 bg-transparent">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading || isFetchingData} className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-8 h-12 transition-colors disabled:opacity-50">
                        {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Nominee"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
