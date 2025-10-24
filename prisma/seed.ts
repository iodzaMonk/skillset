import { PrismaClient, Category } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import axios from "axios";

const prisma = new PrismaClient();

const USERS_COUNT = 20;
const POSTS_PER_USER = 5;

async function main() {
  faker.seed(2025);

  await prisma.$transaction([
    prisma.commands.deleteMany(),
    prisma.reviews.deleteMany(),
    prisma.posts.deleteMany(),
    prisma.users.deleteMany(),
  ]);
  // password hash
  const passwordHash = await bcrypt.hash("123", 10);

  // Helper to generate unique emails
  const generatedEmails = new Set<string>();
  function generateUniqueEmail() {
    let email: string;
    do {
      email = faker.internet.email({ provider: "example.com" }).toLowerCase();
    } while (generatedEmails.has(email));
    generatedEmails.add(email);
    return email;
  }

  const users = await Promise.all(
    Array.from({ length: USERS_COUNT }, () =>
      prisma.users.create({
        data: {
          email: generateUniqueEmail(),
          name: faker.person.fullName(),
          country: faker.location.countryCode().toUpperCase(),
          password: passwordHash,
          birthday: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
        },
      }),
    ),
  );

  const posts = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: POSTS_PER_USER }, () =>
        prisma.posts.create({
          data: {
            user_id: user.id,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: Number.parseFloat(
              faker.commerce.price({ min: 5, max: 250, dec: 2 }),
            ),
            category: faker.helpers.arrayElement(Object.values(Category)),
            date: faker.date.recent({ days: 45 }),
          },
        }),
      ),
    ),
  );

  const user1 = await prisma.users.upsert({
    where: { email: "user1@gmail.com" },
    update: {},
    create: {
      name: "User One",
      email: "user1@gmail.com",
      password: await bcrypt.hash("password1", 10),
      country: "US",
      birthday: new Date("1990-01-01"),
    },
  });
  const user2 = await prisma.users.upsert({
    where: { email: "user2@gmail.com" },
    update: {},
    create: {
      name: "User Two",
      email: "user2@gmail.com",
      password: await bcrypt.hash("password2", 10),
      country: "US",
      birthday: new Date("2990-02-02"),
    },
  });

  const post1 = await prisma.posts.create({
    data: {
      user_id: user1.id,
      title: "Sample Post 1",
      description: "This is a sample post created for testing purposes.",
      price: 49.99,
      category: Category.Editing,
      date: new Date(),
    },
  });

  const command1 = await prisma.commands.create({
    data: {
      client_id: user2.id,
      product_id: post1.id,
      date: new Date(),
      prof_id: user1.id,
      description: "I would like to order this service.",
    },
  });

  console.log(`Seeded ${users.length} users, ${posts.length} posts`);
}

main()
  .catch((error) => {
    console.error("Seeding error", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
