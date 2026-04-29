import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
