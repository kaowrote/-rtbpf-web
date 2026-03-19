"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Award, Check, Heart, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NomineeVote {
    id: string;
    nomineeName: string;
    workTitle: string | null;
    imageUrl: string | null;
    broadcastingChannel: string | null;
    voteCount: number;
    isUserVote: boolean;
}

interface VotingCardProps {
    yearId: string;
    categoryId: string;
    categoryName: string;
    isVotingOpen?: boolean;
}

export function VotingCard({ yearId, categoryId, categoryName, isVotingOpen = true }: VotingCardProps) {
    const [nominees, setNominees] = useState<NomineeVote[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [userVoteId, setUserVoteId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVotes();
    }, [yearId, categoryId]);

    async function fetchVotes() {
        try {
            const res = await fetch(`/api/awards/votes?yearId=${yearId}&categoryId=${categoryId}`);
            const data = await res.json();
            setNominees(data.nominees || []);
            setTotalVotes(data.totalVotes || 0);
            setUserVoteId(data.userVoteNomineeId);
        } catch (e) {
            console.error("Failed to fetch votes:", e);
        } finally {
            setLoading(false);
        }
    }

    function handleVote(nomineeId: string) {
        startTransition(async () => {
            try {
                const res = await fetch("/api/awards/votes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nomineeId, yearId, categoryId }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    alert(err.error || "Failed to vote");
                    return;
                }

                // Optimistic update
                setNominees((prev) =>
                    prev.map((n) => ({
                        ...n,
                        voteCount:
                            n.id === nomineeId
                                ? n.voteCount + (userVoteId === nomineeId ? 0 : 1)
                                : n.id === userVoteId
                                  ? n.voteCount - 1
                                  : n.voteCount,
                        isUserVote: n.id === nomineeId,
                    }))
                );
                setUserVoteId(nomineeId);

                // Re-fetch for accurate counts
                await fetchVotes();
            } catch (e) {
                console.error("Vote failed:", e);
            }
        });
    }

    if (loading) {
        return (
            <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 dark:bg-zinc-900 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    if (nominees.length === 0) {
        return null;
    }

    const maxVotes = Math.max(...nominees.map((n) => n.voteCount), 1);

    return (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4A] to-[#2a3d66] p-4 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#cfb659]" />
                <h3 className="text-white font-bold font-thai text-lg flex-1">{categoryName}</h3>
                <Badge className="bg-white/10 text-white/70 border-none text-xs font-sans">
                    <Users className="w-3 h-3 mr-1" />
                    {totalVotes} votes
                </Badge>
            </div>

            {/* Nominees */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-900">
                {nominees.map((nominee) => {
                    const percentage = totalVotes > 0 ? Math.round((nominee.voteCount / totalVotes) * 100) : 0;
                    const barWidth = maxVotes > 0 ? (nominee.voteCount / maxVotes) * 100 : 0;

                    return (
                        <div
                            key={nominee.id}
                            className={`relative p-4 flex items-center gap-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900/50 ${
                                nominee.isUserVote ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                            }`}
                        >
                            {/* Vote bar background */}
                            <div
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                                    nominee.isUserVote
                                        ? "bg-[#cfb659]/10"
                                        : "bg-gray-100 dark:bg-zinc-900/30"
                                }`}
                                style={{ width: `${barWidth}%` }}
                            />

                            {/* Avatar */}
                            <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                {nominee.imageUrl ? (
                                    <Image
                                        src={nominee.imageUrl}
                                        alt={nominee.nomineeName}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Award className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="relative z-10 flex-1 min-w-0">
                                <p className="font-bold font-thai text-sm truncate">
                                    {nominee.nomineeName}
                                    {nominee.isUserVote && (
                                        <Check className="inline w-4 h-4 text-green-500 ml-1" />
                                    )}
                                </p>
                                {nominee.workTitle && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-thai truncate">
                                        {nominee.workTitle}
                                        {nominee.broadcastingChannel && ` • ${nominee.broadcastingChannel}`}
                                    </p>
                                )}
                            </div>

                            {/* Stats + Vote button */}
                            <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
                                <span className="text-sm font-bold text-[#cfb659] tabular-nums">
                                    {percentage}%
                                </span>

                                {isVotingOpen && (
                                    <Button
                                        size="sm"
                                        variant={nominee.isUserVote ? "default" : "outline"}
                                        className={`rounded-full h-8 w-8 p-0 ${
                                            nominee.isUserVote
                                                ? "bg-[#cfb659] hover:bg-[#b8a44e] text-black"
                                                : "border-gray-300 dark:border-zinc-700"
                                        }`}
                                        onClick={() => handleVote(nominee.id)}
                                        disabled={isPending}
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${
                                                nominee.isUserVote ? "fill-current" : ""
                                            }`}
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
