"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("sending");
        setTimeout(() => setFormStatus("sent"), 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

            {/* ===== HERO ===== */}
            <section className="relative w-full py-24 md:py-32 bg-[#1B2A4A] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(201,168,76,0.3)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(201,168,76,0.2)_0%,transparent_50%)]"></div>
                </div>

                <div className="container relative z-10 mx-auto px-6 text-center">
                    <Badge className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90 uppercase tracking-[0.3em] font-sans font-bold px-4 py-1.5 rounded-none text-xs mb-6">
                        Contact
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-thai uppercase tracking-wide mb-4">
                        ติดต่อเรา
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-thai max-w-2xl mx-auto">
                        มีคำถาม ข้อเสนอแนะ หรือต้องการความร่วมมือ? เราพร้อมรับฟังทุกเสียง
                    </p>
                </div>
            </section>

            {/* ===== CONTACT INFO + FORM ===== */}
            <section className="w-full py-20 md:py-28">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

                        {/* Left: Contact Info */}
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <h2 className="text-2xl font-bold font-thai text-black dark:text-white uppercase tracking-wide mb-6">
                                    ข้อมูลติดต่อ
                                </h2>
                                <div className="w-12 h-1 bg-[#C9A84C] mb-8"></div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 shrink-0">
                                    <MapPin className="w-5 h-5 text-[#C9A84C]" />
                                </div>
                                <div>
                                    <h3 className="font-bold font-thai text-black dark:text-white mb-1">ที่อยู่สำนักงาน</h3>
                                    <p className="font-thai text-gray-600 dark:text-gray-400 leading-relaxed">
                                        อาคารมาลีนนท์ ทาวเวอร์ (M3) ชั้น 11<br />
                                        ถนนพระราม 4 แขวงคลองตัน<br />
                                        เขตคลองเตย กรุงเทพฯ 10110
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 shrink-0">
                                    <Phone className="w-5 h-5 text-[#C9A84C]" />
                                </div>
                                <div>
                                    <h3 className="font-bold font-thai text-black dark:text-white mb-1">โทรศัพท์</h3>
                                    <p className="font-thai text-gray-600 dark:text-gray-400">02-123-4567</p>
                                    <p className="font-thai text-gray-600 dark:text-gray-400">02-123-4568 (แฟกซ์)</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 shrink-0">
                                    <Mail className="w-5 h-5 text-[#C9A84C]" />
                                </div>
                                <div>
                                    <h3 className="font-bold font-thai text-black dark:text-white mb-1">อีเมล</h3>
                                    <a href="mailto:info@rtbpf.org" className="font-thai text-[#C9A84C] hover:underline">info@rtbpf.org</a>
                                    <br />
                                    <a href="mailto:awards@rtbpf.org" className="font-thai text-gray-600 dark:text-gray-400 hover:text-[#C9A84C] transition-colors">awards@rtbpf.org (งานรางวัลนาฏราช)</a>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 shrink-0">
                                    <Clock className="w-5 h-5 text-[#C9A84C]" />
                                </div>
                                <div>
                                    <h3 className="font-bold font-thai text-black dark:text-white mb-1">เวลาทำการ</h3>
                                    <p className="font-thai text-gray-600 dark:text-gray-400">จันทร์ - ศุกร์: 09:00 - 17:00 น.</p>
                                    <p className="font-thai text-gray-600 dark:text-gray-400">เสาร์ - อาทิตย์: ปิดทำการ</p>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    <a href={siteConfig.links.facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-[#C9A84C] hover:text-black text-gray-600 dark:text-gray-400 transition-all">
                                        <Facebook className="w-4 h-4" />
                                    </a>
                                    <a href={siteConfig.links.twitter} target="_blank" rel="noreferrer" title="Twitter" className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-[#C9A84C] hover:text-black text-gray-600 dark:text-gray-400 transition-all">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                    <a href={siteConfig.links.youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 hover:bg-[#C9A84C] hover:text-black text-gray-600 dark:text-gray-400 transition-all">
                                        <Youtube className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 p-8 md:p-12">
                                <h2 className="text-2xl font-bold font-thai text-black dark:text-white mb-2">
                                    ส่งข้อความถึงเรา
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-thai mb-8">
                                    กรุณากรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 2-3 วันทำการ
                                </p>

                                {formStatus === "sent" ? (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-emerald-500/10 rounded-full">
                                            <Send className="w-7 h-7 text-emerald-500" />
                                        </div>
                                        <h3 className="text-xl font-bold font-thai text-black dark:text-white mb-2">ส่งข้อความสำเร็จ!</h3>
                                        <p className="text-gray-500 font-thai">ขอบคุณที่ติดต่อเข้ามา ทีมงานจะตอบกลับโดยเร็วที่สุด</p>
                                        <button
                                            onClick={() => setFormStatus("idle")}
                                            className="mt-6 text-[#C9A84C] hover:underline font-thai text-sm"
                                        >
                                            ส่งข้อความอีกครั้ง
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ชื่อ-นามสกุล *</label>
                                                <Input
                                                    required
                                                    placeholder="กรอกชื่อ-นามสกุล"
                                                    className="h-12 bg-white dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-thai focus-visible:ring-[#C9A84C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">อีเมล *</label>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="h-12 bg-white dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">เบอร์โทรศัพท์</label>
                                                <Input
                                                    type="tel"
                                                    placeholder="08X-XXX-XXXX"
                                                    className="h-12 bg-white dark:bg-black border-gray-200 dark:border-zinc-700 rounded-none font-sans focus-visible:ring-[#C9A84C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">หัวข้อ</label>
                                                <select title="Contact Topic" className="w-full h-12 px-4 bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 font-thai text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-black dark:text-white">
                                                    <option value="">เลือกหัวข้อ</option>
                                                    <option value="general">สอบถามข้อมูลทั่วไป</option>
                                                    <option value="awards">เกี่ยวกับรางวัลนาฏราช</option>
                                                    <option value="events">เกี่ยวกับกิจกรรม/สัมมนา</option>
                                                    <option value="membership">สมัครสมาชิก</option>
                                                    <option value="press">สื่อมวลชน / Press</option>
                                                    <option value="other">อื่นๆ</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">ข้อความ *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                                className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-zinc-700 font-thai text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none text-black dark:text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={formStatus === "sending"}
                                            className="w-full bg-[#C9A84C] text-black hover:bg-[#b8963d] rounded-none h-14 font-bold uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50"
                                        >
                                            {formStatus === "sending" ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                    กำลังส่ง...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Send className="w-4 h-4" />
                                                    ส่งข้อความ
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MAP ===== */}
            <section className="w-full bg-gray-100 dark:bg-[#111]">
                <div className="w-full h-[400px] md:h-[500px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5731!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ1JzIyLjciTiAxMDDCsDM0JzIzLjIiRQ!5e0!3m2!1sth!2sth!4v1"
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="RTBPF Office Location"
                    ></iframe>
                </div>
            </section>
        </div>
    );
}
