import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function POST(request) {
  if (!process.env.ADMIN_PANEL_KEY) {
    return NextResponse.json(
      { error: "ADMIN_PANEL_KEY is not configured." },
      { status: 500 }
    );
  }

  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
