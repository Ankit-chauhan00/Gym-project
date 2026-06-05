// prisma/seedProducts.ts

import "dotenv/config";

import {
  PrismaClient,
  Category,
  ProductType,
} from "@prisma/client";

import { PrismaPg as PgAdapter } from "@prisma/adapter-pg";

import { faker } from "@faker-js/faker";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PgAdapter({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const productTypes: ProductType[] = [
  "WHEY_PROTEIN",
  "MASS_GAINER",
  "PREWORKOUT",
  "CREATINE",
  "BCAA",
  "MULTIVITAMIN",
  "FISH_OIL",
  "SHAKER",
  "GYM_GLOVES",
  "RESISTANCE_BAND",
  "DUMBBELL",
];

function getCategory(type: ProductType): Category {
  if (
    [
      "WHEY_PROTEIN",
      "MASS_GAINER",
      "PREWORKOUT",
      "CREATINE",
      "BCAA",
      "MULTIVITAMIN",
      "FISH_OIL",
    ].includes(type)
  ) {
    return "SUPPLEMENTS";
  }

  if (
    ["RESISTANCE_BAND", "DUMBBELL"].includes(type)
  ) {
    return "EQUIPMENTS";
  }

  return "ACCESSORIES";
}

function randomImages(seed: number) {
  return [
    `https://picsum.photos/seed/${seed}-1/900/900`,
    `https://picsum.photos/seed/${seed}-2/900/900`,
    `https://picsum.photos/seed/${seed}-3/900/900`,
    `https://picsum.photos/seed/${seed}-4/900/900`,
  ];
}

async function main() {
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (!admin) {
    throw new Error("No admin found");
  }

  for (let i = 1; i <= 200; i++) {
    const type = faker.helpers.arrayElement(productTypes);

    const category = getCategory(type);

    const title = `${faker.company.name()} ${type.replaceAll("_", " ")} ${i}`;

    // CHECK EXISTING PRODUCT
    const existingProduct = await prisma.product.findFirst({
      where: {
        title,
      },
    });

    if (existingProduct) {
      console.log(`⏭️ Product already exists: ${title}`);
      continue;
    }

    // CREATE PRODUCT
    await prisma.product.create({
      data: {
        title,

        description: faker.commerce.productDescription(),

        price: Number(
          faker.commerce.price({
            min: 500,
            max: 15000,
          })
        ),

        stock: faker.number.int({
          min: 10,
          max: 200,
        }),

        category,

        productType: type,

        modelUrl:
          i % 5 === 0
            ? "https://example.com/models/sample.glb"
            : "",

        CreatedByAdmin: {
          connect: {
            id: admin.id,
          },
        },

        images: {
          create: randomImages(i).map((url) => ({
            imageUrl: url,
          })),
        },
      },
    });

    console.log(`✅ Product created: ${title}`);
  }

  console.log("🔥 200 products seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });