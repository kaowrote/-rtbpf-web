"use client";

import React, { useState, useRef } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface CommentFormProps {
    articleId: string;
    parentId?: string;
    onSubmit: (comment: any) => void;
    onCancel?: () => void;
    compact?: boolean;
}

export function CommentForm({
    articleId,
    parentId,
    onSubmit,
    onCancel,
    compact = false,
}: CommentFormProps) {
    const { data: session, status } = useSession();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isLoggedIn = status === "authenticated" && !!session?.user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;

        try {
            setSubmitting(true);
            setError(null);
            const res = await fetch(`/api/articles/${articleId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content.trim(),
                    parentId: parentId || undefined,
                }),
            });
            const json = await res.json();
            if (json.success) {
                onSubmit(json.data);
                setContent("");
            } else {
                setError(json.error?.message || "ไม่สามารถส่งความคิดเห็นได้");
            }
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setSubmitting(false);
        }
    };

    // Auto-resize textarea
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    if (!isLoggedIn) {
        return (
            <div className={`bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 text-center ${compact ? "p-4" : ""}`}>
                <p className="text-gray-500 dark:text-gray-400 font-thai text-sm">
                    <a href="/auth/signin" className="text-[#C9A84C] hover:underline font-semibold">
                        เข้าสู่ระบบ
                    </a>{" "}
                    เพื่อแสดงความคิดเห็น
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div
                className={`bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-200 dark:border-zinc-800 
                    focus-within:border-[#C9A84C]/50 focus-within:ring-1 focus-within:ring-[#C9A84C]/20 
                    transition-all ${compact ? "rounded-lg" : ""}`}
            >
                {/* User avatar row */}
                <div className={`flex items-center gap-3 px-4 pt-3 ${compact ? "px-3 pt-2" : ""}`}>
                    {session.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name || ""}
                            className={`rounded-full ring-2 ring-gray-100 dark:ring-zinc-800 object-cover ${compact ? "w-6 h-6" : "w-8 h-8"}`}
                        />
                    ) : (
                        <div
                            className={`rounded-full bg-gradient-to-br from-[#C9A84C] to-[#a08636] flex items-center justify-center text-white font-bold ${
                                compact ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
                            }`}
                        >
                            {(session.user?.name || "?").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className={`font-semibold text-black dark:text-white font-thai ${compact ? "text-xs" : "text-sm"}`}>
                        {session.user?.name || "ไม่ระบุชื่อ"}
                    </span>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextChange}
                    placeholder={parentId ? "เขียนคำตอบ..." : "แสดงความคิดเห็น..."}
                    rows={compact ? 2 : 3}
                    maxLength={2000}
                    className={`w-full bg-transparent border-none outline-none resize-none font-thai text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                    }`}
                />

                {/* Footer */}
                <div className={`flex items-center justify-between px-4 pb-3 ${compact ? "px-3 pb-2" : ""}`}>
                    <span className="text-[10px] text-gray-400">
                        {content.length}/2000
                    </span>
                    <div className="flex items-center gap-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                ยกเลิก
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!content.trim() || submitting}
                            className={`flex items-center gap-1.5 font-semibold font-thai rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed
                                bg-[#C9A84C] hover:bg-[#b8993e] text-white ${
                                    compact
                                        ? "text-xs px-3 py-1.5"
                                        : "text-sm px-4 py-2"
                                }`}
                        >
                            {submitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                            {compact ? "ส่ง" : "ส่งความคิดเห็น"}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <p className="mt-2 text-xs text-red-500 font-thai">{error}</p>
            )}
        </form>
    );
}
