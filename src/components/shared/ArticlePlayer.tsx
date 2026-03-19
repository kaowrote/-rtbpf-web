"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, X, Loader2 } from "lucide-react";

interface ArticlePlayerProps {
    articleId: string;
    articleTitle: string;
    languageCode?: string;
}

export default function ArticlePlayer({ articleId, articleTitle, languageCode = "th" }: ArticlePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [useBrowserTTS, setUseBrowserTTS] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Extract text for browser TTS
    const [articleText, setArticleText] = useState("");

    const fetchAudio = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // First check if audio exists
            const checkRes = await fetch(`/api/tts?articleId=${articleId}&lang=${languageCode}`);
            const checkData = await checkRes.json();

            if (checkData.data?.audioUrl) {
                if (checkData.data.audioUrl.startsWith("browser-tts://")) {
                    setUseBrowserTTS(true);
                    // Fetch article text for browser TTS
                    const artRes = await fetch(`/api/articles/${articleId}`);
                    const artData = await artRes.json();
                    if (artData.data) {
                        const text = artData.data.title + ". " + (artData.data.excerpt || "");
                        setArticleText(text);
                    }
                } else {
                    setAudioSrc(checkData.data.audioUrl);
                }
                setIsVisible(true);
                return;
            }

            // Generate TTS
            const genRes = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId, languageCode }),
            });
            const genData = await genRes.json();

            if (genData.data?.audioUrl) {
                if (genData.data.audioUrl.startsWith("browser-tts://")) {
                    setUseBrowserTTS(true);
                    const artRes = await fetch(`/api/articles/${articleId}`);
                    const artData = await artRes.json();
                    if (artData.data) {
                        setArticleText(artData.data.title + ". " + (artData.data.excerpt || ""));
                    }
                } else {
                    setAudioSrc(genData.data.audioUrl);
                }
                setIsVisible(true);
            } else {
                setError("ไม่สามารถสร้างเสียงได้");
            }
        } catch (err) {
            console.error("TTS error:", err);
            // Fallback to browser TTS
            setUseBrowserTTS(true);
            setArticleText(articleTitle);
            setIsVisible(true);
        } finally {
            setIsLoading(false);
        }
    }, [articleId, languageCode, articleTitle]);

    const togglePlay = () => {
        if (useBrowserTTS) {
            if (isPlaying) {
                window.speechSynthesis.pause();
                setIsPlaying(false);
            } else {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                } else {
                    const utterance = new SpeechSynthesisUtterance(articleText || articleTitle);
                    utterance.lang = languageCode === "th" ? "th-TH" : languageCode;
                    utterance.rate = playbackRate;
                    utterance.volume = isMuted ? 0 : volume;
                    utterance.onend = () => setIsPlaying(false);
                    utteranceRef.current = utterance;
                    window.speechSynthesis.speak(utterance);
                }
                setIsPlaying(true);
            }
            return;
        }

        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleClose = () => {
        if (useBrowserTTS) {
            window.speechSynthesis.cancel();
        } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setIsVisible(false);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !audioRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        audioRef.current.currentTime = pct * duration;
    };

    const changeSpeed = () => {
        const speeds = [0.75, 1, 1.25, 1.5, 2];
        const idx = speeds.indexOf(playbackRate);
        const next = speeds[(idx + 1) % speeds.length];
        setPlaybackRate(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onUpdate = () => setCurrentTime(audio.currentTime);
        const onLoaded = () => setDuration(audio.duration);
        const onEnd = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", onUpdate);
        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("ended", onEnd);

        return () => {
            audio.removeEventListener("timeupdate", onUpdate);
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("ended", onEnd);
        };
    }, [audioSrc]);

    if (!isVisible) {
        return (
            <button
                onClick={fetchAudio}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1b294b] to-[#2a3d6b] text-white text-sm font-bold rounded-full hover:from-[#cfb659] hover:to-[#b89f3e] hover:text-[#1b294b] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Volume2 className="w-4 h-4" />
                )}
                🔊 ฟังบทความ
            </button>
        );
    }

    return (
        <>
            {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}
            
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1b294b] via-[#1e3158] to-[#1b294b] text-white shadow-2xl border-t border-[#cfb659]/20">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    {/* Progress bar */}
                    {!useBrowserTTS && (
                        <div
                            ref={progressRef}
                            className="w-full h-1 bg-white/10 rounded-full cursor-pointer mb-3 group"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-gradient-to-r from-[#cfb659] to-[#e8d48b] rounded-full relative transition-all"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#cfb659] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        {/* Title */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#cfb659] font-bold uppercase tracking-widest">🔊 กำลังฟัง</p>
                            <p className="text-sm font-semibold truncate">{articleTitle}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button onClick={togglePlay} className="w-10 h-10 bg-[#cfb659] text-[#1b294b] rounded-full flex items-center justify-center hover:bg-[#e8d48b] transition-colors" title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </button>

                            <button onClick={changeSpeed} className="px-2 py-1 text-xs font-bold bg-white/10 rounded hover:bg-white/20 transition-colors" title="Playback Speed">
                                {playbackRate}x
                            </button>

                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 text-white/60 hover:text-white transition-colors"
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>

                            {!useBrowserTTS && (
                                <span className="text-xs text-white/40 font-mono min-w-[80px] text-center">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            )}

                            <button onClick={handleClose} className="p-2 text-white/40 hover:text-white transition-colors" title="Close">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
