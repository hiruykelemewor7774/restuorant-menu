import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const [username, password, fullName] = process.argv.slice(2);

  if (!username || !password) {
    console.error('አጠቃቀም: npx tsx scripts/create-kitchen.ts <username> <password> "<fullName>"');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const kitchen = await prisma.kitchen.create({
    data: { username, password: hashed, fullName: fullName || null },
  });

  console.log("Kitchen account ተፈጥሯል:", { id: kitchen.id, username: kitchen.username });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});