import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, PlayCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache 60 seconds

export default async function Home() {
  // Fetch real data from the database
  const latestArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { category: true }
  });

  const upcomingEvents = await prisma.event.findMany({
    where: { status: "UPCOMING" },
    orderBy: { startDate: "asc" },
    take: 3
  });

  const featuredArticle = latestArticles[0];
  const sideArticles = latestArticles.slice(1, 4);

  const defaultHeroImage = "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2670&auto=format&fit=crop";
  const defaultArticleImage = "https://images.unsplash.com/photo-1516280440502-a2fe4df5c58a?q=80&w=2670&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* FEATURED STORY / HERO SECTION */}
      <section className="relative w-full h-[80vh] md:h-[90vh] bg-black overflow-hidden flex items-end pb-16 md:pb-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={featuredArticle?.featuredImage || defaultHeroImage}
            alt="Hero featured"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-4xl space-y-4">
            <Badge className="bg-accent text-black hover:bg-accent/90 uppercase tracking-widest font-sans font-bold px-3 py-1 rounded-none text-xs">
              {featuredArticle?.category?.name || "Feature Story"}
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-thai text-white leading-[1.1] tracking-tight hover:text-accent transition-colors duration-300">
              {featuredArticle?.title || "ประกาศผลรางวัลนาฏราช ครั้งที่ 16: รางวัลแห่งความภาคภูมิใจ"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl font-thai leading-relaxed line-clamp-2">
              {featuredArticle?.excerpt || "ร่วมชื่นชมและแสดงความยินดีกับผลงานยอดเยี่ยมแห่งปี ในงานประกาศผลรางวัลที่ยิ่งใหญ่ที่สุดของวงการวิทยุและโทรทัศน์ไทย"}
            </p>
            <div className="pt-6">
              <Link href={featuredArticle ? `/articles/${featuredArticle.slug}` : "/articles"}>
                <Button size="lg" className="bg-accent text-black hover:bg-white hover:text-black font-thai text-lg h-12 rounded-none px-8 font-semibold transition-all duration-300">
                  อ่านเรื่องราวฉบับเต็ม
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT NEWS SECTION */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative">
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex justify-between items-end mb-10 border-b-2 border-black dark:border-zinc-800 pb-4">
            <h2 className="text-3xl md:text-5xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">
              Latest News
            </h2>
            <Link href="/articles" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
              View All News <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Top Featured Left - Takes 8 columns (Uses the 2nd latest article) */}
            {sideArticles.length > 0 && (
              <div className="col-span-1 md:col-span-8 group cursor-pointer">
                <Link href={`/articles/${sideArticles[0].slug}`}>
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-4 xl:rounded-xl">
                    <Image
                      src={sideArticles[0].featuredImage || defaultArticleImage}
                      alt={sideArticles[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <p className="text-accent font-bold uppercase tracking-widest text-xs mb-2">
                    {sideArticles[0].category?.name || "News"}
                  </p>
                  <h3 className="text-3xl font-bold font-thai text-black dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors leading-tight mb-3">
                    {sideArticles[0].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-thai text-lg line-clamp-2">
                    {sideArticles[0].excerpt}
                  </p>
                </Link>
              </div>
            )}

            {/* Right Side News List - Takes 4 columns */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
              {sideArticles.slice(1).map((article, idx) => (
                <div key={article.id} className={`group cursor-pointer ${idx > 0 && 'border-t border-gray-200 dark:border-zinc-800 pt-6'}`}>
                  <Link href={`/articles/${article.slug}`}>
                    {idx === 0 && (
                      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3 xl:rounded-xl">
                        <Image
                          src={article.featuredImage || defaultArticleImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                      </div>
                    )}
                    <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-1">
                      {article.category?.name || "News"}
                    </p>
                    <h4 className="text-xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug">
                      {article.title}
                    </h4>
                    {idx > 0 && (
                      <p className="text-gray-600 dark:text-gray-400 font-thai text-sm mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC UPCOMING EVENTS GRID */}
      {upcomingEvents.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
          <div className="container px-6 mx-auto">
            <div className="flex justify-between items-end mb-10 border-b-2 border-black dark:border-zinc-800 pb-4">
              <h2 className="text-3xl md:text-5xl font-bold font-thai tracking-tight text-black dark:text-white uppercase">
                Upcoming Events
              </h2>
              <Link href="/events" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
                All Events <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const eventDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(event.startDate);
                return (
                  <Link href={`/events/${event.slug}`} key={event.id} className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-sm transition-shadow duration-300 hover:shadow-xl xl:rounded-xl overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <Image
                        src={event.imageUrl || defaultArticleImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest font-sans rounded">
                        {new Date(event.startDate).getDate()} {new Date(event.startDate).toLocaleString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold font-thai text-black dark:text-white group-hover:text-accent transition-colors leading-snug mb-4">
                        {event.title}
                      </h4>
                      <div className="mt-auto space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-accent" />
                          <span>{eventDate}</span>
                        </div>
                        {event.venue && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-accent" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* AWARDS DATABASE / MULTIMEDIA STRIP (Dark Section) */}
      <section className="w-full py-20 bg-[#111] text-white">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-thai tracking-tight mb-4 text-accent">
              Nataraja Awards Database
            </h2>
            <p className="text-gray-400 font-thai text-lg">
              สำรวจผลงานคุณภาพและผู้ที่ได้รับรางวัลอันทรงเกียรติตั้งแต่ครั้งแรกจนถึงปัจจุบัน
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[2025, 2024, 2023, 2022].map((year) => (
              <Link href={`/awards?year=${year}`} key={year}>
                <div className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-gray-900 flex items-center justify-center xl:rounded-xl">
                  <Image
                    src={`https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=800&blur=20`}
                    alt={`Awards ${year}`}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 border border-white/10 group-hover:border-accent/50 transition-colors m-4 rounded-xl"></div>
                  <div className="relative z-10 text-center">
                    <span className="block text-accent font-bold text-sm tracking-[0.3em] uppercase mb-2">Awards</span>
                    <span className="text-5xl font-bold text-white group-hover:text-accent transition-colors">{year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/awards">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-black font-semibold uppercase tracking-widest text-sm rounded-none h-14 px-8 border-2 bg-transparent transition-all duration-300">
                Browse Full Database
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* THREE PILLAR CARDS (TV Academy Style: Features, Awards, Foundation) */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 dark:bg-zinc-900 p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-shadow duration-300 xl:rounded-2xl">
              <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-8 rounded-full">
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
            <div className="bg-gray-50 dark:bg-zinc-900 p-10 border border-gray-100 dark:border-zinc-800 shadow-sm transition-shadow duration-300 xl:rounded-2xl">
              <div className="w-12 h-12 bg-accent text-black flex items-center justify-center mb-8 rounded-full">
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
            <div className="bg-gray-50 dark:bg-zinc-900 p-10 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-shadow duration-300 xl:rounded-2xl">
              <div className="w-12 h-12 bg-[#1B2A4A] dark:bg-[#1f2b46] text-white flex items-center justify-center mb-8 rounded-full">
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
      <section className="w-full py-24 bg-accent text-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay"></div>
        <div className="container px-6 mx-auto max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4 font-serif">Stay Connected</h2>
          <p className="text-black/80 font-thai text-lg mb-8 font-medium">
            ลงทะเบียนเพื่อรับข่าวสาร บทความพิเศษ และอัปเดตงานประกาศรางวัลนาฏราชก่อนใคร
          </p>
          <form className="flex flex-col sm:flex-row gap-0 justify-center w-full max-w-lg mx-auto shadow-2xl xl:rounded-xl overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 px-6 w-full sm:w-2/3 bg-white dark:bg-[#0a0a0a] text-black dark:text-white focus:outline-none rounded-none font-sans border-0"
            />
            <Button className="h-14 w-full sm:w-1/3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-none font-bold uppercase tracking-wider transition-colors">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
