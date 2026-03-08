"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    name?: string | null;
    email?: string;
    image?: string | null;
    className?: string;
    size?: "default" | "sm" | "lg" | "xl";
}

export function UserAvatar({ name, email, image, className, size = "default" }: UserAvatarProps) {
    const getInitials = (n?: string | null, e?: string) => {
        if (n && n.trim()) {
            const parts = n.trim().split(/\s+/);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return parts[0][0].toUpperCase();
        }
        if (e && e.trim()) {
            return e[0].toUpperCase();
        }
        return "?";
    };

    const initials = getInitials(name, email);

    // Generate a consistent color based on name/email
    const getBgColor = (str: string) => {
        const colors = [
            "bg-blue-500",
            "bg-emerald-500",
            "bg-purple-500",
            "bg-amber-500",
            "bg-rose-500",
            "bg-indigo-500",
            "bg-cyan-500",
            "bg-[#1B2A4A]", // Primary Navy
            "bg-[#C9A84C]", // Primary Gold
        ];
        
        let hash = 0;
        const s = str || "user";
        for (let i = 0; i < s.length; i++) {
            hash = s.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const bgColor = getBgColor(name || email || "user");

    const sizeClasses = {
        default: "size-10 text-sm",
        sm: "size-8 text-xs",
        lg: "size-12 text-base",
        xl: "size-20 text-2xl",
    };

    return (
        <Avatar className={cn(sizeClasses[size], "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a] ring-gray-100 dark:ring-zinc-800", className)}>
            <AvatarImage src={image || undefined} alt={name || "User"} className="object-cover" />
            <AvatarFallback className={cn("text-white font-bold tracking-wider", bgColor)}>
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
