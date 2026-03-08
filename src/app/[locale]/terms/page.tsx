import React from "react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "ข้อกำหนดและเงื่อนไข | RTBPF",
    description: "ข้อกำหนดและเงื่อนไขการใช้งานของสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
};

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
            {/* HEROS */}
            <section className="relative w-full py-20 bg-[#1B2A4A] text-white">
                <div className="container px-6 mx-auto text-center relative z-10 space-y-4">
                    <Badge className="bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90 uppercase tracking-widest font-sans font-bold px-4 py-1.5 rounded-none text-xs">
                        Terms of Service
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold font-thai tracking-tight uppercase">
                        ข้อกำหนดการใช้งาน
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
                            ยินดีต้อนรับสู่เว็บไซต์สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF) กรุณาอ่านข้อกำหนดและเงื่อนไขการใช้งานเหล่านี้อย่างละเอียดก่อนใช้งานเว็บไซต์
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            1. การยอมรับข้อตกลง
                        </h2>
                        <p>
                            การเข้าถึงหรือการใช้งานเว็บไซต์นี้ ถือว่าท่านตกลงผูกพันตามข้อกำหนดและเงื่อนไขเหล่านี้ทุกประการ หากท่านไม่เห็นด้วยกับส่วนใดส่วนหนึ่งของเงื่อนไขนี้ กรุณางดใช้เว็บไซต์ของเรา
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            2. ทรัพย์สินทางปัญญา
                        </h2>
                        <p>
                            เนื้อหา โลโก้ รูปภาพ บทความ และสัญลักษณ์ต่างๆ ("รางวัลนาฏราช" และ "สมาพันธ์ฯ") ที่ปรากฏบนเว็บไซต์นี้ เป็นทรัพย์สินทางปัญญาของสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์แต่เพียงผู้เดียว เว้นแต่จะระบุไว้เป็นอย่างอื่น ห้ามมิให้ทำซ้ำ ดัดแปลง แจกจ่าย หรือนำไปใช้เพื่อประโยชน์ในเชิงพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            3. การให้ข้อมูล
                        </h2>
                        <p>
                            ในการลงทะเบียนเข้าร่วมกิจกรรมหรือส่งผลงาน ท่านรับรองว่าข้อมูลทั้งหมดที่ให้มาเป็นความจริง ถูกต้อง และเป็นปัจจุบัน สมาพันธ์ฯ ขอสงวนสิทธิ์ในการยกเลิกหรือปฏิเสธการให้บริการ หากพบว่าข้อมูลที่ระบุเป็นเท็จ หรือมีการแอบอ้าง
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            4. ลิงก์ไปยังเว็บไซต์บุคคลที่สาม
                        </h2>
                        <p>
                            เว็บไซต์ของเราอาจมีลิงก์ไปยังเว็บไซต์ของบุคคลภายนอกที่เราไม่ได้เป็นเจ้าของหรือควบคุม เราไม่มีความรับผิดชอบใดๆ ต่อเนื้อหา นโยบายความเป็นส่วนตัว หรือแนวปฏิบัติของเว็บไซต์หรือบริการของบุคคลเหล่านั้น
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            5. การแก้ไขเงื่อนไข
                        </h2>
                        <p>
                            เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงเงื่อนไขและข้อกำหนดเหล่านี้ได้ตลอดเวลา การเปลี่ยนแปลงจะมีผลทันทีเมื่อเผยแพร่บนหน้านี้ เราขอแนะนำให้ท่านตรวจสอบหน้านี้เป็นระยะๆ
                        </p>

                        <h2 className="text-2xl font-bold text-black dark:text-white mt-10 mb-4 uppercase tracking-wide">
                            ติดต่อสอบถาม
                        </h2>
                        <p>
                            หากมีข้อสงสัยเกี่ยวกับข้อกำหนดและเงื่อนไขนี้ กรุณาติดต่อได้ที่ อีเมล: info@rtbpf.org
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
