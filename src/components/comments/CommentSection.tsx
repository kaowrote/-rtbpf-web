"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, Heart, Reply, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { CommentForm } from "./CommentForm";

interface CommentUser {
    id: string;
    name: string | null;
    image: string | null;
}

interface IComment {
    id: string;
    content: string;
    createdAt: string;
    user: CommentUser;
    likeCount: number;
    isLiked: boolean;
    replies: IComment[];
}

interface CommentSectionProps {
    articleId: string;
    locale: string;
}

export function CommentSection({ articleId, locale }: CommentSectionProps) {
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/articles/${articleId}/comments`);
            const json = await res.json();
            if (json.success) {
                setComments(json.data);
            } else {
                setError(json.error?.message || "Failed to load comments");
            }
        } catch {
            setError("ไม่สามารถโหลดความคิดเห็นได้");
        } finally {
            setLoading(false);
        }
    }, [articleId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleNewComment = (newComment: IComment) => {
        setComments((prev) => [newComment, ...prev]);
    };

    const handleNewReply = (parentId: string, reply: IComment) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === parentId
                    ? { ...c, replies: [...c.replies, reply] }
                    : c
            )
        );
    };

    const handleLikeToggle = async (commentId: string, isReply: boolean, parentId?: string) => {
        try {
            const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
            const json = await res.json();
            if (!json.success) return;

            const { liked, likeCount } = json.data;

            if (isReply && parentId) {
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === parentId
                            ? {
                                  ...c,
                                  replies: c.replies.map((r) =>
                                      r.id === commentId
                                          ? { ...r, isLiked: liked, likeCount }
                                          : r
                                  ),
                              }
                            : c
                    )
                );
            } else {
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === commentId
                            ? { ...c, isLiked: liked, likeCount }
                            : c
                    )
                );
            }
        } catch {
            // Silently handle
        }
    };

    const totalCount = comments.reduce(
        (sum, c) => sum + 1 + c.replies.length,
        0
    );

    return (
        <section className="py-16 md:py-24 border-t border-gray-200 dark:border-zinc-800">
            <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                    <MessageCircle className="w-6 h-6 text-[#C9A84C]" />
                    <h2 className="text-2xl md:text-3xl font-bold font-thai text-black dark:text-white">
                        ความคิดเห็น
                    </h2>
                    {totalCount > 0 && (
                        <span className="ml-2 bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-bold px-3 py-1 rounded-full">
                            {totalCount}
                        </span>
                    )}
                </div>

                {/* New Comment Form */}
                <CommentForm articleId={articleId} onSubmit={handleNewComment} />

                {/* Comments List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        {error}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-thai">
                            ยังไม่มีความคิดเห็น — เป็นคนแรกที่แสดงความคิดเห็น!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 mt-8">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                articleId={articleId}
                                onLike={handleLikeToggle}
                                onReply={handleNewReply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ─── CommentItem ───────────────────────────────────────────────
function CommentItem({
    comment,
    articleId,
    onLike,
    onReply,
}: {
    comment: IComment;
    articleId: string;
    onLike: (id: string, isReply: boolean, parentId?: string) => void;
    onReply: (parentId: string, reply: IComment) => void;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);

    const avatarFallback = (comment.user.name || "?").charAt(0).toUpperCase();

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
        locale: th,
    });

    return (
        <div className="group">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                    {comment.user.image ? (
                        <img
                            src={comment.user.image}
                            alt={comment.user.name || ""}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#a08636] flex items-center justify-center text-white font-bold text-sm">
                            {avatarFallback}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 dark:bg-zinc-900/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-black dark:text-white font-thai">
                                {comment.user.name || "ไม่ระบุชื่อ"}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {timeAgo}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-thai leading-relaxed whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-2 ml-2">
                        <button
                            onClick={() => onLike(comment.id, false)}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                                comment.isLiked
                                    ? "text-red-500"
                                    : "text-gray-400 hover:text-red-500"
                            }`}
                        >
                            <Heart
                                className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-current" : ""}`}
                            />
                            {comment.likeCount > 0 && (
                                <span className="font-medium">{comment.likeCount}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C9A84C] transition-colors"
                        >
                            <Reply className="w-3.5 h-3.5" />
                            <span>ตอบกลับ</span>
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3 ml-2">
                            <CommentForm
                                articleId={articleId}
                                parentId={comment.id}
                                onSubmit={(reply: IComment) => {
                                    onReply(comment.id, reply);
                                    setShowReplyForm(false);
                                }}
                                onCancel={() => setShowReplyForm(false)}
                                compact
                            />
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-1.5 text-xs font-medium text-[#C9A84C] hover:text-[#a08636] transition-colors ml-2 mb-3"
                            >
                                {showReplies ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                )}
                                <span>
                                    {comment.replies.length} การตอบกลับ
                                </span>
                            </button>
                            {showReplies && (
                                <div className="space-y-4 ml-2 pl-4 border-l-2 border-gray-100 dark:border-zinc-800">
                                    {comment.replies.map((reply) => (
                                        <ReplyItem
                                            key={reply.id}
                                            reply={reply}
                                            parentId={comment.id}
                                            onLike={onLike}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── ReplyItem ─────────────────────────────────────────────────
function ReplyItem({
    reply,
    parentId,
    onLike,
}: {
    reply: IComment;
    parentId: string;
    onLike: (id: string, isReply: boolean, parentId?: string) => void;
}) {
    const avatarFallback = (reply.user.name || "?").charAt(0).toUpperCase();
    const timeAgo = formatDistanceToNow(new Date(reply.createdAt), {
        addSuffix: true,
        locale: th,
    });

    return (
        <div className="flex gap-3">
            <div className="shrink-0">
                {reply.user.image ? (
                    <img
                        src={reply.user.image}
                        alt={reply.user.name || ""}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C]/70 to-[#a08636]/70 flex items-center justify-center text-white font-bold text-xs">
                        {avatarFallback}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-zinc-900/40 rounded-lg px-3 py-2 border border-gray-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-black dark:text-white font-thai">
                            {reply.user.name || "ไม่ระบุชื่อ"}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {timeAgo}
                        </span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-thai leading-relaxed whitespace-pre-wrap break-words">
                        {reply.content}
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-1.5 ml-2">
                    <button
                        onClick={() => onLike(reply.id, true, parentId)}
                        className={`flex items-center gap-1 text-[11px] transition-colors ${
                            reply.isLiked
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                        }`}
                    >
                        <Heart
                            className={`w-3 h-3 ${reply.isLiked ? "fill-current" : ""}`}
                        />
                        {reply.likeCount > 0 && (
                            <span className="font-medium">{reply.likeCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
