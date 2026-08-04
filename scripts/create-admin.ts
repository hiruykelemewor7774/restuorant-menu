import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error("አጠቃቀም: npx tsx scripts/create-admin.ts <username> <password>");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.adminAuth.create({
    data: { username, password: hashed },
  });

  console.log("Admin ተፈጥሯል:", { id: admin.id, username: admin.username });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});