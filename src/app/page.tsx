import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, PlayCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* FEATURED STORY / HERO SECTION */}
      <section className="relative w-full h-[80vh] md:h-[90vh] bg-black overflow-hidden flex items-end pb-16 md:pb-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2670&auto=format&fit=crop"
            alt="Hero featured"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-4xl space-y-4">
            <Badge className="bg-accent text-black hover:bg-accent/90 uppercase tracking-widest font-sans font-bold px-3 py-1 rounded-none text-xs">
              Feature Story
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-thai text-white leading-[1.1] tracking-tight hover:text-accent transition-colors duration-300 cursor-pointer">
              ประกาศผลรางวัลนาฏราช ครั้งที่ 16: รางวัลแห่งความภาคภูมิใจ
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl font-thai leading-relaxed">
              ร่วมชื่นชมและแสดงความยินดีกับผลงานยอดเยี่ยมแห่งปี ในงานประกาศผลรางวัลที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย
            </p>
            <div className="pt-6">
              <Button size="lg" className="bg-accent text-black hover:bg-white hover:text-black font-thai text-lg h-12 rounded-none px-8 font-semibold transition-all duration-300">
                อ่านเรื่องราวฉบับเต็ม
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT NEWS / EDITORIAL GRID */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="container px-6 mx-auto">
          <div className="flex justify-between items-end mb-10 border-b-2 border-black dark:border-white pb-4">
            <h2 className="text-3xl md:text-5xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">
              Latest News
            </h2>
            <Link href="/news" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
              View All News <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Top Featured Left - Takes 8 columns */}
            <div className="col-span-1 md:col-span-8 group cursor-pointer">
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1516280440502-a2fe4df5c58a?q=80&w=2670&auto=format&fit=crop"
                  alt="News highlight"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
              <p className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Awards</p>
              <h3 className="text-3xl font-bold font-thai text-black dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors leading-tight mb-3">
                10 รายการโทรทัศน์ที่เข้าชิงสาขารายการวาไรตี้ยอดเยี่ยม
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-thai text-lg line-clamp-2">
                เปิดโผรายการโทรทัศน์ที่เรียกเสียงหัวเราะและสาระให้กับผู้ชมตลอดปีที่ผ่านมา ใครจะเป็นผู้คว้าชัยในปีนี้ มาร่วมลุ้นไปพร้อมกัน.
              </p>
            </div>

            {/* Right Side News List - Takes 4 columns */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3">
                  <Image
                    src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1200&auto=format&fit=crop"
                    alt="News 2"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="text-white w-12 h-12" />
                  </div>
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Video</p>
                <h4 className="text-xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug">
                  สัมภาษณ์พิเศษ: เบื้องหลังความสำเร็จของผู้กำกับยอดเยี่ยม
                </h4>
              </div>

              <div className="group cursor-pointer border-t border-gray-200 dark:border-zinc-800 pt-6">
                <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-1">Foundation</p>
                <h4 className="text-lg font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug">
                  RTBPF จัดกิจกรรมสัมมนา &quot;อนาคตสื่อดิจิทัลไทย&quot;
                </h4>
                <p className="text-gray-600 dark:text-gray-400 font-thai text-sm mt-2 line-clamp-2">
                  งานสัมมนาประจำปีเพื่อยกระดับมาตรฐานสื่อไทย สู่การแข่งขันในเวทีระดับโลก นำโดยผู้ทรงคุณวุฒิระดับประเทศ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medium Cards Row (Added per request) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-zinc-800">
          <div className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop"
                alt="Medium News 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans">
                News
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug mb-3">
              สมาพันธ์สมาคมวิชาชีพฯ จัดเสวนาทิศทางสื่อไทยในยุคดิจิทัล
            </h4>
            <p className="text-gray-600 dark:text-gray-400 font-thai text-sm leading-relaxed line-clamp-2">
              ร่วมกันค้นหาทางออกและปรับตัวกับความเปลี่ยนแปลงของเทคโนโลยีที่มีต่ออุตสาหกรรม
            </p>
          </div>

          <div className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop"
                alt="Medium News 2"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans">
                Interview
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug mb-3">
              ก้าวต่อไปของ &apos;นาฏราช&apos; สู่มาตรฐานสากล
            </h4>
            <p className="text-gray-600 dark:text-gray-400 font-thai text-sm leading-relaxed line-clamp-2">
              เปิดวิสัยทัศน์คณะกรรมการจัดงาน กับการตั้งเป้าหมายยกระดับรางวัลเทียบชั้นเอ็มมีอวอร์ดส์
            </p>
          </div>

          <div className="group cursor-pointer flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2670&auto=format&fit=crop"
                alt="Medium News 3"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans">
                Events
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug mb-3">
              อบรมเชิงปฏิบัติการ ผู้ผลิตรายการโทรทัศน์ยุคใหม่
            </h4>
            <p className="text-gray-600 dark:text-gray-400 font-thai text-sm leading-relaxed line-clamp-2">
              เปิดรับสมัครผู้ที่สนใจเข้าร่วมอบรมฟรี จำนวนจำกัด 50 ท่านเท่านั้น
            </p>
          </div>
        </div>
      </section>

      {/* AWARDS DATABASE / MULTIMEDIA STRIP (Dark Section) */}
      <section className="w-full py-20 bg-[#111] text-white">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-thai tracking-tight mb-4">
              Nataraja Awards Database
            </h2>
            <p className="text-gray-400 font-thai text-lg">
              สำรวจผลงานคุณภาพและผู้ที่ได้รับรางวัลอันทรงเกียรติตั้งแต่ครั้งแรกจนถึงปัจจุบัน
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[2025, 2024, 2023, 2022].map((year) => (
              <div key={year} className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-gray-900 flex items-center justify-center">
                <Image
                  src={`https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800&blur=20`}
                  alt={`Awards ${year}`}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-white/10 group-hover:border-accent/50 transition-colors m-4"></div>
                <div className="relative z-10 text-center">
                  <span className="block text-accent font-bold text-sm tracking-[0.3em] uppercase mb-2">Awards</span>
                  <span className="text-5xl font-bold text-white group-hover:text-accent transition-colors">{year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-8 border-2 bg-transparent transition-all duration-300">
              Browse Full Database
            </Button>
          </div>
        </div>
      </section>

      {/* THREE PILLAR CARDS (TV Academy Style: Features, Awards, Foundation) */}
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white dark:bg-[#0a0a0a] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-shadow duration-300">
              <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-8">
                <span className="font-bold text-xl font-serif">A</span>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide text-black dark:text-white mb-4">The Academy</h3>
              <p className="text-gray-600 dark:text-gray-400 font-thai mb-8 leading-relaxed">
                สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ แหล่งศูนย์รวมของบุคลากรคุณภาพในแวดวงสื่อสร้างสรรค์
              </p>
              <Link href="/about" className="inline-flex items-center text-accent font-bold hover:text-black dark:hover:text-white transition-colors uppercase text-sm tracking-wider">
                About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#0a0a0a] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-shadow duration-300">
              <div className="w-12 h-12 bg-accent text-black flex items-center justify-center mb-8">
                <span className="font-bold text-xl font-serif">N</span>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide text-black dark:text-white mb-4">Nataraja</h3>
              <p className="text-gray-600 dark:text-gray-400 font-thai mb-8 leading-relaxed">
                รางวัลเชิดชูเกียรติสูงสุด ที่เปรียบเสมือนเครื่องหมายการันตีคุณภาพของผลงานและบุคลากรในวงการสื่อไทย
              </p>
              <Link href="/awards" className="inline-flex items-center text-accent font-bold hover:text-black dark:hover:text-white transition-colors uppercase text-sm tracking-wider">
                The Awards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#0a0a0a] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#1B2A4A] dark:bg-[#1f2b46] text-white flex items-center justify-center mb-8">
                <span className="font-bold text-xl font-serif">E</span>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide text-black dark:text-white mb-4">Events</h3>
              <p className="text-gray-600 dark:text-gray-400 font-thai mb-8 leading-relaxed">
                ติดตามข่าวสารและเข้าร่วมกิจกรรม โครงการอบรม สัมมนา ที่จัดขึ้นเพื่อพัฒนาศักยภาพผู้ปฏิบัติงานในวงการสื่อ
              </p>
              <Link href="/events" className="inline-flex items-center text-accent font-bold hover:text-black dark:hover:text-white transition-colors uppercase text-sm tracking-wider">
                All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="w-full py-20 bg-accent text-black text-center">
        <div className="container px-6 mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4">Stay Connected</h2>
          <p className="text-black/80 font-thai text-lg mb-8">
            ลงทะเบียนเพื่อรับข่าวสาร บทความพิเศษ และอัปเดตงานประกาศรางวัลนาฏราชก่อนใคร
          </p>
          <form className="flex flex-col sm:flex-row gap-0 justify-center w-full max-w-lg mx-auto shadow-2xl">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 px-6 w-full sm:w-2/3 bg-white dark:bg-[#0a0a0a] text-black dark:text-white focus:outline-none rounded-none font-sans border-0 dark:border dark:border-accent"
            />
            <Button className="h-14 w-full sm:w-1/3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-none font-bold uppercase tracking-wider">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
