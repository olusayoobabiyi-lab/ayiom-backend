import cloudinary from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * @param {Buffer} fileBuffer - The file data buffer.
 * @param {string} [folder="ayw"] - The folder path in Cloudinary.
 * @returns {Promise<{url: string, publicId: string}>}
 */
export function uploadToCloudinary(fileBuffer, folder = "ayw") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export { cloudinary };
