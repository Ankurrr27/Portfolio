import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const education = await prisma.education.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ education });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { education } = body;

    await prisma.$transaction(async (tx) => {
      await tx.education.deleteMany();
      for (const item of education) {
        const { id, ...data } = item;
        await tx.education.create({ data });
      }
    });

    const updated = await prisma.education.findMany({
      orderBy: { displayOrder: "asc" }
    });

    return NextResponse.json({ education: updated });
  } catch (error) {
    console.error("Education update error:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}
