import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ education });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}
