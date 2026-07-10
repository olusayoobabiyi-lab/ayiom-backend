import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env.js";

const r2 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a buffer file to Cloudflare R2
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @param {string} key - Unique key/filename in the bucket
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadToR2(fileBuffer, mimeType, key) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await r2.send(command);

  // Format public URL
  const publicUrlBase = env.R2_PUBLIC_URL.endsWith("/")
    ? env.R2_PUBLIC_URL
    : `${env.R2_PUBLIC_URL}/`;
  return `${publicUrlBase}${key}`;
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} key
 */
export async function deleteFromR2(key) {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });

  await r2.send(command);
}

export { r2 };
