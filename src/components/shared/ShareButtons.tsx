"use client";

import React, { useCallback } from "react";
import { Facebook, Link2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    direction?: "row" | "column";
    size?: "sm" | "md";
    variant?: "outline" | "ghost";
    className?: string;
}

export function ShareButtons({
    url,
    title,
    description = "",
    direction = "row",
    size = "md",
    variant = "outline",
    className = "",
}: ShareButtonsProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);

    const openPopup = useCallback((shareUrl: string) => {
        window.open(shareUrl, "_blank", "width=600,height=500,scrollbars=yes,resizable=yes");
    }, []);

    const handleCopyUrl = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success("คัดลอกลิงก์แล้ว", {
                description: "URL copied to clipboard",
                duration: 2000,
            });
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            toast.success("คัดลอกลิงก์แล้ว");
        }
    }, [url]);

    const handleFacebook = useCallback(() => {
        openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
    }, [openPopup, encodedUrl]);

    const handleTwitter = useCallback(() => {
        openPopup(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`);
    }, [openPopup, encodedUrl, encodedTitle]);

    const handleLine = useCallback(() => {
        openPopup(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`);
    }, [openPopup, encodedUrl]);

    const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4";
    const btnSize = size === "sm" ? "icon" : "icon";

    const buttonClass =
        variant === "outline"
            ? "rounded-full border-gray-200 dark:border-zinc-800 hover:text-[#C9A84C] hover:border-[#C9A84C] dark:hover:border-[#C9A84C] text-black dark:text-white bg-transparent transition-all duration-200"
            : "rounded-full hover:text-[#C9A84C] text-black dark:text-white transition-all duration-200";

    return (
        <div
            className={`flex ${direction === "column" ? "flex-col" : "flex-row"} gap-3 ${className}`}
        >
            {/* Facebook */}
            <Button
                variant={variant}
                size={btnSize}
                className={buttonClass}
                onClick={handleFacebook}
                aria-label="Share on Facebook"
                title="Share on Facebook"
            >
                <Facebook className={iconSize} />
            </Button>

            {/* Twitter/X */}
            <Button
                variant={variant}
                size={btnSize}
                className={buttonClass}
                onClick={handleTwitter}
                aria-label="Share on X (Twitter)"
                title="Share on X"
            >
                <Icon icon="simple-icons:x" className={iconSize} />
            </Button>

            {/* LINE */}
            <Button
                variant={variant}
                size={btnSize}
                className={buttonClass}
                onClick={handleLine}
                aria-label="Share on LINE"
                title="Share on LINE"
            >
                <Icon icon="simple-icons:line" className={iconSize} />
            </Button>

            {/* Copy URL */}
            <Button
                variant={variant}
                size={btnSize}
                className={buttonClass}
                onClick={handleCopyUrl}
                aria-label="Copy link"
                title="Copy link"
            >
                <Link2 className={iconSize} />
            </Button>
        </div>
    );
}
