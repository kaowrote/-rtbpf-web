import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding admin user...");

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

    console.log(`✅ Admin user seeded: ${admin.email} (${admin.role})`);
    console.log(`   Login: admin@rtbpf.org / admin123`);
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
