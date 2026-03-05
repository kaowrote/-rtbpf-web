"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Globe, MapPin, Link as LinkIcon, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TipTapEditor from "@/components/admin/TipTapEditor";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EventEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [mapEmbedUrl, setMapEmbedUrl] = useState("");
    const [registerUrl, setRegisterUrl] = useState("");
    const [capacity, setCapacity] = useState("");
    const [status, setStatus] = useState("UPCOMING");
    const [eventType, setEventType] = useState("AWARD_CEREMONY");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventImage, setEventImage] = useState<string | null>(null);

    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${id}`);
                const resData = await response.json();

                if (!response.ok || !resData.success) {
                    throw new Error(resData?.error?.message || "Failed to fetch event");
                }

                const event = resData.data;
                setTitle(event.title || "");
                setSlug(event.slug || "");
                setDescription(event.description || "");
                setLocation(event.location || "");
                setMapEmbedUrl(event.mapEmbedUrl || "");
                setRegisterUrl(event.registerUrl || "");
                setCapacity(event.capacity?.toString() || "");
                setStatus(event.status || "UPCOMING");
                setEventType(event.eventType || "AWARD_CEREMONY");
                setEventImage(event.imageUrl || null);

                if (event.startDate) {
                    const dateObj = new Date(event.startDate);
                    setStartDate(dateObj.toISOString().split("T")[0]);
                }
                if (event.endDate) {
                    const dateObj = new Date(event.endDate);
                    setEndDate(dateObj.toISOString().split("T")[0]);
                }

            } catch (error) {
                console.error("Error fetching event:", error);
                alert("Could not load event data. It may have been deleted.");
                router.push("/admin/events");
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchEvent();
    }, [id, router]);

    const handleSave = async (publishStatus?: string) => {
        if (!title.trim() || !startDate) {
            alert("กรุณากรอกชื่อกิจกรรมและวันที่เริ่มกิจกรรม");
            return;
        }

        setIsLoading(true);

        try {
            const eventSlug = slug || title.trim().toLowerCase().replace(/[^a-z0-9ก-๙เแโใไ]/g, '-').replace(/-+/g, '-');

            const response = await fetch(`/api/events/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug: eventSlug,
                    description,
                    location,
                    mapEmbedUrl,
                    registerUrl: registerUrl || null,
                    capacity: capacity ? parseInt(capacity) : null,
                    status: publishStatus || status,
                    eventType,
                    startDate: new Date(startDate).toISOString(),
                    endDate: endDate ? new Date(endDate).toISOString() : null,
                    imageUrl: eventImage,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || "Failed to update event");
            }

            router.push("/admin/events");
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href="/admin/events">
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 dark:border-zinc-800 rounded-none bg-white dark:bg-[#0a0a0a] hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold font-thai tracking-tight uppercase text-black dark:text-white">Edit Event</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => handleSave("UPCOMING")}
                        disabled={isLoading}
                        variant="outline"
                        className="h-10 rounded-none border-gray-200 dark:border-zinc-800 font-bold uppercase tracking-widest text-xs bg-white dark:bg-[#0a0a0a] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => handleSave()}
                        disabled={isLoading}
                        className="h-10 rounded-none font-bold uppercase tracking-widest text-xs bg-[#1B2A4A] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-[#C9A84C] transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Update
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {/* Event Title */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-sans">Event Title & Name</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="กรอกชื่อกิจกรรม หรืองานประกาศรางวัล..."
                            className="text-lg font-thai font-semibold h-14 border-gray-200 dark:border-zinc-800 focus-visible:ring-[#C9A84C]"
                        />
                        <div className="mt-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-sans">URL Slug</label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="event-slug-url"
                                className="font-mono text-xs border-gray-200 dark:border-zinc-800 focus-visible:ring-[#C9A84C]"
                            />
                        </div>
                    </div>

                    {/* Editor for Event Details */}
                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 p-6 pb-2 border-b border-gray-100 dark:border-zinc-800">Event Description & Details</h2>
                        <TipTapEditor value={description} onChange={setDescription} />
                    </div>
                    {/* Location & Links Details */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">Venue & Registration Information</h2>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Venue / Location Name (สถานที่จัดงาน)</label>
                            <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                <div className="px-4 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                </div>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="เช่น หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย"
                                    className="border-0 shadow-none font-thai h-12 bg-transparent focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Google Maps Embed URL (สำหรับฝังแผนที่)</label>
                            <Input
                                value={mapEmbedUrl}
                                onChange={(e) => setMapEmbedUrl(e.target.value)}
                                placeholder="<iframe src='...' /> หรือลิงก์ Embed จาก Google Maps"
                                className="font-sans text-sm h-12 border-gray-200 dark:border-zinc-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Registration Link (ฟอร์มลงทะเบียน)</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                        <LinkIcon className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <Input
                                        value={registerUrl}
                                        onChange={(e) => setRegisterUrl(e.target.value)}
                                        placeholder="https://forms.google.com/..."
                                        className="border-0 shadow-none font-sans text-sm h-12 bg-transparent focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Capacity (จำนวนที่รับรอง)</label>
                                <Input
                                    type="number"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="เช่น 200 หรือว่างไว้ถ้าไม่จำกัด"
                                    className="font-thai text-sm h-12 border-gray-200 dark:border-zinc-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Event Settings) */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl space-y-6">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Event configuration</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
                                <select
                                    title="Event Status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full text-sm font-bold uppercase tracking-widest p-3 border border-gray-200 dark:border-zinc-800 rounded bg-gray-50 dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-[#C9A84C]"
                                >
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="OPEN_FOR_REGISTRATION">Open for Registration</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Event Type</label>
                                <select
                                    title="Event Type"
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    className="w-full text-sm p-3 border border-gray-200 dark:border-zinc-800 rounded bg-gray-50 dark:bg-zinc-900 text-black dark:text-white focus:outline-none font-thai mb-2"
                                >
                                    <option value="AWARD_CEREMONY">งานประกาศรางวัล (Award Ceremony)</option>
                                    <option value="SEMINAR">สัมมนา (Seminar)</option>
                                    <option value="WORKSHOP">เวิร์กชอป (Workshop)</option>
                                    <option value="PRESS_CONFERENCE">งานแถลงข่าว (Press Conference)</option>
                                    <option value="OTHER">กิจกรรมอื่นๆ (Other)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Start Date *</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="border-0 shadow-none font-sans text-sm h-12 bg-transparent focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">End Date (Optional)</label>
                                <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded overflow-hidden">
                                    <div className="px-3 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-800">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="border-0 shadow-none font-sans text-sm h-12 bg-transparent focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h3 className="font-bold uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800 pb-4 text-black dark:text-white">Event Poster / Cover</h3>

                        <div className="mt-4">
                            <ImageUpload
                                value={eventImage || undefined}
                                onChange={(url) => setEventImage(url)}
                                folder="events"
                                label=""
                                aspectRatio="aspect-[4/3]"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 font-thai text-center w-full block">ขนาดภาพแนะนำ 1920x1080 px แบบแนวนอน</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
