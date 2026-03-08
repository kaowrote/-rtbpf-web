const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const languages = [
    { code: "th", name: "Thai", nativeName: "ไทย", isDefault: true, isActive: true },
    { code: "en", name: "English", nativeName: "English", isDefault: false, isActive: true },
    { code: "ko", name: "Korean", nativeName: "한국어", isDefault: false, isActive: true },
    { code: "ja", name: "Japanese", nativeName: "日本語", isDefault: false, isActive: true },
    { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", isDefault: false, isActive: true },
    { code: "fr", name: "French", nativeName: "Français", isDefault: false, isActive: true },
    { code: "de", name: "German", nativeName: "Deutsch", isDefault: false, isActive: true },
    { code: "es", name: "Spanish", nativeName: "Español", isDefault: false, isActive: true },
];

async function main() {
    console.log("Seeding languages...");
    for (const lang of languages) {
        await prisma.language.upsert({
            where: { code: lang.code },
            update: lang,
            create: lang,
        });
        console.log(`- Upserted language: ${lang.name} (${lang.code})`);
    }
    console.log("Done seeding languages.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
