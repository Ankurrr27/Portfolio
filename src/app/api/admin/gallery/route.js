import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { items } = await request.json();
    
    // Simple approach: Delete all and recreate to preserve order
    await prisma.galleryItem.deleteMany();
    await prisma.galleryItem.createMany({
      data: items.map((item, index) => ({
        url: item.url,
        title: item.title || "",
        category: item.category || "",
        displayOrder: index
      }))
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery save error:", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
