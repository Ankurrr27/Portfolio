import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";
import { z } from "zod";

const skillItemSchema = z.object({
  name: z.string().min(1),
  level: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  x: z.number().optional().nullable(),
  y: z.number().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
});

const domainSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional().nullable(),
  displayOrder: z.number(),
  items: z.array(skillItemSchema),
});

const putPayloadSchema = z.object({
  domains: z.array(domainSchema),
});

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
    const jsonBody = await request.json();
    const { domains } = putPayloadSchema.parse(jsonBody);
    
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
              logoUrl: item.logoUrl,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
