import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rtbpf.org";
const LOCALES = ["th", "en", "ko", "ja", "zh", "fr", "de", "es"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    // ── Static Pages ──
    const staticPaths = ["", "/articles", "/awards", "/events", "/about", "/contact", "/privacy", "/terms"];
    for (const path of staticPaths) {
        for (const locale of LOCALES) {
            entries.push({
                url: `${BASE_URL}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: path === "" ? "daily" : "weekly",
                priority: path === "" ? 1.0 : 0.8,
            });
        }
    }

    // ── Articles ──
    try {
        const articles = await prisma.article.findMany({
            where: { status: "PUBLISHED" },
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
            take: 500,
        });

        for (const article of articles) {
            for (const locale of LOCALES) {
                entries.push({
                    url: `${BASE_URL}/${locale}/articles/${article.id}`,
                    lastModified: article.updatedAt,
                    changeFrequency: "weekly",
                    priority: 0.7,
                });
            }
        }
    } catch (e) {
        console.error("Sitemap: failed to fetch articles", e);
    }

    // ── Events ──
    try {
        const events = await prisma.event.findMany({
            where: { status: "PUBLISHED" as any },
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
            take: 200,
        });

        for (const event of events) {
            for (const locale of LOCALES) {
                entries.push({
                    url: `${BASE_URL}/${locale}/events/${event.id}`,
                    lastModified: event.updatedAt,
                    changeFrequency: "weekly",
                    priority: 0.6,
                });
            }
        }
    } catch (e) {
        console.error("Sitemap: failed to fetch events", e);
    }

    // ── Awards ──
    try {
        const awardYears = await prisma.awardYear.findMany({
            select: { id: true, year: true },
            orderBy: { year: "desc" },
        });

        for (const yr of awardYears) {
            for (const locale of LOCALES) {
                entries.push({
                    url: `${BASE_URL}/${locale}/awards`,
                    lastModified: new Date(),
                    changeFrequency: "monthly",
                    priority: 0.6,
                });
            }
            break; // only need one entry for the awards page
        }
    } catch (e) {
        console.error("Sitemap: failed to fetch award years", e);
    }

    return entries;
}
