import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  console.log("Seeding started...");

  // Optional: clear old users
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = [];

  for (let i = 1; i <= 1000; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@test.com`,
      password: hashedPassword,
      role: Role.USER,
    });
  }

  // Add admin
  users.push({
    name: "Admin",
    email: "admin@test.com",
    password: hashedPassword,
    role: Role.ADMIN,
  });

  // Add trainer
  users.push({
    name: "Trainer",
    email: "trainer@test.com",
    password: hashedPassword,
    role: Role.TRAINER,
  });

  await prisma.user.createMany({
    data: users,
  });

  console.log("1000+ users seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
