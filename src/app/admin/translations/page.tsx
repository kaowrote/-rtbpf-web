"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Globe, Sparkles, CheckCircle2, XCircle, Clock, Eye, RefreshCw,
    Languages, BarChart3, FileText, Loader2, ChevronDown, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const LANGUAGES = [
    { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
];

interface TranslationItem {
    id: string;
    entityType: string;
    entityId: string;
    languageCode: string;
    title: string | null;
    excerpt: string | null;
    content: any;
    status: string;
    confidenceScore: number | null;
    createdAt: string;
    updatedAt: string;
    article?: { title: string; slug: string };
    event?: { title: string; slug: string };
}

interface TranslationStats {
    total: number;
    byStatus: Record<string, number>;
    byLanguage: Record<string, number>;
}

export default function TranslationsPage() {
    const [translations, setTranslations] = useState<TranslationItem[]>([]);
    const [stats, setStats] = useState<TranslationStats>({ total: 0, byStatus: {}, byLanguage: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTranslation, setSelectedTranslation] = useState<TranslationItem | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterLang, setFilterLang] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isBatchTranslating, setIsBatchTranslating] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingExcerpt, setEditingExcerpt] = useState("");

    const fetchTranslations = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin/translations");
            const data = await res.json();
            if (data.success) {
                setTranslations(data.data.translations || []);
                setStats(data.data.stats || { total: 0, byStatus: {}, byLanguage: {} });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/translations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "APPROVED" }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("อนุมัติการแปลภาษาแล้ว");
                fetchTranslations();
                setSelectedTranslation(null);
            }
        } catch { toast.error("เกิดข้อผิดพลาด"); }
    };

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/translations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "REJECTED" }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("ปฏิเสธการแปลภาษา");
                fetchTranslations();
                setSelectedTranslation(null);
            }
        } catch { toast.error("เกิดข้อผิดพลาด"); }
    };

    const handleSaveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/translations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editingTitle,
                    excerpt: editingExcerpt,
                    status: "APPROVED",
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("บันทึกและอนุมัติเรียบร้อย");
                fetchTranslations();
                setSelectedTranslation(null);
            }
        } catch { toast.error("เกิดข้อผิดพลาด"); }
    };

    const handleBatchTranslate = async () => {
        setIsBatchTranslating(true);
        toast.info("เริ่มแปลทุกภาษาสำหรับบทความที่ยังไม่ได้แปล...");
        try {
            const res = await fetch("/api/admin/translations/batch", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success(`แปลสำเร็จ ${data.data.success} ภาษา, ล้มเหลว ${data.data.failed}`);
                fetchTranslations();
            }
        } catch { toast.error("เกิดข้อผิดพลาด"); }
        finally { setIsBatchTranslating(false); }
    };

    const filteredTranslations = translations.filter((t) => {
        if (filterStatus !== "all" && t.status !== filterStatus) return false;
        if (filterLang !== "all" && t.languageCode !== filterLang) return false;
        if (searchQuery && !t.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getStatusBadge = (status: string) => {
        const map: Record<string, { color: string; label: string }> = {
            PENDING: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "รอแปล" },
            AUTO_GENERATED: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "AI แปลแล้ว" },
            APPROVED: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "อนุมัติ" },
            REJECTED: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "ปฏิเสธ" },
        };
        const s = map[status] || map.PENDING;
        return <Badge className={`${s.color} border-none text-[10px] font-bold uppercase tracking-wider`}>{s.label}</Badge>;
    };

    const getLangFlag = (code: string) => LANGUAGES.find((l) => l.code === code)?.flag || "🌐";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                        <Languages className="w-6 h-6 text-[#cfb659]" />
                        Translation Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">จัดการการแปลเนื้อหาด้วย AI Gemini 2.0 Flash</p>
                </div>
                <Button
                    onClick={handleBatchTranslate}
                    disabled={isBatchTranslating}
                    className="bg-gradient-to-r from-[#1b294b] to-[#2a3d6b] text-white hover:from-[#cfb659] hover:to-[#b89f3e] hover:text-[#1b294b] transition-all"
                >
                    {isBatchTranslating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Batch Translate All
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest mb-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Total
                    </div>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-widest mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> AI Generated
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.byStatus?.AUTO_GENERATED || 0}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 text-green-500 text-xs uppercase tracking-widest mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.byStatus?.APPROVED || 0}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
                    <div className="flex items-center gap-2 text-yellow-500 text-xs uppercase tracking-widest mb-2">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.PENDING || 0}</p>
                </div>
            </div>

            {/* Language Coverage */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3">Language Coverage</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {LANGUAGES.filter(l => l.code !== "th").map((lang) => (
                        <div key={lang.code} className="text-center">
                            <div className="text-2xl mb-1">{lang.flag}</div>
                            <div className="text-xs font-bold text-black dark:text-white">{lang.code.toUpperCase()}</div>
                            <div className="text-[10px] text-gray-400">{stats.byLanguage?.[lang.code] || 0} items</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white w-64"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white px-3 py-2"
                >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="PENDING">รอแปล</option>
                    <option value="AUTO_GENERATED">AI แปลแล้ว</option>
                    <option value="APPROVED">อนุมัติ</option>
                    <option value="REJECTED">ปฏิเสธ</option>
                </select>
                <select
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value)}
                    className="text-sm border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white px-3 py-2"
                >
                    <option value="all">ภาษาทั้งหมด</option>
                    {LANGUAGES.filter(l => l.code !== "th").map((l) => (
                        <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                </select>
            </div>

            {/* Translations List */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredTranslations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <Globe className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">ยังไม่มีการแปลภาษา</p>
                        <p className="text-xs mt-1">กดปุ่ม &ldquo;Batch Translate All&rdquo; เพื่อเริ่มแปลด้วย AI</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {filteredTranslations.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                                onClick={() => {
                                    setSelectedTranslation(t);
                                    setEditingTitle(t.title || "");
                                    setEditingExcerpt(t.excerpt || "");
                                }}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="text-xl">{getLangFlag(t.languageCode)}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-black dark:text-white truncate">
                                            {t.title || "(ยังไม่มีหัวข้อ)"}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {t.entityType} • {t.languageCode.toUpperCase()} • {new Date(t.updatedAt).toLocaleDateString("th-TH")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(t.status)}
                                    {t.confidenceScore && (
                                        <span className="text-[10px] text-gray-400">{Math.round(t.confidenceScore * 100)}%</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Side-by-side Review Modal */}
            {selectedTranslation && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedTranslation(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{getLangFlag(selectedTranslation.languageCode)}</span>
                                <h2 className="text-lg font-bold text-black dark:text-white">
                                    Review Translation
                                </h2>
                                {getStatusBadge(selectedTranslation.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleReject(selectedTranslation.id)}>
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleSaveEdit(selectedTranslation.id)}>
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve & Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedTranslation(null)}>✕</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-gray-100 dark:divide-zinc-800">
                            {/* Source (Thai) */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm">🇹🇭</span>
                                    <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none text-[10px] font-bold uppercase">Source (TH)</Badge>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Title</label>
                                        <p className="text-sm font-semibold text-black dark:text-white mt-1 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                            {selectedTranslation.article?.title || selectedTranslation.event?.title || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Translated */}
                            <div className="p-5 bg-gray-50/50 dark:bg-zinc-800/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm">{getLangFlag(selectedTranslation.languageCode)}</span>
                                    <Badge className="bg-[#cfb659]/10 text-[#cfb659] border-none text-[10px] font-bold uppercase">
                                        Translated ({selectedTranslation.languageCode.toUpperCase()})
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Title (Editable)</label>
                                        <input
                                            type="text"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            className="w-full text-sm p-3 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Excerpt (Editable)</label>
                                        <textarea
                                            value={editingExcerpt}
                                            onChange={(e) => setEditingExcerpt(e.target.value)}
                                            rows={3}
                                            className="w-full text-sm p-3 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white mt-1 resize-none"
                                        />
                                    </div>
                                    {selectedTranslation.confidenceScore && (
                                        <div className="text-[10px] text-gray-400">
                                            AI Confidence: {Math.round(selectedTranslation.confidenceScore * 100)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
