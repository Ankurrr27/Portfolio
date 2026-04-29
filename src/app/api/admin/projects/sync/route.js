import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../../lib/admin";

export async function POST(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  try {
    const response = await fetch(`${origin}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "sync-github" }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Unable to sync projects from admin:", error);
    return NextResponse.json(
      { error: "Unable to sync GitHub projects." },
      { status: 500 }
    );
  }
}
