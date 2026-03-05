"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, AlertCircle, GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
    /** Current image URLs */
    value: string[];
    /** Callback when images change */
    onChange: (urls: string[]) => void;
    /** Folder path in storage */
    folder?: string;
    /** Label text */
    label?: string;
    /** Maximum number of images */
    maxImages?: number;
    /** Additional class names */
    className?: string;
    /** Disable the upload */
    disabled?: boolean;
}

export default function MultiImageUpload({
    value = [],
    onChange,
    folder = "gallery",
    label = "Upload Images",
    maxImages = 10,
    className,
    disabled = false,
}: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
        async (files: FileList) => {
            setError(null);

            const remaining = maxImages - value.length;
            if (remaining <= 0) {
                setError(`จำกัดสูงสุด ${maxImages} รูป`);
                return;
            }

            const filesToUpload = Array.from(files).slice(0, remaining);
            setIsUploading(true);

            try {
                const uploadPromises = filesToUpload.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("folder", folder);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        throw new Error(data.error?.message || `อัพโหลด ${file.name} ไม่สำเร็จ`);
                    }
                    return data.data.url as string;
                });

                const newUrls = await Promise.all(uploadPromises);
                onChange([...value, ...newUrls]);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsUploading(false);
            }
        },
        [folder, maxImages, onChange, value]
    );

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) handleUpload(files);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                    {label} ({value.length}/{maxImages})
                </label>
            )}

            {/* Image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {value.map((url, index) => (
                    <div
                        key={url}
                        className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group"
                    >
                        <Image
                            src={url}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="200px"
                        />
                        <button
                            type="button"
                            title="Remove Image"
                            onClick={() => handleRemove(index)}
                            disabled={disabled}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {index + 1}
                        </span>
                    </div>
                ))}

                {/* Add button */}
                {value.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading}
                        className={cn(
                            "aspect-square rounded-lg border-2 border-dashed transition-all",
                            "flex flex-col items-center justify-center gap-2",
                            "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-900",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-6 h-6 text-gray-500" />
                                <span className="text-[10px] text-gray-500">เพิ่มรูป</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                title="Upload Images"
                placeholder="Upload Images"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    );
}
