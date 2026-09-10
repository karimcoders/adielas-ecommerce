import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "duxdjykvk",
  api_key: process.env.CLOUDINARY_API_KEY || "624134863992136",
  api_secret: process.env.CLOUDINARY_API_SECRET || "bgfCG4y3PQsVT21PHafpQn0GCE4",
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder = "adielas-store"
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    if (typeof fileBuffer === "string" && (fileBuffer.startsWith("data:") || fileBuffer.startsWith("http"))) {
      cloudinary.uploader.upload(
        fileBuffer,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    }
  });
}

export default cloudinary;
