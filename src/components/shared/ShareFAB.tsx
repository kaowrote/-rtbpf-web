"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "./ShareButtons";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ShareFABProps {
    url: string;
    title: string;
    description?: string;
}

export function ShareFAB({ url, title, description = "" }: ShareFABProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Show FAB after scrolling 400px
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleFABClick = useCallback(async () => {
        // Try native Web Share API first
        if (navigator.share) {
            try {
                await navigator.share({ title, text: description, url });
                return;
            } catch (err: any) {
                // User cancelled or API failed — fall through to dropdown
                if (err.name === "AbortError") return;
            }
        }
        // Fallback: toggle dropdown
        setIsOpen((prev) => !prev);
    }, [title, description, url]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 z-50 lg:hidden"
                >
                    {/* Dropdown menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-16 right-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl p-3 mb-2"
                            >
                                <ShareButtons
                                    url={url}
                                    title={title}
                                    description={description}
                                    direction="column"
                                    size="sm"
                                    variant="ghost"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* FAB Button */}
                    <Button
                        onClick={handleFABClick}
                        size="icon"
                        className="w-14 h-14 rounded-full bg-[#1B2A4A] hover:bg-[#C9A84C] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        aria-label="Share this article"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Share2 className="h-5 w-5" />
                        )}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
