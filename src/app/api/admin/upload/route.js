import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin";
import crypto from "crypto";

export async function POST(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "portfolio";

    // Generate SHA-1 signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp);
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary REST API error:", data);
      return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ 
      url: data.secure_url,
      public_id: data.public_id 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
