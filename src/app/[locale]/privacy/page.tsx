import React from "react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "นโยบายความเป็นส่วนตัว | RTBPF",
    description: "นโยบายความเป็นส่วนตัวของสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
            {/* HEROS */}
            <section className="relative w-full py-20 bg-[#1B2A4A] text-white">
                <div className="container px-6 mx-auto text-center relative z-10 space-y-4">
                    <Badge className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90 uppercase tracking-widest font-sans font-bold px-4 py-1.5 rounded-none text-xs">
                        Privacy Policy
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold font-thai tracking-tight uppercase">
                        นโยบายความเป็นส่วนตัว
                    </h1>
                    <p className="text-white/70 font-thai max-w-2xl mx-auto text-lg mt-4">
                        สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="w-full py-16 md:py-24">
                <div className="container px-6 mx-auto max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert prose-headings:font-thai prose-p:font-thai max-w-none">
                        <p className="lead text-xl text-gray-600 dark:text-gray-300">
                            สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF) ให้ความสำคัญอย่างยิ่งในการคุ้มครองข้อมูลส่วนบุคคลของท่าน นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เรารวบรวม ใช้ เปิดเผย และรักษาข้อมูลส่วนบุคคลของท่านเมื่อท่านใช้งานเว็บไซต์และบริการของเรา
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            1. ข้อมูลที่เรารวบรวม
                        </h2>
                        <p>
                            เรารวบรวมข้อมูลส่วนบุคคลที่ท่านมอบให้เราโดยตรง เช่น เมื่อท่านลงทะเบียนเข้าร่วมกิจกรรม ส่งผลงานเข้าประกวดรางวัลนาฏราช สมัครสมาชิกรับข่าวสาร หรือติดต่อเรา ข้อมูลเหล่านี้อาจรวมถึง:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                            <li>ข้อมูลระบุตัวตน (เช่น ชื่อ นามสกุล)</li>
                            <li>ข้อมูลการติดต่อ (เช่น อีเมล หมายเลขโทรศัพท์ ที่อยู่)</li>
                            <li>ข้อมูลองค์กร (เช่น สังกัด ตำแหน่ง)</li>
                            <li>ข้อมูลทางวิชาชีพที่เกี่ยวข้องกับการส่งผลงาน</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            2. วิธีการใช้ข้อมูลของท่าน
                        </h2>
                        <p>
                            เราใช้ข้อมูลส่วนบุคคลที่เก็บรวบรวมเพื่อวัตถุประสงค์ต่อไปนี้:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                            <li>จัดการและดำเนินการเกี่ยวกับการสมัครเข้าร่วมกิจกรรมและการพิจารณารางวัล</li>
                            <li>ติดต่อสื่อสาร ตอบกลับข้อซักถาม และส่งข่าวสารที่เกี่ยวข้อง</li>
                            <li>ปรับปรุงและพัฒนาเว็บไซต์และบริการของเราให้ดีขึ้น</li>
                            <li>ปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            3. การเปิดเผยข้อมูลของท่าน
                        </h2>
                        <p>
                            เราจะไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม เราอาจสัดสรรข้อมูลของท่านเฉพาะในกรณีที่จำเป็น เช่น การเปิดเผยแก่คณะกรรมการตัดสินรางวัล หรือเมื่อมีข้อกำหนดทางกฎหมายให้ต้องเปิดเผย
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            4. การรักษาความปลอดภัยของข้อมูล
                        </h2>
                        <p>
                            เราใช้มาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของท่านจากการเข้าถึง การใช้ หรือการเปิดเผยโดยไม่ได้รับอนุญาต
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            5. ติดต่อเรา
                        </h2>
                        <p>
                            หากท่านมีคำถามใดๆ เกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของท่าน กรุณาติดต่อเราได้ที่:
                        </p>
                        <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded mt-4 border border-gray-100 dark:border-zinc-800">
                            <p className="font-bold mb-2 text-black dark:text-white">คำติชมและข้อเสนอแนะ</p>
                            <p className="text-gray-600 dark:text-gray-400">อีเมล: info@rtbpf.org<br />โทรศัพท์: 02-123-4567</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
