import { NextResponse } from "next/server";
import { cloudinary, isCloudinaryConfigured } from "../../../../lib/cloudinary";

export async function POST(request) {
  try {
    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        { error: "Cloudinary environment variables are missing." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const folder =
      typeof body?.folder === "string" && body.folder
        ? body.folder
        : "portfolio/uploads";
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    console.error("Unable to generate Cloudinary signature:", error);
    return NextResponse.json(
      { error: "Unable to generate upload signature." },
      { status: 500 }
    );
  }
}
