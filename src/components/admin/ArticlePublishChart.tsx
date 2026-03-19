"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ArticleChartProps {
    data: { label: string; count: number }[];
}

export function ArticlePublishChart({ data }: ArticleChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[240px] text-gray-400 text-sm uppercase tracking-widest font-bold">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#cfb659" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#cfb659" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                    dataKey="label"
                    tick={{ fill: "#888", fontSize: 11, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fill: "#888", fontSize: 11, fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid rgba(207,182,89,0.3)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#fff",
                    }}
                    labelStyle={{ color: "#cfb659", fontWeight: 700 }}
                    formatter={(value: any) => [`${value} articles`, "Published"]}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#cfb659"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorArticles)"
                    dot={{ fill: "#cfb659", strokeWidth: 0, r: 3 }}
                    activeDot={{ fill: "#cfb659", strokeWidth: 2, stroke: "#fff", r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
