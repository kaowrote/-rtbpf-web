"use client";

import React, { useState } from "react";
import {
    Camera, BarChart3, Palette, Sparkles, Monitor, PencilLine, Film, Square,
    Wand2, Loader2, RefreshCcw, Check, ImageIcon, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AiImageGeneratorProps {
    articleTitle: string;
    onImageGenerated: (url: string) => void;
}

const STYLES = [
    { id: "news", label: "ภาพข่าว", labelEn: "News Photo", icon: Camera, color: "bg-blue-500" },
    { id: "infographic", label: "อินโฟกราฟิก", labelEn: "Infographic", icon: BarChart3, color: "bg-emerald-500" },
    { id: "illustration", label: "Illustration", labelEn: "Illustration", icon: Palette, color: "bg-purple-500" },
    { id: "anime", label: "อะนิเมะ", labelEn: "Anime", icon: Sparkles, color: "bg-pink-500" },
    { id: "digital", label: "Digital Art", labelEn: "Digital Art", icon: Monitor, color: "bg-indigo-500" },
    { id: "sketch", label: "วาดมือ", labelEn: "Sketch", icon: PencilLine, color: "bg-amber-600" },
    { id: "cinematic", label: "Cinematic", labelEn: "Cinematic", icon: Film, color: "bg-red-500" },
    { id: "minimal", label: "Minimal", labelEn: "Minimal/Flat", icon: Square, color: "bg-zinc-500" },
];

const ASPECT_RATIOS = [
    { id: "16:9", label: "16:9", desc: "ปกข่าว" },
    { id: "1:1", label: "1:1", desc: "โซเชียล" },
    { id: "4:3", label: "4:3", desc: "บทความ" },
];

export default function AiImageGenerator({ articleTitle, onImageGenerated }: AiImageGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState("news");
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [customPrompt, setCustomPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!articleTitle?.trim()) {
            toast.error("กรุณากรอกหัวข้อบทความก่อนสร้างภาพ");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedUrl(null);

        try {
            const response = await fetch("/api/ai-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: articleTitle,
                    style: selectedStyle,
                    aspectRatio,
                    customPrompt,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "สร้างภาพไม่สำเร็จ");
            }

            setGeneratedUrl(result.data.url);
            toast.success("สร้างภาพสำเร็จ!");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseAscover = () => {
        if (generatedUrl) {
            onImageGenerated(generatedUrl);
            toast.success("ตั้งเป็นภาพปกแล้ว");
        }
    };

    const selectedStyleObj = STYLES.find(s => s.id === selectedStyle);

    return (
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
            {/* Header — Click to toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Wand2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold uppercase tracking-widest text-xs text-black dark:text-white">AI IMAGE</h3>
                        <p className="text-[10px] text-gray-400 font-thai">สร้างภาพประกอบด้วย AI</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="px-5 pb-5 space-y-5 border-t border-gray-100 dark:border-zinc-800 pt-4">
                    {/* Style Grid */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Style โหมดภาพ</label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center ${
                                        selectedStyle === style.id
                                            ? "border-[#cfb659] bg-[#cfb659]/5 ring-1 ring-[#cfb659]/30"
                                            : "border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600"
                                    }`}
                                    title={style.labelEn}
                                >
                                    <div className={`w-7 h-7 rounded-md ${style.color} flex items-center justify-center`}>
                                        <style.icon className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300 leading-tight font-thai truncate w-full">
                                        {style.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Aspect Ratio อัตราส่วน</label>
                        <div className="flex gap-2">
                            {ASPECT_RATIOS.map((ar) => (
                                <button
                                    key={ar.id}
                                    onClick={() => setAspectRatio(ar.id)}
                                    className={`flex-1 py-2 px-3 text-center rounded-md border transition-all ${
                                        aspectRatio === ar.id
                                            ? "border-[#cfb659] bg-[#cfb659]/5 text-[#cfb659]"
                                            : "border-gray-200 dark:border-zinc-700 text-gray-500 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-xs font-bold font-mono">{ar.label}</div>
                                    <div className="text-[9px] text-gray-400 font-thai">{ar.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                            คำสั่งเพิ่มเติม (Optional)
                        </label>
                        <Input
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="เช่น สีโทนทอง, มีธงชาติไทย, เพิ่มกราฟ..."
                            className="h-9 text-xs font-thai border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 focus-visible:ring-[#cfb659] rounded-md"
                        />
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !articleTitle?.trim()}
                        className="w-full h-11 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                กำลังสร้างภาพ...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                ✨ สร้างภาพ AI ({selectedStyleObj?.label})
                            </>
                        )}
                    </Button>

                    {/* Loading Animation */}
                    {isGenerating && (
                        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 p-8 text-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            <div className="relative">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse shadow-xl shadow-violet-500/30">
                                    <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-sm font-bold text-violet-700 dark:text-violet-300 font-thai">AI กำลังสร้างภาพ...</p>
                                <p className="text-[10px] text-violet-500 dark:text-violet-400 mt-1 font-thai">อาจใช้เวลา 10-30 วินาที</p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                            <p className="text-xs text-red-600 dark:text-red-400 font-thai">{error}</p>
                        </div>
                    )}

                    {/* Generated Image Preview */}
                    {generatedUrl && (
                        <div className="space-y-3">
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-md">
                                <img
                                    src={generatedUrl}
                                    alt="AI Generated"
                                    className="w-full h-auto"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider rounded-md">
                                        {selectedStyleObj?.label}  •  {aspectRatio}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUseAscover}
                                    className="flex-1 h-10 rounded-lg bg-[#000] dark:bg-white text-white dark:text-black hover:bg-[#cfb659] dark:hover:bg-[#cfb659] font-bold uppercase tracking-widest text-[10px] transition-colors"
                                >
                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                    ใช้เป็นภาพปก
                                </Button>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    variant="outline"
                                    className="h-10 rounded-lg border-gray-200 dark:border-zinc-700 font-bold uppercase tracking-widest text-[10px]"
                                >
                                    <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                                    สร้างใหม่
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
