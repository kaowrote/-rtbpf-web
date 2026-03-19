"use client";

import React from "react";

interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    className?: string;
}

export function YouTubeEmbed({ videoId, title = "YouTube video", className = "" }: YouTubeEmbedProps) {
    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-zinc-800 ${className}`}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
            />
        </div>
    );
}

interface TwitterEmbedProps {
    tweetUrl: string;
    className?: string;
}

export function TwitterEmbed({ tweetUrl, className = "" }: TwitterEmbedProps) {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        // Load Twitter widget script
        const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.charset = "utf-8";
            script.onload = () => {
                setLoaded(true);
                (window as any).twttr?.widgets?.load();
            };
            document.body.appendChild(script);
        } else {
            setLoaded(true);
            (window as any).twttr?.widgets?.load();
        }
    }, [tweetUrl]);

    return (
        <div className={`flex justify-center ${className}`}>
            <blockquote className="twitter-tweet" data-theme="dark">
                <a href={tweetUrl}>Loading tweet…</a>
            </blockquote>
        </div>
    );
}

interface FacebookEmbedProps {
    postUrl: string;
    width?: number;
    className?: string;
}

export function FacebookEmbed({ postUrl, width = 500, className = "" }: FacebookEmbedProps) {
    React.useEffect(() => {
        const existingScript = document.querySelector('script[src*="connect.facebook.net"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
            script.async = true;
            script.defer = true;
            script.crossOrigin = "anonymous";
            document.body.appendChild(script);
        }
        // Re-parse on mount
        setTimeout(() => {
            (window as any).FB?.XFBML?.parse();
        }, 1000);
    }, [postUrl]);

    return (
        <div className={`flex justify-center ${className}`}>
            <div
                className="fb-post"
                data-href={postUrl}
                data-width={width}
                data-show-text="true"
            />
        </div>
    );
}

interface InstagramEmbedProps {
    postUrl: string;
    className?: string;
}

export function InstagramEmbed({ postUrl, className = "" }: InstagramEmbedProps) {
    React.useEffect(() => {
        const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        }
        setTimeout(() => {
            (window as any).instgrm?.Embeds?.process();
        }, 1000);
    }, [postUrl]);

    return (
        <div className={`flex justify-center ${className}`}>
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={postUrl}
                data-instgrm-version="14"
                style={{ maxWidth: 540, width: "100%" }}
            >
                <a href={postUrl}>Loading Instagram post…</a>
            </blockquote>
        </div>
    );
}

// ── Smart Embed Detector ──
// Parses a URL and returns the correct embed component
interface SmartEmbedProps {
    url: string;
    className?: string;
}

export function SmartEmbed({ url, className }: SmartEmbedProps) {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
        return <YouTubeEmbed videoId={ytMatch[1]} className={className} />;
    }

    // Twitter/X
    if (url.includes("twitter.com/") || url.includes("x.com/")) {
        return <TwitterEmbed tweetUrl={url} className={className} />;
    }

    // Instagram
    if (url.includes("instagram.com/p/") || url.includes("instagram.com/reel/")) {
        return <InstagramEmbed postUrl={url} className={className} />;
    }

    // Facebook
    if (url.includes("facebook.com/")) {
        return <FacebookEmbed postUrl={url} className={className} />;
    }

    // Fallback: open in new tab
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-center text-blue-500 hover:underline ${className}`}
        >
            🔗 {url}
        </a>
    );
}
