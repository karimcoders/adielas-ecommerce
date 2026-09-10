import crypto from "crypto";

/**
 * Minimal signed Cloudinary upload helper (no SDK dependency).
 * Uses CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 * (or a full CLOUDINARY_URL as fallback parse).
 */

function creds() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  let apiKey = process.env.CLOUDINARY_API_KEY || "";
  let apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL);
      apiKey = apiKey || parsed.username;
      apiSecret = apiSecret || parsed.password;
      cloudName = cloudName || parsed.hostname;
    } catch {
      /* ignore malformed CLOUDINARY_URL */
    }
  }

  return { cloudName, apiKey, apiSecret };
}

export function cloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = creds();
  return Boolean(cloudName && apiKey && apiSecret);
}

export type UploadResult = {
  ok: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};

/**
 * Upload an image buffer to Cloudinary (signed upload, folder: adielas).
 */
export async function uploadImage(
  file: File,
  folder = "adielas",
): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret } = creds();
  if (!cloudName || !apiKey || !apiSecret) {
    return { ok: false, error: "Cloudinary is not configured (missing env vars)." };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form },
    );
    const data = (await res.json()) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };

    if (!res.ok || !data.secure_url) {
      return {
        ok: false,
        error: data.error?.message ?? `Cloudinary upload failed (${res.status}).`,
      };
    }

    return { ok: true, url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return { ok: false, error: message };
  }
}
