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
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const path = typeof body?.path === "string" && body.path ? body.path : "/";
    const sessionId =
      typeof body?.sessionId === "string" && body.sessionId ? body.sessionId : null;
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

    return NextResponse.json({
      totalViews,
      source: "database",
    });
  } catch (error) {
    console.error("Unable to record view:", error);
    return NextResponse.json(
      { error: "Unable to record view." },
      { status: 500 }
    );
  }
}
