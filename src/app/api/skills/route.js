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

export async function PATCH(request) {
  try {
    const { items } = await request.json();
    
    // Bulk update positions
    const updates = items.map(item => 
      prisma.skillItem.update({
        where: { id: item.id },
        data: { x: item.x, y: item.y }
      })
    );
    
    await Promise.all(updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skills PATCH error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
