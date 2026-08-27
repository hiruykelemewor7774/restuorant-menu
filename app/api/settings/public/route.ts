import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return NextResponse.json({
    success: true,
    settings: {
      restaurantName: settings.restaurantName,
      logoLight: settings.logoLight,
      logoDark: settings.logoDark,
      defaultLanguage: settings.defaultLanguage,
    },
  });
}