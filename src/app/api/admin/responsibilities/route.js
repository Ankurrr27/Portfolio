import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const responsibilities = await prisma.responsibility.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return NextResponse.json({ responsibilities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch responsibilities" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { responsibilities } = await request.json();

    // In MongoDB with Prisma, we usually do this via multiple operations or a transaction
    // For simplicity, we'll delete and recreate or update individually
    
    // 1. Get all existing IDs to handle deletions if necessary, 
    // but for this simple implementation, we'll assume the list provided is the full truth.
    
    // Use a transaction for reliability
    await prisma.$transaction(async (tx) => {
      // Clear existing (optional, but ensures order and deletions are handled)
      await tx.responsibility.deleteMany({});
      
      // Re-create with new data and order
      for (let i = 0; i < responsibilities.length; i++) {
        const { id, ...data } = responsibilities[i];
        await tx.responsibility.create({
          data: {
            ...data,
            displayOrder: i,
            // Ensure roles is properly handled as Json
            roles: Array.isArray(data.roles) ? data.roles : []
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Responsibilities PUT Error:", error);
    return NextResponse.json({ error: "Failed to update responsibilities" }, { status: 500 });
  }
}
