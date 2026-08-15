import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  const recipes = await prisma.recipe.findMany({
    include: { items: { include: { item: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, recipes });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;
  if (!payload) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { name, notes, items } = await req.json();

    if (!name || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Name and at least one item required" },
        { status: 400 },
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        notes: notes || null,
        items: {
          create: items.map((it: { itemId: string; quantity: number }) => ({
            itemId: it.itemId,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: { include: { item: true } } },
    });

    return NextResponse.json({ success: true, recipe });
  } catch (err) {
    console.error("Recipe create error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create recipe" },
      { status: 500 },
    );
  }
}
