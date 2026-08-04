import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    // ከ .env ፋይል ውስጥ የ DATABASE_URL ዩአርኤልን ማንበብ
    const connection = await mysql.createConnection(process.env.DATABASE_URL || "");

    // የነበረውን አድሚን ማጥፋት
    await connection.execute("DELETE FROM AdminAuth");

    // ፓስወርዱን ማሸግ
    const hashedPassword = await bcrypt.hash("alemu@7774", 10);

    // አዲስ አድሚን ማስገባት (የሠንጠረዡን ስም ትክክለኛ የ Prisma ሞዴል ስም ያድርጉት፣ ለምሳሌ AdminAuth ወይም adminauth)
    await connection.execute(
      "INSERT INTO adminauth (username, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())",
      ["root", hashedPassword]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: "Admin created successfully using direct MySQL connection!", 
      credentials: { username: "root", password: "alemu@7774" } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}