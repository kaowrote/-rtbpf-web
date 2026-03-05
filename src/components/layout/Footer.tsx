import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-[#1B2A4A] dark:bg-black text-white pt-16 pb-8 font-thai border-t border-transparent dark:border-white/10 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: About */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold tracking-tight text-accent mb-4">
                            {siteConfig.name}
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-6 max-w-md">
                            {siteConfig.fullName} <br />
                            <span className="text-sm font-sans mt-2 block opacity-70 border-t border-white/20 pt-2">
                                {siteConfig.englishName}
                            </span>
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href={siteConfig.links.facebook}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 hover:bg-accent hover:text-primary transition-colors p-2 rounded-full"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href={siteConfig.links.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 hover:bg-accent hover:text-primary transition-colors p-2 rounded-full"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href={siteConfig.links.youtube}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 hover:bg-accent hover:text-primary transition-colors p-2 rounded-full"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-lg text-accent mb-2">ลิงก์ด่วน</h3>
                        <Link href="/" className="text-white/70 hover:text-white transition-colors">
                            หน้าแรก
                        </Link>
                        <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                            เกี่ยวกับองค์กร
                        </Link>
                        <Link href="/awards" className="text-white/70 hover:text-white transition-colors">
                            รางวัลนาฏราช
                        </Link>
                        <Link href="/articles" className="text-white/70 hover:text-white transition-colors">
                            ข่าวสาร/บทความ
                        </Link>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-lg text-accent mb-2">ติดต่อเรา</h3>
                        <div className="flex items-start gap-3 text-white/70">
                            <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-accent/80" />
                            <p className="text-sm">
                                อาคารมาลีนนท์ ทาวเวอร์ (M3) ชั้น 11<br />
                                ถนนพระราม 4 แขวงคลองตัน<br />
                                เขตคลองเตย กรุงเทพฯ 10110
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <Phone className="h-5 w-5 text-accent/80" />
                            <p className="text-sm">02-123-4567</p>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <Mail className="h-5 w-5 text-accent/80" />
                            <a href="mailto:info@rtbpf.org" className="text-sm hover:text-white transition">
                                info@rtbpf.org
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
                    <p>
                        &copy; {new Date().getFullYear()} {siteConfig.fullName}. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            นโยบายความเป็นส่วนตัว
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            ข้อกำหนดการใช้งาน
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
