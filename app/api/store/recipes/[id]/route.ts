import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/store-admin-guard";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 403 },
    );
  }

  const { id } = await params;

  try {
    await prisma.recipe.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Recipe delete error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 },
    );
  }
}
