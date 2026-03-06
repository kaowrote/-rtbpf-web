import { PrismaClient, ArticleStatus, EventStatus, EventType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // 1. Seed Admin User
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@rtbpf.org" },
        update: {},
        create: {
            name: "Admin RTBPF",
            email: "admin@rtbpf.org",
            hashedPassword,
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            bio: "ผู้ดูแลระบบเว็บไซต์ RTBPF",
        },
    });
    console.log(`✅ Admin user seeded: ${admin.email}`);

    // 2. Seed Article Categories
    const categoryNews = await prisma.category.upsert({
        where: { slug: "news" },
        update: {},
        create: { name: "News", slug: "news", description: "ข่าวสารทั่วไป" },
    });
    const categoryPress = await prisma.category.upsert({
        where: { slug: "press-release" },
        update: {},
        create: { name: "Press Release", slug: "press-release", description: "ข่าวประชาสัมพันธ์" },
    });
    console.log("✅ Categories seeded.");

    // 3. Seed Articles
    await prisma.article.upsert({
        where: { slug: "nataraja-17-announcement" },
        update: {},
        create: {
            title: "เตรียมพบกับงานประกาศผลรางวัลนาฏราช ครั้งที่ 17 ยิ่งใหญ่กว่าที่เคย",
            slug: "nataraja-17-announcement",
            excerpt: "สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ เตรียมจัดการประกาศผลรางวัลนาฏราช ครั้งที่ 17 ประจำปี 2026",
            content: `<p>สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ เตรียมพร้อมนับถอยหลังสู่ค่ำคืนแห่งเกียรติยศที่ทุกคนรอคอย กับงานประกาศผลรางวัล <strong>"นาฏราช" ครั้งที่ 17 ประจำปี 2026</strong> งานประกาศรางวัลอันทรงเกียรติที่ได้รับการยอมรับสูงสุดในวงการวิทยุและโทรทัศน์ไทย</p><p>โดยในปีนี้จะจัดขึ้นอย่างตระการตา เพื่อเฉลิมฉลองและเชิดชูเกียรติแก่ผลงานทางวิทยุและรายการโทรทัศน์ รวมถึงผู้มีส่วนร่วมในวงการที่สร้างสรรค์ผลงานคุณภาพสู่สายตาผู้ชมตลอดปีที่ผ่านมา ผู้สนใจสามารถติดตามรายละเอียดการเสนอชื่อเข้าชิงได้เร็วๆ นี้</p>`,
            featuredImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop",
            status: ArticleStatus.PUBLISHED,
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            categoryId: categoryNews.id,
            authorId: admin.id,
            publisherId: admin.id,
        }
    });

    await prisma.article.upsert({
        where: { slug: "digital-media-ethics-workshop" },
        update: {},
        create: {
            title: "สมาพันธ์ฯ จัดอบรมจริยธรรมสื่อยุคดิจิทัล",
            slug: "digital-media-ethics-workshop",
            excerpt: "ร่วมก้าวทันความเปลี่ยนแปลงของเทคโนโลยีไปพร้อมกับการรักษาจริยธรรมวิชาชีพสื่อมวลชน",
            content: `<p>ท่ามกลางการเปลี่ยนแปลงอย่างรวดเร็วของเทคโนโลยีดิจิทัลและ AI สมาพันธ์ฯ ได้จัดกิจกรรมเวิร์คช็อปพิเศษเพื่อหารือและกำหนดทิศทางด้านจริยธรรมของสื่อมวลชนในยุคปัจจุบัน</p><p>งานนี้ได้รับความสนใจจากสื่อมวลชนทุกแขนงที่เข้าร่วมแลกเปลี่ยนความคิดเห็นและแนวทางการปฏิบัติงานเพื่อสังคม</p>`,
            featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
            status: ArticleStatus.PUBLISHED,
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
            categoryId: categoryPress.id,
            authorId: admin.id,
            publisherId: admin.id,
        }
    });
    console.log("✅ Articles seeded.");

    // 4. Seed Events
    await prisma.event.upsert({
        where: { slug: "nataraja-17-ceremony" },
        update: {},
        create: {
            title: "งานประกาศผลรางวัลนาฏราช ครั้งที่ 17",
            slug: "nataraja-17-ceremony",
            description: `<p>สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ ขอเชิญร่วมงานประกาศผลรางวัลนาฏราช ครั้งที่ 17 ประจำปี 2026 ซึ่งจะจัดขึ้น ณ หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย</p><p>งานนี้จะเป็นการรวมตัวของบุคลากรชั้นนำในวงการสื่อไทย ทั้งนักแสดง ผู้กำกับ โปรดิวเซอร์ และผู้สื่อข่าว เพื่อร่วมเฉลิมฉลองผลงานยอดเยี่ยมแห่งปี</p>`,
            startDate: new Date("2026-06-15T18:00:00Z"),
            eventType: EventType.AWARD_CEREMONY,
            status: EventStatus.OPEN_FOR_REGISTRATION,
            location: "หอประชุมใหญ่ ศูนย์วัฒนธรรมแห่งประเทศไทย",
            capacity: "2000",
            imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50a2df87?q=80&w=2670&auto=format&fit=crop"
        }
    });

    await prisma.event.upsert({
        where: { slug: "media-ethics-seminar" },
        update: {},
        create: {
            title: "สัมมนาเชิงปฏิบัติการ: จริยธรรมสื่อในยุคดิจิทัล",
            slug: "media-ethics-seminar",
            description: "<p>ร่วมถกปัญหาจริยธรรมในการทำงานสื่อ ตั้งแต่การตรวจสอบข้อมูล Deepfake ไปจนถึงความรับผิดชอบต่อสังคมของสื่อมวลชน</p>",
            startDate: new Date("2026-01-15T09:00:00Z"),
            eventType: EventType.SEMINAR,
            status: EventStatus.COMPLETED,
            location: "จุฬาลงกรณ์มหาวิทยาลัย",
            capacity: "200",
            imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop"
        }
    });
    console.log("✅ Events seeded.");

    // 5. Seed Awards Data (Years & Categories)
    const year2024 = await prisma.awardYear.upsert({
        where: { year: 2024 },
        update: {},
        create: { year: 2024, edition: 15 },
    });
    const year2023 = await prisma.awardYear.upsert({
        where: { year: 2023 },
        update: {},
        create: { year: 2023, edition: 14 },
    });

    // Award Categories
    const dummyCatId = `dummy-cat-id-${Date.now()}`;
    const bestDrama = await prisma.awardCategory.create({
        data: { name: "ละครยอดเยี่ยม", type: "TELEVISION" },
    });
    const bestActor = await prisma.awardCategory.create({
        data: { name: "นักแสดงนำชายยอดเยี่ยม", type: "TELEVISION" },
    });
    const bestActress = await prisma.awardCategory.create({
        data: { name: "นักแสดงนำหญิงยอดเยี่ยม", type: "TELEVISION" },
    });

    // Seed Nominees
    await prisma.awardNominee.create({
        data: {
            yearId: year2024.id,
            categoryId: bestDrama.id,
            nomineeName: "มาตาลดา",
            workTitle: "มาตาลดา",
            broadcastingChannel: "ช่อง 3 HD",
            isWinner: true,
            imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop"
        }
    });

    await prisma.awardNominee.create({
        data: {
            yearId: year2024.id,
            categoryId: bestActor.id,
            nomineeName: "ธนวรรธน์ วรรธนะภูติ",
            workTitle: "พรหมลิขิต",
            broadcastingChannel: "ช่อง 3 HD",
            isWinner: true,
            imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop"
        }
    });

    await prisma.awardNominee.create({
        data: {
            yearId: year2024.id,
            categoryId: bestActress.id,
            nomineeName: "แอน ทองประสม",
            workTitle: "เกมรักทรยศ",
            broadcastingChannel: "ช่อง 3 HD",
            isWinner: true,
            imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop"
        }
    });
    console.log("✅ Awards Data (Years, Categories, Nominees) seeded.");

    console.log("🎉 Seeding complete!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
