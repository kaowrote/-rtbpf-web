"use client";

import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with Recharts
const ArticlePublishChart = dynamic(
    () => import("@/components/admin/ArticlePublishChart").then(mod => ({ default: mod.ArticlePublishChart })),
    { ssr: false, loading: () => <div className="h-[240px] flex items-center justify-center text-gray-500 text-sm">Loading chart...</div> }
);

export function DashboardChart({ data }: { data: { label: string; count: number }[] }) {
    return <ArticlePublishChart data={data} />;
}
