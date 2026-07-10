import { deleteFromR2 } from "../config/r2.js";

/**
 * Extracts the R2 object key from a public URL.
 * Returns null if the URL is not hosted on our R2 bucket.
 * @param {string} url - The public URL of the asset
 * @returns {string|null} - The key or null
 */
export function getKeyFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    // Check if the domain matches R2 public dev URL suffix or custom R2 paths
    if (parsed.hostname.endsWith(".r2.dev") || parsed.hostname.endsWith("cloudflarestorage.com")) {
      // Decode URI components to handle spaces/special characters
      return decodeURIComponent(parsed.pathname.slice(1));
    }
  } catch {
    // Not a valid URL, ignore
  }
  return null;
}

/**
 * Deletes a file from R2 based on its public URL.
 * @param {string} url - The public URL of the asset
 */
export async function deleteFileByUrl(url) {
  const key = getKeyFromUrl(url);
  if (key) {
    try {
      await deleteFromR2(key);
      console.log(`Deleted file from R2: ${key}`);
    } catch (err) {
      console.error(`Failed to delete file from R2: ${key}`, err);
    }
  }
}

/**
 * Deletes multiple files from R2 based on their public URLs.
 * @param {string[]} urls - Array of public URLs of the assets
 */
export async function deleteFilesByUrls(urls) {
  if (!urls || !Array.isArray(urls)) return;
  for (const url of urls) {
    await deleteFileByUrl(url);
  }
}
