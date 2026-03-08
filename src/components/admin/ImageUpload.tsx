"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
    /** Current image URL */
    value?: string;
    /** Callback when image is uploaded or removed */
    onChange: (url: string | null) => void;
    /** Folder path in storage (e.g., "articles", "events", "avatars") */
    folder?: string;
    /** Label text */
    label?: string;
    /** Aspect ratio class (e.g., "aspect-video", "aspect-square") */
    aspectRatio?: string;
    /** Additional class names */
    className?: string;
    /** Disable the upload */
    disabled?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    folder = "general",
    label = "Upload Image",
    aspectRatio = "aspect-video",
    className,
    disabled = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
        async (originalFile: File) => {
            setError(null);
            setIsUploading(true);

            try {
                let file = originalFile;

                // Compress image if it's larger than 1MB
                if (file.size > 1024 * 1024) {
                    try {
                        const options = {
                            maxSizeMB: 3,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        };
                        file = await imageCompression(originalFile, options);
                    } catch (error) {
                        console.error('Error compressing image:', error);
                        // Fallback to original file if compression fails
                    }
                }

                if (file.size > 4.5 * 1024 * 1024) {
                    throw new Error("ไฟล์ภาพยังมีขนาดใหญ่เกิน 4.5MB แม้ผ่านการบีบอัดแล้ว กรุณาเลือกไฟล์ใหม่");
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", folder);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                let data;
                try {
                    data = await res.json();
                } catch (e) {
                    // Handles 413 Request Entity Too Large returning HTML/Text
                    throw new Error("ไฟล์ภาพอาจมีขนาดใหญ่เกินไป หรือเซิร์ฟเวอร์ไม่พร้อมให้บริการ");
                }

                if (!res.ok || !data.success) {
                    throw new Error(data.error?.message || "อัพโหลดไม่สำเร็จ");
                }

                onChange(data.data.url);
            } catch (err: any) {
                setError(err.message || "เกิดข้อผิดพลาดในการอัพโหลด");
            } finally {
                setIsUploading(false);
            }
        },
        [folder, onChange]
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        // Reset input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = async () => {
        onChange(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                    {label}
                </label>
            )}

            {value ? (
                /* ── Image Preview ── */
                <div className={cn("relative rounded-xl overflow-hidden border border-zinc-700 group", aspectRatio)}>
                    <Image
                        src={value}
                        alt="Uploaded"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || isUploading}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            title="Remove Image"
                            onClick={handleRemove}
                            disabled={disabled || isUploading}
                            className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                /* ── Drop Zone ── */
                <div
                    onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
                        aspectRatio,
                        "flex flex-col items-center justify-center gap-3",
                        isDragging
                            ? "border-[#C9A84C] bg-[#C9A84C]/5"
                            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-900",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
                            <p className="text-sm text-gray-400">กำลังอัพโหลด...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                {isDragging ? (
                                    <Upload className="w-6 h-6 text-[#C9A84C]" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-500" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-300">
                                    {isDragging ? "วางไฟล์ที่นี่" : "คลิกหรือลากไฟล์มาวาง"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    JPEG, PNG, WebP, GIF — สูงสุด 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                title="Upload Image"
                placeholder="Upload Image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    );
}
