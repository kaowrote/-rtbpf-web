"use client";

import React, { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    presets?: string[];
}

export function AdvancedColorPicker({ value, onChange, label, presets = [] }: AdvancedColorPickerProps) {
    const [tempColor, setTempColor] = useState(value);
    const [isOpen, setIsOpen] = useState(false);

    const defaultPresets = [
        "#C9A84C", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444",
        "#1B2A4A", "#111827", "#1E293B", "#0F172A", "#FFFFFF", "#F3F4F6"
    ];

    const allPresets = Array.from(new Set([...presets, ...defaultPresets]));

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        const clamp = (n: number) => Math.max(0, Math.min(255, n));
        const componentToHex = (c: number) => {
            const hex = clamp(c).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
    };

    const rgb = hexToRgb(tempColor);

    const handleRgbChange = (part: 'r' | 'g' | 'b', val: string) => {
        const num = parseInt(val) || 0;
        const newRgb = { ...rgb, [part]: num };
        setTempColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    const handleConfirm = () => {
        onChange(tempColor);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="w-10 h-10 rounded-full border-2 border-transparent transition-transform hover:scale-110 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 shadow-sm"
                    title={label || "Open Color Picker"}
                >
                    <Palette className="w-5 h-5 text-white drop-shadow-sm" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white dark:bg-[#0a0a0a]">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <DialogTitle className="text-xl font-bold font-thai tracking-tight text-black dark:text-white">
                            ตั้งค่าสี {label && `(${label})`}
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-500 font-thai">
                        เลือกสีที่ต้องการจาก Color Wheel หรือใส่รหัส HEX/RGB ด้านล่าง
                    </p>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Main UI Layout */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Selected Color Display & Inputs */}
                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                                <div 
                                    className="w-12 h-12 rounded-lg shadow-inner border border-white/20 shrink-0"
                                    style={{ backgroundColor: tempColor } as React.CSSProperties}
                                />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">hex code</p>
                                    <div className="flex items-center gap-2">
                                        <HexColorInput
                                            color={tempColor}
                                            onChange={(c) => setTempColor(c.toUpperCase())}
                                            className="bg-transparent border-none p-0 font-mono text-lg font-bold text-black dark:text-white focus:outline-none w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RGB Inputs Container */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'R', value: rgb.r, key: 'r' as const },
                                    { label: 'G', value: rgb.g, key: 'g' as const },
                                    { label: 'B', value: rgb.b, key: 'b' as const }
                                ].map((item) => (
                                    <div key={item.key} className="bg-gray-50 dark:bg-zinc-900 p-2 px-3 rounded-lg border border-gray-100 dark:border-zinc-800 flex flex-col">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{item.label}</span>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max="255"
                                            title={`RGB ${item.label}`}
                                            value={item.value}
                                            onChange={(e) => handleRgbChange(item.key, e.target.value)}
                                            className="bg-transparent border-none p-0 font-mono text-sm font-bold text-black dark:text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Color Wheel */}
                        <div className="advanced-picker-container relative">
                            <HexColorPicker 
                                color={tempColor} 
                                onChange={setTempColor}
                                className="!w-[220px] !h-[220px]"
                            />
                            <div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg pointer-events-none"
                                style={{ backgroundColor: tempColor }}
                            />
                        </div>
                    </div>

                    {/* Presets */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 px-1">Presets & Suggested</p>
                        <div className="grid grid-cols-6 gap-2.5">
                            {allPresets.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setTempColor(preset)}
                                    className={cn(
                                        "w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 relative group",
                                        tempColor === preset ? "border-purple-500 ring-2 ring-purple-500/20" : "border-gray-100 dark:border-zinc-800 shadow-sm"
                                    )}
                                    style={{ backgroundColor: preset } as React.CSSProperties}
                                    title={preset}
                                >
                                    {tempColor === preset && (
                                        <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between sm:justify-between">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-thai">บันทึกอัตโนมัติเมื่อกดตกลง</span>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-zinc-800"
                        >
                            ยกเลิก
                        </Button>
                        <Button 
                            onClick={handleConfirm}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                        >
                            เสร็จสิ้น
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>

            <style jsx global>{`
                .advanced-picker-container .react-colorful {
                    width: 240px !important;
                    height: 240px !important;
                    cursor: crosshair;
                }
                .advanced-picker-container .react-colorful__pointer {
                    width: 24px;
                    height: 24px;
                }
            `}</style>
        </Dialog>
    );
}
