import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "../../../lib/prisma";

function hashIp(value) {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex");
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        totalViews: 0,
        source: "unconfigured",
      });
    }

    const totalViews = await prisma.siteView.count();
    return NextResponse.json({
      totalViews,
      source: "database",
    });
  } catch (error) {
    console.error("Unable to read views:", error);
    return NextResponse.json(
      {
        totalViews: 0,
        source: "error",
      },
      { status: 200 }
    );
  }
}

export async function POST(request) {
  try {
    // Ensure the database URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is missing." }, { status: 500 });
    }

    // Verify Prisma can connect – if not, fallback gracefully
    try {
      await prisma.$connect();
    } catch (connErr) {
      console.warn('Prisma connection failed, skipping view recording:', connErr);
      const totalViews = await prisma.siteView.count().catch(() => 0);
      return NextResponse.json({ totalViews, source: 'fallback' });
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      // ignore JSON parse errors
    }
    const path = typeof body?.path === "string" && body.path ? body.path : "/";
    const sessionId = typeof body?.sessionId === "string" && body.sessionId ? body.sessionId : null;
    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;

    await prisma.siteView.create({
      data: {
        path,
        sessionId,
        userAgent,
        referrer,
        ipHash: hashIp(ipAddress),
      },
    });

    const totalViews = await prisma.siteView.count();
    return NextResponse.json({ totalViews, source: "database" });
  } catch (error) {
    console.error("Unable to record view:", error);
    return NextResponse.json({ error: "Unable to record view." }, { status: 500 });
  }
}
