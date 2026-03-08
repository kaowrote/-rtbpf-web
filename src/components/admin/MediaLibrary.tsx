"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
    Search, 
    X, 
    Loader2, 
    Image as ImageIcon, 
    Filter, 
    Check, 
    Trash2, 
    ExternalLink,
    FileText,
    Calendar,
    User,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface MediaItem {
    id: string;
    url: string;
    path: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    folder: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

interface MediaLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    allowMultiple?: boolean;
    title?: string;
}

export default function MediaLibrary({
    isOpen,
    onClose,
    onSelect,
    allowMultiple = false,
    title = "คลังสื่อส่วนกลาง (Media Library)"
}: MediaLibraryProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
                limit: "18",
            });
            if (activeTab !== "all") params.append("folder", activeTab);

            const res = await fetch(`/api/admin/media?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setMediaItems(data.data);
                setTotal(data.meta.total);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, activeTab]);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen, fetchMedia]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchMedia();
    };

    const handleSelect = () => {
        if (selectedItem) {
            onSelect(selectedItem.url);
            onClose();
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedItem || !confirm("คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์นี้อย่างถาวร?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/upload", {
                method: "DELETE",
                body: JSON.stringify({ path: selectedItem.path }),
            });
            if (res.ok) {
                setSelectedItem(null);
                fetchMedia();
            }
        } catch (error) {
            console.error("Failed to delete media:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-[#0a0a0a] border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <DialogTitle className="text-xl font-bold font-thai tracking-tight flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#C9A84C]" />
                            {title}
                        </DialogTitle>
                        <p className="text-xs text-gray-500 font-thai mt-1">เลือกรูปภาพหรืสื่อที่เคยอัปโหลดไว้แล้วในระบบ</p>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100 dark:border-white/5">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex flex-wrap gap-4 items-center">
                            <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    placeholder="ค้นหาชื่อไฟล์..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-10 bg-white dark:bg-black border-zinc-200 dark:border-white/10 rounded-lg text-sm"
                                />
                            </form>

                            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }} className="w-auto">
                                <TabsList className="bg-white dark:bg-black border border-white/10 h-10 p-1">
                                    <TabsTrigger value="all" className="text-xs rounded-md">ทั้งหมด</TabsTrigger>
                                    <TabsTrigger value="articles" className="text-xs rounded-md">ข่าวสาร</TabsTrigger>
                                    <TabsTrigger value="events" className="text-xs rounded-md">กิจกรรม</TabsTrigger>
                                    <TabsTrigger value="awards" className="text-xs rounded-md">รางวัล</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Button variant="ghost" size="icon" onClick={() => fetchMedia()} className="h-10 w-10 text-gray-500 hover:text-black dark:hover:text-white">
                                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </Button>
                        </div>

                        {/* Media Grid */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin" />
                                    <p className="text-sm font-thai text-gray-500">กำลังเข้าถึงคลังข้อมูล...</p>
                                </div>
                            ) : mediaItems.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {mediaItems.map((item) => (
                                        <div 
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            className={cn(
                                                "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                                                selectedItem?.id === item.id 
                                                    ? "border-[#C9A84C] ring-4 ring-[#C9A84C]/10" 
                                                    : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/20"
                                            )}
                                        >
                                            <Image 
                                                src={item.url} 
                                                alt={item.originalName} 
                                                fill 
                                                className="object-cover"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                                            />
                                            {selectedItem?.id === item.id && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-[#C9A84C] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                                    <Check className="w-4 h-4 text-black font-bold" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                <p className="text-[10px] text-white font-medium truncate w-full">{item.originalName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-bold font-thai text-black dark:text-white">ยังไม่มีรูปภาพในคลัง</h3>
                                    <p className="text-sm text-gray-500 font-thai mt-1">อัปโหลดรูปภาพใหม่ผ่านหน้าสร้างเนื้อหา เพื่อบันทึกลงในคลัง</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                                <p className="text-xs text-gray-500 font-sans">
                                    Showing <span className="font-bold text-black dark:text-white">{mediaItems.length}</span> of <span className="font-bold text-black dark:text-white">{total}</span> items
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="h-8 border-white/10"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xs font-bold text-black dark:text-white px-3">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="h-8 border-white/10"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Details Area */}
                    <div className="w-80 flex flex-col pt-6 overflow-y-auto">
                        {selectedItem ? (
                            <div className="px-6 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">File Details</h3>
                                    <Badge variant="outline" className="text-[9px] uppercase border-[#C9A84C]/20 text-[#C9A84C]">
                                        {selectedItem.folder}
                                    </Badge>
                                </div>

                                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg bg-black/5">
                                    <Image src={selectedItem.url} alt="Preview" fill className="object-contain" />
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">File Name</span>
                                        <p className="text-sm font-medium text-black dark:text-white break-all">{selectedItem.originalName}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">File Type</span>
                                            <p className="text-xs font-medium text-black dark:text-white flex items-center gap-1.5 uppercase">
                                                <FileText className="w-3 h-3" />
                                                {selectedItem.type.split('/')[1]}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">File Size</span>
                                            <p className="text-xs font-medium text-black dark:text-white">{formatSize(selectedItem.size)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Uploaded Date</span>
                                        <p className="text-xs font-medium text-black dark:text-white flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            {dayjs(selectedItem.createdAt).format("DD MMM YYYY, HH:mm")}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Uploaded By</span>
                                        <p className="text-xs font-medium text-black dark:text-white flex items-center gap-1.5">
                                            <User className="w-3 h-3" />
                                            {selectedItem.user?.name || "System"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start text-xs border-white/10"
                                        asChild
                                    >
                                        <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3 h-3 mr-2" />
                                            View Original File
                                        </a>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        className="w-full justify-start text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Trash2 className="w-3 h-3 mr-2" />}
                                        Delete Forever
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                <Filter className="w-12 h-12 text-gray-200 dark:text-gray-800 mb-4" />
                                <p className="text-sm text-gray-500 font-thai">เลือกรูปภาพเพื่อดูรายละเอียดและใช้งาน</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0a0a0a]">
                    <div className="flex gap-3 w-full sm:w-auto ml-auto">
                        <Button variant="ghost" onClick={onClose} className="rounded-lg px-6 font-bold uppercase tracking-widest text-[10px]">
                            ยกเลิก
                        </Button>
                        <Button 
                            onClick={handleSelect} 
                            disabled={!selectedItem}
                            className="bg-[#C9A84C] hover:bg-[#B39540] text-black rounded-lg px-8 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-[#C9A84C]/20"
                        >
                            Select Media
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
