import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "adielas-products";

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
      });
    } else {
      // JSON body with base64 dataUrl or image link
      const body = await req.json();
      const { image, folder = "adielas-store" } = body;

      if (!image) {
        return NextResponse.json({ error: "Image data is required" }, { status: 400 });
      }

      const result = await uploadToCloudinary(image, folder);
      return NextResponse.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
      });
    }
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload to Cloudinary" },
      { status: 500 }
    );
  }
}
