import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const responsibilities = await prisma.responsibility.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" }
      ]
    });
    return NextResponse.json({ responsibilities });
  } catch (error) {
    console.error("API Responsibilities Error:", error);
    return NextResponse.json({ error: "Failed to fetch responsibilities" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { organization, period, roles, logoUrl, displayOrder, featured } = body;
    
    const responsibility = await prisma.responsibility.create({
      data: {
        organization,
        period,
        roles, // This is expected to be a JSON array
        logoUrl,
        displayOrder: displayOrder || 0,
        featured: featured !== undefined ? featured : true
      }
    });
    
    return NextResponse.json({ responsibility });
  } catch (error) {
    console.error("API Responsibilities POST Error:", error);
    return NextResponse.json({ error: "Failed to create responsibility" }, { status: 500 });
  }
}
