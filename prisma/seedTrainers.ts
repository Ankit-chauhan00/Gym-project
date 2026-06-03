import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const connectionString = process.env.DATABASE_URL!;


const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // admin credentials
  const adminEmail = "admin@test.com";
  const adminPassword = "123456";

  // create admin if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("✅ Admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }

  // seed 500 trainers
  for (let i = 0; i < 500; i++) {
    const email = `trainer${i + 1}@test.com`;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        trainerProfile: true,
      },
    });

    // if trainer already exists skip
    if (existingUser?.trainerProfile) {
      console.log(`⏭️ Trainer already exists: ${email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    // CASE 1:
    // user exists but not trainer
    if (existingUser) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          password: hashedPassword,
          image: faker.image.avatar(),
          role: Role.TRAINER,

          trainerProfile: {
            create: {
              experience: String(
                faker.number.int({
                  min: 1,
                  max: 15,
                })
              ),

              specialization: faker.helpers.arrayElement([
                "Weight Training",
                "Yoga",
                "Cardio",
                "Powerlifting",
                "Crossfit",
                "Calisthenics",
              ]),
            },
          },
        },
      });

      console.log(`✅ Existing user upgraded to trainer: ${email}`);

      continue;
    }

    // CASE 2:
    // neither exists
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email,
        password: hashedPassword,
        image: faker.image.avatar(),
        role: Role.TRAINER,

        trainerProfile: {
          create: {

            experience: String(
                faker.number.int({
                  min: 1,
                  max: 15,
                })
              ),

            specialization: faker.helpers.arrayElement([
              "Weight Training",
              "Yoga",
              "Cardio",
              "Powerlifting",
              "Crossfit",
              "Calisthenics",
            ]),
          },
        },
      },
    });

    console.log(`✅ Trainer created: ${email}`);
  }

  console.log("🎉 Seeding completed");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
