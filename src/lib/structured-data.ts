/**
 * JSON-LD Structured Data generators for SEO
 * @see https://schema.org
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rtbpf.org";

// ── Organization ──
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "สหภาพแรงงานวิชาชีพวิทยุและโทรทัศน์ (RTBPF)",
        alternateName: "Radio and Television Broadcasting Professional Federation",
        url: BASE_URL,
        logo: `${BASE_URL}/icons/icon-512x512.png`,
        sameAs: [
            "https://www.facebook.com/rtbpf",
            "https://twitter.com/rtbpf",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["Thai", "English"],
        },
    };
}

// ── NewsArticle ──
export function generateArticleSchema(article: {
    id: string;
    title: string;
    excerpt?: string | null;
    content?: string | null;
    coverImage?: string | null;
    createdAt: Date;
    updatedAt: Date;
    author?: { name?: string | null } | null;
    category?: { name?: string } | null;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt || article.title,
        image: article.coverImage || `${BASE_URL}/rtbpf-default-news.png`,
        datePublished: article.createdAt.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: {
            "@type": "Person",
            name: article.author?.name || "RTBPF",
        },
        publisher: {
            "@type": "Organization",
            name: "RTBPF",
            logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/icons/icon-512x512.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/th/articles/${article.id}`,
        },
        ...(article.category && {
            articleSection: article.category.name,
        }),
    };
}

// ── Event ──
export function generateEventSchema(event: {
    id: string;
    title: string;
    description?: string | null;
    coverImage?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    location?: string | null;
    type: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description || event.title,
        image: event.coverImage || `${BASE_URL}/rtbpf-default-news.png`,
        startDate: event.startDate?.toISOString(),
        endDate: event.endDate?.toISOString(),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: event.location
            ? {
                  "@type": "Place",
                  name: event.location,
              }
            : undefined,
        organizer: {
            "@type": "Organization",
            name: "RTBPF",
            url: BASE_URL,
        },
    };
}

// ── BreadcrumbList ──
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
        })),
    };
}

// ── WebSite (for sitelinks search box) ──
export function generateWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RTBPF",
        url: BASE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${BASE_URL}/th/articles?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}
