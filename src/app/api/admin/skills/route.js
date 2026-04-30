import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { domains } = await request.json();
    
    // Deduplicate domains by key to prevent unique constraint errors
    const uniqueDomains = Array.from(new Map(domains.map(d => [d.key, d])).values());
    
    // Clear and rebuild
    await prisma.skillItem.deleteMany();
    await prisma.skillDomain.deleteMany();
    
    for (const domain of uniqueDomains) {
      await prisma.skillDomain.create({
        data: {
          key: domain.key,
          title: domain.title,
          summary: domain.summary,
          displayOrder: domain.displayOrder,
          items: {
            create: domain.items.map(item => ({
              name: item.name,
              level: item.level,
              iconName: item.iconName,
              x: item.x,
              y: item.y
            }))
          }
        }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skills save error:", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
