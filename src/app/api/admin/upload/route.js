import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const aspectRatio = formData.get("aspectRatio") || "16:9";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType = file.type || "image/jpeg";
    const dataURI = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "portfolio",
      timeout: 120000
    });

    return NextResponse.json({ 
      url: result.secure_url,
      public_id: result.public_id 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
