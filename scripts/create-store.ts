import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const [username, password, fullName] = process.argv.slice(2);
  if (!username || !password) {
    console.error(
      'አጠቃቀም: npx tsx scripts/create-store.ts <username> <password> "<fullName>"',
    );
    process.exit(1);
  }
  const hashed = await bcrypt.hash(password, 10);
  const store = await prisma.storeAuth.create({
    data: { username, password: hashed, fullName: fullName || null },
  });
  console.log("Store staff ተፈጥሯል:", { id: store.id, username: store.username });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
