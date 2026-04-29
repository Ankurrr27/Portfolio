import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const domains = await prisma.skillDomain.findMany({
      include: { items: true },
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ domains });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
