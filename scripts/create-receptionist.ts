import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const [username, password, fullName] = process.argv.slice(2);

  if (!username || !password) {
    console.error(
      'አጠቃቀም: npx tsx scripts/create-receptionist.ts <username> <password> "<fullName>"',
    );
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const receptionist = await prisma.receptionist.create({
    data: { username, password: hashed, fullName: fullName || null },
  });

  console.log("Receptionist ተፈጥሯል:", {
    id: receptionist.id,
    username: receptionist.username,
  });
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
