import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        hashedPassword,
        role: "ADMIN",
        status: "ACTIVE"
      },
      create: {
        name,
        email,
        hashedPassword,
        role: "ADMIN",
        status: "ACTIVE"
      }
    });
    console.log(`✅ User ${name} (${email}) created/updated successfully.`);
  } catch (error) {
    console.error(`❌ Error creating user ${name}:`, error);
  }
}

async function main() {
  await createAdmin("Admin1", "admin1@rtbpf.com", "rtbpf1");
  await createAdmin("Admin2", "admin2@rtbpf.com", "rtbpf2");
  await createAdmin("Admin3", "admin3@rtbpf.com", "rtbpf3");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
