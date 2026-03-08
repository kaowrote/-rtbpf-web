"use client";

import React, { useState, useEffect } from "react";
import { Globe, Sparkles, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Language {
    code: string;
    name: string;
    nativeName: string;
    isDefault: boolean;
}

interface Translation {
    languageCode: string;
    status: string;
}

interface TranslationManagerProps {
    entityId: string;
    entityType: "ARTICLE" | "EVENT" | "AWARD" | "CATEGORY";
}

export default function TranslationManager({ entityId, entityType }: TranslationManagerProps) {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [translations, setTranslations] = useState<Record<string, Translation>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isTranslating, setIsTranslating] = useState<string | null>(null); // null, "all", or "langCode"

    const fetchStatus = async () => {
        try {
            const [langRes, transRes] = await Promise.all([
                fetch("/api/admin/languages"),
                fetch(`/api/admin/translate?entityId=${entityId}&entityType=${entityType}`)
            ]);

            const langData = await langRes.json();
            const transData = await transRes.json();

            if (langData.success) setLanguages(langData.data);
            if (transData.success) {
                const transMap: Record<string, Translation> = {};
                transData.data.forEach((t: any) => {
                    transMap[t.languageCode] = t;
                });
                setTranslations(transMap);
            }
        } catch (error) {
            console.error("Error fetching translation status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [entityId, entityType]);

    const handleTranslate = async (targetLang?: string) => {
        const targetLanguages = targetLang ? [targetLang] : languages.filter(l => !l.isDefault).map(l => l.code);
        
        if (targetLanguages.length === 0) return;

        setIsTranslating(targetLang || "all");
        toast.info(targetLang ? `กำลังแปลเป็นภาษา ${targetLang}...` : "กำลังแปลเป็นทุกภาษาด้วย AI...");

        try {
            const response = await fetch("/api/admin/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    entityId,
                    entityType,
                    targetLanguages
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("การแปลภาษาด้วย AI สำเร็จแล้ว");
                fetchStatus();
            } else {
                toast.error(result.error?.message || "เกิดข้อผิดพลาดในการแปลภาษา");
            }
        } catch (error) {
            toast.error("ไม่สามารถเชื่อมต่อระบบ AI ได้");
        } finally {
            setIsTranslating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">AI Multi-language</h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] text-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 px-2"
                    onClick={() => handleTranslate()}
                    disabled={!!isTranslating}
                >
                    {isTranslating === "all" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    Translate All
                </Button>
            </div>

            <div className="space-y-2">
                {languages.map((lang) => {
                    const status = translations[lang.code]?.status;
                    const isDefault = lang.isDefault;

                    return (
                        <div key={lang.code} className="flex items-center justify-between group p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 transition-all hover:border-[#C9A84C]/30">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold uppercase ${isDefault ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {lang.code}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-black dark:text-white leading-tight">{lang.name}</span>
                                    <span className="text-[9px] text-gray-400">{lang.nativeName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isDefault ? (
                                    <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none rounded-none text-[8px] tracking-widest uppercase py-0 px-1">Source</Badge>
                                ) : status ? (
                                    <div className="flex items-center gap-1.5">
                                        <Badge className="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-none rounded-none text-[8px] tracking-widest uppercase py-0 px-1">
                                            {status.replace('_', ' ')}
                                        </Badge>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 text-gray-400 hover:text-[#C9A84C]"
                                            onClick={() => handleTranslate(lang.code)}
                                            disabled={!!isTranslating}
                                        >
                                            <RefreshCw className={`w-3 h-3 ${isTranslating === lang.code ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-6 text-[9px] font-bold uppercase tracking-wider py-0 px-2 border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                                        onClick={() => handleTranslate(lang.code)}
                                        disabled={!!isTranslating}
                                    >
                                        {isTranslating === lang.code ? <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" /> : <Sparkles className="w-2.5 h-2.5 mr-1" />}
                                        Translate
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <p className="text-[9px] text-gray-400 font-thai italic text-center">
                * ใช้ Google Gemini 2.0 Flash ในการแปลเนื้อหาโดยรักษาโครงสร้าง TipTap Editor
            </p>
        </div>
    );
}
