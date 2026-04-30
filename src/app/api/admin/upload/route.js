import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin";
import { cloudinary, isCloudinaryConfigured } from "../../../../lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 45_000;
const RETRY_DELAYS_MS = [0, 1000, 2500];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    upload.end(buffer);
  });
}

async function uploadWithRetry(buffer) {
  let lastError;

  for (const [attempt, delay] of RETRY_DELAYS_MS.entries()) {
    if (delay) await sleep(delay);

    try {
      return await uploadToCloudinary(buffer, {
        folder: "portfolio",
        resource_type: "image",
        timeout: UPLOAD_TIMEOUT_MS,
      });
    } catch (error) {
      lastError = error;
      console.warn(`Cloudinary upload attempt ${attempt + 1} failed`, {
        message: error.message,
        http_code: error.http_code,
        name: error.name,
      });
    }
  }

  throw lastError;
}

function getUploadErrorMessage(error) {
  const message = error?.message || "";

  if (
    message.toLowerCase().includes("timeout") ||
    error?.code === "UND_ERR_CONNECT_TIMEOUT" ||
    error?.name === "TimeoutError"
  ) {
    return "Cloudinary upload timed out. Check your internet/VPN/firewall and try again.";
  }

  if (error?.http_code === 401) {
    return "Cloudinary rejected the upload credentials.";
  }

  if (error?.http_code === 400) {
    return error.message || "Cloudinary rejected this image.";
  }

  return "Upload failed";
}

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

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Image must be smaller than 8 MB" }, { status: 400 });
    }

    if (!isCloudinaryConfigured) {
      console.error("Cloudinary credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await uploadWithRetry(buffer);

    return NextResponse.json({ 
      url: data.secure_url,
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: getUploadErrorMessage(error) }, { status: 500 });
  }
}
