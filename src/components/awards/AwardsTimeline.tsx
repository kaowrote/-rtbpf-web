"use client";

import React, { useState, useEffect } from "react";
import { Timer, CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AwardYear {
    id: string;
    year: number;
    theme?: string;
    ceremonyDate?: string;
}

function getTimeLeft(targetDate: Date) {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
}

export function AwardsTimeline({ years }: { years: AwardYear[] }) {
    const [countdown, setCountdown] = useState<ReturnType<typeof getTimeLeft>>(null);

    // Find the next upcoming ceremony
    const now = new Date();
    const nextCeremony = years
        .filter(y => y.ceremonyDate && new Date(y.ceremonyDate) > now)
        .sort((a, b) => new Date(a.ceremonyDate!).getTime() - new Date(b.ceremonyDate!).getTime())[0];

    useEffect(() => {
        if (!nextCeremony?.ceremonyDate) return;
        const target = new Date(nextCeremony.ceremonyDate);

        const update = () => setCountdown(getTimeLeft(target));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [nextCeremony?.ceremonyDate]);

    const sortedYears = [...years].sort((a, b) => b.year - a.year);

    return (
        <div className="space-y-12">
            {/* Countdown Section */}
            {nextCeremony && countdown && (
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] to-[#0d1529] border border-[#cfb659]/20 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#cfb659]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#cfb659]/3 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#cfb659]/10 border border-[#cfb659]/30 px-4 py-1.5 rounded-full mb-6">
                            <Timer className="w-4 h-4 text-[#cfb659]" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cfb659]">
                                Next Ceremony
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white font-thai mb-2">
                            พิธีประกาศผลรางวัลนาฏราช ครั้งที่ {nextCeremony.year}
                        </h2>
                        {nextCeremony.theme && (
                            <p className="text-gray-400 font-thai text-lg mb-8">"{nextCeremony.theme}"</p>
                        )}

                        <div className="flex justify-center gap-4 md:gap-8">
                            {[
                                { value: countdown.days, label: "วัน" },
                                { value: countdown.hours, label: "ชั่วโมง" },
                                { value: countdown.minutes, label: "นาที" },
                                { value: countdown.seconds, label: "วินาที" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-black/40 border border-[#cfb659]/20 flex items-center justify-center rounded-lg">
                                        <span className="text-2xl md:text-4xl font-bold text-white font-mono tabular-nums">
                                            {String(item.value).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-gray-400 font-thai mt-2 uppercase tracking-wider font-bold">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mt-8 font-sans uppercase tracking-widest">
                            {new Date(nextCeremony.ceremonyDate!).toLocaleDateString("th-TH", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-8 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Historical Ceremonies
                </h3>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#cfb659] via-gray-200 dark:via-zinc-800 to-transparent" />

                    <div className="space-y-6">
                        {sortedYears.map((yr, idx) => {
                            const isPast = yr.ceremonyDate && new Date(yr.ceremonyDate) < now;
                            const isFuture = yr.ceremonyDate && new Date(yr.ceremonyDate) > now;

                            return (
                                <div key={yr.id} className="relative flex items-start gap-6 pl-12 group">
                                    {/* Dot */}
                                    <div className={`absolute left-[10px] top-2 w-3 h-3 rounded-full border-2 transition-colors ${
                                        isFuture
                                            ? "bg-[#cfb659] border-[#cfb659] animate-pulse"
                                            : idx === 0
                                                ? "bg-[#cfb659] border-[#cfb659]"
                                                : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 group-hover:border-[#cfb659]"
                                    }`} />

                                    <div className="flex-1 flex items-center justify-between py-3 px-5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-lg hover:border-[#cfb659]/50 transition-all group-hover:bg-white dark:group-hover:bg-zinc-900">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg font-bold text-black dark:text-white font-sans">
                                                    ครั้งที่ {yr.year}
                                                </span>
                                                {isFuture && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#cfb659] bg-[#cfb659]/10 px-2 py-0.5 rounded">
                                                        Upcoming
                                                    </span>
                                                )}
                                            </div>
                                            {yr.theme && (
                                                <p className="text-sm text-gray-500 font-thai">"{yr.theme}"</p>
                                            )}
                                            {yr.ceremonyDate && (
                                                <p className="text-xs text-gray-400 font-sans mt-1">
                                                    {new Date(yr.ceremonyDate).toLocaleDateString("th-TH", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        <Link href={`/awards?year=${yr.year}`} className="text-gray-400 hover:text-[#cfb659] transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
