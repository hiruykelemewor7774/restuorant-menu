import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ADMIN
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminAuth.upsert({
    where: { id: 1 }, // first admin; adjust if you already have rows
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
    },
  });
  console.log("✔ Admin created -> username: admin | password: admin123");

  // WAITER
  const waiterPassword = await bcrypt.hash("waiter123", 10);
  await prisma.waiter.upsert({
    where: { username: "waiter1" },
    update: {},
    create: {
      username: "waiter1",
      password: waiterPassword,
      fullName: "Waiter One",
    },
  });
  console.log("✔ Waiter created -> username: waiter1 | password: waiter123");

  // KITCHEN
  const kitchenPassword = await bcrypt.hash("kitchen123", 10);
  await prisma.kitchen.upsert({
    where: { username: "kitchen1" },
    update: {},
    create: {
      username: "kitchen1",
      password: kitchenPassword,
      fullName: "Kitchen One",
    },
  });
  console.log("✔ Kitchen created -> username: kitchen1 | password: kitchen123");

  // RECEPTIONIST
  const receptionistPassword = await bcrypt.hash("reception123", 10);

  await prisma.receptionist.upsert({
    where: { username: "reception1" },
    update: {},
    create: {
      username: "reception1",
      password: receptionistPassword,
      fullName: "Receptionist One",
    },
  });

  console.log(
    "✔ Receptionist created -> username: reception1 | password: reception123",
  );

  // STORE
    const storePassword = await bcrypt.hash("store123", 10);
    await prisma.storeAuth.upsert({
      where: { username: "store1" },
      update: {},
      create: {
        username: "store1",
        password: storePassword,
        fullName: "Store Keeper One",
      },
    });
    console.log("✔ Store created -> username: store1 | password: store123");
}
main()
   .then(async () => {
     await prisma.$disconnect();
   })
   .catch(async (e) => {
     console.error(e);
     await prisma.$disconnect();
     process.exit(1);
   });
