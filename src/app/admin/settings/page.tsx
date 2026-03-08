"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Bell, Shield, Palette, Save, Upload, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);
    const [defaultNewsImageUrl, setDefaultNewsImageUrl] = useState<string | null>(null);
    const [defaultEventImageUrl, setDefaultEventImageUrl] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch current settings
        fetch("/api/settings?keys=logoUrl,ogImageUrl,defaultNewsImageUrl,defaultEventImageUrl")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    if (data.data.logoUrl) setLogoUrl(data.data.logoUrl);
                    if (data.data.ogImageUrl) setOgImageUrl(data.data.ogImageUrl);
                    if (data.data.defaultNewsImageUrl) setDefaultNewsImageUrl(data.data.defaultNewsImageUrl);
                    if (data.data.defaultEventImageUrl) setDefaultEventImageUrl(data.data.defaultEventImageUrl);
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    logoUrl,
                    ogImageUrl,
                    defaultNewsImageUrl,
                    defaultEventImageUrl
                })
            });

            if (!response.ok) throw new Error("Failed to save settings");
            alert("Settings saved successfully!");
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="space-y-8">
            <div className="pb-6 border-b border-gray-200 dark:border-zinc-800">
                <Link href="/admin" className="text-sm font-bold flex items-center mb-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors font-sans">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">Settings</h1>
                <p className="text-gray-500 mt-2 font-thai">ตั้งค่าระบบเว็บไซต์และระบบจัดการเนื้อหา</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 font-bold text-xs uppercase tracking-widest transition-all border-b-2 -mb-px ${activeTab === tab.id
                            ? "border-[#C9A84C] text-[#C9A84C]"
                            : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "general" && (
                <div className="space-y-8">
                    {/* Site Info */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Site Information</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ชื่อเว็บไซต์ (ภาษาไทย)</label>
                                    <Input
                                        defaultValue="สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์"
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Site Name (English)</label>
                                    <Input
                                        defaultValue="Radio and Television Broadcasting Professional Federation"
                                        className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Website URL</label>
                                <Input
                                    defaultValue="https://rtbpf.org"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Meta Description (SEO)</label>
                                <textarea
                                    title="Meta Description"
                                    defaultValue="ศูนย์กลางวิชาชีพสื่อวิทยุกระจายเสียงและวิทยุโทรทัศน์ ผู้จัดงานประกาศผลรางวัลนาฏราช (Nataraj Awards)"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 font-thai text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none text-black dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo & Branding */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Logo & Branding</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">โลโก้หลัก</label>
                                <div className="max-w-[12rem]">
                                    <ImageUpload
                                        value={logoUrl || undefined}
                                        onChange={(url) => setLogoUrl(url)}
                                        folder="settings"
                                        label=""
                                        aspectRatio="aspect-square"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">SVG, PNG (แนะนำ 512×512)</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">OG Image (Social Sharing)</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={ogImageUrl || undefined}
                                        onChange={(url) => setOgImageUrl(url)}
                                        folder="settings"
                                        label=""
                                        aspectRatio="aspect-[1.91/1]"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">JPG, PNG (แนะนำ 1200×630)</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">รูปภาพประกอบข่าว Default</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={defaultNewsImageUrl || undefined}
                                        onChange={(url) => setDefaultNewsImageUrl(url)}
                                        folder="settings"
                                        label=""
                                        aspectRatio="aspect-[16/9]"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">ภาพพื้นหลังเมื่อไม่ได้อัปโหลดรูปปกข่าว (แนะนำ 1920x1080)</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">รูปภาพประกอบกิจกรรม Default</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={defaultEventImageUrl || undefined}
                                        onChange={(url) => setDefaultEventImageUrl(url)}
                                        folder="settings"
                                        label=""
                                        aspectRatio="aspect-[16/9]"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">ภาพพื้นหลังเมื่อไม่ได้อัปโหลดรูปปกกิจกรรม (แนะนำ 1920x1080)</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Social Media Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Facebook</label>
                                <Input
                                    defaultValue="https://facebook.com/rtbpf"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">X (Twitter)</label>
                                <Input
                                    defaultValue="https://twitter.com/rtbpfofficial"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">YouTube</label>
                                <Input
                                    defaultValue="https://youtube.com/@rtbpfofficial"
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSaveGeneral}
                            disabled={isSaving || isLoading}
                            className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-10 h-12 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === "appearance" && (
                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Theme & Colors</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Primary Accent Color</label>
                                <div className="flex gap-3">
                                    {[
                                        { bg: "bg-[#C9A84C]", id: "#C9A84C", name: "Gold (Default)" },
                                        { bg: "bg-blue-500", id: "#3B82F6", name: "Blue" },
                                        { bg: "bg-emerald-500", id: "#10B981", name: "Emerald" },
                                        { bg: "bg-purple-500", id: "#8B5CF6", name: "Purple" },
                                        { bg: "bg-amber-500", id: "#F59E0B", name: "Amber" },
                                        { bg: "bg-red-500", id: "#EF4444", name: "Red" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${opt.bg} ${opt.id === "#C9A84C" ? "border-black dark:border-white ring-2 ring-offset-2 ring-[#C9A84C]" : "border-transparent"}`}
                                            title={opt.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Primary Navy Color</label>
                                <div className="flex gap-3">
                                    {[
                                        { bg: "bg-[#1B2A4A]", id: "#1B2A4A", name: "Navy (Default)" },
                                        { bg: "bg-slate-900", id: "#111827", name: "Slate" },
                                        { bg: "bg-slate-800", id: "#1E293B", name: "Dark Slate" },
                                        { bg: "bg-slate-950", id: "#0F172A", name: "Deep Blue" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${opt.bg} ${opt.id === "#1B2A4A" ? "border-[#C9A84C] ring-2 ring-offset-2 ring-[#C9A84C]" : "border-gray-300 dark:border-zinc-600"}`}
                                            title={opt.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Homepage Hero Section</label>
                                <select title="Homepage Hero Section" className="w-full h-12 px-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white">
                                    <option value="featured">Featured Article (Default)</option>
                                    <option value="awards">Latest Award Ceremony</option>
                                    <option value="slider">Image Slider</option>
                                    <option value="video">Video Background</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-10 h-12 transition-colors">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Email Notifications</h2>
                        <div className="space-y-4">
                            {[
                                { label: "เมื่อมีบทความใหม่ถูกเผยแพร่", desc: "ส่งอีเมลแจ้งเตือนเมื่อบทความถูก Publish", enabled: true },
                                { label: "เมื่อมีสมาชิกใหม่ลงทะเบียน", desc: "แจ้งเตือนเมื่อมีผู้สมัครสมาชิกรอการอนุมัติ", enabled: true },
                                { label: "เมื่อมีการลงทะเบียนกิจกรรม", desc: "แจ้งเตือนเมื่อมีผู้ลงทะเบียนเข้าร่วมกิจกรรม", enabled: false },
                                { label: "สรุปรายสัปดาห์", desc: "ส่งสรุปภาพรวมระบบทุกวันจันทร์", enabled: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-black dark:text-white font-thai">{item.label}</p>
                                            <p className="text-xs text-gray-500 font-thai">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`relative w-12 h-6 rounded-full transition-colors ${item.enabled ? "bg-[#C9A84C]" : "bg-gray-300 dark:bg-zinc-600"}`}>
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? "translate-x-6" : "translate-x-0.5"}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-10 h-12 transition-colors">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === "security" && (
                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Authentication</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg">
                                <div>
                                    <p className="font-bold text-sm text-black dark:text-white">NextAuth.js</p>
                                    <p className="text-xs text-gray-500 font-thai">ระบบ Authentication หลัก</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-none text-[10px] uppercase tracking-widest font-bold">
                                    Active
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg">
                                <div>
                                    <p className="font-bold text-sm text-black dark:text-white">2FA (Two-Factor Authentication)</p>
                                    <p className="text-xs text-gray-500 font-thai">การยืนยันตัวตนสองขั้น</p>
                                </div>
                                <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-gray-300 dark:border-zinc-600 text-gray-500">
                                    Not Configured
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Session Management</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Session Timeout (นาที)</label>
                                <Input
                                    type="number"
                                    defaultValue={60}
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C] max-w-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Max Sessions Per User</label>
                                <Input
                                    type="number"
                                    defaultValue={3}
                                    className="h-12 bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C] max-w-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-black dark:text-white mb-6">Danger Zone</h2>
                        <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-red-800 dark:text-red-400 text-sm">Reset All User Sessions</h3>
                                    <p className="text-xs text-red-600 dark:text-red-500 font-thai mt-1">ล้างเซสชันทั้งหมด บังคับให้ผู้ใช้ทุกคนเข้าสู่ระบบใหม่</p>
                                </div>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 rounded-none text-xs uppercase tracking-widest font-bold bg-transparent">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button className="bg-[#1B2A4A] text-white hover:bg-[#C9A84C] rounded-none uppercase tracking-widest text-xs font-bold px-10 h-12 transition-colors">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
